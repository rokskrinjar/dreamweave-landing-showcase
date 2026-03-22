

## Visual Adjustments to Landing Page

### 1. Logo Update
- Copy the uploaded purple moon icon to `src/assets/dreamweave-logo.png`
- **Navbar**: Replace the emoji `🌙` gradient box with an `<img>` of the new logo. Change text from "DreamWeave.me" to "DreamWeave"
- **Hero phone mockup**: Same logo swap in the mini header inside the phone
- **Navbar background**: Change the non-scrolled nav bar to use a dark navy background (`bg-[#1a1a2e]` or similar dark blue) instead of `hero-gradient`, matching the screenshot's dark top bar

### 2. Hero Section Text
Update to match the screenshot:
- Badge: "Trusted by thousands of dreamers exploring their subconscious" (remove Moon icon, use a refresh/moon icon)
- Headline: "Your dreams are trying to tell you **something.**" (replace current 3-line headline)
- Subtext: "Most people forget 95% of their dreams within minutes of waking up. DreamWeave helps you capture them, understand their symbols, and discover patterns in your subconscious — with AI helping you uncover insights you might miss."
- Free plan note: "Free plan includes several AI analyses per month. No credit card required."

### 3. Features Section Text
Update titles and descriptions to match screenshot:
- "Remember Your Dreams" / "Most dreams fade within minutes. Capture them instantly so they don't disappear."
- "Understand the Symbols" / "Dreams speak in emotions and symbols. DreamWeave helps you reflect on what they might represent."
- "See the Patterns" / "Over time recurring themes begin to appear — people, places, emotions, situations. AI helps highlight patterns you might not notice on your own."
- "Gain Personal Insight" / "Every dream becomes a small piece of a bigger picture about your thoughts, emotions, and experiences."
- Update icons: PenLine -> BookOpen, Brain -> Search, TrendingUp stays, Lightbulb stays

### 4. How It Works Section Text
Update step titles and descriptions to match screenshot:
- Step 1: "Wake Up. Capture the Dream." / "Open DreamWeave and write down what you remember. No overthinking — raw thoughts are enough."
- Step 2: "AI Highlights the Meaning" / "DreamWeave identifies emotional themes, symbols, and patterns — helping you see your dream in a new light."
- Step 3: title stays same / "After several dreams, recurring themes appear — emotions, places, people, and situations. This is where real insights begin."
- Change the circle gradient from `gradient-indigo` to a dark navy color (`bg-[#1a1a2e]`)

### 5. Testimonials Section
Update testimonial text to match screenshot:
- Maria C.: "I started noticing patterns in my dreams after just a week. It helped me realize how much stress I was carrying without even knowing it."
- David R.: "My therapist actually asked me about DreamWeave after I started bringing more specific dream insights to our sessions. It's an incredible supplement to self-reflection."
- Sarah W.: "I thought dream journaling was just a trend. But seeing recurring symbols laid out over weeks — it genuinely changed how I understand my own emotions."
- Add a quote icon (decorative `"`) in the top-right corner of each card

### Files Modified
- `src/components/Navbar.tsx` — logo image + text + dark navy bar
- `src/components/Hero.tsx` — headline, subtext, badge, logo in phone mockup
- `src/components/Features.tsx` — titles, descriptions, icon swaps
- `src/components/HowItWorks.tsx` — titles, descriptions, dark navy circles
- `src/components/Testimonials.tsx` — updated review text, add quote icon
- Copy `user-uploads://ChatGPT_Image_6._mar._2026_18_34_41.png` to `src/assets/dreamweave-logo.png`

