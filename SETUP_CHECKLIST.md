# ✅ BloomBack Setup Checklist

Use this checklist to ensure everything is configured correctly.

## Pre-Setup
- [ ] I have access to my Supabase dashboard
- [ ] I'm on the correct Supabase project
- [ ] My app is running locally (or deployed)

---

## Database Setup

### Part 1: Create Blooms Table
- [ ] Opened Supabase Dashboard at https://supabase.com/dashboard
- [ ] Clicked "SQL Editor" in sidebar
- [ ] Clicked "New Query"
- [ ] Pasted SQL script for creating table (from QUICK_START.md Step 2)
- [ ] Clicked "Run" button
- [ ] Saw "Success. No rows returned" message

### Part 2: Create Security Policies
- [ ] Still in SQL Editor, clicked "New Query" again
- [ ] Pasted SQL script for RLS policies (from QUICK_START.md Step 3)
- [ ] Clicked "Run" button
- [ ] Saw "Success. No rows returned" message

---

## Verification

### In Supabase Dashboard
- [ ] Navigated to Database → Tables
- [ ] See `blooms` table in the list
- [ ] Clicked on `blooms` table
- [ ] See all columns: id, created_at, user_id, recipient_name, etc.
- [ ] See "RLS enabled" badge on the table
- [ ] Navigated to Authentication → Policies (or Database → Policies)
- [ ] See 4 policies for blooms table:
  - [ ] "read own blooms"
  - [ ] "insert own blooms"
  - [ ] "update own blooms"
  - [ ] "delete own blooms"

### In Your App
- [ ] Refreshed the app in browser
- [ ] Orange warning banner is gone (if it was showing)
- [ ] Navigated to `/debug`
- [ ] All checks show green checkmarks ✅
- [ ] No red error boxes

---

## Testing

### Authentication
- [ ] Can sign up for a new account
- [ ] Can log in with existing account
- [ ] See my email in the navbar when logged in
- [ ] Can log out

### Creating Blooms
- [ ] Logged in to the app
- [ ] Navigated to `/create`
- [ ] Filled out the form:
  - [ ] Recipient name
  - [ ] Sender name
  - [ ] Email
  - [ ] Message
  - [ ] (Optional) Photo
- [ ] Clicked "Plant Tree & Send Bloom"
- [ ] Saw success message (green toast notification)
- [ ] Was redirected to bloom view page
- [ ] No errors in browser console

### Viewing Blooms
- [ ] Navigated to `/my-blooms`
- [ ] See the bloom I just created
- [ ] Can click on it to view details
- [ ] Photo (if uploaded) is displaying correctly
- [ ] Message is showing
- [ ] Date is correct

---

## Troubleshooting

If any checkbox above fails:

### Database Issues
- [ ] Checked browser console (F12) for errors
- [ ] Ran `/debug` page diagnostics
- [ ] Verified I'm on the correct Supabase project
- [ ] Re-ran SQL scripts
- [ ] Checked Supabase logs (Database → Logs)

### Authentication Issues
- [ ] Confirmed email verification (check spam folder)
- [ ] Tried logging out and back in
- [ ] Checked that email/password are correct
- [ ] Verified auth is enabled in Supabase (Authentication → Providers)

### Visual/UI Issues
- [ ] Hard refreshed browser (Cmd/Ctrl + Shift + R)
- [ ] Cleared browser cache
- [ ] Tried in incognito/private window
- [ ] Checked network tab for failed requests

---

## Success Criteria

✅ **Your app is fully set up when:**
- All database checkboxes are ✅
- All verification checkboxes are ✅
- You can create a bloom without errors
- You can view your blooms in "My Blooms"
- The `/debug` page shows all green

---

## Next Steps

Once setup is complete:
1. 🎉 Celebrate! Your app is working!
2. 🌸 Create some test blooms
3. 📱 Share the app with friends
4. 🌳 Start sending real blooms

---

## Quick Reference

| Page | Purpose |
|------|---------|
| `/` | Landing page |
| `/create` | Create a new bloom |
| `/my-blooms` | View all your blooms |
| `/view/:userId/:bloomId` | View a specific bloom |
| `/login` | Log in to account |
| `/signup` | Create new account |
| `/debug` | Run system diagnostics |

| Document | Contains |
|----------|----------|
| `QUICK_START.md` | Simple setup guide |
| `SUPABASE_SETUP.md` | Detailed SQL instructions |
| `DIAGNOSIS_AND_FIX.md` | Error explanations |
| `SETUP_CHECKLIST.md` | This checklist |

---

**Last Updated**: Check the date of this file for the latest version.

**Need Help?** Visit `/debug` or check the browser console (F12) for detailed error messages.
