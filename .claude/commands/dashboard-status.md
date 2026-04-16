# /dashboard-status -- System Health Check

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Checks

Run these checks and report results:

```sql
-- Sections enabled
SELECT COUNT(*) as enabled_sections FROM section_config WHERE enabled = true;

-- Metrics tracked
SELECT COUNT(*) as enabled_metrics FROM metrics_config WHERE enabled = true;

-- Team members
SELECT COUNT(*) as team_count FROM team_members;

-- Last activity
SELECT summary, timestamp FROM activity_log ORDER BY timestamp DESC LIMIT 1;

-- Active capture tokens
SELECT COUNT(*) as active_tokens FROM team_access_tokens WHERE revoked = false AND expires_at > NOW();

-- Pending submissions
SELECT COUNT(*) as pending FROM team_submissions WHERE status = 'pending';

-- App config check
SELECT key, value FROM app_config WHERE key IN ('company_name', 'setup_complete', 'vercel_domain');
```

Report format:

> Dashboard is healthy. [N] sections enabled, [N] metrics tracked, [N] team members, last activity [time ago].
> [N] active capture tokens, [N] pending submissions.
> Setup: [complete/incomplete]. Company: [name].

If any check fails (e.g., table doesn't exist, no connection), report the specific failure and suggest running the schema or checking DATABASE_URL.
