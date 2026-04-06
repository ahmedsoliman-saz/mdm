import { Tabs, Table, Card, Row, Col, Tag, Typography, Badge, Space, Avatar } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { users } from '../../data/users';
import { formatDateTime } from '../../utils/formatDate';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../types';

const { Title, Text } = Typography;

// ===== Roles Definition =====

type PermissionLevel = 'admin' | 'approve' | 'write' | 'read';

interface RoleDefinition {
  name: string;
  description: string;
  userCount: number;
  color: string;
  permissions: string[];
}

const roles: RoleDefinition[] = [
  {
    name: 'Platform Admin',
    description: 'Full system access including RBAC, tenant settings, and all administrative functions.',
    userCount: 1,
    color: 'purple',
    permissions: ['All permissions', 'RBAC Management', 'Tenant Settings', 'Audit Log'],
  },
  {
    name: 'Senior Steward',
    description: 'Can edit, approve, merge records, and manage data quality across all entity types.',
    userCount: 1,
    color: 'blue',
    permissions: ['Record Edit', 'Match Approve', 'Merge Execute', 'DQ Review', 'Bulk Onboarding'],
  },
  {
    name: 'Data Steward',
    description: 'Can edit records and review data quality issues for assigned entity types.',
    userCount: 1,
    color: 'cyan',
    permissions: ['Record Edit', 'DQ Review', 'Entity Browse', 'Draft Management'],
  },
  {
    name: 'Approver',
    description: 'Can approve or reject match proposals, merges, and draft changes.',
    userCount: 1,
    color: 'green',
    permissions: ['Match Approve', 'Merge Approve', 'Draft Approve', 'Entity Browse'],
  },
  {
    name: 'Viewer',
    description: 'Read-only access to browse entities, view records, and access dashboards.',
    userCount: 1,
    color: 'default',
    permissions: ['Entity Browse', 'Record View', 'Dashboard View', 'Report View'],
  },
  {
    name: 'Fleet Manager',
    description: 'Custom role for fleet operations. Can manage equipment entities and view spare parts.',
    userCount: 0,
    color: 'orange',
    permissions: ['Equipment Edit', 'Spare Parts View', 'Bulk Onboarding', 'Interface Monitor'],
  },
];

// ===== Permissions Matrix Data =====

const features = [
  'Entity Browse',
  'Record Edit',
  'Match Approve',
  'Merge Execute',
  'DQ Review',
  'Bulk Onboarding',
  'Source Config',
  'Workflow Config',
  'RBAC Management',
  'Audit Log',
  'Tenant Settings',
] as const;

type Feature = (typeof features)[number];

const permissionMatrix: Record<Feature, Record<string, PermissionLevel | null>> = {
  'Entity Browse':    { 'Platform Admin': 'admin',   'Senior Steward': 'read',    'Data Steward': 'read',  'Approver': 'read',    'Viewer': 'read',  'Fleet Manager': 'read' },
  'Record Edit':      { 'Platform Admin': 'admin',   'Senior Steward': 'write',   'Data Steward': 'write', 'Approver': null,      'Viewer': null,    'Fleet Manager': 'write' },
  'Match Approve':    { 'Platform Admin': 'admin',   'Senior Steward': 'approve', 'Data Steward': null,    'Approver': 'approve', 'Viewer': null,    'Fleet Manager': null },
  'Merge Execute':    { 'Platform Admin': 'admin',   'Senior Steward': 'approve', 'Data Steward': null,    'Approver': 'approve', 'Viewer': null,    'Fleet Manager': null },
  'DQ Review':        { 'Platform Admin': 'admin',   'Senior Steward': 'write',   'Data Steward': 'write', 'Approver': 'read',    'Viewer': 'read',  'Fleet Manager': 'read' },
  'Bulk Onboarding':  { 'Platform Admin': 'admin',   'Senior Steward': 'write',   'Data Steward': null,    'Approver': null,      'Viewer': null,    'Fleet Manager': 'write' },
  'Source Config':    { 'Platform Admin': 'admin',   'Senior Steward': 'read',    'Data Steward': null,    'Approver': null,      'Viewer': null,    'Fleet Manager': null },
  'Workflow Config':  { 'Platform Admin': 'admin',   'Senior Steward': 'read',    'Data Steward': null,    'Approver': null,      'Viewer': null,    'Fleet Manager': null },
  'RBAC Management':  { 'Platform Admin': 'admin',   'Senior Steward': null,      'Data Steward': null,    'Approver': null,      'Viewer': null,    'Fleet Manager': null },
  'Audit Log':        { 'Platform Admin': 'admin',   'Senior Steward': 'read',    'Data Steward': 'read',  'Approver': 'read',    'Viewer': null,    'Fleet Manager': null },
  'Tenant Settings':  { 'Platform Admin': 'admin',   'Senior Steward': null,      'Data Steward': null,    'Approver': null,      'Viewer': null,    'Fleet Manager': null },
};

const permissionColorMap: Record<PermissionLevel, string> = {
  admin: 'purple',
  approve: 'green',
  write: 'blue',
  read: 'default',
};

function PermissionTag({ level }: { level: PermissionLevel | null }) {
  if (!level) return <Text type="secondary">—</Text>;
  return (
    <Tag color={permissionColorMap[level]} icon={<CheckCircleFilled />}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Tag>
  );
}

// ===== Role badge color mapping =====

const roleBadgeColor: Record<string, string> = {
  'Platform Admin': 'purple',
  'Senior Steward': 'blue',
  'Data Steward': 'cyan',
  'Approver': 'green',
  'Viewer': 'default',
};

// ===== Users Tab =====

const userColumns: ColumnsType<User> = [
  {
    title: 'User',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record) => (
      <Space>
        <Avatar style={{ backgroundColor: '#1677ff' }}>{record.avatarInitials}</Avatar>
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
        </div>
      </Space>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => <Tag color={roleBadgeColor[role] ?? 'default'}>{role}</Tag>,
  },
  {
    title: 'Entity Permissions',
    dataIndex: 'entityPermissions',
    key: 'entityPermissions',
    render: (perms: string[]) => (
      <Space size={4} wrap>
        {perms.map((p) => (
          <Tag key={p}>{p}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Badge status={status === 'Active' ? 'success' : 'default'} text={status} />
    ),
  },
  {
    title: 'Last Login',
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
    render: (dt: string) => formatDateTime(dt),
  },
];

function UsersTab() {
  return (
    <Table<User>
      columns={userColumns}
      dataSource={users}
      rowKey="id"
      pagination={false}
      size="middle"
    />
  );
}

// ===== Roles Tab =====

function RolesTab() {
  return (
    <Row gutter={[16, 16]}>
      {roles.map((role) => (
        <Col xs={24} sm={12} lg={8} key={role.name}>
          <Card
            title={
              <Space>
                <Tag color={role.color}>{role.name}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                </Text>
              </Space>
            }
            size="small"
            style={{ height: '100%' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              {role.description}
            </Text>
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Key Permissions
              </Text>
              <Space size={[4, 4]} wrap>
                {role.permissions.map((p) => (
                  <Tag key={p} icon={<CheckCircleFilled />}>{p}</Tag>
                ))}
              </Space>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

// ===== Permissions Matrix Tab =====

interface MatrixRow {
  key: string;
  feature: Feature;
  [role: string]: PermissionLevel | null | string;
}

function PermissionsMatrixTab() {
  const roleNames = roles.map((r) => r.name);

  const columns: ColumnsType<MatrixRow> = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
      fixed: 'left',
      width: 180,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    ...roleNames.map((role) => ({
      title: role,
      dataIndex: role,
      key: role,
      align: 'center' as const,
      width: 140,
      render: (_: unknown, record: MatrixRow) => (
        <PermissionTag level={record[role] as PermissionLevel | null} />
      ),
    })),
  ];

  const dataSource: MatrixRow[] = features.map((feature) => ({
    key: feature,
    feature,
    ...permissionMatrix[feature],
  }));

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Text type="secondary">Legend:</Text>
        <Tag color="purple" icon={<CheckCircleFilled />}>Admin</Tag>
        <Tag color="green" icon={<CheckCircleFilled />}>Approve</Tag>
        <Tag color="blue" icon={<CheckCircleFilled />}>Write</Tag>
        <Tag icon={<CheckCircleFilled />}>Read</Tag>
        <Text type="secondary">— = No access</Text>
      </Space>
      <Table<MatrixRow>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: 1100 }}
      />
    </div>
  );
}

// ===== Main Component =====

export default function RBACConsole() {
  const items = [
    {
      key: 'users',
      label: `Users (${users.length})`,
      children: <UsersTab />,
    },
    {
      key: 'roles',
      label: `Roles (${roles.length})`,
      children: <RolesTab />,
    },
    {
      key: 'permissions',
      label: 'Permissions Matrix',
      children: <PermissionsMatrixTab />,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>RBAC Console</Title>
      <Tabs defaultActiveKey="users" items={items} />
    </div>
  );
}
