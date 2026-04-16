# Glossary

You probably won't need to open this file -- terms are explained inline the first time they appear in the setup guides. This is a reference in case you encounter something unfamiliar later.

Plain-English definitions for terms you might encounter during setup and daily use.

**Claude Code** — an AI assistant that runs in your terminal. You talk to it in natural language and it edits code, runs commands, and manages your dashboard.

**Database (DB)** — where your dashboard data lives. Think of it as a structured spreadsheet that the dashboard reads from. Yours is called Neon (cloud) or Postgres (local).

**Deploy** — making your dashboard available at a web address so you can open it from any device. Vercel handles this.

**Dev server** — running the dashboard on your own computer for testing. When you type `npm run dev`, it starts a temporary local version at localhost:3333.

**Environment variables (.env.local)** — a file with your secret settings (database password, API keys). Never shared publicly. Like a safe with your keys.

**Git** — a system that tracks every change to your code. If something breaks, you can go back to a working version.

**GitHub** — a website that stores your code online. Like Google Drive for code. Your dashboard code lives in a private GitHub repository.

**localhost:3333** — the address of your dashboard when running on your own computer. Only you can see it.

**Neon** — the cloud database service. Your data lives there and can be accessed from anywhere.

**Next.js** — the framework your dashboard is built on. You don't need to know how it works.

**Node.js** — a program that runs JavaScript on your computer. Required to run the dashboard locally.

**npm** — a tool that installs the pieces your dashboard needs. Like an app store for code components.

**Repository (repo)** — a folder of code stored on GitHub. Yours is private — only you and Tom can see it.

**Schema** — the structure of your database — what tables exist and what columns they have. Like defining the headers in a spreadsheet before filling in data.

**Slash command** — a shortcut you type in Claude (like `/wizard` or `/add-priority`) that runs a predefined routine.

**Terminal** — the text-based interface on your Mac where you type commands. You'll mostly use the one built into VS Code.

**Vercel** — the cloud service that hosts your dashboard at a public web address. Free tier works fine.

**VS Code** — a code editor (like a specialized text editor). You don't need to write code — Claude does that. But VS Code is where you talk to Claude.
