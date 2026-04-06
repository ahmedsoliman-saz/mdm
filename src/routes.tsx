import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import EntityBrowse from './pages/EntityBrowse'
import RecordDetail from './pages/RecordDetail'
import RecordComparison from './pages/RecordComparison'
import MatchingProposals from './pages/MatchingProposals'
import DQIssueQueue from './pages/DQIssueQueue'
import TaskInbox from './pages/TaskInbox'
import DraftStaging from './pages/DraftStaging'
import BulkOnboarding from './pages/BulkOnboarding'
import SourceSystems from './pages/SourceSystems'
import InterfaceMonitor from './pages/InterfaceMonitor'
import DQOverview from './pages/DQOverview'
import AnomalyOverview from './pages/AnomalyOverview'
import ProfileInspector from './pages/ProfileInspector'
import EntityModelConfig from './pages/EntityModelConfig'
import WorkflowConfig from './pages/WorkflowConfig'
import RBACConsole from './pages/RBACConsole'
import AuditLog from './pages/AuditLog'
import TenantSettings from './pages/TenantSettings'
import MergeOperations from './pages/MergeOperations'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'entities/spare-parts', element: <EntityBrowse /> },
      { path: 'entities/vendors', element: <EntityBrowse /> },
      { path: 'entities/equipment', element: <EntityBrowse /> },
      { path: 'entities/:entityType/records/:id', element: <RecordDetail /> },
      { path: 'compare/:id1/:id2', element: <RecordComparison /> },
      { path: 'governance/matching', element: <MatchingProposals /> },
      { path: 'governance/dq-issues', element: <DQIssueQueue /> },
      { path: 'governance/tasks', element: <TaskInbox /> },
      { path: 'governance/drafts', element: <DraftStaging /> },
      { path: 'operations/bulk-onboarding', element: <BulkOnboarding /> },
      { path: 'operations/sources', element: <SourceSystems /> },
      { path: 'operations/interfaces', element: <InterfaceMonitor /> },
      { path: 'analytics/dq-overview', element: <DQOverview /> },
      { path: 'analytics/anomalies', element: <AnomalyOverview /> },
      { path: 'analytics/profiling', element: <ProfileInspector /> },
      { path: 'admin/entity-model', element: <EntityModelConfig /> },
      { path: 'admin/workflows', element: <WorkflowConfig /> },
      { path: 'admin/rbac', element: <RBACConsole /> },
      { path: 'admin/audit-log', element: <AuditLog /> },
      { path: 'admin/settings', element: <TenantSettings /> },
      { path: 'merge/:id', element: <MergeOperations /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
