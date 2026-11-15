import type { ReactNode } from 'react'
import { getFieldError, type BaseFieldApi } from '../../hooks/useCustomForm'
import { FormField } from '../FormField'
import { Input, PasswordInput, type InputProps } from '../Input'

type StringFieldApi = BaseFieldApi & {
  name: string
  state: {
    value: string
  }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type FormInputProps = {
  field: StringFieldApi
  label: string
  labelRight?: ReactNode
  isPassword?: boolean
} & Omit<InputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'hasError'>

export const FormInput = ({ field, label, labelRight, isPassword = false, ...inputProps }: FormInputProps) => {
  const error = getFieldError(field)
  const Component = isPassword ? PasswordInput : Input
  return (
    <FormField label={label} labelRight={labelRight} error={error}>
      <Component
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        hasError={!!error}
        {...inputProps}
      />
    </FormField>
  )
}
