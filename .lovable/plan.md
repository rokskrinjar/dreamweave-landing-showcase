
Goal: fix the Elena inconsistency where the header says “Based on 8 dreams” but the emotional paragraph says “across fifteen dreams,” and make this robust so it cannot happen again.

What I found
- Elena’s latest stored insight has `dreams_analyzed = 8`, but the saved `emotional_patterns` text starts with “Across these fifteen dreams…”.
- Root cause: this is model drift/hallucination in generated prose. Prompt-only control (“EXACTLY X dreams”) is not sufficient by itself.
- Current UI correctly displays `dreams_analyzed` from stored metadata, so the mismatch is coming from generated text content, not UI counting logic.

Implementation plan

1) Add a deterministic backend guard in `supabase/functions/dream-patterns/index.ts`
- After parsing tool output, run a normalization/validation step on `emotional_patterns` before saving:
  - Detect count mentions that don’t match `dreamCount` (digits and common number words, including “fifteen”).
  - If mismatched, rewrite the opening count phrase to a canonical sentence using the exact number, e.g.:
    - `Based on ${dreamCount} dreams, ...`
  - Keep the rest of the emotional analysis intact.
- Also tighten prompt instructions:
  - Prefer “do not use spelled-out number words for dream count.”
  - Require exact numeric count form only if count is mentioned.

2) Keep frontend display aligned and resilient in `src/pages/Patterns.tsx`
- Keep the existing trusted header source (`patternData.dreams_analyzed`).
- Add a small defensive rendering improvement:
  - Preserve the paragraph formatting and bold text as-is.
  - Optionally strip only obvious conflicting “across X dreams” lead-ins at render-time if they don’t match `dreams_analyzed` (secondary safety net).
- This ensures even legacy/stale records won’t show contradictory count language.

3) Handle existing inconsistent insight rows for demo users (Elena-focused)
- For current inconsistent rows already saved, force regeneration once after backend guard is live:
  - Log in as Elena, click “Refresh Insights.”
- This refresh writes a corrected insight using the new guard.
- No schema or RLS changes required.

4) Verification checklist (targeted to Elena)
- Elena account:
  - Confirm header shows “Based on 8 dreams.”
  - Confirm emotional text uses 8 (or avoids mentioning a different count).
- Rachel account:
  - Confirm same consistency behavior in short-tier output.
- Daniel/high-volume account:
  - Confirm deep-tier still works and count mentions remain exact.
- Regression:
  - Confirm suggestions still return 5–10.
  - Confirm bold markdown rendering still works.

Technical notes
- No database migrations needed.
- No auth/policy changes needed.
- This is a backend logic hardening + optional UI safety net to prevent future count drift even if the model ignores instructions.
