import axios from 'axios'

type FastAPIErrorPayload = {
  detail?: string | Array<{ msg: string; loc?: (string | number)[] }>
}

const getApiErrorMessage = (error: unknown, fallbackMessage = 'Произошла непредвиденная ошибка'): string => {
  if (axios.isAxiosError<FastAPIErrorPayload>(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') {
      return detail
    }
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((err) => err.msg).join(', ')
    }
    return error.message || fallbackMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallbackMessage
}

export const handleApiError = (error: unknown, fallbackMessage = 'Ошибка при выполнении операции') => {
  const message = getApiErrorMessage(error, fallbackMessage)
  console.error(error)
  alert(message)
}
