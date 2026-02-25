

## Create Demo User: Elena García

### Approach
Create a reusable edge function `create-demo-user` that we'll keep around for creating more demo users later.

### Step 1: Create Edge Function

**File: `supabase/functions/create-demo-user/index.ts`**

A service-role edge function that:
- Accepts a JSON body with `email`, `password`, `displayName`, and `tier`
- Creates an auth user via `auth.admin.createUser()` with email confirmed
- The existing `handle_new_user` trigger auto-creates the profile
- Updates the profile to the requested subscription tier

### Step 2: Configure in config.toml

Add `verify_jwt = false` so we can call it without auth (it's an admin tool).

### Step 3: Deploy and invoke to create Elena

- **Email:** `elena.garciav@gmail.com`
- **Password:** `ElenaDemo2026!`
- **Display Name:** Elena Garcia
- **Tier:** pro

### Step 4: Keep the function

We'll leave `create-demo-user` deployed so you can create more demo users later.

### Login Credentials

- **Email:** `elena.garciav@gmail.com`
- **Password:** `ElenaDemo2026!`

After she's created, the account is ready for you to upload the 15 sample dreams.

