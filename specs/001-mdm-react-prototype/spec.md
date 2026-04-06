# Feature Specification: Sazience MDM React Prototype — Full Build

**Feature Branch**: `001-mdm-react-prototype`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "sazience-mdm-prototype-prompt.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Application Shell & Navigation Foundation (Priority: P1)

A stakeholder opens the prototype and sees a professional enterprise application with a persistent top header bar (Sazience MDM logo, tenant name "Carnival Cruise Lines", logged-in user "Ahmed Al-Rashid — Admin", notification bell with badge, and global search input) and a collapsible left sidebar with grouped navigation items. Clicking any sidebar link navigates to the correct screen and updates the breadcrumb bar beneath the header. All 20 screens are reachable without broken routes.

**Why this priority**: Without a working shell and navigation, no individual screen can be meaningfully demonstrated to stakeholders. This is the skeleton that makes every other screen accessible.

**Independent Test**: Can be fully tested by launching the prototype and verifying that every sidebar link navigates to its target route without error, that breadcrumbs update accordingly, and that the header persists across all routes.

**Acceptance Scenarios**:

1. **Given** the prototype is loaded, **When** the stakeholder clicks any sidebar item, **Then** the content area renders the corresponding screen and the breadcrumb bar shows the correct navigation path.
2. **Given** the sidebar is expanded, **When** the collapse toggle is clicked, **Then** the sidebar collapses to icon-only view while navigation remains fully functional.
3. **Given** any screen is open, **When** the notification bell is clicked, **Then** a dropdown panel shows the 10 most recent mock notifications with timestamps and type icons.
4. **Given** any screen is open, **When** the global search input is focused (or ⌘K is pressed), **Then** a search dropdown appears showing results across Records, Tasks, and Users from mock data.

---

### User Story 2 - Dashboard & Home Screen (Priority: P1)

A Platform Admin opens the Dashboard and immediately sees the health of the entire MDM platform: task summary stat cards (Pending My Action: 12, Approaching SLA: 3, Past SLA: 1, Total Open: 47), DQ score panels per entity type with sparkline trends, record volume statistics, source system health table, anomaly alert summary, and a scrollable recent activity feed with 15–20 events. Every stat card and alert is clickable and navigates to the relevant screen with the appropriate filter pre-applied.

**Why this priority**: The Dashboard is the first screen stakeholders see and must immediately convey platform value. It is a self-contained proof-of-concept for the entire MDM domain.

**Independent Test**: Can be fully tested by navigating to `/dashboard` and verifying all 6 widget sections render with the specified mock values, that clicking the "Pending My Action" card opens Task Inbox filtered to those tasks, and that the anomaly summary card links to the Anomaly Overview.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** a stakeholder views the My Tasks Summary section, **Then** four stat cards display the correct mock counts (12, 3, 1, 47) with appropriate color coding (amber for Approaching SLA, red for Past SLA).
2. **Given** the dashboard is loaded, **When** the stakeholder views the DQ Score Panels, **Then** each entity type shows its score (Spare Part 87.3%, Vendor 92.1%, Equipment 78.6%) with trend arrows and a 7-point sparkline chart.
3. **Given** the dashboard is loaded, **When** the stakeholder clicks a task summary stat card, **Then** the Task Inbox opens with the matching filter pre-applied.
4. **Given** the dashboard is loaded, **When** the stakeholder views the Source System Health table, **Then** AMOS shows green, SAP ERP shows amber, and all four sources are listed with last sync time and record count.

---

### User Story 3 - Entity Browse & Record Detail (Priority: P1)

A Data Steward navigates to Entity Browse, selects "Spare Parts" and sees a paginated data grid of 50+ records with DQ badges (green/yellow/red), sortable columns, full-text search, and an advanced filter panel. Applying a filter by Category or DQ Score range actually filters the displayed data. The steward clicks a row and arrives at the Record Detail View showing the golden record's attributes with source attribution, a Source Instances panel, Related Records, DQ Validation breakdown, Version History (5–8 versions), and a Lineage Graph tab. Clicking back returns to the browse list.

**Why this priority**: Entity Browse and Record Detail are the two most-used screens in a live MDM platform. Demonstrating credible data depth here is essential to stakeholder confidence.

**Independent Test**: Can be tested by navigating to `/entities/spare-parts`, confirming 50+ records load with DQ badges, applying a filter, confirming the displayed records change, clicking any row, and verifying all 6 tabs on the detail screen render with mock content.

**Acceptance Scenarios**:

1. **Given** the Entity Browse screen is open for Spare Parts, **When** the stakeholder types in the search bar, **Then** the grid filters to show only records whose Part Number or Description matches the search term.
2. **Given** the Advanced Filter panel is open, **When** the stakeholder sets the DQ Score range slider to 60–84, **Then** only records with a DQ score in that range are displayed.
3. **Given** a record row is clicked, **When** the Record Detail screen loads, **Then** the header shows the Part Number, Description, Status badge, DQ Score badge, and workflow state.
4. **Given** the Record Detail screen is open, **When** the stakeholder hovers over an attribute's source attribution icon, **Then** a tooltip shows the source system name and the survivorship rule applied.
5. **Given** the Version History tab is active, **When** the stakeholder clicks a historical version row, **Then** a modal opens showing a before/after diff for each changed attribute in that version.

---

### User Story 4 - Governance Screens: Matching, DQ Issues, Tasks, Drafts (Priority: P2)

A Senior Steward works through the governance queue: viewing Matching Proposals (20+ proposals with confidence scores and SLA countdown), accepting or rejecting a match after reviewing the side-by-side Record Comparison with survivorship preview, resolving DQ Issues (30+ issues) by creating correction tasks, managing the Task Inbox (15+ tasks) with approve/reject/escalate actions, and reviewing Draft Staging (5 staged changes) before submitting for approval. All modals open, display data, and close correctly.

**Why this priority**: Governance workflows are the core differentiator of an MDM platform. Demonstrating end-to-end governance flows is critical for enterprise buyers.

**Independent Test**: Can be tested by navigating to each governance route and verifying: 20+ proposals load in Matching, the comparison drawer opens from a proposal row, 30+ issues load in DQ Issue Queue, 15+ tasks load in Task Inbox, and 5 drafts display in Draft Staging with expandable change details.

**Acceptance Scenarios**:

1. **Given** the Matching Proposals screen is open, **When** the stakeholder filters by confidence score above 85, **Then** only proposals meeting that threshold are displayed.
2. **Given** a matching proposal row is clicked, **When** the Record Comparison view opens, **Then** matching attribute values are highlighted green and diverging values are highlighted amber/red, with an overall confidence score prominently displayed.
3. **Given** the Record Comparison is open, **When** the stakeholder clicks "Accept Merge", **Then** a Survivorship Preview panel appears showing the projected merged golden record with field-level source attribution.
4. **Given** the DQ Issue Queue is open, **When** the stakeholder clicks "Create Task" on an issue row, **Then** a modal opens pre-populated with the issue's record reference and allows setting assignee and SLA.
5. **Given** the Task Inbox is open and a task row is clicked, **When** the task detail drawer opens, **Then** it shows the Change Set (before/after table), a workflow timeline, and Approve/Reject/Escalate action buttons.
6. **Given** the Draft Staging area is open, **When** the stakeholder expands a draft, **Then** the before and after values for each changed attribute are displayed side by side.

---

### User Story 5 - Operations Screens: Bulk Onboarding, Source Systems, Interface Monitor (Priority: P2)

An Operations user uploads a mock file through the 4-step Bulk Onboarding wizard (Upload → Column Mapping → Validation Preview → Execute & Monitor), seeing auto-mapped columns, DQ validation results for 10 sample records, and a progress bar at ~75% complete. They then review Source System cards (AMOS, SAP ERP, Excel, Vendor Portal) with health indicators, open a source's detail drawer to see sync history and field mappings, and view the Interface Monitor table showing 8–10 interfaces with their current status badges.

**Why this priority**: Operations screens demonstrate the data ingestion and integration capabilities that enterprise buyers need to see before committing to a platform.

**Independent Test**: Can be tested by navigating to `/operations/bulk-onboarding` and progressing through all 4 wizard steps, then visiting `/operations/sources` and clicking a source card to open its detail drawer.

**Acceptance Scenarios**:

1. **Given** the Bulk Onboarding wizard is on Step 2 (Column Mapping), **When** the stakeholder views the mapping table, **Then** auto-mapped columns show a green check and unmapped columns show a warning indicator.
2. **Given** Step 3 (Validation Preview) is active, **When** the stakeholder views the preview, **Then** 10 sample records are shown with their projected DQ scores and failing rule highlights.
3. **Given** Step 4 (Execute & Monitor) is active, **When** the stakeholder views the progress panel, **Then** a progress bar at approximately 75% is displayed with stats for Records Processed, Passed, In Exception, and Estimated Time Remaining.
4. **Given** the Source Systems screen is loaded, **When** the stakeholder clicks the SAP ERP card, **Then** a detail drawer opens showing masked connection credentials, field mapping summary, sync history for the last 10 syncs, and "Test Connection" / "Trigger Sync" buttons.
5. **Given** the Interface Monitor screen is loaded, **When** the stakeholder views the interfaces table, **Then** 8–10 interfaces are listed with accurate status badges (Running, Success, Failed, or Scheduled).

---

### User Story 6 - Analytics Screens: DQ Overview, Anomaly Overview, Profile Inspector (Priority: P2)

A Data Quality Analyst reviews the Analytics section: the DQ Overview shows an overall score of 86.2% with entity-type bar charts, a 30-day trend line chart, a DQ dimension radar/stacked bar chart, a top-10 failing rules horizontal bar chart, and a source-system DQ heatmap. The Anomaly Overview lists 8–12 detected anomalies with severity badges; clicking one expands a detail panel with a visualization chart and affected record links. The Profile Inspector shows completeness, distinct values, top values, and distribution charts for 8–10 Spare Part attributes.

**Why this priority**: Analytics screens demonstrate the platform's intelligence layer, which is a key differentiator in enterprise MDM sales conversations.

**Independent Test**: Can be tested by navigating to each analytics route and verifying charts render with mock data, anomaly cards expand with detail content, and the Profile Inspector's entity type selector switches the displayed attribute cards.

**Acceptance Scenarios**:

1. **Given** the DQ Overview screen is loaded, **When** the stakeholder views the page, **Then** all 6 visualization sections render (overall score, entity bar chart, trend line, dimension breakdown, top failing rules, source heatmap) with the specified mock values.
2. **Given** the Anomaly Overview is loaded and an anomaly card is clicked, **When** the detail drawer opens, **Then** it shows a description of the anomaly, a mini chart highlighting the outlier, the first 5 affected records with clickable links, and Confirm/Dismiss action buttons.
3. **Given** the Profile Inspector is open, **When** the entity type selector is changed, **Then** the attribute profile cards update to reflect the selected entity type's attributes.

---

### User Story 7 - Admin Screens: Entity Model, Workflow Config, RBAC, Audit Log, Tenant Settings (Priority: P3)

A Platform Admin configures and audits the platform: viewing and inline-editing entity attribute definitions in the Entity Model Config tree, reviewing 4 workflow templates with visual step diagrams in Workflow Config, managing 5 users and 6 role permission matrices in the RBAC Console, searching and filtering 50+ audit log entries with expandable JSON payloads in the Audit Log, and updating platform settings (DQ thresholds, matching confidence sliders, notification toggles, API keys) in Tenant Settings with a success toast on save.

**Why this priority**: Admin screens complete the platform story for enterprise buyers who need to see configurability and governance controls, but are secondary to core data and governance screens.

**Independent Test**: Can be tested by navigating to each admin route, verifying the Entity Model tree renders three entity types with expandable attributes, the RBAC permission matrix renders for all 6 roles, and the Audit Log shows 50+ filterable entries.

**Acceptance Scenarios**:

1. **Given** the Entity Model Config is open and an attribute is clicked, **When** the right panel shows the attribute detail form, **Then** all form fields (Name, Data Type, Survivorship Rule, PII flag, etc.) are displayed and appear editable on click.
2. **Given** the Workflow Config is open and a workflow template is clicked, **When** the visual step diagram renders, **Then** each step node shows the assigned role, SLA hours, and escalation rule, connected by directional arrows.
3. **Given** the RBAC Console is on the Roles tab and a role card is clicked, **When** the permission matrix renders, **Then** rows represent features and columns represent CRUD/action permissions with checkbox indicators.
4. **Given** the Audit Log is loaded, **When** the stakeholder filters by a specific Action type and date range, **Then** only matching log entries are displayed.
5. **Given** the Tenant Settings screen is open, **When** the stakeholder adjusts the Auto-approve confidence threshold slider and clicks "Save Changes", **Then** a success toast notification appears.

---

### Edge Cases

- What happens when a search query matches no records in Entity Browse? A clean empty state with an illustration, message, and "Clear Filters" primary action button is displayed.
- What happens when a matching proposal's confidence score is below the auto-reject threshold? The row is visually marked in red and the default action shown is "Reject".
- How does the system handle a DQ Issue with no assigned steward? The Assigned Steward cell shows "Unassigned" with an amber indicator.
- What happens when the Bulk Onboarding wizard is at Step 4 and "Cancel Job" is clicked? A confirmation modal appears before the mock job is canceled.
- How does the screen handle a record with 0 source instances? The Source Instances panel shows an empty state message explaining no sources are contributing.
- What happens when the stakeholder navigates to a non-existent route? A 404 / "Page Not Found" screen is displayed with a link back to the Dashboard.

## Requirements *(mandatory)*

### Functional Requirements

**Application Shell**

- **FR-001**: The application MUST display a persistent top header bar on every screen containing the Sazience MDM logo, tenant name ("Carnival Cruise Lines"), logged-in user name and role ("Ahmed Al-Rashid — Admin"), a notification bell with a badge count, and a global search input.
- **FR-002**: The application MUST display a collapsible left sidebar navigation with 6 grouped sections (Home, Data, Governance, Operations, Analytics, Admin) and all listed menu items.
- **FR-003**: The application MUST display a breadcrumb bar below the header that updates to reflect the current route on every navigation.
- **FR-004**: The notification bell MUST open a dropdown panel showing the 10 most recent mock notifications with type icons and relative timestamps.
- **FR-005**: The global search input MUST display a results dropdown with results across Records, Tasks, and Users drawn from mock data.
- **FR-006**: Every screen MUST have a meaningful empty state (illustration, message, primary action button) for scenarios where no data matches the current filter state.

**Dashboard**

- **FR-007**: The Dashboard MUST render all 6 widget sections (Task Summary stat cards, DQ Score Panels with sparklines, Record Volume stats, Source System Health table, Anomaly Alert Summary, Recent Activity feed) with the specified mock values and clickable navigations.

**Entity Browse & Record Detail**

- **FR-008**: The Entity Browse screen MUST support tab switching between Spare Parts, Vendors, and Equipment, updating grid columns and data accordingly.
- **FR-009**: The Entity Browse search bar MUST filter the displayed mock records in real time based on Part Number and Description (or equivalent primary fields for other entity types).
- **FR-010**: The Advanced Filter panel on Entity Browse MUST filter data by Category, Manufacturer, Status, DQ Score range, Source System, Last Modified date range, and Assigned Steward.
- **FR-011**: The Entity Browse grid MUST be paginated at 25 records per page, support sortable columns, checkbox row selection, and display a computed DQ badge (green ≥85, yellow 60–84, red <60) per row.
- **FR-012**: The Record Detail view MUST display 6 tabs: Golden Record Attributes (with source attribution tooltips and override indicators), Source Instances, Related Records, DQ Validation (dimension breakdown + failing rules), Version History (5–8 versions with diff modal), and Lineage Graph.

**Governance**

- **FR-013**: The Record Comparison view MUST highlight matching attribute values in green and diverging values in amber/red, display an overall confidence score with color banding (green ≥90, yellow 60–89, red <60), and provide Accept Merge, Reject, and Escalate action buttons.
- **FR-014**: The Matching Proposals queue MUST be populated with 20+ proposals and support filtering by confidence score, entity type, proposal type (Merge/Split), source (Rule/AI), and SLA status.
- **FR-015**: The Matching Proposals queue MUST include a "Accept All Above Threshold" bulk action that opens a modal with a threshold slider and count of affected proposals.
- **FR-016**: The DQ Issue Queue MUST be populated with 30+ issues and support a "Create Task" modal pre-populated with the issue's record reference.
- **FR-017**: The Task Inbox MUST be populated with 15+ tasks and support a task detail drawer showing the Change Set, Workflow Timeline, and Approve/Reject/Escalate action buttons.
- **FR-018**: The Draft Staging Area MUST display 5 mock drafts grouped by entity type, expandable to show attribute-level before/after changes.

**Operations**

- **FR-019**: The Bulk Onboarding wizard MUST implement all 4 steps (Upload with drag-and-drop area, Column Mapping with auto-map indicators, Validation Preview with 10 sample records, Execute & Monitor with ~75% progress bar) and display a job history table.
- **FR-020**: The Source Systems screen MUST show 4 source cards with health indicators, and clicking a card MUST open a detail drawer with sync history, field mapping summary, masked credentials, "Test Connection", and "Trigger Sync" buttons.
- **FR-021**: The Interface Monitor MUST list 8–10 interfaces with status badges (Running, Success, Failed, Scheduled), and clicking a row MUST open a drawer with run history, error logs, and a manual trigger button.

**Analytics**

- **FR-022**: The DQ Overview screen MUST render 6 visualization sections: overall score gauge/donut, entity-type bar chart, 30-day trend line chart, DQ dimension breakdown, top-10 failing rules horizontal bar chart, and source-system DQ heatmap table.
- **FR-023**: The Anomaly Overview MUST list 8–12 anomalies with severity badges, and clicking one MUST expand a detail panel with a description, mini visualization chart, affected records list, and Confirm/Dismiss actions.
- **FR-024**: The Profile Inspector MUST display attribute profile cards for 8–10 Spare Part attributes, each showing completeness percentage, distinct value count, top 5 values, null count, pattern analysis, and a distribution chart.

**Admin**

- **FR-025**: The Entity Model Config MUST display a tree of 3 entity types with expandable attributes; clicking an entity shows its metadata and attributes table; clicking an attribute shows its editable detail form.
- **FR-026**: The Workflow Config MUST display 4 workflow templates; clicking a template shows a visual horizontal step diagram with per-step role, SLA, and escalation details.
- **FR-027**: The RBAC Console MUST display 3 tabs: Users (5 mock users), Roles (6 role cards with permission matrix), and Permissions Matrix (full role-vs-permission grid).
- **FR-028**: The Audit Log MUST be populated with 50+ entries, support filtering by date range, user, action type, and entity type, and support row expansion to show the full change payload.
- **FR-029**: The Tenant Settings screen MUST display sections for General, Data Quality, Matching, Notifications, and API Key Management, with a "Save Changes" button that triggers a success toast.

**Merge & Split**

- **FR-030**: The Merge flow MUST be accessible from Record Detail ("More Actions" → Merge) and from Matching Proposals, implementing survivor selection, survivorship preview, and "Submit for Approval" action.
- **FR-031**: The Split flow MUST be accessible from a merged golden record's detail page, showing instance records with checkboxes, a preview of the two resulting golden records, and "Submit for Approval".

**Data**

- **FR-032**: The mock data set MUST include a minimum of 50 Spare Part records, 20 Vendors, 20 Equipment records, 20+ Matching Proposals, 30+ DQ Issues, 15+ Tasks, 5 Drafts, and 50+ Audit Log entries with varied, realistic values.
- **FR-033**: DQ Score badges MUST be computed dynamically from the mock data score field, not hardcoded by row position.
- **FR-034**: All filter interactions MUST compare against actual mock data field values, not simulate filtering with static display changes.

### Key Entities

- **Spare Part**: Primary master data entity identified by Part Number (SP-XXXXXX). Key attributes: Description, Category, Manufacturer, Unit of Measure, Lead Time (days), Unit Cost (USD), Critical Spare flag, Status (Active/Obsolete/Pending Review), and DQ Score.
- **Vendor**: Supplier entity identified by Vendor Code (V-XXXX). Key attributes: Company Name, Country, Contact Email, Payment Terms, Certification, Status (Approved/Under Review/Suspended), and DQ Score.
- **Equipment**: Physical asset entity identified by Equipment ID (EQ-XXXX). Key attributes: Name, Vessel, Deck/Location, Manufacturer, Install Date, and Status (Operational/Under Maintenance/Decommissioned).
- **Golden Record**: The authoritative, approved version of any entity, assembled from one or more Source Instances via survivorship rules.
- **Source Instance**: A raw record from a source system (AMOS, SAP ERP, Excel Uploads, Vendor Portal API) contributing to a Golden Record.
- **Match Proposal**: A system-generated suggestion that two records may be duplicates. Has Confidence Score, Proposed Action (Merge/Split), Source (Rule/AI), SLA deadline, and Assigned Steward.
- **DQ Issue**: A data quality rule failure on a record. Has Severity (Error/Warning), Rule name, Detection date, Assigned Steward, and SLA status indicator.
- **Task**: A workflow work item with Task Type (Approval/Correction/Merge Review/Escalation), Related Record, SLA Status, Priority, and Assigned User.
- **Draft**: A staged set of attribute changes on a Golden Record not yet submitted for approval.
- **Audit Log Entry**: An immutable record of a user action. Has Timestamp, User, Action type, Entity Type, Record ID, and before/after change payload.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 20 screens render without runtime errors and display meaningful mock data on first visit, with no placeholder text or empty tables.
- **SC-002**: Every sidebar navigation link reaches its target screen in under 1 second of user interaction.
- **SC-003**: All filter interactions on Entity Browse, DQ Issue Queue, Matching Proposals, and Audit Log visibly update the displayed data within 500ms.
- **SC-004**: All 20+ modals and drawers (task detail, comparison view, source detail, create task, version diff, etc.) open and close without errors.
- **SC-005**: A stakeholder can complete a full end-to-end governance demonstration journey — Dashboard → Matching Proposals → Record Comparison → Accept Merge → Task Inbox → Approve Task — without encountering a broken link, empty screen, or unhandled error.
- **SC-006**: The prototype is fully functional in a modern browser at 1280px minimum viewport width without horizontal overflow or broken layouts.
- **SC-007**: All chart and graph visualizations (Dashboard sparklines, DQ Overview charts, Anomaly mini-charts, Profile Inspector distributions) render with visible, correctly scaled data.
- **SC-008**: Breadcrumb navigation correctly reflects the current route on 100% of navigations.

## Assumptions

- The prototype runs exclusively in a modern desktop browser (Chrome/Edge) at minimum 1280px viewport width; mobile or tablet responsiveness is out of scope.
- No authentication is implemented; the user is always treated as Ahmed Al-Rashid (Platform Admin) with full access to all screens and actions.
- No backend, API, or database exists; all data is client-side mock data defined in TypeScript files within the `src/data/` directory.
- All form submissions and action buttons (Approve, Reject, Trigger Sync, Save Changes, etc.) produce mock feedback (success toast, in-memory state update) without persisting changes across page reloads.
- The Lineage Graph visualization does not require a full graph library — a structured SVG or CSS flex/grid layout representing a source-instance-to-golden-record tree is acceptable.
- The prototype uses React 19, TypeScript, Vite, Tailwind CSS v4, Ant Design 5, React Router v6, and Recharts as specified in the project stack.
- The application shell (header, sidebar, breadcrumb bar) is implemented as a single shared layout component wrapping all routes, not duplicated per screen.
- All screens must have a working empty state even if the primary mock data set is always populated, to demonstrate the UI pattern during stakeholder presentations.
- The Merge & Split screen (Screen 20) is a flow accessed from existing screens rather than a standalone route with its own sidebar entry.
