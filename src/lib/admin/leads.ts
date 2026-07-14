import { getPool } from "@/lib/db/postgres";

/**
 * Admin lead queries (Phase 33D, upgraded to a working CRM in 36A).
 *
 * Server Components read PostgreSQL directly — there is no /api/admin layer,
 * because there is no second consumer of one, and every public endpoint that
 * returns lead data is one more thing that has to be got right forever.
 *
 * Every value is a bound parameter. The only identifiers that reach SQL as text
 * are sort/filter keys chosen from closed sets defined here, never from the
 * query string.
 */

/* ------------------------------- pipeline -------------------------------- */

export const LEAD_STATUSES = [
  "new",
  "read",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "archived",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** The stages that mean "still in play" — everything the owner owes a reply to. */
export const OPEN_STATUSES: LeadStatus[] = [
  "new",
  "read",
  "contacted",
  "qualified",
  "proposal_sent",
];

/** Sales stages, in order. `archived` is storage, not a stage — it sits apart. */
export const PIPELINE: LeadStatus[] = [
  "new",
  "read",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Yeni",
  read: "Okundu",
  contacted: "İletişime geçildi",
  qualified: "Nitelikli",
  proposal_sent: "Teklif gönderildi",
  won: "Kazanıldı",
  lost: "Kaybedildi",
  archived: "Arşivlendi",
};

export const PRIORITIES = ["low", "normal", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Düşük",
  normal: "Normal",
  high: "Yüksek",
};

export const NOTE_TYPES = [
  "note",
  "call",
  "whatsapp",
  "email",
  "status_change",
  "follow_up",
  "system",
] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const NOTE_TYPE_LABEL: Record<NoteType, string> = {
  note: "Not",
  call: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-posta",
  status_change: "Durum",
  follow_up: "Hatırlatma",
  system: "Sistem",
};

/** A contacted lead with no movement for this long is going cold. */
export const STALE_DAYS = 5;

export const isLeadStatus = (v: unknown): v is LeadStatus =>
  typeof v === "string" && (LEAD_STATUSES as readonly string[]).includes(v);
export const isPriority = (v: unknown): v is Priority =>
  typeof v === "string" && (PRIORITIES as readonly string[]).includes(v);
export const isNoteType = (v: unknown): v is NoteType =>
  typeof v === "string" && (NOTE_TYPES as readonly string[]).includes(v);

const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

/* --------------------------------- types --------------------------------- */

export interface Lead {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  language: string;
  selected_fit_id: string | null;
  selected_situation: string | null;
  reference_project_slug: string | null;
  source_path: string | null;
  contact_preference: string;
  status: LeadStatus;
  priority: Priority | null;
  device_type: string | null;
  country: string | null;
  session_id: string | null;
  user_agent: string | null;
  read_at: Date | null;
  last_contacted_at: Date | null;
  follow_up_at: Date | null;
  won_at: Date | null;
  lost_at: Date | null;
  lost_reason: string | null;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  created_at: Date;
  note: string;
  note_type: NoteType;
  created_by: string | null;
}

export interface LeadFilters {
  status?: string;
  language?: string;
  fit?: string;
  priority?: string;
  /** "due" (today or overdue) | "overdue" | "none" */
  followUp?: string;
  q?: string;
  sort?: string;
  page?: number;
}

export const PAGE_SIZE = 20;

/* -------------------------------- queries -------------------------------- */

/** Every filter is validated here, so a hand-edited query string cannot reach SQL. */
function buildWhere(f: LeadFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (f.status === "open") {
    // Not a stored status — a saved view meaning "everything I still owe a reply to".
    params.push(OPEN_STATUSES);
    clauses.push(`status = any($${params.length}::text[])`);
  } else if (isLeadStatus(f.status)) {
    params.push(f.status);
    clauses.push(`status = $${params.length}`);
  }

  if (f.language === "tr" || f.language === "en") {
    params.push(f.language);
    clauses.push(`language = $${params.length}`);
  }
  if (f.fit) {
    params.push(f.fit);
    clauses.push(`selected_fit_id = $${params.length}`);
  }
  if (isPriority(f.priority)) {
    params.push(f.priority);
    clauses.push(`priority = $${params.length}`);
  }

  if (f.followUp === "due") {
    clauses.push(
      `follow_up_at is not null and follow_up_at < now() + interval '1 day' and status <> all('{won,lost,archived}')`,
    );
  } else if (f.followUp === "overdue") {
    clauses.push(
      `follow_up_at is not null and follow_up_at < now() and status <> all('{won,lost,archived}')`,
    );
  } else if (f.followUp === "none") {
    clauses.push(`follow_up_at is null`);
  }

  if (f.q && f.q.trim()) {
    // ILIKE with a bound parameter. The % wrappers are added to the VALUE, not
    // to the SQL — the string never becomes part of the statement.
    params.push(`%${f.q.trim()}%`);
    const i = params.length;
    clauses.push(
      `(name ilike $${i} or coalesce(email,'') ilike $${i} or coalesce(phone,'') ilike $${i} or message ilike $${i})`,
    );
  }

  return {
    where: clauses.length ? `where ${clauses.join(" and ")}` : "",
    params,
  };
}

/** Closed set. The sort key is the one thing that cannot be a bound parameter. */
const SORTS: Record<string, string> = {
  newest: "created_at desc",
  oldest: "created_at asc",
  waiting: "updated_at asc", // longest untouched first
  followup: "follow_up_at asc nulls last",
};

export async function listLeads(f: LeadFilters) {
  const pool = getPool();
  if (!pool) return null;

  const { where, params } = buildWhere(f);
  const order = SORTS[f.sort ?? "newest"] ?? SORTS.newest;
  const page = Math.max(1, Math.floor(f.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const [rows, total] = await Promise.all([
    pool.query<Lead>(
      `select * from leads ${where}
       order by ${order}
       limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, PAGE_SIZE, offset],
    ),
    pool.query<{ count: string }>(
      `select count(*)::text as count from leads ${where}`,
      params,
    ),
  ]);

  const count = Number(total.rows[0]?.count ?? 0);
  return {
    leads: rows.rows,
    total: count,
    page,
    pages: Math.max(1, Math.ceil(count / PAGE_SIZE)),
  };
}

/** undefined = no database (an outage), null = no such lead (a bad link). */
export async function getLead(
  id: string,
): Promise<{ lead: Lead; notes: LeadNote[] } | null | undefined> {
  const pool = getPool();
  if (!pool) return undefined;
  if (!isUuid(id)) return null;

  const { rows } = await pool.query<Lead>("select * from leads where id = $1", [
    id,
  ]);
  if (!rows[0]) return null;

  const notes = await pool.query<LeadNote>(
    "select * from lead_notes where lead_id = $1 order by created_at desc",
    [id],
  );
  return { lead: rows[0], notes: notes.rows };
}

/**
 * Opening a lead marks it read — once. A separate "mark as read" button would be
 * a button nobody presses, and then `read_at` would be a column that lies.
 */
export async function markRead(id: string) {
  const pool = getPool();
  if (!pool || !isUuid(id)) return;
  await pool.query(
    `update leads
        set read_at = now(),
            status = case when status = 'new' then 'read' else status end,
            updated_at = now()
      where id = $1 and read_at is null`,
    [id],
  );
}

export async function addNote(
  id: string,
  note: string,
  type: NoteType,
  by: string | null,
) {
  const pool = getPool();
  if (!pool || !isUuid(id)) return false;

  const text = note.trim();
  if (!text || text.length > 2000) return false;
  if (!isNoteType(type)) return false;

  await pool.query(
    `insert into lead_notes (lead_id, note, note_type, created_by)
     values ($1, $2, $3, $4)`,
    [id, text, type, by],
  );
  await pool.query("update leads set updated_at = now() where id = $1", [id]);
  return true;
}

/**
 * A status change stamps the dates it implies and writes itself into the
 * timeline. The alternative — asking the owner to remember to also log it — is
 * how a timeline ends up with holes in exactly the places you later care about.
 */
export async function setLeadStatus(
  id: string,
  status: LeadStatus,
  by: string | null,
) {
  const pool = getPool();
  if (!pool || !isUuid(id) || !isLeadStatus(status)) return false;

  const current = await pool.query<{ status: LeadStatus }>(
    "select status from leads where id = $1",
    [id],
  );
  const from = current.rows[0]?.status;
  if (!from) return false;
  if (from === status) return true;

  await pool.query(
    `update leads set
        status = $2,
        updated_at = now(),
        read_at = coalesce(read_at, now()),
        last_contacted_at = case
          when $2 in ('contacted','qualified','proposal_sent')
            then coalesce(last_contacted_at, now())
          else last_contacted_at end,
        won_at  = case when $2 = 'won'  then now() else won_at  end,
        lost_at = case when $2 = 'lost' then now() else lost_at end,
        -- won/lost/archived close the loop: a stale reminder on a closed lead is
        -- noise, and noise is how a follow-up list stops being trusted.
        follow_up_at = case
          when $2 in ('won','lost','archived') then null
          else follow_up_at end
      where id = $1`,
    [id, status],
  );

  await pool.query(
    `insert into lead_notes (lead_id, note, note_type, created_by)
     values ($1, $2, 'status_change', $3)`,
    [id, `${STATUS_LABEL[from]} → ${STATUS_LABEL[status]}`, by],
  );
  return true;
}

export async function setPriority(id: string, priority: Priority | null) {
  const pool = getPool();
  if (!pool || !isUuid(id)) return false;
  if (priority !== null && !isPriority(priority)) return false;

  await pool.query(
    "update leads set priority = $2, updated_at = now() where id = $1",
    [id, priority],
  );
  return true;
}

/** `date` is a plain YYYY-MM-DD from a date input, or null to clear. */
export async function setFollowUp(
  id: string,
  date: string | null,
  by: string | null,
) {
  const pool = getPool();
  if (!pool || !isUuid(id)) return false;
  if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  await pool.query(
    "update leads set follow_up_at = $2::date, updated_at = now() where id = $1",
    [id, date],
  );
  await pool.query(
    `insert into lead_notes (lead_id, note, note_type, created_by)
     values ($1, $2, 'follow_up', $3)`,
    [
      id,
      date ? `Hatırlatma: ${date}` : "Hatırlatma kaldırıldı",
      by,
    ],
  );
  return true;
}

/** One-click: stamps the date, moves the stage, logs it. The whole point is that
 *  it is one click — a three-step ritual is a ritual that gets skipped. */
export async function markContacted(
  id: string,
  channel: "call" | "whatsapp" | "email",
  by: string | null,
) {
  const pool = getPool();
  if (!pool || !isUuid(id)) return false;

  await pool.query(
    `update leads set
        last_contacted_at = now(),
        read_at = coalesce(read_at, now()),
        status = case when status in ('new','read') then 'contacted' else status end,
        updated_at = now()
      where id = $1`,
    [id],
  );
  await pool.query(
    `insert into lead_notes (lead_id, note, note_type, created_by)
     values ($1, $2, $3, $4)`,
    [id, NOTE_TYPE_LABEL[channel] + " ile iletişime geçildi", channel, by],
  );
  return true;
}

/* ------------------------------- dashboard -------------------------------- */

export interface LeadSummary {
  total: number;
  byStatus: Record<string, number>;
  today: number;
  last7: number;
  /** The three actionable queues — what the dashboard is actually for. */
  needsReply: Lead[];
  followUpsDue: Lead[];
  stale: Lead[];
  recentActivity: (LeadNote & { lead_name: string })[];
  bySource: { key: string; count: number }[];
  byFit: { key: string; count: number }[];
  byLanguage: { key: string; count: number }[];
}

export async function getLeadSummary(): Promise<LeadSummary | null> {
  const pool = getPool();
  if (!pool) return null;

  const groupBy = async (col: "source_path" | "selected_fit_id" | "language") => {
    const { rows } = await pool.query<{ key: string | null; count: string }>(
      `select ${col} as key, count(*)::text as count
       from leads group by ${col} order by count(*) desc limit 8`,
    );
    return rows.map((r) => ({ key: r.key ?? "—", count: Number(r.count) }));
  };

  const [counts, needsReply, followUps, stale, activity, bySource, byFit, byLang] =
    await Promise.all([
      pool.query<{ status: LeadStatus; total: string; today: string; last7: string }>(
        `select status,
                count(*)::text as total,
                count(*) filter (where created_at >= date_trunc('day', now()))::text as today,
                count(*) filter (where created_at >= now() - interval '7 days')::text as last7
           from leads group by status`,
      ),
      // Never replied to at all.
      pool.query<Lead>(
        `select * from leads
          where status in ('new','read') and last_contacted_at is null
          order by created_at asc limit 10`,
      ),
      // Due today or already overdue, and still open.
      pool.query<Lead>(
        `select * from leads
          where follow_up_at is not null
            and follow_up_at < now() + interval '1 day'
            and status <> all('{won,lost,archived}')
          order by follow_up_at asc limit 10`,
      ),
      // Contacted, then silence. No reminder set, or it would be above.
      pool.query<Lead>(
        `select * from leads
          where status in ('contacted','qualified','proposal_sent')
            and follow_up_at is null
            and updated_at < now() - ($1 || ' days')::interval
          order by updated_at asc limit 10`,
        [STALE_DAYS],
      ),
      pool.query<LeadNote & { lead_name: string }>(
        `select n.*, l.name as lead_name
           from lead_notes n join leads l on l.id = n.lead_id
          order by n.created_at desc limit 8`,
      ),
      groupBy("source_path"),
      groupBy("selected_fit_id"),
      groupBy("language"),
    ]);

  const byStatus: Record<string, number> = Object.fromEntries(
    LEAD_STATUSES.map((s) => [s, 0]),
  );
  let total = 0;
  let today = 0;
  let last7 = 0;
  for (const row of counts.rows) {
    const n = Number(row.total);
    byStatus[row.status] = n;
    total += n;
    today += Number(row.today);
    last7 += Number(row.last7);
  }

  return {
    total,
    byStatus,
    today,
    last7,
    needsReply: needsReply.rows,
    followUpsDue: followUps.rows,
    stale: stale.rows,
    recentActivity: activity.rows,
    bySource,
    byFit,
    byLanguage: byLang,
  };
}

/* --------------------------------- export --------------------------------- */

/**
 * RFC 4180 escaping. The `=`/`+`/`-`/`@` prefix guard is not paranoia: a lead
 * called `=cmd|'/c calc'!A1` would otherwise be executed as a formula the moment
 * the owner opened the file in Excel. The visitor controls the name field.
 */
function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export const CSV_COLUMNS = [
  "id",
  "created_at",
  "updated_at",
  "name",
  "email",
  "phone",
  "status",
  "priority",
  "selected_fit_id",
  "selected_situation",
  "source_path",
  "reference_project_slug",
  "contact_preference",
  "language",
  "device_type",
  "country",
  "read_at",
  "last_contacted_at",
  "follow_up_at",
  "won_at",
  "lost_at",
  "lost_reason",
  "message",
] as const;

export async function exportLeadsCsv(): Promise<string | null> {
  const pool = getPool();
  if (!pool) return null;

  // No session path and no user-agent: an export is a file that gets emailed
  // around and left in a Downloads folder. It carries what the owner needs to
  // work a lead, and nothing about how that person browsed.
  const { rows } = await pool.query<Record<string, unknown>>(
    `select ${CSV_COLUMNS.join(", ")} from leads order by created_at desc`,
  );

  const lines = [CSV_COLUMNS.join(",")];
  for (const r of rows) {
    lines.push(CSV_COLUMNS.map((c) => csvCell(r[c])).join(","));
  }
  // BOM: without it Excel opens UTF-8 as Latin-1 and every Turkish name breaks.
  return "﻿" + lines.join("\r\n");
}
