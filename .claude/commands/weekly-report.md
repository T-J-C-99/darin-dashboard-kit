# /weekly-report -- Generate Weekly Executive Summary

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Data to gather

Pull data from the past 7 days and generate a short summary the user can paste into an email to their boss.

```sql
-- Priorities completed vs carried
SELECT status, COUNT(*) FROM priorities
WHERE week_start >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY status;

-- Metrics that moved (latest vs previous value)
SELECT mc.label, mv1.value as current, mv2.value as previous
FROM metrics_config mc
JOIN metric_values mv1 ON mv1.metric_key = mc.key
LEFT JOIN metric_values mv2 ON mv2.metric_key = mc.key AND mv2.as_of < mv1.as_of
WHERE mc.enabled = true AND mv1.as_of >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY mv1.as_of DESC;

-- Team blockers resolved and new
SELECT tm.name, tm.blocker, tm.blocker_type FROM team_members tm WHERE tm.blocker IS NOT NULL;

-- Inbox processed
SELECT status, COUNT(*) FROM team_submissions
WHERE reviewed_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY status;

-- Decisions made
SELECT title, status FROM decisions_pending
WHERE status = 'decided' AND created_at >= CURRENT_DATE - INTERVAL '14 days';

-- Activity log highlights
SELECT summary, timestamp FROM activity_log
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY timestamp DESC LIMIT 10;
```

## Output format

Write a short executive summary (5-8 lines max). Tone: factual, concise, no fluff. Structure:

> **Week of [date range]**
>
> Priorities: [N] completed, [N] carried, [N] blocked.
> Key metrics: [metric] moved from X to Y. [metric] held at X.
> Team: [N] blockers resolved. [N] new. [names if relevant.]
> Decisions: [decided X]. [still pending: Y].
> Inbox: [N] submissions processed this week.
> Next week: [top 1-2 priorities or open items].

Tell the user: "Here's your weekly summary. Copy and paste, or I can adjust the tone."
