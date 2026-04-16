# Tom's Setup Guide -- Reference / FaceTime Fallback

NOTE: You probably can't run this on Darin's laptop directly. The primary bootstrap path is:
1. Text or email Dad the contents of `FIRST_TIME_PROMPT.txt`
2. He pastes it into Claude Desktop (which he already has)
3. Claude Desktop walks him through all 7 installs with error recovery

This guide is your reference for what needs to happen, and your fallback script if Claude Desktop isn't cutting it and you're walking him through over FaceTime.

## Pre-flight

- Mac is powered on, connected to Wi-Fi, signed into iCloud
- You have his Mac password (or he's there to type it)

## 1. VS Code

Download from https://code.visualstudio.com/. Drag to Applications.

First launch will get blocked by Gatekeeper. Right-click the app > Open > Open again.

## 2. Node.js

Download the LTS `.pkg` installer from https://nodejs.org/. Run it, click through defaults.

Verify:
```bash
node --version
npm --version
```

## 3. Claude Code CLI

```bash
sudo npm install -g @anthropic-ai/claude-code
```

Sudo avoids EACCES permission errors on the global node_modules path. He'll need his Mac password.

Run `claude` once to trigger the auth flow (Anthropic login in browser).

## 4. Git

Should already be installed via Xcode Command Line Tools. Check:
```bash
git --version
```

If it prompts to install CLT, let it run. If nothing happens:
```bash
xcode-select --install
```

Accept the license if needed:
```bash
sudo xcodebuild -license accept
```

## 5. GitHub CLI

Download the `.pkg` installer from https://cli.github.com/.

Then authenticate:
```bash
gh auth login
```

Choose: GitHub.com > HTTPS > Yes (authenticate Git) > Login with a web browser.

He'll need a GitHub account. If he doesn't have one, create one at github.com first.

## 6. Clone the template

```bash
gh repo create darin-ops --private --clone --template T-J-C-99/darin-dashboard-kit
```

This creates a private repo under his account, cloned locally.

## 7. Open in VS Code

```bash
code darin-ops
```

## 8. Verify everything

```bash
cd darin-ops && claude --version && node --version && gh --version
```

All three should return version numbers without errors.

## 9. Add yourself as collaborator

Have Darin go to github.com > his `darin-ops` repo > Settings > Collaborators > Add people > `T-J-C-99`.

Accept the invite from your own GitHub notifications.

## Done

Tell Dad to open VS Code, open terminal (Cmd+\`), type `claude`, and say `run /wizard`.
