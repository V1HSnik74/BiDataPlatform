import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { mapGraphToConfig } from '../../api/charts'
import { graphsApi } from '../../api/graphs'
import type { GraphResponse } from '../../api/types'
import { DashboardChartCard } from '../../components/DashboardChartCard'
import { withPageWrapper } from '../../components/PageWrapper'
import { useCustomCharts } from '../../hooks/useCustomCharts'
import { ROUTES } from '../../lib/routes'
import { handleApiError } from '../../utils/errors'
import css from './index.module.scss'

export const Dashboard = withPageWrapper({
  authorizedOnly: true,
  title: 'Дашборд',
  useQuery: () =>
    useQuery({
      queryKey: ['dashboard-graphs'],
      queryFn: () => graphsApi.getGraphs(),
    }),
  setProps: ({ queryResult }) => ({
    savedCharts: queryResult.data,
  }),
})(({ savedCharts }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { customDefinitions } = useCustomCharts()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => graphsApi.deleteGraph(id),
    onSuccess: () => {
      toast.success('График удалён')
      queryClient.invalidateQueries({ queryKey: ['dashboard-graphs'] })
    },
    onError: (error) => {
      handleApiError(error, 'Не удалось удалить график')
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
        {savedCharts.length === 0 ? (
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
              <DashboardChartCard
                key={chart.id}
                chart={chart}
                customDefinitions={customDefinitions}
                onEdit={handleEditChart}
                onDelete={handleDeleteChart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
})
