# /retire-risk -- Retire a Risk

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

List active risks:
```sql
SELECT id, title, severity, likelihood, owner FROM risks ORDER BY severity DESC, title;
```

Ask: "Which risk to retire?"

Then ask: "Delete it from the register, or mark it as resolved and keep the record?" Handle accordingly:
- **Delete**: `DELETE FROM risks WHERE id = [id];`
- **Resolve/keep**: `UPDATE risks SET severity = 'low', mitigation = 'RESOLVED: ' || COALESCE(mitigation, ''), updated_at = NOW() WHERE id = [id];`

Log to activity_log:
```sql
INSERT INTO activity_log (panel, summary, actor, timestamp)
VALUES ('aviate', 'Retired risk: [title]', 'claude', NOW());
```

Confirm: "Risk '[title]' retired."
