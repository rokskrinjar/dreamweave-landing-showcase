

## Add AI-Powered Sentiment to Dream Analysis

### Approach
Instead of classifying emotions on the frontend with brittle word lists, we'll have the AI classify the overall dream sentiment during the existing analysis step -- no extra AI calls needed. We store the result as a new `sentiment` column on the `dreams` table. The Patterns page then reads this attribute directly.

### Changes

#### 1. Database Migration
Add a `sentiment` column to the `dreams` table:
```sql
ALTER TABLE public.dreams
ADD COLUMN sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative'));
```
Nullable so existing dreams aren't broken.

#### 2. Edge Function: `analyze-dream/index.ts`
Add `sentiment` to the AI tool-calling schema:
- New property in the `analyze_dream` function parameters:
  ```
  sentiment: {
    type: "string",
    enum: ["positive", "neutral", "negative"],
    description: "Overall sentiment of the dream: positive, neutral, or negative"
  }
  ```
- Add `sentiment` to the `required` array.
- After parsing the AI response, update the dream record:
  ```typescript
  await serviceClient.from("dreams").update({ sentiment: analysis.sentiment }).eq("id", dreamId);
  ```
- Include `sentiment` in the response payload.

#### 3. One-Off Backfill: New Edge Function `backfill-sentiments/index.ts`
A small edge function to classify old dreams that don't have a sentiment yet:
- Fetches all dreams where `sentiment IS NULL` (for the authenticated user).
- Sends their moods/titles in a single AI call asking to classify each as positive/neutral/negative.
- Updates each dream's `sentiment` column.
- Called once from the Patterns page if any dreams lack a sentiment value.

#### 4. Frontend: `src/pages/Patterns.tsx`
- Remove all hardcoded emotion sets (`POSITIVE_EMOTIONS`, `NEGATIVE_EMOTIONS`, `NEUTRAL_EMOTIONS`) and `classifySentiment`.
- Fetch dreams including the new `sentiment` column.
- On mount, check if any dreams have `sentiment = null`. If so, call the `backfill-sentiments` function, then refresh.
- **Emotion Breakdown chart**: Group emotions by `dream.sentiment` instead of classifying each emotion individually. Each dream's mood strings go into the bar matching its sentiment.
- **Mood over Time chart**: Map `dream.sentiment` directly to score (positive=1, neutral=0, negative=-1) instead of averaging per-emotion scores.

### Technical Summary

| File | Change |
|------|--------|
| Database migration | Add `sentiment` column to `dreams` |
| `supabase/functions/analyze-dream/index.ts` | Add `sentiment` to AI tool schema + save to dreams table |
| `supabase/functions/backfill-sentiments/index.ts` | New function: batch-classify old dreams via one AI call |
| `src/pages/Patterns.tsx` | Remove hardcoded lists, read `sentiment` from dream data, trigger backfill if needed |

