# Step 2 — Aviate (Run the Business)

Skip this step entirely if the user did not enable the Aviate tab.

## What to do

Explain: "Aviate is your operational cockpit. It shows you what's happening right now, what you promised your boss, what's at risk, and what you need to do this week. Let's figure out what belongs here for you."

Walk through each section. For each one, explain what it does, ask if they want it, and if yes, collect the specifics.

### 2.1 — Business pulse (KPIs)

Explain: "This is a strip of live numbers at the top of your screen — think Bloomberg ticker for your business. Metrics are grouped by time horizon: Realtime (right now), Leading indicators (early-warning signals), Month-to-date, Quarter-to-date, Year-to-date. Each metric shows the current value, a trend line, and whether it's on target."

Ask: "Give me your top 5 most important business metrics. We can always add more later."

If the user isn't sure which metrics matter most, say: "Tell me what report or spreadsheet you look at first thing Monday morning. I'll extract metrics from that."

If the user hesitates or says "I'm not sure," immediately offer 3-4 industry-specific examples based on their company description from Step 1. Don't wait for them to ask.

For each metric, ask ONLY 3 things:
- Name
- Current value (or best estimate)
- Target

Claude infers scope, direction, and unit from context. Don't ask the user to categorize these.

If they get stuck, offer examples relevant to their industry (based on identity info):
- Insurance/F&I: loss ratio, claims SLA, attach rate, policies MTD, NPS, AHT
- Manufacturing: yield, OEE, TRIR, cycle time, on-time delivery
- SaaS: MRR, churn, NPS, ticket SLA, deploy frequency
- General: revenue MTD, margin, customer satisfaction, employee turnover

Save each metric to ANSWERS.md under `## Aviate > Pulse Metrics`, structured:
```
- key: claims_sla
  label: Claims SLA
  scope: MTD
  unit: %
  target: 92
  direction: up
  current_value: 94.2
  source: manual
```

#### Pulse save point

Update setup step:
```sql
UPDATE app_config SET value = '"02_aviate_pulse"'::jsonb WHERE key = 'setup_step';
```

Tell the user: "Pulse metrics are in. If you need to stop here, say 'pause' and we'll pick up right where we left off."

### 2.2 — Today strip

Explain: "This shows your day at a glance — today's meetings, things people are waiting on you for, and items you owe your boss."

Ask for each sub-section:
- **Today's agenda** — "Do you want your calendar shown? Where does it live? (Google Calendar, Outlook, Apple Calendar, or skip)" Save the answer. If they want it, note the source. For v1, this will likely be manual unless they name Google Calendar (which we could integrate).
- **Eyes on you** — "A list of things people are specifically waiting on you for. Want this? Initially I'll populate it from what you tell me; later your team can submit items directly."
- **CEO desk** — "Items you owe [their boss's name]. Board deck prep, forecast summaries, whatever is hanging over your head. Want this section?" If yes, ask for current items.

Save under `## Aviate > Today`.

### 2.3 — Commitments to leadership

Explain: "These are the specific numbers or deliverables you've promised your CEO or board. 'Q2 margin at 14.5%' or 'VP Ops hired by June 30.' Each one shows where you are vs what you committed, and how many days until judgment."

Ask: "Do you want this section? If yes, what are you currently on the hook for?"

For each commitment:
- What did you promise?
- What's the target number or deliverable?
- Where are you now?
- When is it due?
- Who did you promise it to?

Save under `## Aviate > Commitments`.

### 2.4 — Weekly priorities

Explain: "A ranked list of your top priorities for the week. Monday you set them, Friday you see how you did. Items that carry over get flagged."

Ask: "Do you want weekly priorities? If yes, what are this week's?" (They can also defer: "I'll add them Monday.")

Save under `## Aviate > Priorities`.

### 2.5 — Risk register

Explain: "Named risks that could hurt the business. Each one has an owner, a mitigation plan, and a severity rating."

Ask: "Do you want a risk register? What's keeping you up at night right now?"

Save under `## Aviate > Risks`.

### 2.6 — Claims / process control

Explain: "If your business has a multi-stage operational process — order fulfillment, support ticket resolution, manufacturing, claims processing, any multi-stage workflow — we can show a stage-by-stage quality control view with first-pass yield, rework rates, and cycle times."

Ask: "Is there a core operational process you'd want to monitor at this level? If not, skip this."

Save under `## Aviate > Process Control`.

### Save point

Tell the user: "Aviate is configured. That's 1 of 3 main sections done. 2 sections left."

Then summarize what they enabled and what they skipped. Confirm. Then:

"Want to take a break, or keep going to Navigate? Step 2 of 8 complete."

If break: "No problem. When you come back, just tell Claude 'continue the wizard' and I'll pick up at Navigate."

Update setup step:
```sql
UPDATE app_config SET value = '"02_aviate_complete"'::jsonb WHERE key = 'setup_step';
```

If continue: Read `SETUP/03_navigate.md`.
