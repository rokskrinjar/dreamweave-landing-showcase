

## Add Meta Pixel Conversion Events

Two events, two files:

### 1. `src/pages/Auth.tsx` — `CompleteRegistration`
Fire `fbq('track', 'CompleteRegistration')` after a successful `signUp` call (line 43, right after the success toast).

### 2. `src/pages/PaymentSuccess.tsx` — `Subscribe`
Fire `fbq('track', 'Subscribe')` inside the existing `useEffect` on mount, since this page only loads after a successful payment.

Both calls use `window.fbq` with a TypeScript guard to avoid errors if the pixel hasn't loaded.

