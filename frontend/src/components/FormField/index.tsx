import type { ReactNode } from 'react'
import css from './index.module.scss'

export const FormField = ({
  label,
  children,
  error,
  labelRight,
}: {
  label: string
  children: ReactNode
  error?: string
  labelRight?: ReactNode
}) => {
  return (
    <div className={css.fieldGroup}>
      <div className={css.labelRow}>
        <label className={css.label}>{label}</label>
        {labelRight}
      </div>
      {children}
      {error && <span className={css.errorText}>{error}</span>}
    </div>
  )
}
