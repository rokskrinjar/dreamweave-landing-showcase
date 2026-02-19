
## Add Custom Emotions Input to Dream Form

Currently the "How did you feel?" section only offers 6 preset moods (peaceful, anxious, euphoric, confused, nostalgic, fearful) as toggle buttons. We'll add a text input below them for users to enter additional custom emotions.

### Changes

**File: `src/pages/NewDream.tsx`**

1. Add a new state variable `customMoods` (string) for the free-text input
2. Below the existing mood pill buttons, add an `Input` field with placeholder like `"excited, melancholy, hopeful (comma-separated)"`
3. Update `handleSubmit` to merge the selected preset mood and any custom moods into the `mood` field stored in the database -- we'll combine them into a comma-separated string (e.g. `"anxious, excited, melancholy"`)

### Technical Details

- The preset buttons will continue to work as toggles (click to select/deselect)
- Allow selecting multiple preset moods (change from single-select to multi-select since we're opening up to multiple emotions anyway)
- The final `mood` value saved will be a comma-separated string combining selected presets + custom entries
- No database changes needed -- the `mood` column is already a text field that can hold comma-separated values
