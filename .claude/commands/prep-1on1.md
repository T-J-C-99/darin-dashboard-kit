# /prep-1on1 — 1:1 Prep

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Name lookup

If the user provides a name (e.g., `/prep-1on1 Sarah`), look up that person in the team_members table and pull their full record, commitments, initiative ownership, morale history, and last check-in.

If multiple team members match the name (e.g., two people named 'Chris'), present all matches with their roles and ask which one.

If the person has no check-in history, say: "No prior check-ins with [name]. This looks like your first. Here's their profile:" and show only the available data.

If no name given, ask: "Who's the 1:1 with?"

## Prep

Read and follow `DAILY_USE/before_1_on_1.md`.
