# TypeScript Interface Contract: Sazience MDM React Prototype

**Type**: TypeScript type definitions (UI contracts)
**Date**: 2026-04-06
**Source**: `src/types/index.ts`

All interfaces defined here represent the shape of mock data arrays and component props. They are the single source of truth for data structure across all 20 screens.

## Component Props Contracts

### DQBadge

```typescript
interface DQBadgeProps {
  score: number;   // 0–100; color computed internally
  size?: 'small' | 'default';
}
```

### EmptyState

```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
}
```

### AppLayout (internal — no external props)

Reads active route from `useLocation()` to compute:
- Active sidebar menu key
- Breadcrumb segments

## Filter State Contracts

These represent the filter state managed in each screen that supports filtering.

### EntityBrowseFilters

```typescript
interface EntityBrowseFilters {
  search: string;
  category: SparePartCategory | '';
  manufacturer: string;
  status: EntityStatus | VendorStatus | EquipmentStatus | '';
  dqScoreMin: number;   // 0
  dqScoreMax: number;   // 100
  sourceSystem: SourceSystemId | '';
  lastModifiedFrom: string;
  lastModifiedTo: string;
  assignedSteward: string;
}
```

### MatchingProposalFilters

```typescript
interface MatchingProposalFilters {
  confidenceMin: number;
  confidenceMax: number;
  entityType: EntityType | '';
  proposedAction: 'Merge' | 'Split' | '';
  source: 'Rule' | 'AI' | '';
  slaStatus: SLAStatus | '';
}
```

### DQIssueFilters

```typescript
interface DQIssueFilters {
  entityType: EntityType | '';
  severity: 'Error' | 'Warning' | '';
  slaStatus: SLAStatus | '';
  assignedSteward: string;
  dateFrom: string;
  dateTo: string;
}
```

### AuditLogFilters

```typescript
interface AuditLogFilters {
  dateFrom: string;
  dateTo: string;
  userId: string;
  action: AuditAction | '';
  entityType: EntityType | '';
  recordIdSearch: string;
}
```

## Mock Data Array Contracts

All mock data files export named arrays matching these types:

| File | Export | Type | Min Records |
|------|--------|------|-------------|
| `src/data/spareParts.ts` | `spareParts` | `SparePart[]` | 50 |
| `src/data/vendors.ts` | `vendors` | `Vendor[]` | 20 |
| `src/data/equipment.ts` | `equipment` | `Equipment[]` | 20 |
| `src/data/matchingProposals.ts` | `matchingProposals` | `MatchingProposal[]` | 20 |
| `src/data/dqIssues.ts` | `dqIssues` | `DQIssue[]` | 30 |
| `src/data/tasks.ts` | `tasks` | `Task[]` | 15 |
| `src/data/drafts.ts` | `drafts` | `Draft[]` | 5 |
| `src/data/auditLog.ts` | `auditLog` | `AuditLogEntry[]` | 50 |
| `src/data/anomalies.ts` | `anomalies` | `Anomaly[]` | 8 |
| `src/data/sourceSystems.ts` | `sourceSystems` | `SourceSystem[]` | 4 (fixed) |
| `src/data/users.ts` | `users` | `User[]` | 5 (fixed) |
| `src/data/notifications.ts` | `notifications` | `Notification[]` | 10 (fixed) |

## Utility Function Contracts

### src/utils/dqBadge.ts

```typescript
getDQBadgeColor(score: number): 'green' | 'yellow' | 'red'
getDQTagColor(score: number): string  // Ant Design Tag color string
```

### src/utils/formatDate.ts

```typescript
formatDate(isoString: string): string            // "Nov 15, 2024"
formatDateTime(isoString: string): string        // "Nov 15, 2024, 14:23"
formatRelativeTime(isoString: string): string    // "12 min ago" | "2 hrs ago"
```

### src/hooks/useFilters.ts

```typescript
function useFilters<T extends object>(initialFilters: T): {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFilters: () => void;
}
```

### src/hooks/usePagination.ts

```typescript
function usePagination(totalItems: number, pageSize?: number): {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  paginatedSlice: <T>(items: T[]) => T[];
}
```
