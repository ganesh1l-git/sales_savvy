import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminNav } from '../../components/AdminNav';
import { Users, Search, Trash2, Edit3, ShieldAlert, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('CUSTOMER');
  const [editStatus, setEditStatus] = useState('ACTIVE');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setActionError('Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setActionError('');
    setActionSuccess('');
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updateUser(user.userId, { status: newStatus });
      setActionSuccess(`User ${user.username} marked as ${newStatus}.`);
      fetchUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to update user status.');
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
    setActionError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await adminService.updateUser(editingUser.userId, {
        role: editRole,
        status: editStatus
      });
      setActionSuccess(`Updated ${editingUser.username} successfully.`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"?`)) {
      return;
    }
    setActionError('');
    setActionSuccess('');
    try {
      await adminService.deleteUser(userId);
      setActionSuccess(`User ${username} deleted successfully.`);
      fetchUsers();
    } catch (err) {
      setActionError(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>User Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage user roles, activate/deactivate accounts, and manage permissions</p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px', fontSize: '0.9rem' }}
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {actionSuccess && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} /> {actionSuccess}
          </div>
        )}

        {actionError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {actionError}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.userId}>
                        <td style={{ fontWeight: 700 }}>#{u.userId}</td>
                        <td style={{ fontWeight: 600 }}>{u.username}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                        <td>
                          <span className="badge" style={{
                            background: u.role === 'ADMIN' ? 'var(--primary-light)' : 'var(--bg-subtle)',
                            color: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)',
                            border: u.role === 'ADMIN' ? '1px solid var(--border-focus)' : '1px solid var(--border-color)'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'ACTIVE' ? 'badge-delivered' : 'badge-cancelled'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                              title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                            >
                              {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Role & Permissions"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.userId, u.username)}
                              className="btn btn-danger btn-sm"
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
              Edit User: {editingUser.username}
            </h3>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Status</label>
                <select
                  className="form-control"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
