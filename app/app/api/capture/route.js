import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const sql = getDb();
  try {
    const body = await request.json();
    const { token, type, content, urgency, initiativeId } = body;

    if (!token || token.length < 16) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
    if (!["blocker", "progress", "decision", "fyi"].includes(type)) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }
    if (!content || content.trim().length < 3) {
      return Response.json({ error: "Content required" }, { status: 400 });
    }
    if (content.length > 2000) {
      return Response.json({ error: "Content too long (2000 char max)" }, { status: 400 });
    }

    const tokenRow = await sql`
      SELECT member_id, revoked, expires_at FROM team_access_tokens WHERE token = ${token}
    `;
    if (tokenRow.length === 0 || tokenRow[0].revoked) {
      return Response.json({ error: "Token invalid or revoked" }, { status: 401 });
    }
    if (tokenRow[0].expires_at && new Date(tokenRow[0].expires_at) < new Date()) {
      return Response.json({ error: "Link expired \u2014 ask for a new one" }, { status: 401 });
    }

    const memberId = tokenRow[0].member_id;

    const rateCheck = await sql`
      SELECT COUNT(*)::int AS cnt FROM team_submissions
      WHERE member_id = ${memberId} AND submitted_at > NOW() - INTERVAL '1 hour'
    `;
    if (rateCheck[0].cnt >= 10) {
      return Response.json({ error: "Too many submissions. Try again in an hour." }, { status: 429 });
    }

    await sql`
      INSERT INTO team_submissions (member_id, submission_type, content, urgency, initiative_id)
      VALUES (${memberId}, ${type}, ${content}, ${urgency || "normal"}, ${initiativeId || null})
    `;
    await sql`UPDATE team_access_tokens SET last_used_at = NOW() WHERE token = ${token}`;

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Capture error:", error);
    return Response.json({ error: "Submission failed" }, { status: 500 });
  }
}

export async function GET(request) {
  // Resolve member info from token for the capture page
  const sql = getDb();
  const url = new URL(request.url);
  const token = url.searchParams.get("t");
  if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

  try {
    const rows = await sql`
      SELECT tm.id, tm.name, tm.role, tat.revoked, tat.expires_at
      FROM team_access_tokens tat
      JOIN team_members tm ON tat.member_id = tm.id
      WHERE tat.token = ${token}
    `;
    if (rows.length === 0 || rows[0].revoked) {
      return Response.json({ error: "Invalid or revoked token" }, { status: 401 });
    }
    if (rows[0].expires_at && new Date(rows[0].expires_at) < new Date()) {
      return Response.json({ error: "Link expired \u2014 ask for a new one" }, { status: 401 });
    }
    const initiatives = await sql`
      SELECT id, name FROM initiatives WHERE status = 'active' ORDER BY name
    `;
    return Response.json({ member: { name: rows[0].name, role: rows[0].role }, initiatives });
  } catch (error) {
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }
}
