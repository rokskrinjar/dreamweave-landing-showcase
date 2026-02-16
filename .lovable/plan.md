
# Stripe Payments Integration Plan

## What We're Building
Adding payment processing so users can upgrade from the Free tier to **Pro** ($9.99/month) or **Lifetime Dreamer** ($99 one-time) directly from your pricing section and dashboard.

## Stripe Products (Already Created)
| Plan | Product ID | Price ID | Amount |
|------|-----------|----------|--------|
| Pro (monthly) | prod_TzWdz2is2Z41IA | price_1T1Xa7FI9Hj3v9v4Cz3XZhdT | $9.99/mo |
| Lifetime Dreamer | prod_TzWd26RWhHPEE7 | price_1T1XaNFI9Hj3v9v4OxpLvWkN | $99 one-time |

## Implementation Steps

### 1. Create `create-checkout` Edge Function
A backend function that:
- Authenticates the user
- Accepts a `priceId` parameter to handle both Pro and Lifetime plans
- Checks if a Stripe customer already exists for the user's email
- Creates a Stripe Checkout session (mode `subscription` for Pro, mode `payment` for Lifetime)
- Returns the checkout URL to redirect the user

### 2. Create `check-subscription` Edge Function
A backend function that:
- Looks up the user's Stripe customer by email
- Checks for active subscriptions (Pro plan)
- Also checks for completed one-time payments (Lifetime plan) via payment intents
- Returns subscription status, product ID, and end date
- Used on login, page load, and periodically to keep status in sync

### 3. Create `customer-portal` Edge Function
A backend function that:
- Creates a Stripe Customer Portal session so users can manage/cancel their subscription
- Returns the portal URL

### 4. Update `useAuth` Hook
- After authentication, automatically call `check-subscription`
- Store subscription status (subscribed, tier, end date) in the auth context
- Make this data available app-wide

### 5. Update Pricing Section (CTASection)
- Wire up the "Go Pro" and "Get Lifetime Access" buttons to call `create-checkout` with the appropriate price ID
- If user is not logged in, redirect to `/auth` first
- If user is already on that plan, show "Current Plan" instead of a buy button

### 6. Update Dashboard
- Show current plan status and a "Manage Subscription" button for Pro users
- Use the subscription data from the auth context to gate features

### 7. Add Success Page
- Create a `/payment-success` route that confirms the purchase and links back to the dashboard

## Technical Details

- **Stripe API version**: `2025-08-27.basil`
- **No webhooks needed** -- subscription status is checked directly via the Stripe API
- The `profiles` table already has `subscription_tier` and `stripe_customer_id` columns, which will be updated by the check-subscription function
- The existing `can_analyze_dream` database function already respects `subscription_tier`, so upgrading will automatically unlock unlimited analyses
