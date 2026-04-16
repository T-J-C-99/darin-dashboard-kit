# /monday-planning — Weekly Planning Routine

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Day check

If today is not Monday, warn: "Today is [day]. Run Monday planning anyway? Priorities will be dated to this week's Monday."

## Pre-flight check

Count rows in priorities, metrics_config, team_members. If all are empty, say: "Your dashboard is mostly empty. Want to populate it now instead of running the weekly routine?"

## Routine

Read and follow `DAILY_USE/monday_planning.md`. Walk the user through their weekly review + planning in about 15 minutes.

## Team pulse (Step 5)

When collecting the team pulse, ask for both **energy** (high/med/low) AND **confidence** (high/med/low) for each team member. Both columns exist in morale_history.

## Computing week_offset

Calculate week_offset as the number of weeks since the team member's tenure_start, or use 0 for the current week and increment from the last morale_history entry for that member.
