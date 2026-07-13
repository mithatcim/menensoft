import { getPool } from "@/lib/db/postgres";

/**
 * Admin lead queries (Phase 33D).
 *
 * Server Components read PostgreSQL directly — there is no /api/admin layer,
 * because there is no second consumer of it, and every public endpoint that
 * returns lead data is one more thing that has to be got right forever.
 *
 * Every value is a bound parameter. The only identifiers that reach SQL as text
 * are sort/filter keys chosen from closed sets defined here, never from the
 * query string.
 */

export const LEAD_STATUSES = ["new", "read", "contacted", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === "string" && (LEAD_STATUSES as readonly string[]).includes(v);
}

export interface Lead {
  id: string;
  created_at: Date;
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
  device_type: string | null;
  country: string | null;
  session_id: string | null;
  user_agent: string | null;
}

export interface LeadFilters {
  status?: string;
  language?: string;
  fit?: string;
  q?: string;
  page?: number;
}

export const PAGE_SIZE = 20;

/** Every filter is validated here, so a hand-edited query string cannot reach SQL. */
function buildWhere(f: LeadFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (isLeadStatus(f.status)) {
    params.push(f.status);
    clauses.push(`status = $${params.length}`);
  }
  if (f.language === "tr" || f.language === "en") {
    params.push(f.language);
    clauses.push(`language = $${params.length}`);
  }
  if (f.fit) {
    // Bound parameter, so even a junk value is inert — it simply matches nothing.
    params.push(f.fit);
    clauses.push(`selected_fit_id = $${params.length}`);
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

export async function listLeads(f: LeadFilters) {
  const pool = getPool();
  if (!pool) return null;

  const { where, params } = buildWhere(f);
  const page = Math.max(1, Math.floor(f.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const [rows, total] = await Promise.all([
    pool.query<Lead>(
      `select * from leads ${where}
       order by created_at desc
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

export async function getLead(id: string): Promise<Lead | null | undefined> {
  const pool = getPool();
  if (!pool) return undefined; // undefined = no database, null = no such lead

  // A malformed uuid makes Postgres raise rather than return empty. That is a
  // bad id, not an outage — treat it as "not found" instead of a 500.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const { rows } = await pool.query<Lead>("select * from leads where id = $1", [
    id,
  ]);
  return rows[0] ?? null;
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  const pool = getPool();
  if (!pool) return false;
  if (!isLeadStatus(status)) return false;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;

  const { rowCount } = await pool.query(
    "update leads set status = $1 where id = $2",
    [status, id],
  );
  return (rowCount ?? 0) > 0;
}

export interface LeadSummary {
  total: number;
  byStatus: Record<string, number>;
  today: number;
  last7: number;
  latest: Lead[];
  bySource: { key: string; count: number }[];
  byFit: { key: string; count: number }[];
  byLanguage: { key: string; count: number }[];
}

/**
 * Everything here is derived from the `leads` table and nothing else. There are
 * no visitor counts, no pageviews and no sessions — that data does not exist
 * yet, and a dashboard that implies otherwise is a lie told in chart form.
 */
export async function getLeadSummary(): Promise<LeadSummary | null> {
  const pool = getPool();
  if (!pool) return null;

  const groupBy = async (col: "source_path" | "selected_fit_id" | "language") => {
    // Column name from a closed union type, never from user input.
    const { rows } = await pool.query<{ key: string | null; count: string }>(
      `select ${col} as key, count(*)::text as count
       from leads group by ${col} order by count(*) desc limit 8`,
    );
    return rows.map((r) => ({ key: r.key ?? "—", count: Number(r.count) }));
  };

  const [counts, latest, bySource, byFit, byLanguage] = await Promise.all([
    pool.query<{
      total: string;
      status: LeadStatus;
      today: string;
      last7: string;
    }>(
      `select
         status,
         count(*)::text as total,
         count(*) filter (where created_at >= date_trunc('day', now()))::text as today,
         count(*) filter (where created_at >= now() - interval '7 days')::text as last7
       from leads group by status`,
    ),
    pool.query<Lead>("select * from leads order by created_at desc limit 5"),
    groupBy("source_path"),
    groupBy("selected_fit_id"),
    groupBy("language"),
  ]);

  const byStatus: Record<string, number> = {
    new: 0,
    read: 0,
    contacted: 0,
    archived: 0,
  };
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
    latest: latest.rows,
    bySource,
    byFit,
    byLanguage,
  };
}
