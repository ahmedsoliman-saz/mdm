import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'

const routeLabelMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/entities/spare-parts': 'Spare Parts',
  '/entities/vendors': 'Vendors',
  '/entities/equipment': 'Equipment',
  '/governance/matching': 'Matching Proposals',
  '/governance/dq-issues': 'DQ Issue Queue',
  '/governance/tasks': 'Task Inbox',
  '/governance/drafts': 'Draft Staging',
  '/operations/bulk-onboarding': 'Bulk Onboarding',
  '/operations/sources': 'Source Systems',
  '/operations/interfaces': 'Interface Monitor',
  '/analytics/dq-overview': 'Data Quality Overview',
  '/analytics/anomalies': 'Anomaly Overview',
  '/analytics/profiling': 'Profile Inspector',
  '/admin/entity-model': 'Entity Model Config',
  '/admin/workflows': 'Workflow Config',
  '/admin/rbac': 'RBAC Console',
  '/admin/audit-log': 'Audit Log',
  '/admin/settings': 'Tenant Settings',
}

const sectionLabels: Record<string, string> = {
  entities: 'Data',
  governance: 'Governance',
  operations: 'Operations',
  analytics: 'Analytics',
  admin: 'Admin',
}

function buildBreadcrumbs(pathname: string) {
  const items: { title: React.ReactNode }[] = [{ title: <Link to="/dashboard">Home</Link> }]
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return items

  const section = sectionLabels[segments[0]]
  if (section) {
    items.push({ title: <span>{section}</span> })
  }

  const fullPath = '/' + segments.join('/')
  const label = routeLabelMap[fullPath]
  if (label) {
    items.push({ title: <span>{label}</span> })
  }

  if (segments[0] === 'entities' && segments[2] === 'records' && segments[3]) {
    items.push({ title: <span>{segments[3]}</span> })
  }

  if (segments[0] === 'compare') {
    items.push({ title: <span>Compare Records</span> })
  }

  return items
}

export default function BreadcrumbBar() {
  const location = useLocation()
  const items = buildBreadcrumbs(location.pathname)

  return (
    <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <AntBreadcrumb items={items} />
    </div>
  )
}
