

## Notify Admin on New User Registration

When a new user signs up, send a notification email to `rok.skrinjar@gmail.com` with the new user's email and signup timestamp.

### Approach

Modify the existing `auth-email-hook` Edge Function. When it processes a `signup` event, it will enqueue an additional notification email to the admin address. This reuses the existing email queue infrastructure — no new functions or tables needed.

### Changes

1. **`supabase/functions/auth-email-hook/index.ts`**
   - After enqueuing the user's confirmation email for `signup` events, enqueue a second email to `rok.skrinjar@gmail.com`
   - The admin email will be a simple HTML notification containing: new user's email, signup timestamp
   - Uses the same `enqueue_email` RPC and `auth_emails` queue
   - Logged in `email_send_log` with `template_name: 'admin_new_user_notification'`

2. **Redeploy** the `auth-email-hook` Edge Function

No new templates, tables, or functions required. The admin email will be a simple inline HTML (no React Email template needed for an internal notification).

