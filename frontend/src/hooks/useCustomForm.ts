import { useForm } from '@tanstack/react-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

type UseCustomFormOptions<TValues extends Record<string, unknown>> = {
  defaultValues: TValues
  validationSchema?: z.ZodType<TValues, TValues>
  showValidationAlert?: boolean
  successMessage?: string | false
  onSubmit: (props: { value: TValues }) => Promise<unknown> | unknown
}

export type BaseFieldApi = {
  state: {
    meta: {
      isTouched: boolean
      errors: ReadonlyArray<unknown>
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getErrorMessage(error: unknown): string {
  if (isRecord(error)) {
    const response = isRecord(error.response) ? error.response : undefined
    const data = response && isRecord(response.data) ? response.data : undefined
    const detail = error.detail ?? data?.detail
    if (typeof detail === 'string') {
      return detail
    }
    if (Array.isArray(detail) && detail.length > 0 && isRecord(detail[0])) {
      const firstIssue = detail[0]
      if (typeof firstIssue.msg === 'string') {
        return firstIssue.msg
      }
    }
    if (typeof error.message === 'string') {
      return error.message
    }
  }
  return 'Что-то пошло не так. Попробуйте снова.'
}

export const useCustomForm = <TValues extends Record<string, unknown>>({
  defaultValues,
  validationSchema,
  showValidationAlert = false,
  successMessage = false,
  onSubmit,
}: UseCustomFormOptions<TValues>) => {
  const form = useForm({
    defaultValues,
    validators: validationSchema
      ? {
          onSubmit: validationSchema,
          onChange: validationSchema,
        }
      : undefined,
    onSubmit: async ({ value }) => {
      try {
        await onSubmit({ value })
        if (successMessage) {
          toast.success(successMessage)
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error))
      }
    },
    onSubmitInvalid: showValidationAlert
      ? () => {
          toast.error('Пожалуйста, проверьте правильность заполнения полей')
        }
      : undefined,
  })
  return { form }
}

export function getFieldError(fieldApi: BaseFieldApi): string | undefined {
  const { isTouched, errors } = fieldApi.state.meta
  if (!isTouched || !errors.length) {
    return undefined
  }
  const firstError = errors[0]
  if (typeof firstError === 'string') {
    return firstError
  }
  if (isRecord(firstError) && typeof firstError.message === 'string') {
    return firstError.message
  }
  return String(firstError)
}
