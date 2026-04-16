# Step 6 — Review & Generate Spec

## What to do

### 6.1 — Generate the spec

Read all of `SETUP/ANSWERS.md`. Synthesize it into `SETUP/SPEC.md` using this structure:

```markdown
# Ops Terminal — Configuration Spec
Generated: [date]
User: [name], [title], [company]

## App Config
- company_name: [value]
- tabs_enabled: [list]
- hosting: cloud | local | pending_IT
- tom_collab: yes | no | later

## Aviate Sections
[For each section: enabled/disabled, with specifics]

### Pulse Metrics
[Table: key | label | scope | unit | target | direction | source_type | source_config | paired_with]

### Today
[agenda source, eyes_on_you enabled, ceo_desk items]

### Commitments
[Table: label | current | commit | unit | deadline | stakeholder]

### Priorities
[List of current week priorities, or "deferred to first Monday"]

### Risks
[List with severity/likelihood/owner/mitigation]

### Process Control
[Stage definitions if enabled, or "not enabled"]

## Navigate Sections

### Themes
[List with investment and progress]

### Initiatives
[Table: name | theme | investment | horizon | progress | pace | confidence | owner | impact | next_step]

### OKRs
[Table: objective | progress | pace | status | owner]

### Decisions
[Table: title | stakes | deadline | age | options]

## Communicate Sections

### Team Members
[For each person: full profile including strengths, growth edges, morale dimensions, cadence, commitments, capture enabled]

### Comms Queue
[Current items]

### Team Inbox
capture_enabled_for: [names or "none"]

### Succession
enabled: [yes/no]

## Data Sources Summary
[Table: metric/section | source_type | source_config]

## Deferred
[List everything the user skipped, with section name and revisit prompt]
Example:
- Navigate > Initiatives > detail pass for "Platform Migration" — say "deepen Platform Migration" to add investment, confidence, and impact later
- Communicate > Succession — say "enable succession" to turn it on
- Communicate > Team Inbox — say "set up capture links" to enable
```

### 6.2 — Show the spec

Show a compressed one-line summary per section. Example format:

> Aviate: 5 metrics, 3 commitments, risk register ON.
> Navigate: 4 initiatives, 3 OKRs, 2 decisions.
> Communicate: 5 directs, capture links for 3.

Then ask: "Anything need to change?" Only go deep where they flag issues.

Fix anything they flag. Save the corrected `SPEC.md`.

### 6.3 — Confirm

Tell the user: "Step 6 of 8 complete."

Ask: "This is what I'll build. Ready for me to set up the database and configure the dashboard?"

Update setup step:
```sql
UPDATE app_config SET value = '"06_review_spec_complete"'::jsonb WHERE key = 'setup_step';
```

If yes, read `SETUP/07_build.md`.
If they want changes, loop back to the relevant section.
