# Monday Planning

Claude: when the user says "Monday planning" or "weekly planning", walk them through this routine.

## Routine (~15 minutes)

### 1. Review last week

Query priorities from last week. For each:
- Ask: "Did you finish this? Done / Carry / Cut?"
- Mark done items as `done`
- Mark carried items as `carried`, increment `carried_weeks`
- Mark cut items as `cut`

Flag anything carried 2+ weeks: "This has been on your list [N] weeks. Want to keep it, escalate it, or cut it?"

### 2. Set this week's priorities

Ask: "What are your top priorities this week? Give me up to 6, ranked."

Insert new priorities for this week's Monday date.

### 3. Update commitments

Read back each commitment from `commitments_to_board`. For each:
- "Current value was [X]. Still accurate, or has it moved?"
- Update current_value and status if needed
- Recalculate days_to_judgment

### 4. Risk check

Ask: "Any new risks this week? Any resolved ones to retire?"

Insert or update accordingly.

### 5. Team pulse

For each direct report:
- "Quick read on [Name] this week -- energy: high/med/low? And confidence: high/med/low?"
- Insert a morale_history row with this week's read

### 6. Summary

Read back: "This week: [N] priorities set, [N] carried, [N] commitments updated, [N] risks active, team pulse logged."

Push changes if on cloud path: `git add -A && git commit -m "Weekly planning [date]" && git push`
