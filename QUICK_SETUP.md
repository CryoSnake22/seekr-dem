# Quick Setup Guide - See Your Changes!

## Step 1: Apply Database Migrations

You need to run the SQL migrations to add the new database columns and tables.

### Option A: Using Supabase Studio (Easiest)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20260127_create_project_skills.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Create another new query
7. Copy and paste the contents of `supabase/migrations/20260127_create_github_repositories.sql`
8. Click **Run**

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply individually
supabase db execute < supabase/migrations/20260127_create_project_skills.sql
supabase db execute < supabase/migrations/20260127_create_github_repositories.sql
```

## Step 2: Restart Your Dev Server

```bash
# Stop the current dev server (Ctrl+C) if running
# Then restart it
pnpm dev
```

## Step 3: View the Changes

### Skills with Proficiency Levels
1. Go to **Profile** page
2. Scroll to the **Skills** section
3. You should now see a **Proficiency level** dropdown when adding skills
4. Existing skills will show proficiency in parentheses: "React (Advanced)"

### GitHub Integrations
1. Go to **Settings** in the sidebar
2. Click on **Manage integrations** (new button in the Integrations section)
3. You'll see the GitHub integration page
4. To test the sync:
   - You need a GitHub Personal Access Token
   - Follow the instructions in `GITHUB_OAUTH_SETUP.md`

### Progress Chart
1. Go to **Dashboard**
2. You should see a new **Match Score Progress** chart
3. It will show data once you add/remove skills (which triggers history recording)

### Projects with GitHub Badge
1. Once you sync GitHub repos, go to **Profile**
2. Scroll to **Projects**
3. GitHub-synced projects will have a purple "GitHub" badge
4. They can't be edited (only deleted) since they're synced from GitHub

## Step 4: Test It Out

### Test Skills Proficiency:
1. Go to Profile → Skills
2. Add a new skill (e.g., "React")
3. Select proficiency level "Advanced"
4. Click "Add skill"
5. You should see: **React (Advanced)**

### Test Match Score History:
1. Add a skill (any skill)
2. Go back to Dashboard
3. The progress chart should now have a data point
4. Add/remove more skills to see the chart grow

### Test GitHub (Optional):
1. Get a GitHub Personal Access Token:
   - GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
2. Manually insert it into your database (for testing):
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO user_github_tokens (user_id, access_token)
   VALUES ('YOUR_USER_ID', 'YOUR_GITHUB_TOKEN');
   ```
3. Go to Settings → Integrations
4. Click "Sync Now"
5. Your repos will be imported as projects with skills detected!

## Troubleshooting

### "Column github_synced does not exist"
- You haven't run the migrations yet
- Apply them using Step 1 above

### "Skills section looks the same"
- The proficiency dropdown is there, but it's subtle
- Look for a second input field next to "Skill name" that says "Proficiency level"

### "Integrations page not found"
- Restart your dev server (Step 2)
- Clear your browser cache
- Make sure you're navigating to: `http://localhost:3000/settings/integrations`

### "Chart is empty"
- The chart needs historical data
- Add a skill, then check the chart
- Each time you modify skills, a history record is created

## What You Should See

**Before migrations:**
- ❌ Skills: Just name input
- ❌ Projects: No GitHub badge
- ❌ Settings: No integrations link
- ❌ Dashboard: No progress chart

**After migrations + restart:**
- ✅ Skills: Name + Proficiency dropdown
- ✅ Projects: GitHub badge on synced repos
- ✅ Settings: "Manage integrations" button
- ✅ Dashboard: Match Score Progress chart
- ✅ Settings → Integrations: Full GitHub sync page

## Screenshots of What to Expect

### Skills Section (Profile Page)
```
┌─────────────────────────────────────────────────────────┐
│ Skills                                                   │
│ Track the skills you want matched against the market.   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [ React (Advanced) ]  [ Edit ]  [ Delete ]              │
│ [ TypeScript (Intermediate) ]  [ Edit ]  [ Delete ]     │
│                                                          │
│ ┌─────────────────┬─────────────────────┐              │
│ │ Skill name      │ Proficiency level   │              │
│ │ [TypeScript__]  │ [ Intermediate  ▼]  │              │
│ └─────────────────┴─────────────────────┘              │
│ [ Add skill ]                                            │
└─────────────────────────────────────────────────────────┘
```

### Settings Page
```
┌──────────────────────────────┐
│ Integrations                 │
│ Connect external services.   │
├──────────────────────────────┤
│ [ Manage integrations  →  ]  │ ← New button!
└──────────────────────────────┘
```

### Integrations Page
```
┌─────────────────────────────────────────────────────────┐
│ GitHub                                 [ 🟢 Connected ] │
│ Automatically sync repositories         [ Sync Now   ] │
│                                          [ Disconnect ] │
└─────────────────────────────────────────────────────────┘
```

---

**Still having issues?** Let me know exactly what you're seeing and I'll help debug!
