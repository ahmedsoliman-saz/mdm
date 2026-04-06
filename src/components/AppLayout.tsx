import { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import BreadcrumbBar from './Breadcrumb'

const { Content } = Layout

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header onToggle={() => setCollapsed(c => !c)} />
        <BreadcrumbBar />
        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 48px - 49px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
