# Data Model: Sazience MDM React Prototype

**Phase**: 1 — Design
**Date**: 2026-04-06
**Branch**: `001-mdm-react-prototype`

All entities below are TypeScript interfaces defined in `src/types/index.ts`. All data lives in `src/data/` as exported TypeScript arrays.

---

## Core Domain Entities

### SparePart

```typescript
interface SparePart {
  id: string;              // "SP-001234"
  partNumber: string;      // "SP-001234"
  description: string;     // "Hydraulic Pump Assembly"
  category: SparePartCategory;
  manufacturer: string;    // "Wärtsilä", "ABB Marine", etc.
  unitOfMeasure: UnitOfMeasure;
  leadTimeDays: number;    // 14 | 30 | 60 | 90
  unitCostUsd: number;     // 45.00 | 1250.00 | 18500.00
  criticalSpare: boolean;
  status: EntityStatus;
  lastUpdated: string;     // ISO date string
  dqScore: number;         // 0–100
  assignedSteward?: string; // user id
  sourceSystem: SourceSystemId;
  workflowState: WorkflowState;
}

type SparePartCategory = 'Mechanical' | 'Electrical' | 'HVAC' | 'Safety' | 'Hull';
type UnitOfMeasure = 'Each' | 'Set' | 'Meter' | 'Liter' | 'Kilogram';
type EntityStatus = 'Active' | 'Obsolete' | 'Pending Review';
type WorkflowState = 'Active' | 'Pending Approval' | 'Draft';
```

**Minimum mock records**: 50

---

### Vendor

```typescript
interface Vendor {
  id: string;              // "V-1001"
  vendorCode: string;      // "V-1001"
  companyName: string;     // "Wärtsilä Corporation"
  country: string;
  contactEmail: string;
  paymentTerms: PaymentTerms;
  certification: string;   // "ISO 9001" | "DNV-GL" | "Lloyd's Register"
  status: VendorStatus;
  dqScore: number;         // 0–100
  sourceSystem: SourceSystemId;
  lastUpdated: string;
}

type PaymentTerms = 'Net 30' | 'Net 60' | 'Net 90';
type VendorStatus = 'Approved' | 'Under Review' | 'Suspended';
```

**Minimum mock records**: 20

---

### Equipment

```typescript
interface Equipment {
  id: string;              // "EQ-A001"
  equipmentId: string;     // "EQ-A001"
  name: string;            // "Main Engine Unit #1"
  vessel: string;          // "Carnival Horizon"
  deckLocation: string;    // "Engine Room — Deck 0"
  manufacturer: string;
  installDate: string;     // ISO date string
  status: EquipmentStatus;
  sourceSystem: SourceSystemId;
  lastUpdated: string;
}

type EquipmentStatus = 'Operational' | 'Under Maintenance' | 'Decommissioned';
```

**Minimum mock records**: 20

---

## Governance Entities

### MatchingProposal

```typescript
interface MatchingProposal {
  id: string;              // "MP-0234"
  entityType: EntityType;
  recordAId: string;
  recordADescription: string;
  recordBId: string;
  recordBDescription: string;
  confidenceScore: number; // 0–100
  proposedAction: 'Merge' | 'Split';
  source: 'Rule' | 'AI';
  slaDaysRemaining: number;
  assignedTo: string;      // user id
  status: ProposalStatus;
  createdAt: string;
}

type EntityType = 'spare-parts' | 'vendors' | 'equipment';
type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Escalated';
```

**Minimum mock records**: 20

---

### DQIssue

```typescript
interface DQIssue {
  id: string;              // "DQ-0089"
  entityType: EntityType;
  recordId: string;
  recordDescription: string;
  dqScore: number;
  severity: 'Error' | 'Warning';
  ruleFailed: string;      // "Missing Manufacturer", "Invalid Part Number Format"
  dateDetected: string;    // ISO date string
  assignedSteward?: string; // user id
  slaStatus: SLAStatus;
  status: IssueStatus;
}

type SLAStatus = 'On Track' | 'Approaching' | 'Breached';
type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
```

**Minimum mock records**: 30

---

### Task

```typescript
interface Task {
  id: string;              // "T-0045"
  taskType: TaskType;
  entityType: EntityType;
  relatedRecordId: string;
  relatedRecordDescription: string;
  slaStatus: SLAStatus;
  createdAt: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;      // user id
  status: TaskStatus;
  changeset?: AttributeChange[];
  workflowHistory?: WorkflowEvent[];
}

type TaskType = 'Approval' | 'Correction' | 'Merge Review' | 'Escalation';
type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Rejected';

interface AttributeChange {
  attribute: string;
  before: string;
  after: string;
}

interface WorkflowEvent {
  state: string;
  actor: string;
  timestamp: string;
  comment?: string;
}
```

**Minimum mock records**: 15

---

### Draft

```typescript
interface Draft {
  id: string;              // "DR-0012"
  entityType: EntityType;
  recordId: string;
  recordDescription: string;
  changes: AttributeChange[];
  createdAt: string;
  createdBy: string;       // user id
}
```

**Minimum mock records**: 5

---

### AuditLogEntry

```typescript
interface AuditLogEntry {
  id: string;              // "AL-0001"
  timestamp: string;       // ISO datetime
  user: string;            // user id
  action: AuditAction;
  entityType: EntityType;
  recordId: string;
  details: string;         // human-readable summary
  changePayload?: {        // before/after JSON for expanded view
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

type AuditAction = 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Merged' | 'Exported' | 'Configured';
```

**Minimum mock records**: 50

---

## Operational Entities

### SourceSystem

```typescript
interface SourceSystem {
  id: SourceSystemId;
  name: string;            // "AMOS (Fleet Management)"
  type: 'PostgreSQL' | 'API' | 'File' | 'REST API';
  status: 'Connected' | 'Active' | 'Disconnected';
  healthStatus: 'Healthy' | 'Degraded' | 'Down';
  lastSyncAt: string;      // ISO datetime
  recordCount: number;
  syncHistory: SyncRun[];
  fieldMappings: FieldMapping[];
}

type SourceSystemId = 'amos' | 'sap' | 'excel' | 'vendor-portal';

interface SyncRun {
  runId: string;
  startedAt: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  recordsProcessed: number;
  recordsFailed: number;
}

interface FieldMapping {
  sourceField: string;
  targetAttribute: string;
  mappingStatus: 'Mapped' | 'Unmapped' | 'Auto-mapped';
}
```

---

### Interface (Monitor)

```typescript
interface InterfaceRecord {
  id: string;
  name: string;
  direction: 'Inbound' | 'Outbound';
  sourceSystem: string;
  targetSystem: string;
  schedule: string;        // "Every 15 min" | "Daily 02:00"
  lastRunAt: string;
  lastRunStatus: InterfaceStatus;
  nextRunAt: string;
  recordsLastSync: number;
  runHistory: InterfaceRun[];
}

type InterfaceStatus = 'Running' | 'Success' | 'Failed' | 'Scheduled';

interface InterfaceRun {
  runAt: string;
  status: InterfaceStatus;
  recordsProcessed: number;
  errorMessage?: string;
}
```

**Minimum mock records**: 8

---

### Anomaly

```typescript
interface Anomaly {
  id: string;              // "AN-0001"
  entityType: EntityType;
  anomalyType: string;     // "Volume Spike" | "Distribution Shift" | "Missing Values Increase"
  severity: 'High' | 'Medium' | 'Low';
  detectedAt: string;
  affectedRecordCount: number;
  status: AnomalyStatus;
  description: string;
  affectedRecordIds: string[];  // first 5 for display
}

type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
```

**Minimum mock records**: 8

---

## Support Entities

### User

```typescript
interface User {
  id: string;
  name: string;            // "Ahmed Al-Rashid"
  email: string;
  role: UserRole;
  entityPermissions: EntityType[];
  status: 'Active' | 'Inactive';
  lastLoginAt: string;
  avatarInitials: string;  // "AA"
}

type UserRole = 'Platform Admin' | 'Senior Steward' | 'Data Steward' | 'Approver' | 'Viewer';
```

**Fixed mock records**: 5 (Ahmed Al-Rashid, Sarah Chen, James O'Connor, Maria Santos, Raj Patel)

---

### Notification

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;         // route path
}

type NotificationType = 'task-assigned' | 'sla-approaching' | 'anomaly-detected' | 'bulk-load-complete' | 'approval-needed';
```

**Fixed mock records**: 10

---

## Entity Relationships

```
SparePart ──────────────────────── MatchingProposal (recordAId | recordBId)
SparePart ──────────────────────── DQIssue (recordId)
SparePart ──────────────────────── Task (relatedRecordId)
SparePart ──────────────────────── Draft (recordId)
SparePart ──────────────────────── AuditLogEntry (recordId)
SparePart ──── related to ──────── Vendor (by manufacturer name)
SparePart ──── related to ──────── Equipment (by vessel / part usage)
SourceSystem ──────────────────── SparePart (sourceSystem field)
User ───────────────────────────── Task (assignedTo)
User ───────────────────────────── DQIssue (assignedSteward)
User ───────────────────────────── AuditLogEntry (user)
```

---

## DQ Score Badge Logic

Implemented in `src/utils/dqBadge.ts`:

```typescript
function getDQBadgeColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 85) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}
```

Applied as an Ant Design `<Tag>` with the appropriate color. Badge color is always computed from the `dqScore` field — never hardcoded by row position.

---

## State Transitions

### Matching Proposal

```
Pending → Accepted (user clicks Accept Merge, submits survivorship)
Pending → Rejected (user clicks Reject with reason)
Pending → Escalated (user clicks Escalate with reason)
```

### Task

```
Open → In Progress (user opens task detail and starts reviewing)
In Progress → Completed (user clicks Approve)
In Progress → Rejected (user clicks Reject with mandatory reason)
In Progress → Escalated (user clicks Escalate)
```

### DQ Issue

```
Open → In Progress (Create Task action links an issue to a task)
In Progress → Resolved (linked task approved)
```

*Note*: All state transitions are in-memory only. No persistence across page reloads.
