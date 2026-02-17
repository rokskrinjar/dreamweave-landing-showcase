

## Add Lifetime CTA to Dashboard Upgrade Banner

### What Changes
The upgrade banner currently only shows the monthly Pro option ("Unlock All Dreams -- $9.99/mo"). We'll add a second, visually distinct Lifetime button alongside it.

### Design
The banner's CTA area will have **two buttons side by side**:
1. **Monthly** (existing): Keep the current purple/indigo gradient style -- "Unlock All Dreams -- $9.99/mo"
2. **Lifetime** (new): Use an orange/amber gradient to stand out -- "Lifetime Access -- $99" with a Crown icon and a small "Best Value" tag above or beside it

The lifetime button will use a warm gradient (orange-to-amber) to contrast with the cool purple of the monthly button, making it visually pop and feel premium.

### Technical Details

**File: `src/pages/Dashboard.tsx`** (lines 154-160)

Replace the single CTA button with two buttons:
- Keep the existing monthly button with its `gradient-indigo` style
- Add a new lifetime button with an `bg-gradient-to-r from-orange-500 to-amber-500` style, including the Crown icon and "Best Value" label
- Both buttons link to `/#pricing` but pass the plan context
- On smaller screens, buttons stack vertically; on larger screens they sit side by side

The lifetime button will also call `handleCheckout("lifetime")` directly (similar to the CTASection pattern) for a more frictionless conversion, opening Stripe checkout in a new tab instead of redirecting to the pricing section.

This requires:
- Importing `supabase` (already imported)
- Adding a `handleCheckout` helper function (same logic as CTASection)
- Adding a loading state for the checkout button

