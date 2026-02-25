

## Fix: Emotion Breakdown showing unclassified dreams

### Problem
The `buildStackedData` function on line 53 does `d.sentiment || "neutral"`, which means dreams that have been analyzed but don't yet have a sentiment classification (sentiment is null) still get their mood emotions counted under the "Neutral" category. This inflates the chart with emotions that haven't been properly classified by the AI.

### Fix

**File: `src/pages/Patterns.tsx`**

In `buildStackedData` (line 51-52), add a check to skip dreams without a classified sentiment:

```typescript
dreams.forEach((d) => {
  if (!d.mood || !d.sentiment) return;  // skip unclassified dreams
  const sentiment: Sentiment = d.sentiment;
  // ...rest unchanged
});
```

This is a 1-line change (line 52-53). Only dreams with an AI-assigned sentiment (positive, neutral, or negative) will contribute to the Emotion Breakdown chart, ensuring the visualization accurately reflects classified data only.

### Impact
- Charts will only show emotions from dreams that have been fully processed (sentiment assigned)
- The Mood over Time chart already filters by `d.sentiment` (line 167), so it's not affected
- No backend changes needed

