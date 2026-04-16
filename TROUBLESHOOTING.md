# Troubleshooting

Claude: when the user reports a problem, use this guide to diagnose and fix.

## Quick diagnostic

Say "run /diagnostic" to Claude. It checks everything and gives you a plain-English report you can screenshot and text to Tom.

## "DATABASE_URL is not defined" or "Cannot connect to database"

Your `.env.local` file is missing or empty. In VS Code, open the file explorer (left sidebar), look for `.env.local` in the `app` folder. If it doesn't exist, copy `.env.example` to `.env.local` and fill in your Neon connection string.

## "Port 3333 is already in use"

A previous dev server didn't shut down cleanly. Run: `lsof -ti:3333 | xargs kill` then try `npm run dev` again.

## "The dashboard shows an error"

1. Check if dev server is running: `lsof -i :3333`
2. If not: `cd app && npm run dev`
3. Check `.env.local` has DATABASE_URL set
4. Check DB is reachable: run a test query
5. Check schema was run: `SELECT COUNT(*) FROM app_config;` — if table doesn't exist, re-run schema.sql

## "The dashboard says setup pending"

The wizard hasn't run or didn't complete. Check:
```sql
SELECT value FROM app_config WHERE key = 'setup_complete';
```
If `false`, run: `UPDATE app_config SET value = 'true'::jsonb WHERE key = 'setup_complete';`

Or re-run the wizard: `/wizard`

## "A section is missing"

Check if it's enabled:
```sql
SELECT * FROM section_config WHERE tab = '[tab]' AND section_key = '[key]';
```
If `enabled = false`, enable it:
```sql
UPDATE section_config SET enabled = true WHERE tab = '[tab]' AND section_key = '[key]';
```

## "A metric shows no data / dash"

Check metric_values:
```sql
SELECT * FROM metric_values WHERE metric_key = '[key]' ORDER BY as_of DESC LIMIT 5;
```
If empty, insert a value. If the config says `source_type = 'future'`, it'll show "pending" intentionally.

## "Capture links don't work"

1. Check the token exists and isn't revoked:
```sql
SELECT * FROM team_access_tokens WHERE token = '[token]';
```
2. If revoked, issue a new one
3. If local-only, the dev server must be running for links to work

## "Changes I made aren't showing up"

- Refresh the browser (Cmd+R)
- Dashboard auto-refreshes every 60 seconds
- If deployed on Vercel: data changes hit the DB directly, no redeploy needed
- If something truly isn't updating, check the DB query in route.js

## "I broke something and want to go back"

- Run `git log --oneline -10` to see recent changes
- Run `git diff` to see what changed
- To undo the last change: `git checkout -- .` (reverts all uncommitted changes)
- To go back to a specific commit: `git reset --hard [commit-hash]`

**WARNING:** `git checkout -- .` and `git reset --hard` permanently delete all unsaved code changes. This does NOT affect your database data. Only do this if Claude confirms it's safe, or if Tom tells you to.

## "My team member says the capture form shows an error"

Common causes:
1. Link expired -- issue a new one: `/issue-capture-link [name]`
2. Link was revoked -- same fix
3. Dev server not running (local-only mode) -- start it: `cd app && npm run dev`
4. Ask them to screenshot the error and send it to you. Then tell Claude: "my team member got this error on their capture form" and paste the screenshot.

## "I'm stuck and can't figure it out"

Text Tom. He has tools that can push a fix straight to your repo.
