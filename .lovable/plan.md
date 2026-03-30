

## Landing Page Content Update

### Changes overview

Three modifications to the landing page. Everything from "How It Works" onward stays untouched except for a new section inserted right after it.

---

### CHANGE 1 — Hero text updates

**File: `src/components/Hero.tsx`**

Three text-only swaps, no layout changes:

- **Badge text** (line 22): → `"The average person has 4-6 dreams every single night"`
- **Subtitle paragraph** (line 33-35): → the long editorial paragraph about 100,000 dreams in a lifetime
- **Disclaimer text** (line 52-54): → `"Start journaling tonight. Your first insight is free."`

---

### CHANGE 2 — Replace Features section with editorial section

**File: `src/components/Features.tsx`** — complete rewrite

Remove all icons, cards, and grid layout. Replace with a clean editorial section:

- Light warm background (`bg-[#FAF9F7]` or similar off-white)
- Centered headline: "Most people live their whole lives without ever listening to themselves."
- Muted subheadline: "Dream journaling changes that."
- Three vertically stacked text blocks, each with a bold statement + two-sentence body
- Max-width container, generous vertical spacing, no cards or icons

---

### CHANGE 3 — New Lucid Dreaming section after HowItWorks

**New file: `src/components/LucidDreamingSection.tsx`**

Deep dark navy/purple background section with:

- Small pill badge: "BONUS BENEFIT"
- Large white headline: "Journal your dreams. Start having lucid ones."
- Body paragraph about lucid dreaming and dream journaling
- Three horizontal callout statements (responsive: stack on mobile)
- White CTA button with dark text: "Start Your Dream Journal Tonight" → links to `/auth`

**File: `src/pages/Index.tsx`** — insert `<LucidDreamingSection />` between `<HowItWorks />` and `<CaseStudy />`

---

### Files changed
- `src/components/Hero.tsx` — 3 text swaps
- `src/components/Features.tsx` — full rewrite (editorial prose section)
- `src/components/LucidDreamingSection.tsx` — new component
- `src/pages/Index.tsx` — add import + render new section after HowItWorks

