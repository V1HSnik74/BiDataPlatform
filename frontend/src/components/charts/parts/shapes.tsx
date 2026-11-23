import { Rectangle, type DotItemDotProps, type RectangleProps } from 'recharts'
import type { EnrichedPoint } from '../types'

type ColoredBarProps = RectangleProps & {
  payload?: EnrichedPoint
}

type ColoredDotProps = DotItemDotProps & {
  payload?: EnrichedPoint
}

export const ColoredBar = ({ payload, ...restProps }: ColoredBarProps) => (
  <Rectangle {...restProps} fill={payload?.fill} radius={[6, 6, 0, 0]} />
)

export const ColoredDot = ({ cx, cy, payload }: ColoredDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null
  }
  return <circle cx={cx} cy={cy} r={7} fill={payload?.fill} stroke="#fff" strokeWidth={2} />
}
