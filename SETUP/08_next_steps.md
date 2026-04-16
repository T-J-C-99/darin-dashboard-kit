# Step 8 — Next Steps

## What to tell the user

> Step 8 of 8 complete. Setup is done. Your dashboard is configured with real data and no placeholders. Here's how it works from here:
>
> **Daily use** — just talk to me. Say things like:
> - "Update [metric] to [value]"
> - "Mark priority 3 as done"
> - "[Name] is blocked on [issue]"
> - "Add a risk: vendor contract expires in 60 days"
> - "Log a check-in with [name] -- [what you discussed]"
>
> **Weekly planning (Mondays)** — say "Monday planning" and I'll walk you through:
> - Review last week's priorities (what got done, what carries)
> - Set this week's priorities
> - Update commitments-to-board pacing
> - Flag new risks or retire resolved ones
>
> **Before a 1:1** — say "prep for 1:1 with [name]" and I'll pull up:
> - Their open commitments (what you promised, what they promised)
> - Initiative progress vs pace
> - Morale trend
> - Suggested development topic
>
> **Team inbox** — say "review inbox" to process submissions from your directs.
>
> **If something breaks** — say "something looks wrong" and I'll diagnose. If I can't fix it, text Tom.
>
> **If you want to add a new section, metric, or team member later** — just ask. I'll add it to the database and the dashboard picks it up automatically.

## Record completion

Update setup step:
```sql
UPDATE app_config SET value = '"done"'::jsonb WHERE key = 'setup_step';
UPDATE app_config SET value = 'true'::jsonb WHERE key = 'setup_complete';
```

Write to ANSWERS.md:
```
## Completion
setup_complete: true
completed_at: [timestamp]
```

## IMPORTANT

Do NOT read or execute any further SETUP files. The wizard is done. Return to normal conversation mode.
