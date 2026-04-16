# Your Ops Dashboard — Start Here

Your dashboard will look something like this when configured:

[screenshot: ask Tom for a preview image or visit the /demo route locally]

Tom built this for you. It's a personal executive operating terminal — a dark, dense dashboard that shows you what matters across three views: **run the business**, **plan and build**, and **lead people**.

Nothing on this dashboard is fake. Every number, every name, every metric comes from what you tell it. If a section isn't configured yet, it shows blank — not pretend data.

## Did Tom already set this up on your Mac?

If Tom installed the tools and created your project, skip to step 2 below.

## Setting up yourself?

You have two options:
- **With Claude Desktop** (the app on your Mac): Open Claude Desktop, paste the prompt from `FIRST_TIME_PROMPT.txt`, and Claude will walk you through installing everything.
- **Manual setup**: Follow the steps below.

## First time? Here's what to do:

### 1. Install the tools (~15 minutes)

Open **Terminal** on your Mac (search for "Terminal" in Spotlight, or press Cmd+Space and type "Terminal").

Then ask Claude to walk you through `DEPLOY/00_prereqs.md` -- it installs VS Code, Node.js, Claude Code, and GitHub, then creates your project.

### 2. Run the wizard (~60-90 minutes, pausable)

The wizard handles project creation for you. Just open Claude Code and say "run /wizard".

Claude walks you through everything from there -- who you are, what you want to see, where the data comes from, database setup, and deployment.

## Returning user?

- Open VS Code with your project
- Open terminal (Cmd+`)
- Run `claude`
- Talk to it naturally: "update revenue MTD to 4.6M" or "Monday planning" or "prep for 1:1 with [name]"

## If something breaks

Text Tom. He has tools to push a fix.

## What's in this folder

| Folder | Purpose |
|--------|---------|
| `app/` | The dashboard application (Next.js) |
| `SETUP/` | Wizard step files — Claude reads these |
| `DEPLOY/` | Deployment guides (cloud, local, ask-IT) |
| `DAILY_USE/` | Guides for recurring tasks |
| `.claude/` | Claude configuration and slash commands |
| `TROUBLESHOOTING.md` | Common fixes |
| `BACKUP.md` | Database backup and recovery |
| `GLOSSARY.md` | Plain-English tech terms |
| `TOM_SETUP_GUIDE.md` | Reference for Tom (your admin) |
