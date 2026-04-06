import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Descriptions, Button, Card, Tag, Modal, Input, Space, Row, Col, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { spareParts } from '../../data/spareParts'

const { Title, Text } = Typography

export default function RecordComparison() {
  const { id1, id2 } = useParams()
  const navigate = useNavigate()
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [escalateModalOpen, setEscalateModalOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [survivorPreview, setSurvivorPreview] = useState(false)

  const recordA = useMemo(() => spareParts.find(sp => sp.id === id1), [id1])
  const recordB = useMemo(() => spareParts.find(sp => sp.id === id2), [id2])

  if (!recordA || !recordB) {
    return <div style={{ padding: 24 }}><Text>One or both records not found</Text></div>
  }

  const confidence = 87

  const fields = [
    { label: 'Part Number', a: recordA.partNumber, b: recordB.partNumber },
    { label: 'Description', a: recordA.description, b: recordB.description },
    { label: 'Category', a: recordA.category, b: recordB.category },
    { label: 'Manufacturer', a: recordA.manufacturer, b: recordB.manufacturer },
    { label: 'Unit of Measure', a: recordA.unitOfMeasure, b: recordB.unitOfMeasure },
    { label: 'Lead Time (days)', a: String(recordA.leadTimeDays), b: String(recordB.leadTimeDays) },
    { label: 'Unit Cost (USD)', a: `$${recordA.unitCostUsd.toLocaleString()}`, b: `$${recordB.unitCostUsd.toLocaleString()}` },
    { label: 'Critical Spare', a: String(recordA.criticalSpare), b: String(recordB.criticalSpare) },
    { label: 'Status', a: recordA.status, b: recordB.status },
    { label: 'DQ Score', a: String(recordA.dqScore), b: String(recordB.dqScore) },
    { label: 'Source System', a: recordA.sourceSystem, b: recordB.sourceSystem },
  ]

  const confidenceColor = confidence >= 90 ? '#52c41a' : confidence >= 60 ? '#faad14' : '#ff4d4f'

  const fieldStyle = (a: string, b: string) => {
    if (a === b) return { background: '#f6ffed' }
    return { background: '#fff7e6' }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>Record Comparison</Title>
        </Space>
        <Space>
          <Tag color={confidenceColor} style={{ fontSize: 14, padding: '4px 12px' }}>
            Confidence: {confidence}%
          </Tag>
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={12}>
          <Card title={<Space><Tag color="blue">A</Tag>{recordA.partNumber}</Space>} size="small">
            <Descriptions bordered size="small" column={1}>
              {fields.map(f => (
                <Descriptions.Item key={f.label} label={f.label} contentStyle={fieldStyle(f.a, f.b)}>
                  {f.a === f.b ? <Text>{f.a}</Text> : <Text style={{ color: '#d4380d' }}>{f.a}</Text>}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<Space><Tag color="purple">B</Tag>{recordB.partNumber}</Space>} size="small">
            <Descriptions bordered size="small" column={1}>
              {fields.map(f => (
                <Descriptions.Item key={f.label} label={f.label} contentStyle={fieldStyle(f.a, f.b)}>
                  {f.a === f.b ? <Text>{f.b}</Text> : <Text style={{ color: '#d4380d' }}>{f.b}</Text>}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <Button type="primary" onClick={() => setSurvivorPreview(true)}>
          Accept Merge
        </Button>
        <Button danger onClick={() => setRejectModalOpen(true)}>
          Reject
        </Button>
        <Button onClick={() => setEscalateModalOpen(true)}>
          Escalate
        </Button>
      </div>

      <Modal
        open={survivorPreview}
        title="Survivorship Preview"
        onCancel={() => setSurvivorPreview(false)}
        onOk={() => { message.success('Merge submitted for approval'); setSurvivorPreview(false) }}
        okText="Confirm Merge"
        width={700}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Projected merged golden record with per-field source attribution:
        </Text>
        <Descriptions bordered size="small" column={1}>
          {fields.map(f => (
            <Descriptions.Item key={f.label} label={f.label}>
              <Space>
                <Text>{f.a === f.b ? f.a : `${f.a} → ${f.b}`}</Text>
                <Tag style={{ fontSize: 10 }}>
                  {f.a === f.b ? 'Consistent' : 'Record A priority'}
                </Tag>
              </Space>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Modal>

      <Modal
        open={rejectModalOpen}
        title="Reject Proposal"
        onCancel={() => setRejectModalOpen(false)}
        onOk={() => { message.success('Proposal rejected'); setRejectModalOpen(false); setReason('') }}
        okText="Confirm Reject"
      >
        <Text>Please provide a reason for rejection:</Text>
        <Input.TextArea
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason..."
          style={{ marginTop: 8 }}
        />
      </Modal>

      <Modal
        open={escalateModalOpen}
        title="Escalate Proposal"
        onCancel={() => setEscalateModalOpen(false)}
        onOk={() => { message.success('Proposal escalated'); setEscalateModalOpen(false); setReason('') }}
        okText="Confirm Escalation"
      >
        <Text>Please provide a reason for escalation:</Text>
        <Input.TextArea
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason..."
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  )
}
