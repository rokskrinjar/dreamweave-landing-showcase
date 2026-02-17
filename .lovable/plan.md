

## Fix: Google OAuth redirects to landing page instead of dashboard

### Problem
When signing in with Google, the OAuth `redirect_uri` sends users back to `/` (the landing page). The redirect-to-dashboard logic lives only in `Auth.tsx`, which isn't mounted at that point.

### Solution
Two small changes:

**1. Update `Auth.tsx`** - Change the Google OAuth `redirect_uri` to point to `/auth` instead of the site root:
```
redirect_uri: window.location.origin + "/auth"
```
This way, after Google sign-in, the user returns to the Auth page where the existing `onAuthStateChange` listener picks up the session and redirects to `/dashboard`.

**2. Add redirect in `Index.tsx`** (safety net) - Add a check so that if an authenticated user somehow lands on the landing page, they get redirected to `/dashboard`. This covers edge cases like bookmarking the homepage while logged in.

### Files Changed
- `src/pages/Auth.tsx` (line 113) — update `redirect_uri`
- `src/pages/Index.tsx` — add authenticated user redirect

### Risk
Minimal. No visual or UX changes. Only affects the post-OAuth redirect target.

