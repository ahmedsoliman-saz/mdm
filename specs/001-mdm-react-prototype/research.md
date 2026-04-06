# Research: Sazience MDM React Prototype

**Phase**: 0 — Pre-design research
**Date**: 2026-04-06
**Branch**: `001-mdm-react-prototype`

## 1. React 19 + Ant Design 5 Compatibility

**Decision**: Install `@ant-design/v5-patch-for-react-19` alongside Ant Design 5 to fix React 19 breakages.

**Rationale**: React 19 removed `element.ref` access and changed `ReactDOM.render`, which breaks Ant Design 5's static methods (Modal, Notification, Message). The official patch adapter resolves these without requiring a downgrade to React 18. During installation, use `--legacy-peer-deps` or an `overrides` block in `package.json` to suppress peer dependency warnings.

**Alternatives considered**:
- Downgrade to React 18 — rejected; React 19 is already installed per project setup.
- Use `unstableSetRender` workaround — viable but less clean than the official patch.

**Action required**: Add `@ant-design/v5-patch-for-react-19` to `package.json` dependencies. Import it at the top of `main.tsx` before any Ant Design import.

---

## 2. Tailwind CSS v4 + Ant Design 5 Style Coexistence

**Decision**: Use Ant Design's `StyleProvider` from `@ant-design/cssinjs` with `hashPriority="high"` to ensure Ant Design component styles always win over Tailwind utilities on Ant Design elements, while Tailwind utilities work normally on custom elements.

**Rationale**: Tailwind v4 uses CSS layers for its utilities; Ant Design's CSS-in-JS styles are unlayered and can collide with Tailwind resets. Wrapping the app with `StyleProvider` raises the specificity of Ant Design's generated class names, resolving the cascade conflict without needing to disable either library.

**Tailwind scope**: Tailwind is used only for layout utilities (flex, grid, gap, padding, margin, width, height) on wrapper divs. All interactive Ant Design components (Table, Card, Button, Modal, Drawer, etc.) are styled exclusively through Ant Design's theme token system, not Tailwind classes.

**Alternatives considered**:
- Disabling Tailwind preflight — possible but loses reset; prefer StyleProvider instead.
- Using a Tailwind prefix (e.g., `tw-`) — would require prefixing every utility; rejected for ergonomics.

---

## 3. React Router v6 Persistent Layout Pattern

**Decision**: Use `createBrowserRouter` with a root layout route (`AppLayout`) that renders `<Outlet />` for child content.

**Rationale**: React Router v6's nested routes with a layout component at the root is the canonical approach for persistent chrome (header + sidebar). The `AppLayout` component receives no route-specific props — it reads the current location via `useLocation` to compute the active sidebar item and breadcrumb dynamically.

**Route structure**:
```
/ → redirect to /dashboard
/dashboard → <Dashboard />         (inside AppLayout)
/entities/:entityType → <EntityBrowse />
/entities/:entityType/records/:id → <RecordDetail />
/compare/:id1/:id2 → <RecordComparison />
/governance/matching → <MatchingProposals />
/governance/dq-issues → <DQIssueQueue />
/governance/tasks → <TaskInbox />
/governance/drafts → <DraftStaging />
/operations/bulk-onboarding → <BulkOnboarding />
/operations/sources → <SourceSystems />
/operations/interfaces → <InterfaceMonitor />
/analytics/dq-overview → <DQOverview />
/analytics/anomalies → <AnomalyOverview />
/analytics/profiling → <ProfileInspector />
/admin/entity-model → <EntityModelConfig />
/admin/workflows → <WorkflowConfig />
/admin/rbac → <RBACConsole />
/admin/audit-log → <AuditLog />
/admin/settings → <TenantSettings />
* → <NotFound />
```

**Breadcrumb strategy**: A static route-to-label map keyed by path pattern. `useLocation` provides the current pathname; the map returns the breadcrumb segments. Dynamic segments (`:entityType`, `:id`) resolve their label from mock data lookups.

---

## 4. Recharts Chart Types for Analytics Screens

**Decision**: Use Recharts for line, bar (vertical and horizontal), area, and pie charts. Implement sparklines as small `<LineChart>` components with axes hidden. Build the DQ gauge as a `<RadialBarChart>` or styled `<PieChart>`.

**Chart type → Recharts component mapping**:

| Screen | Chart | Recharts Component |
|--------|-------|--------------------|
| Dashboard — DQ sparklines | Small 7-point line | `<LineChart>` (no axes, no legend, compact width) |
| DQ Overview — overall score | Gauge/donut | `<PieChart>` with inner label |
| DQ Overview — entity bar | Vertical bars | `<BarChart>` |
| DQ Overview — 30-day trend | Multi-line | `<LineChart>` with `<Legend>` |
| DQ Overview — dimension breakdown | Stacked bar | `<BarChart layout="vertical">` stacked |
| DQ Overview — top 10 failing rules | Horizontal bar | `<BarChart layout="vertical">` |
| Anomaly detail — outlier chart | Bar with highlighted bar | `<BarChart>` with custom `<Cell>` fill |
| Profile Inspector — distribution | Histogram/bar | `<BarChart>` |
| Profile Inspector — top values | Small bar | `<BarChart layout="vertical">` |

**React 19 compatibility**: No known issues with Recharts and React 19 as of 2025.

**Alternatives considered**:
- Chart.js / react-chartjs-2 — rejected; Recharts is already in the spec.
- D3 — rejected; too low-level for a prototype with tight schedule.

---

## 5. Client-Side Filter Performance (50–100 Records)

**Decision**: Use `useMemo` for all filter/search derived arrays. No virtualization library needed at this scale.

**Rationale**: Filtering 50–100 records in JavaScript is near-instantaneous. The risk is not compute time but unnecessary re-renders when unrelated state changes. `useMemo` with a dependency array containing the raw data array and all active filter values prevents recomputation on unrelated renders.

**Pattern**:
```typescript
const filteredData = useMemo(() => {
  return spareParts
    .filter(p => !filters.category || p.category === filters.category)
    .filter(p => !filters.search || p.description.toLowerCase().includes(filters.search.toLowerCase()))
    .filter(p => p.dqScore >= filters.dqMin && p.dqScore <= filters.dqMax);
}, [spareParts, filters]);
```

**Pagination**: Apply `useMemo` for filter, then slice for the current page. This ensures page count is computed from the filtered total, not the raw total.

**Alternatives considered**:
- TanStack Table (react-table) — viable but over-engineered for mock data; Ant Design Table handles sorting/pagination natively.
- Virtual scrolling (react-virtual) — not needed for <100 visible rows.

---

## Summary of Decisions

| Topic | Decision |
|-------|----------|
| React 19 + Ant Design | `@ant-design/v5-patch-for-react-19` patch |
| Style coexistence | `StyleProvider` with `hashPriority="high"` |
| Router layout | `createBrowserRouter` + nested layout route with `<Outlet>` |
| Charts | Recharts — `LineChart`, `BarChart`, `PieChart`, `RadialBarChart` |
| Filtering | `useMemo` with filter dependency array |
