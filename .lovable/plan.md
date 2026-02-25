

## Fix: Patterns Page Should Only Use Analyzed Dreams

### Problem
Three related issues:

1. **Emotion Breakdown and Mood over Time charts** display data from ALL 15 recorded dreams, even though only 2 have been analyzed. This happens because the `backfill-sentiments` function assigns sentiment to every dream (even unanalyzed ones) based on just the title/mood, and the charts use this data.

2. **Pattern Insights ("Refresh Insights")** generated insights based on 15 raw dream texts, not the 2 actual AI analyses. The function should require a minimum number of analyses and use analysis data as the primary source.

3. **The button label says "Analyzes your last 30 dreams"** -- it should say "analyses" since that's the real data source.

### Solution

#### 1. Patterns Page (`src/pages/Patterns.tsx`)
- Change `fetchDreams` to only fetch dreams that have a matching entry in the `analyses` table. Do this by first fetching the user's analysis `dream_id`s, then filtering dreams to only those IDs.
- Update the subtitle to show "X dreams analyzed" instead of "X dreams recorded".
- Update the button hint text to "Based on your last 30 analyses".
- Remove the automatic `backfill-sentiments` call -- sentiment should only come from the real analysis process, not a separate backfill on unanalyzed dreams.

#### 2. Dream Patterns Edge Function (`supabase/functions/dream-patterns/index.ts`)
- Change the minimum check from `dreams.length < 5` to `analyses.length < 5` -- require at least 5 analyzed dreams.
- Make analyses the PRIMARY data sent to the AI, with raw dream content as supplementary context.
- Update `dreams_analyzed` in the response/persistence to reflect the number of analyses used, not raw dreams.
- Update the error message: "You need at least 5 analyzed dreams to generate pattern insights."

#### 3. Backfill Sentiments (`supabase/functions/backfill-sentiments/index.ts`)
- Add a filter so it only backfills sentiment for dreams that HAVE a corresponding entry in the `analyses` table. This prevents unanalyzed dreams from getting sentiment values they shouldn't have.

### Technical Details

**Patterns.tsx - fetching only analyzed dreams:**
```typescript
// Fetch dream IDs that have analyses
const { data: analysisRows } = await supabase
  .from("analyses")
  .select("dream_id");
const analyzedIds = (analysisRows || []).map(a => a.dream_id);

// Fetch only those dreams
const { data } = await supabase
  .from("dreams")
  .select("id, title, mood, recorded_at, tags, sentiment")
  .in("id", analyzedIds)
  .order("recorded_at", { ascending: true })
  .limit(30);
```

**dream-patterns/index.ts - require 5 analyses:**
```typescript
if (!analyses || analyses.length < 5) {
  return new Response(
    JSON.stringify({ error: "You need at least 5 analyzed dreams to generate pattern insights." }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

**backfill-sentiments/index.ts - only backfill analyzed dreams:**
```typescript
// Get dream IDs that have analyses
const { data: analysisRows } = await serviceClient
  .from("analyses")
  .select("dream_id")
  .eq("user_id", user.id);
const analyzedIds = (analysisRows || []).map(a => a.dream_id);

// Only fetch dreams that are analyzed AND missing sentiment
const { data: dreams } = await serviceClient
  .from("dreams")
  .select("id, title, mood")
  .eq("user_id", user.id)
  .is("sentiment", null)
  .in("id", analyzedIds);
```

### Files to Change
- `src/pages/Patterns.tsx` -- filter to analyzed dreams, update labels, remove auto-backfill
- `supabase/functions/dream-patterns/index.ts` -- require 5 analyses minimum, make analyses primary
- `supabase/functions/backfill-sentiments/index.ts` -- only backfill analyzed dreams

