import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { mapGraphToConfig } from '../../api/charts'
import { graphsApi } from '../../api/graphs'
import type { GraphResponse } from '../../api/types'
import { Icon } from '../Icon'
import { ChartRenderer } from '../charts/ChartRender'
import css from './index.module.scss'

type CardProps = {
  chart: GraphResponse
  onEdit: (chart: GraphResponse) => void
  onDelete: (id: number) => void
}

type BackendPreviewResponse = {
  labels?: string[]
  datasets?: Array<{ label: string; data: number[] }>
}

export const DashboardChartCard = ({ chart, onEdit, onDelete }: CardProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])
  const config = useMemo(() => mapGraphToConfig(chart), [chart])
  const { data: rawChartData, isLoading } = useQuery({
    queryKey: ['chart-preview', config.fileId, config.xAxis, config.yAxis, config.aggregation, config.topN],
    queryFn: () =>
      graphsApi.previewGraph({
        title: config.title,
        chart_type: 'bar',
        upload_id: config.fileId!,
        x_axis: config.xAxis,
        y_axis: [config.yAxis],
        aggregation_func: config.aggregation,
        limit: config.topN,
      }),
    enabled: Boolean(config.fileId && config.xAxis && config.yAxis),
    staleTime: 1000 * 60 * 10,
  })
  const chartData = useMemo(() => {
    const res = rawChartData as BackendPreviewResponse | undefined
    const labels = res?.labels
    const values = res?.datasets?.[0]?.data
    if (!Array.isArray(labels) || !Array.isArray(values)) {
      return []
    }
    return labels.slice(0, config.topN).map((label, idx) => ({
      x: String(label),
      y: Number(values[idx] ?? 0),
    }))
  }, [rawChartData, config.topN])

  return (
    <article className={css.chartCard}>
      <div className={css.cardHeader}>
        <h3 className={css.cardTitle}>{chart.title}</h3>
        <div className={css.menuContainer} ref={menuRef}>
          <button type="button" className={css.dotsBtn} onClick={() => setMenuOpen((prev) => !prev)}>
            <Icon name="moreHorizontal" size={18} />
          </button>
          {menuOpen && (
            <div className={css.dropdownMenu}>
              <button
                type="button"
                className={css.dropdownItem}
                onClick={() => {
                  setMenuOpen(false)
                  onEdit(chart)
                }}
              >
                Редактировать
              </button>
              <button
                type="button"
                className={`${css.dropdownItem} ${css.dropdownItemDanger}`}
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(chart.id)
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={css.cardBody}>
        <ChartRenderer data={chartData} config={config} isLoading={isLoading} />
      </div>
    </article>
  )
}
