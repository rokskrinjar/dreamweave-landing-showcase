

## Replace Lifetime Plan with Yearly Option + Monthly/Yearly Toggle

### Overview
Remove the Lifetime tier entirely. Add a Monthly/Yearly toggle switch (like standard SaaS pricing pages). When "Yearly" is selected, show the Dreamer card with €39.99/year pricing and a "Save 33%" badge. The layout becomes 2 cards (Free + Dreamer) with the billing toggle above them.

### 1. Update Edge Function — `supabase/functions/create-checkout/index.ts`

- Change the Zod schema from `z.enum(["pro", "lifetime"])` to `z.enum(["pro", "pro_yearly"])`
- Replace the `lifetime` entry in `PRICE_CONFIG` with:
  - `pro_yearly: { priceId: "price_1TEcWuF0C59Hu24kcQW3cztt", mode: "subscription" }`
- Remove the old lifetime price ID

### 2. Update `check-subscription/index.ts`

- Remove the lifetime one-time payment check (lines 144-167) since lifetime no longer exists
- Keep the manually-set tier preservation logic for any legacy lifetime users
- Both monthly and yearly subscriptions will resolve as `tier: "pro"` since they are both active subscriptions

### 3. Update `src/pages/Upgrade.tsx` (in-app pricing)

- Remove the Lifetime tier from the `tiers` array
- Keep only Free and Dreamer tiers as static data
- Add `isYearly` state with a toggle switch between "Monthly" and "Yearly"
- When yearly is selected, update the Dreamer card to show:
  - Price: "€39.99" with period "/year"
  - A small "Save 33%" pill next to or below the price
  - Same features list
- Pass `plan: isYearly ? "pro_yearly" : "pro"` to `handleCheckout`
- Change grid from `md:grid-cols-3` to `md:grid-cols-2` with `max-w-3xl`
- Add toggle switch centered above the cards (styled like the reference image)
- Default the toggle to "Yearly" to nudge users toward the better deal

### 4. Update `src/components/CTASection.tsx` (landing page pricing)

- Same changes as Upgrade.tsx: remove Lifetime, add toggle, 2-column layout
- Toggle styled for dark background (white/light text)
- Default to "Yearly" selected

### 5. Toggle Component Design

A centered row: **Monthly** — toggle switch — **Yearly** with a small "Save 33%" badge next to "Yearly". The active option is visually highlighted. Uses a simple div with onClick or the existing Switch component from shadcn.

### Files Modified
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/check-subscription/index.ts`
- `src/pages/Upgrade.tsx`
- `src/components/CTASection.tsx`

