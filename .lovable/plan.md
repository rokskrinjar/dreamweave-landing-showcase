

## Protect Profile Sensitive Fields (Safe, Non-Breaking)

### Risk Assessment: NONE
- **Frontend**: Zero client-side code updates the `profiles` table at all
- **Edge Functions**: All profile updates use `supabaseAdmin` (service role), which bypasses the trigger
- **DB Functions**: `increment_dream_count` is `SECURITY DEFINER`, also bypasses the trigger

### Change
One database migration adding:

1. **Function** `protect_profile_fields()` — a `BEFORE UPDATE` trigger function that, when the caller is `authenticated` (not `service_role`), silently reverts changes to `subscription_tier`, `stripe_customer_id`, `dreams_this_month`, and `is_demo`
2. **Trigger** `protect_profile_sensitive_fields` on `profiles` table

No frontend changes. No edge function changes. Nothing breaks.

