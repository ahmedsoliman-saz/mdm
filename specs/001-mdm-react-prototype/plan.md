# Implementation Plan: Sazience MDM React Prototype — Full Build

**Branch**: `001-mdm-react-prototype` | **Date**: 2026-04-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mdm-react-prototype/spec.md`

## Summary

Build a fully interactive, 20-screen React SPA prototype for Sazience MDM targeting the Spare Parts / MRO domain. All data is client-side mock data. The prototype must be demonstrable to stakeholders end-to-end, with working navigation, real data filtering, functional modals/drawers, and Recharts-powered visualizations. No backend, no authentication, no persistence across reloads.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: Ant Design 5 (with `@ant-design/v5-patch-for-react-19`), React Router v6 (`createBrowserRouter` + `<Outlet>`), Recharts, Tailwind CSS v4 (utility layer only), Vite
**Storage**: N/A — all data is client-side TypeScript arrays in `src/data/`
**Testing**: None required — prototype only
**Target Platform**: Modern desktop browser (Chrome/Edge), minimum 1280px viewport width
**Project Type**: Web SPA (React single-page application)
**Performance Goals**: Navigation < 1 second; filter interactions < 500ms; all 20 screens load without errors
**Constraints**: No backend, no API calls, no auth, no persistence, no mobile/tablet support
**Scale/Scope**: 20 screens, 34 functional requirements, 50+ spare part records, 20+ match proposals, 30+ DQ issues, 15+ tasks, 50+ audit entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`constitution.md`) contains only unfilled template placeholders — no project-specific principles have been ratified. **No constitution violations can occur.** This gate is vacuously satisfied.

Post-design re-check: N/A — constitution remains unfilled.

## Project Structure

### Documentation (this feature)

```text
specs/001-mdm-react-prototype/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── routes.md        # Route contract (all 20 routes)
│   └── typescript-interfaces.md  # TypeScript interface contracts
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── components/          # Shared layout and UI components
│   ├── AppLayout.tsx    # Root layout: header + sidebar + breadcrumb + outlet
│   ├── Header.tsx       # Top header bar (logo, tenant, user, bell, search)
│   ├── Sidebar.tsx      # Collapsible left nav with grouped menu items
│   ├── Breadcrumb.tsx   # Dynamic breadcrumb bar
│   ├── DQBadge.tsx      # DQ score badge (green/yellow/red)
│   └── EmptyState.tsx   # Reusable empty state with illustration + CTA
├── pages/               # One folder per screen
│   ├── Dashboard/
│   ├── EntityBrowse/
│   ├── RecordDetail/
│   ├── RecordComparison/
│   ├── MatchingProposals/
│   ├── DQIssueQueue/
│   ├── TaskInbox/
│   ├── DraftStaging/
│   ├── BulkOnboarding/
│   ├── SourceSystems/
│   ├── InterfaceMonitor/
│   ├── DQOverview/
│   ├── AnomalyOverview/
│   ├── ProfileInspector/
│   ├── EntityModelConfig/
│   ├── WorkflowConfig/
│   ├── RBACConsole/
│   ├── AuditLog/
│   ├── TenantSettings/
│   └── MergeOperations/
├── data/                # Mock data arrays (one file per entity type)
│   ├── spareParts.ts
│   ├── vendors.ts
│   ├── equipment.ts
│   ├── tasks.ts
│   ├── matchingProposals.ts
│   ├── dqIssues.ts
│   ├── anomalies.ts
│   ├── auditLog.ts
│   ├── users.ts
│   ├── sourceSystems.ts
│   ├── drafts.ts
│   └── notifications.ts
├── types/               # TypeScript interfaces for all entities
│   └── index.ts
├── hooks/               # Custom hooks
│   ├── useFilters.ts
│   └── usePagination.ts
├── utils/               # Helpers
│   ├── formatDate.ts
│   └── dqBadge.ts
├── routes.tsx            # createBrowserRouter route definitions
└── App.tsx
```

**Structure Decision**: Single SPA project (Option 1 adapted for React). No backend directory — all data is mock. Page-per-folder convention to keep each screen self-contained. Shared components extracted only when used by 3+ screens.

## Complexity Tracking

> No Constitution violations — this section is not required.
