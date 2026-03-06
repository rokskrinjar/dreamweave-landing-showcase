

## Update Plan Prices

Two files need changes:

### 1. `supabase/functions/create-checkout/index.ts`
- Update `pro` priceId to `price_1T7v4iF0C59Hu24k0Kt0t06N`
- Update `lifetime` priceId to `price_1T7v6qF0C59Hu24kQ01YOlxr`

### 2. `src/components/CTASection.tsx`
- Change Pro price from `"€0.50"` to `"€4.99"`
- Change Lifetime price from `"€1.00"` to `"€49.99"`

No database or edge function logic changes needed — just two string updates in each file.

