# Design System Strategy: The Financial Atelier

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Ledger of Trust"**

This design system moves beyond the generic "SaaS dashboard" by embracing an editorial, high-end aesthetic tailored for the Moroccan financial landscape. It treats personal finance not as a series of chores, but as a professional craft. 

We break the "template" look by using **Intentional Asymmetry**. While the layout follows a 3-column structure, the content within does not sit on a rigid, boxed grid. Instead, we use overlapping "sheets" of information, varying typographic scales (Manrope for high-impact data vs. Inter for utility), and a deep focus on **Tonal Layering**. The result is a workspace that feels as premium as a physical leather-bound ledger, yet as fluid as a modern digital tool like Figma.

---

## 2. Colors & Surface Philosophy
Our palette is rooted in a sophisticated "Teal-and-Slate" spectrum, utilizing the Moroccan professional preference for trustworthy, muted tones.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** In this system, 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts.
*   **The Transition:** Use `surface-container-low` for your background and `surface-container-lowest` for your main cards. The eye will perceive the edge through the shift in value, creating a cleaner, more "breathable" interface.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:
*   **Base Layer:** `surface` or `surface-bright`.
*   **Structural Sidebar/Panels:** `surface-container-low`.
*   **Active Work Area:** `surface-container-lowest` (pure white/highest contrast).
*   **Contextual Overlays:** `surface-container-high` for subtle differentiation of secondary data.

### The "Glass & Signature" Rule
*   **Glassmorphism:** For floating context panels or hover states, use `surface-container-lowest` at 80% opacity with a `backdrop-filter: blur(12px)`. This keeps the "Moroccan light" feel in the UI.
*   **Signature Textures:** For high-value CTAs or "Total Balance" hero cards, apply a subtle linear gradient from `primary` (#166969) to `primary-container` (#a6efef) at a 135-degree angle. This adds "soul" to an otherwise flat digital experience.

---

## 3. Typography
We utilize a dual-typeface system to balance authority with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` to `headline-sm` for large financial totals and section titles. It conveys a modern, architectural stability.
*   **Body & Utility (Inter):** The workhorse for dense financial data. Use `body-md` for transaction lists and `label-sm` for metadata.
*   **Internationalization:** Typography must account for French-style numbering (e.g., `12 500,50 MAD`). Ensure `font-variant-numeric: tabular-nums` is applied to all financial data to maintain alignment in columns.

---

## 4. Elevation & Depth
Elevation is expressed through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background to create a "soft lift." 
*   **Ambient Shadows:** When an element must "float" (like a dropdown or modal), use a shadow color derived from `on-surface` at 6% opacity. 
    *   *Spec:* `box-shadow: 0px 10px 30px rgba(43, 52, 55, 0.06);`
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` (#abb3b7) at **15% opacity**. Never use a 100% opaque border.
*   **Glassmorphism:** Use semi-transparent `surface` tokens on the Right Context Panel to allow the "energy" of the main content area to bleed through, maintaining a sense of place.

---

## 5. Components

### Buttons
*   **Primary:** A solid `primary` (#166969) fill with `on-primary` text. Use `roundedness-md` (0.375rem).
*   **Secondary:** `secondary-container` fill with `on-secondary-container` text. No border.
*   **Tertiary:** Ghost style. `on-surface` text with a `surface-container-high` background only on hover.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface-container-highest` background with a `roundedness-sm`. 
*   **Focus State:** Shift background to `surface-container-lowest` and add a 2px `primary` "Ghost Border" at 20% opacity.
*   **Data Density:** Labels use `label-md` in `on-surface-variant` (#586064) to keep the focus on the user's data.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate transactions. 
*   **The Spacing Strategy:** Use `spacing-4` (0.9rem) between list items. Use alternating `surface-container-low` and `surface-container-lowest` backgrounds for rows only if the data is extremely dense; otherwise, rely on whitespace.

### Financial Progress Bars
*   **Track:** `surface-container-highest`.
*   **Indicator:** Linear gradient from `primary` to `primary-fixed-dim`. 
*   **Height:** Keep it slim (`spacing-1.5`) for an elegant, non-obtrusive look.

### The "MAD" Currency Chip
*   A specialized component for the Moroccan Dirham. Use `tertiary-container` background with `on-tertiary-container` text. Use `roundedness-full` to make these feel like physical coins or tokens within the digital ledger.

---

## 6. Do’s and Don’ts

### Do:
*   **Use French Numbering:** Always format as `1.000,00` or `1 000,00` depending on the localization toggle.
*   **Embrace Dense Data:** Personal finance users in Morocco often manage complex, multi-source incomes. Use `body-sm` and `label-md` to maximize information density without sacrificing clarity.
*   **Align to the Right:** Currency symbols (MAD) and financial totals should be right-aligned in tables to allow for easy decimal comparison.

### Don't:
*   **Don't use "Pure" Black:** Always use `on-surface` (#2b3437) for text to maintain a soft, premium feel.
*   **Don't use Standard Shadows:** Avoid the default CSS `box-shadow: 0 2px 4px`. It looks "cheap." Use our Ambient Shadow spec.
*   **Don't use Vertical Dividers:** In the 3-column layout, use a `surface-container-low` sidebar and a `surface-container-lowest` main area to define the split. No vertical lines allowed.