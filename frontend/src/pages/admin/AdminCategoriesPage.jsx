import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { AdminNav } from '../../components/AdminNav';
import { Tags, Plus, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      setActionError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setCategoryName('');
    setActionError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.categoryId);
    setCategoryName(c.categoryName);
    setActionError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setActionError('');
    setActionSuccess('');

    try {
      if (editingId) {
        await adminService.updateCategory(editingId, { categoryName: categoryName.trim() });
        setActionSuccess('Category updated successfully!');
      } else {
        await adminService.createCategory({ categoryName: categoryName.trim() });
        setActionSuccess('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setActionError(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products under this category might be affected.`)) return;
    try {
      await adminService.deleteCategory(id);
      setActionSuccess(`Category "${name}" deleted.`);
      fetchCategories();
    } catch (err) {
      setActionError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Category Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Organize your store catalog into browseable departments</p>
          </div>

          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={18} /> Add Category
          </button>
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

        <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: '800px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.categoryId}>
                      <td style={{ fontWeight: 700 }}>#{c.categoryId}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                          <Tags size={16} color="var(--primary)" />
                          <span>{c.categoryName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.categoryId, c.categoryName)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
              {editingId ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Home Goods, Books..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
