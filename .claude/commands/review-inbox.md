# /review-inbox — Process Team Submissions

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Section check

Check if team_inbox section is enabled in section_config. If disabled, warn: "Team inbox is currently disabled on your dashboard. Process submissions anyway?"

## Query

```sql
SELECT ts.*, tm.name as member_name
FROM team_submissions ts JOIN team_members tm ON ts.member_id = tm.id
WHERE ts.status = 'pending' ORDER BY ts.submitted_at DESC;
```

If none: "Inbox is empty. No pending submissions from your team."

For each submission, show:
- Who submitted, when, what type (blocker/progress/decision/fyi), urgency
- Content

Ask: "Accept / Refine / Discard / Defer / Skip?"

- **Accept**: update status to 'accepted'. If it's a blocker, update the team member's blocker field. Also set blocker_type on team_members -- ask the user: "Is this a decision you need to make, a resource gap, or something else?" Set blocker_type accordingly. When accepting a blocker without a clear blocker_type from the user, default to 'other'. If it's a decision, offer to create a decisions_pending row. Log to activity_log.
- **Refine**: ask the user how to rephrase, then accept the refined version.
- **Discard**: update status to 'discarded'.
- **Defer**: update status to 'deferred', ask for a follow-up date.
- **Skip**: move to next item.

After all items processed, summarize: "Processed [N] items: [N] accepted, [N] discarded, [N] deferred."
