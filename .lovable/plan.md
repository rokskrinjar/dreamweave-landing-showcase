

## Fix Demo User Tier Persistence

### Problem
The `check-subscription` function runs every time a user logs in (and every 60 seconds). For demo users like Elena who have no Stripe customer record, it overwrites their manually-set "pro" tier back to "free" -- even though we added code to preserve it. The deployed function likely hadn't been updated when Elena logged in, so her profile was already reset to "free" before the fix could take effect.

### Solution: Add an `is_demo` flag to profiles

Add a boolean `is_demo` column to the `profiles` table. When this flag is `true`, the `check-subscription` function will skip Stripe entirely and return whatever tier is stored in the profile. This cleanly separates demo users from regular users with zero impact on paying customers.

### Step 1: Database migration

Add `is_demo` column to `profiles`:

```sql
ALTER TABLE public.profiles
  ADD COLUMN is_demo boolean NOT NULL DEFAULT false;
```

### Step 2: Set Elena as a demo user

```sql
UPDATE public.profiles
SET is_demo = true, subscription_tier = 'pro'
WHERE user_id = '7dbb8eba-4514-426c-91bb-353d314f94c0';
```

### Step 3: Update `check-subscription` edge function

Early in the function, after authenticating the user and before any Stripe calls, add:

```typescript
// Check if this is a demo user - skip Stripe entirely
const { data: profile } = await supabaseAdmin.from("profiles")
  .select("subscription_tier, is_demo")
  .eq("user_id", userId)
  .single();

if (profile?.is_demo) {
  const tier = profile.subscription_tier || "free";
  logStep("Demo user, skipping Stripe", { tier });
  return new Response(JSON.stringify({
    subscribed: tier !== "free",
    tier,
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

This goes right after line 63 (the `supabaseAdmin` creation), before the Stripe customer lookup.

### Step 4: Update `create-demo-user` function

Update the function to also set `is_demo = true` when creating demo users, so future demo users are automatically flagged:

```typescript
.update({ subscription_tier: tier, display_name: displayName, is_demo: true })
```

### Step 5: Redeploy `check-subscription`

Deploy the updated function so it takes effect immediately.

### What this does NOT change
- Regular users are completely unaffected -- `is_demo` defaults to `false`
- Stripe sync continues to work normally for real customers
- The only difference: demo users bypass Stripe and use whatever tier you set in their profile

