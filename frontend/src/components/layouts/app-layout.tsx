import { NavLink, Outlet } from 'react-router'

import { paths } from '@/config/paths'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : undefined

export function AppLayout() {
  return (
    <div className="app">
      <header className="header">
        <h1>Review Tracker</h1>
        <p>Track review cadence for owned items.</p>
      </header>

      <nav className="tabs">
        <NavLink to={paths.home.getHref()} className={navLinkClass} end>
          Items
        </NavLink>
        <NavLink to={paths.reviews.getHref()} className={navLinkClass}>
          Reviews
        </NavLink>
      </nav>

      <Outlet />
    </div>
  )
}
