# Database Backup & Recovery

Your data lives in your Neon database. Code is backed up by GitHub. These are separate systems.

## Automatic protection

- **Code:** Every change Claude makes gets committed to git. You can always go back to any previous version.
- **Database:** Neon's free tier keeps 7 days of history. Paid tier ($19/mo) gives 30 days + point-in-time recovery.

## Before risky operations

Before Claude runs any destructive database operation (dropping tables, deleting data, major schema changes), it should:

1. Create a Neon branch (a snapshot copy):
   - Go to console.neon.tech > your project > Branches > Create Branch
   - Name it "backup-[date]"
   - This takes 5 seconds and costs nothing

2. Or ask Claude to run: "Create a backup before making this change"

## If something goes wrong

### Data was accidentally deleted
- Go to console.neon.tech > your project > Branches
- If you created a backup branch, you can restore from it
- If not, Neon's free tier has 7 days of automatic history

### Schema was corrupted
- Claude can re-run schema.sql, but this drops all data
- Better: ask Claude to fix the specific table or column

### Everything is broken
- Text Tom. He can push code fixes via GitHub.
- For database fixes, you may need to share your Neon connection string with Tom securely (read it to him over the phone, or use a password manager's sharing feature).

## Setting up better backups (optional, $19/mo)
- Upgrade Neon to Pro at console.neon.tech > Settings > Billing
- This gives you 30-day point-in-time recovery and unlimited branches
