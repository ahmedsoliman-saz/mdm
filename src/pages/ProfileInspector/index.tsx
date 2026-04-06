import { useState } from 'react'
import { Card, Row, Col, Typography, Select, Statistic, Space, Tag, Progress } from 'antd'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const { Title, Text } = Typography

interface TopValue {
  name: string
  count: number
}

interface DistributionBin {
  bin: string
  count: number
}

interface AttributeProfile {
  attribute: string
  completeness: number
  distinctCount: number
  nullCount: number
  topValues: TopValue[]
  pattern: string
  distribution: DistributionBin[]
}

type EntityType = 'spareParts' | 'vendors' | 'equipment'

const profileData: Record<EntityType, AttributeProfile[]> = {
  spareParts: [
    {
      attribute: 'Part Number',
      completeness: 100,
      distinctCount: 54,
      nullCount: 0,
      topValues: [
        { name: 'SP-001234', count: 1 }, { name: 'SP-001235', count: 1 },
        { name: 'SP-001236', count: 1 }, { name: 'SP-001240', count: 1 },
        { name: 'SP-001250', count: 1 },
      ],
      pattern: 'Format: SP-XXXXXX, 100% conforming',
      distribution: [
        { bin: 'SP-0012xx', count: 18 }, { bin: 'SP-0013xx', count: 14 },
        { bin: 'SP-0014xx', count: 12 }, { bin: 'SP-0015xx', count: 7 },
        { bin: 'SP-0016xx', count: 3 },
      ],
    },
    {
      attribute: 'Description',
      completeness: 98.1,
      distinctCount: 52,
      nullCount: 1,
      topValues: [
        { name: 'Marine Diesel Filter', count: 3 }, { name: 'Hydraulic Pump Seal', count: 2 },
        { name: 'Thrust Bearing Assembly', count: 2 }, { name: 'Fuel Injector Nozzle', count: 2 },
        { name: 'Coolant Hose 12mm', count: 2 },
      ],
      pattern: 'Free text, avg 24 chars, 98.1% populated',
      distribution: [
        { bin: '0–10 chars', count: 3 }, { bin: '11–20 chars', count: 14 },
        { bin: '21–30 chars', count: 22 }, { bin: '31–40 chars', count: 11 },
        { bin: '41+ chars', count: 4 },
      ],
    },
    {
      attribute: 'Category',
      completeness: 100,
      distinctCount: 8,
      nullCount: 0,
      topValues: [
        { name: 'Mechanical', count: 16 }, { name: 'Electrical', count: 12 },
        { name: 'Hydraulic', count: 8 }, { name: 'Safety', count: 7 },
        { name: 'HVAC', count: 5 },
      ],
      pattern: 'Controlled vocabulary, 8 distinct values',
      distribution: [
        { bin: 'Mechanical', count: 16 }, { bin: 'Electrical', count: 12 },
        { bin: 'Hydraulic', count: 8 }, { bin: 'Safety', count: 7 },
        { bin: 'HVAC', count: 5 }, { bin: 'Plumbing', count: 3 },
        { bin: 'Navigation', count: 2 }, { bin: 'Structural', count: 1 },
      ],
    },
    {
      attribute: 'Manufacturer',
      completeness: 96.3,
      distinctCount: 18,
      nullCount: 2,
      topValues: [
        { name: 'Wärtsilä', count: 11 }, { name: 'ABB Marine', count: 8 },
        { name: 'Caterpillar', count: 7 }, { name: 'MAN Energy', count: 6 },
        { name: 'Parker Hannifin', count: 5 },
      ],
      pattern: 'Free text, some inconsistency (e.g., "Wartsila" vs "Wärtsilä")',
      distribution: [
        { bin: 'Top 5 mfrs', count: 37 }, { bin: 'Ranks 6–10', count: 10 },
        { bin: 'Ranks 11–15', count: 4 }, { bin: 'Ranks 16–18', count: 3 },
      ],
    },
    {
      attribute: 'Unit of Measure',
      completeness: 100,
      distinctCount: 5,
      nullCount: 0,
      topValues: [
        { name: 'Each', count: 32 }, { name: 'Set', count: 9 },
        { name: 'Meter', count: 6 }, { name: 'Liter', count: 4 },
        { name: 'Kilogram', count: 3 },
      ],
      pattern: 'Controlled list, 5 values, 100% conforming',
      distribution: [
        { bin: 'Each', count: 32 }, { bin: 'Set', count: 9 },
        { bin: 'Meter', count: 6 }, { bin: 'Liter', count: 4 },
        { bin: 'Kilogram', count: 3 },
      ],
    },
    {
      attribute: 'Lead Time (days)',
      completeness: 94.4,
      distinctCount: 22,
      nullCount: 3,
      topValues: [
        { name: '14', count: 8 }, { name: '7', count: 7 },
        { name: '21', count: 6 }, { name: '30', count: 5 },
        { name: '45', count: 4 },
      ],
      pattern: 'Numeric, range 1–120 days, median 18 days',
      distribution: [
        { bin: '1–7', count: 10 }, { bin: '8–14', count: 14 },
        { bin: '15–30', count: 16 }, { bin: '31–60', count: 8 },
        { bin: '61–120', count: 3 },
      ],
    },
    {
      attribute: 'Unit Cost (USD)',
      completeness: 92.6,
      distinctCount: 48,
      nullCount: 4,
      topValues: [
        { name: '$45.00', count: 3 }, { name: '$125.50', count: 2 },
        { name: '$89.99', count: 2 }, { name: '$250.00', count: 2 },
        { name: '$1,200.00', count: 2 },
      ],
      pattern: 'Numeric, range $2.50–$18,500, median $142',
      distribution: [
        { bin: '$0–50', count: 12 }, { bin: '$51–200', count: 18 },
        { bin: '$201–500', count: 10 }, { bin: '$501–2K', count: 8 },
        { bin: '$2K+', count: 6 },
      ],
    },
    {
      attribute: 'Critical Spare',
      completeness: 100,
      distinctCount: 2,
      nullCount: 0,
      topValues: [
        { name: 'No', count: 38 }, { name: 'Yes', count: 16 },
      ],
      pattern: 'Boolean, 29.6% flagged as critical',
      distribution: [
        { bin: 'Yes', count: 16 }, { bin: 'No', count: 38 },
      ],
    },
    {
      attribute: 'Status',
      completeness: 100,
      distinctCount: 3,
      nullCount: 0,
      topValues: [
        { name: 'Active', count: 42 }, { name: 'Pending Review', count: 8 },
        { name: 'Obsolete', count: 4 },
      ],
      pattern: 'Enum: Active | Pending Review | Obsolete',
      distribution: [
        { bin: 'Active', count: 42 }, { bin: 'Pending Review', count: 8 },
        { bin: 'Obsolete', count: 4 },
      ],
    },
    {
      attribute: 'DQ Score',
      completeness: 100,
      distinctCount: 36,
      nullCount: 0,
      topValues: [
        { name: '92', count: 4 }, { name: '87', count: 3 },
        { name: '78', count: 3 }, { name: '95', count: 3 },
        { name: '65', count: 2 },
      ],
      pattern: 'Numeric 0–100, mean 82.4, std dev 12.1',
      distribution: [
        { bin: '0–59', count: 5 }, { bin: '60–69', count: 7 },
        { bin: '70–79', count: 10 }, { bin: '80–89', count: 16 },
        { bin: '90–100', count: 16 },
      ],
    },
  ],
  vendors: [
    {
      attribute: 'Vendor Code',
      completeness: 100,
      distinctCount: 22,
      nullCount: 0,
      topValues: [
        { name: 'V-1001', count: 1 }, { name: 'V-1002', count: 1 },
        { name: 'V-1003', count: 1 }, { name: 'V-1004', count: 1 },
        { name: 'V-1005', count: 1 },
      ],
      pattern: 'Format: V-XXXX, 100% conforming',
      distribution: [
        { bin: 'V-10xx', count: 10 }, { bin: 'V-11xx', count: 7 },
        { bin: 'V-12xx', count: 5 },
      ],
    },
    {
      attribute: 'Company Name',
      completeness: 100,
      distinctCount: 22,
      nullCount: 0,
      topValues: [
        { name: 'Wärtsilä Corp', count: 1 }, { name: 'ABB Marine & Ports', count: 1 },
        { name: 'MAN Energy Solutions', count: 1 }, { name: 'Parker Hannifin', count: 1 },
        { name: 'Alfa Laval', count: 1 },
      ],
      pattern: 'Free text, avg 18 chars, all unique',
      distribution: [
        { bin: '0–10 chars', count: 2 }, { bin: '11–20 chars', count: 12 },
        { bin: '21–30 chars', count: 6 }, { bin: '31+ chars', count: 2 },
      ],
    },
    {
      attribute: 'Country',
      completeness: 100,
      distinctCount: 9,
      nullCount: 0,
      topValues: [
        { name: 'Finland', count: 4 }, { name: 'Germany', count: 4 },
        { name: 'USA', count: 3 }, { name: 'Sweden', count: 3 },
        { name: 'Japan', count: 2 },
      ],
      pattern: 'Controlled list, 9 countries represented',
      distribution: [
        { bin: 'Europe', count: 14 }, { bin: 'Americas', count: 4 },
        { bin: 'Asia', count: 4 },
      ],
    },
    {
      attribute: 'Contact Email',
      completeness: 95.5,
      distinctCount: 21,
      nullCount: 1,
      topValues: [
        { name: 'sales@wartsila.com', count: 1 }, { name: 'marine@abb.com', count: 1 },
        { name: 'orders@man-es.com', count: 1 }, { name: 'info@parker.com', count: 1 },
        { name: 'contact@alfalaval.com', count: 1 },
      ],
      pattern: 'Email format, 95.5% valid RFC 5322',
      distribution: [
        { bin: '.com', count: 16 }, { bin: '.de', count: 2 },
        { bin: '.fi', count: 2 }, { bin: '.se', count: 1 }, { bin: 'null', count: 1 },
      ],
    },
    {
      attribute: 'Payment Terms',
      completeness: 100,
      distinctCount: 4,
      nullCount: 0,
      topValues: [
        { name: 'Net 30', count: 10 }, { name: 'Net 60', count: 6 },
        { name: 'Net 45', count: 4 }, { name: 'Net 15', count: 2 },
      ],
      pattern: 'Controlled list: Net 15/30/45/60',
      distribution: [
        { bin: 'Net 15', count: 2 }, { bin: 'Net 30', count: 10 },
        { bin: 'Net 45', count: 4 }, { bin: 'Net 60', count: 6 },
      ],
    },
    {
      attribute: 'Certification',
      completeness: 86.4,
      distinctCount: 6,
      nullCount: 3,
      topValues: [
        { name: 'ISO 9001', count: 8 }, { name: 'ISO 14001', count: 4 },
        { name: 'DNV GL', count: 3 }, { name: 'Lloyd\'s Register', count: 2 },
        { name: 'ABS Certified', count: 2 },
      ],
      pattern: '86.4% have at least one certification',
      distribution: [
        { bin: 'ISO 9001', count: 8 }, { bin: 'ISO 14001', count: 4 },
        { bin: 'DNV GL', count: 3 }, { bin: 'Lloyd\'s', count: 2 },
        { bin: 'ABS', count: 2 }, { bin: 'None', count: 3 },
      ],
    },
    {
      attribute: 'Status',
      completeness: 100,
      distinctCount: 3,
      nullCount: 0,
      topValues: [
        { name: 'Approved', count: 16 }, { name: 'Under Review', count: 4 },
        { name: 'Suspended', count: 2 },
      ],
      pattern: 'Enum: Approved | Under Review | Suspended',
      distribution: [
        { bin: 'Approved', count: 16 }, { bin: 'Under Review', count: 4 },
        { bin: 'Suspended', count: 2 },
      ],
    },
    {
      attribute: 'DQ Score',
      completeness: 100,
      distinctCount: 19,
      nullCount: 0,
      topValues: [
        { name: '94', count: 2 }, { name: '88', count: 2 },
        { name: '91', count: 2 }, { name: '76', count: 2 },
        { name: '85', count: 1 },
      ],
      pattern: 'Numeric 0–100, mean 86.7, std dev 9.8',
      distribution: [
        { bin: '0–59', count: 1 }, { bin: '60–69', count: 2 },
        { bin: '70–79', count: 3 }, { bin: '80–89', count: 7 },
        { bin: '90–100', count: 9 },
      ],
    },
  ],
  equipment: [
    {
      attribute: 'Equipment ID',
      completeness: 100,
      distinctCount: 30,
      nullCount: 0,
      topValues: [
        { name: 'EQ-1001', count: 1 }, { name: 'EQ-1002', count: 1 },
        { name: 'EQ-1003', count: 1 }, { name: 'EQ-1004', count: 1 },
        { name: 'EQ-1005', count: 1 },
      ],
      pattern: 'Format: EQ-XXXX, 100% conforming',
      distribution: [
        { bin: 'EQ-10xx', count: 12 }, { bin: 'EQ-11xx', count: 10 },
        { bin: 'EQ-12xx', count: 8 },
      ],
    },
    {
      attribute: 'Name',
      completeness: 100,
      distinctCount: 28,
      nullCount: 0,
      topValues: [
        { name: 'Main Engine #1', count: 2 }, { name: 'Bow Thruster', count: 2 },
        { name: 'HVAC Compressor A', count: 1 }, { name: 'Fire Pump Starboard', count: 1 },
        { name: 'Generator Set #3', count: 1 },
      ],
      pattern: 'Free text, avg 19 chars, 93% unique',
      distribution: [
        { bin: '0–10 chars', count: 4 }, { bin: '11–20 chars', count: 14 },
        { bin: '21–30 chars', count: 9 }, { bin: '31+ chars', count: 3 },
      ],
    },
    {
      attribute: 'Vessel',
      completeness: 100,
      distinctCount: 5,
      nullCount: 0,
      topValues: [
        { name: 'Carnival Horizon', count: 8 }, { name: 'Carnival Vista', count: 7 },
        { name: 'Mardi Gras', count: 6 }, { name: 'Carnival Celebration', count: 5 },
        { name: 'Carnival Jubilee', count: 4 },
      ],
      pattern: 'Controlled list, 5 vessels in fleet',
      distribution: [
        { bin: 'Carnival Horizon', count: 8 }, { bin: 'Carnival Vista', count: 7 },
        { bin: 'Mardi Gras', count: 6 }, { bin: 'Celebration', count: 5 },
        { bin: 'Jubilee', count: 4 },
      ],
    },
    {
      attribute: 'Deck / Location',
      completeness: 96.7,
      distinctCount: 14,
      nullCount: 1,
      topValues: [
        { name: 'Engine Room', count: 10 }, { name: 'Deck 2 — Aft', count: 4 },
        { name: 'Deck 0 — Below', count: 3 }, { name: 'Bridge', count: 3 },
        { name: 'Deck 14 — Lido', count: 2 },
      ],
      pattern: 'Semi-structured, 14 distinct locations',
      distribution: [
        { bin: 'Engine Room', count: 10 }, { bin: 'Deck 0–3', count: 9 },
        { bin: 'Deck 4–10', count: 5 }, { bin: 'Deck 11+', count: 4 },
        { bin: 'Bridge', count: 3 },
      ],
    },
    {
      attribute: 'Manufacturer',
      completeness: 100,
      distinctCount: 12,
      nullCount: 0,
      topValues: [
        { name: 'Wärtsilä', count: 7 }, { name: 'MAN Energy', count: 5 },
        { name: 'ABB', count: 4 }, { name: 'Caterpillar', count: 3 },
        { name: 'Rolls-Royce', count: 3 },
      ],
      pattern: 'Free text, 12 distinct manufacturers',
      distribution: [
        { bin: 'Top 3 mfrs', count: 16 }, { bin: 'Ranks 4–6', count: 7 },
        { bin: 'Ranks 7–9', count: 4 }, { bin: 'Ranks 10–12', count: 3 },
      ],
    },
    {
      attribute: 'Install Date',
      completeness: 93.3,
      distinctCount: 26,
      nullCount: 2,
      topValues: [
        { name: '2018-03-15', count: 2 }, { name: '2020-06-01', count: 2 },
        { name: '2019-11-22', count: 1 }, { name: '2021-01-10', count: 1 },
        { name: '2022-07-18', count: 1 },
      ],
      pattern: 'Date format YYYY-MM-DD, range 2015–2024',
      distribution: [
        { bin: '2015–2016', count: 3 }, { bin: '2017–2018', count: 6 },
        { bin: '2019–2020', count: 9 }, { bin: '2021–2022', count: 7 },
        { bin: '2023–2024', count: 5 },
      ],
    },
    {
      attribute: 'Status',
      completeness: 100,
      distinctCount: 3,
      nullCount: 0,
      topValues: [
        { name: 'Operational', count: 22 }, { name: 'Under Maintenance', count: 5 },
        { name: 'Decommissioned', count: 3 },
      ],
      pattern: 'Enum: Operational | Under Maintenance | Decommissioned',
      distribution: [
        { bin: 'Operational', count: 22 }, { bin: 'Under Maint.', count: 5 },
        { bin: 'Decommissioned', count: 3 },
      ],
    },
    {
      attribute: 'DQ Score',
      completeness: 100,
      distinctCount: 24,
      nullCount: 0,
      topValues: [
        { name: '85', count: 3 }, { name: '78', count: 2 },
        { name: '91', count: 2 }, { name: '72', count: 2 },
        { name: '88', count: 2 },
      ],
      pattern: 'Numeric 0–100, mean 79.3, std dev 14.2',
      distribution: [
        { bin: '0–59', count: 4 }, { bin: '60–69', count: 5 },
        { bin: '70–79', count: 8 }, { bin: '80–89', count: 8 },
        { bin: '90–100', count: 5 },
      ],
    },
  ],
}

const entityOptions = [
  { value: 'spareParts', label: 'Spare Parts' },
  { value: 'vendors', label: 'Vendors' },
  { value: 'equipment', label: 'Equipment' },
]

const completenessColor = (pct: number) => {
  if (pct >= 95) return '#52c41a'
  if (pct >= 80) return '#faad14'
  return '#ff4d4f'
}

function AttributeProfileCard({ profile }: { profile: AttributeProfile }) {
  return (
    <Card
      title={<Text strong>{profile.attribute}</Text>}
      size="small"
      styles={{ body: { padding: 16 } }}
    >
      <Row gutter={[16, 12]}>
        <Col span={8}>
          <Statistic
            title="Completeness"
            value={profile.completeness}
            suffix="%"
            valueStyle={{ fontSize: 20, color: completenessColor(profile.completeness) }}
          />
          <Progress
            percent={profile.completeness}
            showInfo={false}
            strokeColor={completenessColor(profile.completeness)}
            size="small"
            style={{ marginTop: 4 }}
          />
        </Col>
        <Col span={8}>
          <Statistic title="Distinct Values" value={profile.distinctCount} valueStyle={{ fontSize: 20 }} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Null Count"
            value={profile.nullCount}
            valueStyle={{ fontSize: 20, color: profile.nullCount > 0 ? '#faad14' : '#52c41a' }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
          Top Values
        </Text>
        <div style={{ width: '100%', height: 140, marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={profile.topValues} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1677ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
          Pattern Analysis
        </Text>
        <div style={{ marginTop: 4 }}>
          <Tag color="blue">{profile.pattern}</Tag>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
          Distribution
        </Text>
        <div style={{ width: '100%', height: 120, marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profile.distribution} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bin" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#36cfc9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

export default function ProfileInspector() {
  const [entityType, setEntityType] = useState<EntityType>('spareParts')

  const profiles = profileData[entityType]
  const entityLabel = entityOptions.find(o => o.value === entityType)?.label ?? entityType

  const avgCompleteness = profiles.reduce((sum, p) => sum + p.completeness, 0) / profiles.length
  const totalNulls = profiles.reduce((sum, p) => sum + p.nullCount, 0)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Profile Inspector</Title>
          <Text type="secondary">
            Attribute-level profiling for {entityLabel} ({profiles.length} attributes)
          </Text>
        </Col>
        <Col>
          <Space>
            <Text strong>Entity Type:</Text>
            <Select
              value={entityType}
              onChange={setEntityType}
              options={entityOptions}
              style={{ width: 180 }}
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Attributes Profiled" value={profiles.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Avg Completeness"
              value={avgCompleteness}
              precision={1}
              suffix="%"
              valueStyle={{ color: completenessColor(avgCompleteness) }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Null Values"
              value={totalNulls}
              valueStyle={{ color: totalNulls > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="100% Complete"
              value={profiles.filter(p => p.completeness === 100).length}
              suffix={`/ ${profiles.length}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {profiles.map(profile => (
          <Col xs={24} xl={12} key={profile.attribute}>
            <AttributeProfileCard profile={profile} />
          </Col>
        ))}
      </Row>
    </Space>
  )
}
