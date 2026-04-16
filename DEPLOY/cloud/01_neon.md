# Neon Database Setup

Claude: walk the user through this step by step. One instruction at a time.

## Create account

1. Open https://console.neon.tech in your browser
2. Click "Sign Up" (top right)
3. Sign up with your email or Google account
4. Verify email if prompted

## Create project

1. After signup, Neon's onboarding will guide you to create your first project. If you land on a dashboard instead, click "New Project" in the top right.
2. Choose a project name (like "ops-terminal" or "my-dashboard") and the region closest to you.
3. Postgres version: leave the default
4. Click "Create Project"

## Copy the connection string

1. After project creates, you'll see a connection string box
2. You'll see tabs for "Pooled" and "Direct" connection strings. Copy the Pooled connection string -- it contains "-pooler" in the hostname.
3. It looks like: `postgres://username:password@ep-something-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Copy the full connection string shown. If the password shows as asterisks (****), click the eye icon to reveal it before copying. Make sure there are no spaces or line breaks in what you paste.
5. The connection string from Neon includes `?sslmode=require` at the end. Don't remove any parameters after the database name.
6. This is your DATABASE_URL

## Save it locally

1. In your project folder, there's a file called `.env.example`
2. Copy it to `.env.local`: in terminal, run `cp .env.example .env.local`
   - If you see "No such file or directory": make sure you're in the right folder. Type `ls` and look for `.env.example` in the list. If you don't see it, type `cd app` first.
   - Can't find dotfiles? In Finder, press Cmd+Shift+. (period) to show hidden files. Or just use VS Code's file explorer -- it shows them by default.
3. Open `.env.local` in VS Code
4. Replace the `DATABASE_URL=postgres://user:pass@host/dbname` line with your real connection string
5. Save the file (Cmd+S)

## Generate a sync key

1. In terminal, run: `openssl rand -hex 32`
2. Copy the output (a long random string)
3. Paste it into `.env.local` as the value for `SYNC_API_KEY`
4. Save the file

## Run the schema

Claude will handle running the schema for you during the wizard. If you need to run the schema manually outside the wizard: open Neon's SQL Editor at console.neon.tech (click "SQL Editor" in the left sidebar), paste the contents of `app/schema.sql`, and click Run.

## Verify

Claude: after schema runs, verify by running a quick query:
```sql
SELECT key, value FROM app_config;
```
Should return the seed config rows. If it does, tell the user "Database is ready."
