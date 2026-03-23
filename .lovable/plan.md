

## Update Case Study Screenshots and Reorder Sections

### 1. Replace Case Study Images

Copy the 5 uploaded screenshots to `public/images/`, replacing the current case study photos:

| Uploaded file | Destination | Used in slide |
|---|---|---|
| `Screenshot_2026-03-23_160530.png` | `public/images/rachels-dreams.png` | Slide 2 — Her Dreams |
| `Screenshot_2026-03-23_160720.png` | `public/images/analyzed-dream-1.png` | Slide 3 — Dream Analysis (left) |
| `Screenshot_2026-03-23_160745.png` | `public/images/analyzed-dream-2.png` | Slide 3 — Dream Analysis (right) |
| `Screenshot_2026-03-23_160902.png` | `public/images/patterns-1.png` | Slide 4 — Patterns (left) |
| `Screenshot_2026-03-23_160942.png` | `public/images/patterns-2.png` | Slide 4 — Patterns (right) |

No code changes needed in `CaseStudy.tsx` since the file paths stay the same.

### 2. Reorder Landing Page Sections

In `src/pages/Index.tsx`, move `<WhyItMatters />` from its current position (between HowItWorks and CaseStudy) to after CaseStudy and before Testimonials:

**Current order:**
Hero → Features → HowItWorks → **WhyItMatters** → CaseStudy → Testimonials → CTA

**New order:**
Hero → Features → HowItWorks → CaseStudy → **WhyItMatters** → Testimonials → CTA

### Files
- `public/images/` — 5 image replacements
- `src/pages/Index.tsx` — swap WhyItMatters and CaseStudy order

