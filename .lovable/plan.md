

## Fix Auth/Login Page

### Issues
1. **Duplicate text**: Line 80-81 shows "DreamWeave" twice — remove the duplicate
2. **Background color**: Change from `hero-gradient` (purple) to `cta-dark-gradient` (dark navy)

### Changes in `src/pages/Auth.tsx`
- Line 75: Change `hero-gradient` to `cta-dark-gradient`
- Lines 80-81: Remove the duplicate "DreamWeave" text, keep only one instance

One file modified. No functionality changes.

