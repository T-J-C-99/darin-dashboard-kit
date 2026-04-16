# Step 3 — Navigate (Plan & Build)

Skip if user did not enable Navigate.

## What to do

Explain: "Navigate is your strategic view. Transformation initiatives, capital allocation, big decisions, and quarterly objectives. This is the stuff you'd present to a board or talk about in a strategy offsite."

### 3.1 — Transformation portfolio

Explain: "A portfolio header shows your total capital committed vs deployed, broken down by strategic themes. Think of themes as the 3-5 pillars of your change agenda — 'Tech Modernization,' 'Ops Excellence,' 'Growth,' whatever fits your world."

Ask: "Do you think in terms of strategic themes or investment pillars? If yes, what are yours?"

For each theme:
- Name
- Approximate $ invested (if applicable)
- Rough progress % (gut feel is fine)

If they don't think in themes, that's OK — skip the portfolio header and just list initiatives flat.

Save under `## Navigate > Themes`.

### 3.2 — Initiatives

Explain: "These are the specific projects driving your strategy. Each one has a name, investment, horizon (when it should be done), progress, confidence level, owner, and next step."

Ask: "What are your active strategic initiatives? We'll go one at a time."

For each, ask name, owner, and target completion first. Then ask: "Want to add investment, confidence, and impact detail now, or fill those in later?"

**Fast pass** (always collected):
- Name
- Who owns it? (name from their directs list, or external)
- Target completion (Q2 2026, EOY, etc.)
- Which theme does it belong to? (if themes enabled)

**Detail pass** (if they opt in):
- Investment ($ committed, if known)
- Current progress (%)
- Where should progress be right now? (pace %)
- Confidence: high / medium / low
- What's the business impact in one line?
- What's the next step?

Save under `## Navigate > Initiatives`.

#### Mid-section pause point

Tell the user: "If you need to stop here, say 'pause' and we'll pick up at quarterly objectives."

### 3.3 — Quarterly objectives (OKRs)

Explain: "If you use OKRs, strategic objectives, or quarterly goals, this section tracks them with progress bars and on-track/at-risk/behind status."

Ask: "Do you set quarterly objectives? If yes, what are they this quarter?"

For each:
- Objective (the text)
- Progress (%)
- Expected pace (%)
- Status: on track / at risk / behind
- Owner

Save under `## Navigate > OKRs`.

If they don't use OKRs, skip.

### 3.4 — Decisions pending

Explain: "Decisions that are sitting on your desk waiting for you to make a call. Each shows the stakes, the deadline, and how long it's been waiting."

Ask: "What decisions are you currently sitting on?"

For each:
- What's the decision?
- What are the stakes? (dollar amount, team impact, timeline impact)
- When does it need to be decided by?
- How many days has it been on your desk?
- What are the options?
- Any context that matters?

Save under `## Navigate > Decisions`.

### Save point

Tell the user: "Navigate is configured. 2 of 3 done. Step 3 of 8 complete."

Summarize Navigate choices. Offer break.

Update setup step:
```sql
UPDATE app_config SET value = '"03_navigate_complete"'::jsonb WHERE key = 'setup_step';
```

If continue, read `SETUP/04_communicate.md`.
