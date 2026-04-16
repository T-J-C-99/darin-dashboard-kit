"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CapturePage() {
  const params = useParams();
  const token = params.token;
  const [member, setMember] = useState(null);
  const [initiatives, setInitiatives] = useState([]);
  const [type, setType] = useState("blocker");
  const [content, setContent] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [initiativeId, setInitiativeId] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function lookup() {
      try {
        const res = await fetch(`/api/capture?t=${token}`);
        if (!res.ok) throw new Error("Invalid link");
        const data = await res.json();
        setMember(data.member);
        setInitiatives(data.initiatives || []);
      } catch (e) {
        setError("This link is invalid or has been revoked.");
      }
    }
    if (token) lookup();
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          type,
          content,
          urgency,
          initiativeId: initiativeId || null,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("done");
      setContent("");
    } catch (e) {
      setError(e.message);
      setStatus("idle");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md text-center">
          <p className="text-red-400 text-sm uppercase tracking-widest">[ error ]</p>
          <p className="text-zinc-300 mt-2">{error}</p>
          <p className="text-zinc-500 text-xs mt-4">Contact your manager for a new link.</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        loading…
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md text-center space-y-3">
          <p className="text-emerald-400 text-sm uppercase tracking-widest">[ submitted ]</p>
          <p className="text-zinc-200">Your submission is in the review queue.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 px-4 py-2 border border-zinc-700 text-zinc-300 text-xs uppercase tracking-[0.2em] hover:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans text-[14px] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            quick capture
          </p>
          <h1 className="text-lg font-semibold text-zinc-50 truncate">{member.name}</h1>
          {member.role && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">{member.role}</p>}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="WHAT IS THIS">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["blocker", "Blocker"],
                ["progress", "Progress"],
                ["decision", "Decision needed"],
                ["fyi", "FYI"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setType(v)}
                  className={`px-3 py-3 border text-sm text-left transition-colors focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none ${
                    type === v ? "border-emerald-500 bg-emerald-950/30 text-emerald-100" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          <Field label="WHAT'S HAPPENING">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              placeholder="Be specific. What you need, why it matters, what's at stake."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm resize-none focus:border-zinc-600 focus:outline-none"
            />
          </Field>

          <Field label="URGENCY">
            <div className="flex gap-2">
              {[
                ["low", "Low"],
                ["normal", "Normal"],
                ["high", "High"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setUrgency(v)}
                  className={`flex-1 px-3 py-3 border text-sm transition-colors focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none ${
                    urgency === v
                      ? v === "high"
                        ? "border-red-500 bg-red-950/30 text-red-100"
                        : v === "normal"
                        ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                        : "border-zinc-700 bg-zinc-900/50 text-zinc-400"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          {initiatives.length > 0 && (
            <Field label="RELATED INITIATIVE (OPTIONAL)">
              <select
                value={initiativeId}
                onChange={(e) => setInitiativeId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:border-zinc-600 focus:outline-none"
              >
                <option value="">—</option>
                {initiatives.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </Field>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || !content.trim()}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm uppercase tracking-[0.2em] font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
          >
            {status === "submitting" ? "sending…" : "Submit"}
          </button>
        </form>

        <p className="mt-6 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.2em] text-center">
          Submitted for review before appearing on the dashboard
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
