
Goal: fix Meta Pixel not recording events on the live site, without double-firing.

What I found in the code:
- `index.html` already has the official bootstrap + `fbq('init', '548824982209239')` + `fbq('track', 'PageView')`.
- `CompleteRegistration` is in `src/pages/Auth.tsx`.
- `Subscribe` is in `src/pages/PaymentSuccess.tsx`.
- This is a React SPA (`BrowserRouter`), so only initial page load is guaranteed to fire `PageView` right now.

Answer to your question:
- We should NOT add this extra snippet:
  `window.addEventListener('load', () => fbq('track','PageView'))`
- Reason: the current snippet already tracks `PageView`; adding this can create duplicate events and still won’t fix root causes like blocked script/consent/CSP.

Implementation plan:
1) Centralize event tracking with a safe helper
- Add a small utility (e.g. `src/lib/metaPixel.ts`) with:
  - `trackMetaEvent(eventName, params?)`
  - readiness check (`typeof window.fbq === 'function'`)
  - optional debug logging when `?meta_debug=1` is present

2) Add SPA route-change PageView tracking
- Add a tracker component (e.g. `src/components/MetaPixelRouteTracker.tsx`) using `useLocation`.
- Fire `PageView` on route changes (not just first HTML load).
- Mount it once under `BrowserRouter` in `src/App.tsx`.

3) Reuse helper for conversion events
- Replace direct `window.fbq?.(...)` calls in:
  - `src/pages/Auth.tsx` (`CompleteRegistration`)
  - `src/pages/PaymentSuccess.tsx` (`Subscribe`)
- This ensures consistent behavior and debug output.

4) Add noscript fallback in `index.html`
- Add standard `<noscript><img ... /></noscript>` pixel fallback for non-JS scenarios.
- Not a replacement for JS tracking, but good hygiene.

5) Verification checklist (post-implementation)
- Test on the live custom domain with `?meta_debug=1`.
- Confirm requests to Meta endpoint include:
  - `ev=PageView` on homepage and internal route transitions
  - `ev=CompleteRegistration` after signup
  - `ev=Subscribe` on payment success page
- Validate in both Pixel Helper and Meta Test Events with a clean browser profile.

Expected outcome:
- No duplicate PageView from load listeners.
- Reliable PageView tracking for SPA navigation.
- Clear signal on whether failures are code-level vs environment-level (blocked script/privacy settings/consent).
