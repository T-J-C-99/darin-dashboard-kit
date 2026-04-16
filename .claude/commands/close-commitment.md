# /close-commitment -- Close a Commitment

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Team commitments (commitments table)

List open commitments:
```sql
SELECT c.id, c.text, c.from_party, c.due_date, c.status, tm.name as member_name
FROM commitments c
LEFT JOIN team_members tm ON c.member_id = tm.id
WHERE c.status IN ('open','in_progress')
ORDER BY c.due_date;
```

Ask: "Which commitment to close?"

Update:
```sql
UPDATE commitments SET status = 'done', updated_at = NOW() WHERE id = [id];
```

## Board commitments (commitments_to_board table)

If the user mentions a board or leadership commitment (e.g., "I met my Q2 margin commitment"), look it up:
```sql
SELECT id, label, current_value, commit_value, status FROM commitments_to_board WHERE status != 'met';
```

Update:
```sql
UPDATE commitments_to_board SET status = 'met', updated_at = NOW() WHERE id = [id];
```

Confirm: "Commitment '[text/label]' marked as done."
