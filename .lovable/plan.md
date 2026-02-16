

# DreamWeave.me -- Full App Build Plan

This is the complete plan to go from landing page to money-making SaaS. We'll improve the landing page copy, add the 3-tier pricing section, and build the entire dream journal app with AI analysis.

---

## Phase 1: Landing Page Overhaul + Pricing

The current copy reads generic. We'll rewrite it to be specific, emotional, and conversion-focused.

### Landing Page Changes

**Hero Section** (`Hero.tsx`)
- Rewrite headline: "That dream meant something. Find out what." instead of generic "Unlock the wisdom"
- Sharper subtext focused on the pain point: waking up from a vivid dream and forgetting or not understanding it
- Social proof line under CTA buttons ("Join 2,000+ dreamers already uncovering their subconscious")

**Features Section** (`Features.tsx`)
- Rewrite descriptions to be benefit-driven, not feature-driven
- Example: Instead of "Capture your dreams quickly with voice or text recording" use "You just woke up. That dream is fading. Type it out in 60 seconds before it's gone forever."
- Trim from 6 cards to 4 (remove Symbol Library and Search -- those are secondary features, not selling points)

**How It Works** (`HowItWorks.tsx`)
- Make it feel faster and more tangible
- Add time estimates: "30 seconds", "Instant", "After 7 days"

**Testimonials** (`Testimonials.tsx`)
- Rewrite to feel more authentic and specific (less polished, more real)

**CTA/Pricing Section** (`CTASection.tsx`) -- Complete rewrite
- 3-tier pricing cards on the dark gradient background:
  - **Free**: $0/mo -- 3 dream analyses/month, basic journaling
  - **Pro**: $9.99/mo -- Unlimited dreams, full AI analysis, pattern recognition, mood tracking (highlighted as "Most Popular")
  - **Lifetime Dreamer**: $199 one-time -- Everything in Pro forever, early adopter badge, priority support (badged as "Best Value")
- Each card has feature list with checkmarks, CTA button

**Footer** (`Footer.tsx`) -- Minor link updates

---

## Phase 2: Backend Setup (Lovable Cloud)

### Enable Lovable Cloud
- Enable Supabase backend
- Enable Lovable AI for dream analysis

### Database Schema (3 migrations)

**Migration 1: Core tables**
- `profiles` table: id (FK to auth.users), display_name, subscription_tier (free/pro/lifetime), dreams_this_month, current_period_start, created_at
- `dreams` table: id, user_id (FK to auth.users), title, content, mood, tags (text array), recorded_at, created_at
- `analyses` table: id, dream_id (FK to dreams), summary, symbols (jsonb), themes (jsonb), emotions (jsonb), psychological_insight, created_at
- Trigger to auto-create profile on signup
- Trigger to reset dreams_this_month each billing period

**Migration 2: RLS policies**
- All tables: users can only read/write their own data
- Profiles: users can read and update their own profile
- Dreams: users can CRUD their own dreams
- Analyses: users can read analyses for their own dreams

**Migration 3: Helper functions**
- `can_analyze_dream(user_id)` -- checks if user has remaining analyses (free tier limit)
- `increment_dream_count(user_id)` -- bumps the monthly counter

### Edge Functions

**`analyze-dream`** -- Takes dream text, calls Lovable AI (Gemini) with a psychology-focused prompt, extracts symbols/themes/emotions via tool calling, saves to analyses table, returns result

**`dream-patterns`** -- Pulls user's last 30 dreams + analyses, sends to Lovable AI asking for recurring patterns, emotional trends, and actionable suggestions

---

## Phase 3: Authentication

### New Files
- `src/pages/Auth.tsx` -- Login/Signup page with email + Google sign-in
- `src/components/AuthGuard.tsx` -- Protects app routes, redirects to /auth
- `src/pages/ResetPassword.tsx` -- Password reset page

### Route Updates (`App.tsx`)
- `/auth` -- public
- `/reset-password` -- public
- `/dashboard`, `/dreams/*`, `/patterns` -- protected behind AuthGuard

### Navbar Update
- "Start Dreaming" button links to /auth (or /dashboard if logged in)
- Add user menu dropdown when authenticated (profile, logout)

---

## Phase 4: Core App Pages

### New Files
- `src/pages/Dashboard.tsx` -- Dream list with search/filter, "Record a Dream" CTA, dream count indicator for free users
- `src/pages/NewDream.tsx` -- Simple form: title, dream content (textarea), mood selector (dropdown with options like peaceful, anxious, euphoric, confused, nostalgic, fearful), optional tags
- `src/pages/DreamDetail.tsx` -- Shows dream content + AI analysis (symbols, themes, emotions, psychological insight). "Analyze" button if not yet analyzed
- `src/pages/Patterns.tsx` -- Long-term pattern view with:
  - Mood trend chart (Recharts line chart over time)
  - Top recurring symbols/themes
  - AI-generated insight summary
  - Gated behind Pro/Lifetime tier

### App Layout
- `src/components/AppLayout.tsx` -- Sidebar or top nav for authenticated pages with links to Dashboard, Record Dream, Patterns, and account settings
- Responsive: sidebar on desktop, bottom nav on mobile

---

## Phase 5: Stripe Payments

- Enable Stripe integration
- Create 2 Stripe products:
  - **Pro Monthly**: $9.99/month recurring
  - **Lifetime Dreamer**: $199 one-time payment
- Pricing page links to Stripe Checkout
- Webhook edge function to update user's subscription_tier in profiles table on successful payment
- Gate features based on tier: free users see upgrade prompts when hitting limits

---

## Phase 6: Polish

- Mobile hamburger menu for landing page navbar
- Loading skeletons on dashboard and analysis pages
- Toast notifications for success/error states
- Empty states (no dreams yet, no patterns yet)
- Smooth page transitions
- Update landing page CTA buttons to link to /auth

---

## Build Order (what happens step by step)

1. Rewrite landing page copy + add pricing section (no backend needed)
2. Enable Lovable Cloud + create database tables + RLS
3. Build auth pages + route protection
4. Build dashboard + dream recording form + dream detail page
5. Enable Lovable AI + build analyze-dream edge function
6. Build patterns page + dream-patterns edge function
7. Enable Stripe + wire up payments
8. Polish and test end-to-end

---

## Technical Details

### Files to Create
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/NewDream.tsx`
- `src/pages/DreamDetail.tsx`
- `src/pages/Patterns.tsx`
- `src/components/AuthGuard.tsx`
- `src/components/AppLayout.tsx`
- `src/components/PricingCards.tsx`
- `src/components/DreamCard.tsx`
- `src/components/MoodSelector.tsx`
- `src/components/AnalysisView.tsx`
- `src/components/PatternChart.tsx`
- `src/hooks/useAuth.tsx`
- `src/hooks/useDreams.tsx`
- `src/integrations/supabase/` (auto-generated by Lovable Cloud)
- `supabase/functions/analyze-dream/index.ts`
- `supabase/functions/dream-patterns/index.ts`

### Files to Modify
- `src/App.tsx` -- Add all new routes
- `src/components/Hero.tsx` -- Rewrite copy
- `src/components/Features.tsx` -- Rewrite copy, reduce to 4 cards
- `src/components/HowItWorks.tsx` -- Rewrite copy
- `src/components/Testimonials.tsx` -- Rewrite copy
- `src/components/CTASection.tsx` -- Full rewrite with 3 pricing tiers
- `src/components/Navbar.tsx` -- Add auth-aware navigation
- `src/components/Footer.tsx` -- Update links
- `src/index.css` -- Add any new utility classes needed

### Key Dependencies (already installed)
- `recharts` -- for pattern charts
- `react-router-dom` -- for routing
- `@tanstack/react-query` -- for data fetching
- `sonner` -- for toast notifications
- `lucide-react` -- for icons (replacing emoji where appropriate)

