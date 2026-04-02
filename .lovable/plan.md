

## Dreamy Landing Page Polish

Three areas: Hero background, Lucid Dreaming section animations, and Features section atmosphere.

---

### CHANGE 1 — Hero: Deep navy with twinkling stars

**File: `src/index.css`**
- Update hero gradient to deeper navy: `--hero-gradient-from: 222 47% 11%` and `--hero-gradient-to: 230 45% 18%` (dark navy-to-midnight blue, matching the brand navy system)

**File: `src/components/Hero.tsx`**
- Add twinkling star particles to the hero background (same approach as LucidDreamingSection — ~40 small white dots with random positions, sizes 1-3px, opacity 0.1-0.4, CSS twinkle animation with staggered delays)
- Update decorative blobs to softer blue/indigo glows at lower opacity for a nebula feel
- Add the twinkle keyframe CSS inline

---

### CHANGE 2 — Lucid Dreaming section: floating text animation

**File: `src/components/LucidDreamingSection.tsx`**
- Add a gentle `animate-float` effect (already defined in index.css) to the subtitle paragraph so it softly bobs
- Add a slower, offset float animation to each bullet point row with staggered delays (using inline animation styles with different durations like 4s, 5s, 6s)
- Increase star count from 25 to 40 for a richer night sky

---

### CHANGE 3 — Features "A third of your life" section: dreamy touches

**File: `src/components/Features.tsx`**
- Add a very subtle floating animation to the Moon icon (gentle bob using the existing `animate-float` class)
- Add a faint pulsing glow behind the headline text using a pseudo-element or a blurred div (soft purple/blue, low opacity)
- The notebook card already has hover:rotate-0 — add a subtle `hover:shadow-lg` transition for warmth

---

### Files changed
- `src/index.css` — hero gradient variables (navy tones)
- `src/components/Hero.tsx` — add twinkling stars background
- `src/components/LucidDreamingSection.tsx` — floating text animations, more stars
- `src/components/Features.tsx` — moon float, headline glow, card hover shadow

