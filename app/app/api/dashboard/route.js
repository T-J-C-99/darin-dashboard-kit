import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

/**
 * Config-driven dashboard response.
 * Nothing renders unless enabled in section_config + metrics_config.
 * No dummy data. Empty tables → dignified empty states on the client.
 */
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkDashboardAuth(request) {
  const pw = process.env.DASHBOARD_PASSWORD;
  if (!pw) return null;
  const expected = await sha256(pw + "_ops_auth_token");
  const cookie = request.cookies?.get("ops_auth")?.value;
  if (cookie !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  const authError = await checkDashboardAuth(request);
  if (authError) return authError;

  const sql = getDb();

  try {
    // App-level config
    const appConfigRows = await sql`SELECT key, value FROM app_config`;
    const appConfig = Object.fromEntries(appConfigRows.map((r) => [r.key, r.value]));

    if (appConfig.setup_complete !== true) {
      return Response.json({
        setupComplete: false,
        setupStep: appConfig.setup_step || "00_welcome",
        companyName: appConfig.company_name || "Your Company",
        message: "Setup not complete — run /wizard in Claude Code",
      });
    }

    // Sections
    const sectionRows = await sql`
      SELECT tab, section_key, label, enabled, display_order
      FROM section_config ORDER BY tab, display_order
    `;
    const sections = {};
    sectionRows.forEach((r) => {
      sections[r.tab] = sections[r.tab] || {};
      sections[r.tab][r.section_key] = { enabled: r.enabled, label: r.label, order: r.display_order };
    });

    const isEnabled = (tab, key) => sections[tab]?.[key]?.enabled === true;

    // Metrics config + latest values + drivers
    const metricsConfig = await sql`
      SELECT * FROM metrics_config WHERE enabled = TRUE ORDER BY scope, priority_rank
    `;

    const metricKeys = metricsConfig.map((m) => m.key);
    const latestValues = metricKeys.length
      ? await sql`
          SELECT DISTINCT ON (metric_key) metric_key, value, value_display, as_of, source, updated_by
          FROM metric_values
          WHERE metric_key = ANY(${metricKeys})
          ORDER BY metric_key, as_of DESC
        `
      : [];
    const valueByKey = Object.fromEntries(latestValues.map((v) => [v.metric_key, v]));

    const trendValues = metricKeys.length
      ? await sql`
          SELECT metric_key, value, as_of
          FROM metric_values
          WHERE metric_key = ANY(${metricKeys})
          ORDER BY metric_key, as_of DESC
        `
      : [];
    const trendByKey = {};
    trendValues.forEach((v) => {
      trendByKey[v.metric_key] = trendByKey[v.metric_key] || [];
      trendByKey[v.metric_key].push(Number(v.value));
    });
    Object.keys(trendByKey).forEach((k) => (trendByKey[k] = trendByKey[k].slice(0, 12).reverse()));

    const drivers = metricKeys.length
      ? await sql`
          SELECT metric_key, factor, impact, unit
          FROM metric_drivers
          WHERE metric_key = ANY(${metricKeys})
          ORDER BY metric_key, impact
        `
      : [];
    const driversByKey = {};
    drivers.forEach((d) => {
      driversByKey[d.metric_key] = driversByKey[d.metric_key] || [];
      driversByKey[d.metric_key].push({ factor: d.factor, impact: Number(d.impact), unit: d.unit });
    });

    // Assemble pulse bands
    const scopeLabels = {
      REALTIME: { label: "last 60m", section: "pulse_realtime" },
      LEADING: { label: "operational leads", section: "pulse_leading" },
      MTD: { label: "month-to-date", section: "pulse_mtd" },
      QTD: { label: "quarter-to-date", section: "pulse_qtd" },
      YTD: { label: "year-to-date", section: "pulse_ytd" },
    };
    const pulseBands = [];
    Object.entries(scopeLabels).forEach(([scope, meta]) => {
      if (!isEnabled("aviate", meta.section)) return;
      const metrics = metricsConfig
        .filter((m) => m.scope === scope)
        .map((m) => {
          const latest = valueByKey[m.key];
          const trend = trendByKey[m.key] || [];
          return {
            key: m.key,
            label: m.label,
            family: m.family,
            unit: m.unit,
            target: m.target !== null ? Number(m.target) : undefined,
            direction: m.direction,
            definition: m.definition,
            sourceType: m.source_type,
            value: latest ? Number(latest.value) : null,
            valueDisplay: latest?.value_display ?? null,
            trend,
            asOf: latest?.as_of ?? null,
            updatedBy: latest?.updated_by ?? null,
            drivers: driversByKey[m.key] || [],
            pairedKey: m.paired_key,
            state: !latest ? (m.source_type === "future" ? "pending" : "empty") : "live",
          };
        });
      if (metrics.length > 0) {
        pulseBands.push({ scope, label: meta.label, metrics });
      }
    });

    // Aviate data
    const aviate = {};
    if (isEnabled("aviate", "priorities")) {
      const rows = await sql`
        SELECT * FROM priorities
        WHERE week_start = (SELECT MAX(week_start) FROM priorities)
        ORDER BY rank ASC
      `;
      aviate.priorities = rows;
      aviate.staleItems = rows.filter(
        (p) => p.carried_weeks >= 2 && p.status !== "done" && p.status !== "cut"
      );
    }
    if (isEnabled("aviate", "commitments")) {
      aviate.commitments = await sql`SELECT * FROM commitments_to_board ORDER BY deadline ASC`;
    }
    if (isEnabled("aviate", "risks")) {
      aviate.risks = await sql`
        SELECT * FROM risks ORDER BY
          CASE severity WHEN 'high' THEN 1 WHEN 'med' THEN 2 ELSE 3 END
      `;
    }

    // TODO: today_agenda -- no backing table. Calendar integration TBD.
    // Populate via manual entry or future Google Calendar / Outlook integration.
    if (isEnabled("aviate", "today_agenda")) {
      aviate.todayAgenda = [];
    }

    // eyes_on_you: pending submissions waiting on Darin's action
    if (isEnabled("aviate", "eyes_on_you")) {
      aviate.eyesOnYou = await sql`
        SELECT ts.*, tm.name as member_name
        FROM team_submissions ts JOIN team_members tm ON ts.member_id = tm.id
        WHERE ts.status = 'pending' AND ts.urgency IN ('high', 'normal')
        ORDER BY CASE ts.urgency WHEN 'high' THEN 0 ELSE 1 END, ts.submitted_at DESC
        LIMIT 10
      `;
    }

    // ceo_desk: board commitments due within 14 days
    if (isEnabled("aviate", "ceo_desk")) {
      aviate.ceoDeskItems = await sql`
        SELECT * FROM commitments_to_board
        WHERE deadline < NOW() + INTERVAL '14 days' AND status != 'met'
        ORDER BY deadline ASC
        LIMIT 5
      `;
    }

    // TODO: claims_process -- future integration. No backing table yet.
    if (isEnabled("aviate", "claims_process")) {
      aviate.claimsProcess = [];
    }

    // TODO: horizon_trio -- future integration. No backing table yet.
    if (isEnabled("aviate", "horizon_trio")) {
      aviate.horizonTrio = [];
    }

    // Navigate data
    const navigate = {};
    if (isEnabled("navigate", "initiatives")) {
      navigate.initiatives = await sql`
        SELECT i.*, tm.name as owner_name
        FROM initiatives i LEFT JOIN team_members tm ON i.owner_id = tm.id
        WHERE i.status = 'active' ORDER BY i.updated_at DESC
      `;
    }
    if (isEnabled("navigate", "okrs")) {
      navigate.okrs = await sql`SELECT * FROM okrs ORDER BY id`;
    }
    if (isEnabled("navigate", "decisions")) {
      navigate.decisions = await sql`
        SELECT * FROM decisions_pending WHERE status = 'open' ORDER BY deadline ASC NULLS LAST
      `;
    }

    // Communicate data
    const communicate = {};
    if (isEnabled("communicate", "team")) {
      const team = await sql`SELECT * FROM team_members ORDER BY name`;
      const memberIds = team.map((t) => t.id);
      if (memberIds.length > 0) {
        const morale = await sql`
          SELECT * FROM morale_history WHERE member_id = ANY(${memberIds}) ORDER BY member_id, week_offset
        `;
        const checkins = await sql`
          SELECT * FROM checkins WHERE member_id = ANY(${memberIds}) ORDER BY occurred_at DESC
        `;
        const commits = await sql`
          SELECT * FROM commitments WHERE member_id = ANY(${memberIds}) ORDER BY due_date ASC
        `;
        team.forEach((t) => {
          t.moraleHistory = morale.filter((m) => m.member_id === t.id).map((m) => ({
            w: m.week_offset, energy: m.energy, confidence: m.confidence,
          }));
          t.checkins = checkins.filter((c) => c.member_id === t.id);
          t.commitments = commits.filter((c) => c.member_id === t.id);
        });
      }
      communicate.team = team;
      communicate.teamBlockers = team.filter((t) => t.blocker && t.blocker_type !== "none");

      // team_rhythm: computed from team cadence JSONB data
      if (isEnabled("communicate", "team_rhythm")) {
        const total = team.length;
        const onCadence = team.filter((t) => t.cadence && t.cadence.missed === 0).length;
        const openCommitments = team.reduce((sum, t) => sum + (t.commitments || []).filter((c) => c.status !== "done").length, 0);
        const agingCommitments = team.reduce((sum, t) => sum + (t.commitments || []).filter((c) => c.status !== "done" && c.due_date && new Date(c.due_date) < new Date()).length, 0);
        communicate.teamRhythm = {
          totalDirects: total,
          onCadence,
          cadenceRate: total > 0 ? Math.round((onCadence / total) * 100) : 0,
          openCommitments,
          agingCommitments,
        };
      }

      // succession: team members with retention risk and growth edges
      if (isEnabled("communicate", "succession")) {
        communicate.succession = team.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          retentionRisk: t.retention_risk,
          growthEdges: t.growth_edges,
        }));
      }

      // need_you: team blockers requiring Darin's action (mirrors teamBlockers)
      if (isEnabled("communicate", "need_you")) {
        communicate.needYou = communicate.teamBlockers;
      }
    }
    if (isEnabled("communicate", "comms_queue")) {
      communicate.commsQueue = await sql`
        SELECT * FROM comms_queue WHERE status = 'pending'
        ORDER BY CASE urgency WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END, due_date ASC NULLS LAST
      `;
    }
    if (isEnabled("communicate", "team_inbox")) {
      communicate.inbox = await sql`
        SELECT ts.*, tm.name as member_name
        FROM team_submissions ts JOIN team_members tm ON ts.member_id = tm.id
        WHERE ts.status = 'pending' ORDER BY ts.submitted_at DESC LIMIT 20
      `;
    }

    // Activity
    const activity = await sql`SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 15`;

    return Response.json({
      setupComplete: true,
      appConfig,
      sections,
      pulseBands,
      aviate,
      navigate,
      communicate,
      activity,
      currentWeek: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    const body =
      process.env.NODE_ENV === "production"
        ? { error: "Failed to fetch dashboard data" }
        : {
            error: "Failed to fetch dashboard data",
            detail: error.message,
            hint: "Check DATABASE_URL is set and schema.sql has been run.",
          };
    return Response.json(body, { status: 500 });
  }
}
