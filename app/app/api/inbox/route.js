import { getDb, requireAuth } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!requireAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sql = getDb();
  try {
    const { id, action, reviewNotes } = await request.json();
    if (!["accepted", "refined", "discarded", "deferred"].includes(action)) {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }
    await sql`
      UPDATE team_submissions
      SET status = ${action},
          review_notes = ${reviewNotes || null},
          reviewed_at = NOW(),
          reviewed_by = 'darin'
      WHERE id = ${id}
    `;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Inbox update failed" }, { status: 500 });
  }
}
