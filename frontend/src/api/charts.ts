// src/api/charts.ts
export type ChartQueryParams = {
  fileId: number
  xAxis: string
  yAxis: string
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'
  limit: number
}

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

const PALETTE = ['#8fc1ff', '#10b981', '#3b82f6', '#059669', '#60a5fa', '#34d399']

export const chartApi = {
  getChartData: async (params: ChartQueryParams): Promise<ChartDataPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const mockCategories = [
      'Разработка',
      'Операции',
      'Продажи',
      'Маркетинг',
      'HR',
      'Финансы',
      'Прочее',
      'Склад',
      'Логистика',
      'ИТ-поддержка',
    ]
    const count = Math.min(params.limit, mockCategories.length)

    return mockCategories.slice(0, count).map((category, index) => {
      const baseValue = (count - index) * 500 + Math.floor(Math.sin(index) * 200)
      return {
        x: `${category}`,
        y: Math.max(100, baseValue),
        fill: PALETTE[index % PALETTE.length],
      }
    })
  },
}
