

## Add "All future features included" bullet to Yearly Dreamer plan

### Changes

In both `src/pages/Upgrade.tsx` and `src/components/CTASection.tsx`:

- After the `dreamerFeatures.map(...)` loop inside the Dreamer card's `<ul>`, add a conditional extra `<li>` that only renders when `isYearly` is true
- Content: checkmark icon + "All future features included" — same styling as other feature items

### Files
- `src/pages/Upgrade.tsx`
- `src/components/CTASection.tsx`

