# AGENTS.md — Sazience MDM Prototype

This is a **React prototype** (not production) for Sazience MDM — an interactive stakeholder demo with realistic mock data. No backend, no API calls, all data is hardcoded.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Type-check (tsc -b) then production build
npm run lint             # ESLint on entire project
npm run preview          # Preview production build
```

There is **no test framework** configured. No tests are expected — this is a prototype only.

## Tech Stack

- React 19, TypeScript ~6, Vite 8
- Tailwind CSS v4 (utility layer only)
- Ant Design 6 (enterprise component library)
- React Router v7 (page navigation)
- Recharts 3 (charts and visualizations)
- No path aliases configured — all imports are relative

## Code Formatting

- **No semicolons** at end of lines
- **Single quotes** for strings
- **2-space indentation**
- No trailing commas
- No Prettier config — follow existing file patterns
- No `.editorconfig`

## TypeScript

- `verbatimModuleSyntax: true` — type-only imports MUST use `import type { X }` syntax
- `noUnusedLocals: true` and `noUnusedParameters: true` — no dead code
- `erasableSyntaxOnly: true` — avoid enums; use string literal union types instead
- `noFallthroughCasesInSwitch: true`
- Target: ES2023, module: ESNext, JSX: react-jsx

## Import Order

Group imports in this order, separated by blank lines:

1. `@ant-design/v5-patch-for-react-19` (only in main.tsx, must be first import there)
2. React and third-party libraries (`react`, `react-dom`, `react-router-dom`, `antd`, `recharts`)
3. Local components and pages
4. Local hooks, utils, types
5. CSS/styles

Use `import type { ... }` for type-only imports (required by `verbatimModuleSyntax`).

## File & Directory Naming

| Category | Convention | Example |
|----------|-----------|---------|
| Component files | PascalCase.tsx | `AppLayout.tsx`, `DQBadge.tsx` |
| Page directories | PascalCase/ | `Dashboard/`, `EntityBrowse/` |
| Page entry files | index.tsx | `src/pages/Dashboard/index.tsx` |
| Mock data files | camelCase.ts | `spareParts.ts`, `vendors.ts` |
| Hook files | camelCase with `use` prefix | `useFilters.ts`, `usePagination.ts` |
| Utility files | camelCase.ts | `formatDate.ts`, `dqBadge.ts` |
| Types | `src/types/index.ts` | centralized type definitions |

## TypeScript Naming

- Interfaces and types: PascalCase (`SparePart`, `Vendor`, `DQBadgeProps`)
- String unions preferred over enums: `type EntityStatus = 'Active' | 'Obsolete' | 'Pending Review'`
- Constants (mock data exports): camelCase (`spareParts`, `vendors`)
- Hooks: `use` prefix + camelCase (`useFilters`, `usePagination`)
- Functions: camelCase (`getDQBadgeColor`, `formatDate`)

## Component Patterns

- Functional components only — regular `function` declarations, not arrow functions
- Default exports for page and layout components
- Props defined as dedicated interfaces: `interface DQBadgeProps { score: number }`
- Wrap all pages in the shared `AppLayout` (header + sidebar + breadcrumb + Outlet)
- Use Ant Design components exclusively where one exists — never write raw HTML equivalents
- Use React Router v6+ hooks: `useNavigate`, `useParams`, `Link`

## Design System

- **Light theme only** — no dark mode, no gradients
- Primary: `#1677ff`, Success: `#52c41a`, Warning: `#faad14`, Error: `#ff4d4f`
- Backgrounds: `#ffffff` and `#f5f5f5`
- Card shadows: subtle, not flat boxes
- Minimum viewport width: 1280px
- **DQ Badge thresholds**: green >= 85, yellow 60–84, red < 60
- Use Ant Design Typography system — do not import external fonts
- Use Recharts for all charts and visualizations

## Ant Design Components

Use these consistently: `Table`, `Card`, `Statistic`, `Tag`, `Badge`, `Drawer`, `Modal`, `Form`, `Steps`, `Timeline`, `Tree`, `Descriptions`, `Space`, `Button`, `Select`, `DatePicker`, `Empty`, `Result`, `Layout`, `Menu`, `Breadcrumb`

## Critical Development Rules

1. Every screen must render with **realistic mock data** — no empty tables, no Lorem ipsum
2. All navigation must work — sidebar links, breadcrumbs, row clicks, back buttons
3. **Filters must actually filter** mock data — not just render filter UI
4. **Modals must open and close** — approval modals, comparison drawers, detail panels
5. No authentication — user is always logged in as Ahmed Al-Rashid (Admin)
6. No comments in code unless explicitly requested
7. Mock data minimums: 50+ spare parts, 20+ matching proposals, 30+ DQ issues, 15+ tasks, 50+ audit entries
8. Every screen that can be empty needs a clean empty state with a primary action button

## File Structure

```
src/
  components/        # Shared: AppLayout, Sidebar, Header, Breadcrumb, DQBadge, etc.
  pages/             # One folder per screen (PascalCase/index.tsx)
  data/              # Mock data files (one per entity type)
  types/             # Centralized TypeScript interfaces (index.ts)
  hooks/             # Custom hooks (useFilters, usePagination, etc.)
  utils/             # Helpers (formatDate, getDQBadgeColor, etc.)
  routes.tsx         # Route definitions
  App.tsx            # Root component with RouterProvider
  main.tsx           # Entry point (v5-patch-for-react-19 import first)
```

## Domain Context

- **Vertical**: Spare Parts / MRO (Maintenance, Repair, Overhaul) for maritime
- **Tenant**: Carnival Cruise Lines
- **Key terms**: Golden Record (authoritative entity), Survivorship (merge logic), DQ Score (0–100), Match Proposal (duplicate suggestion), Anomaly (data deviation), Draft (staged changes)
- **Entity types**: Spare Part (SP-XXXXXX), Vendor (V-XXXX), Equipment (EQ-XXXX)
- **Source systems**: AMOS, SAP ERP, Excel Uploads, Vendor Portal API

## Error Handling

- No backend errors to handle — all data is static mock data
- Use Ant Design `<Result status="404">` for not-found pages
- Use Ant Design `<Empty>` component for empty states with a call-to-action button
- No error boundaries required for the prototype

## ESLint Configuration

ESLint 9 flat config with:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks` flat recommended
- `eslint-plugin-react-refresh` vite config
- No custom rule overrides — purely recommended configs
- `dist/` globally ignored
