// ===== Union Types =====

export type SparePartCategory = 'Mechanical' | 'Electrical' | 'HVAC' | 'Safety' | 'Hull';
export type UnitOfMeasure = 'Each' | 'Set' | 'Meter' | 'Liter' | 'Kilogram';
export type EntityStatus = 'Active' | 'Obsolete' | 'Pending Review';
export type WorkflowState = 'Active' | 'Pending Approval' | 'Draft';
export type PaymentTerms = 'Net 30' | 'Net 60' | 'Net 90';
export type VendorStatus = 'Approved' | 'Under Review' | 'Suspended';
export type EquipmentStatus = 'Operational' | 'Under Maintenance' | 'Decommissioned';
export type EntityType = 'spare-parts' | 'vendors' | 'equipment';
export type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Escalated';
export type SLAStatus = 'On Track' | 'Approaching' | 'Breached';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
export type TaskType = 'Approval' | 'Correction' | 'Merge Review' | 'Escalation';
export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Rejected';
export type AuditAction = 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Merged' | 'Exported' | 'Configured';
export type SourceSystemId = 'amos' | 'sap' | 'excel' | 'vendor-portal';
export type InterfaceStatus = 'Running' | 'Success' | 'Failed' | 'Scheduled';
export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
export type UserRole = 'Platform Admin' | 'Senior Steward' | 'Data Steward' | 'Approver' | 'Viewer';
export type NotificationType = 'task-assigned' | 'sla-approaching' | 'anomaly-detected' | 'bulk-load-complete' | 'approval-needed';

// ===== Core Domain Entities =====

export interface SparePart {
  id: string;
  partNumber: string;
  description: string;
  category: SparePartCategory;
  manufacturer: string;
  unitOfMeasure: UnitOfMeasure;
  leadTimeDays: number;
  unitCostUsd: number;
  criticalSpare: boolean;
  status: EntityStatus;
  lastUpdated: string;
  dqScore: number;
  assignedSteward?: string;
  sourceSystem: SourceSystemId;
  workflowState: WorkflowState;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  companyName: string;
  country: string;
  contactEmail: string;
  paymentTerms: PaymentTerms;
  certification: string;
  status: VendorStatus;
  dqScore: number;
  sourceSystem: SourceSystemId;
  lastUpdated: string;
}

export interface Equipment {
  id: string;
  equipmentId: string;
  name: string;
  vessel: string;
  deckLocation: string;
  manufacturer: string;
  installDate: string;
  status: EquipmentStatus;
  sourceSystem: SourceSystemId;
  lastUpdated: string;
}

// ===== Governance Entities =====

export interface MatchingProposal {
  id: string;
  entityType: EntityType;
  recordAId: string;
  recordADescription: string;
  recordBId: string;
  recordBDescription: string;
  confidenceScore: number;
  proposedAction: 'Merge' | 'Split';
  source: 'Rule' | 'AI';
  slaDaysRemaining: number;
  assignedTo: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface DQIssue {
  id: string;
  entityType: EntityType;
  recordId: string;
  recordDescription: string;
  dqScore: number;
  severity: 'Error' | 'Warning';
  ruleFailed: string;
  dateDetected: string;
  assignedSteward?: string;
  slaStatus: SLAStatus;
  status: IssueStatus;
}

export interface AttributeChange {
  attribute: string;
  before: string;
  after: string;
}

export interface WorkflowEvent {
  state: string;
  actor: string;
  timestamp: string;
  comment?: string;
}

export interface Task {
  id: string;
  taskType: TaskType;
  entityType: EntityType;
  relatedRecordId: string;
  relatedRecordDescription: string;
  slaStatus: SLAStatus;
  createdAt: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  status: TaskStatus;
  changeset?: AttributeChange[];
  workflowHistory?: WorkflowEvent[];
}

export interface Draft {
  id: string;
  entityType: EntityType;
  recordId: string;
  recordDescription: string;
  changes: AttributeChange[];
  createdAt: string;
  createdBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  entityType: EntityType;
  recordId: string;
  details: string;
  changePayload?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

// ===== Operational Entities =====

export interface SyncRun {
  runId: string;
  startedAt: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  recordsProcessed: number;
  recordsFailed: number;
}

export interface FieldMapping {
  sourceField: string;
  targetAttribute: string;
  mappingStatus: 'Mapped' | 'Unmapped' | 'Auto-mapped';
}

export interface SourceSystem {
  id: SourceSystemId;
  name: string;
  type: 'PostgreSQL' | 'API' | 'File' | 'REST API';
  status: 'Connected' | 'Active' | 'Disconnected';
  healthStatus: 'Healthy' | 'Degraded' | 'Down';
  lastSyncAt: string;
  recordCount: number;
  syncHistory: SyncRun[];
  fieldMappings: FieldMapping[];
}

export interface InterfaceRun {
  runAt: string;
  status: InterfaceStatus;
  recordsProcessed: number;
  errorMessage?: string;
}

export interface InterfaceRecord {
  id: string;
  name: string;
  direction: 'Inbound' | 'Outbound';
  sourceSystem: string;
  targetSystem: string;
  schedule: string;
  lastRunAt: string;
  lastRunStatus: InterfaceStatus;
  nextRunAt: string;
  recordsLastSync: number;
  runHistory: InterfaceRun[];
}

export interface Anomaly {
  id: string;
  entityType: EntityType;
  anomalyType: string;
  severity: 'High' | 'Medium' | 'Low';
  detectedAt: string;
  affectedRecordCount: number;
  status: AnomalyStatus;
  description: string;
  affectedRecordIds: string[];
}

// ===== Support Entities =====

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  entityPermissions: EntityType[];
  status: 'Active' | 'Inactive';
  lastLoginAt: string;
  avatarInitials: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

// ===== Component Props =====

export interface DQBadgeProps {
  score: number;
  size?: 'small' | 'default';
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
}

// ===== Filter State Contracts =====

export interface EntityBrowseFilters {
  search: string;
  category: SparePartCategory | '';
  manufacturer: string;
  status: EntityStatus | VendorStatus | EquipmentStatus | '';
  dqScoreMin: number;
  dqScoreMax: number;
  sourceSystem: SourceSystemId | '';
  lastModifiedFrom: string;
  lastModifiedTo: string;
  assignedSteward: string;
}

export interface MatchingProposalFilters {
  confidenceMin: number;
  confidenceMax: number;
  entityType: EntityType | '';
  proposedAction: 'Merge' | 'Split' | '';
  source: 'Rule' | 'AI' | '';
  slaStatus: SLAStatus | '';
}

export interface DQIssueFilters {
  entityType: EntityType | '';
  severity: 'Error' | 'Warning' | '';
  slaStatus: SLAStatus | '';
  assignedSteward: string;
  dateFrom: string;
  dateTo: string;
}

export interface AuditLogFilters {
  dateFrom: string;
  dateTo: string;
  userId: string;
  action: AuditAction | '';
  entityType: EntityType | '';
  recordIdSearch: string;
}
