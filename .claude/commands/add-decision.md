# /add-decision -- Capture a Pending Decision

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask the user for:
1. **Title** -- what's the decision? (short label)
2. **Context** -- why does this need deciding now?
3. **Stakes** -- what happens if you get it wrong or delay?
4. **Deadline** -- when does this need to be decided by?
5. **Options** -- comma-separated list of options on the table

Insert into decisions_pending:
```sql
INSERT INTO decisions_pending (title, context, stakes, deadline, options, status, created_at)
VALUES ([title], [context], [stakes], [deadline], [options as JSONB array], 'open', NOW());
```

Convert the comma-separated options into a JSONB array, e.g. `'["Option A","Option B","Option C"]'::jsonb`.

Confirm with summary:
> Decision captured: "[title]"
> Stakes: [stakes]
> Deadline: [deadline]
> Options: [list]
