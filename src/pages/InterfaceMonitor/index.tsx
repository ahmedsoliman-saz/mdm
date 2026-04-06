import { useState } from 'react';
import { Table, Tag, Drawer, Typography, Button, Space, Input, message, Card } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { formatDateTime } from '../../utils/formatDate';
import type { InterfaceRecord, InterfaceRun, InterfaceStatus } from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

// ===== Mock Data =====

const mockInterfaces: InterfaceRecord[] = [
  {
    id: 'IF-001',
    name: 'AMOS Spare Parts Sync',
    direction: 'Inbound',
    sourceSystem: 'AMOS (Fleet Management)',
    targetSystem: 'Sazience MDM',
    schedule: 'Every 4 hours',
    lastRunAt: '2026-04-06T08:00:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '2026-04-06T12:00:00Z',
    recordsLastSync: 1243,
    runHistory: [
      { runAt: '2026-04-06T08:00:00Z', status: 'Success', recordsProcessed: 1243 },
      { runAt: '2026-04-06T04:00:00Z', status: 'Success', recordsProcessed: 1240 },
      { runAt: '2026-04-06T00:00:00Z', status: 'Success', recordsProcessed: 1238 },
      { runAt: '2026-04-05T20:00:00Z', status: 'Failed', recordsProcessed: 0, errorMessage: 'Connection timeout after 30s — AMOS database unreachable. Verify VPN tunnel status and retry.' },
      { runAt: '2026-04-05T16:00:00Z', status: 'Success', recordsProcessed: 1235 },
    ],
  },
  {
    id: 'IF-002',
    name: 'SAP Material Master Import',
    direction: 'Inbound',
    sourceSystem: 'SAP ERP',
    targetSystem: 'Sazience MDM',
    schedule: 'Daily at 02:00',
    lastRunAt: '2026-04-06T02:00:00Z',
    lastRunStatus: 'Failed',
    nextRunAt: '2026-04-07T02:00:00Z',
    recordsLastSync: 0,
    runHistory: [
      { runAt: '2026-04-06T02:00:00Z', status: 'Failed', recordsProcessed: 0, errorMessage: 'SAP RFC connection error: SYSTEM_FAILURE — RFC destination SM_MDM_PROD returned error code 500. IDoc processing halted at segment E1MARAM. Contact SAP Basis team.' },
      { runAt: '2026-04-05T02:00:00Z', status: 'Success', recordsProcessed: 874 },
      { runAt: '2026-04-04T02:00:00Z', status: 'Success', recordsProcessed: 871 },
    ],
  },
  {
    id: 'IF-003',
    name: 'Vendor Portal Ingest',
    direction: 'Inbound',
    sourceSystem: 'Vendor Portal API',
    targetSystem: 'Sazience MDM',
    schedule: 'Every 6 hours',
    lastRunAt: '2026-04-06T06:00:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '2026-04-06T12:00:00Z',
    recordsLastSync: 312,
    runHistory: [
      { runAt: '2026-04-06T06:00:00Z', status: 'Success', recordsProcessed: 312 },
      { runAt: '2026-04-06T00:00:00Z', status: 'Success', recordsProcessed: 310 },
      { runAt: '2026-04-05T18:00:00Z', status: 'Success', recordsProcessed: 308 },
    ],
  },
  {
    id: 'IF-004',
    name: 'Excel Bulk Upload Processor',
    direction: 'Inbound',
    sourceSystem: 'Excel Uploads',
    targetSystem: 'Sazience MDM',
    schedule: 'On demand',
    lastRunAt: '2026-04-05T14:30:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '-',
    recordsLastSync: 57,
    runHistory: [
      { runAt: '2026-04-05T14:30:00Z', status: 'Success', recordsProcessed: 57 },
      { runAt: '2026-04-03T09:15:00Z', status: 'Success', recordsProcessed: 120 },
    ],
  },
  {
    id: 'IF-005',
    name: 'Golden Record Export to SAP',
    direction: 'Outbound',
    sourceSystem: 'Sazience MDM',
    targetSystem: 'SAP ERP',
    schedule: 'Daily at 05:00',
    lastRunAt: '2026-04-06T05:00:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '2026-04-07T05:00:00Z',
    recordsLastSync: 2105,
    runHistory: [
      { runAt: '2026-04-06T05:00:00Z', status: 'Success', recordsProcessed: 2105 },
      { runAt: '2026-04-05T05:00:00Z', status: 'Success', recordsProcessed: 2098 },
      { runAt: '2026-04-04T05:00:00Z', status: 'Success', recordsProcessed: 2090 },
    ],
  },
  {
    id: 'IF-006',
    name: 'AMOS Equipment Sync',
    direction: 'Inbound',
    sourceSystem: 'AMOS (Fleet Management)',
    targetSystem: 'Sazience MDM',
    schedule: 'Every 8 hours',
    lastRunAt: '2026-04-06T08:00:00Z',
    lastRunStatus: 'Running',
    nextRunAt: '2026-04-06T16:00:00Z',
    recordsLastSync: 489,
    runHistory: [
      { runAt: '2026-04-06T08:00:00Z', status: 'Running', recordsProcessed: 0 },
      { runAt: '2026-04-06T00:00:00Z', status: 'Success', recordsProcessed: 489 },
      { runAt: '2026-04-05T16:00:00Z', status: 'Success', recordsProcessed: 487 },
    ],
  },
  {
    id: 'IF-007',
    name: 'Vendor Cert Publish to Portal',
    direction: 'Outbound',
    sourceSystem: 'Sazience MDM',
    targetSystem: 'Vendor Portal API',
    schedule: 'Weekly — Monday 06:00',
    lastRunAt: '2026-03-31T06:00:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '2026-04-07T06:00:00Z',
    recordsLastSync: 198,
    runHistory: [
      { runAt: '2026-03-31T06:00:00Z', status: 'Success', recordsProcessed: 198 },
      { runAt: '2026-03-24T06:00:00Z', status: 'Success', recordsProcessed: 195 },
    ],
  },
  {
    id: 'IF-008',
    name: 'DQ Scorecard Export',
    direction: 'Outbound',
    sourceSystem: 'Sazience MDM',
    targetSystem: 'Excel Uploads',
    schedule: 'Daily at 07:00',
    lastRunAt: '2026-04-06T07:00:00Z',
    lastRunStatus: 'Success',
    nextRunAt: '2026-04-07T07:00:00Z',
    recordsLastSync: 3420,
    runHistory: [
      { runAt: '2026-04-06T07:00:00Z', status: 'Success', recordsProcessed: 3420 },
      { runAt: '2026-04-05T07:00:00Z', status: 'Success', recordsProcessed: 3415 },
    ],
  },
  {
    id: 'IF-009',
    name: 'SAP Vendor Master Import',
    direction: 'Inbound',
    sourceSystem: 'SAP ERP',
    targetSystem: 'Sazience MDM',
    schedule: 'Daily at 03:00',
    lastRunAt: '2026-04-06T03:00:00Z',
    lastRunStatus: 'Failed',
    nextRunAt: '2026-04-07T03:00:00Z',
    recordsLastSync: 0,
    runHistory: [
      { runAt: '2026-04-06T03:00:00Z', status: 'Failed', recordsProcessed: 0, errorMessage: 'Data mapping error: Field LIFNR exceeded max length (10). 23 vendor records rejected. Review mapping configuration for field truncation rules.' },
      { runAt: '2026-04-05T03:00:00Z', status: 'Success', recordsProcessed: 412 },
      { runAt: '2026-04-04T03:00:00Z', status: 'Failed', recordsProcessed: 0, errorMessage: 'Authentication token expired. Regenerate OAuth2 token in Source System settings.' },
      { runAt: '2026-04-03T03:00:00Z', status: 'Success', recordsProcessed: 408 },
    ],
  },
  {
    id: 'IF-010',
    name: 'Anomaly Alert Dispatch',
    direction: 'Outbound',
    sourceSystem: 'Sazience MDM',
    targetSystem: 'Vendor Portal API',
    schedule: 'Every 2 hours',
    lastRunAt: '2026-04-06T10:00:00Z',
    lastRunStatus: 'Scheduled',
    nextRunAt: '2026-04-06T12:00:00Z',
    recordsLastSync: 14,
    runHistory: [
      { runAt: '2026-04-06T08:00:00Z', status: 'Success', recordsProcessed: 14 },
      { runAt: '2026-04-06T06:00:00Z', status: 'Success', recordsProcessed: 11 },
      { runAt: '2026-04-06T04:00:00Z', status: 'Success', recordsProcessed: 9 },
    ],
  },
];

// ===== Status Helpers =====

const statusConfig: Record<InterfaceStatus, { color: string; icon: React.ReactNode }> = {
  Running: { color: 'blue', icon: <SyncOutlined spin /> },
  Success: { color: 'green', icon: <CheckCircleOutlined /> },
  Failed: { color: 'red', icon: <CloseCircleOutlined /> },
  Scheduled: { color: 'default', icon: <ClockCircleOutlined /> },
};

function renderStatusTag(status: InterfaceStatus) {
  const cfg = statusConfig[status];
  return <Tag color={cfg.color} icon={cfg.icon}>{status}</Tag>;
}

// ===== Component =====

export default function InterfaceMonitor() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<InterfaceRecord | null>(null);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const openDrawer = (record: InterfaceRecord) => {
    setSelected(record);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
    setTriggerLoading(false);
  };

  const handleTriggerNow = () => {
    setTriggerLoading(true);
    setTimeout(() => {
      setTriggerLoading(false);
      messageApi.success(`Interface "${selected?.name}" triggered successfully. Run queued.`);
    }, 1800);
  };

  // ===== Main Table Columns =====

  const columns: ColumnsType<InterfaceRecord> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
      width: 110,
      filters: [
        { text: 'Inbound', value: 'Inbound' },
        { text: 'Outbound', value: 'Outbound' },
      ],
      onFilter: (value, record) => record.direction === value,
      render: (dir: 'Inbound' | 'Outbound') => (
        <Tag color={dir === 'Inbound' ? 'cyan' : 'orange'}>{dir}</Tag>
      ),
    },
    {
      title: 'Source System',
      dataIndex: 'sourceSystem',
      key: 'sourceSystem',
    },
    {
      title: 'Target System',
      dataIndex: 'targetSystem',
      key: 'targetSystem',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 180,
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRunAt',
      key: 'lastRunAt',
      width: 170,
      sorter: (a, b) => new Date(a.lastRunAt).getTime() - new Date(b.lastRunAt).getTime(),
      render: (val: string) => formatDateTime(val),
    },
    {
      title: 'Status',
      dataIndex: 'lastRunStatus',
      key: 'lastRunStatus',
      width: 120,
      filters: [
        { text: 'Running', value: 'Running' },
        { text: 'Success', value: 'Success' },
        { text: 'Failed', value: 'Failed' },
        { text: 'Scheduled', value: 'Scheduled' },
      ],
      onFilter: (value, record) => record.lastRunStatus === value,
      render: (status: InterfaceStatus) => renderStatusTag(status),
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRunAt',
      key: 'nextRunAt',
      width: 170,
      render: (val: string) => (val === '-' ? <Text type="secondary">On demand</Text> : formatDateTime(val)),
    },
    {
      title: 'Records',
      dataIndex: 'recordsLastSync',
      key: 'recordsLastSync',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.recordsLastSync - b.recordsLastSync,
      render: (val: number) => val.toLocaleString(),
    },
  ];

  // ===== Run History Table Columns =====

  const runHistoryColumns: ColumnsType<InterfaceRun> = [
    {
      title: 'Run Time',
      dataIndex: 'runAt',
      key: 'runAt',
      render: (val: string) => formatDateTime(val),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: InterfaceStatus) => renderStatusTag(status),
    },
    {
      title: 'Records Processed',
      dataIndex: 'recordsProcessed',
      key: 'recordsProcessed',
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
  ];

  // Collect error logs for the selected interface
  const errorLog = selected
    ? selected.runHistory
        .filter((r) => r.errorMessage)
        .map((r) => `[${formatDateTime(r.runAt)}] ${r.errorMessage}`)
        .join('\n\n')
    : '';

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <Title level={4} style={{ marginTop: 0 }}>Interface Monitor</Title>
          <Text type="secondary">
            Monitor all inbound and outbound data interfaces. Click a row to view run history and error details.
          </Text>
        </Card>

        <Card bodyStyle={{ padding: 0 }}>
          <Table<InterfaceRecord>
            dataSource={mockInterfaces}
            columns={columns}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => openDrawer(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Card>
      </div>

      <Drawer
        title={selected?.name ?? 'Interface Details'}
        placement="right"
        width={680}
        open={drawerOpen}
        onClose={closeDrawer}
        extra={
          <Button
            type="primary"
            loading={triggerLoading}
            onClick={handleTriggerNow}
          >
            Trigger Now
          </Button>
        }
      >
        {selected && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Space size="middle">
                <Tag color={selected.direction === 'Inbound' ? 'cyan' : 'orange'}>
                  {selected.direction}
                </Tag>
                {renderStatusTag(selected.lastRunStatus)}
                <Text type="secondary">{selected.schedule}</Text>
              </Space>
            </div>

            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                {selected.sourceSystem} &rarr; {selected.targetSystem}
              </Text>
            </div>

            <div>
              <Title level={5} style={{ marginTop: 0 }}>Run History</Title>
              <Table<InterfaceRun>
                dataSource={selected.runHistory}
                columns={runHistoryColumns}
                rowKey="runAt"
                pagination={false}
                size="small"
              />
            </div>

            {errorLog && (
              <div>
                <Title level={5}>Error Log</Title>
                <TextArea
                  value={errorLog}
                  readOnly
                  autoSize={{ minRows: 4, maxRows: 12 }}
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
              </div>
            )}
          </Space>
        )}
      </Drawer>
    </>
  );
}
