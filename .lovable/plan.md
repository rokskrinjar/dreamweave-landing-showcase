
The user wants to clean up the LucidDreamingSection on the landing page. Looking at the component, there are two arrays with overlapping content:
- `bullets` (4 items shown with sparkle icons)
- `callouts` (3 items shown below the divider lines)

Both convey similar messaging about dream journaling effectiveness, recall improvement, and pattern awareness. The user wants only one set kept.

Since the bullets are more detailed and visually richer (with sparkle icons, 4 points), I'll keep those and remove the 3 callouts section below.

## Clean Up Lucid Dreaming Section — Remove Duplicated Content

### File: `src/components/LucidDreamingSection.tsx`

**Remove the duplicate `callouts` block:**
- Delete the `callouts` array declaration at the top
- Delete the entire `<div className="grid md:grid-cols-3 gap-8 mb-16">` block that renders the 3 callout boxes with the top border lines

**Keep:**
- The `bullets` array and its rendering (the 4 sparkle bullet points)
- All other elements: header chip, title, subtitle, CTA button, twinkling stars

### Files changed
- `src/components/LucidDreamingSection.tsx` — remove `callouts` array and the 3-column grid block
