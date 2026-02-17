
### Redesigning the Lifetime CTA for Better Readability and Sentiment

The goal is to shift the visual sentiment of the Lifetime Access offer from "danger/warning" (orange) to "growth/opportunity" (green) while drastically improving readability, especially for the "Best Value" tag.

#### Changes in `src/pages/Dashboard.tsx`:

1.  **Lifetime Button**:
    *   Change the gradient from `orange/amber` to a fresh `lime-400` to `emerald-500` gradient.
    *   Switch text color to `emerald-950` (dark green). This provides much higher contrast on a bright lime background than white does, ensuring the "Lifetime Access — $99" text is crisp and accessible.
    *   Update the hover state and shadow to match the green theme (e.g., `shadow-emerald-500/20`).

2.  **"Best Value" Badge**:
    *   Match the button's `lime-400` to `emerald-500` gradient.
    *   Switch to `emerald-950` text color. Since this text is very small (`text-[10px]`), the high contrast of dark-on-light is critical for readability.
    *   Increase the text size slightly to `text-[11px]` or keep it bold for better legibility if needed, but the primary fix is the contrast.

#### Color Palette Selection:
*   **Background**: `from-lime-400 via-lime-400 to-emerald-500`
*   **Text**: `text-emerald-950` (A deep, dark green that looks professional and provides perfect contrast)
*   **Benefit**: Green is psychologically associated with growth, success, and "go," making it the ideal choice for a premium upgrade path.

#### Sequencing:
*   This is a pure UI change in the `Dashboard.tsx` component.
*   No database or backend changes are required.

