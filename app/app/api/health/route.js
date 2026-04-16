import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = { ok: false, checks: {} };
  try {
    const sql = getDb();

    // DB connectivity
    const ping = await sql`SELECT 1 as ok`;
    status.checks.database = ping.length > 0 ? "connected" : "unreachable";

    // Setup state
    const setup = await sql`SELECT value FROM app_config WHERE key = 'setup_complete'`;
    status.checks.setupComplete = setup[0]?.value === true;

    // Config counts
    const sections = await sql`SELECT COUNT(*)::int as cnt FROM section_config WHERE enabled = true`;
    status.checks.enabledSections = sections[0].cnt;

    const metrics = await sql`SELECT COUNT(*)::int as cnt FROM metrics_config WHERE enabled = true`;
    status.checks.enabledMetrics = metrics[0].cnt;

    // Last activity (operational, not sensitive)
    const lastActivity = await sql`SELECT timestamp FROM activity_log ORDER BY timestamp DESC LIMIT 1`;
    status.checks.lastActivity = lastActivity[0]?.timestamp || null;

    status.ok = true;
    return Response.json(status);
  } catch (error) {
    status.checks.error = process.env.NODE_ENV === "production" ? "database error" : error.message;
    return Response.json(status, { status: 500 });
  }
}
