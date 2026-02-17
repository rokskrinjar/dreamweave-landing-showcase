
# Full App Testing Report and Fixes

## Testing Results by Persona

### Persona 1: Free User (3 analyses used, wants to upgrade)
- Dashboard correctly shows "0 free analyses remaining this month" with "Upgrade" link
- **BUG: "Upgrade" link navigates to landing page but does NOT scroll to pricing section.** `window.location.href = "/#pricing"` triggers a full page reload but the hash scroll doesn't fire reliably in a SPA.
- Pricing section correctly shows "Current Plan" on Free tier and "Go Pro" / "Get Lifetime Access" buttons on paid tiers
- Checkout function works -- returns a valid Stripe Checkout URL
- When a free user tries to analyze a 4th dream, the backend correctly returns a 403 with an upgrade message
- **BUG: DreamDetail page shows the error as a generic toast but doesn't offer an upgrade path.** The user hits a dead end after seeing the toast.

### Persona 2: Pro User
- Dashboard would show "Pro" badge with Crown icon and "Manage" button
- "Manage" button correctly calls `customer-portal` function
- Patterns page would be unlocked (subscription_tier != "free")
- **BUG: Patterns page "Upgrade Now" button uses `<Link to="/#pricing">`.** React Router `<Link>` doesn't handle hash-based scrolling across routes -- it navigates to `/` without scrolling to pricing.

### Persona 3: Lifetime User
- Dashboard would show "Lifetime Dreamer" badge
- No "Manage" button shown (correct -- no subscription to manage)
- All features unlocked
- No issues specific to this persona

## Issues Found (Priority Order)

### 1. Upgrade links don't scroll to pricing (affects Free + Patterns page)
**Where:** Dashboard line 77, Patterns line 102
**Problem:** Both `window.location.href = "/#pricing"` and `<Link to="/#pricing">` fail to scroll to the pricing section after navigating from `/dashboard` or `/patterns` to `/`.
**Fix:** Use `window.location.href = "/#pricing"` consistently (which does a full page load), and add a `useEffect` on the Index page that scrolls to the hash on mount.

### 2. Dream analysis limit -- no upgrade CTA on the error
**Where:** `DreamDetail.tsx` line 71
**Problem:** When a free user clicks "Analyze This Dream" and gets the 403 "limit reached" error, they see a toast message but no button/link to upgrade. Dead end.
**Fix:** When the error includes the upgrade message (status 403), show a styled upgrade prompt instead of just a toast, with a direct link to pricing.

### 3. Negative free analyses counter (cosmetic)
**Where:** `Dashboard.tsx` line 76
**Problem:** If `dreams_this_month` exceeds 3 (edge case), the counter shows a negative number.
**Fix:** Use `Math.max(0, 3 - profile.dreams_this_month)` to clamp at zero.

### 4. Landing page hash scroll on initial load
**Where:** `Index.tsx` (or wherever the landing page is rendered)
**Problem:** When navigating to `/#pricing` from another route, the page loads at the top without scrolling to the pricing section.
**Fix:** Add a `useEffect` in the Index page that checks `window.location.hash` on mount and scrolls to the matching element.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Add `useEffect` to scroll to hash anchor on mount |
| `src/pages/Dashboard.tsx` | Clamp free analyses counter to 0 minimum |
| `src/pages/DreamDetail.tsx` | Show upgrade CTA when analysis is blocked (403), not just a toast |
| `src/pages/Patterns.tsx` | Change `<Link to="/#pricing">` to use `window.location.href` for proper hash navigation |

## No Changes Needed
- Checkout flow: Works correctly (Stripe URL returned, opens in new tab)
- Sign-out button: Present and working in AppLayout
- Footer links: All working (Privacy, Terms, Features, Pricing, How It Works, Reviews, Contact mailto)
- Hero "See It In Action" button: Correctly scrolls to #how-it-works
- Logo in AppLayout: Links to `/` (home)
- Payment success page: Correctly refreshes subscription and shows appropriate message
- Auth flow: Working (login via Google OAuth confirmed in logs)
