import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { mapGraphToConfig } from '../../api/charts'
import { graphsApi } from '../../api/graphs'
import type { GraphResponse } from '../../api/types'
import { DashboardChartCard } from '../../components/DashboardChartCard'
import { ROUTES } from '../../lib/routes'
import css from './index.module.scss'

export const Dashboard = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: savedCharts = [], isLoading } = useQuery({
    queryKey: ['dashboard-graphs'],
    queryFn: () => graphsApi.getGraphs(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => graphsApi.deleteGraph(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-graphs'] })
    },
  })

  const handleCreateChart = () => {
    navigate(ROUTES.NEWCHART)
  }

  const handleEditChart = (chart: GraphResponse) => {
    navigate(ROUTES.NEWCHART, {
      state: {
        chartId: chart.id,
        initialConfig: mapGraphToConfig(chart),
      },
    })
  }

  const handleDeleteChart = (id: number) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className={css.dashboardLayout}>
      <header className={css.topBar}>
        <div className={css.topLeft}>
          <div className={css.titleBlock}>
            <h1 className={css.pageTitle}>Операционные показатели</h1>
            <span className={css.breadcrumbs}>Аналитика / Дашборд</span>
          </div>
        </div>

        <div className={css.topRight}>
          <button type="button" className={css.addChartBtn} onClick={handleCreateChart}>
            + Добавить график
          </button>
        </div>
      </header>

      <main className={css.contentArea}>
        {isLoading ? (
          <div className={css.emptyState}>Загрузка дашборда...</div>
        ) : savedCharts.length === 0 ? (
          <div className={css.emptyState}>
            <p className={css.emptyTitle}>На дашборде пока нет графиков</p>
            <p className={css.emptySubtext}>Нажмите «+ Добавить график», чтобы создать первую визуализацию</p>
            <button type="button" className={css.addChartBtn} onClick={handleCreateChart}>
              + Добавить график
            </button>
          </div>
        ) : (
          <div className={css.chartsGrid}>
            {savedCharts.map((chart) => (
              <DashboardChartCard key={chart.id} chart={chart} onEdit={handleEditChart} onDelete={handleDeleteChart} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
