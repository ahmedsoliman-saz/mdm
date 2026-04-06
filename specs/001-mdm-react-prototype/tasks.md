# Tasks: Sazience MDM React Prototype — Full Build

**Input**: Design documents from `/specs/001-mdm-react-prototype/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not requested — prototype only (no testing phase included).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US7)
- Exact file paths are included in all descriptions

---

## Phase 1: Setup

**Purpose**: Install dependencies and scaffold the project directory structure.

- [x] T001 Add `antd`, `@ant-design/v5-patch-for-react-19`, `@ant-design/cssinjs`, `react-router-dom`, and `recharts` to `package.json` dependencies and run `npm install --legacy-peer-deps`
- [x] T002 Add React 19 `overrides` block (`"react": "^19.0.0"`, `"react-dom": "^19.0.0"`) to `package.json` to suppress peer dependency warnings
- [x] T003 Create all source subdirectories per plan.md: `src/components/`, `src/pages/` (one subfolder per screen), `src/data/`, `src/types/`, `src/hooks/`, `src/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript interfaces, mock data, utility functions, custom hooks, and app entry-point wiring. Every user story depends on this phase being complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Define all TypeScript interfaces and union types (SparePart, Vendor, Equipment, MatchingProposal, DQIssue, Task, Draft, AuditLogEntry, SourceSystem, InterfaceRecord, Anomaly, User, Notification, all filter interfaces, DQBadgeProps, EmptyStateProps, and all supporting union types) in `src/types/index.ts`
- [x] T005 [P] Implement `getDQBadgeColor`, `getDQTagColor` utility functions in `src/utils/dqBadge.ts` (green ≥85, yellow 60–84, red <60)
- [x] T006 [P] Implement `formatDate`, `formatDateTime`, `formatRelativeTime` utility functions in `src/utils/formatDate.ts`
- [x] T007 [P] Implement `useFilters<T>` custom hook (filters state, setFilter, resetFilters) in `src/hooks/useFilters.ts`
- [x] T008 [P] Implement `usePagination` custom hook (currentPage, pageSize, setCurrentPage, paginatedSlice) in `src/hooks/usePagination.ts`
- [x] T009 [P] Generate `src/data/spareParts.ts` — 50+ SparePart records with varied categories (Mechanical, Electrical, HVAC, Safety, Hull), manufacturers (Wärtsilä, ABB Marine, etc.), statuses, DQ scores spanning green/yellow/red ranges, and mixed source systems
- [x] T010 [P] Generate `src/data/vendors.ts` (20+ Vendor records), `src/data/equipment.ts` (20+ Equipment records across Carnival Horizon and other vessels)
- [x] T011 [P] Generate `src/data/matchingProposals.ts` (20+ MatchingProposal records with varied confidence scores 45–98, Merge/Split actions, Rule/AI sources, varied SLA days remaining), and `src/data/dqIssues.ts` (30+ DQIssue records with Error/Warning severities, On Track/Approaching/Breached SLA statuses)
- [x] T012 [P] Generate `src/data/tasks.ts` (15+ Task records with Approval/Correction/Merge Review/Escalation types, changeset and workflowHistory arrays), and `src/data/drafts.ts` (5 Draft records with before/after attribute changes)
- [x] T013 [P] Generate `src/data/auditLog.ts` (50+ AuditLogEntry records with varied users, actions, entity types, and changePayload JSON), `src/data/anomalies.ts` (8+ Anomaly records), `src/data/notifications.ts` (10 Notification records), `src/data/users.ts` (5 User records: Ahmed Al-Rashid, Sarah Chen, James O'Connor, Maria Santos, Raj Patel), `src/data/sourceSystems.ts` (4 SourceSystem records: AMOS healthy, SAP ERP degraded, Excel active, Vendor Portal healthy)
- [x] T014 Configure `src/main.tsx` with correct import order: `@ant-design/v5-patch-for-react-19` first, then React, then ReactDOM, then App
- [x] T015 Implement `src/App.tsx` wrapping `<RouterProvider router={router} />` inside `<StyleProvider hashPriority="high">` from `@ant-design/cssinjs`

**Checkpoint**: Foundation complete — all types, mock data, utilities, hooks, and app entry point are ready. User story implementation can begin.

---

## Phase 3: User Story 1 — Application Shell & Navigation Foundation (Priority: P1) 🎯 MVP

**Goal**: Deliver a working persistent shell (header, sidebar, breadcrumb) with all 20 routes registered and navigable. Every screen is reachable; the app loads without errors.

**Independent Test**: Launch the dev server, click every sidebar item, verify the correct route loads and breadcrumb updates, verify the sidebar collapses to icon-only view, verify the notification bell shows a dropdown, and verify the global search dropdown appears.

- [x] T016 [US1] Create `src/routes.tsx` using `createBrowserRouter` with root layout route (`AppLayout`), redirect `/` → `/dashboard`, all 20 named routes per the route contract, `NotFound` as catch-all (`*`), and stub page components (simple `<div>` placeholders) for all screens not yet implemented
- [x] T017 [US1] Implement `src/components/AppLayout.tsx` — root layout rendering Ant Design `<Layout>` with `<Header>`, `<Sider>` (collapsible), `<Breadcrumb>` bar, and `<Content>` containing `<Outlet />`; reads active route via `useLocation`
- [x] T018 [P] [US1] Implement `src/components/Header.tsx` — Sazience MDM logo, tenant name "Carnival Cruise Lines", user avatar with "Ahmed Al-Rashid — Admin", notification bell with unread badge count from notifications mock data, and global search input (⌘K keyboard shortcut)
- [x] T019 [P] [US1] Implement `src/components/Sidebar.tsx` — collapsible Ant Design `<Menu>` with 6 grouped sections (Home, Data, Governance, Operations, Analytics, Admin) and all items per CLAUDE.md; active item highlighted via `useLocation`; collapse toggle button
- [x] T020 [P] [US1] Implement `src/components/Breadcrumb.tsx` — static route-to-label map keyed by path pattern; dynamic segments (`:entityType`, `:id`) resolved from mock data lookups; renders Ant Design `<Breadcrumb>`
- [x] T021 [P] [US1] Implement `src/components/DQBadge.tsx` — Ant Design `<Tag>` colored via `getDQTagColor(score)`, size prop ('small' | 'default'), renders score as "87" label
- [x] T022 [P] [US1] Implement `src/components/EmptyState.tsx` — Ant Design `<Empty>` with custom title, optional description, and primary `<Button>` triggering onAction callback
- [x] T023 [US1] Implement notification bell dropdown panel in `src/components/Header.tsx` — Ant Design `<Popover>` showing 10 most recent notifications from mock data with type icon, message text, and `formatRelativeTime` timestamp
- [x] T024 [US1] Implement global search dropdown in `src/components/Header.tsx` — Ant Design `<AutoComplete>` or `<Select>` showing results grouped by Records, Tasks, and Users filtered from mock data; navigates to record/task detail on selection
- [x] T025 [P] [US1] Implement `src/pages/NotFound/index.tsx` — Ant Design `<Result status="404">` with "Page Not Found" title and link back to `/dashboard`

**Checkpoint**: All 20 routes are navigable. Shell renders on every screen. Breadcrumbs update. Notification and search dropdowns work.

---

## Phase 4: User Story 2 — Dashboard & Home Screen (Priority: P1)

**Goal**: Deliver the Dashboard screen with all 6 widget sections fully populated with mock data and clickable navigations.

**Independent Test**: Navigate to `/dashboard` and verify all 6 sections render with correct mock values (task counts 12/3/1/47, DQ scores 87.3%/92.1%/78.6%, AMOS green, SAP ERP amber), that clicking "Pending My Action" navigates to Task Inbox, and that the anomaly summary links to Anomaly Overview.

- [x] T026 [US2] Implement `src/pages/Dashboard/index.tsx` page shell — Ant Design `<Row>`/`<Col>` grid layout, page title "Dashboard", and import connections to all 6 widget sections
- [x] T027 [US2] Implement Task Summary stat cards section in `src/pages/Dashboard/index.tsx` — 4 Ant Design `<Statistic>` cards (Pending My Action: 12 blue, Approaching SLA: 3 amber, Past SLA: 1 red, Total Open: 47 gray) each navigating to `/governance/tasks` with pre-applied filter on click
- [x] T028 [US2] Implement DQ Score Panels section in `src/pages/Dashboard/index.tsx` — 3 Ant Design `<Card>` components for Spare Parts (87.3%), Vendors (92.1%), Equipment (78.6%) each containing a compact Recharts `<LineChart>` sparkline (7 data points, no axes, no legend) with trend arrows
- [x] T029 [US2] Implement Record Volume stats section in `src/pages/Dashboard/index.tsx` — stat cards showing total record counts per entity type derived from mock data arrays
- [x] T030 [US2] Implement Source System Health table in `src/pages/Dashboard/index.tsx` — Ant Design `<Table>` from sourceSystems mock data showing source name, type, health status badge (AMOS green, SAP ERP amber), last sync time, and record count
- [x] T031 [US2] Implement Anomaly Alert Summary section in `src/pages/Dashboard/index.tsx` — list of top 3 high/medium anomalies from anomalies mock data with severity badges and link to `/analytics/anomalies`
- [x] T032 [US2] Implement Recent Activity Feed section in `src/pages/Dashboard/index.tsx` — scrollable Ant Design `<Timeline>` showing 15–20 most recent auditLog entries with user, action, entity type, and `formatRelativeTime` timestamp

**Checkpoint**: Dashboard is fully functional with all 6 widget sections and correct mock values.

---

## Phase 5: User Story 3 — Entity Browse & Record Detail (Priority: P1)

**Goal**: Deliver Entity Browse (tab-switched paginated grid with real filtering) and Record Detail (6-tab view with source attribution, DQ breakdown, version history with diff modal, and lineage graph). Also includes Record Comparison view.

**Independent Test**: Navigate to `/entities/spare-parts`, confirm 50+ records with DQ badges load, apply a category filter and confirm records change, set DQ range 60–84 and confirm only yellow-badge records show, click a row, confirm all 6 detail tabs render with mock content, click Version History and confirm the diff modal opens.

- [ ] T033 [US3] Implement `src/pages/EntityBrowse/index.tsx` — Ant Design `<Tabs>` switching between Spare Parts, Vendors, and Equipment; Ant Design `<Table>` with 25-per-page pagination, sortable columns (Part Number, Description, Category, Manufacturer, Status, DQ Score, Last Updated), checkbox row selection, `<DQBadge>` per row, and row click navigating to `/entities/:entityType/records/:id`
- [ ] T034 [US3] Implement real-time search bar in `src/pages/EntityBrowse/index.tsx` using `useFilters`, `useMemo` filtering Part Number and Description fields (case-insensitive includes match) — updates displayed records without page reload
- [ ] T035 [US3] Implement Advanced Filter panel in `src/pages/EntityBrowse/index.tsx` — collapsible Ant Design `<Collapse>` panel with Select inputs for Category, Manufacturer, Status, Source System, Assigned Steward; `<Slider range>` for DQ Score (0–100); `<DatePicker.RangePicker>` for Last Modified; all filters applied via `useMemo` against actual mock data field values; "Clear Filters" resets via `resetFilters()`; empty state shows `<EmptyState>` when no records match
- [ ] T036 [US3] Implement `src/pages/RecordDetail/index.tsx` — record header showing Part Number, Description, Status `<Tag>`, `<DQBadge>`, workflow state badge, "More Actions" dropdown (includes "Merge" entry), and Back button navigating to the originating entity browse screen; 6-tab `<Tabs>` layout
- [ ] T037 [US3] Implement Golden Record Attributes tab in `src/pages/RecordDetail/index.tsx` — Ant Design `<Descriptions>` showing all SparePart fields; each field label has a `<Tooltip>` on a source icon showing source system name and survivorship rule; override indicator badge on steward-edited values
- [ ] T038 [US3] Implement Source Instances, Related Records, and DQ Validation tabs in `src/pages/RecordDetail/index.tsx` — Source Instances: table of 2–3 mock source records with system badge and per-field value comparison; Related Records: table linking to related vendor/equipment; DQ Validation: dimension score bars (Completeness, Uniqueness, Validity, Consistency, Timeliness) and failing rules list; empty state for Source Instances when no sources
- [ ] T039 [US3] Implement Version History tab in `src/pages/RecordDetail/index.tsx` — Ant Design `<Table>` of 5–8 mock versions (version number, date, user, summary); clicking a row opens Ant Design `<Modal>` with before/after diff table showing changed attribute names, old values (red strikethrough), and new values (green)
- [ ] T040 [US3] Implement Lineage Graph tab in `src/pages/RecordDetail/index.tsx` — CSS flex/grid tree layout (no external graph library) showing source system nodes → source instance nodes → golden record node with directional connecting lines
- [ ] T041 [P] [US3] Implement `src/pages/RecordComparison/index.tsx` — side-by-side Ant Design `<Descriptions>` for two records (`:id1` and `:id2` from URL params looked up in spareParts mock data); matching attribute values highlighted green, diverging values highlighted amber/red; overall confidence score displayed with color band (≥90 green, 60–89 yellow, <60 red); Accept Merge button opens Survivorship Preview panel showing projected merged golden record with field-level source attribution; Reject and Escalate buttons with reason input modal

**Checkpoint**: Entity Browse, Record Detail, and Record Comparison are fully functional with real data filtering, 6 detail tabs, diff modal, and side-by-side comparison.

---

## Phase 6: User Story 4 — Governance Screens (Priority: P2)

**Goal**: Deliver Matching Proposals, DQ Issue Queue, Task Inbox, Draft Staging, and Merge/Split flow as fully interactive governance screens.

**Independent Test**: Navigate to each governance route and verify: 20+ proposals with filter controls in Matching, comparison drawer opens with green/red highlighting, 30+ issues with "Create Task" modal in DQ Issue Queue, 15+ tasks with detail drawer (Change Set + Timeline + action buttons) in Task Inbox, 5 expandable drafts in Draft Staging, and Merge flow modal accessible from Record Detail.

- [ ] T042 [US4] Implement `src/pages/MatchingProposals/index.tsx` — Ant Design `<Table>` with 20+ proposals; columns: ID, Entity Type, Record A, Record B, Confidence Score (color-banded tag), Proposed Action, Source, SLA Days Remaining (red if ≤0), Assigned To, Status; filter controls: confidence range slider, entity type select, proposed action select, source select, SLA status select; all filters applied via `useMemo`; low-confidence rows (<60) visually red with default Reject action
- [ ] T043 [US4] Implement "Accept All Above Threshold" bulk action in `src/pages/MatchingProposals/index.tsx` — Ant Design `<Button>` opens `<Modal>` with confidence threshold `<Slider>` and computed count of proposals meeting threshold; "Confirm" closes modal and shows success message
- [ ] T044 [US4] Implement proposal row click → comparison drawer in `src/pages/MatchingProposals/index.tsx` — Ant Design `<Drawer>` (width 80%) showing side-by-side record attributes with green/amber/red highlighting, confidence score, and Accept Merge (opens Survivorship Preview within same drawer), Reject (reason input), and Escalate action buttons
- [ ] T045 [P] [US4] Implement `src/pages/MergeOperations/index.tsx` — Merge flow as Ant Design `<Modal>` (accessible via "More Actions" → "Merge" on RecordDetail): Step 1 survivor selection (radio selection of surviving record), Step 2 survivorship preview (projected merged golden record with per-field source attribution), Step 3 "Submit for Approval" with success message; Split flow: checkbox selection of contributing instance records, preview of two resulting golden records, "Submit for Approval"
- [ ] T046 [US4] Implement `src/pages/DQIssueQueue/index.tsx` — Ant Design `<Table>` with 30+ issues; columns: ID, Entity Type, Record ID (linked to RecordDetail), DQ Score badge, Severity tag, Rule Failed, Date Detected, Assigned Steward ("Unassigned" + amber indicator if null), SLA Status badge, Status; filter controls: entity type, severity, SLA status, steward, date range pickers; "Create Task" button per row opens `<Modal>` pre-populated with record reference, with assignee select and SLA date picker
- [ ] T047 [US4] Implement `src/pages/TaskInbox/index.tsx` — Ant Design `<Table>` with 15+ tasks; columns: ID, Task Type tag, Entity Type, Related Record (linked), Priority badge, SLA Status, Assigned To, Status; row click opens Ant Design `<Drawer>` showing Change Set before/after `<Table>`, Workflow Timeline as Ant Design `<Timeline>`, and Approve/Reject (mandatory reason input)/Escalate `<Button>` group; in-memory state update on action with success message
- [ ] T048 [US4] Implement `src/pages/DraftStaging/index.tsx` — Ant Design `<Collapse>` grouped by entity type showing 5 drafts; each panel header: Record ID, entity type, created by, created at; expanded panel: Ant Design `<Descriptions>` or `<Table>` showing attribute name, before value, after value side by side; "Submit for Approval" and "Discard" buttons per draft with success/confirm modals

**Checkpoint**: All 4 governance screens are fully functional with working filters, modals, drawers, and in-memory state actions.

---

## Phase 7: User Story 5 — Operations Screens (Priority: P2)

**Goal**: Deliver Bulk Onboarding wizard, Source Systems management, and Interface Monitor as interactive operations screens.

**Independent Test**: Progress through all 4 Bulk Onboarding steps, click SAP ERP source card to open its detail drawer, and verify 8–10 interfaces with status badges in Interface Monitor.

- [x] T049 [US5] Implement `src/pages/BulkOnboarding/index.tsx` — Ant Design `<Steps>` 4-step wizard: Step 1 Upload (Ant Design `<Upload dragger>` with accepted file types, mock file name display on "upload"); Step 2 Column Mapping (table of source columns auto-mapped to MDM attributes with green check / warning icons, manually adjustable selects for unmapped columns); Step 3 Validation Preview (table of 10 mock sample records with projected DQ scores and red-highlighted failing rule cells); Step 4 Execute & Monitor (`<Progress percent={75}>`, stats: Records Processed, Passed, In Exception, Estimated Time Remaining, "Cancel Job" button with confirmation modal); below wizard: job history `<Table>` with past runs
- [x] T050 [US5] Implement `src/pages/SourceSystems/index.tsx` — 4 Ant Design `<Card>` components in a responsive grid (AMOS: green healthy badge, SAP ERP: amber degraded badge, Excel: blue active badge, Vendor Portal: green healthy badge); each card shows name, type, last sync time, record count; clicking a card opens Ant Design `<Drawer>` with masked connection credentials, field mapping summary table (Mapped/Unmapped/Auto-mapped rows), sync history table (last 10 runs: date, status, records processed, records failed), "Test Connection" and "Trigger Sync" buttons with mock loading feedback
- [x] T051 [US5] Implement `src/pages/InterfaceMonitor/index.tsx` — Ant Design `<Table>` with 8–10 InterfaceRecord rows; columns: Name, Direction (Inbound/Outbound tag), Source System, Target System, Schedule, Last Run (datetime), Status badge (Running blue, Success green, Failed red, Scheduled gray), Next Run, Records Last Sync; row click opens `<Drawer>` with run history table, error log textarea (populated for Failed interfaces), and "Trigger Now" button with mock loading state

**Checkpoint**: All 3 operations screens are functional with working wizard steps, source detail drawers, and interface run history drawers.

---

## Phase 8: User Story 6 — Analytics Screens (Priority: P2)

**Goal**: Deliver DQ Overview (6 chart visualizations), Anomaly Overview (expandable anomaly cards), and Profile Inspector (attribute profile cards with distribution charts).

**Independent Test**: Navigate to each analytics route and verify all Recharts charts render with visible scaled data, anomaly detail drawer opens with mini-chart and record links, and changing the Profile Inspector entity type selector updates attribute cards.

- [x] T052 [US6] Implement `src/pages/DQOverview/index.tsx` — 6 visualization sections using Recharts: (1) Overall DQ Score (86.2%) as Recharts `<PieChart>` donut with center label; (2) Entity type bar chart as `<BarChart>` (Spare Parts 87.3%, Vendors 92.1%, Equipment 78.6%); (3) 30-day trend as multi-line `<LineChart>` with legend; (4) DQ dimension breakdown as vertical stacked `<BarChart>` (Completeness, Uniqueness, Validity, Consistency, Timeliness per entity type); (5) Top 10 failing rules as horizontal `<BarChart layout="vertical">`; (6) Source system DQ heatmap as Ant Design `<Table>` with color-coded cells
- [x] T053 [US6] Implement `src/pages/AnomalyOverview/index.tsx` — Ant Design `<List>` or card grid of 8–12 anomalies from mock data; each card shows anomaly ID, type, severity badge (High red, Medium amber, Low green), entity type, detected date, affected record count; clicking a card opens Ant Design `<Drawer>` with: description text, mini Recharts `<BarChart>` with the outlier bar colored red using `<Cell>`, list of first 5 affected record IDs as links to RecordDetail, and Confirm/Dismiss action buttons with in-memory state update
- [x] T054 [US6] Implement `src/pages/ProfileInspector/index.tsx` — entity type `<Select>` at top; 8–10 attribute profile `<Card>` components for Spare Parts (e.g., Part Number, Description, Category, Manufacturer, UoM, Lead Time, Unit Cost, Critical Spare, Status, DQ Score); each card shows: completeness %, distinct value count, null count, top 5 values as horizontal `<BarChart layout="vertical">`, pattern analysis text, and a distribution `<BarChart>` (bin counts); changing entity type selector updates cards to reflect selected entity's attributes

**Checkpoint**: All 3 analytics screens render with correctly scaled Recharts charts and working interactive panels.

---

## Phase 9: User Story 7 — Admin Screens (Priority: P3)

**Goal**: Deliver all 5 admin screens: Entity Model Config (tree + attribute form), Workflow Config (step diagrams), RBAC Console (3 tabs with permission matrix), Audit Log (50+ filterable entries with JSON expansion), and Tenant Settings (configurable sections with save toast).

**Independent Test**: Navigate to each admin route and verify the Entity Model tree renders 3 entity types with expandable attributes, the RBAC permission matrix renders for all 6 roles, and the Audit Log shows 50+ filterable entries.

- [x] T055 [P] [US7] Implement `src/pages/EntityModelConfig/index.tsx` — left panel: Ant Design `<Tree>` of 3 entity types (Spare Part, Vendor, Equipment) with expandable attribute children; clicking an entity node shows right panel with entity metadata `<Descriptions>` and attributes `<Table>` (name, data type, survivorship rule, PII flag, required flag); clicking an attribute row highlights it and shows a detail `<Form>` with all attribute fields appearing editable on click (no actual submission)
- [x] T056 [P] [US7] Implement `src/pages/WorkflowConfig/index.tsx` — 4 workflow template cards (e.g., New Record Approval, Merge Review, Data Correction, Bulk Onboarding Review); clicking a card expands or navigates to a visual horizontal step diagram built with CSS flex (no graph library): each step node shows role badge, SLA hours, and escalation rule in an Ant Design `<Card>`; nodes connected by directional arrows (CSS border + pseudo-elements or SVG line)
- [x] T057 [P] [US7] Implement `src/pages/RBACConsole/index.tsx` — Ant Design `<Tabs>` with 3 tabs: (1) Users: `<Table>` of 5 mock users (name, email, role badge, entity permissions, status, last login); (2) Roles: 6 role `<Card>` components (Platform Admin, Senior Steward, Data Steward, Approver, Viewer, + 1 custom) each showing role name and permission summary; (3) Permissions Matrix: full role-vs-feature `<Table>` where rows are features (Entity Browse, Record Edit, Match Approve, etc.) and columns are the 6 roles with checkbox-style `<Tag>` indicators (read, write, approve, admin)
- [x] T058 [P] [US7] Implement `src/pages/AuditLog/index.tsx` — Ant Design `<Table>` with 50+ entries from auditLog mock data; columns: Timestamp (formatted), User, Action tag, Entity Type, Record ID (linked to RecordDetail), Details; filter controls: date range picker, user select, action type select, entity type select, record ID search input; all filters via `useMemo`; row expandable to show `changePayload` before/after as formatted JSON `<pre>` block
- [x] T059 [P] [US7] Implement `src/pages/TenantSettings/index.tsx` — Ant Design `<Form>` with 5 sections in a `<Collapse>` or tabbed layout: (1) General: tenant name, timezone, locale; (2) Data Quality: DQ score thresholds for green/yellow/red with `<Slider>`; (3) Matching: auto-approve confidence threshold `<Slider>`, auto-reject threshold `<Slider>`; (4) Notifications: toggle switches for email/in-app notification types; (5) API Key Management: masked API key display with "Regenerate" button; single "Save Changes" `<Button>` triggers Ant Design `message.success('Settings saved')` toast

**Checkpoint**: All 5 admin screens render with full mock data, attribute forms, permission matrices, filterable audit log, and working save toast.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Verify end-to-end prototype quality, empty states, and build integrity.

- [x] T060 [P] Verify all sidebar navigation links resolve to their correct routes, active item is highlighted, and breadcrumbs update on every navigation — fix any route mismatches in `src/routes.tsx` or `src/components/Sidebar.tsx`
- [x] T061 [P] Verify `<DQBadge>` and `getDQBadgeColor` are used consistently on every screen that shows DQ scores (EntityBrowse, RecordDetail, MatchingProposals, DQIssueQueue, DashboardDQPanels, ProfileInspector) — no hardcoded colors
- [x] T062 [P] Verify all filter interactions on EntityBrowse, MatchingProposals, DQIssueQueue, and AuditLog use `useMemo` with actual mock data field values — no static display-only filtering
- [ ] T063 [P] Add or verify `<EmptyState>` renders on EntityBrowse (no search matches), DQIssueQueue (no filter matches), TaskInbox (no tasks), MatchingProposals (no proposals), AuditLog (no log entries), and RecordDetail Source Instances (no sources) — each with a relevant primary action button
- [x] T064 Run `npm run build` and resolve all TypeScript compilation errors and Vite build failures until the build succeeds with zero errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 Shell (Phase 3)**: Depends on Foundational — required before any screen is demonstrable
- **US2 Dashboard (Phase 4)**: Depends on US1 shell being complete
- **US3 Entity Browse & Record Detail (Phase 5)**: Depends on US1; independently testable
- **US4 Governance (Phase 6)**: Depends on US1 and US3 (links to RecordDetail); independently testable
- **US5 Operations (Phase 7)**: Depends on US1; independently testable
- **US6 Analytics (Phase 8)**: Depends on US1; independently testable
- **US7 Admin (Phase 9)**: Depends on US1; independently testable
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)** → Blocks all other user stories (shell must exist)
- **US2 (P1)** → Can start after US1; no dependency on US3–US7
- **US3 (P1)** → Can start after US1; links to RecordDetail are used by US4
- **US4 (P2)** → Can start after US1 + US3 (comparison/detail links)
- **US5 (P2)** → Can start after US1; no dependency on US2–US4
- **US6 (P2)** → Can start after US1; no dependency on US2–US5
- **US7 (P3)** → Can start after US1; links to RecordDetail require US3

### Parallel Opportunities Within Each Story

- All `[P]`-marked tasks within the same phase can run concurrently
- Mock data files (T009–T013) are all independent and can run in parallel
- US7 admin screens (T055–T059) are all independent pages and can run in parallel
- US5 and US6 phases can be worked in parallel with US4 (different files)

---

## Parallel Example: Foundational Phase (Phase 2)

```
# Launch all data generation tasks simultaneously:
Task T009: spareParts.ts (50+ records)
Task T010: vendors.ts + equipment.ts
Task T011: matchingProposals.ts + dqIssues.ts
Task T012: tasks.ts + drafts.ts
Task T013: auditLog.ts + anomalies.ts + notifications.ts + users.ts + sourceSystems.ts

# Launch utilities + hooks simultaneously:
Task T005: src/utils/dqBadge.ts
Task T006: src/utils/formatDate.ts
Task T007: src/hooks/useFilters.ts
Task T008: src/hooks/usePagination.ts
```

## Parallel Example: US7 Admin Screens (Phase 9)

```
# All 5 admin screen pages are independent files:
Task T055: src/pages/EntityModelConfig/index.tsx
Task T056: src/pages/WorkflowConfig/index.tsx
Task T057: src/pages/RBACConsole/index.tsx
Task T058: src/pages/AuditLog/index.tsx
Task T059: src/pages/TenantSettings/index.tsx
```

---

## Implementation Strategy

### MVP First (User Stories 1–3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — CRITICAL, blocks all stories
3. Complete Phase 3: US1 — Shell and navigation (all routes navigable)
4. Complete Phase 4: US2 — Dashboard (first screen stakeholders see)
5. Complete Phase 5: US3 — Entity Browse + Record Detail (core data screens)
6. **STOP and VALIDATE**: Full stakeholder demo journey is possible through Dashboard → Entity Browse → Record Detail
7. Demo if ready

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. US1 → shell + routing → **all 20 routes navigable (stub screens)**
3. US2 → Dashboard → **platform health visible**
4. US3 → Entity Browse + Record Detail → **core data browsing**
5. US4 → Governance screens → **match/review/approve workflows**
6. US5 → Operations screens → **data onboarding flows**
7. US6 → Analytics screens → **DQ intelligence layer**
8. US7 → Admin screens → **configurability story**
9. Polish → build validation

### Parallel Team Strategy (if multiple developers)

After Phase 2 (Foundational) is complete and Phase 3 (US1 shell) is complete:
- Dev A: US2 Dashboard + US3 Entity Browse
- Dev B: US4 Governance screens
- Dev C: US5 Operations + US6 Analytics
- Dev D: US7 Admin screens

All can proceed in parallel without file conflicts.

---

## Notes

- `[P]` tasks = different files, no dependencies on incomplete tasks within the same phase
- `[US#]` label maps each task to its user story for traceability
- No tests are included — prototype only per spec
- All state transitions (Approve, Reject, Merge, etc.) are in-memory only — no persistence across reloads
- All action buttons produce mock feedback (Ant Design `message.success()` / `notification.success()`) without persisting data
- Commit after each phase checkpoint to preserve working state
- Stop at any checkpoint to demo the prototype independently
