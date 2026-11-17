import { ShieldAlert } from 'lucide-react'
import css from './index.module.scss'

export const ErrorPageComponent = ({
  title = 'Произошла ошибка',
  message = 'Что-то пошло не так',
}: {
  title?: string
  message?: string
}) => {
  return (
    <div className={css.stateContainer}>
      <div className={css.stateCard}>
        <div className={css.forbiddenIcon}>
          <ShieldAlert size={32} />
        </div>
        <h2 className={css.stateTitle}>{title}</h2>
        <p className={css.stateText}>{message}</p>
      </div>
    </div>
  )
}
