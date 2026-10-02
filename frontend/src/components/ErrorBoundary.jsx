import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f8fafc',
          color: '#1e293b'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: '#ffffff',
            padding: '36px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>
              Sales Savvy Initializing
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 20px' }}>
              The application encountered a temporary initialization state. Click below to reload.
            </p>
            {this.state.error?.message && (
              <pre style={{
                background: '#f1f5f9',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#e11d48',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/customerhome';
              }}
              style={{
                background: '#2874f0',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
