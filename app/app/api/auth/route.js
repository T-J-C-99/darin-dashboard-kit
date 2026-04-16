export const dynamic = "force-dynamic";

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request) {
  const pw = process.env.DASHBOARD_PASSWORD;
  if (!pw) {
    return Response.json({ error: "No password configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return Response.json({ error: "Password required" }, { status: 400 });
  }

  const expectedHash = await sha256(pw);
  const submittedHash = await sha256(password);

  if (submittedHash !== expectedHash) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieValue = await sha256(pw + "_ops_auth_token");

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set(
    "Set-Cookie",
    [
      `ops_auth=${cookieValue}`,
      "HttpOnly",
      "SameSite=Lax",
      "Path=/",
      `Max-Age=${60 * 60 * 24 * 30}`,
      isProduction ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
