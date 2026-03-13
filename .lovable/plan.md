

## Update Google Ads Conversion ID

New ID: **AW-18013166255** (was AW-978271506)

Two files need updating:

1. **`index.html`** — Update the gtag.js script `id` parameter and `gtag('config', ...)` call
2. **`src/lib/googleAds.ts`** — Update the `CONVERSION_ID` constant

That's it — everything else (route tracker, conversion helpers, debug mode) stays the same.

