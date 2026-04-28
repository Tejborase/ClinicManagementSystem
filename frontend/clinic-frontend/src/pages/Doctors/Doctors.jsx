import { useState, useEffect } from 'react'
import { doctorsAPI, departmentsAPI } from '../../api/services'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', specialization: '', departmentId: '', consultationFee: '', isAvailable: true })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      doctorsAPI.getAll().then(r => setDoctors(r.data || [])),
      departmentsAPI.getAll().then(r => setDepartments(r.data || [])).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ fullName: '', email: '', phone: '', specialization: '', departmentId: departments[0]?.id || '', consultationFee: '', isAvailable: true })
    setError('')
    setShowModal(true)
  }

  const openEdit = (d) => {
    setEditing(d)
    setForm({ fullName: d.fullName, phone: d.phone, specialization: d.specialization, consultationFee: d.consultationFee, isAvailable: d.isAvailable })
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return
    try {
      await doctorsAPI.delete(id)
      setDoctors(prev => prev.filter(d => d.id !== id))
    } catch { alert('Cannot delete doctor') }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, departmentId: parseInt(form.departmentId), consultationFee: parseFloat(form.consultationFee) }
      if (editing) {
        const res = await doctorsAPI.update(editing.id, payload)
        setDoctors(prev => prev.map(d => d.id === editing.id ? res.data : d))
      } else {
        const res = await doctorsAPI.create(payload)
        setDoctors(prev => [...prev, res.data])
      }
      setShowModal(false)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save doctor')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="loading"><div className="spinner" />Loading doctors...</div>

  return (
    <div>
      <div className="table-container">
        <div className="table-header">
          <h3>Medical Staff <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.85rem' }}>({doctors.length})</span></h3>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Doctor</button>
        </div>

        {doctors.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⚕</div><p>No doctors added yet</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Fee (₹)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d, i) => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-green">Dr</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--white)' }}>Dr. {d.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--teal)', fontSize: '0.82rem' }}>{d.specialization || '-'}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{d.department || '-'}</td>
                    <td>{d.phone || '-'}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 500 }}>₹{d.consultationFee || 0}</td>
                    <td>
                      <span className={`badge ${d.isAvailable ? 'badge-green' : 'badge-red'}`}>
                        {d.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Del</button>
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
              <h3>{editing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button className="btn btn-outline btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Full Name</label>
                    <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required placeholder="Doctor's full name" />
                  </div>
                  {!editing && (
                    <div className="form-group full">
                      <label>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="doctor@clinic.com" />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
                  </div>
                  <div className="form-group">
                    <label>Specialization</label>
                    <input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} placeholder="e.g. Cardiology" />
                  </div>
                  {!editing && (
                    <div className="form-group">
                      <label>Department</label>
                      <select value={form.departmentId} onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))} required>
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Consultation Fee (₹)</label>
                    <input type="number" value={form.consultationFee} onChange={e => setForm(p => ({ ...p, consultationFee: e.target.value }))} placeholder="500" />
                  </div>
                  {editing && (
                    <div className="form-group">
                      <label>Availability</label>
                      <select value={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.value === 'true' }))}>
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
