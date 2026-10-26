# Tap Talk insights: setup

"Help improve Tap Talk" lets people **opt in** to sending anonymous weekly counts. This folder is the small server that receives them and feeds your private portal. Until you finish these steps the feature stays **off and hidden** in the app, and the app makes no network requests.

What is sent, and what never is, is listed in `PRIVACY.md` ("Optional anonymous usage counts"). Keep that page true if you change anything here.

## What is in this folder

| Path | What it does |
| --- | --- |
| `migrations/0001_insights.sql` | The `insights_reports` table (locked: only the server can read or write it) and two summary views. |
| `functions/insights` | Receives one report per opted-in device per finished week. Accepts only the exact fields the app sends, stores no IP address, and deletes reports older than 24 months. |
| `functions/insights-summary` | Totals for your portal. Every request needs your dashboard password. |
| `config.toml` | Turns off Supabase's sign-in check for both functions (the app has no accounts; each function checks its own input). |

The portal itself is `public/portal/` in the app, published at `https://brittlejoints.github.io/TapTalk/portal/`. It holds no data; it asks for your password and shows what the summary function returns.

## One-time setup (about 20 minutes)

1. **Create a Supabase project.** Sign up at supabase.com, then New project. The free plan is enough. Pick a region near most of your users. Note the **project reference**, the part before `.supabase.co` in the project URL.
2. **Create the table.** In the project, open SQL Editor, paste the whole of `migrations/0001_insights.sql`, and run it.
3. **Install the Supabase CLI** (supabase.com/docs/guides/cli), then from the repository folder:
   ```sh
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy insights
   supabase functions deploy insights-summary
   ```
4. **Set the two secrets.** Choose a long dashboard password (at least 12 characters; a passphrase of four or more random words is good) and keep it in your password manager:
   ```sh
   supabase secrets set ALLOWED_ORIGIN=https://brittlejoints.github.io
   supabase secrets set DASHBOARD_PASSWORD='your long passphrase'
   ```
5. **Tell the app where to send reports.** On GitHub: the repository, then Settings, Secrets and variables, Actions, the **Variables** tab, then New repository variable:
   - Name: `INSIGHTS_URL`
   - Value: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/insights`
6. **Publish.** Actions, "Deploy to GitHub Pages", Run workflow (or merge any change to `main`). The app then shows "Help improve Tap Talk" in Settings, and the portal shows a sign-in box.

## Using it

- **Portal:** open `https://brittlejoints.github.io/TapTalk/portal/` and sign in with the dashboard password. It is hidden from search engines, but treat the address as private anyway.
- **When numbers appear:** a device sends its report after its week ends (weeks run Monday to Sunday), the next time Tap Talk is opened online. Expect the first numbers about a week after people opt in.
- **Marketing links:** add `?ref=your-tag` to any link you share, for example `https://brittlejoints.github.io/TapTalk/?ref=instagram`. Tags are letters, numbers and dashes, up to 32. The portal's "Where new devices came from" counts each device once, in its first week. Only devices that opt in are counted.
- **What the numbers mean:** "devices" is opted-in devices that used Tap Talk that week. It undercounts everyone, because most people will leave sharing off, so watch the trends, not the totals.

## Good to know

- **No accounts, no IDs.** You cannot look up or delete one person's reports, because nothing links a report to a person. That is deliberate.
- **Fake reports.** The receiving function is public (the app has no sign-in), so someone could send made-up counts. Every field is checked and capped, but a sudden spike you cannot explain may not be real.
- **Changing what is collected** means changing `src/lib/insights.ts`, both functions, the table, the Settings wording in `src/data/strings.ts` and `PRIVACY.md` together.
- **Turning it off for everyone:** delete the `INSIGHTS_URL` variable and publish again. The switch disappears and the app stops sending.
- **Costs:** the free Supabase plan covers this comfortably for a small app. Supabase pauses free projects after a week with no activity; reports keep it awake once people use it.
