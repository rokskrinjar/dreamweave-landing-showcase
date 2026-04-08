

## Update Locked Patterns Page

### File: `src/pages/Patterns.tsx`

**1. Add CTA inside chart card (lines 447-448)**

Replace the single muted line with:
- Muted text: "Your subconscious has patterns. Are you ready to see them?"
- Centered "Unlock My Patterns" button in `gradient-navy text-white` style → navigates to `/upgrade`
- Keep the "Your emotional data will appear here after upgrading." line below the button

**2. Replace three cards + upgrade prompt with clean text section (lines 451-486)**

Remove the upgrade prompt link, Recurring Themes card, Emotional Patterns card, and Actionable Suggestions card entirely. Replace with:

- `Sparkles` icon (small, purple) + bold headline: "What you'll discover:"
- Three bullet points in muted text with generous spacing:
  - "Recurring emotional themes across all your dreams"
  - "Your personal mood timeline and how it shifts over time"
  - "Deep psychological insights and actionable suggestions tailored to you"
- No card wrapper, no borders — just clean open typography

### Files changed
- `src/pages/Patterns.tsx` — update locked state layout

