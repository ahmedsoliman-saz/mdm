import { useState } from 'react'
import { Card, Row, Col, Typography, Tag, Badge, Space, Descriptions } from 'antd'
import {
  FileAddOutlined,
  MergeCellsOutlined,
  EditOutlined,
  UploadOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

interface WorkflowStep {
  name: string
  role: string
  roleColor: string
  slaHours: string
  escalation: string
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'Active' | 'Draft'
  stepCount: number
  steps: WorkflowStep[]
}

const workflows: WorkflowTemplate[] = [
  {
    id: 'new-record',
    name: 'New Record Approval',
    description: 'Standard approval workflow for new master data records submitted by stewards.',
    icon: <FileAddOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
    status: 'Active',
    stepCount: 4,
    steps: [
      {
        name: 'Draft Created',
        role: 'Data Steward',
        roleColor: 'blue',
        slaHours: '4h',
        escalation: 'Auto-assign to Senior Steward',
      },
      {
        name: 'Steward Review',
        role: 'Senior Steward',
        roleColor: 'cyan',
        slaHours: '8h',
        escalation: 'Notify Approver',
      },
      {
        name: 'Approval',
        role: 'Approver',
        roleColor: 'purple',
        slaHours: '24h',
        escalation: 'Auto-approve if DQ > 90',
      },
      {
        name: 'Published',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
    ],
  },
  {
    id: 'merge-review',
    name: 'Merge Review',
    description: 'Review and approve merge proposals for potential duplicate records.',
    icon: <MergeCellsOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    status: 'Active',
    stepCount: 5,
    steps: [
      {
        name: 'Match Detected',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
      {
        name: 'Steward Review',
        role: 'Data Steward',
        roleColor: 'blue',
        slaHours: '4h',
        escalation: 'Reassign to Senior Steward',
      },
      {
        name: 'Survivorship Selection',
        role: 'Senior Steward',
        roleColor: 'cyan',
        slaHours: '8h',
        escalation: 'Notify Approver after 6h',
      },
      {
        name: 'Merge Approval',
        role: 'Approver',
        roleColor: 'purple',
        slaHours: '24h',
        escalation: 'Escalate to Admin after 20h',
      },
      {
        name: 'Merged & Published',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
    ],
  },
  {
    id: 'data-correction',
    name: 'Data Correction',
    description: 'Workflow for correcting data quality issues flagged by validation rules.',
    icon: <EditOutlined style={{ fontSize: 24, color: '#faad14' }} />,
    status: 'Active',
    stepCount: 4,
    steps: [
      {
        name: 'Issue Flagged',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
      {
        name: 'Correction Applied',
        role: 'Data Steward',
        roleColor: 'blue',
        slaHours: '8h',
        escalation: 'Auto-assign to next available steward',
      },
      {
        name: 'Peer Review',
        role: 'Senior Steward',
        roleColor: 'cyan',
        slaHours: '12h',
        escalation: 'Auto-approve if minor correction',
      },
      {
        name: 'Resolved',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
    ],
  },
  {
    id: 'bulk-onboarding',
    name: 'Bulk Onboarding Review',
    description: 'Multi-step review for bulk-imported records from source systems or file uploads.',
    icon: <UploadOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    status: 'Draft',
    stepCount: 5,
    steps: [
      {
        name: 'File Uploaded',
        role: 'Data Steward',
        roleColor: 'blue',
        slaHours: '2h',
        escalation: 'N/A',
      },
      {
        name: 'Validation & Profiling',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'Alert steward if error rate > 10%',
      },
      {
        name: 'Steward Review',
        role: 'Senior Steward',
        roleColor: 'cyan',
        slaHours: '24h',
        escalation: 'Notify Admin after 20h',
      },
      {
        name: 'Batch Approval',
        role: 'Approver',
        roleColor: 'purple',
        slaHours: '48h',
        escalation: 'Escalate to Admin after 36h',
      },
      {
        name: 'Records Published',
        role: 'System',
        roleColor: 'green',
        slaHours: 'N/A',
        escalation: 'N/A',
      },
    ],
  },
]

export default function WorkflowConfig() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          Workflow Configuration
        </Title>
        <Text type="secondary">
          Configure approval workflows for master data governance processes. Click a
          workflow to view its step diagram.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {workflows.map((wf) => {
          const isExpanded = expandedId === wf.id
          return (
            <Col span={24} key={wf.id}>
              <Card
                hoverable
                onClick={() => handleToggle(wf.id)}
                style={{
                  cursor: 'pointer',
                  borderLeft: isExpanded ? '3px solid #1677ff' : '3px solid transparent',
                }}
                styles={{ body: { padding: '16px 24px' } }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space size="middle" align="center">
                      {wf.icon}
                      <div>
                        <Space size="small" align="center">
                          <Text strong style={{ fontSize: 16 }}>
                            {wf.name}
                          </Text>
                          <Tag color={wf.status === 'Active' ? 'green' : 'default'}>
                            {wf.status}
                          </Tag>
                          <Badge
                            count={`${wf.stepCount} steps`}
                            style={{
                              backgroundColor: '#f0f0f0',
                              color: '#666',
                              fontSize: 12,
                            }}
                          />
                        </Space>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {wf.description}
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    {isExpanded ? (
                      <DownOutlined style={{ color: '#999' }} />
                    ) : (
                      <RightOutlined style={{ color: '#999' }} />
                    )}
                  </Col>
                </Row>
              </Card>

              {isExpanded && (
                <Card
                  style={{
                    marginTop: -1,
                    borderTop: 'none',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    background: '#fafafa',
                  }}
                  styles={{ body: { padding: '24px 24px 24px 24px', overflowX: 'auto' } }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 0,
                      minWidth: 'max-content',
                    }}
                  >
                    {wf.steps.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Card
                          size="small"
                          style={{
                            width: 220,
                            borderTop: `3px solid ${
                              step.roleColor === 'blue'
                                ? '#1677ff'
                                : step.roleColor === 'cyan'
                                  ? '#13c2c2'
                                  : step.roleColor === 'purple'
                                    ? '#722ed1'
                                    : '#52c41a'
                            }`,
                          }}
                          styles={{ body: { padding: 16 } }}
                        >
                          <div style={{ marginBottom: 12 }}>
                            <Text
                              type="secondary"
                              style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}
                            >
                              Step {idx + 1}
                            </Text>
                            <div>
                              <Text strong>{step.name}</Text>
                            </div>
                          </div>

                          <Descriptions
                            column={1}
                            size="small"
                            colon={false}
                            labelStyle={{
                              fontSize: 12,
                              color: '#999',
                              paddingBottom: 2,
                              width: 70,
                            }}
                            contentStyle={{ fontSize: 12, paddingBottom: 2 }}
                          >
                            <Descriptions.Item label="Role">
                              <Tag
                                color={step.roleColor}
                                style={{ fontSize: 11, lineHeight: '18px', margin: 0 }}
                              >
                                {step.role}
                              </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="SLA">
                              <Text
                                strong={step.slaHours !== 'N/A'}
                                style={{
                                  fontSize: 12,
                                  color: step.slaHours === 'N/A' ? '#bbb' : undefined,
                                }}
                              >
                                {step.slaHours}
                              </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Escalation">
                              <Text
                                style={{
                                  fontSize: 11,
                                  color: step.escalation === 'N/A' ? '#bbb' : '#666',
                                }}
                              >
                                {step.escalation}
                              </Text>
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>

                        {idx < wf.steps.length - 1 && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              height: 160,
                              padding: '0 4px',
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 2,
                                background: '#d9d9d9',
                                position: 'relative',
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  right: -1,
                                  top: -5,
                                  width: 0,
                                  height: 0,
                                  borderTop: '6px solid transparent',
                                  borderBottom: '6px solid transparent',
                                  borderLeft: '8px solid #d9d9d9',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
