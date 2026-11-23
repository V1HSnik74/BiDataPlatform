import type { ReactNode } from 'react'
import { CartesianGrid, ComposedChart, Tooltip, XAxis, YAxis } from 'recharts'
import { DEFAULT_CONSTRAINTS, type ChartConfig } from '../../../api/charts'
import { AXIS_TICK_STYLE, formatCompact } from '../formatters'
import type { EnrichedPoint } from '../types'
import { CustomTooltip } from './CustomTooltip'
import { ThresholdOverlay } from './ThresholdOverlay'

type CartesianChartShellProps = {
  data: EnrichedPoint[]
  config: ChartConfig
  verticalGrid?: boolean
  xAxisPadding?: { left?: number; right?: number }
  tooltipCursor?: boolean | Record<string, unknown>
  children: ReactNode
}

export const CartesianChartShell = ({
  data,
  config,
  verticalGrid = false,
  xAxisPadding,
  tooltipCursor = { fill: 'rgba(15, 23, 42, 0.04)' },
  children,
}: CartesianChartShellProps) => {
  const constraints = config.constraints ?? DEFAULT_CONSTRAINTS
  return (
    <ComposedChart data={data} margin={{ top: 20, right: 28, left: 16, bottom: 24 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={verticalGrid} stroke="#e2e8f0" />
      <XAxis
        dataKey="x"
        padding={xAxisPadding}
        tickLine={false}
        axisLine={{ stroke: '#cbd5e1' }}
        tick={AXIS_TICK_STYLE}
        dy={8}
      />
      <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} tickFormatter={formatCompact} dx={-4} />
      <Tooltip
        cursor={tooltipCursor}
        content={<CustomTooltip measureLabel={config.yAxis} />}
        isAnimationActive={false}
      />
      {children}
      <ThresholdOverlay constraints={constraints} />
    </ComposedChart>
  )
}
