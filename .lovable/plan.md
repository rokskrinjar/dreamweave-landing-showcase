

## Add "Why It Matters" Research Section

### Placement
Between `<Features />` and `<HowItWorks />` (before "See It In Action").

### Implementation

**1. Create `src/components/WhyItMatters.tsx`**
- A new section with a centered elevated card on a light background
- Pill label "BACKED BY RESEARCH" with subtle purple accent
- Headline, paragraph, sub-heading, and 5 pill items with icons
- Icons: Brain (recall), Heart (emotional awareness), Lightbulb (creativity), Eye (self-reflection), Moon (lucid dreaming)
- Card: `bg-white rounded-3xl shadow-lg border border-border p-10-12`
- Pills: `bg-secondary rounded-full px-4 py-2` with purple icon accents
- Section bg: `bg-secondary` to match Features section flow

**2. Update `src/pages/Index.tsx`**
- Import and add `<WhyItMatters />` between `<Features />` and `<HowItWorks />`

### Files
- **New**: `src/components/WhyItMatters.tsx`
- **Edit**: `src/pages/Index.tsx` (add import + component)

