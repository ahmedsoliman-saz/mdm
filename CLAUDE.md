# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What This Directory Is

This is the **React prototype** for **Sazience MDM** — a fully interactive, clickable stakeholder demo with realistic mock data. It is **not a production app**. The goal is to demonstrate every screen, interaction, and data flow to stakeholders, investors, and prospective clients.

The full build specification lives at `.doc/sazience-mdm-prototype-prompt.md`.

## Technology Stack

| Tool | Version / Notes |
|------|----------------|
| React | 19 (currently installed) |
| TypeScript | ~6 |
| Vite | Build tool and dev server |
| Tailwind CSS | v4 (currently installed) |
| Ant Design | 5 — enterprise component library (needs installing) |
| React Router | v6 — page navigation (needs installing) |
| Recharts | Charts and visualizations (needs installing) |

**No backend. No API calls. All data is hardcoded mock data.**

## Build & Run Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

## Design Principles

- **Light theme only** — white/light gray backgrounds, subtle borders
- Primary color: `#1677ff` (Ant Design default blue)
- Success: `#52c41a`, Warning: `#faad14`, Error: `#ff4d4f`
- Clean, readable typography with generous whitespace
- Cards with subtle shadows (not flat boxes)
- No dark mode. No gradients. Enterprise software aesthetic, not consumer.
- Minimum supported width: 1280px

## Application Shell

Persistent layout on every page:

1. **Top Header**: Sazience MDM logo, tenant name ("Carnival Cruise Lines"), user avatar ("Ahmed Al-Rashid — Admin"), notification bell with badge, global search (`⌘K`)
2. **Left Sidebar**: Collapsible, grouped navigation (see groups below)
3. **Content Area**: Active screen
4. **Breadcrumb Bar**: Below header, updates per route

### Sidebar Navigation Groups

| Group | Items |
|-------|-------|
| Home | Dashboard |
| Data | Entity Browse, Record Search |
| Governance | Task Inbox, Matching Proposals, DQ Issue Queue, Draft Staging |
| Operations | Bulk Onboarding, Source Systems, Interface Monitor |
| Analytics | Data Quality Overview, Anomaly Overview, Profile Inspector |
| Admin | Entity Model Config, Workflow Config, RBAC Console, Audit Log, Tenant Settings |

## Mock Data Domain

Domain: **Spare Parts / MRO (Maintenance, Repair, Overhaul)** — the first client vertical.

### Entity Types

**Spare Part**: Part Number (SP-XXXXXX), Description, Category, Manufacturer, Unit of Measure, Lead Time (days), Unit Cost (USD), Critical Spare, Status (Active/Obsolete/Pending Review), DQ Score (0–100)

**Vendor**: Vendor Code (V-XXXX), Company Name, Country, Contact Email, Payment Terms, Certification, Status (Approved/Under Review/Suspended), DQ Score

**Equipment** (Component): Equipment ID (EQ-XXXX), Name, Vessel, Deck/Location, Manufacturer, Install Date, Status (Operational/Under Maintenance/Decommissioned)

### Source Systems

| Source | Type | Status |
|--------|------|--------|
| AMOS (Fleet Management) | PostgreSQL | Connected — Healthy |
| SAP ERP | API | Connected — Degraded |
| Excel Uploads | File | Active |
| Vendor Portal API | REST API | Connected — Healthy |

### Mock Users

| Name | Role |
|------|------|
| Ahmed Al-Rashid | Platform Admin (always logged in) |
| Sarah Chen | Senior Steward |
| James O'Connor | Data Steward |
| Maria Santos | Approver |
| Raj Patel | Viewer |

## Screens

20 screens total. All must render with realistic mock data.

| # | Screen | Route |
|---|--------|-------|
| 1 | Dashboard & Home | `/dashboard` |
| 2 | Entity Browse & Search | `/entities/:entityType` |
| 3 | Record Detail View | `/entities/:entityType/records/:id` |
| 4 | Record Comparison View | `/compare/:id1/:id2` |
| 5 | Matching Proposals Queue | `/governance/matching` |
| 6 | DQ Issue Queue | `/governance/dq-issues` |
| 7 | Task Inbox & Workflow | `/governance/tasks` |
| 8 | Draft Staging Area | `/governance/drafts` |
| 9 | Bulk Onboarding | `/operations/bulk-onboarding` |
| 10 | Source System Management | `/operations/sources` |
| 11 | Interface Monitor | `/operations/interfaces` |
| 12 | Data Quality Overview | `/analytics/dq-overview` |
| 13 | Anomaly Overview | `/analytics/anomalies` |
| 14 | Profile Inspector | `/analytics/profiling` |
| 15 | Entity Model Config | `/admin/entity-model` |
| 16 | Workflow Configuration | `/admin/workflows` |
| 17 | RBAC Console | `/admin/rbac` |
| 18 | Audit Log | `/admin/audit-log` |
| 19 | Tenant Settings | `/admin/settings` |
| 20 | Merge & Split Operations | Accessed from Record Detail or Matching Proposals |

## File Structure

```
src/
  components/        # Shared: AppLayout, Sidebar, Header, Breadcrumb, etc.
  pages/             # One folder per screen
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
  data/              # Mock data (one file per entity type)
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
  types/             # TypeScript interfaces for all entities
  hooks/             # Custom hooks (useFilters, usePagination, etc.)
  utils/             # Helpers (formatDate, getDQBadgeColor, etc.)
  routes.tsx         # Route definitions
  App.tsx
```

## Key Development Rules

1. **Every screen renders with realistic mock data** — no empty tables, no Lorem ipsum
2. **All navigation works** — sidebar links, breadcrumbs, row clicks, back buttons
3. **Filters actually filter mock data** — not just render filter UI
4. **Modals open and close** — approval modals, comparison drawers, detail panels
5. **DQ badges calculated from mock data** — green ≥85, yellow 60–84, red <60
6. **Use Ant Design components consistently** — Table, Card, Statistic, Tag, Badge, Drawer, Modal, Form, Steps, Timeline, Tree, Descriptions
7. **Do not build authentication** — user is always logged in as Ahmed Al-Rashid (Admin)
8. **Mock data minimums**: 50+ spare part records, 20+ matching proposals, 30+ DQ issues, 15+ tasks, 50+ audit entries
9. **Breadcrumbs and page titles update per route**
10. **Empty states**: every screen that can be empty needs a clean empty state with a primary action button

## Key Domain Terms

- **Golden Record** — The authoritative, approved version of a master data entity
- **Survivorship** — Logic deciding which field value wins when source records are merged
- **DQ Score** — Data Quality score (0–100), displayed as green/yellow/red badge
- **Match Proposal** — AI or rule-based suggestion that two records may be duplicates
- **Anomaly** — Detected deviation from expected data patterns (volume spike, distribution shift, etc.)
- **Draft** — Staged attribute changes not yet submitted for approval
- **Source Instance** — A record from a source system contributing to a golden record
