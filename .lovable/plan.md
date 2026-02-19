

## Update Price IDs for Testing

Two changes needed to wire up your new Stripe test prices.

### 1. Update the edge function (`supabase/functions/create-checkout/index.ts`)

Replace the hardcoded price IDs in the `PRICE_CONFIG`:

| Plan | Old Price ID | New Price ID | Amount |
|---|---|---|---|
| Pro | `price_1T1Xa7FI9Hj3v9v4Cz3XZhdT` | `price_1T2druFI9Hj3v9v4adwntsGW` | 0.50 EUR/month |
| Lifetime | `price_1T1XaNFI9Hj3v9v4OxpLvWkN` | `price_1T2dtMFI9Hj3v9v4Uftomk1v` | 1.00 EUR one-time |

### 2. Update the UI prices (`src/components/CTASection.tsx`)

Change the displayed prices to match:
- Pro: "$9.99" becomes "€0.50"
- Lifetime: "$99" becomes "€1.00"

### Important Note

When you're ready to go live with real prices, you'll need to swap these IDs back to your production prices and update the UI again.

