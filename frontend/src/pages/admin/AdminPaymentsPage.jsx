import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminNav } from '../../components/AdminNav';
import { CreditCard, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await adminService.getPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payment logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) =>
    (p.gatewayOrderId && p.gatewayOrderId.toLowerCase().includes(search.toLowerCase())) ||
    (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(search.toLowerCase())) ||
    p.orderId?.toString().includes(search)
  );

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Payment Gateway Logs</h1>
            <p style={{ color: 'var(--text-muted)' }}>Audit Razorpay gateway orders, payment IDs, verification signatures, and amounts</p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px', fontSize: '0.9rem' }}
              placeholder="Search by order or payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

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
                    <th>Payment ID</th>
                    <th>Internal Order</th>
                    <th>Razorpay Order ID</th>
                    <th>Razorpay Payment ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        No payment transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.paymentId}>
                        <td style={{ fontWeight: 700 }}>#{p.paymentId}</td>
                        <td style={{ fontWeight: 700 }}>#{p.orderId}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {p.gatewayOrderId || 'N/A'}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {p.gatewayPaymentId || 'Pending'}
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.paymentMethod}</span>
                        </td>
                        <td>
                          <span className={`badge ${p.status === 'SUCCESS' ? 'badge-success' : p.status === 'FAILED' ? 'badge-failed' : 'badge-pending'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleString('en-IN') : 'N/A'}
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
    </div>
  );
};
