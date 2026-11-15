import { apiClient } from './client'
import type {
  UserRegister,
  UserResponse,
  UserLogin,
  TokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './types'

export const authApi = {
  register: async (payload: UserRegister): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/api/auth/register', payload)
    return response.data
  },

  login: async (payload: UserLogin): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', payload)
    return response.data
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<unknown> => {
    const response = await apiClient.post('/api/auth/forgot-password', payload)
    return response.data
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<unknown> => {
    const response = await apiClient.post('/api/auth/reset-password', payload)
    return response.data
  },
}
