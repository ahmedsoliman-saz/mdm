import { useState } from 'react'
import {
  Tree,
  Card,
  Row,
  Col,
  Descriptions,
  Table,
  Form,
  Input,
  Select,
  Switch,
  Typography,
  Tag,
  Space,
  Button,
  message,
} from 'antd'
import type { DataNode } from 'antd/es/tree'

const { Title, Text } = Typography

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Attribute {
  key: string
  name: string
  displayName: string
  dataType: 'String' | 'Number' | 'Boolean' | 'Date' | 'Enum'
  survivorshipRule: 'Most Recent' | 'Source Priority' | 'Manual Override' | 'Max Value'
  piiFlag: boolean
  required: boolean
}

interface EntityModel {
  key: string
  name: string
  displayName: string
  description: string
  primaryKey: string
  recordCount: number
  lastModified: string
  version: string
  attributes: Attribute[]
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const entityModels: EntityModel[] = [
  {
    key: 'spare-part',
    name: 'SparePart',
    displayName: 'Spare Part',
    description:
      'Master data entity representing individual spare parts used across the fleet for maintenance, repair, and overhaul operations.',
    primaryKey: 'partNumber',
    recordCount: 1247,
    lastModified: '2026-03-28',
    version: '3.2',
    attributes: [
      { key: 'partNumber', name: 'partNumber', displayName: 'Part Number', dataType: 'String', survivorshipRule: 'Source Priority', piiFlag: false, required: true },
      { key: 'description', name: 'description', displayName: 'Description', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'category', name: 'category', displayName: 'Category', dataType: 'Enum', survivorshipRule: 'Source Priority', piiFlag: false, required: true },
      { key: 'manufacturer', name: 'manufacturer', displayName: 'Manufacturer', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'unitOfMeasure', name: 'unitOfMeasure', displayName: 'Unit of Measure', dataType: 'Enum', survivorshipRule: 'Source Priority', piiFlag: false, required: false },
      { key: 'leadTimeDays', name: 'leadTimeDays', displayName: 'Lead Time (Days)', dataType: 'Number', survivorshipRule: 'Max Value', piiFlag: false, required: false },
      { key: 'unitCostUsd', name: 'unitCostUsd', displayName: 'Unit Cost (USD)', dataType: 'Number', survivorshipRule: 'Max Value', piiFlag: false, required: true },
      { key: 'criticalSpare', name: 'criticalSpare', displayName: 'Critical Spare', dataType: 'Boolean', survivorshipRule: 'Manual Override', piiFlag: false, required: true },
      { key: 'status', name: 'status', displayName: 'Status', dataType: 'Enum', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'dqScore', name: 'dqScore', displayName: 'DQ Score', dataType: 'Number', survivorshipRule: 'Max Value', piiFlag: false, required: false },
    ],
  },
  {
    key: 'vendor',
    name: 'Vendor',
    displayName: 'Vendor',
    description:
      'Master data entity for approved and prospective vendors supplying spare parts and maintenance services.',
    primaryKey: 'vendorCode',
    recordCount: 384,
    lastModified: '2026-04-01',
    version: '2.1',
    attributes: [
      { key: 'vendorCode', name: 'vendorCode', displayName: 'Vendor Code', dataType: 'String', survivorshipRule: 'Source Priority', piiFlag: false, required: true },
      { key: 'companyName', name: 'companyName', displayName: 'Company Name', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'country', name: 'country', displayName: 'Country', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'contactEmail', name: 'contactEmail', displayName: 'Contact Email', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: true, required: true },
      { key: 'paymentTerms', name: 'paymentTerms', displayName: 'Payment Terms', dataType: 'Enum', survivorshipRule: 'Source Priority', piiFlag: false, required: false },
      { key: 'certification', name: 'certification', displayName: 'Certification', dataType: 'String', survivorshipRule: 'Manual Override', piiFlag: false, required: false },
      { key: 'status', name: 'status', displayName: 'Status', dataType: 'Enum', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'dqScore', name: 'dqScore', displayName: 'DQ Score', dataType: 'Number', survivorshipRule: 'Max Value', piiFlag: false, required: false },
    ],
  },
  {
    key: 'equipment',
    name: 'Equipment',
    displayName: 'Equipment',
    description:
      'Master data entity representing shipboard equipment and components tracked for maintenance scheduling and part association.',
    primaryKey: 'equipmentId',
    recordCount: 612,
    lastModified: '2026-03-15',
    version: '1.8',
    attributes: [
      { key: 'equipmentId', name: 'equipmentId', displayName: 'Equipment ID', dataType: 'String', survivorshipRule: 'Source Priority', piiFlag: false, required: true },
      { key: 'name', name: 'name', displayName: 'Name', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'vessel', name: 'vessel', displayName: 'Vessel', dataType: 'String', survivorshipRule: 'Source Priority', piiFlag: false, required: true },
      { key: 'deckLocation', name: 'deckLocation', displayName: 'Deck / Location', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: false },
      { key: 'manufacturer', name: 'manufacturer', displayName: 'Manufacturer', dataType: 'String', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'installDate', name: 'installDate', displayName: 'Install Date', dataType: 'Date', survivorshipRule: 'Most Recent', piiFlag: false, required: false },
      { key: 'status', name: 'status', displayName: 'Status', dataType: 'Enum', survivorshipRule: 'Most Recent', piiFlag: false, required: true },
      { key: 'dqScore', name: 'dqScore', displayName: 'DQ Score', dataType: 'Number', survivorshipRule: 'Max Value', piiFlag: false, required: false },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const dataTypeColors: Record<string, string> = {
  String: 'blue',
  Number: 'purple',
  Boolean: 'cyan',
  Date: 'orange',
  Enum: 'geekblue',
}

const survivorshipColors: Record<string, string> = {
  'Most Recent': 'green',
  'Source Priority': 'volcano',
  'Manual Override': 'gold',
  'Max Value': 'purple',
}

function buildTreeData(): DataNode[] {
  return entityModels.map((entity) => ({
    title: entity.displayName,
    key: entity.key,
    children: entity.attributes.map((attr) => ({
      title: attr.displayName,
      key: `${entity.key}::${attr.key}`,
      isLeaf: true,
    })),
  }))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EntityModelConfig() {
  const [selectedEntity, setSelectedEntity] = useState<EntityModel | null>(entityModels[0])
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([entityModels[0].key])
  const [messageApi, contextHolder] = message.useMessage()

  const treeData = buildTreeData()

  // ---- Tree select handler ------------------------------------------------

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) return
    const key = selectedKeys[0] as string

    if (key.includes('::')) {
      // Attribute node
      const [entityKey, attrKey] = key.split('::')
      const entity = entityModels.find((e) => e.key === entityKey)!
      const attr = entity.attributes.find((a) => a.key === attrKey)!
      setSelectedEntity(entity)
      setSelectedAttribute(attr)
    } else {
      // Entity node
      const entity = entityModels.find((e) => e.key === key)!
      setSelectedEntity(entity)
      setSelectedAttribute(null)
    }
  }

  // ---- Attribute table columns --------------------------------------------

  const attrColumns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text: string, record: Attribute) => (
        <Text strong={selectedAttribute?.key === record.key}>{text}</Text>
      ),
    },
    {
      title: 'Field Key',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => <Tag color={dataTypeColors[type] ?? 'default'}>{type}</Tag>,
    },
    {
      title: 'Survivorship Rule',
      dataIndex: 'survivorshipRule',
      key: 'survivorshipRule',
      render: (rule: string) => <Tag color={survivorshipColors[rule] ?? 'default'}>{rule}</Tag>,
    },
    {
      title: 'PII',
      dataIndex: 'piiFlag',
      key: 'piiFlag',
      width: 70,
      align: 'center' as const,
      render: (pii: boolean) =>
        pii ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
      width: 90,
      align: 'center' as const,
      render: (req: boolean) =>
        req ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>,
    },
  ]

  // ---- Render -------------------------------------------------------------

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Title level={4} style={{ margin: 0 }}>
          Entity Model Configuration
        </Title>

        <Row gutter={16} style={{ minHeight: 'calc(100vh - 220px)' }}>
          {/* Left panel — Tree */}
          <Col span={7}>
            <Card
              title="Entity Types"
              size="small"
              styles={{ body: { padding: '8px 4px' } }}
            >
              <Tree
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                selectedKeys={
                  selectedAttribute && selectedEntity
                    ? [`${selectedEntity.key}::${selectedAttribute.key}`]
                    : selectedEntity
                      ? [selectedEntity.key]
                      : []
                }
                onSelect={handleTreeSelect}
                showLine
                defaultExpandAll={false}
              />
            </Card>
          </Col>

          {/* Right panel — Details */}
          <Col span={17}>
            {selectedEntity ? (
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {/* Entity metadata */}
                <Card title={`${selectedEntity.displayName} — Entity Metadata`} size="small">
                  <Descriptions
                    bordered
                    size="small"
                    column={2}
                    items={[
                      { key: '1', label: 'Internal Name', children: selectedEntity.name },
                      { key: '2', label: 'Primary Key', children: <Text code>{selectedEntity.primaryKey}</Text> },
                      { key: '3', label: 'Description', children: selectedEntity.description, span: 2 },
                      { key: '4', label: 'Record Count', children: selectedEntity.recordCount.toLocaleString() },
                      { key: '5', label: 'Model Version', children: selectedEntity.version },
                      { key: '6', label: 'Last Modified', children: selectedEntity.lastModified },
                      { key: '7', label: 'Attribute Count', children: selectedEntity.attributes.length },
                    ]}
                  />
                </Card>

                {/* Attributes table */}
                <Card title="Attributes" size="small">
                  <Table
                    dataSource={selectedEntity.attributes}
                    columns={attrColumns}
                    rowKey="key"
                    size="small"
                    pagination={false}
                    onRow={(record) => ({
                      onClick: () => setSelectedAttribute(record),
                      style: {
                        cursor: 'pointer',
                        background:
                          selectedAttribute?.key === record.key
                            ? '#e6f4ff'
                            : undefined,
                      },
                    })}
                  />
                </Card>

                {/* Attribute detail form */}
                {selectedAttribute && (
                  <Card
                    title={`Attribute Detail — ${selectedAttribute.displayName}`}
                    size="small"
                    extra={
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            messageApi.success(
                              `Attribute "${selectedAttribute.displayName}" saved (mock).`,
                            )
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button onClick={() => setSelectedAttribute(null)}>Close</Button>
                      </Space>
                    }
                  >
                    <Form
                      layout="vertical"
                      initialValues={{
                        displayName: selectedAttribute.displayName,
                        name: selectedAttribute.name,
                        dataType: selectedAttribute.dataType,
                        survivorshipRule: selectedAttribute.survivorshipRule,
                        piiFlag: selectedAttribute.piiFlag,
                        required: selectedAttribute.required,
                      }}
                      key={selectedAttribute.key}
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Display Name" name="displayName">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Field Key" name="name">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Data Type" name="dataType">
                            <Select
                              options={[
                                { value: 'String', label: 'String' },
                                { value: 'Number', label: 'Number' },
                                { value: 'Boolean', label: 'Boolean' },
                                { value: 'Date', label: 'Date' },
                                { value: 'Enum', label: 'Enum' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Survivorship Rule" name="survivorshipRule">
                            <Select
                              options={[
                                { value: 'Most Recent', label: 'Most Recent' },
                                { value: 'Source Priority', label: 'Source Priority' },
                                { value: 'Manual Override', label: 'Manual Override' },
                                { value: 'Max Value', label: 'Max Value' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label="PII Flag" name="piiFlag" valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label="Required" name="required" valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                )}
              </Space>
            ) : (
              <Card>
                <Text type="secondary">Select an entity type from the tree to view its configuration.</Text>
              </Card>
            )}
          </Col>
        </Row>
      </Space>
    </>
  )
}
