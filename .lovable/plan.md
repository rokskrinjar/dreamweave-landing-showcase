

## Fix Emotion Calendar: Stretch to Fill + Fix Neutral Display

### Problems Found

1. **Chart doesn't fill the card width** -- cells are fixed at 16px regardless of available space
2. **Missing neutral dreams** -- Two causes:
   - The emotion classifier doesn't recognize some mood strings from your dreams: "curiosity" (only "curious" is listed), "calm", "safe", "urgency" -- these all default to neutral but "calm" and "safe" should arguably be positive
   - Tie-breaking bug: when a day has equal counts of two sentiments (e.g. "confused, fearful" = 1 neutral + 1 negative), negative always wins because of how the code compares. Neutral never gets a fair shot at ties.
3. **Empty day color is fine** -- no changes there per your feedback

### Changes (all in `src/pages/Patterns.tsx`)

1. **Make the grid stretch to fill the card width**
   - Use a container ref to measure available width
   - Dynamically calculate cell size: `(availableWidth - dayLabelWidth) / 14 weeks - gap`
   - Set a min of 14px and max of 24px for the cells
   - This makes the calendar fill the entire card on both desktop and mobile

2. **Expand the emotion word lists** to catch more variations from your actual dream data:
   - Add to Positive: "calm", "safe", "brave", "proud", "serene", "relaxed"
   - Add to Neutral: "curiosity", "urgency", "wonder", "contemplative"
   - This ensures your dreams with "calm", "safe", "curiosity" get properly colored

3. **Fix tie-breaking logic** so that when sentiments are tied, neutral gets a fair chance instead of always losing. The new logic will pick the sentiment with strictly the highest count, and default to neutral on a perfect tie.

### What stays the same

- Empty day squares stay as they are (gray)
- Three sentiment colors unchanged (green/amber/rose)
- Hover tooltips unchanged
- Legend unchanged
- Fallback for fewer than 3 dreams unchanged

### How to undo

Click the **Restore** button on the previous AI message to revert.

