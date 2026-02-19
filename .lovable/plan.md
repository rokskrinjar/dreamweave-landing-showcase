

## Fix: Checkout Buttons Not Opening Stripe

### The Problem

Clicking "Unlock All Dreams" (or any checkout button) does nothing visible. The backend call succeeds and returns a valid Stripe checkout URL, but the browser's **popup blocker** silently prevents `window.open(url, "_blank")` from working because the `await` on the network call breaks the direct user-gesture chain.

### The Fix

Replace `window.open(url, "_blank")` with `window.location.href = url` in all checkout flows. This redirects in the same tab instead of opening a new one, which browsers always allow regardless of async timing.

### Files to Change

**1. `src/pages/DreamDetail.tsx` (line 47)**
- Change: `window.open(data.url, "_blank")` to `window.location.href = data.url`

**2. `src/pages/Dashboard.tsx` (line 38)**
- Change: `window.open(data.url, "_blank")` to `window.location.href = data.url`

**3. `src/pages/Dashboard.tsx` (line 125)**
- Change: `window.open(data.url, "_blank")` for customer portal to `window.location.href = data.url`

**4. `src/components/CTASection.tsx` (line 92)**
- Change: `window.open(data.url, "_blank")` to `window.location.href = data.url`

### Result

All checkout and billing portal buttons will reliably redirect to Stripe in the same tab. After payment, Stripe redirects back to the app's success page as configured.

