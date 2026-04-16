# Step 5 — Data Sources

## What to do

Explain: "Now I know what you want on your dashboard. Let's talk about where the data comes from. For each metric and section, we have a few options:

- **Manual** — you tell Claude (me) and I update it. Simplest. Works for anything.
- **Google Sheets** — you or your team maintain a spreadsheet, and the dashboard pulls from it periodically. Good for numeric KPIs someone already tracks in Excel/Sheets.
- **Future integration** — you know it should come from a specific system (Salesforce, NetSuite, your ERP, etc.) but we won't hook it up today. The dashboard shows a 'pending' placeholder instead of fake data.
- **Team capture** — your directs submit updates via their phone link. Covered in the last step."

### For each metric from Step 2

Read back the metrics they chose. For each one, ask: "Where does this number come from today? Options: manual, Google Sheet, or mark it for future integration."

Most will be manual for now. That's fine.

If they mention a Google Sheet, get the URL and note it. Don't try to authenticate — just record it for later hookup.

If they name a specific system (Salesforce, NetSuite, Oracle, Workday, etc.), record it under source_type: future with the system name: `source_config: { system: "NetSuite", field: "monthly_revenue" }`.

Save updates to each metric in ANSWERS.md under the metric's existing entry.

### For team data

Ask: "For your team information (focus, blockers, morale, check-in notes) — will you update this yourself via Claude, or will your team submit via capture links, or both?"

Most likely answer: "Both — I update what I observe, they submit what's happening on their end."

Save under `## Data Sources > Team`.

### For calendar

If they wanted the Today Agenda, ask:
- "What calendar do you use? Google Calendar, Outlook, Apple Calendar?"
- Note it. For v1, calendar integration may be manual (Claude asks you each morning what's on deck) or we can explore Google Calendar API. Mark as: manual or future.

Save under `## Data Sources > Calendar`.

### Summary

Read back a summary:
- "X metrics are manual — you'll tell Claude and I'll update them."
- "Y metrics are pending future integration with [system names]."
- "Z metrics are linked to Google Sheets."
- "Team data is manual + capture."

Confirm.

### Save point

Tell the user: "Step 5 of 8 complete."

Update setup step:
```sql
UPDATE app_config SET value = '"05_data_sources_complete"'::jsonb WHERE key = 'setup_step';
```

Offer break. If continue, read `SETUP/06_review_spec.md`.
