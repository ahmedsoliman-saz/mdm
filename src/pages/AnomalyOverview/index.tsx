import { useState } from 'react';
import { Card, Row, Col, Tag, Drawer, Typography, Button, Space, List, Badge, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { anomalies as anomalyData } from '../../data/anomalies';
import { formatDate } from '../../utils/formatDate';
import type { Anomaly } from '../../types';

const { Title, Text, Paragraph } = Typography;

const severityColor: Record<string, string> = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

const statusColor: Record<string, string> = {
  New: 'blue',
  Investigating: 'orange',
  Resolved: 'green',
  Dismissed: 'default',
};

const entityTypeLabel: Record<string, string> = {
  'spare-parts': 'Spare Parts',
  vendors: 'Vendors',
  equipment: 'Equipment',
};

/** Generate mock distribution data for the drawer's bar chart. */
function generateDistributionData(anomaly: Anomaly) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Use affected record count to seed some variation
  const base = Math.max(5, Math.floor(anomaly.affectedRecordCount / 4));
  return labels.map((day, i) => {
    const isOutlier = i === 4; // Friday is the outlier
    return {
      day,
      value: isOutlier ? anomaly.affectedRecordCount : base + ((i * 7 + anomaly.affectedRecordCount) % (base || 1)),
      isOutlier,
    };
  });
}

export default function AnomalyOverview() {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState<Anomaly[]>(anomalyData);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedAnomaly(null);
  };

  const handleConfirm = (anomaly: Anomaly) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomaly.id ? { ...a, status: 'Investigating' as const } : a)),
    );
    setSelectedAnomaly((prev) => (prev ? { ...prev, status: 'Investigating' as const } : prev));
    message.success(`Anomaly ${anomaly.id} confirmed — status set to Investigating`);
  };

  const handleDismiss = (anomaly: Anomaly) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anomaly.id ? { ...a, status: 'Dismissed' as const } : a)),
    );
    setSelectedAnomaly((prev) => (prev ? { ...prev, status: 'Dismissed' as const } : prev));
    message.info(`Anomaly ${anomaly.id} dismissed`);
  };

  const chartData = selectedAnomaly ? generateDistributionData(selectedAnomaly) : [];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Anomaly Overview
        </Title>
        <Text type="secondary">Detected deviations from expected data patterns</Text>
      </div>

      <Row gutter={[16, 16]}>
        {anomalies.map((anomaly) => (
          <Col key={anomaly.id} xs={24} sm={12} lg={8} xl={6}>
            <Badge.Ribbon
              text={anomaly.severity}
              color={severityColor[anomaly.severity]}
            >
              <Card
                hoverable
                onClick={() => openDrawer(anomaly)}
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: 14 }}>
                    {anomaly.id}
                  </Text>
                  <Tag>{anomaly.anomalyType}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Entity: {entityTypeLabel[anomaly.entityType] ?? anomaly.entityType}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Detected: {formatDate(anomaly.detectedAt)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Affected records: <Text strong>{anomaly.affectedRecordCount}</Text>
                  </Text>
                  <Tag color={statusColor[anomaly.status]}>{anomaly.status}</Tag>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      <Drawer
        title={
          selectedAnomaly ? (
            <Space>
              <span>{selectedAnomaly.id}</span>
              <Tag color={severityColor[selectedAnomaly.severity]}>
                {selectedAnomaly.severity}
              </Tag>
              <Tag color={statusColor[selectedAnomaly.status]}>
                {selectedAnomaly.status}
              </Tag>
            </Space>
          ) : null
        }
        placement="right"
        width={560}
        open={drawerOpen}
        onClose={closeDrawer}
        extra={
          selectedAnomaly &&
          selectedAnomaly.status !== 'Resolved' &&
          selectedAnomaly.status !== 'Dismissed' ? (
            <Space>
              <Button type="primary" onClick={() => handleConfirm(selectedAnomaly)}>
                Confirm
              </Button>
              <Button danger onClick={() => handleDismiss(selectedAnomaly)}>
                Dismiss
              </Button>
            </Space>
          ) : null
        }
      >
        {selectedAnomaly && (
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* Description */}
            <div>
              <Title level={5}>
                {selectedAnomaly.anomalyType} — {entityTypeLabel[selectedAnomaly.entityType]}
              </Title>
              <Paragraph>{selectedAnomaly.description}</Paragraph>
            </div>

            {/* Distribution Chart */}
            <div>
              <Title level={5}>Distribution</Title>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isOutlier ? '#ff4d4f' : '#1677ff'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Affected Records */}
            <div>
              <Title level={5}>Affected Records (first 5)</Title>
              <List
                size="small"
                bordered
                dataSource={selectedAnomaly.affectedRecordIds.slice(0, 5)}
                renderItem={(recordId: string) => (
                  <List.Item>
                    <Button
                      type="link"
                      style={{ padding: 0 }}
                      onClick={() => {
                        closeDrawer();
                        navigate(
                          `/entities/${selectedAnomaly.entityType}/records/${recordId}`,
                        );
                      }}
                    >
                      {recordId}
                    </Button>
                  </List.Item>
                )}
              />
            </div>
          </Space>
        )}
      </Drawer>
    </>
  );
}
