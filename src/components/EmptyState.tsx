import { Empty, Button } from 'antd'
import type { EmptyStateProps } from '../types'

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Empty
      description={description || title}
    >
      <Button type="primary" onClick={onAction}>{actionLabel}</Button>
    </Empty>
  )
}
