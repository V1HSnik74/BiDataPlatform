import { apiClient } from './client'
import type {
  CustomChartTypeDeleteResponse,
  CustomChartTypeRequest,
  CustomChartTypeResponse,
  CustomChartTypeUpdateRequest,
} from './types'

export const customChartsApi = {
  getAll: async (): Promise<CustomChartTypeResponse[]> => {
    const response = await apiClient.get<CustomChartTypeResponse[]>('/api/custom_charts')
    return response.data
  },

  create: async (payload: CustomChartTypeRequest): Promise<CustomChartTypeResponse> => {
    const response = await apiClient.post<CustomChartTypeResponse>('/api/custom_charts', payload)
    return response.data
  },

  update: async (chartTypeId: number, payload: CustomChartTypeUpdateRequest): Promise<CustomChartTypeResponse> => {
    const response = await apiClient.patch<CustomChartTypeResponse>(`/api/custom_charts/${chartTypeId}`, payload)
    return response.data
  },

  delete: async (chartTypeId: number): Promise<CustomChartTypeDeleteResponse> => {
    const response = await apiClient.delete<CustomChartTypeDeleteResponse>(`/api/custom_charts/${chartTypeId}`)
    return response.data
  },
}
