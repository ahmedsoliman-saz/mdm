# Route Contract: Sazience MDM React Prototype

**Type**: React Router v6 route definitions
**Date**: 2026-04-06

All routes are defined in `src/routes.tsx` using `createBrowserRouter`. Every route except the catch-all renders inside `AppLayout` (which provides the persistent header, sidebar, and breadcrumb bar).

## Route Table

| Route | Component | Screen # | Breadcrumb Path |
|-------|-----------|----------|-----------------|
| `/` | Redirect → `/dashboard` | — | — |
| `/dashboard` | `<Dashboard />` | 1 | Home / Dashboard |
| `/entities/spare-parts` | `<EntityBrowse />` | 2 | Data / Spare Parts |
| `/entities/vendors` | `<EntityBrowse />` | 2 | Data / Vendors |
| `/entities/equipment` | `<EntityBrowse />` | 2 | Data / Equipment |
| `/entities/:entityType/records/:id` | `<RecordDetail />` | 3 | Data / {EntityType} / {RecordId} |
| `/compare/:id1/:id2` | `<RecordComparison />` | 4 | Data / Compare Records |
| `/governance/matching` | `<MatchingProposals />` | 5 | Governance / Matching Proposals |
| `/governance/dq-issues` | `<DQIssueQueue />` | 6 | Governance / DQ Issue Queue |
| `/governance/tasks` | `<TaskInbox />` | 7 | Governance / Task Inbox |
| `/governance/drafts` | `<DraftStaging />` | 8 | Governance / Draft Staging |
| `/operations/bulk-onboarding` | `<BulkOnboarding />` | 9 | Operations / Bulk Onboarding |
| `/operations/sources` | `<SourceSystems />` | 10 | Operations / Source Systems |
| `/operations/interfaces` | `<InterfaceMonitor />` | 11 | Operations / Interface Monitor |
| `/analytics/dq-overview` | `<DQOverview />` | 12 | Analytics / Data Quality Overview |
| `/analytics/anomalies` | `<AnomalyOverview />` | 13 | Analytics / Anomaly Overview |
| `/analytics/profiling` | `<ProfileInspector />` | 14 | Analytics / Profile Inspector |
| `/admin/entity-model` | `<EntityModelConfig />` | 15 | Admin / Entity Model Config |
| `/admin/workflows` | `<WorkflowConfig />` | 16 | Admin / Workflow Config |
| `/admin/rbac` | `<RBACConsole />` | 17 | Admin / RBAC Console |
| `/admin/audit-log` | `<AuditLog />` | 18 | Admin / Audit Log |
| `/admin/settings` | `<TenantSettings />` | 19 | Admin / Tenant Settings |
| `*` | `<NotFound />` | — | — (no layout) |

## Screen 20 — Merge & Split

Screen 20 (Merge & Split Operations) is not a standalone route. It is accessed via:
- **From Record Detail**: "More Actions" → "Merge" opens a `<Modal>` or `<Drawer>` rendered within the `/entities/:entityType/records/:id` route.
- **From Matching Proposals**: Clicking a proposal row opens the comparison and merge flow as a `<Drawer>` within `/governance/matching`.

## Route Parameters

| Parameter | Type | Source | Description |
|-----------|------|--------|-------------|
| `:entityType` | `'spare-parts' \| 'vendors' \| 'equipment'` | URL segment | Determines which entity tab and data set to display |
| `:id` | `string` | URL segment | Record ID (e.g., `SP-001234`); looked up in the corresponding mock data array |
| `:id1`, `:id2` | `string` | URL segments | Two record IDs for side-by-side comparison |

## Navigation Invariants

- The sidebar always highlights the menu item matching the current route.
- Navigating to `/entities/spare-parts` activates the "Entity Browse" sidebar item and selects the "Spare Parts" tab.
- Navigating to `/entities/vendors` or `/entities/equipment` activates the same sidebar item but selects the appropriate tab.
- The back button on Record Detail navigates back to the Entity Browse screen for the same entity type.
- Clicking a record ID in any governance screen navigates to that record's detail view.
