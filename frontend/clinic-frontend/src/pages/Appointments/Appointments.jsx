import { useState, useEffect } from 'react'
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../../api/services'

const statusColor = s => {
  if (!s) return 'badge-gray'
  const l = s.toLowerCase()
  if (l === 'scheduled') return 'badge-teal'
  if (l === 'completed') return 'badge-green'
  if (l === 'cancelled') return 'badge-red'
  return 'badge-gray'
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', timeSlot: '', notes: '', status: 'Scheduled' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      appointmentsAPI.getAll().then(r => setAppointments(r.data || [])),
      patientsAPI.getAll().then(r => setPatients(r.data || [])),
      doctorsAPI.getAll().then(r => setDoctors(r.data || [])),
    ]).finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ patientId: patients[0]?.id || '', doctorId: doctors[0]?.id || '', appointmentDate: '', timeSlot: '', notes: '', status: 'Scheduled' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (a) => {
    setEditing(a)
    const dt = a.appointmentDate ? new Date(a.appointmentDate).toISOString().slice(0, 16) : ''
    setForm({ patientId: a.patientId, doctorId: a.doctorId, appointmentDate: dt, timeSlot: a.timeSlot, notes: a.notes, status: a.status })
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return
    try {
      await appointmentsAPI.delete(id)
      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch { alert('Cannot delete appointment') }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId),
        appointmentDate: new Date(form.appointmentDate).toISOString(),
      }
      if (editing) {
        const res = await appointmentsAPI.update(editing.id, payload)
        setAppointments(prev => prev.map(a => a.id === editing.id ? res.data : a))
      } else {
        const res = await appointmentsAPI.create(payload)
        setAppointments(prev => [...prev, res.data])
      }
      setShowModal(false)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save appointment')
    } finally { setSaving(false) }
  }

  const statuses = ['All', 'Scheduled', 'Completed', 'Cancelled']
  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter)

  if (loading) return <div className="loading"><div className="spinner" />Loading appointments...</div>

  return (
    <div>
      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3>Appointments</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="btn btn-sm"
                  style={{
                    background: filter === s ? 'var(--teal-dim)' : 'transparent',
                    border: `1px solid ${filter === s ? 'rgba(0,180,216,0.4)' : 'var(--border)'}`,
                    color: filter === s ? 'var(--teal)' : 'var(--text-dim)',
                    fontSize: '0.72rem'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Book Appointment</button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📅</div><p>No appointments found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Time Slot</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-teal">{a.patientName?.[0] || 'P'}</div>
                        <span style={{ fontWeight: 500 }}>{a.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-green">Dr</div>
                        <span style={{ color: 'var(--text-dim)' }}>{a.doctorName}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div style={{ color: 'var(--white)' }}>{new Date(a.appointmentDate).toLocaleDateString('en-IN')}</div>
                      <div style={{ color: 'var(--text-dim)' }}>{new Date(a.appointmentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td style={{ color: 'var(--text-dim)' }}>{a.timeSlot || '-'}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '-'}</td>
                    <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Appointment' : 'Book Appointment'}</h3>
              <button className="btn btn-outline btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient</label>
                    <select value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))} required>
                      <option value="">Select Patient</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Doctor</label>
                    <select value={form.doctorId} onChange={e => setForm(p => ({ ...p, doctorId: e.target.value }))} required>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.fullName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Appointment Date & Time</label>
                    <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm(p => ({ ...p, appointmentDate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <input value={form.timeSlot} onChange={e => setForm(p => ({ ...p, timeSlot: e.target.value }))} placeholder="e.g. 10:00 AM" />
                  </div>
                  {editing && (
                    <div className="form-group">
                      <label>Status</label>
                      <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                        <option>Scheduled</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  )}
                  <div className="form-group full">
                    <label>Notes</label>
                    <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Reason for visit..." />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
