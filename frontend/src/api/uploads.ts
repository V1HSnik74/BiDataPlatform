// src/api/uploads.ts
import { apiClient } from './client'
import type { UploadResponse, UploadDeleteResponse } from './types'

export const uploadApi = {
  uploadFile: async (userId: number, file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/api/uploads/', formData, {
      params: { user_id: userId },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getUploads: async (userId: number): Promise<UploadResponse[]> => {
    const response = await apiClient.get<UploadResponse[]>('/api/uploads/', {
      params: { user_id: userId },
    })
    return response.data
  },

  deleteUpload: async (uploadId: number, userId: number): Promise<UploadDeleteResponse> => {
    const response = await apiClient.delete<UploadDeleteResponse>(`/api/uploads/${uploadId}`, {
      params: { user_id: userId },
    })
    return response.data
  },
}
