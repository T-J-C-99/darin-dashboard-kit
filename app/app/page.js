"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "aviate", label: "AVIATE", subtitle: "Run the business", key: "1" },
  { id: "navigate", label: "NAVIGATE", subtitle: "Plan & build", key: "2" },
  { id: "communicate", label: "COMMUNICATE", subtitle: "Lead people", key: "3" },
];

const SCOPE_ACCENT = {
  REALTIME: "border-l-emerald-500/80",
  LEADING: "border-l-cyan-500/70",
  MTD: "border-l-sky-500/70",
  QTD: "border-l-amber-500/60",
  YTD: "border-l-zinc-500/60",
};

function timeAgo(d) {
  if (!d) return "never";
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff >= 604800) return `${Math.floor(diff / 604800)}w`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("aviate");
  const [now, setNow] = useState(() => new Date());
  const [failCount, setFailCount] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.status === 401) {
          setSessionExpired(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        setData(await res.json());
        setError(null);
        setFailCount(0);
      } catch {
        setError("Unable to load dashboard");
        setFailCount((prev) => prev + 1);
      }
    }
    fetchData();
    const i = setInterval(fetchData, 60000);
    const c = setInterval(() => setNow(new Date()), 1000);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") fetchData();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(i);
      clearInterval(c);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
      if (e.key === "1") setActiveTab("aviate");
      if (e.key === "2") setActiveTab("navigate");
      if (e.key === "3") setActiveTab("communicate");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center font-mono p-6">
        <div className="max-w-md text-center text-sm">
          <p className="text-amber-400 uppercase tracking-widest text-xs">[ session expired ]</p>
          <p className="mt-2">Your session has expired.</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="mt-4 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs uppercase tracking-widest hover:bg-zinc-700 transition-colors"
          >
            Re-authenticate
          </button>
        </div>
      </div>
    );
  }

  if (error && !data) return <ErrorScreen message={error} />;
  if (!data) return <LoadingScreen />;

  if (!data.setupComplete) {
    return <SetupIncompleteScreen data={data} />;
  }

  const companyName = data.appConfig?.company_name || "Your Company";
  const enabledTabs = TABS.filter((t) => (data.appConfig?.tabs_enabled || []).includes(t.id));
  const currentTab = enabledTabs.find((t) => t.id === activeTab) ? activeTab : enabledTabs[0]?.id;
  const isStale = failCount >= 3;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 text-[13px] antialiased selection:bg-zinc-700">
      <style jsx global>{`
        html, body { background: #09090b; }
        .mono { font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace; font-feature-settings: "zero" on, "tnum" on; }
      `}</style>

      <SystemBar companyName={companyName} now={now} updatedAt={data.updatedAt} isStale={isStale} />
      <TabBar tabs={enabledTabs} activeTab={currentTab} setActiveTab={setActiveTab} />

      <main className="px-5 py-5 min-h-[calc(100vh-120px)]">
        {currentTab === "aviate" && <AviatePanel data={data} />}
        {currentTab === "navigate" && <NavigatePanel data={data} />}
        {currentTab === "communicate" && <CommunicatePanel data={data} />}
      </main>

      <Footer />
    </div>
  );
}

/* --- Screens --- */

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-500 font-mono flex items-center justify-center">
      <div className="text-xs uppercase tracking-widest">loading...</div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center font-mono p-6">
      <div className="max-w-md text-center text-sm">
        <p className="text-red-400 uppercase tracking-widest text-xs">[ error ]</p>
        <p className="mt-2">{message}</p>
        <p className="mt-4 text-zinc-500 text-xs">
          If this persists, contact your administrator.
        </p>
      </div>
    </div>
  );
}

function SetupIncompleteScreen({ data }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center font-mono p-6">
      <div className="max-w-lg text-sm space-y-3 text-center">
        <p className="text-emerald-400 uppercase tracking-widest text-xs">[ setup pending ]</p>
        <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">
          {data.companyName || "Ops Terminal"}
        </h1>
        <p className="text-zinc-400">
          This dashboard hasn&apos;t been configured yet.
        </p>
        <div className="mt-6 border border-zinc-800 bg-zinc-900/50 p-5 text-left space-y-2 text-[12px]">
          <p className="text-zinc-300">Setup is not yet complete. Open Claude Code to continue.</p>
          <p className="text-zinc-500 mt-3">
            Current step: <span className="text-zinc-300">{data.setupStep}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- Shell --- */

function SystemBar({ companyName, now, updatedAt, isStale }) {
  return (
    <div className="bg-black border-b border-zinc-800 px-4 py-1.5 mono text-[11px] flex items-center justify-between text-zinc-500 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {isStale ? (
          <span className="text-red-400">STALE</span>
        ) : (
          <span className="text-emerald-400">LIVE</span>
        )}
        <span className="text-zinc-200 font-semibold tracking-[0.2em] uppercase">
          {companyName} &middot; OPS TERMINAL
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>
          {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}{" "}
          <span className="text-zinc-200 tabular-nums">
            {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </span>
        </span>
        <span>sync <span className="text-zinc-300">{timeAgo(updatedAt)}</span></span>
      </div>
    </div>
  );
}

function TabBar({ tabs, activeTab, setActiveTab }) {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-[29px] z-30">
      <div className="flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-left border-r border-zinc-800 transition-colors relative focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none ${
                active ? "bg-zinc-900 text-zinc-100" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-400" />}
              <div className="flex items-baseline gap-2">
                <span className={`mono text-[10px] ${active ? "text-zinc-400" : "text-zinc-500"}`}>{tab.key}</span>
                <span className="mono text-xs font-semibold tracking-[0.2em]">{tab.label}</span>
                <span className="text-[11px] text-zinc-500">{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
        <div className="flex-1 border-r border-zinc-800" />
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-5 py-2 mono text-[10px] text-zinc-700 flex justify-between">
      <span>auto-refresh 60s</span>
    </footer>
  );
}

/* --- Panels --- */

function AviatePanel({ data }) {
  const { pulseBands = [], aviate = {}, sections } = data;
  const show = (key) => sections?.aviate?.[key]?.enabled;

  const hasAnything = pulseBands.length > 0 || show("priorities") || show("commitments") || show("risks") || show("today_agenda") || show("eyes_on_you") || show("ceo_desk") || show("claims_process") || show("horizon_trio");
  if (!hasAnything) return <TabEmpty tab="aviate" />;

  return (
    <div className="space-y-5">
      {pulseBands.map((band) => <PulseBand key={band.scope} band={band} />)}

      {show("commitments") && (
        <Section title="COMMITMENTS TO LEADERSHIP" count={aviate.commitments?.length} emptyText="No commitments logged yet.">
          {(aviate.commitments || []).map((c) => <CommitmentRow key={c.id} c={c} />)}
        </Section>
      )}

      {show("risks") && (
        <Section title="RISK REGISTER" count={aviate.risks?.length} emptyText="No risks recorded.">
          {(aviate.risks || []).map((r) => <RiskRow key={r.id} r={r} />)}
        </Section>
      )}

      {show("priorities") && (
        <Section title="THIS WEEK'S PRIORITIES" count={aviate.priorities?.length} emptyText="No priorities set.">
          {(aviate.priorities || []).map((p) => <PriorityRow key={p.id} p={p} />)}
        </Section>
      )}

      {show("today_agenda") && (
        <Section title="TODAY'S AGENDA" count={aviate.todayAgenda?.length} emptyText="No meetings loaded.">
          {(aviate.todayAgenda || []).map((a, i) => (
            <div key={i} className="px-3 py-2 bg-zinc-950 mono text-[12px] text-zinc-300">{a.title || a}</div>
          ))}
        </Section>
      )}

      {show("eyes_on_you") && (
        <Section title="EYES ON YOU" count={aviate.eyesOnYou?.length} emptyText="No pending requests." alert={aviate.eyesOnYou?.length > 0}>
          {(aviate.eyesOnYou || []).map((s) => (
            <div key={s.id} className="px-3 py-2 bg-amber-950/10 border-l-2 border-l-amber-500/70">
              <div className="flex justify-between">
                <span className="text-[12px] text-zinc-100"><span className="font-semibold">{s.member_name}</span> &middot; <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-500">{s.submission_type}</span></span>
                <span className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{timeAgo(s.submitted_at)} &middot; {s.urgency}</span>
              </div>
              <p className="text-[12px] text-zinc-300 mt-1 leading-snug">{s.content}</p>
            </div>
          ))}
        </Section>
      )}

      {show("ceo_desk") && (
        <Section title="CEO DESK" count={aviate.ceoDeskItems?.length} emptyText="No upcoming deadlines." alert={aviate.ceoDeskItems?.length > 0}>
          {(aviate.ceoDeskItems || []).map((c) => <CommitmentRow key={c.id} c={c} />)}
        </Section>
      )}

      {show("claims_process") && (
        <Section title="CLAIMS PROCESS" emptyText="No data connected.">
          {[]}
        </Section>
      )}

      {show("horizon_trio") && (
        <Section title="HORIZON TRIO" emptyText="No data connected.">
          {[]}
        </Section>
      )}

      <ActivityLog activity={data.activity} panel="aviate" />
    </div>
  );
}

function NavigatePanel({ data }) {
  const { navigate = {}, sections } = data;
  const show = (key) => sections?.navigate?.[key]?.enabled;
  const anything = show("initiatives") || show("okrs") || show("decisions");
  if (!anything) return <TabEmpty tab="navigate" />;

  return (
    <div className="space-y-5">
      {show("initiatives") && (
        <Section title="TRANSFORMATION INITIATIVES" count={navigate.initiatives?.length} emptyText="No initiatives tracked yet.">
          {(navigate.initiatives || []).map((i) => <InitiativeRow key={i.id} i={i} />)}
        </Section>
      )}
      {show("okrs") && (
        <Section title="QUARTERLY OBJECTIVES" count={navigate.okrs?.length} emptyText="No OKRs this quarter.">
          {(navigate.okrs || []).map((o) => <OkrRow key={o.id} o={o} />)}
        </Section>
      )}
      {show("decisions") && (
        <Section title="DECISIONS ON YOUR DESK" count={navigate.decisions?.length} emptyText="No open decisions." alert={navigate.decisions?.length > 0}>
          {(navigate.decisions || []).map((d) => <DecisionRow key={d.id} d={d} />)}
        </Section>
      )}

      <ActivityLog activity={data.activity} panel="navigate" />
    </div>
  );
}

function CommunicatePanel({ data }) {
  const { communicate = {}, sections } = data;
  const show = (key) => sections?.communicate?.[key]?.enabled;
  const anything = show("team") || show("comms_queue") || show("team_inbox") || show("team_rhythm") || show("succession") || show("need_you");
  if (!anything) return <TabEmpty tab="communicate" />;

  return (
    <div className="space-y-5">
      {show("team_rhythm") && communicate.teamRhythm && (
        <div className="border border-zinc-800 bg-black/30 px-4 py-2.5 flex items-center gap-6 mono text-[11px]">
          <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-semibold">Team Rhythm</span>
          <span className="text-zinc-200 tabular-nums">{communicate.teamRhythm.onCadence}/{communicate.teamRhythm.totalDirects} <span className="text-zinc-500">on cadence</span></span>
          <span className="text-zinc-200 tabular-nums">{communicate.teamRhythm.cadenceRate}%</span>
          <span className="text-zinc-200 tabular-nums">{communicate.teamRhythm.openCommitments} <span className="text-zinc-500">open commits</span></span>
          {communicate.teamRhythm.agingCommitments > 0 && (
            <span className="text-red-500 tabular-nums">{communicate.teamRhythm.agingCommitments} <span className="text-red-500/70">aging</span></span>
          )}
        </div>
      )}

      {show("need_you") && (communicate.needYou || []).length > 0 && (
        <Section title="NEED YOU" count={communicate.needYou?.length} alert>
          {(communicate.needYou || []).map((m) => (
            <div key={m.id} className="px-3 py-2 bg-amber-950/10 border-l-2 border-l-amber-500/70">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-semibold text-zinc-50">{m.name}</span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-500">{m.blocker_type}</span>
              </div>
              <p className="text-[12px] text-amber-200 mt-1">{m.blocker}</p>
            </div>
          ))}
        </Section>
      )}

      {show("team_inbox") && (communicate.inbox || []).length > 0 && (
        <Section title="TEAM INBOX" count={communicate.inbox?.length} alert>
          {(communicate.inbox || []).map((s) => <InboxRow key={s.id} s={s} />)}
        </Section>
      )}
      {show("team") && (
        <Section title="DIRECT REPORTS" count={communicate.team?.length} emptyText="No team members added yet.">
          {(communicate.team || []).map((m) => <TeamRow key={m.id} m={m} />)}
        </Section>
      )}

      {show("succession") && (
        <Section title="SUCCESSION & GROWTH" count={communicate.succession?.length} emptyText="No succession data recorded.">
          {(communicate.succession || []).filter((s) => s.retentionRisk || s.growthEdges).map((s) => (
            <div key={s.id} className="px-3 py-2.5 bg-zinc-950">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[13px] font-semibold text-zinc-50">{s.name}</p>
                {s.retentionRisk && (
                  <span className={`mono text-[10px] uppercase tracking-[0.2em] ${s.retentionRisk === "high" ? "text-red-500" : s.retentionRisk === "med" ? "text-amber-500" : "text-zinc-500"}`}>
                    risk: {s.retentionRisk}
                  </span>
                )}
              </div>
              {s.role && <p className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-0.5">{s.role}</p>}
              {s.growthEdges && <p className="text-[12px] text-zinc-400 mt-1 leading-snug">{s.growthEdges}</p>}
            </div>
          ))}
        </Section>
      )}

      {show("comms_queue") && (
        <Section title="COMMS QUEUE" count={communicate.commsQueue?.length} emptyText="No pending communications.">
          {(communicate.commsQueue || []).map((c) => <CommsRow key={c.id} c={c} />)}
        </Section>
      )}

      <ActivityLog activity={data.activity} panel="communicate" />
    </div>
  );
}

/* --- Activity Log --- */

function ActivityLog({ activity, panel }) {
  if (!activity || activity.length === 0) return null;
  const filtered = activity.filter((a) => {
    const section = (a.section || "").toLowerCase();
    if (panel === "aviate") return ["priorities", "commitments", "risks", "pulse", "metric", "agenda", "ceo_desk"].some((k) => section.includes(k));
    if (panel === "navigate") return ["initiative", "okr", "decision"].some((k) => section.includes(k));
    if (panel === "communicate") return ["team", "comms", "inbox", "morale", "checkin", "succession"].some((k) => section.includes(k));
    return false;
  });
  if (filtered.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <h2 className="mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Recent Activity</h2>
        <span className="flex-1 border-t border-zinc-900 ml-1" />
      </div>
      <div className="space-y-0.5">
        {filtered.map((a, i) => (
          <div key={a.id || i} className="flex items-baseline gap-3 px-3 py-1 mono text-[10px] text-zinc-500">
            <span className="text-zinc-700 tabular-nums shrink-0">{timeAgo(a.timestamp)}</span>
            <span className="text-zinc-500">{a.actor || a.updated_by || "system"}</span>
            <span className="text-zinc-400 truncate">{a.summary}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Provenance Helper --- */

function provenance(row) {
  if (!row.updated_by && !row.updated_at) return undefined;
  const who = row.updated_by || "unknown";
  const when = row.updated_at ? timeAgo(row.updated_at) : "unknown";
  return `Updated by ${who} \u00b7 ${when}`;
}

/* --- Components --- */

function Section({ title, count, alert = false, emptyText, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <h2 className="mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-200">{title}</h2>
        {count !== undefined && count !== null && (
          <span className={`mono text-[10px] tabular-nums transition-colors duration-150 ${alert ? "text-red-500" : "text-zinc-500"}`}>{count}</span>
        )}
        <span className="flex-1 border-t border-zinc-800 ml-1" />
      </div>
      <div className="border border-zinc-800 divide-y divide-zinc-900 bg-zinc-950">
        {hasChildren ? children : (
          <div className="px-3 py-4 text-center">
            <p className="mono text-[11px] text-zinc-500 uppercase tracking-[0.2em]">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabEmpty({ tab }) {
  const messages = {
    aviate: "No sections configured yet.",
    navigate: "No sections configured yet.",
    communicate: "No sections configured yet.",
  };
  return (
    <div className="py-16 text-center">
      <p className="mono text-[11px] text-zinc-500 uppercase tracking-[0.2em]">{messages[tab]}</p>
    </div>
  );
}

function PulseBand({ band }) {
  return (
    <div className={`border border-zinc-800 bg-black/30 border-l-2 ${SCOPE_ACCENT[band.scope] || "border-l-zinc-700"}`}>
      <div className="flex items-center justify-between px-3 py-1 border-b border-zinc-800/70 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-200">{band.scope}</span>
          <span className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{band.label}</span>
        </div>
        <span className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{band.metrics.length} metrics</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-zinc-800/70">
        {band.metrics.map((m) => <PulseCell key={m.key} metric={m} />)}
      </div>
    </div>
  );
}

function PulseCell({ metric }) {
  const stateColor = {
    live: "bg-emerald-400", empty: "bg-zinc-600", pending: "bg-amber-400",
  }[metric.state] || "bg-zinc-700";
  const stateLabel = { live: "live", empty: "no data", pending: "pending" }[metric.state];

  return (
    <div
      className="px-3 pt-2 pb-2 hover:bg-zinc-900/50 text-left relative group"
      title={metric.definition || metric.label}
    >
      <div className="flex items-center justify-between">
        <p className="mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{metric.label}</p>
        <span className={`w-1.5 h-1.5 rounded-full ${stateColor}`} aria-label={stateLabel} />
      </div>
      <div className="mt-0.5 min-h-[28px]">
        {metric.state === "live" ? (
          <span className="mono text-[20px] leading-none font-semibold tabular-nums text-zinc-100">
            {metric.valueDisplay ?? metric.value}
            {metric.unit && !metric.valueDisplay && <span className="text-[10px] text-zinc-500 ml-0.5">{metric.unit}</span>}
          </span>
        ) : (
          <span className="mono text-[16px] text-zinc-700">--</span>
        )}
      </div>
      <p className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-0.5">
        {metric.state === "live" ? (
          <>
            {timeAgo(metric.asOf)} &middot; {metric.updatedBy || metric.sourceType}
          </>
        ) : metric.state === "pending" ? (
          <>awaiting {metric.sourceType}</>
        ) : (
          <>no data yet</>
        )}
      </p>
    </div>
  );
}

function PriorityRow({ p }) {
  const isStale = p.carried_weeks >= 2 && p.status !== "done" && p.status !== "cut";
  const isDone = p.status === "done" || p.status === "cut";
  return (
    <div className={`flex items-center gap-3 px-3 py-2 hover:bg-zinc-900/40 transition-colors ${isStale ? "bg-red-950/10 border-l-2 border-l-red-500/60" : "bg-zinc-950"}`} title={provenance(p)}>
      <span className="mono text-[11px] text-zinc-500 tabular-nums w-5 shrink-0 text-right">{p.rank}</span>
      <p className={`flex-1 text-[13px] leading-snug line-clamp-2 ${isDone ? "text-zinc-500 line-through" : "text-zinc-100"}`}>{p.title}</p>
      {p.owner && <span className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{p.owner}</span>}
      {p.carried_weeks > 0 && (
        <span className={`mono text-[10px] uppercase tracking-[0.2em] ${p.carried_weeks >= 2 ? "text-red-500" : "text-amber-500"}`}>{p.carried_weeks}w</span>
      )}
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 w-14 text-right">{p.status.replace("_", " ")}</span>
    </div>
  );
}

function CommitmentRow({ c }) {
  const daysOut = Math.ceil((new Date(c.deadline) - new Date()) / 86400000);
  const statusColor = { on_track: "text-emerald-400", at_risk: "text-amber-500", behind: "text-red-500", met: "text-emerald-400" }[c.status] || "text-zinc-400";
  return (
    <div className="px-3 py-2.5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors" title={provenance(c)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-semibold text-zinc-50">{c.label}</p>
        <span className={`mono text-[10px] uppercase tracking-[0.2em] ${statusColor}`}>{c.status.replace("_", " ")}</span>
      </div>
      <div className="flex items-baseline gap-3 mt-1 mono text-[11px]">
        <span className="tabular-nums text-zinc-100">{c.current_value}{c.unit}</span>
        <span className="text-zinc-500">/ commit {c.commit_value}{c.unit}</span>
      </div>
      <div className="mt-1 flex justify-between mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
        <span>{c.stakeholder}</span>
        <span className={daysOut < 30 ? "text-amber-500" : ""}>{daysOut}d to judgment</span>
      </div>
    </div>
  );
}

function RiskRow({ r }) {
  const sevColor = { high: "text-red-500", med: "text-amber-500", low: "text-zinc-400" }[r.severity];
  return (
    <div className={`px-3 py-2 bg-zinc-950 hover:bg-zinc-900/40 transition-colors ${r.severity === "high" ? "border-l-2 border-l-red-500/60" : ""}`} title={provenance(r)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] text-zinc-100 leading-snug">{r.title}</p>
        <span className={`mono text-[10px] uppercase tracking-[0.2em] shrink-0 ${sevColor}`}>{r.severity}/{r.likelihood}</span>
      </div>
      <div className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1 flex justify-between">
        <span>{r.owner}</span>
        <span className="text-zinc-500 truncate max-w-[50%]">{r.mitigation}</span>
      </div>
    </div>
  );
}

function InitiativeRow({ i }) {
  return (
    <div className="px-3 py-2.5 bg-zinc-950" title={provenance(i)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-semibold text-zinc-50">{i.name}</p>
        <div className="flex items-center gap-3 mono text-[11px]">
          {i.investment && <span className="text-zinc-300 tabular-nums">${i.investment}M</span>}
          {i.horizon && <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">{i.horizon}</span>}
        </div>
      </div>
      <div className="relative w-full h-1 bg-zinc-900 mt-2">
        <div className={`h-full ${i.progress >= 70 ? "bg-emerald-500" : i.progress >= 40 ? "bg-blue-500" : "bg-zinc-500"}`} style={{ width: `${i.progress}%` }} />
        {i.pace !== null && i.pace !== undefined && (
          <div className="absolute top-[-2px] bottom-[-2px] w-[1px] bg-zinc-300" style={{ left: `${i.pace}%` }} />
        )}
      </div>
      <div className="flex justify-between mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1">
        <span>{i.owner_name || "unowned"}</span>
        <span className="tabular-nums">{i.progress}% / pace {i.pace}%</span>
      </div>
    </div>
  );
}

function OkrRow({ o }) {
  const statusColor = { on_track: "text-emerald-400", at_risk: "text-amber-500", behind: "text-red-500" }[o.status];
  return (
    <div className="px-3 py-2 bg-zinc-950" title={provenance(o)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[12px] text-zinc-100 leading-snug">{o.objective}</p>
        <span className={`mono text-[10px] uppercase tracking-[0.2em] shrink-0 ${statusColor}`}>{o.status.replace("_", " ")}</span>
      </div>
      <div className="relative w-full h-1 bg-zinc-900 mt-1.5">
        <div className={`h-full ${statusColor.replace("text-", "bg-")}`} style={{ width: `${o.progress}%` }} />
      </div>
      <div className="flex justify-between mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1">
        <span>{o.owner}</span>
        <span className="tabular-nums">{o.progress}% / pace {o.pace}%</span>
      </div>
    </div>
  );
}

function DecisionRow({ d }) {
  return (
    <div className="px-3 py-2.5 bg-amber-950/10 border-l-2 border-l-amber-500/70" title={provenance(d)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] text-amber-50 leading-snug font-semibold">{d.title}</p>
        {d.stakes && <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-500">{d.stakes}</span>}
      </div>
      {d.context && <p className="text-[12px] text-zinc-400 mt-1 leading-snug">{d.context}</p>}
      <div className="flex gap-4 mt-2 mono text-[10px] uppercase tracking-[0.2em]">
        {d.deadline && <span className="text-amber-500">due {new Date(d.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
        {d.age_days !== undefined && <span className={d.age_days >= 14 ? "text-red-500" : "text-zinc-500"}>{d.age_days}d on desk</span>}
      </div>
    </div>
  );
}

function TeamRow({ m }) {
  const energyColor = { 1: "bg-amber-400", 2: "bg-zinc-500", 3: "bg-emerald-400" };
  const latestEnergy = m.moraleHistory?.slice(-1)[0]?.energy;
  const hasBlocker = m.blocker && m.blocker_type !== "none";
  return (
    <div className={`px-3 py-2.5 hover:bg-zinc-900/40 transition-colors ${hasBlocker ? "bg-amber-950/10 border-l-2 border-l-amber-500/70" : "bg-zinc-950"}`} title={provenance(m)}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${energyColor[latestEnergy] || "bg-zinc-700"}`} />
          <p className="text-[13px] font-semibold text-zinc-50">{m.name}</p>
        </div>
        {m.role && <span className="mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{m.role}</span>}
      </div>
      {m.focus && <p className="text-[12px] text-zinc-400 mt-1 leading-snug">{m.focus}</p>}
      {hasBlocker && (
        <p className="text-[12px] text-amber-200 mt-1.5">
          <span className="mono text-[10px] text-amber-500 uppercase tracking-[0.2em] mr-1.5">need</span>
          {m.blocker}
        </p>
      )}
    </div>
  );
}

function CommsRow({ c }) {
  const urgent = c.urgency === "urgent";
  return (
    <div className={`px-3 py-2 ${urgent ? "bg-red-950/10 border-l-2 border-l-red-500/70" : "bg-zinc-950"}`}>
      <div className="flex justify-between">
        <p className="text-[13px] font-semibold text-zinc-50">{c.recipient}</p>
        {urgent && <span className="mono text-[10px] uppercase tracking-[0.2em] text-red-500">urgent</span>}
      </div>
      <p className="text-[12px] text-zinc-400 mt-0.5 leading-snug">{c.subject}</p>
    </div>
  );
}

function InboxRow({ s }) {
  const typeColor = { blocker: "text-red-500", progress: "text-emerald-400", decision: "text-amber-500", fyi: "text-zinc-400" };
  return (
    <div className="px-3 py-2 bg-amber-950/10 border-l-2 border-l-amber-500/70">
      <div className="flex justify-between">
        <span className="text-[12px] text-zinc-100"><span className="font-semibold">{s.member_name}</span> &middot; <span className={`mono text-[10px] uppercase tracking-[0.2em] ${typeColor[s.submission_type]}`}>{s.submission_type}</span></span>
        <span className="mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{timeAgo(s.submitted_at)} &middot; {s.urgency}</span>
      </div>
      <p className="text-[12px] text-zinc-300 mt-1 leading-snug">{s.content}</p>
    </div>
  );
}
