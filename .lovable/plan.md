

## Swap Icons on Pricing Cards

### Changes (both `src/components/CTASection.tsx` and `src/pages/Upgrade.tsx`):

1. **Free plan** — remove icon: set `icon: null` (or remove the icon property) so no icon square renders
2. **Dreamer plan** — change `icon: Zap` to `icon: Sparkles` (the sparkles/stars icon from the reference image)

### Details
- Free plan currently has `icon: Star` — remove it
- Dreamer plan currently has `icon: Zap` (thunder) — replace with `Sparkles`
- Need to update the icon rendering JSX to handle `null` icon (skip rendering the icon container when no icon)
- `Sparkles` is already imported in both files; can remove `Zap` and `Star` from imports if unused elsewhere

### Files
- `src/components/CTASection.tsx`
- `src/pages/Upgrade.tsx`

