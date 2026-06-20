# Sterix Lead Tracker — shared, no login, real-time

Everyone on the team sees the same leads, live. When anyone adds, edits, or
deletes a lead, it updates instantly on every other phone — no refresh
needed. Instead of a password, each person just taps their name once.

## What you're setting up

A free database (Supabase) that all your team's phones connect to, plus the
app itself (the files in this folder) hosted the same way you did the
quotation tool — via GitHub Pages.

This is a one-time setup. Once it's live, your team just uses the link.

---

## Step 1 — Create the database (Supabase)

1. Go to **supabase.com** → Sign up for a free account.
2. Click **New Project**. Give it any name (e.g. `sterix-leads`), set a
   database password (save it somewhere, you likely won't need it again),
   and pick the region closest to India.
3. Wait about 2 minutes while it sets up.

## Step 2 — Create the leads table

1. In your new project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the `setup.sql` file from this folder, copy everything in it, and
   paste it into the SQL editor.
4. Click **Run** (or press Cmd/Ctrl + Enter).
5. You should see "Success. No rows returned." That means the table and
   its sharing rules are created.

## Step 3 — Turn on Realtime

1. Still in Supabase, go to **Database** → **Replication** in the sidebar.
2. Find the `leads` table in the list and toggle it **on**.
   (If you ran `setup.sql` successfully in Step 2, this may already be
   turned on — just double check it's enabled.)

## Step 4 — Get your project's connection details

1. Go to **Settings** (gear icon) → **API Keys**.
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Under **Publishable key**, click to reveal/copy it (starts with
   `sb_publishable_...`). If you only see an **anon key** instead (starts
   with `eyJ...`), that's fine too — it works the same way for this setup.

## Step 5 — Connect the app to your database

1. Open `index.html` from this folder in a code editor (VS Code — see
   below if you don't have it).
2. Near the top of the `<script>` section, find these two lines:
   ```
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
   ```
3. Replace the placeholder text with what you copied in Step 4, keeping the
   quote marks. Example:
   ```
   const SUPABASE_URL = "https://abcdefgh.supabase.co";
   const SUPABASE_KEY = "sb_publishable_xxxxxxxxxxxxxxxx";
   ```
4. Save the file.

**Don't have a code editor?** Search "Visual Studio Code download", install
it (free), then drag `index.html` onto the VS Code window to edit it.

## Step 6 — Team names are already set

This copy of `index.html` already has your team's names built in:
```
const TEAM_NAMES = ["Hasan", "Shikhar", "Aditya", "A.K. Singh", "Murli"];
```
If your team changes later, find this same line in `index.html`, edit the
names (keep the same format — each name in quotes, separated by commas),
and re-upload the file. Anyone not on the list can still type their own
name in, so it's not a hard restriction.

## Step 7 — Put it online (same as the quotation app)

1. Create a new GitHub repository (or reuse a new one — keep it separate
   from the quotation app's repo to avoid mixing up files).
2. Upload all the files in this folder: `index.html`, `manifest.json`,
   `service-worker.js`, the icon PNGs. You don't need to upload `setup.sql`
   or this README — those were just for your one-time setup.
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**,
   branch **main**, folder **/ (root)**, Save.
4. Wait about a minute, then your link will be live at something like:
   `https://yourusername.github.io/sterix-leads/`

## Step 8 — Share it with your team

Send everyone the link. First time they open it, they pick their name from
the list. After that, the app remembers them — they won't see the name
picker again on that device unless they tap "Switch."

Each person can also "Add to Home Screen" on their phone (same as the
quotation app) so it sits as a proper app icon.

---

## How sharing works

- Everyone reads and writes to the same shared list of leads — no separate
  copies, no "my leads vs your leads."
- There's no password. Picking a name is just a label so the team can see
  who added or last edited each lead — it does not restrict who can see or
  change what.
- If your business data is sensitive, know that anyone with the app's link
  can view and edit all leads, the same way anyone with the quotation
  app's link can use it. Don't share the link outside your team.

## Updating the app later

If you want to change something (add a field, tweak a stage name), edit
`index.html` and re-upload it to the same GitHub repo the same way you did
for the quotation tool. Everyone's installed app picks up the change
automatically next time they open it online.

## Costs

Free, on Supabase's free tier, for the scale a small team like this needs
(500MB database, generous monthly request limits). You won't need to pay
unless your team and lead volume grow dramatically.
