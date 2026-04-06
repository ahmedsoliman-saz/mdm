import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography, Descriptions, Tag, Tabs, Table, Tooltip, Button, Modal, Space, Dropdown, Card, Row, Col,
} from 'antd'
import { ArrowLeftOutlined, MoreOutlined, DatabaseOutlined } from '@ant-design/icons'
import { spareParts } from '../../data/spareParts'
import { vendors } from '../../data/vendors'
import { equipment } from '../../data/equipment'
import { sourceSystems } from '../../data/sourceSystems'
import DQBadge from '../../components/DQBadge'
import { formatDate } from '../../utils/formatDate'

const { Title, Text } = Typography

const mockVersions = [
  { version: 8, date: '2026-04-06T09:15:00Z', user: 'Ahmed Al-Rashid', summary: 'Updated manufacturer name' },
  { version: 7, date: '2026-04-03T14:30:00Z', user: 'Sarah Chen', summary: 'Corrected unit of measure' },
  { version: 6, date: '2026-03-28T10:00:00Z', user: 'System', summary: 'Auto-synced from AMOS' },
  { version: 5, date: '2026-03-22T16:45:00Z', user: 'Ahmed Al-Rashid', summary: 'Steward override on lead time' },
  { version: 4, date: '2026-03-15T11:20:00Z', user: 'System', summary: 'DQ score recalculated' },
  { version: 3, date: '2026-03-10T08:30:00Z', user: 'Sarah Chen', summary: 'Category corrected' },
  { version: 2, date: '2026-03-05T09:00:00Z', user: 'System', summary: 'Initial AMOS sync' },
  { version: 1, date: '2026-03-01T12:00:00Z', user: 'System', summary: 'Golden record created' },
]

const mockDiffChanges = [
  { attribute: 'Manufacturer', oldVal: 'Wärtsilä', newVal: 'Wärtsilä Corporation' },
  { attribute: 'Unit Cost (USD)', oldVal: '34,200.00', newVal: '34,500.00' },
]

const dqDimensions = [
  { dimension: 'Completeness', score: 92 },
  { dimension: 'Uniqueness', score: 88 },
  { dimension: 'Validity', score: 95 },
  { dimension: 'Consistency', score: 79 },
  { dimension: 'Timeliness', score: 85 },
]

const failingRules = [
  { rule: 'Manufacturer format consistency', severity: 'Warning' },
  { rule: 'Lead time within acceptable range (1–120 days)', severity: 'Pass' },
]

const mockSourceInstances = [
  {
    system: 'AMOS',
    partNumber: 'SP-001001',
    description: 'Hydraulic Pump Assembly',
    manufacturer: 'Wärtsilä',
    unitCost: '34500.00',
    status: 'Matched',
  },
  {
    system: 'SAP ERP',
    partNumber: 'SP-001001',
    description: 'Hydraulic Pump Assy',
    manufacturer: 'Wärtsilä Corp.',
    unitCost: '34200.00',
    status: 'Diverging',
  },
]

export default function RecordDetail() {
  const { entityType, id } = useParams()
  const navigate = useNavigate()
  const [diffOpen, setDiffOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<typeof mockVersions[0] | null>(null)

  const record = useMemo(() => {
    if (entityType === 'vendors') return vendors.find(v => v.id === id)
    if (entityType === 'equipment') return equipment.find(e => e.id === id)
    return spareParts.find(sp => sp.id === id)
  }, [entityType, id])

  if (!record) {
    return <div style={{ padding: 24 }}><Text>Record not found</Text></div>
  }

  const isSparePart = entityType === 'spare-parts' || !entityType
  const sp = isSparePart ? record as typeof spareParts[0] : null

  const backPath = entityType ? `/entities/${entityType}` : '/entities/spare-parts'

  const getSourceInfo = (source: string) => {
    const sys = sourceSystems.find(s => s.id === source)
    return sys ? sys.name : source
  }

  const attrWithSource = (label: string, value: string | number | boolean, source: string, rule?: string) => (
    <Descriptions.Item
      label={
        <Space size={4}>
          {label}
          <Tooltip title={`Source: ${getSourceInfo(source)}${rule ? ` | Rule: ${rule}` : ''}`}>
            <DatabaseOutlined style={{ color: '#bfbfbf', fontSize: 11 }} />
          </Tooltip>
        </Space>
      }
    >
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
    </Descriptions.Item>
  )

  const lineageNodes = [
    { id: 'amos', label: 'AMOS', type: 'source' },
    { id: 'sap', label: 'SAP ERP', type: 'source' },
    { id: 'si1', label: 'AMOS Instance', type: 'instance' },
    { id: 'si2', label: 'SAP Instance', type: 'instance' },
    { id: 'golden', label: `${id}`, type: 'golden' },
  ]

  const goldenTab = (
    <Descriptions bordered size="small" column={2}>
      {sp && attrWithSource('Part Number', sp.partNumber, sp.sourceSystem, 'Exact match')}
      {sp && attrWithSource('Description', sp.description, sp.sourceSystem, 'Longest text')}
      {sp && attrWithSource('Category', sp.category, sp.sourceSystem, 'Priority source')}
      {sp && attrWithSource('Manufacturer', sp.manufacturer, sp.sourceSystem, 'AMOS priority')}
      {sp && attrWithSource('Unit of Measure', sp.unitOfMeasure, sp.sourceSystem, 'Auto-mapped')}
      {sp && attrWithSource('Lead Time (days)', sp.leadTimeDays, sp.sourceSystem, 'Max value')}
      {sp && attrWithSource('Unit Cost (USD)', `$${sp.unitCostUsd.toLocaleString()}`, sp.sourceSystem, 'Latest value')}
      {sp && attrWithSource('Critical Spare', sp.criticalSpare, sp.sourceSystem, 'Any true')}
      {sp && attrWithSource('Status', sp.status, sp.sourceSystem)}
      {sp && attrWithSource('DQ Score', sp.dqScore, sp.sourceSystem)}
      {sp && attrWithSource('Source System', getSourceInfo(sp.sourceSystem), sp.sourceSystem)}
      {sp && attrWithSource('Last Updated', formatDate(sp.lastUpdated), sp.sourceSystem)}
      {sp && attrWithSource('Workflow State', sp.workflowState, sp.sourceSystem)}
    </Descriptions>
  )

  const sourceInstancesTab = mockSourceInstances.length > 0 ? (
    <Table
      dataSource={mockSourceInstances}
      rowKey="system"
      size="small"
      pagination={false}
      columns={[
        { title: 'Source System', dataIndex: 'system', key: 'system', render: (v: string) => <Tag>{v}</Tag> },
        { title: 'Part Number', dataIndex: 'partNumber', key: 'partNumber' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Manufacturer', dataIndex: 'manufacturer', key: 'manufacturer' },
        { title: 'Unit Cost', dataIndex: 'unitCost', key: 'unitCost' },
        { title: 'Match Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'Matched' ? 'green' : 'orange'}>{v}</Tag> },
      ]}
    />
  ) : (
    <Text type="secondary">No source instances found for this record.</Text>
  )

  const dqValidationTab = (
    <div>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {dqDimensions.map(d => (
          <Col span={4} key={d.dimension}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: d.score >= 85 ? '#52c41a' : d.score >= 60 ? '#faad14' : '#ff4d4f' }}>{d.score}%</div>
                <Text type="secondary" style={{ fontSize: 11 }}>{d.dimension}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Title level={5}>Failing Rules</Title>
      <Table
        dataSource={failingRules}
        rowKey="rule"
        size="small"
        pagination={false}
        columns={[
          { title: 'Rule', dataIndex: 'rule', key: 'rule' },
          { title: 'Status', dataIndex: 'severity', key: 'severity', render: (v: string) => <Tag color={v === 'Pass' ? 'green' : 'orange'}>{v}</Tag> },
        ]}
      />
    </div>
  )

  const versionColumns = [
    { title: 'Version', dataIndex: 'version', key: 'version', render: (v: number) => `v${v}` },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => formatDate(v) },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
  ]

  const versionHistoryTab = (
    <div>
      <Table
        dataSource={mockVersions}
        rowKey="version"
        size="small"
        pagination={false}
        columns={versionColumns}
        onRow={(record) => ({
          onClick: () => { setSelectedVersion(record); setDiffOpen(true) },
          style: { cursor: 'pointer' },
        })}
      />
      <Modal
        open={diffOpen}
        title={`Version Diff — v${selectedVersion?.version}`}
        onCancel={() => setDiffOpen(false)}
        footer={null}
        width={700}
      >
        {selectedVersion && (
          <div>
            <Text type="secondary">{selectedVersion.summary} — {selectedVersion.user} — {formatDate(selectedVersion.date)}</Text>
            <Table
              style={{ marginTop: 12 }}
              dataSource={mockDiffChanges}
              rowKey="attribute"
              size="small"
              pagination={false}
              columns={[
                { title: 'Attribute', dataIndex: 'attribute', key: 'attribute' },
                { title: 'Old Value', dataIndex: 'oldVal', key: 'oldVal', render: (v: string) => <Text delete type="danger">{v}</Text> },
                { title: 'New Value', dataIndex: 'newVal', key: 'newVal', render: (v: string) => <Text type="success">{v}</Text> },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  )

  const lineageTab = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      <div style={{ display: 'flex', gap: 40, marginBottom: 24 }}>
        {lineageNodes.filter(n => n.type === 'source').map(n => (
          <div key={n.id} style={{
            padding: '12px 24px',
            background: '#e6f4ff',
            border: '1px solid #91caff',
            borderRadius: 8,
            textAlign: 'center',
          }}>
            <DatabaseOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <div style={{ fontSize: 13, marginTop: 4 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 20, color: '#bfbfbf' }}>↓</div>
      <div style={{ display: 'flex', gap: 40, marginTop: 12, marginBottom: 24 }}>
        {lineageNodes.filter(n => n.type === 'instance').map(n => (
          <div key={n.id} style={{
            padding: '10px 20px',
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 12,
          }}>
            {n.label}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 20, color: '#bfbfbf' }}>↓</div>
      <div style={{ marginTop: 12 }}>
        <div style={{
          padding: '14px 32px',
          background: '#1677ff',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
          fontWeight: 600,
        }}>
          Golden Record: {id}
        </div>
      </div>
    </div>
  )

  const statusColor = () => {
    if ('status' in record) {
      const s = record.status
      if (s === 'Active' || s === 'Approved' || s === 'Operational') return 'green'
      if (s === 'Obsolete' || s === 'Suspended' || s === 'Decommissioned') return 'red'
      return 'orange'
    }
    return 'default'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backPath)}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{id}</Title>
          {'status' in record && <Tag color={statusColor()}>{record.status as string}</Tag>}
          {'dqScore' in record && <DQBadge score={(record as { dqScore: number }).dqScore} />}
          {'workflowState' in record && <Tag>{(record as { workflowState: string }).workflowState}</Tag>}
        </Space>
        <Dropdown
          menu={{
            items: [
              { key: 'merge', label: 'Merge' },
              { key: 'split', label: 'Split' },
              { key: 'edit', label: 'Edit Record' },
              { key: 'export', label: 'Export' },
            ],
          }}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      </div>

      {'description' in record && (
        <Text type="secondary" style={{ fontSize: 15, display: 'block', marginBottom: 16 }}>
          {(record as { description?: string }).description || (record as { name?: string }).name}
        </Text>
      )}

      <Tabs
        items={[
          { key: 'golden', label: 'Golden Record', children: goldenTab },
          { key: 'sources', label: 'Source Instances', children: sourceInstancesTab },
          { key: 'related', label: 'Related Records', children: <Text type="secondary">No related records linked.</Text> },
          { key: 'dq', label: 'DQ Validation', children: dqValidationTab },
          { key: 'versions', label: 'Version History', children: versionHistoryTab },
          { key: 'lineage', label: 'Lineage', children: lineageTab },
        ]}
      />
    </div>
  )
}
