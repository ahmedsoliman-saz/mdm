import { useState, useMemo } from 'react'
import { Typography, Table, Tag, Slider, Select, Button, Modal, Drawer, Descriptions, Space, Input, Card, Row, Col, message } from 'antd'
import { matchingProposals } from '../../data/matchingProposals'
import { spareParts } from '../../data/spareParts'
import { users } from '../../data/users'
import EmptyState from '../../components/EmptyState'

const { Title, Text } = Typography

export default function MatchingProposals() {
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([0, 100])
  const [entityFilter, setEntityFilter] = useState<string>('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')
  const [slaFilter, setSlaFilter] = useState<string>('')
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkThreshold, setBulkThreshold] = useState(80)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<typeof matchingProposals[0] | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [survivorPreview, setSurvivorPreview] = useState(false)
  const [reason, setReason] = useState('')

  const filtered = useMemo(() => {
    return matchingProposals.filter(p => {
      if (p.confidenceScore < confidenceRange[0] || p.confidenceScore > confidenceRange[1]) return false
      if (entityFilter && p.entityType !== entityFilter) return false
      if (actionFilter && p.proposedAction !== actionFilter) return false
      if (sourceFilter && p.source !== sourceFilter) return false
      if (slaFilter) {
        if (slaFilter === 'On Track' && p.slaDaysRemaining <= 0) return false
        if (slaFilter === 'Approaching' && (p.slaDaysRemaining <= 0 || p.slaDaysRemaining > 3)) return false
        if (slaFilter === 'Breached' && p.slaDaysRemaining > 0) return false
      }
      return true
    })
  }, [confidenceRange, entityFilter, actionFilter, sourceFilter, slaFilter])

  const getUserName = (id: string) => {
    const u = users.find(u2 => u2.id === id)
    return u ? u.name : id
  }

  const slaColor = (days: number) => {
    if (days <= 0) return 'red'
    if (days <= 3) return 'orange'
    return 'green'
  }

  const confidenceTag = (score: number) => {
    if (score >= 90) return <Tag color="green">{score}%</Tag>
    if (score >= 60) return <Tag color="gold">{score}%</Tag>
    return <Tag color="red">{score}%</Tag>
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string, record: typeof matchingProposals[0]) => (
        <a onClick={() => { setSelectedProposal(record); setDrawerOpen(true) }}>{id}</a>
      ),
    },
    { title: 'Entity', dataIndex: 'entityType', key: 'entity', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Record A', dataIndex: 'recordADescription', key: 'recA', ellipsis: true },
    { title: 'Record B', dataIndex: 'recordBDescription', key: 'recB', ellipsis: true },
    { title: 'Confidence', dataIndex: 'confidenceScore', key: 'confidence', render: (v: number) => confidenceTag(v), sorter: (a: typeof matchingProposals[0], b: typeof matchingProposals[0]) => a.confidenceScore - b.confidenceScore },
    { title: 'Action', dataIndex: 'proposedAction', key: 'action', render: (v: string) => <Tag color={v === 'Merge' ? 'blue' : 'purple'}>{v}</Tag> },
    { title: 'Source', dataIndex: 'source', key: 'source', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'SLA Days', dataIndex: 'slaDaysRemaining', key: 'sla', render: (v: number) => <Tag color={slaColor(v)}>{v <= 0 ? 'Breached' : `${v}d`}</Tag> },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assigned', render: (v: string) => getUserName(v) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'Pending' ? 'blue' : v === 'Accepted' ? 'green' : v === 'Rejected' ? 'red' : 'orange'}>{v}</Tag> },
  ]

  const recordA = selectedProposal ? spareParts.find(sp => sp.id === selectedProposal.recordAId) : null
  const recordB = selectedProposal ? spareParts.find(sp => sp.id === selectedProposal.recordBId) : null

  const comparisonFields = useMemo(() => {
    if (!recordA || !recordB) return []
    return [
      { label: 'Part Number', a: recordA.partNumber, b: recordB.partNumber },
      { label: 'Description', a: recordA.description, b: recordB.description },
      { label: 'Category', a: recordA.category, b: recordB.category },
      { label: 'Manufacturer', a: recordA.manufacturer, b: recordB.manufacturer },
      { label: 'UoM', a: recordA.unitOfMeasure, b: recordB.unitOfMeasure },
      { label: 'Lead Time', a: `${recordA.leadTimeDays}d`, b: `${recordB.leadTimeDays}d` },
      { label: 'Unit Cost', a: `$${recordA.unitCostUsd}`, b: `$${recordB.unitCostUsd}` },
      { label: 'Critical', a: String(recordA.criticalSpare), b: String(recordB.criticalSpare) },
      { label: 'DQ Score', a: String(recordA.dqScore), b: String(recordB.dqScore) },
    ]
  }, [recordA, recordB])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Matching Proposals</Title>
        <Button type="primary" onClick={() => setBulkModalOpen(true)}>Accept All Above Threshold</Button>
      </div>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Row gutter={[12, 8]}>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>Confidence: {confidenceRange[0]}–{confidenceRange[1]}</Text>
            <Slider range min={0} max={100} value={confidenceRange} onChange={v => setConfidenceRange(v as [number, number])} />
          </Col>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>Entity Type</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={entityFilter || undefined} onChange={v => setEntityFilter(v || '')} options={['spare-parts', 'vendors', 'equipment'].map(e => ({ value: e, label: e }))} size="small" />
          </Col>
          <Col span={3}>
            <Text type="secondary" style={{ fontSize: 11 }}>Action</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={actionFilter || undefined} onChange={v => setActionFilter(v || '')} options={[{ value: 'Merge', label: 'Merge' }, { value: 'Split', label: 'Split' }]} size="small" />
          </Col>
          <Col span={3}>
            <Text type="secondary" style={{ fontSize: 11 }}>Source</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={sourceFilter || undefined} onChange={v => setSourceFilter(v || '')} options={[{ value: 'Rule', label: 'Rule' }, { value: 'AI', label: 'AI' }]} size="small" />
          </Col>
          <Col span={4}>
            <Text type="secondary" style={{ fontSize: 11 }}>SLA Status</Text>
            <Select allowClear placeholder="All" style={{ width: '100%' }} value={slaFilter || undefined} onChange={v => setSlaFilter(v || '')} options={[{ value: 'On Track', label: 'On Track' }, { value: 'Approaching', label: 'Approaching' }, { value: 'Breached', label: 'Breached' }]} size="small" />
          </Col>
        </Row>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No matching proposals" description="No proposals match your current filters" actionLabel="Clear Filters" onAction={() => { setConfidenceRange([0, 100]); setEntityFilter(''); setActionFilter(''); setSourceFilter(''); setSlaFilter('') }} />
      ) : (
        <Table dataSource={filtered} columns={columns} rowKey="id" size="small" pagination={{ pageSize: 15, showTotal: t => `${t} proposals` }}
          onRow={(record) => ({ onClick: () => { setSelectedProposal(record); setDrawerOpen(true) }, style: { cursor: 'pointer', background: record.confidenceScore < 60 ? '#fff1f0' : undefined } })}
        />
      )}

      <Modal
        open={bulkModalOpen}
        title="Bulk Accept Proposals"
        onCancel={() => setBulkModalOpen(false)}
        onOk={() => { message.success('Bulk accept submitted'); setBulkModalOpen(false) }}
        okText="Confirm"
      >
        <Text>Select minimum confidence threshold:</Text>
        <Slider min={50} max={100} value={bulkThreshold} onChange={setBulkThreshold} style={{ margin: '16px 0' }} />
        <Text>{matchingProposals.filter(p => p.confidenceScore >= bulkThreshold && p.status === 'Pending').length} proposals meet the {bulkThreshold}% threshold</Text>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSurvivorPreview(false) }}
        title={selectedProposal ? `Proposal ${selectedProposal.id}` : ''}
        width="80%"
      >
        {selectedProposal && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title={<Space><Tag color="blue">A</Tag>{selectedProposal.recordAId}</Space>} size="small">
                  <Descriptions bordered size="small" column={1}>
                    {comparisonFields.map(f => (
                      <Descriptions.Item key={f.label} label={f.label} contentStyle={f.a === f.b ? { background: '#f6ffed' } : { background: '#fff7e6' }}>
                        {f.a === f.b ? <Text>{f.a}</Text> : <Text style={{ color: '#d4380d' }}>{f.a}</Text>}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title={<Space><Tag color="purple">B</Tag>{selectedProposal.recordBId}</Space>} size="small">
                  <Descriptions bordered size="small" column={1}>
                    {comparisonFields.map(f => (
                      <Descriptions.Item key={f.label} label={f.label} contentStyle={f.a === f.b ? { background: '#f6ffed' } : { background: '#fff7e6' }}>
                        {f.a === f.b ? <Text>{f.b}</Text> : <Text style={{ color: '#d4380d' }}>{f.b}</Text>}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <Space size="large">
                <Text>Confidence: {confidenceTag(selectedProposal.confidenceScore)}</Text>
                <Text>Action: <Tag color={selectedProposal.proposedAction === 'Merge' ? 'blue' : 'purple'}>{selectedProposal.proposedAction}</Tag></Text>
              </Space>
            </div>

            {!survivorPreview ? (
              <div style={{ textAlign: 'center' }}>
                <Space>
                  <Button type="primary" onClick={() => setSurvivorPreview(true)}>Accept Merge</Button>
                  <Button danger onClick={() => setRejectOpen(true)}>Reject</Button>
                  <Button onClick={() => setEscalateOpen(true)}>Escalate</Button>
                </Space>
              </div>
            ) : (
              <Card title="Survivorship Preview" size="small" style={{ marginTop: 16 }}>
                <Descriptions bordered size="small" column={1}>
                  {comparisonFields.map(f => (
                    <Descriptions.Item key={f.label} label={f.label}>
                      <Space>
                        <Text>{f.a === f.b ? f.a : `${f.a} → ${f.b}`}</Text>
                        <Tag style={{ fontSize: 10 }}>{f.a === f.b ? 'Consistent' : 'Record A priority'}</Tag>
                      </Space>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <Button type="primary" onClick={() => { message.success('Merge submitted for approval'); setDrawerOpen(false) }}>Submit for Approval</Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      <Modal open={rejectOpen} title="Reject Proposal" onCancel={() => setRejectOpen(false)} onOk={() => { message.success('Rejected'); setRejectOpen(false); setReason('') }} okText="Confirm">
        <Input.TextArea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for rejection..." style={{ marginTop: 8 }} />
      </Modal>

      <Modal open={escalateOpen} title="Escalate Proposal" onCancel={() => setEscalateOpen(false)} onOk={() => { message.success('Escalated'); setEscalateOpen(false); setReason('') }} okText="Confirm">
        <Input.TextArea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for escalation..." style={{ marginTop: 8 }} />
      </Modal>
    </div>
  )
}
