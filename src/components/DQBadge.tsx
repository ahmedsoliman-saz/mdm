import { Tag } from 'antd'
import { getDQTagColor } from '../utils/dqBadge'
import type { DQBadgeProps } from '../types'

export default function DQBadge({ score, size }: DQBadgeProps) {
  return (
    <Tag color={getDQTagColor(score)} style={size === 'small' ? { fontSize: 11 } : undefined}>
      {score}
    </Tag>
  )
}
