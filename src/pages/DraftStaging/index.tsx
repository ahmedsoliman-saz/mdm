import { useState } from 'react'
import { Typography, Collapse, Descriptions, Tag, Button, Modal, Space, message } from 'antd'
import { drafts } from '../../data/drafts'
import { users } from '../../data/users'
import { formatDate } from '../../utils/formatDate'

const { Title, Text } = Typography

export default function DraftStaging() {
  const [confirmSubmit, setConfirmSubmit] = useState<string | null>(null)
  const [confirmDiscard, setConfirmDiscard] = useState<string | null>(null)

  const getUserName = (id: string) => {
    const u = users.find(u2 => u2.id === id)
    return u ? u.name : id
  }

  const grouped = {
    'spare-parts': drafts.filter(d => d.entityType === 'spare-parts'),
    vendors: drafts.filter(d => d.entityType === 'vendors'),
    equipment: drafts.filter(d => d.entityType === 'equipment'),
  }

  const entityLabel = (type: string) => {
    if (type === 'spare-parts') return 'Spare Parts'
    if (type === 'vendors') return 'Vendors'
    return 'Equipment'
  }

  const collapseItems = Object.entries(grouped)
    .filter(([, items]) => items.length > 0)
    .map(([type, items]) => ({
      key: type,
      label: <Space><Tag>{entityLabel(type)}</Tag><Text type="secondary">{items.length} draft{items.length > 1 ? 's' : ''}</Text></Space>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(draft => (
            <div key={draft.id} style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Space>
                  <Text strong>{draft.recordId}</Text>
                  <Tag>{entityLabel(draft.entityType)}</Tag>
                  <Text type="secondary">{draft.recordDescription}</Text>
                </Space>
                <Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>by {getUserName(draft.createdBy)} — {formatDate(draft.createdAt)}</Text>
                </Space>
              </div>
              <Descriptions bordered size="small" column={3} style={{ marginBottom: 8 }}>
                {draft.changes.map((change, i) => (
                  <Descriptions.Item key={i} label={change.attribute}>
                    <Space>
                      <Text delete type="danger">{change.before}</Text>
                      <Text>→</Text>
                      <Text type="success">{change.after}</Text>
                    </Space>
                  </Descriptions.Item>
                ))}
              </Descriptions>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button type="primary" size="small" onClick={() => setConfirmSubmit(draft.id)}>
                  Submit for Approval
                </Button>
                <Button danger size="small" onClick={() => setConfirmDiscard(draft.id)}>
                  Discard
                </Button>
              </div>
            </div>
          ))}
        </div>
      ),
    }))

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Draft Staging</Title>
      <Collapse items={collapseItems} defaultActiveKey={['spare-parts', 'vendors', 'equipment']} />

      <Modal
        open={confirmSubmit !== null}
        title="Submit for Approval"
        onCancel={() => setConfirmSubmit(null)}
        onOk={() => { message.success('Draft submitted for approval'); setConfirmSubmit(null) }}
        okText="Confirm"
      >
        <Text>Are you sure you want to submit this draft for approval?</Text>
      </Modal>

      <Modal
        open={confirmDiscard !== null}
        title="Discard Draft"
        onCancel={() => setConfirmDiscard(null)}
        onOk={() => { message.success('Draft discarded'); setConfirmDiscard(null) }}
        okText="Discard"
        okButtonProps={{ danger: true }}
      >
        <Text>Are you sure you want to discard this draft? This action cannot be undone.</Text>
      </Modal>
    </div>
  )
}
