

## Locked Patterns Page — Gray Charts + Floating Overlay Card

### File: `src/pages/Patterns.tsx`

**1. Gray chart colors (lines 382, 429-433, 443)**
- Change `placeholderBarColors` to all `"#d1d5db"` (light gray)
- The line chart stroke is already using muted-foreground — change it to a flat `#d1d5db` with higher opacity for consistency

**2. Remove in-card CTA, add floating overlay (lines 412-453)**
- Remove lines 448-452 (the text + button + subtitle inside the card below tabs)
- Wrap the chart card in a `relative` container
- Add an absolutely-positioned small overlay card centered on the chart area:
  - `absolute inset-0 flex items-center justify-center` with `pointer-events-none` on the backdrop, `pointer-events-auto` on the card
  - Small card: `bg-white dark:bg-card rounded-xl shadow-lg px-6 py-5 max-w-xs text-center`
  - Purple `Lock` icon (small, ~w-5 h-5)
  - Text: "Your subconscious has patterns. Are you ready to see them?"
  - Compact `gradient-navy` button: "Unlock My Patterns" → `/upgrade`
- Add `Lock` to lucide imports

Everything else (header, "What you'll discover" section) stays unchanged.

### Files changed
- `src/pages/Patterns.tsx`

