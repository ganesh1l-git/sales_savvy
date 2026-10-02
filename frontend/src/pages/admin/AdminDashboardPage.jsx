import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminNav } from '../../components/AdminNav';
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [reports, setReports] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [rep, orders] = await Promise.all([
          adminService.getReports(),
          adminService.getOrders()
        ]);
        setReports(rep);
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <AdminNav />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Admin Executive Overview
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Real-time platform metrics, sales summaries, and operational actions
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/products" className="btn btn-primary btn-sm">
              <Package size={16} /> Manage Products
            </Link>
            <Link to="/admin/reports" className="btn btn-secondary btn-sm">
              Full Analytics
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '36px'
            }}>
              {/* Total Revenue */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Total Sales
                  </span>
                  <div style={{ background: 'var(--success-bg)', padding: '8px', borderRadius: '10px', color: 'var(--success)' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{Number(reports?.totalSales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
                  Verified Razorpay Transactions
                </div>
              </div>

              {/* Total Orders */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Total Orders
                  </span>
                  <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                    <ShoppingCart size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {reports?.totalOrders || 0}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {reports?.successfulOrders || 0} Successful | {reports?.failedOrders || 0} Failed
                </div>
              </div>

              {/* Pending Fulfillment */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Pending Dispatch
                  </span>
                  <div style={{ background: 'var(--warning-bg)', padding: '8px', borderRadius: '10px', color: 'var(--warning)' }}>
                    <Clock size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--warning)' }}>
                  {(reports?.pendingOrders || 0) + (reports?.approvedOrders || 0)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Orders awaiting carrier dispatch
                </div>
              </div>

              {/* Completed Deliveries */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Delivered Orders
                  </span>
                  <div style={{ background: 'var(--info-bg)', padding: '8px', borderRadius: '10px', color: 'var(--info)' }}>
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {reports?.deliveredOrders || 0}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Successfully fulfilled
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Customer Orders</h3>
                <Link to="/admin/orders" style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 700 }}>
                  View All Orders &rarr;
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Order Status</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                          No recent orders to show.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.orderId}>
                          <td style={{ fontWeight: 800 }}>#{order.orderId}</td>
                          <td style={{ fontWeight: 600 }}>{order.username || 'Customer'}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                          </td>
                          <td style={{ fontWeight: 800 }}>
                            ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span className={`badge badge-${order.status?.toLowerCase() || 'pending'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${order.payment?.status === 'SUCCESS' ? 'badge-success' : 'badge-pending'}`}>
                              {order.payment?.status || 'PENDING'}
                            </span>
                          </td>
                          <td>
                            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
                              Manage <ArrowUpRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
