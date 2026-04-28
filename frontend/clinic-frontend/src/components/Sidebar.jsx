import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: '⬡', label: 'Dashboard' },
  { to: '/patients', icon: '👤', label: 'Patients' },
  { to: '/doctors', icon: '⚕', label: 'Doctors' },
  { to: '/appointments', icon: '📅', label: 'Appointments' },
  { to: '/departments', icon: '🏥', label: 'Departments' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Medi<span>Core</span></h1>
        <p>Clinic Management</p>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <p>{user?.fullName || 'User'}</p>
            <span>{user?.role || 'Staff'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          ⇤ Sign Out
        </button>
      </div>
    </aside>
  )
}
