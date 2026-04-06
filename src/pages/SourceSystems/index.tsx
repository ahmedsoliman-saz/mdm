import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Drawer,
  Table,
  Typography,
  Button,
  Descriptions,
  Space,
  Badge,
  message,
} from 'antd';
import {
  DatabaseOutlined,
  ApiOutlined,
  FileExcelOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { sourceSystems } from '../../data/sourceSystems';
import { formatDateTime } from '../../utils/formatDate';
import type { SourceSystem, SyncRun, FieldMapping } from '../../types';

const { Title, Text } = Typography;

const healthStatusColor: Record<string, string> = {
  Healthy: 'green',
  Degraded: 'orange',
  Down: 'red',
};

const sourceStatusColor: Record<string, string> = {
  Connected: 'green',
  Active: 'blue',
  Disconnected: 'red',
};

const maskedCredentials: Record<string, string> = {
  amos: 'postgresql://****:****@db.amos.internal:5432/fleet',
  sap: 'https://****:****@sap-erp.carnival.com/api/v2',
  excel: '/uploads/mro-data/*.xlsx (local file path)',
  'vendor-portal': 'https://****:****@vendor-api.carnival.com/v1',
};

const sourceIcons: Record<string, React.ReactNode> = {
  amos: <DatabaseOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
  sap: <ApiOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
  excel: <FileExcelOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
  'vendor-portal': <CloudServerOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
};

const syncHistoryColumns: ColumnsType<SyncRun> = [
  {
    title: 'Run ID',
    dataIndex: 'runId',
    key: 'runId',
    width: 120,
  },
  {
    title: 'Date',
    dataIndex: 'startedAt',
    key: 'startedAt',
    render: (val: string) => formatDateTime(val),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'Completed' ? 'green' : status === 'Failed' ? 'red' : 'blue'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Records Processed',
    dataIndex: 'recordsProcessed',
    key: 'recordsProcessed',
    align: 'right',
  },
  {
    title: 'Records Failed',
    dataIndex: 'recordsFailed',
    key: 'recordsFailed',
    align: 'right',
    render: (val: number) => (
      <Text type={val > 0 ? 'danger' : undefined}>{val}</Text>
    ),
  },
];

const fieldMappingColumns: ColumnsType<FieldMapping> = [
  {
    title: 'Source Field',
    dataIndex: 'sourceField',
    key: 'sourceField',
  },
  {
    title: 'Target Attribute',
    dataIndex: 'targetAttribute',
    key: 'targetAttribute',
  },
  {
    title: 'Status',
    dataIndex: 'mappingStatus',
    key: 'mappingStatus',
    render: (status: string) => {
      const color = status === 'Mapped' ? 'green' : status === 'Auto-mapped' ? 'blue' : 'red';
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

function getMappingSummary(mappings: FieldMapping[]) {
  const mapped = mappings.filter((m) => m.mappingStatus === 'Mapped').length;
  const unmapped = mappings.filter((m) => m.mappingStatus === 'Unmapped').length;
  const autoMapped = mappings.filter((m) => m.mappingStatus === 'Auto-mapped').length;
  return { mapped, unmapped, autoMapped, total: mappings.length };
}

export default function SourceSystems() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<SourceSystem | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const openDrawer = (system: SourceSystem) => {
    setSelected(system);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
  };

  const handleTestConnection = () => {
    setTestLoading(true);
    setTimeout(() => {
      setTestLoading(false);
      message.success(`Connection to ${selected?.name} is healthy.`);
    }, 2000);
  };

  const handleTriggerSync = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      message.success(`Sync triggered for ${selected?.name}. Processing records...`);
    }, 2000);
  };

  const summary = selected ? getMappingSummary(selected.fieldMappings) : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Source System Management
        </Title>
        <Text type="secondary">
          Monitor and manage connected data sources
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {sourceSystems.map((system) => (
          <Col key={system.id} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => openDrawer(system)}
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                {sourceIcons[system.id]}
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 15 }}>{system.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 13 }}>{system.type}</Text>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Space>
                  <Tag color={sourceStatusColor[system.status]}>{system.status}</Tag>
                  <Badge
                    color={healthStatusColor[system.healthStatus]}
                    text={system.healthStatus}
                  />
                </Space>
              </div>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Last Sync">
                  {formatDateTime(system.lastSyncAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Records">
                  {system.recordCount.toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={selected?.name ?? 'Source System Details'}
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        extra={
          <Space>
            <Button loading={testLoading} onClick={handleTestConnection}>
              Test Connection
            </Button>
            <Button type="primary" loading={syncLoading} onClick={handleTriggerSync}>
              Trigger Sync
            </Button>
          </Space>
        }
      >
        {selected && (
          <>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="Name">{selected.name}</Descriptions.Item>
              <Descriptions.Item label="Type">{selected.type}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={sourceStatusColor[selected.status]}>{selected.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Health">
                <Badge
                  color={healthStatusColor[selected.healthStatus]}
                  text={selected.healthStatus}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Connection String">
                <Text code>{maskedCredentials[selected.id]}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Last Sync">
                {formatDateTime(selected.lastSyncAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Records">
                {selected.recordCount.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5}>Field Mapping Summary</Title>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Total</Text>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{summary?.total}</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Mapped</Text>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>
                    {summary?.mapped}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Auto-mapped</Text>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#1677ff' }}>
                    {summary?.autoMapped}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Unmapped</Text>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#ff4d4f' }}>
                    {summary?.unmapped}
                  </div>
                </Card>
              </Col>
            </Row>

            <Table
              dataSource={selected.fieldMappings}
              columns={fieldMappingColumns}
              rowKey="sourceField"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            <Title level={5}>Sync History (Last 10 Runs)</Title>
            <Table
              dataSource={selected.syncHistory.slice(0, 10)}
              columns={syncHistoryColumns}
              rowKey="runId"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>
    </div>
  );
}
