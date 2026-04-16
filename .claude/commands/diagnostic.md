# /diagnostic — System Health Check

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Run a health check and report results in plain English that the user can screenshot and send to their administrator.

1. Check if DATABASE_URL is set in environment
2. Try to connect to the database
3. Query app_config for setup state
4. Count enabled sections, metrics, team members
5. Check for pending inbox items
6. Check last activity timestamp
7. Check if dev server is responding (curl localhost:3333/api/health)

Report like this:
"Dashboard Health Check:
- Database: [connected / not connected]
- Setup: [complete / incomplete, step X]
- Sections enabled: [N]
- Metrics tracked: [N]
- Team members: [N]
- Pending inbox: [N]
- Last activity: [time ago]
- Server: [running / not running]

[If any issues found, explain in plain English what's wrong and how to fix it, or say 'text Tom with a screenshot of this.']"
