import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type RectangleProps,
  type DotItemDotProps,
} from 'recharts'
import type { ChartConfig } from '../../api/charts'
import styles from './index.module.scss'

type ChartDataPoint = { x: string; y: number }

type EnrichedPoint = ChartDataPoint & { fill: string }

type ColoredBarProps = RectangleProps & {
  payload?: EnrichedPoint
}

type ColoredDotProps = DotItemDotProps & {
  payload?: EnrichedPoint
}

const PALETTE = ['#8fc1ff', '#10b981', '#3b82f6', '#059669', '#60a5fa', '#34d399']

const AXIS_TICK_STYLE = { fill: '#64748b', fontSize: 12 }

const formatCompact = (val: number | string) => {
  const num = Number(val)
  if (Number.isNaN(num)) {
    return String(val)
  }
  if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(num) >= 1_000) {
    return `${(num / 1_000).toFixed(0)}k`
  }
  return String(num)
}

const ColoredBar = ({ payload, ...restProps }: ColoredBarProps) => (
  <Rectangle {...restProps} fill={payload?.fill} radius={[6, 6, 0, 0]} />
)

const ColoredDot = ({ cx, cy, payload }: ColoredDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null
  }
  return <circle cx={cx} cy={cy} r={7} fill={payload?.fill} stroke="#fff" strokeWidth={2} />
}

const CustomTooltip = ({
  active,
  payload,
  measureLabel,
}: {
  active?: boolean
  payload?: Array<{ payload?: EnrichedPoint }>
  measureLabel: string
}) => {
  const point = active ? payload?.[0]?.payload : null
  if (!point) {
    return null
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{point.x}</div>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ backgroundColor: point.fill }} />
        <span className={styles.tooltipLabel}>{measureLabel}:</span>
        <span className={styles.tooltipValue}>{point.y}</span>
      </div>
    </div>
  )
}

export const ChartRenderer = ({
  data,
  config,
  isLoading,
}: {
  data: ChartDataPoint[]
  config: ChartConfig
  isLoading?: boolean
}) => {
  const coloredData = useMemo<EnrichedPoint[]>(
    () => data.map((item, idx) => ({ ...item, fill: PALETTE[idx % PALETTE.length] })),
    [data]
  )

  if (isLoading) {
    return <div className={styles.stateBox}>Загрузка данных...</div>
  }

  if (!config.fileId || !config.xAxis || !config.yAxis || coloredData.length === 0) {
    return <div className={styles.stateBox}>Выберите источник данных, измерение и меру для отображения</div>
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        {config.type === 'bar' ? (
          <BarChart data={coloredData} margin={{ top: 20, right: 24, left: 16, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="x" tickLine={false} axisLine={{ stroke: '#cbd5e1' }} tick={AXIS_TICK_STYLE} dy={8} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} tickFormatter={formatCompact} dx={-4} />
            <Tooltip
              cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
              content={<CustomTooltip measureLabel={config.yAxis} />}
              isAnimationActive={false}
            />
            <Bar dataKey="y" name={config.yAxis} maxBarSize={56} shape={ColoredBar} />
          </BarChart>
        ) : config.type === 'pie' ? (
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <Tooltip content={<CustomTooltip measureLabel={config.yAxis} />} isAnimationActive={false} />
            <Legend
              iconType="circle"
              wrapperStyle={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 12,
              }}
            />
            <Pie
              data={coloredData}
              dataKey="y"
              nameKey="x"
              cx="50%"
              cy="50%"
              outerRadius={115}
              innerRadius={55}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
              animationBegin={0}
              animationDuration={800}
            />
          </PieChart>
        ) : (
          <LineChart data={coloredData} margin={{ top: 20, right: 32, left: 16, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="x"
              padding={{ left: 48, right: 48 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={AXIS_TICK_STYLE}
              dy={8}
            />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} tickFormatter={formatCompact} dx={-4} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<CustomTooltip measureLabel={config.yAxis} />}
              isAnimationActive={false}
            />
            <Line
              dataKey="y"
              name={config.yAxis}
              stroke="none"
              isAnimationActive={false}
              dot={ColoredDot}
              activeDot={{ r: 9, strokeWidth: 2, stroke: '#ffffff' }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
