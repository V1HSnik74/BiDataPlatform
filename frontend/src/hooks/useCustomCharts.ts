import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { mapCustomChartResponse, type CustomChartBlueprint } from '../api/charts'
import { customChartsApi } from '../api/customCharts'
import { buildCustomChartDefinition, type ChartDefinition } from '../components/charts'
import { handleApiError } from '../utils/errors'

const CUSTOM_CHARTS_QUERY_KEY = ['custom-chart-types'] as const

export const useCustomCharts = () => {
  const queryClient = useQueryClient()

  const { data: rawTypes = [], isLoading } = useQuery({
    queryKey: CUSTOM_CHARTS_QUERY_KEY,
    queryFn: () => customChartsApi.getAll(),
    staleTime: 1000 * 60 * 5,
  })

  const customBlueprints = useMemo(() => rawTypes.map(mapCustomChartResponse), [rawTypes])

  const customDefinitions = useMemo(() => {
    const map: Record<string, ChartDefinition> = {}
    for (const bp of customBlueprints) {
      map[bp.id] = buildCustomChartDefinition(bp)
    }
    return map
  }, [customBlueprints])

  const createMutation = useMutation({
    mutationFn: (blueprint: Omit<CustomChartBlueprint, 'id'>) => {
      const { name, icon, ...geometry } = blueprint
      return customChartsApi.create({
        name,
        icon,
        blueprint: geometry,
      })
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: CUSTOM_CHARTS_QUERY_KEY })
      toast.success(`Тип графика «${created.name}» сохранён`)
    },
    onError: (error) => {
      handleApiError(error, 'Не удалось сохранить тип графика')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (backendId: number) => customChartsApi.delete(backendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOM_CHARTS_QUERY_KEY })
      toast.success('Тип графика удалён')
    },
    onError: (error) => {
      handleApiError(error, 'Не удалось удалить тип графика')
    },
  })

  return {
    customBlueprints,
    customDefinitions,
    isLoading,
    createCustomChart: createMutation.mutateAsync,
    deleteCustomChart: deleteMutation.mutate,
  }
}
