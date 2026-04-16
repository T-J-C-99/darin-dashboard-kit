# /end-of-day — Quick Daily Snapshot

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Queries

1. **Priorities touched today** (status changed today):
```sql
SELECT id, title, status FROM priorities
WHERE updated_at::date = CURRENT_DATE AT TIME ZONE 'America/New_York';
```

2. **Metrics updated today**:
```sql
SELECT mc.label, mv.value, mv.as_of FROM metric_values mv
JOIN metrics_config mc ON mv.metric_key = mc.key
WHERE mv.as_of::date = CURRENT_DATE AT TIME ZONE 'America/New_York'
ORDER BY mv.as_of DESC;
```

3. **Check-ins logged today**:
```sql
SELECT c.id, tm.name, c.occurred_at FROM checkins c
JOIN team_members tm ON c.member_id = tm.id
WHERE c.occurred_at::date = CURRENT_DATE AT TIME ZONE 'America/New_York';
```

4. **Inbox items processed today**:
```sql
SELECT COUNT(*) as processed FROM team_submissions
WHERE reviewed_at::date = CURRENT_DATE AT TIME ZONE 'America/New_York'
AND status != 'pending';
```

5. **Still open**: blockers, overdue items, pending inbox:
```sql
SELECT COUNT(*) as blockers FROM team_members WHERE blocker IS NOT NULL;
SELECT COUNT(*) as overdue FROM commitments_to_board WHERE deadline < CURRENT_DATE AND status != 'met';
SELECT COUNT(*) as pending_inbox FROM team_submissions WHERE status = 'pending';
```

## Output

Format:
"End of day -- [date]:
Done: [N] priorities moved, [N] metrics updated, [N] check-ins logged
Still open: [N] blockers, [N] overdue, [N] inbox pending

Anything to flag for tomorrow?"

If user names items, add them as notes to tomorrow's agenda or as priority candidates.
