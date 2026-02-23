

## GitHub-style Emotion Calendar Heatmap

Replace the current misleading line chart with a GitHub contributions-style calendar heatmap using 3 sentiment colors.

### What changes

**File: `src/pages/Patterns.tsx`**

1. **Remove** the Recharts imports (`LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`) and all the old mood scale helpers (`defaultMoodValues`, `buildMoodScale`, `getPrimaryMood`, `moodScale`, `maxMoodValue`, `moodChartData`).

2. **Add sentiment classifier** -- a function that maps any emotion string to one of three categories:
   - Positive (green `#10b981`): happy, excited, peaceful, euphoric, hopeful, joyful, content, relieved, grateful, loved, inspired, confident, optimistic, amused
   - Negative (rose `#f43f5e`): fearful, anxious, sad, angry, frustrated, lonely, guilty, ashamed, jealous, disgusted, desperate, hopeless, terrified, overwhelmed
   - Neutral (amber `#f59e0b`): confused, nostalgic, surprised, curious, melancholic, bittersweet, and any unrecognized emotion

3. **Add calendar data builder** -- generates a grid covering the last 14 weeks (98 days). For each day:
   - Collect all dreams recorded that day
   - Parse all emotions from comma-separated mood strings
   - Determine dominant sentiment (whichever category has more emotions that day)
   - Store the list of all emotions for the tooltip

4. **Render a custom calendar grid** using simple HTML/CSS (no library needed):
   - 7 rows (Mon-Sun) x 14 columns (weeks)
   - Each cell is a ~16x16px rounded rectangle with 2px gap
   - Cell color: green/amber/rose based on dominant sentiment, or light gray for empty days
   - Day-of-week labels on the left (Mon, Wed, Fri)
   - Month labels along the top where months change
   - Hover tooltip showing: date, all emotions listed, dream count

5. **Add a color legend** below the chart showing: Empty / Positive / Neutral / Negative

6. **Keep the fallback** for fewer than 3 dreams with moods.

### How to undo

If you don't like the result, click the **Restore** button on the AI message right before this change to revert instantly.

