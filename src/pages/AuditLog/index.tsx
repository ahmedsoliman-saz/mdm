import { useMemo } from 'react';
import { Table, Card, Tag, Typography, Select, DatePicker, Input, Row, Col, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { auditLog } from '../../data/auditLog';
import { users } from '../../data/users';
import { formatDateTime } from '../../utils/formatDate';
import { useFilters } from '../../hooks/useFilters';
import EmptyState from '../../components/EmptyState';
import type { AuditLogEntry, AuditLogFilters, AuditAction, EntityType } from '../../types';

const { Title } = Typography;

const userMap = new Map(users.map(u => [u.id, u.name]));

const actionTagColors: Record<AuditAction, string> = {
  Created: 'green',
  Updated: 'blue',
  Approved: 'green',
  Rejected: 'red',
  Merged: 'purple',
  Exported: 'cyan',
  Configured: 'default',
};

const actionOptions: AuditAction[] = ['Created', 'Updated', 'Approved', 'Rejected', 'Merged', 'Exported', 'Configured'];
const entityTypeOptions: { label: string; value: EntityType }[] = [
  { label: 'Spare Parts', value: 'spare-parts' },
  { label: 'Vendors', value: 'vendors' },
  { label: 'Equipment', value: 'equipment' },
];

const entityTypeLabels: Record<EntityType, string> = {
  'spare-parts': 'Spare Parts',
  vendors: 'Vendors',
  equipment: 'Equipment',
};

const initialFilters: AuditLogFilters = {
  dateFrom: '',
  dateTo: '',
  userId: '',
  action: '',
  entityType: '',
  recordIdSearch: '',
};

function isEntityRecord(recordId: string): boolean {
  return /^(SP-|V-|EQ-)/.test(recordId);
}

function getEntityRoute(entityType: EntityType, recordId: string): string {
  return `/entities/${entityType}/records/${recordId}`;
}

export default function AuditLog() {
  const { filters, setFilter, resetFilters } = useFilters<AuditLogFilters>(initialFilters);

  const filteredData = useMemo(() => {
    return auditLog.filter(entry => {
      if (filters.dateFrom) {
        const from = dayjs(filters.dateFrom).startOf('day');
        if (dayjs(entry.timestamp).isBefore(from)) return false;
      }
      if (filters.dateTo) {
        const to = dayjs(filters.dateTo).endOf('day');
        if (dayjs(entry.timestamp).isAfter(to)) return false;
      }
      if (filters.userId && entry.user !== filters.userId) return false;
      if (filters.action && entry.action !== filters.action) return false;
      if (filters.entityType && entry.entityType !== filters.entityType) return false;
      if (filters.recordIdSearch) {
        const search = filters.recordIdSearch.toLowerCase();
        if (!entry.recordId.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }, [filters]);

  const columns: ColumnsType<AuditLogEntry> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: 'descend',
      render: (ts: string) => formatDateTime(ts),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 160,
      render: (userId: string) => userMap.get(userId) ?? userId,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render: (action: AuditAction) => (
        <Tag color={actionTagColors[action]}>{action}</Tag>
      ),
    },
    {
      title: 'Entity Type',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 120,
      render: (et: EntityType) => entityTypeLabels[et],
    },
    {
      title: 'Record ID',
      dataIndex: 'recordId',
      key: 'recordId',
      width: 140,
      render: (recordId: string, record: AuditLogEntry) =>
        isEntityRecord(recordId) ? (
          <Link to={getEntityRoute(record.entityType, recordId)}>{recordId}</Link>
        ) : (
          <span>{recordId}</span>
        ),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
  ];

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>Audit Log</Title>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 12]}>
          <Col span={6}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              placeholder={['Date From', 'Date To']}
              value={
                filters.dateFrom && filters.dateTo
                  ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
                  : filters.dateFrom
                    ? [dayjs(filters.dateFrom), null]
                    : filters.dateTo
                      ? [null, dayjs(filters.dateTo)]
                      : null
              }
              onChange={(dates) => {
                setFilter('dateFrom', dates?.[0]?.toISOString() ?? '');
                setFilter('dateTo', dates?.[1]?.toISOString() ?? '');
              }}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="User"
              value={filters.userId || undefined}
              onChange={(val) => setFilter('userId', val ?? '')}
              allowClear
              options={users.map(u => ({ label: u.name, value: u.id }))}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Action"
              value={filters.action || undefined}
              onChange={(val) => setFilter('action', val ?? '')}
              allowClear
              options={actionOptions.map(a => ({ label: a, value: a }))}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Entity Type"
              value={filters.entityType || undefined}
              onChange={(val) => setFilter('entityType', val ?? '')}
              allowClear
              options={entityTypeOptions}
            />
          </Col>
          <Col span={4}>
            <Input
              placeholder="Search Record ID"
              value={filters.recordIdSearch}
              onChange={(e) => setFilter('recordIdSearch', e.target.value)}
              allowClear
            />
          </Col>
          <Col span={2}>
            {hasActiveFilters && (
              <a onClick={resetFilters} style={{ lineHeight: '32px' }}>
                Reset
              </a>
            )}
          </Col>
        </Row>
      </Card>

      <Card>
        {filteredData.length === 0 ? (
          <EmptyState
            title="No Audit Log Entries Found"
            description="No entries match the current filters. Try adjusting your search criteria."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : (
          <Table<AuditLogEntry>
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (total) => `${total} entries` }}
            size="middle"
            expandable={{
              expandedRowRender: (record) =>
                record.changePayload ? (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Typography.Text strong>Before:</Typography.Text>
                        <pre style={{
                          background: '#fafafa',
                          padding: 12,
                          borderRadius: 6,
                          fontSize: 12,
                          overflow: 'auto',
                          maxHeight: 200,
                          marginTop: 4,
                        }}>
                          {JSON.stringify(record.changePayload.before, null, 2)}
                        </pre>
                      </Col>
                      <Col span={12}>
                        <Typography.Text strong>After:</Typography.Text>
                        <pre style={{
                          background: '#f6ffed',
                          padding: 12,
                          borderRadius: 6,
                          fontSize: 12,
                          overflow: 'auto',
                          maxHeight: 200,
                          marginTop: 4,
                        }}>
                          {JSON.stringify(record.changePayload.after, null, 2)}
                        </pre>
                      </Col>
                    </Row>
                  </Space>
                ) : (
                  <Typography.Text type="secondary">No change payload recorded for this entry.</Typography.Text>
                ),
              rowExpandable: () => true,
            }}
          />
        )}
      </Card>
    </div>
  );
}
