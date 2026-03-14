

## "See It in Action" — Interactive Case Study Carousel

A new section between "Three steps. Zero effort." and "Real people. Real breakthroughs." that walks visitors through a real user journey using a carousel.

### Section Title
**"See It in Action"** with subtitle: *"Follow Rachel's journey from restless nights to real self-understanding."*

### Carousel Slides (4 slides)

**Slide 1 — Meet Rachel**
- Left side: AI-generated illustration of Rachel (warm, relatable — mid-30s woman, cozy sweater, coffee mug, morning light). We'll use a placeholder gradient avatar/silhouette initially.
- Right side: Short bio — *"Rachel is a busy mom and professional in her mid-30s. Her days run on schedules, school pickups, and emails. She looks put-together — but underneath, she's quietly overwhelmed. Her dreams kept echoing the same feeling: running late, losing control, never catching up. She started DreamWeave to finally understand why."*
- Soft card with glassmorphism styling

**Slide 2 — Her Dreams**
- Recreate a mini version of the dream list UI (screenshot-style but built as styled components)
- Show 3-4 dream titles with dates, mood tags, and Analyzed/Not analyzed badges
- Pulled from the uploaded screenshot data (Planting Seeds, The Missed Train, Floating Above the City, The Silent Argument)

**Slide 3 — One Dream, Analyzed**
- Show a condensed version of the "Planting Seeds" analysis: Summary, Key Symbols (2-3), Themes badges, Emotions Detected badges
- Styled to match the app's actual analysis layout

**Slide 4 — Patterns Revealed**
- Mini version of the Patterns page: Recurring Themes badges, a short Emotional Patterns excerpt, and 2-3 Actionable Suggestions
- Emphasize the "aha moment" — this is where DreamWeave's value clicks

### Design & Implementation

- **New component**: `src/components/CaseStudy.tsx`
- Uses existing `Carousel` component (embla-carousel) with dot indicators and prev/next arrows
- Background: `bg-card` (matches HowItWorks section pattern of alternating bg)
- Cards inside carousel: `bg-card rounded-3xl shadow-lg border border-border` (matches existing card patterns)
- Gradient accents using existing `gradient-indigo`, `gradient-purple` classes
- Each slide is a self-contained card with consistent padding and max-width
- Responsive: single column on mobile, comfortable reading width on desktop
- Auto-play disabled — user controls progression
- Dot indicators below carousel showing current slide (styled with primary color)

### Index.tsx Update
- Import and place `<CaseStudy />` between `<HowItWorks />` and `<Testimonials />`

### Content Tone
Warm, personal, conversational — consistent with brand voice. Rachel feels like someone the target audience would recognize in themselves.

