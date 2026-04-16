# /delegate — Reassign a Priority or Initiative

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask: "What do you want to reassign?" List active priorities and initiatives:

```sql
SELECT 'priority' as type, id, title as name, owner, rank FROM priorities
WHERE status NOT IN ('done', 'cut') AND week_start >= DATE_TRUNC('week', CURRENT_DATE)
ORDER BY rank;
```

```sql
SELECT 'initiative' as type, id, name, owner_id FROM initiatives
WHERE status = 'active' ORDER BY name;
```

Then ask: "Who should own it?" Match the new owner against team_members using ILIKE. If no match, confirm before proceeding.

If priority:
```sql
UPDATE priorities SET owner = [new_name], owner_id = [new_id], updated_at = NOW() WHERE id = [priority_id];
```

If initiative:
```sql
UPDATE initiatives SET owner_id = [new_id], updated_at = NOW() WHERE id = [initiative_id];
```

Also consider updating team_members focus if the new owner's focus should change. Ask: "Update [name]'s focus to reflect this? Current focus: [current_focus]."

Confirm: "[Item] reassigned from [old] to [new]."
