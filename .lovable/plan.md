

## Clean Up "Why It Matters" Section

Refine the visual presentation of the WhyItMatters component while keeping all content identical. Changes inspired by the reference image's cleaner, more spacious feel.

### Changes in `src/components/WhyItMatters.tsx`:

1. **More generous spacing** — increase vertical padding inside the card (`p-12 md:p-16`), add more breathing room between elements
2. **Softer card styling** — use a subtler shadow (`shadow-md` instead of `shadow-lg`), lighter border (`border-border/60`)
3. **Badge refinement** — slightly larger badge with border styling for a crisper pill look (`border border-primary/20`)
4. **Better typography hierarchy** — bump paragraph line-height and letter-spacing for the body text, make the "This practice can help with:" label slightly larger with more margin above
5. **Benefit pills** — add a subtle border (`border border-border`), slightly more padding, and a hover transition for polish. Use `bg-background` instead of `bg-secondary` so they stand out from the card background more cleanly
6. **Centered benefit layout** — keep flex-wrap centered but add slightly more gap between pills (`gap-3.5`)

All text, icons, and content remain exactly the same. Only spacing, shadows, borders, and subtle styling adjustments.

### File
- `src/components/WhyItMatters.tsx`

