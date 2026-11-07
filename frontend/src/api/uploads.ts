import { apiClient } from './client'
import type { UploadResponse, UploadDeleteResponse } from './types'

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/api/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getUploads: async (): Promise<UploadResponse[]> => {
    const response = await apiClient.get<UploadResponse[]>('/api/uploads')
    return response.data
  },

  deleteUpload: async (uploadId: number): Promise<UploadDeleteResponse> => {
    const response = await apiClient.delete<UploadDeleteResponse>(`/api/uploads/${uploadId}`)
    return response.data
  },
}
