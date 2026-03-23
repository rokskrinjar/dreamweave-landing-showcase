

## Rename "Pro" to "Dreamer"

Change the display name from "Pro" to "Dreamer" in both places where the tiers are defined. The internal `plan: "pro"` identifier stays unchanged so Stripe checkout, subscription checks, and all backend logic continue working.

### Files to Edit
1. **`src/pages/Upgrade.tsx`** — change `name: "Pro"` to `name: "Dreamer"`
2. **`src/components/CTASection.tsx`** — change `name: "Pro"` to `name: "Dreamer"`

No backend, database, or Stripe changes needed.

