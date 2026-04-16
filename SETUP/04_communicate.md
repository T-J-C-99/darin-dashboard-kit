# Step 4 — Communicate (Lead People)

Skip if user did not enable Communicate.

## What to do

Explain: "Communicate is your people view. Your direct reports, how they're doing, what they need from you, and your 1:1 rhythm. It helps you show up prepared for every conversation and catch signals before they become problems."

### 4.1 — Direct reports + cadence

For each person they named in Step 1, collect everything in a single loop. One person at a time:
- Name (confirm from Step 1)
- What are they focused on right now? (one line)
- Energy level: high / medium / low
- Are they blocked on anything right now?
- 1:1 cadence: weekly / biweekly / sporadic?
- When was the last one?
- Are they on streak (consecutive on-schedule) or have you missed some?

Save each person under `## Communicate > Team > [Name]` including cadence info.

### 4.2 — Comms queue

Explain: "Things you need to send, say, or schedule. Emails to your boss, follow-up messages to your team, meeting invites. Each has a recipient, subject, channel (email/slack/meeting/phone), and urgency."

Ask: "Do you want a comms queue? If yes, is there anything pending right now?"

Save under `## Communicate > Comms Queue`.

### 4.3 — Team inbox (magic-link capture)

Explain:

> Right now, when your team needs a decision or is blocked, that signal competes with everything else in Slack and email. Most of it gets lost.
>
> This dashboard gives each direct a private link. They tap it, fill a 30-second form, and it lands in your inbox here. You review before anything touches the dashboard.
>
> Want to set this up? You can start with one person and expand later, or enable it for everyone now.

If they say yes, then explain the mechanics: "Each person gets a bookmarkable link on their phone. Submissions show up in your dashboard inbox. You accept, refine, or discard each one."

If yes:
- Ask which team members should get capture links
- Note: `capture_enabled: [names]`

If not now: `capture_enabled: none (deferred)`. Tell them it's always there when they're ready.

Save under `## Communicate > Team Inbox`.

### 4.4 — Succession planning

Ask: "Do you want a succession/talent depth view? It shows each direct's retention risk and growth trajectory at a glance."

If yes, note it. The data is already collected from 4.1.

Save under `## Communicate > Succession`.

### 4.5 — Deepen profiles (optional)

Tell the user:

> Now that the basics are in, want to add more detail to anyone's profile? Strengths, growth areas, retention risk, succession notes? We can do this now or come back to it anytime -- just say "deepen [name]".

If they want to deepen now, for each person they name, ask:
- Strengths (2-3)
- Growth edges (1-2 coaching areas)
- Confidence level: high / medium / low
- Retention risk: low / medium / high
- Succession notes (optional)
- Outstanding commitments between you (things you promised them, or they promised you)

Save updates under the existing `## Communicate > Team > [Name]` entry.

If they skip, that's fine. Move on.

### Save point

Tell the user: "Communicate is configured. 3 of 3 main sections done. Step 4 of 8 complete."

Summarize Communicate choices. Offer break.

Update setup step:
```sql
UPDATE app_config SET value = '"04_communicate_complete"'::jsonb WHERE key = 'setup_step';
```

If continue, read `SETUP/05_data_sources.md`.
