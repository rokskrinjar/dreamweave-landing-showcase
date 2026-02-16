

# Go-Live Audit: Dead Ends and Fixes

## Issues Found

### 1. "See It In Action" button is a dead end (LANDING PAGE)
The Hero section has a **"See It In Action"** button that does absolutely nothing -- no `onClick`, no link, no modal. It's a dead-end button sitting right next to your main CTA.

**Fix:** Either link it to a demo video / scroll to the "How It Works" section, or remove it entirely to keep the hero clean and focused on one CTA.

### 2. Footer links are all dead ends
The Footer has 6 placeholder links pointing to `href="#"` that go nowhere:
- Dream Guide, Blog, Help Center (Resources)
- Privacy Policy, Terms of Service, Contact (Legal)

**Fix:** For launch, either remove these placeholder links or create simple static pages for Privacy Policy and Terms of Service (which are legally required for processing payments via Stripe).

### 3. No sign-out button anywhere
Users can log in but there's no visible way to sign out. The `signOut` function exists in `useAuth` but is never wired to any UI element.

**Fix:** Add a sign-out button to the `AppLayout` sidebar/header.

### 4. Dashboard "Upgrade" link goes to `/#pricing` -- may not scroll correctly
The Dashboard links free users to `/#pricing` to upgrade. Since this navigates to a different route (`/` from `/dashboard`), the hash-based scroll may not work reliably.

**Fix:** Use programmatic scroll-after-navigate or redirect to `/` and then scroll to the pricing section.

### 5. No back-to-landing navigation from the app
Once users are inside the app (Dashboard, etc.), there's no way to get back to the marketing landing page without manually editing the URL.

**Fix:** Make the logo in `AppLayout` link to `/` or add a "Home" link.

## Technical Details

### Files to modify:
| File | Change |
|------|--------|
| `src/components/Hero.tsx` (line 43-46) | Wire "See It In Action" button to scroll to `#how-it-works` or remove it |
| `src/components/Footer.tsx` (lines 30-34, 39-43) | Remove dead `href="#"` links or create Privacy/Terms pages |
| `src/components/AppLayout.tsx` | Add sign-out button using `useAuth().signOut()` |
| `src/components/AppLayout.tsx` | Ensure logo links back to `/` |
| `src/pages/Dashboard.tsx` (line 77) | Fix `/#pricing` link to navigate properly |

### New pages to create (recommended for Stripe compliance):
- `src/pages/Privacy.tsx` -- basic privacy policy
- `src/pages/Terms.tsx` -- basic terms of service
- Register both in `src/App.tsx` routes

### Priority order:
1. Fix the Hero dead-end button (most visible)
2. Add sign-out functionality (users are trapped)
3. Fix footer dead links / add Privacy + Terms pages (Stripe requirement)
4. Fix Dashboard upgrade link navigation
5. Add back-to-home navigation from app pages
