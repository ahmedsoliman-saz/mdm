# Sazience MDM — React Prototype Build Prompt

## System Instructions

You are a Senior Frontend Engineer building a **fully interactive React prototype** for **Sazience MDM**, an enterprise Master Data Management platform. This is a **clickable prototype with realistic mock data** — not a production app. The goal is to demonstrate every screen, every interaction, and every data flow to stakeholders, investors, and prospective clients.

### Tech Stack

- **React 18** with **TypeScript**
- **Ant Design 5** as the component library (enterprise data grids, forms, modals, layouts)
- **React Router v6** for page navigation
- **Recharts** for dashboard charts and data visualizations
- All data is **hardcoded mock data** — no backend, no API calls
- Single-page application with a persistent sidebar navigation
- **Light theme only** — clean, modern, professional enterprise aesthetic

### Design Principles

- **Light theme**: white/light gray backgrounds, subtle borders, professional color palette
- Primary color: `#1677ff` (Ant Design default blue)
- Success: `#52c41a`, Warning: `#faad14`, Error: `#ff4d4f`
- Typography: clean, readable, generous whitespace
- Cards with subtle shadows, not flat boxes
- Data-dense screens should feel organized, not cluttered
- No dark mode. No gradients. No rounded-everything. This is **enterprise software**, not a consumer app.
- Responsive down to 1280px width minimum

### Application Shell

The app has a persistent layout:

1. **Top Header Bar**: Sazience MDM logo (text logo is fine), current tenant name ("Carnival Cruise Lines"), logged-in user avatar + name ("Ahmed Al-Rashid — Admin"), notification bell with badge count, and a global search input
2. **Left Sidebar Navigation**: collapsible, with grouped menu items:
   - **Home**: Dashboard
   - **Data**: Entity Browse, Record Search
   - **Governance**: Task Inbox, Matching Proposals, DQ Issue Queue, Draft Staging
   - **Operations**: Bulk Onboarding, Source Systems, Interface Monitor
   - **Analytics**: Data Quality Overview, Anomaly Overview, Profile Inspector
   - **Admin**: Entity Model Config, Workflow Config, RBAC Console, Audit Log, Tenant Settings
3. **Content Area**: renders the active screen
4. **Breadcrumb Bar**: below header, shows navigation path

---

## Mock Data Domain

Use a **Spare Parts / MRO (Maintenance, Repair, Overhaul)** domain for all mock data. This is the first client vertical.

### Entity Types

Define these entity types with realistic attributes:

#### 1. Spare Part
| Attribute | Example Values |
|-----------|---------------|
| Part Number | `SP-001234`, `SP-005678` |
| Description | "Hydraulic Pump Assembly", "Main Engine Bearing Seal" |
| Category | Mechanical, Electrical, HVAC, Safety, Hull |
| Manufacturer | "Wärtsilä", "ABB Marine", "Alfa Laval", "MAN Energy" |
| Unit of Measure | Each, Set, Meter, Liter, Kilogram |
| Lead Time (days) | 14, 30, 60, 90 |
| Unit Cost (USD) | 45.00, 1250.00, 18500.00 |
| Critical Spare | Yes / No |
| Status | Active, Obsolete, Pending Review |
| Last Updated | ISO dates |
| DQ Score | 0–100 |

#### 2. Vendor
| Attribute | Example Values |
|-----------|---------------|
| Vendor Code | `V-1001`, `V-1042` |
| Company Name | "Wärtsilä Corporation", "ABB Marine & Ports" |
| Country | Finland, Switzerland, Denmark, Germany, Japan |
| Contact Email | realistic emails |
| Payment Terms | Net 30, Net 60, Net 90 |
| Certification | ISO 9001, DNV-GL, Lloyd's Register |
| Status | Approved, Under Review, Suspended |
| DQ Score | 0–100 |

#### 3. Equipment (Component)
| Attribute | Example Values |
|-----------|---------------|
| Equipment ID | `EQ-A001`, `EQ-B042` |
| Name | "Main Engine Unit #1", "Bow Thruster Assembly" |
| Vessel | "Carnival Horizon", "Carnival Celebration" |
| Deck / Location | "Engine Room — Deck 0", "Bridge — Deck 14" |
| Manufacturer | Same vendor names |
| Install Date | ISO dates |
| Status | Operational, Under Maintenance, Decommissioned |

### Source Systems

| Source | Type | Status |
|--------|------|--------|
| AMOS (Fleet Management) | PostgreSQL | Connected — Healthy |
| SAP ERP | API | Connected — Degraded |
| Excel Uploads (Manual) | File | Active |
| Vendor Portal API | REST API | Connected — Healthy |

### Users & Roles

| Name | Role | Entity Permissions |
|------|------|--------------------|
| Ahmed Al-Rashid | Platform Admin | All |
| Sarah Chen | Senior Steward | Spare Part, Equipment |
| James O'Connor | Data Steward | Spare Part |
| Maria Santos | Approver | All |
| Raj Patel | Viewer | Spare Part, Vendor |

---

## Screens to Build

Build **every screen** listed below. Each screen must be fully interactive with mock data — clickable rows, working filters, functional modals, expandable panels.

---

### Screen 1: Dashboard & Home

**Route**: `/dashboard`

**Layout**: Grid of cards and widgets

**Widgets to include**:

1. **My Tasks Summary** — 4 stat cards in a row:
   - Pending My Action: `12`
   - Approaching SLA: `3` (amber)
   - Past SLA: `1` (red)
   - Total Open (All): `47`
   - Each card is clickable (navigates to Task Inbox with filter)

2. **Data Quality Score Panels** — One card per entity type:
   - Spare Part: `87.3%` with green up-arrow (improving)
   - Vendor: `92.1%` with gray dash (stable)
   - Equipment: `78.6%` with red down-arrow (declining)
   - Each shows a small sparkline trend chart (last 7 runs)

3. **Record Volume Statistics** — Bar chart or stat cards:
   - Spare Parts: `24,381` golden records (+342 this month)
   - Vendors: `1,247` golden records (+18 this month)
   - Equipment: `8,932` golden records (+127 this month)

4. **Source System Health** — Table showing each source, last sync time, record count, status badge (green/amber/red)

5. **Anomaly Alert Summary** — Single card:
   - Unresolved anomalies: `8`
   - Breakdown: Spare Part (5), Vendor (1), Equipment (2)
   - Clickable link to Anomaly Overview

6. **Recent Activity Feed** — Scrollable list of 15–20 events:
   - "Golden record SP-001234 approved by Maria Santos — 12 min ago"
   - "Bulk load job #BL-0089 completed — 847 records processed — 1 hr ago"
   - "Match proposal #MP-0234 escalated by James O'Connor — 2 hrs ago"
   - "DQ anomaly detected: 14 Spare Parts missing manufacturer — 3 hrs ago"
   - Mix of types with appropriate icons and timestamps

---

### Screen 2: Entity Browse & Search

**Route**: `/entities/:entityType` (default: `/entities/spare-parts`)

**Layout**: Full-width data grid with toolbar

**Features**:

1. **Entity Type Tabs** at the top: Spare Parts | Vendors | Equipment — switching tabs changes the grid columns and data
2. **Search Bar**: full-text search input at the top
3. **Advanced Filter Panel** (collapsible sidebar or drawer):
   - Filter by: Category, Manufacturer, Status, DQ Score range (slider), Source System, Last Modified date range, Assigned Steward
4. **Data Grid** (Ant Design Table):
   - Columns vary by entity type (see mock data above)
   - Each row has a **DQ Badge**: green circle (≥85), yellow (60–84), red (<60)
   - Sortable columns
   - Paginated (25 per page, show pagination controls)
   - Checkbox selection for bulk actions
5. **Toolbar above grid**:
   - "New Record" button
   - "Export" dropdown (CSV, Excel)
   - "Bulk Actions" dropdown (Assign Steward, Change Status)
   - Column visibility toggle
6. **Row click** → navigates to Record Detail View
7. Populate with **at least 50 mock spare part records** with varied DQ scores, statuses, and sources

---

### Screen 3: Record Detail View

**Route**: `/entities/:entityType/records/:id`

**Layout**: Multi-panel detail page

This is the most complex screen. Build it with these panels:

1. **Header**: Record ID, Description, Status badge, DQ Score badge, Workflow state indicator ("Active", "Pending Approval"), Edit button, "More Actions" dropdown (Merge, Compare, View History)

2. **Golden Record Attribute Panel** (main content area):
   - Card showing all attributes in a 2-column form-like layout
   - Each attribute shows: label, value, source attribution icon (hover shows "from AMOS, survivorship: Most Recent Wins"), DQ indicator if failing
   - Override indicators: if an attribute was manually overridden, show an orange marker with tooltip ("Overridden by Sarah Chen on 2024-11-15")

3. **Source Instance Records Panel** (collapsible below or in a tab):
   - Table of contributing instance records: Source System, Source ID, key attribute values, Last Load timestamp
   - Example: 3 instance records from AMOS, SAP, and Excel contributing to one golden record

4. **Related Records Panel** (tab or side panel):
   - Show related Vendors (for a Spare Part) and related Equipment
   - Clickable links to navigate to those records

5. **DQ Validation Panel** (tab):
   - Overall DQ Score: `87.3`
   - Dimension breakdown: Completeness `92%`, Accuracy `88%`, Consistency `82%`
   - List of failing rules: "Manufacturer not in approved vendor list", "Lead Time exceeds 120 days threshold"

6. **Version History** (tab):
   - Table: Version #, Changed By, Changed At, Change Summary
   - Show 5–8 historical versions
   - Click a version to see the diff (modal showing before/after for each changed attribute)

7. **Lineage Graph** (tab):
   - Visual tree/graph showing: 3 source instance records → cluster → golden record
   - Use a simple SVG or structured layout (not a full graph library needed — a tree-like visual is sufficient)

---

### Screen 4: Record Comparison View

**Route**: `/compare/:id1/:id2` (or opened as a modal/drawer from Matching Proposals)

**Layout**: Side-by-side comparison

1. **Two records side by side** in a table:
   - Left: Record A, Right: Record B
   - Each row = one attribute
   - **Matching values**: highlighted in light green
   - **Diverging values**: highlighted in light red/orange
2. **Match Explanation Panel** (below or sidebar):
   - Matched attributes with per-attribute similarity score
   - Matching layer badge: "Deterministic Rule" or "AI Similarity"
   - Overall confidence score: large display, e.g., `87.4%` with color band (green = auto-approve range ≥90, yellow = review range 60–89, red = reject <60)
3. **Action Buttons**: Accept Merge, Reject, Escalate (with mandatory reason modal)
4. **Survivorship Preview**: If "Accept Merge" is hovered or clicked, show a preview panel of what the merged golden record would look like

---

### Screen 5: Matching Proposals Queue

**Route**: `/governance/matching`

**Layout**: Filterable list/table

1. **Proposals Table**:
   - Columns: Proposal ID, Entity Type, Record A (ID + description), Record B (ID + description), Confidence Score (with color badge), Proposed Action (Merge/Split), Source (Rule/AI badge), Days until SLA, Assigned To
   - Populate with **20+ proposals** with varied confidence scores
2. **Filters**: Confidence score range slider, Entity Type dropdown, Proposal Type (Merge/Split), Source (Rule/AI), SLA status
3. **Bulk Actions toolbar**:
   - "Accept All Above Threshold" button (opens modal with threshold slider, shows count of affected proposals)
   - "Reject All Below Threshold" button
4. **Row click** → opens Record Comparison View (Screen 4) as a drawer or navigates to comparison page

---

### Screen 6: Data Quality Issue Queue

**Route**: `/governance/dq-issues`

**Layout**: Filterable table

1. **Issue Table**:
   - Columns: Issue ID, Entity Type, Record ID, Record Description, DQ Score, Severity (Error badge in red / Warning badge in amber), Rule Failed, Date Detected, Assigned Steward, SLA indicator (green/amber/red dot)
   - Populate with **30+ issues**
2. **Filters**: Entity Type, Severity, SLA Status, Assigned Steward, Date Range
3. **Actions per row**:
   - "Create Task" button → opens modal to create a correction task (assigns to steward, sets SLA)
   - "View Record" → navigates to Record Detail
4. **Bulk Assignment**: Select multiple rows → "Assign To" dropdown in toolbar

---

### Screen 7: Task Inbox & Workflow

**Route**: `/governance/tasks`

**Layout**: Tabbed view

**Tab 1: My Tasks**
- Table: Task ID, Task Type (Approval, Correction, Merge Review, Escalation), Entity Type, Related Record (clickable), SLA Status (badge), Created Date, Priority
- Populate with **15+ tasks** for the current user
- Row click → opens task detail

**Tab 2: All Tasks** (admin only)
- Same table but showing all users' tasks
- Additional filter: Assigned User

**Task Detail** (opened as a drawer or modal):
- Task type and description
- Related record link
- **Change Set**: Before/After comparison table for each changed attribute
- **Workflow History**: Timeline showing: Created → Assigned → In Review → (current state)
- **Action Buttons**: Approve (with optional comment), Reject (with mandatory reason textarea), Escalate

---

### Screen 8: Draft Staging Area

**Route**: `/governance/drafts`

**Layout**: List of pending drafts

1. **Drafts List**: Grouped by entity type
   - Each draft shows: Record ID, Description, Number of changed attributes, Created date
   - Expandable to show the attribute-level changes (before → after)
2. **Summary bar at top**: "You have 5 draft changes affecting 5 records"
3. **Actions**: "Submit All for Approval" button, "Discard" per draft, "Edit" to modify before submission
4. Mock 5 draft changes with varied attribute edits

---

### Screen 9: Bulk Onboarding

**Route**: `/operations/bulk-onboarding`

**Layout**: Wizard-style multi-step flow

**Step 1: Upload**
- Drag-and-drop file upload area (styled, accepts .xlsx, .csv)
- Entity type selector dropdown
- Show a mock uploaded file: "spare_parts_batch_042.xlsx — 847 rows — 2.3 MB"
- "Next" button

**Step 2: Column Mapping**
- Left column: Source columns from the uploaded file (e.g., "PART_NUM", "DESC", "MFG", "COST_USD")
- Right column: Target entity attributes (e.g., "Part Number", "Description", "Manufacturer", "Unit Cost")
- Dropdown-based mapping for each source column
- Auto-mapped columns shown with a green check
- Unmapped columns shown with a warning

**Step 3: Validation Preview**
- Sample of 10 records with their projected DQ scores
- Failed rules highlighted per record
- Standardization changes shown (before → after, e.g., "WARTSILA" → "Wärtsilä")
- Summary: "832 records passed validation, 15 in exception"

**Step 4: Execute & Monitor**
- Progress bar showing records processed
- Stats: Records Processed, Passed, In Exception, Estimated Time Remaining
- Mock the progress at ~75% complete
- "Cancel Job" button

**Job History** (below the wizard or as a tab):
- Table of past jobs: Job ID, File Name, Entity Type, Records, Status (Completed/Failed/In Progress), Date, User

---

### Screen 10: Source System Management

**Route**: `/operations/sources`

**Layout**: Card grid + detail drawer

1. **Source System Cards** — one per configured source:
   - AMOS: PostgreSQL, Connected, Last Sync 15 min ago, 18,432 records, Health: green
   - SAP ERP: REST API, Connected, Last Sync 2 hrs ago, 12,891 records, Health: amber (latency warning)
   - Excel Uploads: File, Active, Last Upload 1 day ago, 847 records
   - Vendor Portal: REST API, Connected, Last Sync 30 min ago, 1,247 records, Health: green

2. **Card click** → opens detail drawer:
   - Connection details (masked credentials)
   - Field mapping summary table (source field → target attribute, mapping status)
   - Sync history (last 10 syncs with status and record counts)
   - "Test Connection" button
   - "Trigger Sync" button (with load type: Initial / Full / Delta)

3. **"Add Source"** button → opens a multi-step modal: Connection Type → Connection Parameters → Test → Field Mapping → Save

---

### Screen 11: Interface Monitor

**Route**: `/operations/interfaces`

**Layout**: Table + status indicators

1. **Active Interfaces Table**:
   - Interface Name, Direction (Inbound/Outbound), Source/Target System, Schedule (e.g., "Every 15 min", "Daily 02:00"), Last Run (timestamp + status badge), Next Run, Records Last Sync
2. **Status badges**: Running (blue spinner), Success (green), Failed (red), Scheduled (gray)
3. **Row click** → drawer with run history, error logs, and manual trigger button
4. Mock 8–10 interfaces with varied statuses

---

### Screen 12: Data Quality Overview (Analytics)

**Route**: `/analytics/dq-overview`

**Layout**: Dashboard-style analytics

1. **Overall DQ Score** — large gauge or donut chart: `86.2%`
2. **DQ Score by Entity Type** — bar chart comparing Spare Parts, Vendors, Equipment
3. **DQ Score Trend** — line chart showing last 30 days, one line per entity type
4. **DQ Dimension Breakdown** — stacked bar or radar chart:
   - Completeness, Accuracy, Consistency, Timeliness, Uniqueness
5. **Top 10 Failing Rules** — horizontal bar chart:
   - "Missing Manufacturer": 234 records
   - "Invalid Part Number Format": 187 records
   - "Duplicate Vendor Code": 89 records
   - etc.
6. **DQ Heatmap by Source System** — small table/heatmap: rows = source systems, columns = DQ dimensions, cells = score with color

---

### Screen 13: Anomaly Overview

**Route**: `/analytics/anomalies`

**Layout**: Alert list with detail panel

1. **Anomaly Cards/List**:
   - Each anomaly: Entity Type, Anomaly Type (e.g., "Volume Spike", "Distribution Shift", "Missing Values Increase"), Severity (High/Medium/Low), Detected Date, Affected Records count, Status (New/Investigating/Resolved/Dismissed)
   - Populate with 8–12 anomalies
2. **Anomaly Detail** (click to expand or drawer):
   - Description: "Unit Cost for Spare Parts showed a 340% increase in records loaded from SAP on Nov 12"
   - Visualization: small chart showing the anomaly (e.g., a bar chart with the outlier highlighted)
   - Affected records list (first 5 with links)
   - Actions: Confirm (routes to DQ queue), Dismiss (updates model)

---

### Screen 14: Profile Inspector

**Route**: `/analytics/profiling`

**Layout**: Attribute-level profiling dashboard

1. **Entity Type selector** at the top
2. **Attribute Profile Cards** — one card per attribute:
   - Attribute name
   - Completeness: `98.2%` with small bar
   - Distinct values: `1,247`
   - Top 5 values: mini bar chart
   - Null count: `43`
   - Pattern analysis: e.g., "92% match pattern `SP-NNNNNN`"
   - Min/Max for numeric fields
   - Distribution chart (histogram for numeric, bar chart for categorical)
3. Show profiles for 8–10 attributes of the Spare Part entity

---

### Screen 15: Entity Model Configuration (Admin)

**Route**: `/admin/entity-model`

**Layout**: Tree + detail panel

1. **Left panel**: Tree of entity types → attributes
   - Spare Part → (list of attributes)
   - Vendor → (list of attributes)
   - Equipment → (list of attributes)
2. **Right panel** (when an entity type is selected):
   - Entity metadata: name, description, code, status
   - Attributes table: Name, Data Type, Required, Searchable, PII Flag, Survivorship Rule, DQ Rules assigned
   - "Add Attribute" button
   - Relationship configuration: what other entity types this relates to (1:N, M:N)
3. **Right panel** (when an attribute is clicked):
   - Attribute detail form: Name, Code, Data Type dropdown, Default Value, Validation Rule assignments, Survivorship Rule dropdown (Most Recent, Source Priority, Max, Min, Manual), PII flag toggle
4. All edits should show inline — form fields that become editable on click

---

### Screen 16: Workflow Configuration (Admin)

**Route**: `/admin/workflows`

**Layout**: List + visual editor

1. **Workflow Templates List**:
   - "Record Change Approval" — Active, 3 steps
   - "Merge Approval" — Active, 2 steps
   - "Bulk Load Review" — Active, 2 steps
   - "New Record Creation" — Active, 3 steps
2. **Workflow Detail** (click a workflow):
   - Visual step diagram: horizontal flow showing steps with arrows
   - Example: `Steward Submits` → `Senior Steward Reviews` → `Approver Approves` → `Published`
   - Each step shows: assigned role, SLA (hours), escalation rule
   - Step configuration panel on click
3. **SLA Configuration**: table of SLA rules per entity type and task type

---

### Screen 17: RBAC Console (Admin)

**Route**: `/admin/rbac`

**Layout**: Tabs for Users, Roles, Permissions

**Tab 1: Users**
- User table: Name, Email, Role(s), Entity Permissions, Status (Active/Inactive), Last Login
- Populated with the 5 mock users
- "Invite User" button

**Tab 2: Roles**
- Role cards: Platform Admin, Tenant Admin, Senior Steward, Data Steward, Approver, Viewer
- Click a role → permission matrix: rows = features (Browse Records, Edit Records, Approve Tasks, Configure Entities, etc.), columns = CRUD or action permissions, checkboxes

**Tab 3: Permissions Matrix**
- Full matrix view: rows = roles, columns = permissions, with check/cross indicators

---

### Screen 18: Audit Log (Admin)

**Route**: `/admin/audit-log`

**Layout**: Searchable, filterable log table

1. **Log Table**:
   - Columns: Timestamp, User, Action (Created, Updated, Approved, Rejected, Merged, Exported, Configured), Entity Type, Record ID, Details (expandable)
   - Populate with **50+ log entries** spanning different actions and users
2. **Filters**: Date range, User, Action type, Entity type, Record ID search
3. **Export**: "Export Audit Log" button (CSV)
4. **Detail expansion**: clicking a row expands to show the full change payload (JSON-like display of before/after values)

---

### Screen 19: Tenant Settings (Admin)

**Route**: `/admin/settings`

**Layout**: Settings form with sections

1. **General**: Tenant name, description, logo upload area, timezone selector
2. **Data Quality**: Default DQ thresholds (green/yellow/red), profiling schedule (cron expression input)
3. **Matching**: Default confidence thresholds — Auto-approve slider (default 95%), Review range, Auto-reject slider (default 30%)
4. **Notifications**: Email notification toggles (SLA breach, anomaly detected, bulk load complete, etc.)
5. **API**: API key management table (key name, created date, last used, status, actions: rotate/revoke)
6. "Save Changes" button with success toast notification

---

### Screen 20: Merge & Split Operations

**Route**: accessed from Record Detail or Matching Proposals

**Merge Flow** (modal or full-page):
1. Select 2+ records from browse
2. Side-by-side comparison (reuse Screen 4 layout)
3. **Survivor Selection**: radio button to choose which record is the base
4. **Survivorship Preview**: auto-generated merged record showing each attribute's projected value and which rule determined it
5. "Submit for Approval" → creates workflow task

**Split Flow** (from a merged record's detail page):
1. Show instance records currently clustered under the golden record
2. Checkbox to select which instance records to split out
3. Preview of both resulting golden records
4. "Submit for Approval"

---

## Global Features

### Notifications
- Bell icon in header with badge count
- Dropdown panel showing last 10 notifications with timestamps
- Types: Task assigned, SLA approaching, Anomaly detected, Bulk load complete, Approval needed

### Global Search
- Search input in header
- Dropdown results showing: Records (with entity type icon), Tasks, Users
- Keyboard shortcut hint: `⌘K`

### Empty States
- Every screen that can be empty (no tasks, no anomalies, etc.) should have a clean empty state illustration with a message and a primary action button

### Loading States
- Use Ant Design Skeleton components for loading states on data-heavy screens

---

## File Structure

Organize the code as:

```
src/
  components/          # Shared components (AppLayout, Sidebar, Header, etc.)
  pages/               # One folder per screen
    Dashboard/
    EntityBrowse/
    RecordDetail/
    RecordComparison/
    MatchingProposals/
    DQIssueQueue/
    TaskInbox/
    DraftStaging/
    BulkOnboarding/
    SourceSystems/
    InterfaceMonitor/
    DQOverview/
    AnomalyOverview/
    ProfileInspector/
    EntityModelConfig/
    WorkflowConfig/
    RBACConsole/
    AuditLog/
    TenantSettings/
  data/                # Mock data files (one per entity type + cross-cutting data)
    spareParts.ts
    vendors.ts
    equipment.ts
    tasks.ts
    matchingProposals.ts
    dqIssues.ts
    anomalies.ts
    auditLog.ts
    users.ts
    sourceSystems.ts
  types/               # TypeScript interfaces for all entities
  hooks/               # Custom hooks (useFilters, usePagination, etc.)
  utils/               # Helpers (formatDate, getDQBadgeColor, etc.)
  routes.tsx           # Route definitions
  App.tsx
```

---

## Critical Reminders

1. **Every screen must render with realistic mock data** — no empty tables, no placeholder text, no "Lorem ipsum"
2. **All navigation must work** — sidebar links, breadcrumbs, row clicks, back buttons
3. **Filters must actually filter the mock data** — not just render filter UI
4. **Modals must open and close** — approval modals, comparison drawers, detail panels
5. **DQ badges must be calculated from mock data** — green/yellow/red based on actual score values
6. **The prototype must feel like a real working app** — even though it's all client-side mock data
7. **Use Ant Design components consistently** — Table, Card, Statistic, Tag, Badge, Drawer, Modal, Form, Steps, Timeline, Tree, Descriptions
8. **Do not build authentication** — assume the user is always logged in as Ahmed Al-Rashid (Admin)
9. **Generate enough mock data to make screens feel populated**: 50+ records for entity browse, 20+ matching proposals, 30+ DQ issues, 15+ tasks, 50+ audit entries
10. **Breadcrumbs and page titles must update per route**
