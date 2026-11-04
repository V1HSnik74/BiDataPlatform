import type { ReactNode } from 'react'
import styles from './index.module.scss'

export const FormField = ({ label, children }: { label: string; children: ReactNode }) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
