import type { ChartConfig, ChartDataPoint } from '../../api/charts'

export type EnrichedPoint = ChartDataPoint & {
  fill: string
  isAlert: boolean
}

export type ChartRendererProps = {
  data: ChartDataPoint[]
  config: ChartConfig
  isLoading?: boolean
}

export type ChartRenderContext = {
  data: EnrichedPoint[]
  config: ChartConfig
}
