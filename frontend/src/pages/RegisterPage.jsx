import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$%^&+=!_\-*~]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (!isPasswordValid) {
      setErrorMsg('Password does not meet all security criteria.');
      return;
    }

    try {
      setLoading(true);
      await register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: 'CUSTOMER'
      });
      // Redirect to login with friendly message
      navigate('/login', { state: { message: 'Registration successful! You can now log in.' } });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
      if (err.errors) {
        setFieldErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f5f5f7 100%)'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '36px', borderRadius: '20px', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '16px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            <UserPlus size={32} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Create an Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Join Sales Savvy to explore premium SMB catalogs
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username (5-50 characters)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={5}
                maxLength={50}
                required
              />
            </div>
            {fieldErrors.username && <div className="form-error">{fieldErrors.username}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}

            {/* Live Password Rules */}
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              marginTop: '10px',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>Password Requirements:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasMinLength ? 'var(--success)' : 'var(--text-muted)' }}>
                <CheckCircle2 size={13} /> At least 8 characters
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasUpper ? 'var(--success)' : 'var(--text-muted)' }}>
                <CheckCircle2 size={13} /> At least 1 uppercase letter
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLower ? 'var(--success)' : 'var(--text-muted)' }}>
                <CheckCircle2 size={13} /> At least 1 lowercase letter
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? 'var(--success)' : 'var(--text-muted)' }}>
                <CheckCircle2 size={13} /> At least 1 number
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecial ? 'var(--success)' : 'var(--text-muted)' }}>
                <CheckCircle2 size={13} /> At least 1 special character (@#$%^&+=!_-*~)
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '20px' }}
          >
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
