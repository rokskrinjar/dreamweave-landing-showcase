

## Redesign Features Section as Journal Page

### File: `src/components/Features.tsx` — full restyle

**Background:**
- Section bg → warm cream `bg-[#f5f0e8]` with a CSS repeating linear gradient for faint horizontal ruled lines (light tan, ~1px every 2rem, very low opacity)

**Left column — headline:**
- Add a small Moon icon (from lucide-react) above the headline as a decorative journal header element, muted color
- Add `font-serif` to the headline for an editorial feel (Tailwind's built-in serif stack)
- Keep subheadline as-is with muted color

**Right column — journal margin notes:**
- Replace icon-based layout with a left purple border accent on each point (`border-l-2 border-primary pl-5`)
- Remove the icon circles; keep bold + body text unchanged
- Increase gap between points from `gap-8` to `gap-10` for breathing room

**Ruled lines implementation:**
- Use inline `style` on the section with `backgroundImage: repeating-linear-gradient(...)` for subtle horizontal lines in a faint tan/brown at ~10% opacity

### Files changed
- `src/components/Features.tsx` — restyle as journal page

