import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientsAPI, doctorsAPI, appointmentsAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const statusColor = s => {
  if (!s) return 'badge-gray'
  const l = s.toLowerCase()
  if (l === 'scheduled') return 'badge-teal'
  if (l === 'completed') return 'badge-green'
  if (l === 'cancelled') return 'badge-red'
  return 'badge-gray'
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, today: 0 })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, dRes, aRes] = await Promise.all([
          patientsAPI.getAll(),
          doctorsAPI.getAll(),
          appointmentsAPI.getAll(),
        ])
        const patients = pRes.data || []
        const doctors = dRes.data || []
        const appointments = aRes.data || []
        const today = new Date().toDateString()
        const todayCount = appointments.filter(a =>
          new Date(a.appointmentDate).toDateString() === today
        ).length
        setStats({ patients: patients.length, doctors: doctors.length, appointments: appointments.length, today: todayCount })
        setRecentAppointments(appointments.slice(0, 5))
        setRecentPatients(patients.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div className="loading"><div className="spinner" />Loading dashboard...</div>

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', color: 'var(--white)', marginBottom: 4 }}>
          {greeting}, {user?.fullName?.split(' ')[0]} 👋
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          Here's what's happening at the clinic today.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/patients')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon teal">👤</div>
          <div className="stat-info">
            <p>Total Patients</p>
            <h3>{stats.patients}</h3>
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate('/doctors')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon green">⚕</div>
          <div className="stat-info">
            <p>Doctors</p>
            <h3>{stats.doctors}</h3>
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate('/appointments')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon amber">📅</div>
          <div className="stat-info">
            <p>Total Appointments</p>
            <h3>{stats.appointments}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">🕐</div>
          <div className="stat-info">
            <p>Today's Appointments</p>
            <h3>{stats.today}</h3>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Recent Appointments */}
        <div className="table-container">
          <div className="table-header">
            <h3>Recent Appointments</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/appointments')}>View all</button>
          </div>
          {recentAppointments.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📅</div><p>No appointments yet</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar avatar-teal">{a.patientName?.[0] || 'P'}</div>
                          <span>{a.patientName}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-dim)' }}>{a.doctorName}</td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                        {new Date(a.appointmentDate).toLocaleDateString('en-IN')}
                      </td>
                      <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="table-container">
          <div className="table-header">
            <h3>Recent Patients</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/patients')}>View all</button>
          </div>
          {recentPatients.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👤</div><p>No patients yet</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar avatar-green">{p.fullName?.[0] || 'P'}</div>
                          <span>{p.fullName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-red">{p.bloodGroup || 'N/A'}</span>
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{p.phone || '-'}</td>
                      <td style={{ color: 'var(--text-dim)', textTransform: 'capitalize' }}>{p.gender || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
