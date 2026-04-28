import { useState, useEffect } from 'react'
import { patientsAPI } from '../../api/services'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', dateOfBirth: '', gender: 'Male', address: '', bloodGroup: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchPatients() }, [])

  const fetchPatients = async () => {
    try {
      const res = await patientsAPI.getAll()
      setPatients(res.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ fullName: '', email: '', phone: '', dateOfBirth: '', gender: 'Male', address: '', bloodGroup: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ fullName: p.fullName, email: p.email, phone: p.phone, address: p.address, bloodGroup: p.bloodGroup })
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient?')) return
    try {
      await patientsAPI.delete(id)
      setPatients(prev => prev.filter(p => p.id !== id))
    } catch (e) { alert('Failed to delete patient') }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const res = await patientsAPI.update(editing.id, form)
        setPatients(prev => prev.map(p => p.id === editing.id ? res.data : p))
      } else {
        const res = await patientsAPI.create(form)
        setPatients(prev => [...prev, res.data])
      }
      setShowModal(false)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save patient')
    } finally { setSaving(false) }
  }

  const handleSearch = async (val) => {
    setSearch(val)
    if (val.trim().length >= 2) {
      try {
        const res = await patientsAPI.search(val)
        setPatients(res.data || [])
      } catch { }
    } else if (val.trim() === '') {
      fetchPatients()
    }
  }

  const filtered = patients.filter(p =>
    p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  const bloodColors = { 'A+': 'badge-red', 'A-': 'badge-red', 'B+': 'badge-amber', 'B-': 'badge-amber', 'O+': 'badge-teal', 'O-': 'badge-teal', 'AB+': 'badge-green', 'AB-': 'badge-green' }

  if (loading) return <div className="loading"><div className="spinner" />Loading patients...</div>

  return (
    <div>
      <div className="table-container">
        <div className="table-header">
          <h3>All Patients <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.85rem' }}>({patients.length})</span></h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-box">
              <span style={{ color: 'var(--text-dim)' }}>⌕</span>
              <input placeholder="Search patients..." value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>+ Add Patient</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><p>No patients found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-teal">{p.fullName?.[0]}</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--white)' }}>{p.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.phone || '-'}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{p.dateOfBirth || '-'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.gender || '-'}</td>
                    <td>
                      {p.bloodGroup ? <span className={`badge ${bloodColors[p.bloodGroup] || 'badge-gray'}`}>{p.bloodGroup}</span> : '-'}
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Del</button>
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
              <h3>{editing ? 'Edit Patient' : 'Add New Patient'}</h3>
              <button className="btn btn-outline btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Full Name</label>
                    <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required placeholder="Patient full name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" />
                  </div>
                  {!editing && (
                    <div className="form-group">
                      <label>Date of Birth (YYYY-MM-DD)</label>
                      <input value={form.dateOfBirth} onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))} placeholder="1990-05-15" />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select value={form.bloodGroup} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}>
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="City, State" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
