

## Fix the Circular Upgrade Flow

### The Problem

The current user journey when a free user at their limit clicks an unanalyzed dream is circular:

1. **Dashboard**: User sees "Upgrade to analyze" overlay, clicks the dream card
2. **Dream Detail**: Sees "Free analysis limit reached" with a "View Upgrade Options" button
3. **Dashboard**: Gets sent right back where they started

This is confusing and wastes the user's time.

### The Solution

Two changes to eliminate the dead-end loop:

**1. Dream Detail page -- show checkout buttons directly (no redirect)**

Instead of a "View Upgrade Options" button that sends users back to the dashboard, embed the Pro and Lifetime checkout buttons right on the dream detail page. The user can upgrade without leaving the dream they want analyzed.

**2. Dashboard -- intercept clicks on locked dream cards**

When a free user at their limit clicks an unanalyzed dream card, instead of navigating to the dream detail page, scroll smoothly to the upgrade banner already visible on the dashboard. This saves a round-trip and puts the checkout buttons front and center.

### Technical Details

**File: `src/pages/DreamDetail.tsx`**
- Import `Loader2` icon (for loading spinners on buttons).
- Add local state for `loadingPlan` (tracks which checkout is in progress).
- Add a `handleCheckout` function that calls the `create-checkout` backend function (same logic as Dashboard).
- Replace the single "View Upgrade Options" button with the two direct checkout buttons: "Unlock All Dreams -- $9.99/mo" (Pro) and "Lifetime Access -- $99" (Lifetime with "Best Value" badge), styled identically to the dashboard upgrade banner.

**File: `src/pages/Dashboard.tsx`**
- Add a `ref` to the upgrade banner section (`upgradeBannerRef`).
- On locked dream cards (unanalyzed + at limit), intercept the click via `onClick` with `e.preventDefault()`, then smooth-scroll to the upgrade banner.
- This keeps users on the dashboard and draws attention to the checkout buttons they may have scrolled past.

### Result

- From dashboard: clicking a locked dream scrolls to the upgrade banner (no navigation).
- From dream detail: if a user lands there directly (e.g., bookmark), they see checkout buttons inline -- no redirect needed.
- No more circular navigation.

