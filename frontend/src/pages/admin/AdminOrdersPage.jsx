import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminNav } from '../../components/AdminNav';
import { ShoppingCart, Eye, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err) {
      setActionError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionError('');
    setActionSuccess('');
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setActionSuccess(`Order #${orderId} status changed to ${newStatus}.`);
      fetchOrders();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toString().includes(search) ||
      (o.username && o.username.toLowerCase().includes(search.toLowerCase())) ||
      (o.shippingAddress && o.shippingAddress.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Order Fulfillment Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review and advance fulfillment lifecycle stages across all customer orders</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px', fontSize: '0.9rem' }}
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: 'auto', fontSize: '0.9rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
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
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total (INR ₹)</th>
                    <th>Payment</th>
                    <th>Fulfillment Status</th>
                    <th>Update Status</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.orderId}>
                        <td style={{ fontWeight: 800 }}>#{o.orderId}</td>
                        <td style={{ fontWeight: 600 }}>{o.username || 'Customer'}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          ₹{Number(o.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className={`badge ${o.payment?.status === 'SUCCESS' ? 'badge-success' : 'badge-pending'}`}>
                            {o.payment?.status || 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${o.status?.toLowerCase() || 'pending'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            style={{ fontSize: '0.82rem', padding: '4px 8px', width: 'auto' }}
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.orderId, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="btn btn-secondary btn-sm"
                            title="Inspect Order Items"
                          >
                            <Eye size={14} />
                          </button>
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

      {/* Order Items Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Order #{selectedOrder.orderId} Details
              </h3>
              <span className={`badge badge-${selectedOrder.status?.toLowerCase()}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div><strong>Customer:</strong> {selectedOrder.username}</div>
              <div><strong>Address:</strong> {selectedOrder.shippingAddress}</div>
              <div><strong>Shipping Method:</strong> {selectedOrder.shippingOption} (₹{Number(selectedOrder.shippingCharge).toFixed(2)})</div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Items:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ₹{Number(item.pricePerUnit).toFixed(2)} &times; {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    ₹{Number(item.totalPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, borderTop: '2px solid var(--border-color)', paddingTop: '12px' }}>
              <span>Grand Total:</span>
              <span style={{ color: 'var(--primary)' }}>
                ₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
