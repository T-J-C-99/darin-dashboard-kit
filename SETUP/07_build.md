# Step 7 — Build from Spec

## What to do

This is where Claude Code does the actual work. The user watches and confirms.

### 7.1 — Database setup

Depending on hosting decision from Step 1:

**If cloud (Neon):**
- Check if DATABASE_URL is set in `.env.local`. If not, walk them through Neon setup (read `DEPLOY/cloud/01_neon.md` inline).
- Once DATABASE_URL is set, run the schema: execute `schema.sql` against the database.
- Verify tables were created.

**If local (Postgres.app):**
- Read `DEPLOY/local/01_postgres_app.md` and walk them through it.
- Run schema.sql locally.

**If pending_IT:**
- Tell them: "We can't set up the database yet since you're waiting on IT. But I can prepare everything else. When IT approves, tell me and we'll run this step."
- Skip to 7.3.

If anything in this step shows an error you don't understand, text Tom with a screenshot.

#### Database save point

"Database is set up. Step 7 of 8 in progress. Want to take a break before we move to deployment?"

If they want to pause, update setup step and stop:
```sql
UPDATE app_config SET value = '"07_build_db_done"'::jsonb WHERE key = 'setup_step';
```

### 7.2 — Seed data from spec

Read `SETUP/SPEC.md` and execute SQL inserts for every piece of data the user provided.

**IMPORTANT: Insert team_members before initiatives (initiatives reference team members as owners).**

1. **app_config** — update company_name, tabs_enabled, setup_step
2. **section_config** — enable/disable each section per the spec
3. **metrics_config** — insert every metric with label, scope, family, unit, target, direction, source_type, definition
4. **metric_values** — insert current values for each metric that has one
5. **commitments_to_board** — insert each commitment
6. **risks** — insert each risk
7. **priorities** — insert current week priorities
8. **team_members** — insert each person with full profile
9. **morale_history** — insert current morale snapshot for each person
10. **commitments** — insert open commitments between Darin and directs
11. **initiatives** — insert each initiative
12. **okrs** — insert OKRs
13. **decisions_pending** — insert decisions
14. **comms_queue** — insert pending comms

Use the Neon serverless client or raw SQL via the connection string.

After seeding, tell the user: "Data is in. Let me start the dev server so you can see it."

### 7.3 — Start local dev server

Run: `cd app && npm install && npm run dev`

Tell the user: "Open http://localhost:3333 in your browser. You should see your dashboard with the data you just gave me."

Wait for confirmation that it looks right. If something is wrong, debug.

### 7.4 — Mark setup complete

Once the user confirms the dashboard looks correct:

```sql
UPDATE app_config SET value = 'true'::jsonb WHERE key = 'setup_complete';
UPDATE app_config SET value = '"done"'::jsonb WHERE key = 'setup_step';
```

### 7.5 — Issue capture links (if enabled)

If the user opted into team capture:

For each team member with capture_enabled:
1. Generate a random token: `openssl rand -hex 24`
2. Insert into team_access_tokens
3. Construct the URL: `[domain or localhost:3333]/capture/[token]`
4. Show the user: "Here's [Name]'s capture link. Send it to them via text or email. They bookmark it on their phone."

If hosting is local, note: "These links only work when your Mac is running the dev server."
If hosting is cloud, note: "These links work anytime once deployed."

### 7.6 — Deploy (if cloud)

If hosting is cloud:
- Read `DEPLOY/cloud/02_vercel.md` and walk them through deploying.
- After deploy, verify the live URL works.
- Re-issue capture links using the Vercel domain instead of localhost.

If hosting is local:
- Read `DEPLOY/local/02_daily_startup.md` so they know how to open the dashboard each day.

If anything during deployment shows an error you don't understand, text Tom with a screenshot.

### Done

Update setup step:
```sql
UPDATE app_config SET value = '"07_build_complete"'::jsonb WHERE key = 'setup_step';
```

Tell the user: "Your dashboard is live. Step 7 of 8 complete."

Read `SETUP/08_next_steps.md` for the closing message with the full command reference.
