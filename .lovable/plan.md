

## Reset Rachel Morgan's Password

### Approach
Create a temporary edge function `reset-demo-password` that uses the Supabase Admin API (`auth.admin.updateUserById`) to set a new password for Rachel Morgan's account.

### Steps
1. Look up Rachel Morgan's user ID from the `profiles` table
2. Create edge function `supabase/functions/reset-demo-password/index.ts` that accepts a user ID and new password, then calls `supabaseAdmin.auth.admin.updateUserById()`
3. Invoke the function with Rachel's user ID and password `rachel2024demo`
4. Delete the edge function after use

### Result
- **Email:** rachel.morgan40@gmail.com
- **New Password:** rachel2024demo

