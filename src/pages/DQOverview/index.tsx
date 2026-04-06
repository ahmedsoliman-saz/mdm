import { Card, Row, Col, Typography, Table, Tag } from 'antd'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

const { Title, Text } = Typography

// ── Colors ──────────────────────────────────────────────────────────
const GREEN = '#52c41a'
const BLUE = '#1677ff'
const ORANGE = '#faad14'
const RED = '#ff4d4f'

// ── 1. Overall DQ Score donut ───────────────────────────────────────
const overallScore = 86.2
const overallDonutData = [
  { name: 'Score', value: overallScore },
  { name: 'Gap', value: 100 - overallScore },
]

// ── 2. Entity type bar chart ────────────────────────────────────────
const entityScores = [
  { entity: 'Spare Parts', score: 87.3 },
  { entity: 'Vendors', score: 92.1 },
  { entity: 'Equipment', score: 78.6 },
]

// ── 3. 30-day trend data ────────────────────────────────────────────
const trendData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const dateStr = `Mar ${day}`
  return {
    date: dateStr,
    'Spare Parts': +(83 + Math.sin(i * 0.3) * 3 + i * 0.15).toFixed(1),
    Vendors: +(89 + Math.cos(i * 0.25) * 2 + i * 0.1).toFixed(1),
    Equipment: +(74 + Math.sin(i * 0.35) * 4 + i * 0.15).toFixed(1),
  }
})

// ── 4. DQ dimension breakdown (stacked bar) ────────────────────────
const dimensionData = [
  { dimension: 'Completeness', 'Spare Parts': 91, Vendors: 95, Equipment: 82 },
  { dimension: 'Uniqueness', 'Spare Parts': 88, Vendors: 94, Equipment: 80 },
  { dimension: 'Validity', 'Spare Parts': 85, Vendors: 90, Equipment: 76 },
  { dimension: 'Consistency', 'Spare Parts': 87, Vendors: 91, Equipment: 77 },
  { dimension: 'Timeliness', 'Spare Parts': 86, Vendors: 89, Equipment: 78 },
]

// ── 5. Top 10 failing rules (horizontal bar) ───────────────────────
const failingRules = [
  { rule: 'Missing manufacturer', failures: 142 },
  { rule: 'Invalid unit of measure', failures: 118 },
  { rule: 'Duplicate part number', failures: 97 },
  { rule: 'Missing lead time', failures: 89 },
  { rule: 'Cost out of range', failures: 76 },
  { rule: 'Missing vendor certification', failures: 64 },
  { rule: 'Invalid email format', failures: 58 },
  { rule: 'Missing install date', failures: 51 },
  { rule: 'Description too short', failures: 43 },
  { rule: 'Inconsistent country code', failures: 37 },
]

// ── 6. Source system heatmap table data ─────────────────────────────
const heatmapData = [
  {
    key: '1',
    source: 'AMOS (Fleet Management)',
    completeness: 94,
    uniqueness: 91,
    validity: 88,
    consistency: 90,
    timeliness: 92,
    overall: 91,
  },
  {
    key: '2',
    source: 'SAP ERP',
    completeness: 87,
    uniqueness: 82,
    validity: 79,
    consistency: 84,
    timeliness: 76,
    overall: 81.6,
  },
  {
    key: '3',
    source: 'Excel Uploads',
    completeness: 72,
    uniqueness: 65,
    validity: 68,
    consistency: 60,
    timeliness: 58,
    overall: 64.6,
  },
  {
    key: '4',
    source: 'Vendor Portal API',
    completeness: 96,
    uniqueness: 93,
    validity: 91,
    consistency: 94,
    timeliness: 95,
    overall: 93.8,
  },
]

function dqColor(value: number): string {
  if (value >= 85) return GREEN
  if (value >= 60) return ORANGE
  return RED
}

function dqTag(value: number) {
  const color = value >= 85 ? 'green' : value >= 60 ? 'orange' : 'red'
  return <Tag color={color}>{value}%</Tag>
}

const heatmapColumns = [
  {
    title: 'Source System',
    dataIndex: 'source',
    key: 'source',
    width: 200,
  },
  ...['completeness', 'uniqueness', 'validity', 'consistency', 'timeliness', 'overall'].map(
    (dim) => ({
      title: dim.charAt(0).toUpperCase() + dim.slice(1),
      dataIndex: dim,
      key: dim,
      align: 'center' as const,
      width: 120,
      render: (val: number) => dqTag(val),
    }),
  ),
]

// ── Bar color helper for entity score bar ───────────────────────────
function entityBarColor(score: number): string {
  if (score >= 85) return GREEN
  if (score >= 60) return ORANGE
  return RED
}

export default function DQOverview() {
  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Data Quality Overview
      </Title>

      {/* Row 1: Overall score donut + Entity scores bar */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Overall DQ Score" styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ position: 'relative', width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overallDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={dqColor(overallScore)} />
                    <Cell fill="#f0f0f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 700, color: dqColor(overallScore) }}>
                  {overallScore}%
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Across all entities
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="DQ Score by Entity Type" styles={{ body: { padding: '16px 24px' } }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={entityScores} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entity" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" name="DQ Score">
                  {entityScores.map((entry, idx) => (
                    <Cell key={idx} fill={entityBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 2: 30-day trend */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="30-Day DQ Trend" styles={{ body: { padding: '16px 24px' } }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={4} />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Spare Parts"
                  stroke={BLUE}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Vendors"
                  stroke={GREEN}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Equipment"
                  stroke={ORANGE}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Dimension breakdown + Top failing rules */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="DQ by Dimension" styles={{ body: { padding: '16px 24px' } }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dimensionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dimension" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="Spare Parts" fill={BLUE} />
                <Bar dataKey="Vendors" fill={GREEN} />
                <Bar dataKey="Equipment" fill={ORANGE} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top 10 Failing Rules" styles={{ body: { padding: '16px 24px' } }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={failingRules} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="rule"
                  width={180}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="failures" name="Failures" fill={RED} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Source system heatmap */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Source System DQ Heatmap" styles={{ body: { padding: '16px 24px' } }}>
            <Table
              columns={heatmapColumns}
              dataSource={heatmapData}
              pagination={false}
              bordered
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
