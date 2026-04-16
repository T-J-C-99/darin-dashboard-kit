# /issue-capture-link — Create Team Capture Link

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

If a name is given (e.g., `/issue-capture-link Mike`), look up the member. If not, ask.

1. Check if a non-expired, non-revoked token already exists for this member:
   ```sql
   SELECT token FROM team_access_tokens WHERE member_id = [id] AND revoked = false AND expires_at > NOW();
   ```
   If one exists, ask: "There's already an active link for [name]. Issue a new one (revokes the old)?" If yes, revoke first:
   ```sql
   UPDATE team_access_tokens SET revoked = true WHERE member_id = [id] AND revoked = false;
   ```
2. Generate a token: run `openssl rand -hex 24` or generate 48 random hex chars
3. Insert into team_access_tokens:
```sql
INSERT INTO team_access_tokens (token, member_id, label)
VALUES ([token], [member_id], 'capture link for [name]');
```
4. Construct the URL:
   - Check app_config for 'vercel_domain': `SELECT value FROM app_config WHERE key = 'vercel_domain';`
   - If set: `https://[vercel_domain value]/capture/[token]`
   - If not set: `http://localhost:3333/capture/[token]`
5. Tell the user:

> Here's [Name]'s capture link:
> [URL]
>
> Send this to them via text or email. They bookmark it on their phone.
> When they tap it, they get a form to submit blockers, progress, decisions, or FYIs.
> Their submissions land in your inbox for review.
>
> Want me to draft a message you can text them?

If yes, draft:
> Hey [first name], I set up a quick way for you to flag things for me. Bookmark this link -- when you have a blocker, progress update, or need a decision, tap it and fill out the 30-second form. I'll see it in my ops dashboard. [URL]
