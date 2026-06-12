# IronForge - Gym Lead Generation Platform

A production-ready lead generation and member engagement platform for gym owners, built with Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Recharts and Supabase.

The primary business goal: **capture and manage gym membership leads**. Every public surface (BMI calculator, fitness quiz, trial booking, consultation form, exit-intent popup, WhatsApp CTA, signups) feeds the owner's lead pipeline.

## Features

**Public website**
- Premium dark-theme homepage: hero, benefits, transformations, testimonials, free trial CTA, contact
- BMI calculator with instant result, lead capture and save-after-signup
- Multi-step fitness assessment quiz (weight loss / muscle gain / general fitness)
- Free trial booking form (name, email, phone, location, goal)
- Free consultation form, WhatsApp contact CTA, exit-intent lead popup

**Member dashboard** (`/dashboard`)
- BMI and weight history charts, workout streaks, water intake tracking, goal setting, achievements

**Admin dashboard** (`/admin`, gym owner only)
- Total/new leads, trial bookings, lead sources, conversion rate, recent signups and bookings
- Lead management table: search, filter by source/status, sort, inline status updates, CSV export

**Security**
- Supabase Auth with `member` / `admin` roles in `profiles`
- Row Level Security on every table; leads are write-only for the public and readable only by admins
- All form input validated with Zod on the server

---

## 1. Run locally

```bash
# Requirements: Node.js 18.17+ and npm
git clone <this-repo-url>
cd gym_leads
npm install
cp .env.example .env.local   # then fill in your Supabase keys (see below)
npm run dev
```

Open http://localhost:3000.

## 2. Connect Supabase

1. Create a free project at https://supabase.com.
2. In **Project Settings -> API**, copy the Project URL and `anon` public key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   ```
3. Open the **SQL Editor** in the Supabase dashboard, paste the contents of
   `supabase/migrations/0001_init.sql` and run it. This creates all tables
   (`profiles`, `leads`, `fitness_assessments`, `trial_bookings`,
   `workout_streaks`, `weight_logs`, `water_logs`), the signup trigger, the
   role helper and every RLS policy.
   (Alternatively: `supabase link && supabase db push` with the Supabase CLI.)
4. **Create the admin (gym owner) account**: sign up normally through `/signup`,
   then run in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'owner@example.com');
   ```
5. Optional: set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to enable the floating WhatsApp button.

## 3. Push to GitHub

```bash
git remote add github https://github.com/<your-username>/<repo-name>.git
git push github main
```

(Create the empty repository on GitHub first. If GitHub is your only remote, use `git remote add origin ...` and `git push -u origin main`.)

## 4. Deploy to Vercel

1. Go to https://vercel.com/new and import the GitHub repository.
2. Framework preset: **Next.js** (auto-detected). No build settings needed.
3. Add the environment variables under **Settings -> Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL, e.g. `https://ironforge.vercel.app`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (optional)
4. Deploy. Then in Supabase, add your Vercel URL under **Authentication -> URL Configuration** (Site URL and redirect URLs).

## 5. How the gym owner accesses and manages leads

1. Sign in at `/login` with the admin account (see step 2.4 above).
2. Open `/admin` for the overview: total leads, new leads in the last 7 days, trial bookings, conversion rate, lead source breakdown, recent signups and recent bookings.
3. Open `/admin/leads` for the full pipeline:
   - **Search** by name, email, phone or city
   - **Filter** by lead source (BMI calculator, quiz, trial booking, consultation, exit popup, signup) and status
   - **Sort** any column (name, city, BMI, source, status, date)
   - **Update status** inline as you work each lead: `new -> contacted -> trial -> converted` (or `lost`)
   - **Export CSV** of the current filtered view for use in spreadsheets or a CRM

Non-admin users who try to open `/admin` are redirected, and Row Level Security blocks lead data at the database level even if the UI is bypassed.

---

## Project structure

```
app/
  page.tsx                 Homepage
  bmi-calculator/          BMI tool + lead capture
  assessment/              Fitness quiz
  free-trial/              Trial booking
  consultation/            Consultation form
  login/  signup/          Supabase auth
  dashboard/               Member dashboard (protected)
  admin/                   Owner dashboard + lead table (admin only)
  actions/                 Server actions (leads, tracking, admin)
components/
  ui/                      shadcn/ui primitives
  site/                    Marketing sections, popup, WhatsApp CTA
  forms/                   Lead-gen and auth forms (RHF + Zod)
  dashboard/  admin/       Dashboard widgets, charts, lead table
lib/                       Supabase clients, validation, types, helpers
supabase/migrations/       Database schema + RLS
```
