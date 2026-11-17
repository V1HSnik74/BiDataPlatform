import classNames from 'classnames'
import { Toaster, ToastBar } from 'react-hot-toast'
import { Icon } from '../Icon'
import css from './index.module.scss'

export const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerClassName={css.toasterContainer}
      toastOptions={{
        duration: 3000,
        className: css.toastBase,
        success: {
          className: classNames(css.toastBase, css.toastSuccess),
          icon: (
            <span className={classNames(css.iconBadge, css.iconSuccess)}>
              <Icon name="done" size={16} />
            </span>
          ),
        },
        error: {
          className: classNames(css.toastBase, css.toastError),
          icon: (
            <span className={classNames(css.iconBadge, css.iconError)}>
              <Icon name="alert" size={16} />
            </span>
          ),
        },
      }}
    >
      {(t) => <ToastBar toast={t} />}
    </Toaster>
  )
}
