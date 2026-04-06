import { useState, useMemo } from 'react'
import { Typography, Table, Tag, Select, Button, Modal, Card, Row, Col, Space, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { dqIssues } from '../../data/dqIssues'
import { users } from '../../data/users'
import DQBadge from '../../components/DQBadge'
import EmptyState from '../../components/EmptyState'

const { Title, Text } = Typography

export default function DQIssueQueue() {
  const navigate = useNavigate()
  const [entityFilter, setEntityFilter] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('')
  const [slaFilter, setSlaFilter] = useState<string>('')
  const [stewardFilter, setStewardFilter] = useState<string>('')
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<typeof dqIssues[0] | null>(null)
  const [assignee, setAssignee] = useState<string>('')
  const [slaDate, setSlaDate] = useState<string>('')

  const filtered = useMemo(() => {
    return dqIssues.filter(issue => {
      if (entityFilter && issue.entityType !== entityFilter) return false
      if (severityFilter && issue.severity !== severityFilter) return false
      if (slaFilter && issue.slaStatus !== slaFilter) return false
      if (stewardFilter && issue.assignedSteward !== stewardFilter) return false
      return true
    })
  }, [entityFilter, severityFilter, slaFilter, stewardFilter])

  const getUserName = (id: string | undefined) => {
    if (!id) return <Space><Tag color="orange">Unassigned</Tag></Space>
    const u = users.find(u2 => u2.id === id)
    return u ? u.name : id
  }

  const slaColor = (status: string) => {
    if (status === 'Breached') return 'red'
    if (status === 'Approaching') return 'orange'
    return 'green'
  }

  const clearFilters = () => {
    setEntityFilter('')
    setSeverityFilter('')
    setSlaFilter('')
    setStewardFilter('')
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a>{id}</a>,
    },
    { title: 'Entity', dataIndex: 'entityType', key: 'entity', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Record',
      dataIndex: 'recordId',
      key: 'record',
      render: (id: string, record: typeof dqIssues[0]) => (
        <a onClick={() => navigate(`/entities/${record.entityType}/records/${id}`)}>{id}</a>
      ),
    },
    { title: 'DQ Score', dataIndex: 'dqScore', key: 'dq', render: (v: number) => <DQBadge score={v} size="small" /> },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (v: string) => <Tag color={v === 'Error' ? 'red' : 'orange'}>{v}</Tag> },
    { title: 'Rule Failed', dataIndex: 'ruleFailed', key: 'rule', ellipsis: true },
    { title: 'Detected', dataIndex: 'dateDetected', key: 'detected', render: (v: string) => new Date(v).toLocaleDateString() },
    { title: 'Steward', dataIndex: 'assignedSteward', key: 'steward', render: (v: string | undefined) => getUserName(v) },
    { title: 'SLA', dataIndex: 'slaStatus', key: 'sla', render: (v: string) => <Tag color={slaColor(v)}>{v}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'Open' ? 'blue' : v === 'In Progress' ? 'orange' : 'green'}>{v}</Tag> },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: typeof dqIssues[0]) => (
        <Button size="small" onClick={(e) => { e.stopPropagation(); setSelectedIssue(record); setCreateTaskOpen(true) }}>Create Task</Button>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>DQ Issue Queue</Title>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Row gutter={[12, 8]}>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>Entity Type</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={entityFilter || undefined} onChange={v => setEntityFilter(v || '')} options={['spare-parts', 'vendors', 'equipment'].map(e => ({ value: e, label: e }))} size="small" />
          </Col>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>Severity</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={severityFilter || undefined} onChange={v => setSeverityFilter(v || '')} options={[{ value: 'Error', label: 'Error' }, { value: 'Warning', label: 'Warning' }]} size="small" />
          </Col>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>SLA Status</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={slaFilter || undefined} onChange={v => setSlaFilter(v || '')} options={[{ value: 'On Track', label: 'On Track' }, { value: 'Approaching', label: 'Approaching' }, { value: 'Breached', label: 'Breached' }]} size="small" />
          </Col>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>Steward</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={stewardFilter || undefined} onChange={v => setStewardFilter(v || '')} options={users.map(u => ({ value: u.id, label: u.name }))} size="small" />
          </Col>
          <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button size="small" onClick={clearFilters}>Clear</Button>
          </Col>
        </Row>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No DQ issues" description="No issues match your filters" actionLabel="Clear Filters" onAction={clearFilters} />
      ) : (
        <Table dataSource={filtered} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 20, showTotal: t => `${t} issues` }} />
      )}

      <Modal
        open={createTaskOpen}
        title="Create Task"
        onCancel={() => setCreateTaskOpen(false)}
        onOk={() => { message.success('Task created'); setCreateTaskOpen(false) }}
        okText="Create Task"
      >
        {selectedIssue && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Tag>{selectedIssue.entityType}</Tag>
              <Text>{selectedIssue.recordId}</Text>
              <DQBadge score={selectedIssue.dqScore} size="small" />
            </Space>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary">Rule Failed: {selectedIssue.ruleFailed}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Assignee</Text>
              <Select style={{ width: '100%' }} placeholder="Select assignee" value={assignee || undefined} onChange={setAssignee} options={users.map(u => ({ value: u.id, label: u.name }))} />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>SLA Date</Text>
              <Input type="date" value={slaDate} onChange={e => setSlaDate(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
