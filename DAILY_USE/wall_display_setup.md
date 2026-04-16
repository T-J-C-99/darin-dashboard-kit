# Wall Display Setup

Claude: when the user wants to put the dashboard on a second monitor or wall display that stays on all day, walk them through this.

## For cloud deploy (Vercel)

The simplest path. Your dashboard is already at a public URL.

### 1. Prevent your Mac from sleeping

> Open **System Settings** > **Displays** > **Advanced** (at the bottom).
> Turn on **Prevent automatic sleeping when the display is off**.
>
> Or, in terminal, run: `caffeinate -d &` (keeps the display awake until you restart).

### 2. Auto-open Chrome on login

> Open **System Settings** > **General** > **Login Items & Extensions**.
> Click the **+** button under "Open at Login."
> Select **Google Chrome** from Applications.

### 3. Set Chrome to open your dashboard on startup

> Open Chrome > click the three dots (top right) > **Settings** > **On startup**.
> Select **Open a specific page or set of pages**.
> Click **Add a new page** and enter your dashboard URL (e.g., `https://your-app.vercel.app`).

### 4. Optional: Chrome kiosk mode (fullscreen, no browser chrome)

> In terminal, run:
> ```
> open -a "Google Chrome" --args --kiosk https://your-app.vercel.app
> ```
> This opens Chrome in true fullscreen with no address bar, tabs, or toolbars. Press Cmd+Q to exit.
>
> To make this automatic on login, create a small script and add it to Login Items.

### 5. Keep the display on

> If using an external monitor: check that **Energy Saver** (System Settings > Battery > Options) has "Prevent your Mac from automatically sleeping when the display is off" enabled.
>
> For the display itself, most external monitors stay on as long as they receive a signal. Check your monitor's power settings if it goes to sleep.

## For local-only (localhost)

You need the dev server running whenever the dashboard is visible.

### 1. Install pm2 for auto-start

> In terminal:
> ```
> sudo npm install -g pm2
> cd [your-project-folder]/app
> pm2 start npm --name "ops-terminal" -- run dev
> pm2 startup
> pm2 save
> ```
>
> This starts the dashboard automatically when your Mac boots. No need to open Terminal manually.

### 2. Then follow the Chrome steps above

Use `http://localhost:3333` as the URL instead of a Vercel URL.

### 3. Prevent Mac sleep

Same as the cloud steps above.

## Dashboard resilience

The dashboard is built for always-on use:

- **Auto-refreshes** data every 60 seconds (no manual refresh needed)
- **Recovers from network drops** — if WiFi goes out and comes back, the dashboard picks up automatically
- **Shows a "STALE" warning** if data hasn't refreshed in over 3 minutes
- **Hard-reloads once per hour** as a safety net (via meta-refresh)
- **30-day auth session** — you won't need to re-enter your password for a month

## What to tell Darin

> "Your dashboard is now a wall display. It refreshes itself, recovers from network issues, and reloads hourly as a safety net. If the screen ever goes black, check that your Mac didn't go to sleep (System Settings > Displays). If the dashboard shows 'STALE' in red, check your WiFi."
