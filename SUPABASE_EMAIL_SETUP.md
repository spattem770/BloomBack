# 📧 Supabase Email Verification Setup for BloomBack

## How to Fix & Customize Your Verification Email

### Step 1: Access Email Templates in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. Find the **"Confirm signup"** template

### Step 2: Customize the Email Template

Replace the default template with this Valentine's Day themed version:

```html
<h2>Welcome to BloomBack! 💝</h2>

<p>Hi there!</p>

<p>Thank you for signing up for <strong>BloomBack</strong> — where love grows forever! 🌸🌳</p>

<p>We're excited to have you join our community of people who believe in gifts that last. Click the button below to verify your email address and start sending blooms that plant real trees:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(to right, #ec4899, #f43f5e); 
            color: white; 
            padding: 15px 40px; 
            text-decoration: none; 
            border-radius: 30px; 
            font-weight: bold;
            display: inline-block;">
    ✨ Verify Your Account
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #059669;">{{ .ConfirmationURL }}</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

<p><strong>What's Next?</strong></p>
<ul>
  <li>💐 Send your first Valentine bloom</li>
  <li>🌳 Plant real trees with every gift</li>
  <li>💚 Track your environmental impact</li>
  <li>💕 Create lasting memories</li>
</ul>

<p style="margin-top: 30px;">
  <strong>Welcome to the BloomBack family!</strong><br>
  <em>Together, we're making love grow — literally. 🌱</em>
</p>

<p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
  If you didn't create an account with BloomBack, you can safely ignore this email.
</p>

<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
  <p>💝 <strong>BloomBack</strong> • Valentine's Edition</p>
  <p>Send flowers that die in 3 days? Not anymore. 🌸🌳</p>
</div>
```

### Step 3: Configure Email Settings

#### Option A: Use Supabase's Built-in Email (Easiest)

1. Go to **Project Settings** → **Auth**
2. Under **Email Auth**:
   - Make sure **"Enable email confirmations"** is turned **ON**
   - Set your **"Site URL"** to your app URL (e.g., `https://your-app.com`)
   - Set **"Redirect URLs"** to include: `https://your-app.com/my-blooms`

#### Option B: Disable Email Confirmation (For Testing)

If you want to skip email verification during development:

1. Go to **Authentication** → **Settings** (or **Email Auth**)
2. Find **"Enable email confirmations"**
3. Turn it **OFF**
4. Save changes

Users will be able to sign up and log in immediately without verifying their email.

#### Option C: Use Custom SMTP (Production Recommended)

For more reliable email delivery:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **"Use custom SMTP"**
3. Enter your SMTP provider details:
   - **SendGrid** (recommended): https://sendgrid.com
   - **Mailgun**: https://mailgun.com
   - **AWS SES**: https://aws.amazon.com/ses/
   - **Gmail** (testing only): Use app-specific password

Example for SendGrid:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
From Email: noreply@yourdomain.com
From Name: BloomBack
```

### Step 4: Test the Email

1. Sign up with a real email address
2. Check your inbox (and spam folder!)
3. Click the verification link
4. You should be redirected to `/my-blooms`

### Step 5: Customize Other Email Templates (Optional)

While you're in **Email Templates**, you can also customize:

- **Magic Link** - For passwordless login
- **Change Email Address** - When users update their email
- **Reset Password** - For password recovery

Use the same Valentine's Day theme for consistency!

---

## Troubleshooting

### Emails Not Sending?

1. **Check Supabase Logs**: Go to **Logs** → **Auth** in your dashboard
2. **Verify Email Address**: Make sure your "From Email" is verified
3. **Check Spam Folder**: Emails might be filtered
4. **Rate Limits**: Supabase has rate limits on free tier
5. **Custom SMTP**: If using custom SMTP, verify credentials

### Emails Going to Spam?

1. Use a custom domain email (not @gmail.com)
2. Set up **SPF**, **DKIM**, and **DMARC** records
3. Use a dedicated email service like SendGrid
4. Warm up your sending domain gradually

### Users Not Being Redirected?

Make sure your **Redirect URLs** are configured in:
**Project Settings** → **Auth** → **Redirect URLs**

Add:
- `http://localhost:5173/*` (for development)
- `https://yourdomain.com/*` (for production)

---

## Current App Configuration

The app is already set up to:
- ✅ Show a beautiful "Check Your Email" screen after signup
- ✅ Handle email confirmation flow automatically
- ✅ Redirect to `/my-blooms` after verification
- ✅ Display helpful messages if email doesn't arrive

All you need to do is configure the Supabase dashboard settings above!

---

## Questions?

If you're still having issues:
1. Check the browser console for errors
2. Check Supabase Auth logs
3. Visit `/debug` in your app for diagnostics
4. Make sure your Supabase RLS policies allow user signup

Happy blooming! 🌸💕
