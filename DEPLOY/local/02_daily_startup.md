# Daily Startup (Local-Only Mode)

Claude: if the user chose local-only hosting, they need to know how to open their dashboard each day.

## Tell the user:

> Since your dashboard runs on your Mac (not in the cloud), here's your morning routine:
>
> 1. **Check Postgres is running** -- look for the elephant icon in your menu bar (top of screen). If it's not there, open Postgres.app from Applications.
> 2. **Open VS Code** — click the VS Code icon in your dock or Applications
> 3. Your project should still be open. If not: File → Open Recent → [your project name]
> 4. **Open terminal** — press `Cmd + backtick` (the key above Tab)
> 5. **Start the dashboard** — type `cd app && npm run dev` and press Enter
> 6. **Open your browser** — go to http://localhost:3333
>
> That's it. Dashboard is live as long as your terminal is running.
>
> **To stop:** press `Ctrl+C` in the terminal.
>
> **To talk to Claude:** open a new terminal tab (Cmd+T in VS Code terminal) and type `claude`.
>
> **Tip:** bookmark http://localhost:3333 in your browser for one-click access.
