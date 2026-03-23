

## Create In-App Upgrade/Pricing Page

### What Changes
Replace the small dropdown upgrade popup in the dashboard with a link to a dedicated `/upgrade` page inside the authenticated app.

### New Page: `src/pages/Upgrade.tsx`
- Wrapped in `<AppLayout>` for consistent authenticated navigation
- **Header section** (light background, like the screenshot):
  - Title: "Continue exploring your dreams"
  - Subtitle: "Unlock unlimited dream analysis and discover deeper patterns across your dreams."
  - Footer text: "Cancel anytime · No commitments"
- **Pricing cards**: Reuse the same 3-tier layout from `CTASection.tsx` (Free, Pro, Lifetime) with identical styling, features, icons, and checkout logic
- Light theme adaptation since it's inside the app (not the dark landing page)

### Modified Files

1. **`src/pages/Dashboard.tsx`**
   - Replace the `<DropdownMenu>` upgrade trigger with a simple `<Link to="/upgrade">` styled the same way
   - Also update the upgrade banner buttons to link to `/upgrade` instead of triggering checkout directly

2. **`src/App.tsx`**
   - Add lazy import for `Upgrade` page
   - Add route: `/upgrade` wrapped in `<AuthGuard>`

### Files
- **New**: `src/pages/Upgrade.tsx`
- **Edit**: `src/pages/Dashboard.tsx` (replace dropdown with link)
- **Edit**: `src/App.tsx` (add route)

