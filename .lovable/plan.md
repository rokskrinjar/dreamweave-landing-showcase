

## Fix rok@induro.io Lifetime Tier -- Comprehensive Plan

### Root Cause Analysis

The sequence of failures:
1. Original checkout created the payment without a Stripe customer record (guest checkout)
2. `check-subscription` finds no Stripe customer for `rok@induro.io`, so it resets `subscription_tier` to `free`
3. We manually set the tier to `lifetime` in the database
4. The updated `check-subscription` code (which preserves manually-set lifetime tiers) was deployed AFTER the old function had already reset the tier back to `free`
5. Now even the new code sees `free` in the database, so the lifetime check does nothing

### Fix Plan

**Step 1: Re-deploy the check-subscription function**
- Confirm the deployed edge function has the latest code with the lifetime profile check
- Deploy it explicitly to be certain

**Step 2: Set the profile back to lifetime**
- Run: `UPDATE profiles SET subscription_tier = 'lifetime' WHERE user_id = 'df4711f7-7cb6-46cb-984e-d3e9f2c91802'`
- This must happen AFTER the function is deployed so the next call preserves it

**Step 3: Test by calling check-subscription directly**
- Use the edge function curl tool to call `check-subscription` with the rok@induro.io auth token
- Verify response is `{ subscribed: true, tier: "lifetime" }`
- Check the function logs to confirm "Profile has manually-set lifetime tier" appears

**Step 4: Verify the database was not reset**
- Query `profiles` again to confirm `subscription_tier` is still `lifetime` after the function call

### Sequence is critical

The order must be: deploy function -> update database -> test. Any other order risks the old function resetting the tier again.

### Technical Details

The code in `check-subscription/index.ts` (lines 68-82) already has the correct logic:

```text
if (customers.data.length === 0) {
  // Check if profile has a manually-set tier
  const { data: profile } = await supabaseAdmin.from("profiles")
    .select("subscription_tier")
    .eq("user_id", userId)
    .single();

  if (profile?.subscription_tier === "lifetime") {
    // Preserves lifetime, does NOT reset to free
    return { subscribed: true, tier: "lifetime" };
  }
  // Only resets to free if tier is NOT lifetime
}
```

No code changes are needed -- only re-deployment and re-setting the database value in the correct order.
