import type { ComponentProps, ReactElement } from 'react'
import { Area, Bar, Legend, Line, Pie, PieChart, Tooltip } from 'recharts'
import { PALETTE, type BuiltInChartType, type CustomChartBlueprint } from '../../api/charts'
import { Icon } from '../Icon'
import { CartesianChartShell } from './parts/CartesianChartShell'
import { CustomTooltip } from './parts/CustomTooltip'
import { ColoredBar, ColoredDot } from './parts/shapes'
import type { ChartRenderContext } from './types'

export type IconName = ComponentProps<typeof Icon>['name']

export type ChartDefinition = {
  type: string
  label: string
  icon: IconName
  supportsThreshold: boolean
  isCustom?: boolean
  render: (ctx: ChartRenderContext) => ReactElement
}

export const BUILTIN_CHART_REGISTRY: Record<BuiltInChartType, ChartDefinition> = {
  bar: {
    type: 'bar',
    label: 'Столбчатая',
    icon: 'barChart',
    supportsThreshold: true,
    render: ({ data, config }) => (
      <CartesianChartShell data={data} config={config}>
        <Bar dataKey="y" name={config.yAxis} maxBarSize={56} shape={ColoredBar} />
      </CartesianChartShell>
    ),
  },
  scatter: {
    type: 'scatter',
    label: 'Точечная',
    icon: 'scatterChart',
    supportsThreshold: true,
    render: ({ data, config }) => (
      <CartesianChartShell
        data={data}
        config={config}
        verticalGrid
        xAxisPadding={{ left: 48, right: 48 }}
        tooltipCursor={{ strokeDasharray: '3 3' }}
      >
        <Line
          dataKey="y"
          name={config.yAxis}
          stroke="none"
          isAnimationActive={false}
          dot={ColoredDot}
          activeDot={{ r: 9, strokeWidth: 2, stroke: '#ffffff' }}
        />
      </CartesianChartShell>
    ),
  },
  pie: {
    type: 'pie',
    label: 'Круговая',
    icon: 'pieChart',
    supportsThreshold: false,
    render: ({ data, config }) => (
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
          data={data}
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
    ),
  },
}

export const buildCustomChartDefinition = (blueprint: CustomChartBlueprint): ChartDefinition => ({
  type: blueprint.id,
  label: blueprint.name,
  icon: (blueprint.icon as IconName) || 'barChart',
  supportsThreshold: blueprint.coordinateSystem === 'cartesian',
  isCustom: true,
  render: ({ data, config }) => {
    if (blueprint.coordinateSystem === 'polar') {
      const innerPercent = Math.round((78 * (blueprint.innerRadiusPercent ?? 50)) / 100)
      return (
        <PieChart margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
          <Tooltip content={<CustomTooltip measureLabel={config.yAxis} />} isAnimationActive={false} />
          <Legend
            iconType="circle"
            wrapperStyle={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 8,
            }}
          />
          <Pie
            key={`${blueprint.startAngle ?? 90}-${blueprint.endAngle ?? -270}`}
            data={data}
            dataKey="y"
            nameKey="x"
            cx="50%"
            cy={blueprint.startAngle === 180 ? '68%' : '48%'}
            startAngle={blueprint.startAngle ?? 90}
            endAngle={blueprint.endAngle ?? -270}
            outerRadius={blueprint.startAngle === 180 ? '92%' : '78%'}
            innerRadius={`${innerPercent}%`}
            paddingAngle={3}
            stroke="#ffffff"
            strokeWidth={2}
            animationBegin={0}
            animationDuration={600}
          />
        </PieChart>
      )
    }
    const accentColor = PALETTE[2]
    const curveType = blueprint.curveMode ?? 'monotone'
    return (
      <CartesianChartShell
        data={data}
        config={config}
        verticalGrid
        xAxisPadding={{ left: 32, right: 32 }}
        tooltipCursor={{ strokeDasharray: '3 3' }}
      >
        {blueprint.showArea && (
          <Area
            type={curveType}
            dataKey="y"
            name={config.yAxis}
            stroke="none"
            fill={PALETTE[0]}
            fillOpacity={0.25}
            isAnimationActive={false}
          />
        )}
        {blueprint.showBars && <Bar dataKey="y" name={config.yAxis} maxBarSize={48} shape={ColoredBar} />}
        {(blueprint.showLine || blueprint.showArea || blueprint.showDots) && (
          <Line
            type={curveType}
            dataKey="y"
            name={config.yAxis}
            stroke={blueprint.showLine ? accentColor : 'none'}
            strokeWidth={3}
            isAnimationActive={false}
            dot={blueprint.showDots ? ColoredDot : false}
            activeDot={blueprint.showDots ? { r: 8, strokeWidth: 2, stroke: '#ffffff' } : false}
          />
        )}
      </CartesianChartShell>
    )
  },
})

export const BUILTIN_CHART_LIST = Object.values(BUILTIN_CHART_REGISTRY)

export const resolveChartDefinition = (
  type: string,
  customDefinitions?: Record<string, ChartDefinition>
): ChartDefinition =>
  BUILTIN_CHART_REGISTRY[type as keyof typeof BUILTIN_CHART_REGISTRY] ??
  customDefinitions?.[type] ??
  BUILTIN_CHART_REGISTRY.bar
