import { useState, useEffect } from 'react'
import { departmentsAPI } from '../../api/services'

const deptIcons = {
  'Cardiology': '❤️', 'Neurology': '🧠', 'Orthopedics': '🦴',
  'Pediatrics': '👶', 'Dermatology': '🩺', 'Gynecology': '🌸',
  'Ophthalmology': '👁️', 'ENT': '👂', 'General Medicine': '⚕️', 'Emergency': '🚨'
}

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    departmentsAPI.getAll()
      .then(r => setDepartments(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" />Loading departments...</div>

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          All clinical departments in the facility. Manage departments via MySQL directly.
        </p>
      </div>

      {departments.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <p>No departments found. Add them via MySQL.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {departments.map((d, i) => {
            const colors = ['teal', 'green', 'amber', 'accent', 'teal', 'green', 'amber', 'accent', 'teal', 'green']
            const color = colors[i % colors.length]
            const icon = deptIcons[d.name] || '🏥'
            return (
              <div key={d.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(0,180,216,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '' }}
              >
                <div className={`stat-icon ${color}`} style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--white)', fontWeight: 500, marginBottom: 4 }}>{d.name}</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: 1.5 }}>{d.description || 'Clinical department'}</p>
                  <div style={{ marginTop: 10 }}>
                    <span className="badge badge-gray">ID: {d.id}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
