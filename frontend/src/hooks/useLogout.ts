import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../lib/routes'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    localStorage.removeItem('access_token')
    queryClient.clear()
    navigate(ROUTES.LOGIN, { replace: true })
  }
}
