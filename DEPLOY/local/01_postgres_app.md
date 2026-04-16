# Local Database Setup (Postgres.app)

Claude: walk through one step at a time.

## Install Postgres.app

1. Open https://postgresapp.com in your browser
2. Click "Download" (the big button)
3. Open the downloaded `.dmg` file
4. Drag Postgres into your Applications folder
5. Open Postgres from Applications
6. Click "Initialize" on the default server
7. If you see "Port 5432 already in use": another Postgres is running. In terminal, run `brew services stop postgresql` or check Activity Monitor for "postgres" processes and quit them.
8. You should see a green "Running" indicator and a list of databases

## Create your database

1. Open terminal (in VS Code: Cmd+`)
2. Run: `psql postgres`
3. At the `postgres=#` prompt, type: `CREATE DATABASE ops_terminal;`
4. Type: `\q` to exit

## Set your connection string

1. Open `.env.local` in VS Code (create from `.env.example` if it doesn't exist: `cp .env.example .env.local`)
2. Set: `DATABASE_URL=postgres://$USER@localhost:5432/ops_terminal` (replace $USER with your Mac username. Not sure? Type `whoami` in terminal.)
3. Generate a sync key: `openssl rand -hex 32`
4. Set: `SYNC_API_KEY=[paste that key]`
5. Save (Cmd+S)

## Run the schema

1. In terminal: `cd app && psql ops_terminal -f schema.sql`
2. You should see "CREATE TABLE" and "INSERT" messages

## Verify

Claude: run a quick query to confirm tables exist:
```
psql ops_terminal -c "SELECT key, value FROM app_config;"
```

Tell the user: "Local database is ready. Your data stays on this machine."
