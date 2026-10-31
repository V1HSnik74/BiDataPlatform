import classNames from 'classnames'
import { NavLink, Outlet } from 'react-router-dom'
import css from './index.module.scss'

const getNavClass = ({ isActive }: { isActive: boolean }) => classNames(css.navItem, { [css.navItemActive]: isActive })

export const Layout = () => {
  return (
    <div className={css.layout}>
      <header className={css.globalHeader}>
        <div className={css.headerLeft}>
          <div className={css.brandTitle}>BI-платформа данных</div>
          <nav className={css.navMenu}>
            <NavLink to="/sources" className={getNavClass}>
              Источники данных
            </NavLink>
            <NavLink to="/dashboards" className={getNavClass}>
              Дашборды
            </NavLink>
            <NavLink to="/admin" className={getNavClass}>
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
