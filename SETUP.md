# TriglyCoach - Setup Guide

Complete step-by-step guide to set up and run your TriglyCoach app with Supabase.

---

## Part 1: Supabase Setup

### Step 1.1: Create Supabase Account
1. Go to https://app.supabase.com
2. Click **Start your project**
3. Sign up with GitHub or email
4. Verify your email if needed

### Step 1.2: Create New Project
1. Click **New Project**
2. Fill in:
   - **Name**: `TriglyCoach` (or any name you want)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., Europe West)
3. Click **Create new project**
4. Wait 2-3 minutes for project to initialize

### Step 1.3: Run the Migration Script
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase-migration.sql` from your project
4. Copy the ENTIRE contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned"

### Step 1.4: Verify Tables Were Created
1. Click **Table Editor** (left sidebar)
2. You should see 3 tables:
   - `profiles`
   - `checklist_templates`
   - `daily_entries`
3. Click on `profiles` table
4. You should see 1 row with `id = "fixed-user-id"`

### Step 1.5: Get Your API Credentials
1. Click **Settings** (left sidebar, bottom)
2. Click **API** under Project Settings
3. Find the **Project URL**:
   - Should look like: `https://abcdefghijk.supabase.co`
   - Copy this entire URL
4. Find the **anon/public** key under "Project API keys":
   - Long string starting with `eyJ...`
   - Click the copy icon
   - Copy this entire key

---

## Part 2: Local Development Setup

### Step 2.1: Create Environment File
1. Open your terminal
2. Navigate to your project:
   ```bash
   cd ~/Documents/projects/triglycoach
   ```
3. Create `.env.local` file:
   ```bash
   touch .env.local
   ```

### Step 2.2: Add Supabase Credentials
1. Open `.env.local` in your editor
2. Add these two lines (replace with YOUR values):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
   ```
3. Example (yours will be different):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg5OTk5OTksImV4cCI6MjAwNDU3NTk5OX0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. Save the file

### Step 2.3: Install Dependencies (if not done)
```bash
npm install
```

### Step 2.4: Run the Development Server
```bash
npm run dev
```

### Step 2.5: Open the App
1. Open your browser
2. Go to: http://localhost:3000
3. You should see the TriglyCoach app

---

## Part 3: Testing the App

### Step 3.1: Test Basic Functionality
1. You should see the **Today** page with checklist items
2. Click a few checkboxes
3. Watch the progress bar update

### Step 3.2: Verify Supabase Sync
1. Go back to Supabase dashboard
2. Click **Table Editor**
3. Click `daily_entries` table
4. You should see a new row with today's date
5. Click on the row to expand
6. You should see your checked items in the `sections` JSONB field

### Step 3.3: Test Settings Page
1. In the app, click **Setări** (bottom navigation)
2. If Supabase is connected, you should see:
   - "Sincronizare Cloud" section at the top
   - "Sincronizează Acum" button
3. Click **Sincronizează Acum**
4. Should show "Sincronizare..." then complete

### Step 3.4: Test Data Persistence
1. Close your browser
2. Stop the dev server (Ctrl + C)
3. Restart: `npm run dev`
4. Open http://localhost:3000
5. Your checked items should still be there (loaded from Supabase!)

---

## Part 4: Building for Production

### Step 4.1: Test Production Build
```bash
npm run build
```

Should complete without errors.

### Step 4.2: Deploy to Vercel (Recommended)

#### Option A: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
3. Follow prompts (press Enter for defaults)
4. When asked, add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Option B: Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Add Environment Variables:
   - Click **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` → your URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your key
5. Click **Deploy**

### Step 4.3: Install as PWA (Mobile)
1. Open your deployed app URL on your phone
2. **iOS**: Safari → Share → Add to Home Screen
3. **Android**: Chrome → Menu → Install App
4. The app will work offline!

---

## Troubleshooting

### Issue: "Error: Invalid Supabase URL or key"
**Solution:**
- Check `.env.local` has correct URL and key
- Restart dev server after creating `.env.local`
- Make sure no extra spaces or quotes

### Issue: Data not syncing to Supabase
**Solution:**
- Check Supabase dashboard → Settings → API → Check if project is active
- Verify RLS is disabled (our schema doesn't use it)
- Check browser console for errors (F12)

### Issue: "relation 'profiles' does not exist"
**Solution:**
- You didn't run the migration script
- Go back to Part 1, Step 1.3

### Issue: App shows old data after clearing
**Solution:**
- Clear browser localStorage: F12 → Application → Local Storage → Clear
- Click "Șterge Toate Datele" in Settings
- Sync from cloud

---

## Next Steps

✅ Your app is now running with Supabase!

**Customize:**
- Edit checklist items in `lib/defaults.ts`
- Change Romanian translations in `lib/translations.ts`
- Modify theme/colors in Tailwind classes

**Monitor:**
- Check Supabase dashboard for data
- View sync history
- Monitor database size (free tier: 500MB)

---

Need help? Check the GitHub repository or create an issue.
