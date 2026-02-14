# Supabase Setup Instructions

## ⚠️ IMPORTANT: Complete These Steps First!

**Your app won't work until you run the SQL scripts below.** The errors you're seeing (`error fetching bloom` and `error creating bloom`) are because the database table doesn't exist yet.

## Step 1: Create the Blooms Table

1. **Open your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "New Query" button
4. **Copy and paste this entire SQL block**, then click "Run":

```sql
-- Create the blooms table
create table if not exists public.blooms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text,
  sender_name text,
  sender_email text,
  message text,
  photo_url text,
  tree_seed numeric not null default random(),
  tree_growth_stage integer not null default 0
);

-- Enable Row Level Security
alter table public.blooms enable row level security;
```

5. **Wait for success message**: You should see "Success. No rows returned"

## Step 2: Create RLS (Row Level Security) Policies

**In the same SQL Editor**, create a **new query** and run this:

```sql
-- Drop existing policies if they exist (safe to run even if they don't exist)
drop policy if exists "read own blooms" on public.blooms;
drop policy if exists "insert own blooms" on public.blooms;
drop policy if exists "update own blooms" on public.blooms;
drop policy if exists "delete own blooms" on public.blooms;

-- Create new policies
create policy "read own blooms"
on public.blooms
for select
to authenticated
using (auth.uid() = user_id);

create policy "insert own blooms"
on public.blooms
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "update own blooms"
on public.blooms
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "delete own blooms"
on public.blooms
for delete
to authenticated
using (auth.uid() = user_id);
```

## Step 3: Verify Setup

After running both SQL scripts:

1. **Check the table exists**:
   - Go to: Database → Tables (in left sidebar)
   - You should see `blooms` in the table list
   - Click on it to see the columns

2. **Check RLS is enabled**:
   - On the blooms table page, you should see "RLS enabled" badge
   
3. **Check policies exist**:
   - Go to: Authentication → Policies
   - You should see 4 policies for the `blooms` table

## Step 4: Test Your App

1. **Refresh your app** in the browser
2. **Log in** to your account (or create one if you haven't)
3. **Try creating a bloom** - it should now work!
4. **Check "My Blooms"** - you should see your created blooms

## ✅ Done!

Your app should now work perfectly:
- ✅ Users can sign up and log in
- ✅ Logged-in users can create blooms (saved to database)
- ✅ Users can view their blooms in "My Blooms"
- ✅ Each user can only see their own blooms (RLS protection)

## 🐛 Still Having Issues?

If you still see errors after completing all steps:

1. **Check browser console** (F12) for specific error messages
2. **Verify you're logged in** - check if you see your email in the nav bar
3. **Try the Debug page** - Visit `/debug` in your app to see connection status
4. **Check Supabase logs**:
   - Go to: Database → Logs
   - Look for any error messages

### Common Issues:

**"relation 'blooms' does not exist"**
- ✅ Solution: Run Step 1 SQL script

**"new row violates row-level security policy"** 
- ✅ Solution: Run Step 2 SQL script

**"permission denied for table blooms"**
- ✅ Solution: Make sure RLS policies were created (Step 2)

**Still stuck?** Check that:
- You ran BOTH SQL scripts (Steps 1 and 2)
- You're logged in to the app
- You refreshed the page after running the SQL