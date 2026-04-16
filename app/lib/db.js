import { neon } from "@neondatabase/serverless";

let _sql = null;

export function getDb() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL not set. For cloud deploy, add it to Vercel env vars. For local, put it in .env.local."
      );
    }
    _sql = neon(url);
  }
  return _sql;
}

export function requireAuth(request) {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "");
  const expected = process.env.SYNC_API_KEY;
  if (!expected) return false;
  return apiKey === expected;
}

export function requireCaptureToken(token) {
  // Token lookup happens in the route against team_access_tokens
  return typeof token === "string" && token.length >= 16;
}
