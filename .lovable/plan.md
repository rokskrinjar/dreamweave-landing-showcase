

## Use DreamWeave Moon Logo as Favicon

The project already has the moon logo at `src/assets/dreamweave-logo.png` (used in Navbar/Footer at small sizes like 40x40px). The plan is to copy this image to replace the current favicon.

### Steps

1. **Copy** `src/assets/dreamweave-logo.png` → `public/favicon.png` (overwrite existing)
2. **Delete** `public/favicon.ico` to prevent browsers from defaulting to the old icon
3. **Verify** `index.html` already references `/favicon.png` (it does)

### Files changed
- `public/favicon.png` — replaced with moon logo
- `public/favicon.ico` — deleted

