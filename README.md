# Seekr

AI-powered career intelligence and resume optimization platform built with Next.js and Supabase.

## Stack

- Next.js 14 (App Router)
- Supabase (Postgres + Auth + RLS)
- Tailwind CSS
- Framer Motion

## Getting Started

**Prerequisites:** Node.js + pnpm

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
   ```
3. Run the dev server:
   ```bash
   pnpm dev
   ```
4. Open `http://localhost:3000`

## Project Status

See `PROJECT_STATUS.md` for the current phase, architecture notes, and next steps.

## Key Docs

- `SUPABASE_SETUP.md` - Supabase setup guide
- `EMAIL_CONFIRMATION.md` - Email confirmation behavior

## Useful Scripts

- `pnpm dev` - Run the dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

