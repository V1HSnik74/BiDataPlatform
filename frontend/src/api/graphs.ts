import { apiClient } from './client'
import type { GraphBase, GraphResponse, GraphDeleteResponse, GraphPreviewDataPoint } from './types'

export const graphsApi = {
  previewGraph: async (payload: GraphBase): Promise<GraphPreviewDataPoint[]> => {
    const response = await apiClient.post<GraphPreviewDataPoint[]>('/api/graphs/preview', payload)
    return response.data
  },

  getGraphs: async (): Promise<GraphResponse[]> => {
    const response = await apiClient.get<GraphResponse[]>('/api/graphs')
    return response.data
  },

  createGraph: async (payload: GraphBase): Promise<GraphResponse> => {
    const response = await apiClient.post<GraphResponse>('/api/graphs', payload)
    return response.data
  },

  deleteGraph: async (graphId: number): Promise<GraphDeleteResponse> => {
    const response = await apiClient.delete<GraphDeleteResponse>(`/api/graphs/${graphId}`)
    return response.data
  },
}
