# Supabase Setup Guide

Follow these steps to set up Supabase for your Seekr application.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the form:
   - **Name**: `seekr-production` (or your preferred name)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development

5. Click **"Create new project"** and wait ~2 minutes for setup

## Step 2: Get Your API Keys

Once your project is ready:

1. In the Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

4. Copy these values - you'll need them in the next step

## Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**To get the Service Role Key:**
- In Supabase dashboard → Settings → API
- Look for **"service_role"** key (this is a secret key - never expose it!)
- Copy and paste it into `.env.local`

## Step 4: Run Database Schema

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open `lib/supabase/schema.sql` in your code editor
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned" ✅

This creates all tables, indexes, RLS policies, and triggers.

## Step 5: Add Seed Data

1. Still in the SQL Editor, click **"New query"** again
2. Open `lib/supabase/seed-data.sql` in your code editor
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"**
6. You should see "Success. X rows returned" ✅

This adds sample market data for 5 job roles with various skills.

## Step 6: Enable Email Auth

1. In Supabase dashboard, click **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** (optional)
4. You can customize the signup/reset password emails if you want

## Step 7: Configure Site URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`

For production later, you'll add your production URLs here.

## Step 8: Verify Setup

1. Make sure your `.env.local` has the correct values
2. Restart your Next.js dev server:
   ```bash
   pkill -f "next dev"
   pnpm dev
   ```
3. The server should start without errors

## Step 9: Test Authentication (Next Step)

After authentication pages are built, you'll be able to:
- Sign up with email/password
- Log in
- Access protected dashboard routes
- User profile will be automatically created via database trigger

## Troubleshooting

### "Failed to fetch"
- Check that your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Make sure there are no extra spaces in `.env.local`

### "Invalid API key"
- Verify you copied the full anon key (it's very long!)
- Check for any line breaks or spaces

### RLS Policy Errors
- Make sure you ran the schema.sql completely
- Check the Supabase dashboard → Database → Policies to see if they're enabled

### Database Connection Issues
- Wait a few minutes after creating the project
- Try refreshing the Supabase dashboard

## Next Steps

After completing this setup:
1. Authentication pages will be created (`/login`, `/signup`)
2. Middleware will protect `/dashboard` routes
3. You'll be able to test the full authentication flow!

---

**Files Created:**
- ✅ `lib/supabase/client.ts` - Browser client
- ✅ `lib/supabase/server.ts` - Server client
- ✅ `middleware.ts` - Route protection
- ✅ `lib/supabase/schema.sql` - Database schema
- ✅ `lib/supabase/seed-data.sql` - Sample data
- ✅ `types/database.ts` - TypeScript types
- ✅ `lib/supabase/queries/users.ts` - Helper functions
