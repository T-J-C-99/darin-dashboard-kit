# Email to Dad

Subject: Your ops dashboard -- ready when you are

---

Hey Dad,

I built you something. It's an executive operating dashboard -- think Bloomberg terminal for running Safe-Guard. Dark, dense, real-time. Three views:

- **Aviate** -- run the business. Your KPIs (attach rate, loss ratio, claims SLA, dealer NPS, policies in force), weekly priorities, what you owe David and the board, what's at risk.
- **Navigate** -- plan and build. Your transformation portfolio, strategic initiatives, capital allocation, big decisions on your desk.
- **Communicate** -- lead people. Your directs, their morale and blockers, 1:1 prep, and a way for your team to send you updates directly from their phones.

Nothing on it is fake. Every number comes from what you tell it. If a section isn't set up yet, it shows blank -- not pretend data.

It takes about an hour to set up (pausable, you can split it across days). Once it's running, you talk to it in plain English: "update attach rate to 48.5" or "prep for 1:1 with Joe" or "Monday planning."

## What you need before starting

You need a few things installed on your Mac. Claude Desktop (which you already have) can walk you through all of them. Here are the direct download links in case you want to grab them first:

1. **VS Code** (code editor where you'll talk to Claude)
   https://code.visualstudio.com/download -- click "Mac Universal", open the download, drag to Applications

2. **Node.js** (runs the dashboard engine)
   https://nodejs.org -- click the green "LTS" button, run the installer

3. **GitHub account** (stores your dashboard code privately)
   https://github.com/signup -- you'll need an email and password. GitHub will ask you to set up two-factor authentication (use your phone's authenticator app or SMS).

4. **Claude subscription** (you may already have this through Claude Desktop)
   Make sure you're logged into claude.ai with an account that has a paid plan. Claude Code (the terminal version) uses the same account.

You do NOT need to install anything else manually. Claude will handle the rest.

## How to start

**Option A -- Claude Desktop walks you through everything (recommended):**

Open Claude Desktop on your Mac. Start a new conversation. Paste this entire block:

---

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

---

Claude will walk you through each step one at a time. Follow what it says. If your Mac asks for your password at any point, that's normal -- type it (the characters won't show, that's also normal) and press Enter.

**Option B -- I can walk you through it over FaceTime if you'd rather.**

## Once the tools are installed

Open VS Code (the blue icon). You should see your project already open. Press **Cmd + backtick** (the key above Tab, left of the 1 key) to open the terminal. Type `claude` and press Enter. Then say:

```
run /wizard
```

The wizard asks you questions about your business -- what metrics matter, who your directs are, what you've committed to David and the board, what's on your risk radar. It takes about an hour but you can pause anytime. When it's done, your dashboard is live with your real data.

## After setup

Talk to Claude in plain English. Examples:

- "Update attach rate to 48.5"
- "Add a priority: finalize Q2 forecast with Joe"
- "Log a check-in with Sylvia -- hiring plan on track"
- "Monday planning" (weekly routine, ~15 min)
- "Prep for 1:1 with Alen"
- "What's on fire?"
- "Review inbox" (if your team is sending you updates)

## If something breaks

Text me. I have tools that can push a fix straight to your dashboard without touching your computer.

## The big picture

This is yours. Your data, your hosting, your accounts. I can help maintain it, but you own and control everything. You can put it on a second monitor in your office and leave it there all day -- it auto-refreshes, recovers from network drops, and shows a warning if data goes stale.

When you're ready, we can also set it up so your directs can send you updates directly from their phones. One tap, 30-second form, lands in your dashboard inbox for review. But that's a later conversation.

Love you. Call me if you want to do this together over FaceTime instead.

Tom
