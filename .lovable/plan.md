

## Premium Locked Patterns Page Redesign

### File: `src/pages/Patterns.tsx`

Replace the entire `isLocked` block (lines 393-474) with a polished layout that mirrors the real unlocked page structure but with a premium locked feel.

**Layout structure (top to bottom):**

1. **Header** — Keep "Dream Patterns" title + subtitle. Keep "Upgrade to Dreamer" button as-is.

2. **Chart card with gradient overlay** — Same tabbed chart card but instead of a floating white popup, apply a soft gradient fade-to-white from center outward over the chart area. Use slightly more realistic-looking placeholder data (5 emotion categories with soft muted colors like `#e2e8f0` varying slightly in shade so they look like real bars, not identical blocks). The overlay is a gradient div that fades from transparent at top to white at bottom, covering the lower 60% of the chart — making the chart feel like it's "fading away" into locked content.

3. **Centered CTA section (no card, no popup)** — Directly below the chart card, a centered section with:
   - A small `Sparkles` icon in purple
   - Headline: **"Your patterns are waiting"** (text-xl font-semibold)
   - Subtitle: "Record dreams and upgrade to Dreamer to reveal your emotional landscape" (muted, text-sm)
   - A full-width (max-w-sm) dark navy CTA button: "Unlock My Patterns"

4. **Preview cards row** — Three small preview cards side by side (grid cols-3 on desktop, stacked on mobile) showing what's included. Each card has:
   - A small icon at top (muted color): `Hash` for Themes, `TrendingUp` for Timeline, `Sparkles` for Insights
   - A short bold title: "Recurring Themes" / "Mood Timeline" / "Personal Insights"
   - One line of muted text describing it
   - Each card has `opacity-60` and a subtle dashed border to feel "coming soon"

**Key differences from current:**
- Remove the floating white popup card with Lock icon — feels clunky
- Remove the "What you'll discover" bullet list — replaced by the preview cards which are more visual
- Chart uses a gradient fade instead of a popup overlay — more elegant
- CTA is prominent but clean, not floating on top of content
- Preview cards give a visual taste of the full unlocked experience

**Cleanup:**
- Remove `Lock` from imports (no longer used)
- Keep `Sparkles`, add `Hash` from lucide-react

### Files changed
- `src/pages/Patterns.tsx` — complete redesign of the locked state block

