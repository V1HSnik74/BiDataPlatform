import { type ReactNode } from 'react'
import { Icon } from '../Icon'
import css from './index.module.scss'

export type AuthCardProps = {
  title: string
  subtitle: ReactNode
  icon?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export const AuthCard = ({ title, subtitle, icon, footer, children }: AuthCardProps) => {
  return (
    <div className={css.pageWrapper}>
      <div className={css.card}>
        <div className={css.header}>
          <div className={css.logoWrapper} aria-hidden="true">
            {icon ?? <Icon name="logo" size={32} className={css.defaultIcon} />}
          </div>
          <h1 className={css.title}>{title}</h1>
          <p className={css.subtitle}>{subtitle}</p>
        </div>
        <div className={css.body}>{children}</div>
        {footer && <div className={css.footer}>{footer}</div>}
      </div>
    </div>
  )
}
