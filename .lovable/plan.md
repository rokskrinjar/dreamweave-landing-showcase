

## In-App Contact Form

A simple contact form that saves messages to the database. No email setup needed -- you check messages directly in your backend.

### Changes

#### 1. Database: `contact_messages` table

```sql
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own" ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);
```

Allows both logged-in and anonymous visitors to submit. `user_id` is optional (nullable) so unauthenticated users from the landing page can also reach out.

#### 2. New page: `src/pages/Contact.tsx`

Simple form with two fields:
- **Email** (pre-filled if logged in)
- **Message** (textarea)

On submit, inserts into `contact_messages` and shows a success toast. Wrapped in the same layout as other pages.

#### 3. Routing: `src/App.tsx`

Add `/contact` route pointing to the new Contact page.

#### 4. Footer update: `src/components/Footer.tsx`

Change the existing `mailto:hello@dreamweave.me` link to point to `/contact` instead.

#### 5. Dashboard link (optional but nice)

Add a small "Contact Us" or "Feedback" link in the dashboard sidebar/header area so logged-in users can easily find it.

### Technical Summary

| File | Change |
|------|--------|
| Database migration | New `contact_messages` table with RLS |
| `src/pages/Contact.tsx` | New contact form page |
| `src/App.tsx` | Add `/contact` route |
| `src/components/Footer.tsx` | Link to `/contact` instead of mailto |

