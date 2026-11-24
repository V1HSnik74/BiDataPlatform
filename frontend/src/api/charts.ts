import type { IconName } from '../components/charts/registry'
import type { CustomChartTypeResponse, GraphResponse } from './types'

export type ChartDataPoint = {
  x: string
  y: number
  fill?: string
}

export type BuiltInChartType = 'bar' | 'scatter' | 'pie'
export type ChartType = BuiltInChartType | (string & {})

export type AggregationType = 'SUM' | 'AVG' | 'COUNT'

export type ThresholdCondition = 'above' | 'below'

export type ChartConstraints = {
  thresholdValue: number | null
  thresholdLabel: string
  thresholdCondition: ThresholdCondition
  minValue: number | null
  maxValue: number | null
}

export type CurveMode = 'monotone' | 'linear' | 'step'

export type CustomChartBlueprint = {
  id: string
  name: string
  icon: IconName
  coordinateSystem: 'cartesian' | 'polar'
  showBars?: boolean
  showLine?: boolean
  showArea?: boolean
  showDots?: boolean
  curveMode?: CurveMode
  innerRadiusPercent?: number
  startAngle?: number
  endAngle?: number
}

export type ChartConfig = {
  fileId: number | null
  title: string
  type: ChartType
  xAxis: string
  yAxis: string
  aggregation: AggregationType
  topN: number
  constraints: ChartConstraints
}

export const DEFAULT_CONSTRAINTS: ChartConstraints = {
  thresholdValue: null,
  thresholdLabel: 'Порог',
  thresholdCondition: 'above',
  minValue: null,
  maxValue: null,
}

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  fileId: null,
  title: 'График',
  type: 'bar',
  xAxis: '',
  yAxis: '',
  aggregation: 'SUM',
  topN: 5,
  constraints: DEFAULT_CONSTRAINTS,
}

export const PALETTE = ['#8fc1ff', '#10b981', '#3b82f6', '#059669', '#60a5fa', '#34d399']
export const ALERT_COLOR = '#ef4444'

export const mapGraphToConfig = (graph: GraphResponse): ChartConfig => {
  const raw = graph.constraints as Partial<ChartConstraints> | null | undefined
  return {
    fileId: graph.upload_id,
    title: graph.title,
    type: (graph.chart_type as ChartType) || 'bar',
    xAxis: graph.x_axis,
    yAxis: graph.y_axis[0] ?? '',
    aggregation: (graph.aggregation_func as AggregationType) || 'SUM',
    topN: graph.limit ?? DEFAULT_CHART_CONFIG.topN,
    constraints: raw
      ? {
          thresholdValue: raw.thresholdValue ?? null,
          thresholdLabel: raw.thresholdLabel ?? DEFAULT_CONSTRAINTS.thresholdLabel,
          thresholdCondition: raw.thresholdCondition ?? DEFAULT_CONSTRAINTS.thresholdCondition,
          minValue: raw.minValue ?? null,
          maxValue: raw.maxValue ?? null,
        }
      : DEFAULT_CONSTRAINTS,
  }
}

export const mapCustomChartResponse = (item: CustomChartTypeResponse): CustomChartBlueprint => {
  const bp = item.blueprint as Partial<Omit<CustomChartBlueprint, 'id' | 'name' | 'icon'>>
  return {
    id: String(item.id),
    name: item.name,
    icon: (item.icon as IconName) || 'barChart',
    coordinateSystem: bp.coordinateSystem ?? 'cartesian',
    showBars: bp.showBars,
    showLine: bp.showLine,
    showArea: bp.showArea,
    showDots: bp.showDots,
    curveMode: bp.curveMode,
    innerRadiusPercent: bp.innerRadiusPercent,
    startAngle: bp.startAngle,
    endAngle: bp.endAngle,
  }
}

export const parseCustomChartBackendId = (typeId: string): number | null => {
  if (typeId === 'bar' || typeId === 'scatter' || typeId === 'pie') {
    return null
  }
  const num = Number(typeId)
  return Number.isInteger(num) && num > 0 ? num : null
}
