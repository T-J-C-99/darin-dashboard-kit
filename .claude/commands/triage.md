# /triage — What Needs Your Attention Right Now

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Queries

Query and present in priority order:

1. **Stale priorities** (carried 2+ weeks):
```sql
SELECT id, title, carried_weeks, owner FROM priorities
WHERE status = 'carried' AND carried_weeks >= 2
ORDER BY carried_weeks DESC;
```

2. **Team blockers** (team_members where blocker IS NOT NULL):
```sql
SELECT id, name, blocker, blocker_type FROM team_members WHERE blocker IS NOT NULL;
```

3. **Overdue commitments** (commitments_to_board where deadline < NOW() and status != 'met'):
```sql
SELECT id, label, deadline, status, stakeholder FROM commitments_to_board
WHERE deadline < CURRENT_DATE AND status != 'met'
ORDER BY deadline;
```

4. **Aging decisions** (decisions_pending where age_days >= 14):
```sql
SELECT id, title, age_days, deadline FROM decisions_pending
WHERE status = 'open' AND (age_days >= 14 OR (created_at <= NOW() - INTERVAL '14 days'))
ORDER BY age_days DESC;
```

5. **Pending inbox** (team_submissions where status = 'pending', count only):
```sql
SELECT COUNT(*) as pending FROM team_submissions WHERE status = 'pending';
```

6. **At-risk OKRs** (okrs where status = 'at_risk' or 'behind'):
```sql
SELECT id, objective, status, progress, pace FROM okrs
WHERE status IN ('at_risk', 'behind')
ORDER BY status, progress;
```

## Output

Present as a numbered action list:

"3 things need your attention right now:
1. [Priority X] has been carried 3 weeks -- done, escalate, or cut?
2. [Team member] is blocked on [thing] -- your decision needed
3. [Commitment Y] is past deadline -- update or close?"

If nothing is on fire: "Nothing urgent. Your dashboard is clean."
