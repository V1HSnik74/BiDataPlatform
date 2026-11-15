import cn from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { ROUTES } from '../../lib/routes'
import { Icon } from '../Icon'
import css from './index.module.scss'

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const logout = useLogout()

  return (
    <div
      className={css.wrapper}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false)
        }
      }}
    >
      <button
        type="button"
        className={cn(css.trigger, { [css.triggerActive]: isOpen })}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className={css.avatar}>
          <Icon name="user" />
        </div>
        <Icon name="chevronDown" className={cn(css.chevron, { [css.chevronOpen]: isOpen })} />
      </button>
      {isOpen && (
        <div className={css.dropdown}>
          <Link to={ROUTES.PROFILE} className={css.menuItem} onClick={() => setIsOpen(false)}>
            <Icon name="user" size={16} />
            <span>Профиль</span>
          </Link>

          <button type="button" className={cn(css.menuItem, css.dangerItem)} onClick={logout}>
            <Icon name="logout" size={16} />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  )
}
