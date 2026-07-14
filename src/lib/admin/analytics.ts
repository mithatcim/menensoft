import { getPool } from "@/lib/db/postgres";

/**
 * Admin analytics queries (Phase 33E).
 *
 * Everything here is real, or it is absent. There is no placeholder data, no
 * sample chart and no zero-that-might-mean-nothing: when analytics is not
 * configured the pages say so instead of drawing an empty dashboard, because a
 * dashboard full of zeros looks exactly like a business with no visitors.
 */

export interface Overview {
  visitorsToday: number;
  visitors7: number;
  sessionsToday: number;
  sessions7: number;
  pageViewsToday: number;
  pageViews7: number;
  ctaToday: number;
  emailToday: number;
  whatsappToday: number;
  formToday: number;
  avgDurationToday: number;
  totalEvents: number;
}

export interface AnalyticsSession {
  id: string;
  created_at: Date;
  last_seen_at: Date;
  first_path: string | null;
  last_path: string | null;
  locale: string | null;
  referrer_host: string | null;
  device_type: string | null;
  country: string | null;
  pageview_count: number;
  duration_seconds: number;
}

export interface AnalyticsEvent {
  id: string;
  created_at: Date;
  session_id: string | null;
  event_type: string;
  path: string | null;
  locale: string | null;
  device_type: string | null;
  country: string | null;
  metadata: Record<string, unknown>;
}

export interface AnalyticsData {
  overview: Overview;
  topPages: { path: string; views: number; sessions: number }[];
  devices: { key: string; count: number }[];
  countries: { key: string; count: number }[];
  eventCounts: { key: string; count: number }[];
  recentSessions: AnalyticsSession[];
  latestEvents: AnalyticsEvent[];
  hasAnyData: boolean;
}

/** null = analytics tables unreachable (no DATABASE_URL, or schema not applied). */
export async function getAnalytics(): Promise<AnalyticsData | null> {
  const pool = getPool();
  if (!pool) return null;

  try {
    const [ov, pages, devices, countries, events, sessions, latest] =
      await Promise.all([
        pool.query<Record<string, string>>(
          `select
             (select count(distinct visitor_key)::text from visitor_sessions
                where created_at >= date_trunc('day', now())) as visitors_today,
             (select count(distinct visitor_key)::text from visitor_sessions
                where created_at >= now() - interval '7 days') as visitors_7,
             (select count(*)::text from visitor_sessions
                where created_at >= date_trunc('day', now())) as sessions_today,
             (select count(*)::text from visitor_sessions
                where created_at >= now() - interval '7 days') as sessions_7,
             (select count(*)::text from analytics_events
                where event_type = 'page_view' and created_at >= date_trunc('day', now())) as pv_today,
             (select count(*)::text from analytics_events
                where event_type = 'page_view' and created_at >= now() - interval '7 days') as pv_7,
             (select count(*)::text from analytics_events
                where event_type = 'cta_click' and created_at >= date_trunc('day', now())) as cta_today,
             (select count(*)::text from analytics_events
                where event_type = 'email_click' and created_at >= date_trunc('day', now())) as email_today,
             (select count(*)::text from analytics_events
                where event_type = 'whatsapp_click' and created_at >= date_trunc('day', now())) as wa_today,
             (select count(*)::text from analytics_events
                where event_type = 'form_submit' and created_at >= date_trunc('day', now())) as form_today,
             (select coalesce(round(avg(duration_seconds)), 0)::text from visitor_sessions
                where created_at >= date_trunc('day', now()) and duration_seconds > 0) as avg_dur,
             (select count(*)::text from analytics_events) as total_events`,
        ),
        pool.query<{ path: string; views: string; sessions: string }>(
          `select path,
                  count(*)::text as views,
                  count(distinct session_id)::text as sessions
             from analytics_events
            where event_type = 'page_view' and path is not null
              and created_at >= now() - interval '30 days'
            group by path order by count(*) desc limit 12`,
        ),
        pool.query<{ key: string; count: string }>(
          `select coalesce(device_type,'unknown') as key, count(*)::text as count
             from visitor_sessions where created_at >= now() - interval '30 days'
            group by 1 order by count(*) desc`,
        ),
        pool.query<{ key: string; count: string }>(
          `select coalesce(country,'—') as key, count(*)::text as count
             from visitor_sessions where created_at >= now() - interval '30 days'
            group by 1 order by count(*) desc limit 12`,
        ),
        pool.query<{ key: string; count: string }>(
          `select event_type as key, count(*)::text as count
             from analytics_events where created_at >= now() - interval '30 days'
            group by 1 order by count(*) desc`,
        ),
        pool.query<AnalyticsSession>(
          `select * from visitor_sessions order by last_seen_at desc limit 25`,
        ),
        pool.query<AnalyticsEvent>(
          `select * from analytics_events order by created_at desc limit 20`,
        ),
      ]);

    const o = ov.rows[0];
    const n = (k: string) => Number(o[k] ?? 0);

    const overview: Overview = {
      visitorsToday: n("visitors_today"),
      visitors7: n("visitors_7"),
      sessionsToday: n("sessions_today"),
      sessions7: n("sessions_7"),
      pageViewsToday: n("pv_today"),
      pageViews7: n("pv_7"),
      ctaToday: n("cta_today"),
      emailToday: n("email_today"),
      whatsappToday: n("wa_today"),
      formToday: n("form_today"),
      avgDurationToday: n("avg_dur"),
      totalEvents: n("total_events"),
    };

    return {
      overview,
      topPages: pages.rows.map((r) => ({
        path: r.path,
        views: Number(r.views),
        sessions: Number(r.sessions),
      })),
      devices: devices.rows.map((r) => ({
        key: r.key,
        count: Number(r.count),
      })),
      countries: countries.rows.map((r) => ({
        key: r.key,
        count: Number(r.count),
      })),
      eventCounts: events.rows.map((r) => ({
        key: r.key,
        count: Number(r.count),
      })),
      recentSessions: sessions.rows,
      latestEvents: latest.rows,
      hasAnyData: overview.totalEvents > 0,
    };
  } catch (err) {
    // Tables missing (schema not re-applied) reads the same as no database:
    // "not set up", not "zero visitors". The difference matters enormously.
    console.error(
      "[admin] analytics query failed:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

export async function getSession(id: string): Promise<
  | {
      session: AnalyticsSession;
      events: AnalyticsEvent[];
    }
  | null
  | undefined
> {
  const pool = getPool();
  if (!pool) return undefined; // undefined = no database, null = no such session
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  try {
    const s = await pool.query<AnalyticsSession>(
      "select * from visitor_sessions where id = $1",
      [id],
    );
    if (!s.rows[0]) return null;

    const e = await pool.query<AnalyticsEvent>(
      "select * from analytics_events where session_id = $1 order by created_at asc",
      [id],
    );
    return { session: s.rows[0], events: e.rows };
  } catch {
    return undefined;
  }
}

/**
 * Leads that came FROM this session (Phase 36A). Matched server-side at insert
 * time from the same daily visitor key — never from a browser identifier.
 */
export async function getSessionLeads(sessionId: string) {
  const pool = getPool();
  if (!pool) return [];
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return [];
  try {
    const { rows } = await pool.query<{
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
      source_path: string | null;
    }>(
      `select id, name, email, phone, source_path from leads
        where session_id = $1 order by created_at desc`,
      [sessionId],
    );
    return rows;
  } catch {
    return [];
  }
}
