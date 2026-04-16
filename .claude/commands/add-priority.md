# /add-priority — Add a Weekly Priority

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask the user:
1. What's the priority? (title)
2. What rank? (or "add to the bottom")
3. Who owns it? (optional)

## Validation

Validate that the title is not empty or whitespace-only before inserting.

## Auto-ranking

Use `COALESCE((SELECT MAX(rank) FROM priorities WHERE week_start = [this_week]), 0) + 1` for auto-ranking when the user says "add to the bottom" or doesn't specify a rank.

## Duplicate check

Before inserting, check if a priority with the same title exists this week. If so, ask: "A priority called [X] already exists this week. Add anyway?"

## Owner matching

If the user names an owner, try to match against team_members using ILIKE. If no match, confirm: "I don't see [name] on your team. Add without linking?"

## Insert

```sql
INSERT INTO priorities (rank, title, status, carried_weeks, week_start, owner, owner_id, source, updated_by)
VALUES ([rank], [title], 'not_started', 0, DATE_TRUNC('week', CURRENT_DATE + INTERVAL '1 day')::DATE, [owner], [owner_id], 'claude', 'claude');
```

Confirm: "Added priority #[rank]: [title]"
