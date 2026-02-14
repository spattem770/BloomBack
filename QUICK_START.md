# 🚀 Quick Start Guide

Welcome to **BloomBack**! Follow these steps to get your app running.

## ⚠️ IMPORTANT: Database Setup Required

Your app won't work until you complete the database setup below. The errors you're seeing are because the `blooms` table doesn't exist yet.

---

## 📋 Step-by-Step Setup

### 1. Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Make sure you're on your BloomBack project

### 2. Run SQL Script #1: Create Table

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. **Copy this entire SQL code** and paste it:

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

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: ✅ **"Success. No rows returned"**

### 3. Run SQL Script #2: Security Policies

1. Still in SQL Editor, click **"New Query"** again
2. **Copy this entire SQL code** and paste it:

```sql
-- Drop existing policies if they exist
drop policy if exists "read own blooms" on public.blooms;
drop policy if exists "insert own blooms" on public.blooms;
drop policy if exists "update own blooms" on public.blooms;
drop policy if exists "delete own blooms" on public.blooms;

-- Create new policies
create policy "read own blooms"
on public.blooms for select to authenticated
using (auth.uid() = user_id);

create policy "insert own blooms"
on public.blooms for insert to authenticated
with check (auth.uid() = user_id);

create policy "update own blooms"
on public.blooms for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "delete own blooms"
on public.blooms for delete to authenticated
using (auth.uid() = user_id);
```

3. Click **"Run"**
4. You should see: ✅ **"Success. No rows returned"**

---

## ✅ Verify Setup

### Check 1: Table Created
1. In Supabase Dashboard, go to **Database → Tables**
2. You should see `blooms` in the table list
3. Click on it - you should see all the columns

### Check 2: RLS Enabled
1. On the `blooms` table page
2. Look for the green badge that says **"RLS enabled"**

### Check 3: Policies Created
1. Go to **Authentication → Policies** (or **Database → Policies**)
2. You should see **4 policies** for the `blooms` table:
   - ✅ read own blooms
   - ✅ insert own blooms
   - ✅ update own blooms
   - ✅ delete own blooms

---

## 🎉 Test Your App

1. **Refresh** your app in the browser
2. **Create an account** or **log in**
3. **Navigate to** `/create` and send a bloom
4. **Check** `/my-blooms` to see your blooms

### Still Getting Errors?

Visit **`/debug`** in your app to run automatic diagnostics!

---

## 🐛 Common Issues & Solutions

| Error Message | Solution |
|--------------|----------|
| `relation "blooms" does not exist` | Run SQL Script #1 |
| `permission denied` or `policy` error | Run SQL Script #2 |
| `Not logged in` | Sign up or log in to your account |
| Nothing happens when creating bloom | Check browser console (F12) for errors |

---

## 📚 Need More Help?

- 📖 **Full Setup Instructions**: See `SUPABASE_SETUP.md`
- 🔧 **Diagnostic Tool**: Visit `/debug` in your app
- 🌐 **Supabase Docs**: https://supabase.com/docs
- 💬 **Browser Console**: Press F12 to see detailed error messages

---

## ✨ You're All Set!

Once you've completed these steps, your BloomBack app will be fully functional:

- ✅ Users can sign up and log in
- ✅ Logged-in users can create blooms
- ✅ Blooms are saved to the database
- ✅ Users can view their blooms in "My Blooms"
- ✅ Each user can only see their own blooms (secure!)

Happy blooming! 🌸🌳
