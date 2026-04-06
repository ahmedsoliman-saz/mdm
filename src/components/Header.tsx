import { useState, useMemo, useCallback } from 'react'
import { Layout, Avatar, Badge, Popover, AutoComplete, Input, List, Typography, Space, Tag } from 'antd'
import { BellOutlined, SearchOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { notifications } from '../data/notifications'
import { spareParts } from '../data/spareParts'
import { tasks } from '../data/tasks'
import { users } from '../data/users'
import { formatRelativeTime } from '../utils/formatDate'
import type { NotificationType } from '../types'

const { Header: AntHeader } = Layout

const typeIconMap: Record<NotificationType, string> = {
  'task-assigned': '📋',
  'sla-approaching': '⏰',
  'anomaly-detected': '⚠️',
  'bulk-load-complete': '📦',
  'approval-needed': '✅',
}

function getNotificationIcon(type: NotificationType) {
  return typeIconMap[type] || '📢'
}

interface SearchResult {
  key: string
  label: string
  value: string
  route: string
  group: string
}

export default function Header({ onToggle }: { onToggle: () => void }) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [])

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchText.trim()) return []
    const q = searchText.toLowerCase()
    const results: SearchResult[] = []

    spareParts.filter(sp =>
      sp.partNumber.toLowerCase().includes(q) ||
      sp.description.toLowerCase().includes(q)
    ).slice(0, 5).forEach(sp => {
      results.push({
        key: sp.id,
        label: `${sp.partNumber} — ${sp.description}`,
        value: `${sp.partNumber} — ${sp.description}`,
        route: `/entities/spare-parts/records/${sp.id}`,
        group: 'Records',
      })
    })

    tasks.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.relatedRecordDescription.toLowerCase().includes(q)
    ).slice(0, 5).forEach(t => {
      results.push({
        key: t.id,
        label: `${t.id} — ${t.relatedRecordDescription}`,
        value: `${t.id} — ${t.relatedRecordDescription}`,
        route: `/governance/tasks`,
        group: 'Tasks',
      })
    })

    users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    ).slice(0, 3).forEach(u => {
      results.push({
        key: u.id,
        label: `${u.name} — ${u.role}`,
        value: `${u.name} — ${u.role}`,
        route: '/admin/rbac',
        group: 'Users',
      })
    })

    return results
  }, [searchText])

  const handleSearchSelect = useCallback((value: string) => {
    const found = searchResults.find(r => r.value === value)
    if (found) {
      navigate(found.route)
      setSearchText('')
      setSearchOpen(false)
    }
  }, [searchResults, navigate])

  const notificationContent = (
    <List
      style={{ width: 360, maxHeight: 400, overflowY: 'auto' }}
      dataSource={notifications.slice(0, 10)}
      renderItem={item => (
        <List.Item
          style={{ cursor: 'pointer', padding: '8px 12px', opacity: item.read ? 0.6 : 1 }}
          onClick={() => {
            if (item.linkTo) navigate(item.linkTo)
          }}
        >
          <List.Item.Meta
            avatar={<span style={{ fontSize: 18 }}>{getNotificationIcon(item.type)}</span>}
            title={<Typography.Text style={{ fontSize: 13 }}>{item.message}</Typography.Text>}
            description={<Typography.Text type="secondary" style={{ fontSize: 11 }}>{formatRelativeTime(item.timestamp)}</Typography.Text>}
          />
        </List.Item>
      )}
    />
  )

  const groupedOptions = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    searchResults.forEach(r => {
      if (!groups[r.group]) groups[r.group] = []
      groups[r.group].push(r)
    })
    return Object.entries(groups).map(([group, items]) => ({
      label: <Typography.Text strong style={{ fontSize: 12, color: '#999' }}>{group}</Typography.Text>,
      options: items.map(item => ({
        value: item.value,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag style={{ fontSize: 10, margin: 0 }}>{item.group.slice(0, -1)}</Tag>
            <span style={{ fontSize: 13 }}>{item.label}</span>
          </div>
        ),
      })),
    }))
  }, [searchResults])

  return (
    <AntHeader style={{
      background: '#fff',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e8e8e8',
      height: 48,
      lineHeight: '48px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MenuOutlined
          onClick={onToggle}
          style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }}
        />
        <div>
          <Typography.Text strong style={{ fontSize: 14, letterSpacing: '0.5px' }}>AI DRP</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 10, marginLeft: 8 }}>AI Data Readiness Platform</Typography.Text>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AutoComplete
          open={searchOpen && searchText.length > 0}
          options={groupedOptions}
          onSearch={(val) => {
            setSearchText(val)
            if (val) setSearchOpen(true)
          }}
          onSelect={handleSearchSelect}
          style={{ width: 260 }}
        >
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search records, tasks... (⌘K)"
            size="small"
            style={{ borderRadius: 6 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
        </AutoComplete>

        <Popover
          content={notificationContent}
          title="Notifications"
          trigger="click"
          placement="bottomRight"
        >
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: 16, cursor: 'pointer', color: '#595959' }} />
          </Badge>
        </Popover>

        <Space style={{ cursor: 'pointer' }}>
          <Avatar size={26} style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
          <div style={{ lineHeight: 1.3 }}>
            <Typography.Text style={{ fontSize: 12 }}>Ahmed Al-Rashid</Typography.Text>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: 10 }}>Admin</Typography.Text>
          </div>
        </Space>
      </div>
    </AntHeader>
  )
}
