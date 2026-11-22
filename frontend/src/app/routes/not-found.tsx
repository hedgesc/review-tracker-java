import { Link } from 'react-router'

import { paths } from '@/config/paths'

export function NotFoundRoute() {
  return (
    <section className="panel">
      <h2>Page not found</h2>
      <p className="empty">That route does not exist.</p>
      <div className="row">
        <Link to={paths.home.getHref()}>Back to Create Item</Link>
      </div>
    </section>
  )
}
