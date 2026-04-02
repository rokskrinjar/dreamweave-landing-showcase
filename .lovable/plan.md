

## Two Section Updates

### CHANGE 1 — Features: Add "1/3" watermark (`src/components/Features.tsx`)

Add a `relative` wrapper to the left column. Inside it, place an absolutely-positioned `<span>` with text `"1/3"` in a very large font (~8rem / `text-[8rem]`), light purple color (`text-primary/10`), positioned behind the headline using `z-0` while the headline gets `relative z-10`. This creates a background watermark effect.

### CHANGE 2 — WhyItMatters: Remove card wrapper (`src/components/WhyItMatters.tsx`)

Remove the `<div className="bg-card rounded-3xl shadow-md border ...">` wrapper. Increase max-width to `max-w-5xl` so content spreads fuller. Keep all inner content (badge, headline, paragraph, pills) unchanged.

### Files changed
- `src/components/Features.tsx` — add decorative "1/3" watermark behind headline
- `src/components/WhyItMatters.tsx` — remove card wrapper, widen container

