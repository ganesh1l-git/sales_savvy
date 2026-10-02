import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminNav } from '../../components/AdminNav';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle, Truck, DollarSign } from 'lucide-react';

export const AdminReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await adminService.getReports();
        setReport(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const total = report?.totalOrders || 0;
  const successRate = total > 0 ? Math.round((report.successfulOrders / total) * 100) : 0;

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Business Sales & Fulfillment Reports</h1>
          <p style={{ color: 'var(--text-muted)' }}>Aggregated transaction insights and order lifecycle distribution</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Top Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div className="card">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Gross Revenue (INR)
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{Number(report?.totalSales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--success)', marginTop: '6px', fontWeight: 600 }}>
                  Confirmed Paid Orders
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Total Orders Placed
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                  {report?.totalOrders || 0}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Lifetime order creations
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Payment Conversion Rate
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--success)' }}>
                  {successRate}%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {report?.successfulOrders || 0} Successful / {report?.failedOrders || 0} Failed
                </div>
              </div>
            </div>

            {/* Lifecycle Distribution Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Order Status Breakdown */}
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
                  Order Fulfillment Stages
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>Pending Payment (PENDING)</span>
                      <strong>{report?.pendingOrders || 0}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: total ? `${((report?.pendingOrders || 0) / total) * 100}%` : '0%', height: '100%', background: 'var(--warning)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>Approved / In Packaging (APPROVED)</span>
                      <strong>{report?.approvedOrders || 0}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: total ? `${((report?.approvedOrders || 0) / total) * 100}%` : '0%', height: '100%', background: 'var(--info)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>Carrier In Transit (SHIPPED)</span>
                      <strong>{report?.shippedOrders || 0}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: total ? `${((report?.shippedOrders || 0) / total) * 100}%` : '0%', height: '100%', background: '#16a34a' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>Completed (DELIVERED)</span>
                      <strong>{report?.deliveredOrders || 0}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: total ? `${((report?.deliveredOrders || 0) / total) * 100}%` : '0%', height: '100%', background: 'var(--success)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>Cancelled (CANCELLED)</span>
                      <strong>{report?.cancelledOrders || 0}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: total ? `${((report?.cancelledOrders || 0) / total) * 100}%` : '0%', height: '100%', background: 'var(--danger)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Breakdown */}
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
                  Gateway Settlement Breakdown
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', height: '80%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle size={32} color="var(--success)" />
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                        {report?.successfulOrders || 0} Payments
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#047857' }}>
                        Successfully verified by Razorpay signature HMAC
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
                    <AlertTriangle size={32} color="var(--danger)" />
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
                        {report?.failedOrders || 0} Payments
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
                        Failed or abandoned transactions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
