import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const pageTitles = {
  '/': { title: 'Dashboard', sub: 'Overview of clinic operations' },
  '/patients': { title: 'Patients', sub: 'Manage patient records' },
  '/doctors': { title: 'Doctors', sub: 'Medical staff directory' },
  '/appointments': { title: 'Appointments', sub: 'Schedule and manage visits' },
  '/departments': { title: 'Departments', sub: 'Clinical departments' },
}

export default function Layout() {
  const location = useLocation()
  const { user } = useAuth()
  const page = pageTitles[location.pathname] || { title: 'MediCore', sub: '' }

  const now = new Date()
  const timeStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h2>{page.title}</h2>
            <p>{page.sub}</p>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{timeStr}</span>
            <div className="user-avatar" style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
              {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
