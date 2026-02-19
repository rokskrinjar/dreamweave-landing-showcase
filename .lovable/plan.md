

## Fix: check-subscription "Invalid time value" Crash

### The Problem

User rok.skrinjar@gmail.com has an active Pro subscription in Stripe, but the `check-subscription` backend function crashes every time with "Invalid time value". This means the user's profile never gets updated from `free` to `pro`, so they still see upgrade prompts and can't analyze dreams.

**Root cause:** In Stripe API version `2025-08-27.basil`, `current_period_end` lives on the subscription **item**, not the top-level subscription object. The code does `new Date(sub.current_period_end * 1000)` but `sub.current_period_end` is `undefined`, producing `new Date(NaN)`, which throws "Invalid time value" when `.toISOString()` is called.

### The Fix

**File: `supabase/functions/check-subscription/index.ts` (line 74)**

Change the subscription end date extraction to safely read from the subscription item, with a fallback:

```text
Before:
  const subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();

After:
  const periodEnd = sub.current_period_end
    ?? sub.items?.data?.[0]?.current_period_end;
  const subscriptionEnd = periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : null;
```

This reads `current_period_end` from the top-level subscription first (for compatibility), then falls back to the item-level field. If neither exists, it gracefully returns `null` instead of crashing.

### After Deploying

The function will:
1. Successfully detect the active subscription for this user
2. Update their profile `subscription_tier` from `free` to `pro`
3. The dashboard will stop showing the upgrade banner
4. Dream analysis will work because `can_analyze_dream` checks the tier

### Technical Details

- Only one line needs to change in the edge function
- The fix is backward-compatible with any Stripe API version
- No database changes needed -- the profile update logic already exists in the function, it just never reaches it due to the crash

