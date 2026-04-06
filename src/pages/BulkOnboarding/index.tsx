import { useState } from 'react'
import {
  Steps,
  Card,
  Button,
  Upload,
  Table,
  Select,
  Tag,
  Progress,
  Modal,
  Statistic,
  Row,
  Col,
  Typography,
  message,
  Space,
} from 'antd'
import {
  InboxOutlined,
  CheckCircleFilled,
  WarningFilled,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { formatDateTime } from '../../utils/formatDate'
import DQBadge from '../../components/DQBadge'

const { Title, Text } = Typography
const { Dragger } = Upload

// ─── Column Mapping Data ──────────────────────────────────────────────

interface ColumnMapping {
  key: string
  sourceColumn: string
  mdmAttribute: string | null
  autoMapped: boolean
}

const mdmAttributes = [
  'Part Number',
  'Description',
  'Category',
  'Manufacturer',
  'Unit of Measure',
  'Lead Time (days)',
  'Unit Cost (USD)',
  'Critical Spare',
  'Status',
  '— Unmapped —',
]

const initialColumnMappings: ColumnMapping[] = [
  { key: '1', sourceColumn: 'PART_NO', mdmAttribute: 'Part Number', autoMapped: true },
  { key: '2', sourceColumn: 'DESCRIPTION', mdmAttribute: 'Description', autoMapped: true },
  { key: '3', sourceColumn: 'CAT', mdmAttribute: 'Category', autoMapped: true },
  { key: '4', sourceColumn: 'MFG_NAME', mdmAttribute: 'Manufacturer', autoMapped: true },
  { key: '5', sourceColumn: 'UOM', mdmAttribute: 'Unit of Measure', autoMapped: true },
  { key: '6', sourceColumn: 'LEAD_TIME_DAYS', mdmAttribute: 'Lead Time (days)', autoMapped: true },
  { key: '7', sourceColumn: 'COST', mdmAttribute: 'Unit Cost (USD)', autoMapped: true },
  { key: '8', sourceColumn: 'IS_CRITICAL', mdmAttribute: 'Critical Spare', autoMapped: true },
  { key: '9', sourceColumn: 'PART_STATUS', mdmAttribute: 'Status', autoMapped: true },
  { key: '10', sourceColumn: 'VENDOR_REF', mdmAttribute: null, autoMapped: false },
  { key: '11', sourceColumn: 'NOTES_INTERNAL', mdmAttribute: null, autoMapped: false },
]

// ─── Validation Preview Data ──────────────────────────────────────────

interface PreviewRecord {
  key: string
  partNumber: string
  description: string
  category: string
  manufacturer: string
  uom: string
  leadTime: number | null
  unitCost: number | null
  criticalSpare: string
  status: string
  dqScore: number
  failingFields: string[]
}

const previewRecords: PreviewRecord[] = [
  { key: '1', partNumber: 'SP-100201', description: 'Marine Diesel Fuel Injector Nozzle', category: 'Engine Parts', manufacturer: 'Wärtsilä', uom: 'EA', leadTime: 14, unitCost: 1250.0, criticalSpare: 'Yes', status: 'Active', dqScore: 96, failingFields: [] },
  { key: '2', partNumber: 'SP-100202', description: 'Hydraulic Pump Seal Kit', category: 'Hydraulics', manufacturer: 'Bosch Rexroth', uom: 'SET', leadTime: 7, unitCost: 340.0, criticalSpare: 'No', status: 'Active', dqScore: 91, failingFields: [] },
  { key: '3', partNumber: 'SP-100203', description: '', category: 'Electrical', manufacturer: 'ABB', uom: 'EA', leadTime: 21, unitCost: 890.0, criticalSpare: 'Yes', status: 'Active', dqScore: 42, failingFields: ['description'] },
  { key: '4', partNumber: 'SP-100204', description: 'HVAC Compressor Belt', category: 'HVAC', manufacturer: 'Carrier', uom: 'EA', leadTime: 5, unitCost: 78.5, criticalSpare: 'No', status: 'Active', dqScore: 88, failingFields: [] },
  { key: '5', partNumber: '', description: 'Centrifugal Pump Impeller', category: 'Pumps', manufacturer: 'Grundfos', uom: 'EA', leadTime: 30, unitCost: 2100.0, criticalSpare: 'Yes', status: 'Active', dqScore: 38, failingFields: ['partNumber'] },
  { key: '6', partNumber: 'SP-100206', description: 'Navigation Radar Magnetron', category: 'Navigation', manufacturer: 'Furuno', uom: 'EA', leadTime: 45, unitCost: 4500.0, criticalSpare: 'Yes', status: 'Active', dqScore: 93, failingFields: [] },
  { key: '7', partNumber: 'SP-100207', description: 'Fire Suppression Nozzle', category: 'Safety', manufacturer: 'Tyco', uom: 'EA', leadTime: 10, unitCost: 220.0, criticalSpare: 'Yes', status: 'Pending Review', dqScore: 85, failingFields: [] },
  { key: '8', partNumber: 'SP-100208', description: 'Stern Tube Bearing Liner', category: 'Propulsion', manufacturer: 'Thordon Bearings', uom: 'EA', leadTime: null, unitCost: null, criticalSpare: 'Yes', status: 'Active', dqScore: 51, failingFields: ['leadTime', 'unitCost'] },
  { key: '9', partNumber: 'SP-100209', description: 'Lifeboat Davit Wire Rope', category: 'Safety', manufacturer: 'Bridon-Bekaert', uom: 'MTR', leadTime: 15, unitCost: 32.0, criticalSpare: 'No', status: 'Active', dqScore: 90, failingFields: [] },
  { key: '10', partNumber: 'SP-100210', description: 'Main Engine Turbocharger Cartridge', category: 'Engine Parts', manufacturer: '', uom: 'EA', leadTime: 60, unitCost: 18500.0, criticalSpare: 'Yes', status: 'Active', dqScore: 55, failingFields: ['manufacturer'] },
]

// ─── Job History Data ─────────────────────────────────────────────────

interface JobHistoryRecord {
  key: string
  jobId: string
  fileName: string
  entityType: string
  totalRecords: number
  passed: number
  exceptions: number
  status: 'Completed' | 'Completed with Exceptions' | 'Failed' | 'Cancelled'
  startedBy: string
  startedAt: string
  duration: string
}

const jobHistory: JobHistoryRecord[] = [
  { key: '1', jobId: 'JOB-0042', fileName: 'spare_parts_q1_2026.csv', entityType: 'Spare Part', totalRecords: 1248, passed: 1196, exceptions: 52, status: 'Completed with Exceptions', startedBy: 'Ahmed Al-Rashid', startedAt: '2026-03-28T14:22:00Z', duration: '4m 12s' },
  { key: '2', jobId: 'JOB-0041', fileName: 'vendor_master_update.xlsx', entityType: 'Vendor', totalRecords: 87, passed: 87, exceptions: 0, status: 'Completed', startedBy: 'Sarah Chen', startedAt: '2026-03-25T09:15:00Z', duration: '0m 38s' },
  { key: '3', jobId: 'JOB-0040', fileName: 'equipment_inventory_carnival.csv', entityType: 'Equipment', totalRecords: 534, passed: 510, exceptions: 24, status: 'Completed with Exceptions', startedBy: 'Ahmed Al-Rashid', startedAt: '2026-03-20T11:30:00Z', duration: '2m 55s' },
  { key: '4', jobId: 'JOB-0039', fileName: 'sap_parts_export_feb.csv', entityType: 'Spare Part', totalRecords: 2100, passed: 0, exceptions: 2100, status: 'Failed', startedBy: 'James O\'Connor', startedAt: '2026-03-15T16:45:00Z', duration: '0m 08s' },
  { key: '5', jobId: 'JOB-0038', fileName: 'vendor_onboard_batch3.xlsx', entityType: 'Vendor', totalRecords: 45, passed: 42, exceptions: 3, status: 'Completed with Exceptions', startedBy: 'Sarah Chen', startedAt: '2026-03-10T08:00:00Z', duration: '0m 22s' },
  { key: '6', jobId: 'JOB-0037', fileName: 'new_parts_amos_sync.csv', entityType: 'Spare Part', totalRecords: 320, passed: 320, exceptions: 0, status: 'Completed', startedBy: 'Ahmed Al-Rashid', startedAt: '2026-03-05T13:10:00Z', duration: '1m 45s' },
  { key: '7', jobId: 'JOB-0036', fileName: 'cancelled_import_test.csv', entityType: 'Spare Part', totalRecords: 500, passed: 112, exceptions: 0, status: 'Cancelled', startedBy: 'Raj Patel', startedAt: '2026-02-28T10:00:00Z', duration: '0m 30s' },
]

// ─── Component ────────────────────────────────────────────────────────

export default function BulkOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(initialColumnMappings)
  const [jobRunning, setJobRunning] = useState(false)
  const [jobProgress, setJobProgress] = useState(75)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const next = () => {
    if (currentStep === 0 && !uploadedFile) {
      message.warning('Please upload a file first.')
      return
    }
    if (currentStep === 3 && !jobRunning) {
      setJobRunning(true)
    }
    setCurrentStep((s) => Math.min(s + 1, 3))
  }

  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const handleMappingChange = (key: string, value: string) => {
    setColumnMappings((prev) =>
      prev.map((m) =>
        m.key === key
          ? { ...m, mdmAttribute: value === '— Unmapped —' ? null : value, autoMapped: false }
          : m,
      ),
    )
  }

  const handleCancelJob = () => {
    setCancelModalOpen(false)
    setJobRunning(false)
    setJobProgress(0)
    setCurrentStep(0)
    setUploadedFile(null)
    message.info('Job cancelled.')
  }

  // ── Step 1: Upload ────────────────────────────────────────────────

  const renderUpload = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Dragger
        accept=".csv,.xlsx"
        showUploadList={false}
        beforeUpload={() => {
          setUploadedFile('spare_parts_import_apr2026.csv')
          message.success('File uploaded successfully: spare_parts_import_apr2026.csv')
          return false
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag a file to this area to upload</p>
        <p className="ant-upload-hint">Supports .csv and .xlsx files. Maximum 10,000 records per batch.</p>
      </Dragger>
      {uploadedFile && (
        <Card size="small" style={{ marginTop: 16 }}>
          <Space>
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
            <Text strong>{uploadedFile}</Text>
            <Text type="secondary">(2.4 MB — 156 records detected)</Text>
          </Space>
        </Card>
      )}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Entity Type" value="Spare Part" />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Target Source" value="Excel Uploads" />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Records Detected" value={uploadedFile ? 156 : 0} />
          </Card>
        </Col>
      </Row>
    </div>
  )

  // ── Step 2: Column Mapping ────────────────────────────────────────

  const mappingColumns: ColumnsType<ColumnMapping> = [
    {
      title: 'Status',
      dataIndex: 'mdmAttribute',
      key: 'status',
      width: 60,
      align: 'center',
      render: (val: string | null) =>
        val ? (
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
        ) : (
          <WarningFilled style={{ color: '#faad14', fontSize: 18 }} />
        ),
    },
    {
      title: 'Source Column',
      dataIndex: 'sourceColumn',
      key: 'sourceColumn',
      render: (val: string) => <Text code>{val}</Text>,
    },
    {
      title: 'MDM Attribute',
      dataIndex: 'mdmAttribute',
      key: 'mdmAttribute',
      render: (val: string | null, record: ColumnMapping) => (
        <Select
          style={{ width: 220 }}
          value={val ?? '— Unmapped —'}
          onChange={(v) => handleMappingChange(record.key, v)}
          options={mdmAttributes.map((a) => ({ label: a, value: a }))}
        />
      ),
    },
    {
      title: 'Auto-Mapped',
      dataIndex: 'autoMapped',
      key: 'autoMapped',
      width: 120,
      render: (val: boolean) =>
        val ? <Tag color="green">Auto</Tag> : <Tag color="orange">Manual</Tag>,
    },
  ]

  const renderColumnMapping = () => {
    const mapped = columnMappings.filter((m) => m.mdmAttribute).length
    const total = columnMappings.length
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Text>
              <Text strong>{mapped}</Text> of <Text strong>{total}</Text> columns mapped
            </Text>
          </Col>
          <Col>
            <Tag color={mapped === total ? 'green' : 'orange'}>
              {mapped === total ? 'All Mapped' : `${total - mapped} Unmapped`}
            </Tag>
          </Col>
        </Row>
        <Table
          columns={mappingColumns}
          dataSource={columnMappings}
          pagination={false}
          size="middle"
        />
      </div>
    )
  }

  // ── Step 3: Validation Preview ────────────────────────────────────

  const cellStyle = (record: PreviewRecord, field: string): React.CSSProperties =>
    record.failingFields.includes(field)
      ? { backgroundColor: '#fff1f0', color: '#cf1322' }
      : {}

  const previewColumns: ColumnsType<PreviewRecord> = [
    {
      title: 'Part Number',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: 120,
      onCell: (r) => ({ style: cellStyle(r, 'partNumber') }),
      render: (val: string) => val || <Text type="danger" italic>MISSING</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      onCell: (r) => ({ style: cellStyle(r, 'description') }),
      render: (val: string) => val || <Text type="danger" italic>MISSING</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 140,
      onCell: (r) => ({ style: cellStyle(r, 'manufacturer') }),
      render: (val: string) => val || <Text type="danger" italic>MISSING</Text>,
    },
    {
      title: 'UoM',
      dataIndex: 'uom',
      key: 'uom',
      width: 70,
    },
    {
      title: 'Lead Time',
      dataIndex: 'leadTime',
      key: 'leadTime',
      width: 100,
      onCell: (r) => ({ style: cellStyle(r, 'leadTime') }),
      render: (val: number | null) =>
        val !== null ? `${val} days` : <Text type="danger" italic>MISSING</Text>,
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 110,
      onCell: (r) => ({ style: cellStyle(r, 'unitCost') }),
      render: (val: number | null) =>
        val !== null ? `$${val.toLocaleString()}` : <Text type="danger" italic>MISSING</Text>,
    },
    {
      title: 'DQ Score',
      dataIndex: 'dqScore',
      key: 'dqScore',
      width: 90,
      render: (val: number) => <DQBadge score={val} />,
    },
  ]

  const renderValidationPreview = () => {
    const passing = previewRecords.filter((r) => r.failingFields.length === 0).length
    const failing = previewRecords.length - passing
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Sample Records" value={previewRecords.length} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Passing" value={passing} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Failing" value={failing} valueStyle={{ color: '#ff4d4f' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Avg DQ Score" value={Math.round(previewRecords.reduce((s, r) => s + r.dqScore, 0) / previewRecords.length)} suffix="/ 100" />
            </Card>
          </Col>
        </Row>
        <Table
          columns={previewColumns}
          dataSource={previewRecords}
          pagination={false}
          size="middle"
          scroll={{ x: 900 }}
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Showing 10 of 156 records. Red-highlighted cells indicate failing validation rules.
        </Text>
      </div>
    )
  }

  // ── Step 4: Execute & Monitor ─────────────────────────────────────

  const renderExecute = () => (
    <div>
      <Progress
        percent={jobRunning ? jobProgress : 0}
        status={jobRunning ? 'active' : 'normal'}
        strokeColor="#1677ff"
        style={{ marginBottom: 24 }}
      />
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Records Processed" value={jobRunning ? 117 : 0} suffix="/ 156" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Passed"
              value={jobRunning ? 109 : 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="In Exception"
              value={jobRunning ? 8 : 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Est. Time Remaining" value={jobRunning ? '~0m 42s' : '—'} />
          </Card>
        </Col>
      </Row>
      {jobRunning && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button danger onClick={() => setCancelModalOpen(true)}>
            Cancel Job
          </Button>
        </div>
      )}
      <Modal
        title="Cancel Onboarding Job"
        open={cancelModalOpen}
        onOk={handleCancelJob}
        onCancel={() => setCancelModalOpen(false)}
        okText="Yes, Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to cancel this bulk onboarding job? Records already processed will
          remain, but remaining records will not be imported.
        </p>
      </Modal>
    </div>
  )

  // ── Step content selector ─────────────────────────────────────────

  const stepContent = [renderUpload, renderColumnMapping, renderValidationPreview, renderExecute]

  // ── Job History Table ─────────────────────────────────────────────

  const statusColor: Record<string, string> = {
    Completed: 'green',
    'Completed with Exceptions': 'orange',
    Failed: 'red',
    Cancelled: 'default',
  }

  const historyColumns: ColumnsType<JobHistoryRecord> = [
    { title: 'Job ID', dataIndex: 'jobId', key: 'jobId', width: 100 },
    { title: 'File Name', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    { title: 'Entity Type', dataIndex: 'entityType', key: 'entityType', width: 110 },
    { title: 'Total', dataIndex: 'totalRecords', key: 'totalRecords', width: 80, render: (v: number) => v.toLocaleString() },
    { title: 'Passed', dataIndex: 'passed', key: 'passed', width: 80, render: (v: number) => v.toLocaleString() },
    { title: 'Exceptions', dataIndex: 'exceptions', key: 'exceptions', width: 100, render: (v: number) => v > 0 ? <Text type="warning">{v}</Text> : v },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (val: string) => <Tag color={statusColor[val]}>{val}</Tag>,
    },
    { title: 'Started By', dataIndex: 'startedBy', key: 'startedBy', width: 150 },
    {
      title: 'Started At',
      dataIndex: 'startedAt',
      key: 'startedAt',
      width: 170,
      render: (val: string) => formatDateTime(val),
    },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 90 },
  ]

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Bulk Onboarding
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Steps
          current={currentStep}
          items={[
            { title: 'Upload File' },
            { title: 'Column Mapping' },
            { title: 'Validation Preview' },
            { title: 'Execute & Monitor' },
          ]}
          style={{ marginBottom: 32 }}
        />

        <div style={{ minHeight: 300 }}>{stepContent[currentStep]()}</div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={currentStep === 0} onClick={prev}>
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          ) : !jobRunning ? (
            <Button
              type="primary"
              onClick={() => {
                setJobRunning(true)
                message.success('Onboarding job started.')
              }}
            >
              Start Import
            </Button>
          ) : null}
        </div>
      </Card>

      <Card title="Job History">
        <Table
          columns={historyColumns}
          dataSource={jobHistory}
          pagination={{ pageSize: 5 }}
          size="middle"
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}
