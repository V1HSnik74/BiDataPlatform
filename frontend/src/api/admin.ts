import { apiClient } from './client'
import type { UserDeleteResponse, UsersResponse, UserUpdatePermission } from './types'

export const adminApi = {
  getAllUsers: async (): Promise<UsersResponse[]> => {
    const response = await apiClient.get<UsersResponse[]>('/api/admin/')
    return response.data
  },

  updateUserPermissions: async (userId: number, payload: UserUpdatePermission): Promise<UsersResponse> => {
    const response = await apiClient.patch<UsersResponse>(`/api/admin/${userId}`, payload)
    return response.data
  },

  deleteUser: async (userId: number): Promise<UserDeleteResponse> => {
    const response = await apiClient.delete<UserDeleteResponse>(`/api/admin/${userId}`)
    return response.data
  },
}
