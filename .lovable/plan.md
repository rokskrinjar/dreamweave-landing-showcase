

## Three Quick Fixes to Locked Patterns Page

### File: `src/pages/Patterns.tsx`

**1. Remove the "Upgrade to Dreamer" button from header (lines 407-413)**
Delete the entire `<Button>` block in the top-right corner, keep just the title/subtitle.

**2. Replace `Sparkles` with `Lock` icon in CTA section (line 460)**
Change `<Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />` → `<Lock className="w-6 h-6 text-primary mx-auto mb-3" />`
Add `Lock` back to lucide imports.

**3. Change Emotion Breakdown chart to 3 categories (lines 377-384)**
Replace the 5-item `placeholderBars` with:
```ts
const placeholderBars = [
  { category: "Positive", value: 6 },
  { category: "Neutral", value: 4 },
  { category: "Negative", value: 2 },
];
const placeholderBarColors = ["#e2e8f0", "#d8dee8", "#cacfd9"];
```

### Files changed
- `src/pages/Patterns.tsx`

