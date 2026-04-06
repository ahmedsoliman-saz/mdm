import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  InboxOutlined,
  FileAddOutlined,
  CloudUploadOutlined,
  ApiOutlined,
  DesktopOutlined,
  AlertOutlined,
  ProfileOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  TeamOutlined,
  AuditOutlined,
  ControlOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const menuItems = [
  {
    key: 'home',
    label: 'Home',
    type: 'group' as const,
    children: [
      { key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    ],
  },
  {
    key: 'data',
    label: 'Data',
    type: 'group' as const,
    children: [
      { key: '/entities/spare-parts', label: 'Entity Browse', icon: <DatabaseOutlined /> },
    ],
  },
  {
    key: 'governance',
    label: 'Governance',
    type: 'group' as const,
    children: [
      { key: '/governance/matching', label: 'Matching Proposals', icon: <SafetyCertificateOutlined /> },
      { key: '/governance/dq-issues', label: 'DQ Issue Queue', icon: <FileSearchOutlined /> },
      { key: '/governance/tasks', label: 'Task Inbox', icon: <InboxOutlined /> },
      { key: '/governance/drafts', label: 'Draft Staging', icon: <FileAddOutlined /> },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    type: 'group' as const,
    children: [
      { key: '/operations/bulk-onboarding', label: 'Bulk Onboarding', icon: <CloudUploadOutlined /> },
      { key: '/operations/sources', label: 'Source Systems', icon: <ApiOutlined /> },
      { key: '/operations/interfaces', label: 'Interface Monitor', icon: <DesktopOutlined /> },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    type: 'group' as const,
    children: [
      { key: '/analytics/dq-overview', label: 'Data Quality', icon: <BarChartOutlined /> },
      { key: '/analytics/anomalies', label: 'Anomaly Overview', icon: <AlertOutlined /> },
      { key: '/analytics/profiling', label: 'Profile Inspector', icon: <ProfileOutlined /> },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    type: 'group' as const,
    children: [
      { key: '/admin/entity-model', label: 'Entity Model', icon: <ApartmentOutlined /> },
      { key: '/admin/workflows', label: 'Workflow Config', icon: <BranchesOutlined /> },
      { key: '/admin/rbac', label: 'RBAC Console', icon: <TeamOutlined /> },
      { key: '/admin/audit-log', label: 'Audit Log', icon: <AuditOutlined /> },
      { key: '/admin/settings', label: 'Tenant Settings', icon: <ControlOutlined /> },
    ],
  },
]

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = location.pathname

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={232}
      collapsedWidth={56}
      style={{
        borderRight: '1px solid #e8e8e8',
        background: '#fff',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{
          borderRight: 0,
          marginTop: 4,
        }}
      />
    </Sider>
  )
}
