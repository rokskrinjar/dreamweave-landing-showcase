

## Fix: Mood over Time line invisible when all points share the same sentiment

### Problem
The trend line uses a vertical linear gradient (`y1=0, y2=1`) for its stroke color. When all data points have the same score (e.g., all Negative at -1), the line is perfectly horizontal with zero height. This causes the SVG gradient to degenerate -- it has no vertical extent to interpolate across, so the stroke renders as invisible.

### Solution
Replace the gradient stroke with a solid stroke color, and determine the color dynamically based on the data. Since the gradient was purely decorative (it doesn't accurately map to the Y-axis position anyway), a single representative color based on the average score is cleaner.

**File: `src/pages/Patterns.tsx`**

1. Compute the average score of all data points in `MoodOverTimeChart`
2. Pick a stroke color: green if avg > 0.25, red if avg < -0.25, amber otherwise
3. Use that solid color for the `<Line stroke={...}>` instead of `url(#moodGradient)`
4. Remove the now-unused `<defs>` gradient block

This ensures the connecting line is always visible regardless of data distribution, and the color still meaningfully represents the overall emotional trend.

### Technical Detail

In the `MoodOverTimeChart` component (~line 197-243):

```typescript
const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
const lineColor = avgScore > 0.25 ? "#10b981" : avgScore < -0.25 ? "#f43f5e" : "#f59e0b";
```

Then on the `<Line>` element:
```
stroke={lineColor}
```

Remove the `<defs>` gradient block (lines 210-216) as it's no longer needed.

