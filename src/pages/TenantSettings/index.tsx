import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Slider,
  Switch,
  Button,
  Collapse,
  Card,
  Typography,
  Space,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
} from 'antd';
import {
  KeyOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Honolulu',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const locales = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ar-AE', label: 'Arabic (UAE)' },
];

interface NotificationSettings {
  taskAssignedEmail: boolean;
  taskAssignedInApp: boolean;
  slaApproachingEmail: boolean;
  slaApproachingInApp: boolean;
  anomalyDetectedEmail: boolean;
  anomalyDetectedInApp: boolean;
  bulkLoadCompleteEmail: boolean;
  bulkLoadCompleteInApp: boolean;
  approvalNeededEmail: boolean;
  approvalNeededInApp: boolean;
}

export default function TenantSettings() {
  const [tenantName, setTenantName] = useState('Carnival Cruise Lines');
  const [timezone, setTimezone] = useState('America/New_York');
  const [locale, setLocale] = useState('en-US');

  const [dqGreenThreshold, setDqGreenThreshold] = useState(85);
  const [dqYellowThreshold, setDqYellowThreshold] = useState(60);

  const [autoApproveThreshold, setAutoApproveThreshold] = useState(90);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState(40);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    taskAssignedEmail: true,
    taskAssignedInApp: true,
    slaApproachingEmail: true,
    slaApproachingInApp: true,
    anomalyDetectedEmail: false,
    anomalyDetectedInApp: true,
    bulkLoadCompleteEmail: true,
    bulkLoadCompleteInApp: true,
    approvalNeededEmail: true,
    approvalNeededInApp: true,
  });

  const [apiKey, setApiKey] = useState('sk-prod-****-****-****-a3f2b8c1');

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    message.success('Settings saved');
  };

  const handleRegenerateApiKey = () => {
    Modal.confirm({
      title: 'Regenerate API Key',
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure you want to regenerate the API key? The current key will be immediately invalidated. All integrations using this key will stop working until updated.',
      okText: 'Regenerate',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const chars = 'abcdef0123456789';
        const segment = () =>
          Array.from({ length: 4 }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length)),
          ).join('');
        setApiKey(`sk-prod-****-****-****-${segment()}${segment()}`);
        message.success('API key regenerated successfully');
      },
    });
  };

  const handleCopyApiKey = () => {
    message.info('API key copied to clipboard');
  };

  const notificationTypes: {
    label: string;
    emailKey: keyof NotificationSettings;
    inAppKey: keyof NotificationSettings;
  }[] = [
    {
      label: 'Task Assigned',
      emailKey: 'taskAssignedEmail',
      inAppKey: 'taskAssignedInApp',
    },
    {
      label: 'SLA Approaching',
      emailKey: 'slaApproachingEmail',
      inAppKey: 'slaApproachingInApp',
    },
    {
      label: 'Anomaly Detected',
      emailKey: 'anomalyDetectedEmail',
      inAppKey: 'anomalyDetectedInApp',
    },
    {
      label: 'Bulk Load Complete',
      emailKey: 'bulkLoadCompleteEmail',
      inAppKey: 'bulkLoadCompleteInApp',
    },
    {
      label: 'Approval Needed',
      emailKey: 'approvalNeededEmail',
      inAppKey: 'approvalNeededInApp',
    },
  ];

  const collapseItems = [
    {
      key: 'general',
      label: 'General',
      children: (
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item label="Tenant Name">
              <Input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Enter tenant name"
              />
            </Form.Item>
          </Col>
          <Col span={12} />
          <Col span={12}>
            <Form.Item label="Timezone">
              <Select
                value={timezone}
                onChange={setTimezone}
                options={timezones.map((tz) => ({ value: tz, label: tz }))}
                showSearch
                placeholder="Select timezone"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Locale">
              <Select
                value={locale}
                onChange={setLocale}
                options={locales}
                showSearch
                placeholder="Select locale"
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: 'data-quality',
      label: 'Data Quality',
      children: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Configure DQ score thresholds that determine badge colors across the
            platform.
          </Text>
          <Row gutter={[48, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Green threshold (Good):{' '}
                    <Text strong style={{ color: '#52c41a' }}>
                      &ge; {dqGreenThreshold}
                    </Text>
                  </span>
                }
              >
                <Slider
                  min={0}
                  max={100}
                  value={dqGreenThreshold}
                  onChange={(val) => {
                    setDqGreenThreshold(val);
                    if (val <= dqYellowThreshold) {
                      setDqYellowThreshold(val - 1);
                    }
                  }}
                  styles={{ track: { background: '#52c41a' } }}
                  tooltip={{ formatter: (val) => `${val}` }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Yellow threshold (Warning):{' '}
                    <Text strong style={{ color: '#faad14' }}>
                      &ge; {dqYellowThreshold}
                    </Text>
                  </span>
                }
              >
                <Slider
                  min={0}
                  max={100}
                  value={dqYellowThreshold}
                  onChange={(val) => {
                    setDqYellowThreshold(val);
                    if (val >= dqGreenThreshold) {
                      setDqGreenThreshold(val + 1);
                    }
                  }}
                  styles={{ track: { background: '#faad14' } }}
                  tooltip={{ formatter: (val) => `${val}` }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Descriptions bordered size="small" column={3}>
            <Descriptions.Item
              label={
                <Text style={{ color: '#52c41a' }} strong>
                  Green (Good)
                </Text>
              }
            >
              Score &ge; {dqGreenThreshold}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text style={{ color: '#faad14' }} strong>
                  Yellow (Warning)
                </Text>
              }
            >
              Score {dqYellowThreshold} &ndash; {dqGreenThreshold - 1}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Text style={{ color: '#ff4d4f' }} strong>
                  Red (Critical)
                </Text>
              }
            >
              Score &lt; {dqYellowThreshold}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: 'matching',
      label: 'Matching',
      children: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Configure confidence thresholds for automatic match resolution.
            Proposals between the two thresholds require manual review.
          </Text>
          <Row gutter={[48, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Auto-Approve confidence threshold:{' '}
                    <Text strong style={{ color: '#52c41a' }}>
                      &ge; {autoApproveThreshold}%
                    </Text>
                  </span>
                }
              >
                <Slider
                  min={0}
                  max={100}
                  value={autoApproveThreshold}
                  onChange={(val) => {
                    setAutoApproveThreshold(val);
                    if (val <= autoRejectThreshold) {
                      setAutoRejectThreshold(val - 1);
                    }
                  }}
                  styles={{ track: { background: '#52c41a' } }}
                  tooltip={{ formatter: (val) => `${val}%` }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Auto-Reject confidence threshold:{' '}
                    <Text strong style={{ color: '#ff4d4f' }}>
                      &le; {autoRejectThreshold}%
                    </Text>
                  </span>
                }
              >
                <Slider
                  min={0}
                  max={100}
                  value={autoRejectThreshold}
                  onChange={(val) => {
                    setAutoRejectThreshold(val);
                    if (val >= autoApproveThreshold) {
                      setAutoApproveThreshold(val + 1);
                    }
                  }}
                  styles={{ track: { background: '#ff4d4f' } }}
                  tooltip={{ formatter: (val) => `${val}%` }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Descriptions bordered size="small" column={3}>
            <Descriptions.Item label="Auto-Approve">
              Confidence &ge; {autoApproveThreshold}%
            </Descriptions.Item>
            <Descriptions.Item label="Manual Review">
              Confidence {autoRejectThreshold + 1}% &ndash;{' '}
              {autoApproveThreshold - 1}%
            </Descriptions.Item>
            <Descriptions.Item label="Auto-Reject">
              Confidence &le; {autoRejectThreshold}%
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Choose which events trigger email and in-app notifications.
          </Text>
          <Row
            style={{
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Col span={10}>
              <Text strong>Event</Text>
            </Col>
            <Col span={7} style={{ textAlign: 'center' }}>
              <Text strong>Email</Text>
            </Col>
            <Col span={7} style={{ textAlign: 'center' }}>
              <Text strong>In-App</Text>
            </Col>
          </Row>
          {notificationTypes.map((item) => (
            <Row
              key={item.label}
              align="middle"
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Col span={10}>
                <Text>{item.label}</Text>
              </Col>
              <Col span={7} style={{ textAlign: 'center' }}>
                <Switch
                  checked={notifications[item.emailKey]}
                  onChange={(checked) =>
                    handleNotificationChange(item.emailKey, checked)
                  }
                />
              </Col>
              <Col span={7} style={{ textAlign: 'center' }}>
                <Switch
                  checked={notifications[item.inAppKey]}
                  onChange={(checked) =>
                    handleNotificationChange(item.inAppKey, checked)
                  }
                />
              </Col>
            </Row>
          ))}
        </div>
      ),
    },
    {
      key: 'api-keys',
      label: 'API Key Management',
      children: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Manage the API key used for external integrations. Keep this key
            confidential.
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              padding: '12px 16px',
              maxWidth: 600,
            }}
          >
            <KeyOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
            <Text
              code
              style={{ fontSize: 14, flex: 1, letterSpacing: 0.5 }}
            >
              {apiKey}
            </Text>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyApiKey}
              size="small"
            >
              Copy
            </Button>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button danger onClick={handleRegenerateApiKey}>
              Regenerate API Key
            </Button>
          </div>
          <Text
            type="secondary"
            style={{ display: 'block', marginTop: 12, fontSize: 12 }}
          >
            Last regenerated: March 15, 2026 by Ahmed Al-Rashid
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Tenant Settings
        </Title>
        <Text type="secondary">
          Configure platform-wide settings for your tenant.
        </Text>
      </div>

      <Form layout="vertical" style={{ maxWidth: 1000 }}>
        <Card>
          <Collapse
            defaultActiveKey={[
              'general',
              'data-quality',
              'matching',
              'notifications',
              'api-keys',
            ]}
            ghost
            items={collapseItems}
            size="large"
          />

          <div
            style={{
              padding: '24px 24px 0',
              borderTop: '1px solid #f0f0f0',
              marginTop: 16,
            }}
          >
            <Space>
              <Button type="primary" size="large" onClick={handleSave}>
                Save Changes
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
}
