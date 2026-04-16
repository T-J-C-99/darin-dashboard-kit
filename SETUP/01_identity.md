# Step 1 — Identity & Context

## What to do

Ask these questions one at a time. Don't overwhelm with a wall of questions. Conversational pace.

### 1.1 — Who are you

Ask name first. Wait for answer. Then title. Then company name. Then one-line company description. Never combine these into one message.

Save to ANSWERS.md under `## Identity`.

### 1.2 — Reporting structure

Ask:
- Who do you report to? (name + title — this person may appear on "CEO desk" and "commitments")
- How many direct reports do you have?
- What are their names and roles? (We'll go deeper on each person later in the Communicate step.)

Save under `## Reporting Structure`.

After saving, tell the user: "Good — I know who you are and who your team is. Three quick setup questions left in this section."

### 1.3 — IT & hosting decision

Explain clearly:

> Cloud = real URL you can bookmark on any device. Free.
> Local = only works on your Mac when it's running.
> Not sure? I'll draft an email to IT.

Ask which path:
- A: Cloud (I have authority, or my company is fine with it)
- B: Local only (keep everything on my Mac)
- C: I need to check with IT first

Save under `## Hosting Decision`.

If they chose C:
- Read `DEPLOY/ask_IT/01_email_template.md` and help them draft the email
- Save a pause marker: `hosting_decision: pending_IT`
- Tell them: "No problem. We can keep going with everything else — you'll just skip the deploy step until IT answers. When they do, tell me and I'll pick up from there."

### 1.4 — Collaboration

Explain:

> The person who set this up for you can push fixes remotely if you get stuck. Want to add them as a collaborator on your code? They'd be able to see your code and push changes, but NOT your database or passwords.

If yes, note it in ANSWERS.md: `collaborator: yes`. This gets executed during the deploy step.

If no or later, note: `collaborator: later`.

After their answer to 1.3, update the setup step in the database:
```sql
UPDATE app_config SET value = '"01_identity"'::jsonb WHERE key = 'setup_step';
```

### 1.5 — What tabs do you want

Explain the three tabs again briefly:
- **Aviate** — day-to-day ops, KPIs, priorities, blockers
- **Navigate** — transformation, strategy, capital deployment, big decisions
- **Communicate** — your team, their state, 1:1s, comms queue

Ask: "Do you want all three, or would you prefer to start with fewer and add more later?" Most executives want all three, but some may only care about one or two at first.

Save under `## Tabs Enabled`.

### Done

Tell the user: "Step 1 of 8 complete."

Update setup step:
```sql
UPDATE app_config SET value = '"01_identity_complete"'::jsonb WHERE key = 'setup_step';
```

Move to Step 2. Read `SETUP/02_aviate.md` and continue.
