

## Let Users Always View Their Dreams

### The Problem

Right now, clicking any unanalyzed dream while at the free limit does nothing visible -- the click is intercepted and tries to scroll to the upgrade banner. But users should always be able to read their own dream entries. The restriction should only prevent *analysis*, not *viewing*.

### The Fix

**File: `src/pages/Dashboard.tsx`**

Remove the `onClick` handler (lines 246-251) from the dream card `Link` component that intercepts clicks and calls `e.preventDefault()`. Users will navigate to the dream detail page as normal.

The Dream Detail page already has the upgrade prompt with direct checkout buttons for users who have hit the free limit, so the upgrade path is covered there.

The lock overlay on hover (lines 293-300) can stay as a visual hint, or optionally be removed since it implies the card is non-clickable. Keeping it as a subtle indicator that analysis requires an upgrade is acceptable.

### Result

- Clicking any dream card always opens the dream detail page
- If the user is at the free limit and the dream is unanalyzed, the detail page shows the inline upgrade buttons (Pro and Lifetime) -- already implemented
- No more "nothing happens" dead clicks
