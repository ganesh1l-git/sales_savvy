import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { AdminNav } from '../../components/AdminNav';
import { Package, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, Search, Image as ImageIcon } from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subCategory: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrls: ['']
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getAllProducts(),
        productService.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      setActionError('Failed to load products or categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      subCategory: '',
      price: '',
      stock: '',
      categoryId: categories.length > 0 ? categories[0].categoryId : '',
      imageUrls: ['']
    });
    setActionError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.productId);
    setFormData({
      name: p.name,
      description: p.description || '',
      subCategory: p.subCategory || '',
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId,
      imageUrls: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : ['']
    });
    setActionError('');
    setIsModalOpen(true);
  };

  const handleAddImageUrlField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.imageUrls];
    updated[index] = value;
    setFormData({ ...formData, imageUrls: updated });
  };

  const handleRemoveImageUrlField = (index) => {
    const updated = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      subCategory: formData.subCategory ? formData.subCategory.trim() : null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      categoryId: Number(formData.categoryId),
      imageUrls: formData.imageUrls.filter((url) => url && url.trim().length > 0)
    };

    try {
      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        setActionSuccess('Product updated successfully!');
      } else {
        await adminService.createProduct(payload);
        setActionSuccess('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setActionError(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}" permanently?`)) return;
    try {
      await adminService.deleteProduct(id);
      setActionSuccess(`Product "${name}" deleted.`);
      fetchData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Product Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage inventory catalog, pricing, categories, and media assets</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px', fontSize: '0.9rem' }}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={handleOpenCreate} className="btn btn-primary">
              <Plus size={18} /> Add Product
            </button>
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
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Available</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.productId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
                              alt=""
                              style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700 }}>{p.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: #{p.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                            <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                              {p.categoryName || 'General'}
                            </span>
                            {p.subCategory && (
                              <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                {p.subCategory}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className={`product-stock ${p.stock <= 0 ? 'stock-out' : 'stock-in'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {p.imageUrls?.length || 0} image(s)
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Product"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.productId, p.name)}
                              className="btn btn-danger btn-sm"
                              title="Delete Product"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>
              {editingId ? 'Edit Product' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subcategory (e.g. Laptops, Wearables, Kurta sets, Watches)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Laptops, Earphones, Dresses, Watches"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (INR ₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inventory Stock *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Product Images URLs */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Product Image URLs</label>
                  <button
                    type="button"
                    onClick={handleAddImageUrlField}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    + Add Image URL
                  </button>
                </div>

                {formData.imageUrls.map((url, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    />
                    {formData.imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrlField(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
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
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
