

## Update Live Stripe Price IDs

### What changes
Only one file needs updating — the backend checkout function:

**File: `supabase/functions/create-checkout/index.ts`**
- Replace test Price ID `price_1T2druFI9Hj3v9v4adwntsGW` with live `price_1T45nvF0C59Hu24kVOo4kDyX` (Pro)
- Replace test Price ID `price_1T2dtMFI9Hj3v9v4Uftomk1v` with live `price_1T45p3F0C59Hu24kQawUN8gv` (Lifetime)

No UI changes needed since the prices (EUR 0.50/month and EUR 1.00 one-time) remain the same.

### Technical detail
The `PRICE_CONFIG` object in the edge function will be updated with the two new live Price IDs. The function will be automatically redeployed.

### After this change
Your checkout flow will create real charges. Make sure your Stripe account is fully activated before testing with a real card.

