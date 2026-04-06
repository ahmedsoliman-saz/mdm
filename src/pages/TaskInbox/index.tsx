import { useState } from 'react'
import { Typography, Table, Tag, Drawer, Button, Timeline, Space, Input, Modal, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { tasks } from '../../data/tasks'
import { users } from '../../data/users'
import { formatDate } from '../../utils/formatDate'

const { Title, Text } = Typography

export default function TaskInbox() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null)
  const [reason, setReason] = useState('')
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'escalate' | null>(null)

  const getUserName = (id: string) => {
    const u = users.find(u2 => u2.id === id)
    return u ? u.name : id
  }

  const priorityColor = (p: string) => {
    if (p === 'High') return 'red'
    if (p === 'Medium') return 'orange'
    return 'blue'
  }

  const slaColor = (s: string) => {
    if (s === 'Breached') return 'red'
    if (s === 'Approaching') return 'orange'
    return 'green'
  }

  const statusColor = (s: string) => {
    if (s === 'Open') return 'blue'
    if (s === 'In Progress') return 'orange'
    if (s === 'Completed') return 'green'
    return 'red'
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string, record: typeof tasks[0]) => (
        <a onClick={() => { setSelectedTask(record); setDrawerOpen(true) }}>{id}</a>
      ),
    },
    { title: 'Type', dataIndex: 'taskType', key: 'type', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'Entity', dataIndex: 'entityType', key: 'entity', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Related Record',
      dataIndex: 'relatedRecordId',
      key: 'record',
      render: (id: string, record: typeof tasks[0]) => (
        <a onClick={(e) => { e.stopPropagation(); navigate(`/entities/${record.entityType}/records/${id}`) }}>{id}</a>
      ),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (v: string) => <Tag color={priorityColor(v)}>{v}</Tag> },
    { title: 'SLA', dataIndex: 'slaStatus', key: 'sla', render: (v: string) => <Tag color={slaColor(v)}>{v}</Tag> },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assigned', render: (v: string) => getUserName(v) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
  ]

  const handleAction = () => {
    if (actionModal === 'approve') message.success('Task approved')
    if (actionModal === 'reject') message.success('Task rejected')
    if (actionModal === 'escalate') message.success('Task escalated')
    setActionModal(null)
    setReason('')
    setDrawerOpen(false)
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Task Inbox</Title>
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showTotal: t => `${t} tasks` }}
        onRow={(record) => ({
          onClick: () => { setSelectedTask(record); setDrawerOpen(true) },
          style: { cursor: 'pointer' },
        })}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedTask ? `Task ${selectedTask.id}` : ''}
        width={640}
      >
        {selectedTask && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedTask.taskType}</Tag>
              <Tag color={priorityColor(selectedTask.priority)}>{selectedTask.priority}</Tag>
              <Tag color={slaColor(selectedTask.slaStatus)}>SLA: {selectedTask.slaStatus}</Tag>
            </Space>

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Related Record: </Text>
              <a onClick={() => navigate(`/entities/${selectedTask.entityType}/records/${selectedTask.relatedRecordId}`)}>
                {selectedTask.relatedRecordId} — {selectedTask.relatedRecordDescription}
              </a>
            </div>

            <Title level={5}>Change Set</Title>
            {selectedTask.changeset && selectedTask.changeset.length > 0 ? (
              <div style={{ marginBottom: 24 }}>
                {selectedTask.changeset.map((change, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong style={{ width: 180 }}>{change.attribute}</Text>
                    <Text delete type="danger" style={{ flex: 1 }}>{change.before}</Text>
                    <Text style={{ margin: '0 8px' }}>→</Text>
                    <Text type="success" style={{ flex: 1 }}>{change.after}</Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>No changeset details</Text>
            )}

            <Title level={5}>Workflow Timeline</Title>
            {selectedTask.workflowHistory && selectedTask.workflowHistory.length > 0 ? (
              <Timeline
                style={{ marginBottom: 24 }}
                items={selectedTask.workflowHistory.map((event, i) => ({
                  color: i === selectedTask.workflowHistory!.length - 1 ? 'blue' : 'gray',
                  children: (
                    <div>
                      <Text strong>{event.state}</Text>
                      <Text type="secondary"> — {event.actor}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(event.timestamp)}</Text>
                      {event.comment && <div><Text type="secondary" style={{ fontSize: 12 }}>{event.comment}</Text></div>}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>No workflow history</Text>
            )}

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Button type="primary" onClick={() => setActionModal('approve')}>Approve</Button>
              <Button danger onClick={() => setActionModal('reject')}>Reject</Button>
              <Button onClick={() => setActionModal('escalate')}>Escalate</Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={actionModal !== null}
        title={actionModal === 'approve' ? 'Approve Task' : actionModal === 'reject' ? 'Reject Task' : 'Escalate Task'}
        onCancel={() => { setActionModal(null); setReason('') }}
        onOk={handleAction}
        okText="Confirm"
      >
        {(actionModal === 'reject' || actionModal === 'escalate') && (
          <div>
            <Text>Reason (required):</Text>
            <Input.TextArea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason..." style={{ marginTop: 8 }} />
          </div>
        )}
        {actionModal === 'approve' && <Text>Are you sure you want to approve this task?</Text>}
      </Modal>
    </div>
  )
}
