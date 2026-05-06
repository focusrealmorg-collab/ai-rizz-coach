# 🔥 RizzCoach AI — Complete SaaS Dating Coach

> **AI-powered dating & conversation coach. Stop getting left on read.**

Built with Next.js 16, Supabase, Anthropic Claude, Razorpay, and Tailwind CSS.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + custom CSS variables |
| Database & Auth | Supabase |
| AI | Anthropic Claude (claude-opus-4-5) |
| Payments | Razorpay Subscriptions |
| Hosting | Vercel |

---

## 🚀 Step-by-Step Deployment Guide

### STEP 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-rizz-coach.git
cd ai-rizz-coach
npm install
```

---

### STEP 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, password, and region (pick `ap-south-1` for India)
3. Once created, go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **SQL Editor → New Query** and paste the entire contents of `supabase/schema.sql`
5. Click **Run** ✅
6. Go to **Authentication → URL Configuration**:
   - Site URL: `https://your-vercel-app.vercel.app`
   - Redirect URLs: add `https://your-vercel-app.vercel.app/**`

---

### STEP 3 — Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account → **API Keys → Create Key**
3. Copy the key → `ANTHROPIC_API_KEY`

---

### STEP 4 — Set Up Razorpay (Critical — Read Carefully)

#### 4a. Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com) → Sign up
2. Complete KYC verification (required for live payments)
3. For testing: use **Test Mode** (toggle in top bar)

#### 4b. Create the Trial Plan (₹99 first month)
1. Dashboard → **Subscriptions → Plans → + Create Plan**
2. Fill in:
   - **Plan Name**: `RizzCoach Trial`
   - **Billing Cycle**: Monthly
   - **Amount**: `99` (₹99)
   - **Currency**: INR
3. Click **Create** → Copy the **Plan ID** → `RAZORPAY_TRIAL_PLAN_ID`

#### 4c. Create the Monthly Plan (₹299/month)
1. Create another plan:
   - **Plan Name**: `RizzCoach Monthly`
   - **Billing Cycle**: Monthly
   - **Amount**: `299` (₹299)
   - **Currency**: INR
2. Copy the **Plan ID** → `RAZORPAY_MONTHLY_PLAN_ID`

> **How the ₹99 → ₹299 transition works:**
> The first charge uses the Trial plan (₹99). After 30 days, the webhook `subscription.charged` fires again — at this point, the backend automatically upgrades the user's plan to `monthly_299` and charges ₹299. The Razorpay subscription handles this via the `total_count` setting.
>
> **For a true differential pricing setup** (₹99 first, ₹299 after), configure the Trial plan with an **Offer** of ₹99 for the first cycle in Razorpay's offer engine, or create the subscription with `offer_id` parameter pointing to a ₹99 introductory offer.

#### 4d. Get API Keys
1. Dashboard → **Settings → API Keys**
2. Copy:
   - `Key ID` → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`

#### 4e. Set Up Webhook
1. Dashboard → **Webhooks → + Add New Webhook**
2. **Webhook URL**: `https://your-vercel-app.vercel.app/api/webhooks/razorpay`
3. **Secret**: Create a random string → `RAZORPAY_WEBHOOK_SECRET`
4. **Events to subscribe**:
   - ✅ `subscription.activated`
   - ✅ `subscription.charged`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.completed`
   - ✅ `payment.failed`

---

### STEP 5 — Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ANTHROPIC_API_KEY=sk-ant-...

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_TRIAL_PLAN_ID=plan_...
RAZORPAY_MONTHLY_PLAN_ID=plan_...
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=any_random_32_char_string
```

Test locally:
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

### STEP 6 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial RizzCoach AI SaaS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-rizz-coach.git
git push -u origin main
```

---

### STEP 7 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. **Environment Variables** — add all vars from `.env.local`:
   - Click **Add** for each variable
5. **Deploy** 🚀
6. Once deployed, update:
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL
   - Supabase Auth → Site URL → your Vercel URL
   - Razorpay Webhook → your Vercel URL

---

## 📁 Project Structure

```
ai-rizz-coach/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system
│   ├── login/page.tsx              # Login
│   ├── signup/page.tsx             # Signup → redirects to checkout
│   ├── checkout/page.tsx           # Razorpay payment page
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell (sidebar nav)
│   │   ├── page.tsx                # Chat interface (Suspense wrapper)
│   │   ├── DashboardContent.tsx    # Actual chat UI
│   │   └── profile/page.tsx        # Account & subscription management
│   └── api/
│       ├── chat/route.ts           # Anthropic AI streaming API
│       ├── checkout/
│       │   ├── route.ts            # Create Razorpay subscription
│       │   └── verify/route.ts     # Verify payment & activate subscription
│       └── webhooks/razorpay/
│           └── route.ts            # Handle Razorpay events
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       ├── server.ts               # Server Supabase client
│       └── middleware.ts           # Auth & subscription middleware
├── supabase/
│   └── schema.sql                  # Complete DB schema (run this first)
├── types/
│   └── razorpay.d.ts               # TypeScript declarations
├── middleware.ts                   # Next.js route protection
├── vercel.json                     # Vercel deployment config
└── .env.example                    # Environment variable template
```

---

## 💰 Pricing Logic

| Stage | Plan | Amount | Trigger |
|-------|------|--------|---------|
| Signup | Trial | ₹99 | User completes checkout |
| Day 30 | Monthly | ₹299/month | Razorpay auto-bills, webhook upgrades plan |
| Cancellation | — | ₹0 | User cancels, webhook sets status to `cancelled` |

**Subscription States** (in `profiles.subscription_status`):
- `free` — just signed up, no payment
- `trial` — paid ₹99, within first 30 days
- `active` — paying ₹299/month
- `cancelled` — user cancelled
- `expired` — payment failed / subscription ended

---

## 🧠 AI Coaching Modes

| Mode | Behavior |
|------|----------|
| **Coach Mode** | Strategy, mindset, dating psychology |
| **Reply Drafter** | 3 reply options with psychological explanations |
| **Profile Audit** | Brutal honest review + rewrite |

---

## 🔒 Security

- All routes protected by Next.js middleware
- Dashboard requires active subscription (`trial` or `active`)
- Razorpay webhook signature verification (HMAC SHA256)
- Payment signature verified on backend before activating subscription
- Supabase Row Level Security on all tables
- Service role key used only server-side

---

## 🧪 Testing Payments

Use Razorpay test cards:
- **Success**: `4111 1111 1111 1111`, any future date, any CVV
- **Failure**: `4000 0000 0000 0002`
- UPI test: `success@razorpay`

Switch to **Live Mode** in Razorpay when ready for real payments.

---

## 📞 Support

Built by [Your Name]. Questions? Open an issue on GitHub.
