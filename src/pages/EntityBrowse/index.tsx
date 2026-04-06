import { useState, useMemo } from 'react'
import { Table, Input, Card, Tabs, Select, Slider, Tag, Typography, Space, Button, Row, Col } from 'antd'
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { spareParts } from '../../data/spareParts'
import { vendors } from '../../data/vendors'
import { equipment } from '../../data/equipment'
import DQBadge from '../../components/DQBadge'
import EmptyState from '../../components/EmptyState'
import { formatDate } from '../../utils/formatDate'
import type { SparePartCategory, EntityStatus, SourceSystemId, VendorStatus, EquipmentStatus } from '../../types'

const { Title } = Typography

type ActiveEntity = 'spare-parts' | 'vendors' | 'equipment'

function getActiveEntity(pathname: string): ActiveEntity {
  if (pathname.includes('vendors')) return 'vendors'
  if (pathname.includes('equipment')) return 'equipment'
  return 'spare-parts'
}

const categories: SparePartCategory[] = ['Mechanical', 'Electrical', 'HVAC', 'Safety', 'Hull']
const statuses: string[] = ['Active', 'Obsolete', 'Pending Review', 'Approved', 'Under Review', 'Suspended', 'Operational', 'Under Maintenance', 'Decommissioned']
const sources: { value: SourceSystemId; label: string }[] = [
  { value: 'amos', label: 'AMOS' },
  { value: 'sap', label: 'SAP ERP' },
  { value: 'excel', label: 'Excel Uploads' },
  { value: 'vendor-portal', label: 'Vendor Portal' },
]
const stewards = [
  { value: 'u-001', label: 'Ahmed Al-Rashid' },
  { value: 'u-002', label: 'Sarah Chen' },
  { value: 'u-003', label: "James O'Connor" },
  { value: 'u-004', label: 'Maria Santos' },
]

export default function EntityBrowse() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeEntity = getActiveEntity(location.pathname)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')
  const [stewardFilter, setStewardFilter] = useState<string>('')
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('')
  const [dqRange, setDqRange] = useState<[number, number]>([0, 100])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const allManufacturers = useMemo(() => {
    const mfrs = new Set(spareParts.map(sp => sp.manufacturer))
    return Array.from(mfrs).sort().map(m => ({ value: m, label: m }))
  }, [])

  const spColumns = [
    {
      title: 'Part Number',
      dataIndex: 'partNumber',
      key: 'partNumber',
      sorter: (a: typeof spareParts[0], b: typeof spareParts[0]) => a.partNumber.localeCompare(b.partNumber),
      render: (text: string, record: typeof spareParts[0]) => (
        <a onClick={() => navigate(`/entities/spare-parts/records/${record.id}`)}>{text}</a>
      ),
    },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Manufacturer', dataIndex: 'manufacturer', key: 'manufacturer' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: EntityStatus) => {
        const color = v === 'Active' ? 'green' : v === 'Obsolete' ? 'red' : 'orange'
        return <Tag color={color}>{v}</Tag>
      },
    },
    { title: 'DQ Score', dataIndex: 'dqScore', key: 'dqScore', render: (v: number) => <DQBadge score={v} size="small" />, sorter: (a: typeof spareParts[0], b: typeof spareParts[0]) => a.dqScore - b.dqScore },
    { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated', render: (v: string) => formatDate(v), sorter: (a: typeof spareParts[0], b: typeof spareParts[0]) => a.lastUpdated.localeCompare(b.lastUpdated) },
  ]

  const vendorColumns = [
    {
      title: 'Vendor Code',
      dataIndex: 'vendorCode',
      key: 'vendorCode',
      render: (text: string, record: typeof vendors[0]) => (
        <a onClick={() => navigate(`/entities/vendors/records/${record.id}`)}>{text}</a>
      ),
    },
    { title: 'Company', dataIndex: 'companyName', key: 'companyName', ellipsis: true },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Payment Terms', dataIndex: 'paymentTerms', key: 'paymentTerms' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: VendorStatus) => {
        const color = v === 'Approved' ? 'green' : v === 'Suspended' ? 'red' : 'orange'
        return <Tag color={color}>{v}</Tag>
      },
    },
    { title: 'DQ Score', dataIndex: 'dqScore', key: 'dqScore', render: (v: number) => <DQBadge score={v} size="small" /> },
    { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated', render: (v: string) => formatDate(v) },
  ]

  const eqColumns = [
    {
      title: 'Equipment ID',
      dataIndex: 'equipmentId',
      key: 'equipmentId',
      render: (text: string, record: typeof equipment[0]) => (
        <a onClick={() => navigate(`/entities/equipment/records/${record.id}`)}>{text}</a>
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Vessel', dataIndex: 'vessel', key: 'vessel' },
    { title: 'Deck Location', dataIndex: 'deckLocation', key: 'deckLocation' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: EquipmentStatus) => {
        const color = v === 'Operational' ? 'green' : v === 'Decommissioned' ? 'red' : 'orange'
        return <Tag color={color}>{v}</Tag>
      },
    },
    { title: 'Source', dataIndex: 'sourceSystem', key: 'sourceSystem', render: (v: string) => <Tag>{v.toUpperCase()}</Tag> },
    { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated', render: (v: string) => formatDate(v) },
  ]

  const filteredSpareParts = useMemo(() => {
    return spareParts.filter(sp => {
      if (search && !sp.partNumber.toLowerCase().includes(search.toLowerCase()) && !sp.description.toLowerCase().includes(search.toLowerCase())) return false
      if (category && sp.category !== category) return false
      if (statusFilter && sp.status !== statusFilter) return false
      if (sourceFilter && sp.sourceSystem !== sourceFilter) return false
      if (stewardFilter && sp.assignedSteward !== stewardFilter) return false
      if (manufacturerFilter && sp.manufacturer !== manufacturerFilter) return false
      if (sp.dqScore < dqRange[0] || sp.dqScore > dqRange[1]) return false
      return true
    })
  }, [search, category, statusFilter, sourceFilter, stewardFilter, manufacturerFilter, dqRange])

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      if (search && !v.vendorCode.toLowerCase().includes(search.toLowerCase()) && !v.companyName.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && v.status !== statusFilter) return false
      if (sourceFilter && v.sourceSystem !== sourceFilter) return false
      if (v.dqScore < dqRange[0] || v.dqScore > dqRange[1]) return false
      return true
    })
  }, [search, statusFilter, sourceFilter, dqRange])

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e => {
      if (search && !e.equipmentId.toLowerCase().includes(search.toLowerCase()) && !e.name.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && e.status !== statusFilter) return false
      if (sourceFilter && e.sourceSystem !== sourceFilter) return false
      return true
    })
  }, [search, statusFilter, sourceFilter])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentData: any[] = activeEntity === 'spare-parts' ? filteredSpareParts : activeEntity === 'vendors' ? filteredVendors : filteredEquipment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentColumns: any[] = activeEntity === 'spare-parts' ? spColumns : activeEntity === 'vendors' ? vendorColumns : eqColumns
  const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setStatusFilter('')
    setSourceFilter('')
    setStewardFilter('')
    setManufacturerFilter('')
    setDqRange([0, 100])
    setCurrentPage(1)
  }

  const filterPanel = activeEntity === 'spare-parts' ? (
    <Row gutter={[12, 12]}>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Category</div>
        <Select
          allowClear
          placeholder="All categories"
          value={category || undefined}
          onChange={v => { setCategory(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={categories.map(c => ({ value: c, label: c }))}
          size="small"
        />
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Manufacturer</div>
        <Select
          allowClear
          showSearch
          placeholder="All manufacturers"
          value={manufacturerFilter || undefined}
          onChange={v => { setManufacturerFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={allManufacturers}
          size="small"
        />
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Status</div>
        <Select
          allowClear
          placeholder="All statuses"
          value={statusFilter || undefined}
          onChange={v => { setStatusFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={statuses.map(s => ({ value: s, label: s }))}
          size="small"
        />
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Source System</div>
        <Select
          allowClear
          placeholder="All sources"
          value={sourceFilter || undefined}
          onChange={v => { setSourceFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={sources}
          size="small"
        />
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Assigned Steward</div>
        <Select
          allowClear
          placeholder="All stewards"
          value={stewardFilter || undefined}
          onChange={v => { setStewardFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={stewards}
          size="small"
        />
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>DQ Score Range: {dqRange[0]} – {dqRange[1]}</div>
        <Slider range min={0} max={100} value={dqRange} onChange={v => { setDqRange(v as [number, number]); setCurrentPage(1) }} />
      </Col>
    </Row>
  ) : (
    <Row gutter={[12, 12]}>
      <Col span={8}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Status</div>
        <Select
          allowClear
          placeholder="All statuses"
          value={statusFilter || undefined}
          onChange={v => { setStatusFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={statuses.map(s => ({ value: s, label: s }))}
          size="small"
        />
      </Col>
      <Col span={8}>
        <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>Source System</div>
        <Select
          allowClear
          placeholder="All sources"
          value={sourceFilter || undefined}
          onChange={v => { setSourceFilter(v || ''); setCurrentPage(1) }}
          style={{ width: '100%' }}
          options={sources}
          size="small"
        />
      </Col>
      {activeEntity === 'vendors' && (
        <Col span={8}>
          <div style={{ marginBottom: 4, fontSize: 12, color: '#8c8c8c' }}>DQ Score Range: {dqRange[0]} – {dqRange[1]}</div>
          <Slider range min={0} max={100} value={dqRange} onChange={v => { setDqRange(v as [number, number]); setCurrentPage(1) }} />
        </Col>
      )}
    </Row>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Entity Browse</Title>
        <Space>
          <Button icon={<ClearOutlined />} size="small" onClick={clearFilters}>Clear Filters</Button>
          <Button
            icon={<FilterOutlined />}
            size="small"
            type={filtersOpen ? 'primary' : 'default'}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
          </Button>
        </Space>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by ID or description..."
        value={search}
        onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
        style={{ marginBottom: 12 }}
        allowClear
      />

      {filtersOpen && (
        <Card size="small" style={{ marginBottom: 12 }}>
          {filterPanel}
        </Card>
      )}

      <Tabs
        activeKey={activeEntity}
        onChange={key => {
          clearFilters()
          navigate(`/entities/${key}`)
        }}
        items={[
          { key: 'spare-parts', label: `Spare Parts (${filteredSpareParts.length})` },
          { key: 'vendors', label: `Vendors (${filteredVendors.length})` },
          { key: 'equipment', label: `Equipment (${filteredEquipment.length})` },
        ]}
      />

      {currentData.length === 0 ? (
        <EmptyState
          title="No records found"
          description="Try adjusting your filters or search query"
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <Table
          dataSource={paginatedData}
          columns={currentColumns}
          rowKey="id"
          size="small"
          pagination={{
            current: currentPage,
            pageSize,
            total: currentData.length,
            showSizeChanger: false,
            showTotal: (total) => `${total} records`,
            onChange: (page) => setCurrentPage(page),
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/entities/${activeEntity}/records/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      )}
    </div>
  )
}
