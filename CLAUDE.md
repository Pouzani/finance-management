# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@DESIGN.md

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build + type check
npm run lint     # ESLint
```

There are no tests in this project. The build (`npm run build`) is the primary validation — it runs TypeScript checks and catches RSC/client boundary errors.

## Architecture

**Next.js 16.2 App Router** with React 19, TypeScript, and Tailwind CSS v4.

### Route structure
- `/` redirects to `/dashboard`
- `/dashboard` — main layout (`app/dashboard/layout.tsx`) wraps all sub-routes with `<Sidebar>` + `<TopBar>`
- Placeholder pages exist for: transactions, budgets, goals, accounts, reports, settings

### Layout model
`app/dashboard/layout.tsx` renders a fixed full-height shell:
- **Left**: `<Sidebar>` (sticky, `w-64`, `h-screen`)
- **Right**: flex column with `<TopBar>` on top, then `{children}` below

`app/dashboard/page.tsx` is itself a two-column layout:
- **Main area** (scrollable `flex-1`): BalanceSummary → Charts grid → TransactionTable
- **Right panel** (`w-96`, hidden below `xl`): QuickTransaction + GoalCards

### Component layers

```
components/
  ui/           # Primitive design system components (no business logic)
  dashboard/    # Dashboard-specific feature components
  layout/       # Sidebar, TopBar
```

**`components/ui/`** — 8 typed primitives all consumers should use:
- `Card` — `rounded-3xl shadow-ambient` container. Has `"use client"` because it accepts `onClick`. Pass `padding`, `as`, `overflow`, `className` props.
- `Button` — variants: `primary | ghost | link | icon`; sizes: `sm | md | lg`
- `Badge` — variants: `primary | error | secondary | tertiary | neutral | custom`
- `ProgressBar` — `value` (0–100) + `color`; renders as slim `h-1.5` gradient bar
- `IconBox` — colored icon container with `bg`, `color`, `size`, `shape` props
- `MetricCard` — stat card with left accent bar, uses Badge + ProgressBar internally
- `SectionHeader` — `title` + optional `subtitle` + optional `action` slot
- `EyebrowLabel` — `10px uppercase tracking-widest` label; `light` prop for dark backgrounds

### Data layer
`lib/data.ts` is the single source of mock data. It exports typed arrays (`transactions`, `goals`, `monthlyFlow`, `categorySplit`) and `formatMAD()` which uses `Intl.NumberFormat("fr-MA")` for French-Moroccan number formatting.

### Server vs Client Components
Next.js App Router defaults to Server Components. Rules that apply here:
- Any component using `useState`, `usePathname`, or event handlers needs `"use client"` at the top
- Server Components **cannot** pass function props (e.g. `onClick`) to Client Components — the parent must be a Client Component in that case
- `Card.tsx` has `"use client"` so it can accept `onClick`. But if a Server Component passes `onClick` to `Card`, that Server Component must also become a Client Component

### Styling
- **No 1px borders** for layout separation — use background color shifts between `surface-container` tiers instead (see DESIGN.md "No-Line Rule")
- All CSS custom properties are defined in `app/globals.css` under `:root` (teal/slate Material Design 3 palette)
- Light mode is enforced unconditionally via `color-scheme: light only` in `:root` and a `@media (prefers-color-scheme: dark)` override block — the app always renders in light theme
- Financial amounts must use `formatMAD()` and be right-aligned; apply `font-variant-numeric: tabular-nums` (via the `font-numeric` utility class) for column alignment
- Tailwind v4 is used — no `tailwind.config.js`; configuration is in `app/globals.css` via `@import "tailwindcss"`
