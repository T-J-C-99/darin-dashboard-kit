# Vercel Deploy

Claude: walk the user through one step at a time.

## Create account

1. Open https://vercel.com in your browser
2. Click "Sign Up" (top right)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. If you signed up with email (not GitHub), check your inbox for a verification email before continuing.
6. You're now on the Vercel dashboard

## Import project

1. Click "Add New Project" (or "Import Project" if this is your first deploy)
2. You'll see a list of your GitHub repos
3. Find your dashboard repo (the one you created from the template)
4. Click "Import"
   - If you don't see your repo in the list: click "Adjust GitHub App Permissions" at the bottom and grant Vercel access to your new repository.

## Configure

1. **Root Directory -- MOST COMMON ERROR:** You MUST click "Edit" next to Root Directory and type `app`. If you skip this, the deploy will fail with "No Next.js project detected."
2. **Framework Preset**: should auto-detect "Next.js" — if not, select it
3. **Environment Variables**: click "Add" for each:
   - Name: `DATABASE_URL` -> Value: [paste the Neon connection string from .env.local]
   - Name: `SYNC_API_KEY` -> Value: [paste the sync key from .env.local]
   - Name: `DASHBOARD_PASSWORD` -> Value: [pick a password you'll remember. This protects your dashboard from anyone who finds the URL. Leave blank for no protection.]
   - Name: `NEXT_PUBLIC_DEMO_MODE` -> Value: `false`
   - Paste ONLY the value, not the variable name. No quotes around it. Example: paste `postgres://user:pass@host/db` not `DATABASE_URL=postgres://...` and not `"postgres://..."`
4. Click "Deploy"

## Wait

Takes 1-2 minutes. You'll see a build log running. When it says "Congratulations!" with a preview screenshot, you're live.

## Get your URL

1. Your site is at `[project-name].vercel.app`
2. Click the preview to open it
3. You should see the dashboard — either the "setup pending" screen (if wizard hasn't run) or your actual data

## Password protection

The dashboard has built-in password protection via the DASHBOARD_PASSWORD environment variable you just set. If you set a password above, visitors will see a login prompt. No Vercel Pro plan needed.

## Add Tom as collaborator (optional, recommended)

If user said yes to Tom collab in Step 1:

1. Go to github.com/[your-username]/[your-repo-name]
2. Click "Settings" (top menu, not browser settings)
3. Click "Collaborators" in the left sidebar
4. Click "Add people"
5. Type: `T-J-C-99`
6. Click "Add T-J-C-99 to this repository"
7. Tom will get an email invite and accept it

Tell the user: "Tom can now see your code and push fixes. He can't access your database or passwords."

## Done

The site is live. Every time you push code changes to GitHub (which Claude does automatically when you ask it to update something), Vercel rebuilds and deploys in ~60 seconds.
