

## Fix Stripe Checkout and Update induro.io Profile

### Problem
The `create-checkout` function uses `customer_email` for new customers instead of explicitly creating a Stripe customer first. In `mode: "payment"`, this can result in no persistent customer record being created, making it impossible for `check-subscription` to later find the purchase.

### Changes

**1. Manually update rok@induro.io profile to lifetime tier (immediate data fix)**
- Run an UPDATE query on the `profiles` table to set `subscription_tier = 'lifetime'` for user_id `df4711f7-7cb6-46cb-984e-d3e9f2c91802`

**2. Fix `supabase/functions/create-checkout/index.ts`**
- When no existing Stripe customer is found, explicitly create one via `stripe.customers.create({ email: user.email })` before passing it to the checkout session
- Always use the `customer` parameter (never `customer_email`), ensuring a persistent Stripe customer record exists for every checkout

### Technical Details

The key change in `create-checkout/index.ts`:

```typescript
// BEFORE (broken for new customers)
const customers = await stripe.customers.list({ email: user.email, limit: 1 });
let customerId: string | undefined;
if (customers.data.length > 0) {
  customerId = customers.data[0].id;
}
// ...
session = await stripe.checkout.sessions.create({
  customer: customerId,
  customer_email: customerId ? undefined : user.email,  // <-- no persistent customer created
  ...
});

// AFTER (always creates a customer)
const customers = await stripe.customers.list({ email: user.email, limit: 1 });
let customerId: string;
if (customers.data.length > 0) {
  customerId = customers.data[0].id;
} else {
  const newCustomer = await stripe.customers.create({ email: user.email });
  customerId = newCustomer.id;
}
// ...
session = await stripe.checkout.sessions.create({
  customer: customerId,  // always set, no customer_email fallback
  ...
});
```

This ensures every future checkout (both subscription and lifetime) creates a traceable Stripe customer, so `check-subscription` can always find the purchase.

