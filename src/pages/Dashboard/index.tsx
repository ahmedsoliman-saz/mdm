import { Row, Col, Card, Statistic, Table, Tag, Timeline, Typography, Space } from 'antd'
import { ClockCircleOutlined, ExclamationCircleOutlined, TeamOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { tasks } from '../../data/tasks'
import { anomalies } from '../../data/anomalies'
import { auditLog } from '../../data/auditLog'
import { sourceSystems } from '../../data/sourceSystems'
import { spareParts } from '../../data/spareParts'
import { vendors } from '../../data/vendors'
import { equipment } from '../../data/equipment'
import { users } from '../../data/users'
import { formatRelativeTime } from '../../utils/formatDate'
import type { AuditAction } from '../../types'

const { Title, Text } = Typography

const sparklineData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  sp: [86, 85, 87, 88, 87, 89, 87][i],
  v: [91, 92, 91, 93, 92, 92, 92][i],
  eq: [77, 78, 76, 79, 78, 80, 79][i],
}))

export default function Dashboard() {
  const navigate = useNavigate()

  const pendingMyAction = tasks.filter((t: { assignedTo: string; status: string }) => t.assignedTo === 'u-001' && t.status === 'Open').length
  const approachingSLA = tasks.filter((t: { slaStatus: string }) => t.slaStatus === 'Approaching').length
  const pastSLA = tasks.filter((t: { slaStatus: string }) => t.slaStatus === 'Breached').length
  const totalOpen = tasks.filter((t: { status: string }) => t.status === 'Open' || t.status === 'In Progress').length

  const healthColor = (h: string) => {
    if (h === 'Healthy') return 'green'
    if (h === 'Degraded') return 'orange'
    return 'red'
  }

  const sourceColumns = [
    { title: 'Source System', dataIndex: 'name', key: 'name' },
    {
      title: 'Health',
      dataIndex: 'healthStatus',
      key: 'health',
      render: (h: string) => <Tag color={healthColor(h)}>{h}</Tag>,
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Last Sync',
      dataIndex: 'lastSyncAt',
      key: 'lastSync',
      render: (v: string) => formatRelativeTime(v),
    },
    {
      title: 'Records',
      dataIndex: 'recordCount',
      key: 'records',
      render: (v: number) => v.toLocaleString(),
    },
  ]

  const topAnomalies = anomalies
    .filter((a: { severity: string }) => a.severity === 'High' || a.severity === 'Medium')
    .slice(0, 3)

  const getUserName = (id: string) => {
    const u = users.find((u2: { id: string }) => u2.id === id)
    return u ? u.name : id
  }

  const actionColor = (action: AuditAction) => {
    switch (action) {
      case 'Created': return 'green'
      case 'Updated': return 'blue'
      case 'Approved': return 'green'
      case 'Rejected': return 'red'
      case 'Merged': return 'purple'
      case 'Exported': return 'cyan'
      default: return 'default'
    }
  }

  const recentLog = auditLog.slice(0, 18)

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => navigate('/governance/tasks')}
            style={{ borderLeft: '3px solid #1677ff' }}
          >
            <Statistic
              title="Pending My Action"
              value={pendingMyAction}
              valueStyle={{ color: '#1677ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => navigate('/governance/tasks')}
            style={{ borderLeft: '3px solid #faad14' }}
          >
            <Statistic
              title="Approaching SLA"
              value={approachingSLA}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => navigate('/governance/tasks')}
            style={{ borderLeft: '3px solid #ff4d4f' }}
          >
            <Statistic
              title="Past SLA"
              value={pastSLA}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => navigate('/governance/tasks')}
            style={{ borderLeft: '3px solid #8c8c8c' }}
          >
            <Statistic
              title="Total Open"
              value={totalOpen}
              valueStyle={{ color: '#595959' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="Spare Parts DQ" size="small" extra={<Text strong style={{ color: '#52c41a' }}>87.3%</Text>}>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={sparklineData}>
                <XAxis dataKey="day" hide />
                <Tooltip />
                <Line type="monotone" dataKey="sp" stroke="#52c41a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>7-day trend</Text>
              <Text style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> +1.2%</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Vendors DQ" size="small" extra={<Text strong style={{ color: '#52c41a' }}>92.1%</Text>}>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={sparklineData}>
                <XAxis dataKey="day" hide />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#52c41a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>7-day trend</Text>
              <Text style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> +0.5%</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Equipment DQ" size="small" extra={<Text strong style={{ color: '#faad14' }}>78.6%</Text>}>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={sparklineData}>
                <XAxis dataKey="day" hide />
                <Tooltip />
                <Line type="monotone" dataKey="eq" stroke="#faad14" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>7-day trend</Text>
              <Text style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> +2.1%</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Spare Parts" value={spareParts.length} suffix="records" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Vendors" value={vendors.length} suffix="records" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Equipment" value={equipment.length} suffix="records" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Total Records" value={spareParts.length + vendors.length + equipment.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Source System Health" size="small">
            <Table
              dataSource={sourceSystems}
              columns={sourceColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Anomaly Alerts"
            size="small"
            extra={<a onClick={() => navigate('/analytics/anomalies')}>View all</a>}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {topAnomalies.map((a) => (
                <Card
                  key={a.id}
                  size="small"
                  style={{ background: '#fafafa', cursor: 'pointer' }}
                  onClick={() => navigate('/analytics/anomalies')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13 }}>{a.anomalyType}</Text>
                    <Tag color={a.severity === 'High' ? 'red' : 'orange'}>{a.severity}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{a.affectedRecordCount} records affected</Text>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Activity" size="small" style={{ maxHeight: 360, overflow: 'auto' }}>
            <Timeline
              items={recentLog.map((entry) => ({
                color: actionColor(entry.action) === 'default' ? 'gray' : actionColor(entry.action),
                children: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Tag color={actionColor(entry.action)} style={{ fontSize: 11 }}>{entry.action}</Tag>
                      <Text style={{ fontSize: 13 }}>{getUserName(entry.user)}</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}> {entry.details}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>{formatRelativeTime(entry.timestamp)}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
