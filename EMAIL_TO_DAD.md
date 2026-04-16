# Email to Dad

Subject: Built you an ops dashboard

---

Dad,

I built you an operating dashboard for Safe-Guard. Dark screen, dense layout, real-time. Think Bloomberg terminal for your job.

3 views:

**Aviate** -- your KPIs (attach rate, loss ratio, claims SLA, dealer NPS, policies in force), weekly priorities, what you owe David and the board, risk register.

**Navigate** -- transformation portfolio, capital allocation, initiative progress, decisions sitting on your desk.

**Communicate** -- your directs, their energy and blockers, 1:1 prep, and a way for them to send you updates from their phones.

Every number on it is real. If something isn't configured, it shows blank. No fake data.

Takes about an hour to set up. You can pause and come back. Once it's running, you talk to it like this: "update attach rate to 48.5" or "Monday planning" or "prep for 1:1 with Joe."

---

## Before you start, install these 4 things

Claude Desktop (which you have) can walk you through the rest, but grab these first:

1. **VS Code** -- https://code.visualstudio.com/download -- click Mac Universal, drag to Applications
2. **Node.js** -- https://nodejs.org -- click the green LTS button, run the installer
3. **GitHub account** -- https://github.com/signup -- email, password, set up 2FA when it asks
4. **Claude subscription** -- make sure your claude.ai account has a paid plan. Claude Code uses the same login.

That's it. Claude handles everything else.

---

## How to start

Open Claude Desktop. New conversation. Paste this entire block:

```
I'm setting up an executive dashboard my son Tom built for me. I need to install some developer tools on my Mac before I can use it. Walk me through these installs one at a time, checking if each is already installed first:

1. VS Code (code editor) -- download from code.visualstudio.com. If my Mac blocks it, right-click the app > Open > Open again.
2. Node.js -- download the LTS installer from nodejs.org. After install, close and reopen Terminal.
3. Claude Code (AI terminal tool) -- run: npm install -g @anthropic-ai/claude-code (if you see a permission error, try again with sudo in front). Then run `claude` to log in.
4. Git -- type `git --version`. If Mac asks to install developer tools, click Install and wait.
5. GitHub CLI -- install via Homebrew: brew install gh (if you don't have Homebrew, install it first from https://brew.sh). Then run `gh auth login`, choose GitHub.com, HTTPS, Yes, and authorize in browser.
6. Create my project -- run: gh repo create my-ops-dashboard --private --clone --template T-J-C-99/darin-dashboard-kit
7. Open it -- run: code my-ops-dashboard

After all 7 are done, tell me to open VS Code, open the terminal with Cmd+backtick, type `claude`, and say `run /wizard`.

If anything fails, help me troubleshoot. If we get stuck, tell me to text my son Tom.
```

Follow what Claude says. If your Mac asks for your password, type it (characters won't show, that's normal) and hit Enter.

If you'd rather do this over FaceTime, call me.

---

## Once you're in

Open VS Code. Press **Cmd + backtick** (key above Tab). Type `claude`, hit Enter. Say `run /wizard`.

It'll ask you about your metrics, your team, your commitments to David, your risks. About an hour, pausable.

## After that

Just talk to it:

- "Update attach rate to 48.5"
- "Add a priority: finalize Q2 forecast with Joe"
- "Log a check-in with Sylvia -- hiring plan on track"
- "Monday planning"
- "Prep for 1:1 with Alen"
- "What's on fire?"

## If it breaks

Text me. I can push a fix from my end without touching your machine.

## One more thing

You can put this on a second monitor and leave it running all day. It auto-refreshes, handles network drops, and flags when data goes stale. Later we can set it up so your directs submit updates from their phones. But that's a separate conversation.

Tom
