

## Google Ads (gtag.js) Integration

Google Ads Conversion ID: **AW-978271506**

### Changes

1. **`index.html`** — Add the gtag.js snippet in `<head>` (after the Meta Pixel block, before `</head>`):
   - Async script loading `googletagmanager.com/gtag/js?id=AW-978271506`
   - `dataLayer` init + `gtag('config', 'AW-978271506')`

2. **`src/lib/googleAds.ts`** — Create a centralized helper (mirrors `metaPixel.ts`):
   - `trackGoogleConversion(conversionId, params?)` — calls `gtag('event', 'conversion', ...)`
   - `trackGoogleEvent(eventName, params?)` — general event tracking
   - Same debug mode pattern (`?google_debug=1`)

3. **`src/components/GoogleAdsRouteTracker.tsx`** — SPA page_view tracking on route changes (mirrors `MetaPixelRouteTracker`):
   - Fires `gtag('event', 'page_view')` on route changes, skips first render

4. **`src/App.tsx`** — Mount `GoogleAdsRouteTracker` alongside `MetaPixelRouteTracker`

5. **`src/pages/Auth.tsx`** — Fire a conversion event on successful signup (alongside existing Meta `CompleteRegistration`)

6. **`src/pages/PaymentSuccess.tsx`** — Fire a conversion event on purchase (alongside existing Meta `Subscribe`)

> **Note:** Once you set up specific conversion actions in Google Ads (e.g., sign-up, purchase), you'll get conversion labels (format: `AW-978271506/XXXXXXX`). Share those and I'll wire them into the corresponding events for precise conversion attribution.

