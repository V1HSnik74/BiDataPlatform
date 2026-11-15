import type { GraphResponse } from './types'

export type ChartDataPoint = {
  x: string
  y: number
  fill?: string
}

export type ChartType = 'bar' | 'scatter' | 'pie'

export type AggregationType = 'SUM' | 'AVG' | 'COUNT'

export type ChartConfig = {
  fileId: number | null
  title: string
  type: ChartType
  xAxis: string
  yAxis: string
  aggregation: AggregationType
  topN: number
}

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  fileId: null,
  title: 'График',
  type: 'bar',
  xAxis: '',
  yAxis: '',
  aggregation: 'SUM',
  topN: 5,
}

export const PALETTE = ['#8fc1ff', '#10b981', '#3b82f6', '#059669', '#60a5fa', '#34d399']

export const mapGraphToConfig = (graph: GraphResponse): ChartConfig => ({
  fileId: graph.upload_id,
  title: graph.title,
  type: (graph.chart_type as ChartType) || 'bar',
  xAxis: graph.x_axis,
  yAxis: graph.y_axis[0] ?? '',
  aggregation: (graph.aggregation_func as AggregationType) || 'SUM',
  topN: graph.limit ?? DEFAULT_CHART_CONFIG.topN,
})
