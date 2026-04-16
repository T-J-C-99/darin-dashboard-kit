"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <style jsx global>{`
        html, body { background: #09090b; }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-zinc-800 p-8 w-full max-w-xs"
      >
        <h1
          className="text-zinc-200 text-xs uppercase tracking-[0.25em] mb-6"
          style={{ fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace' }}
        >
          Ops Terminal
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          required
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          style={{ fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace' }}
        />

        {error && (
          <p
            className="mt-2 text-red-400 text-xs"
            style={{ fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace' }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs uppercase tracking-widest hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace' }}
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
