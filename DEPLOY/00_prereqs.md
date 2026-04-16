# Prerequisites — Install Before Starting

Claude: walk the user through each of these ONE AT A TIME. Don't overwhelm. Check if each is already installed before asking them to install it.

## 1. VS Code

Check: run `code --version` in terminal (a text-based interface where you type commands -- like texting your computer). If it works, skip.

If not installed:
1. Open your browser
2. Go to https://code.visualstudio.com
3. Click the big blue "Download for Mac" button
4. Open the downloaded file
5. Drag "Visual Studio Code" into your Applications folder
6. Open VS Code from Applications
   - If your Mac says "Visual Studio Code can't be opened because it is from an unidentified developer": right-click the app in Applications > click Open > click Open again. This only happens once.
7. You'll see a welcome screen — you can close those tabs

## 2. Node.js

Check: run `node --version` in terminal. If it shows v18+ or v20+, skip.

If not installed:
1. Open your browser
2. Go to https://nodejs.org
3. Click the big green "LTS" download button (not "Current")
4. Open the downloaded `.pkg` file
5. Click through the installer (Next, Next, Install, Done)

**Important:** After installing, you MUST close Terminal completely (Cmd+Q) and reopen it. Otherwise `node --version` won't work.

6. Close and reopen your terminal, then type `node --version` to confirm

## 3. Claude Code

Check: run `claude --version` in terminal.

If not installed:
1. In your terminal (inside VS Code is fine — press Cmd+` to open it), type:
   ```
   npm install -g @anthropic-ai/claude-code   # npm is a tool that downloads the building blocks your dashboard needs
   ```
   If you see a "permission denied" or "EACCES" error, try again with `sudo npm install -g @anthropic-ai/claude-code` and enter your Mac password. Characters won't appear as you type -- that's normal. Press Enter when done.
2. Press Enter. Wait about 30 seconds.
3. When it finishes, type `claude --version` to confirm.
   - Claude Code requires an active Claude subscription. If you see an auth error, make sure you're logged into claude.ai with an account that has a paid plan.
4. Run `claude` to start. First time, it'll ask you to log in — follow the browser prompts.

## 4. Git

Check: run `git --version`. Mac usually has this pre-installed via Xcode tools.

If not installed:
1. Type `git --version` in terminal
2. If Mac asks "Would you like to install the command line developer tools?", click Install
3. Wait ~5 minutes for it to download and install
4. Try `git --version` again
   - If you see "You have not agreed to the Xcode license agreements": run `sudo xcodebuild -license accept` and type "agree" when prompted.

## 5. GitHub CLI

Check: run `gh --version`.

If not installed:
1. Run `brew install gh`. If you don't have Homebrew, install it first: run `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` and follow the prompts.
2. After install, authenticate: `gh auth login`
3. Choose: GitHub.com → HTTPS → Yes (authenticate with browser) → press Enter
4. You'll see a one-time code (like ABCD-1234). Press Enter to open your browser, paste the code on the GitHub page, and click Authorize.
5. Come back to terminal -- it should say "Logged in as [your username]"
   - If GitHub asks for a two-factor code, check your authenticator app or text messages.

If it says "could not authorize" or nothing happens in your browser, close this terminal, open a new one, and try `gh auth login` again. If that still fails, text Tom.

Got GitHub CLI working? Great. If you need to pause, just come back and say "continue setup."

## 6. GitHub account & project creation

If the user doesn't have a GitHub account:
1. Open https://github.com/signup
2. Enter email, password, username
3. Verify email
4. GitHub now requires two-factor authentication. When prompted, set up 2FA using an authenticator app (like the one on your phone) or SMS. Complete this before continuing.
5. Come back and run `gh auth login` from step 5

Once authenticated, create their project. Tell the user: "I'll run this command for you. It creates your private copy of the dashboard code."

```
gh repo create [their-chosen-name] --private --clone --template T-J-C-99/darin-dashboard-kit
```

Replace `[their-chosen-name]` with a simple name like `my-dashboard` (no spaces, no special characters).

If you see "Could not resolve to a Repository": the template might not be available yet. Text Tom -- he needs to make the template public first.

Then:
1. Open in VS Code: `code [their-chosen-name]`
2. Open terminal in VS Code: Cmd+`
3. Start Claude: `claude`
4. Say: "run /wizard"

## Done

All tools installed and project created. The wizard handles everything from here.
