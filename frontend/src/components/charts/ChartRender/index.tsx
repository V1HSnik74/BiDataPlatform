import { useMemo } from 'react'
import { ResponsiveContainer } from 'recharts'
import { DEFAULT_CONSTRAINTS, PALETTE } from '../../../api/charts'
import { resolveChartDefinition, type ChartDefinition } from '../registry'
import type { ChartRendererProps, EnrichedPoint } from '../types'
import css from './index.module.scss'

export const ChartRenderer = ({
  data,
  config,
  isLoading,
  customDefinitions = {},
}: ChartRendererProps & { customDefinitions?: Record<string, ChartDefinition> }) => {
  const definition = resolveChartDefinition(config.type, customDefinitions)

  const constraints = config.constraints ?? DEFAULT_CONSTRAINTS

  const enrichedData = useMemo<EnrichedPoint[]>(() => {
    const filtered = data.filter((item) => {
      if (constraints.minValue !== null && item.y < constraints.minValue) {
        return false
      }
      if (constraints.maxValue !== null && item.y > constraints.maxValue) {
        return false
      }
      return true
    })

    return filtered.map((item, idx) => {
      const isAlert =
        definition.supportsThreshold &&
        constraints.thresholdValue !== null &&
        (constraints.thresholdCondition === 'above'
          ? item.y > constraints.thresholdValue
          : item.y < constraints.thresholdValue)

      return {
        ...item,
        isAlert,
        fill: PALETTE[idx % PALETTE.length],
      }
    })
  }, [data, constraints, definition.supportsThreshold])

  if (isLoading) {
    return <div className={css.stateBox}>Загрузка данных...</div>
  }

  if (!config.fileId || !config.xAxis || !config.yAxis || data.length === 0) {
    return <div className={css.stateBox}>Выберите источник данных, измерение и меру для отображения</div>
  }

  if (enrichedData.length === 0) {
    return <div className={css.stateBox}>Нет данных, удовлетворяющих заданным ограничениям</div>
  }

  return (
    <div className={css.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        {definition.render({ data: enrichedData, config })}
      </ResponsiveContainer>
    </div>
  )
}
