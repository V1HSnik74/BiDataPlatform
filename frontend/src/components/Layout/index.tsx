import classNames from 'classnames'
import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import css from './index.module.scss'

const getNavClass = ({ isActive }: { isActive: boolean }) => classNames(css.navItem, { [css.navItemActive]: isActive })

export const Layout = () => {
  return (
    <div className={css.layout}>
      <header className={css.globalHeader}>
        <div className={css.headerLeft}>
          <div className={css.brandTitle}>BI-платформа данных</div>
          <nav className={css.navMenu}>
            <NavLink to={ROUTES.SOURCES} className={getNavClass}>
              Источники данных
            </NavLink>
            <NavLink to={ROUTES.DASHBOARDS} className={getNavClass}>
              Дашборды
            </NavLink>
            <NavLink to={ROUTES.ADMIN} className={getNavClass}>
              Администрирование
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={css.content}>
        <Outlet />
      </main>
    </div>
  )
}
