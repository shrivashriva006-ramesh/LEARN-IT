import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Role } from '../types';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Users } from 'lucide-react';

interface DemoAccount {
  name: string;
  role: Role;
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboard = user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'instructor'
          ? '/instructor/dashboard'
          : '/dashboard';
      navigate(dashboard, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  useEffect(() => {
    api.get('/auth/demo-accounts')
      .then((res) => setDemoAccounts(res.data.accounts || []))
      .catch((err) => {
        console.error('Unable to load demo accounts:', err.message);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 50%, #FCE7F3 100%)',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.15)',
        border: '1px solid var(--border)',
      }}>
        {/* Left Side: Login Form */}
        <div style={{ padding: '3.5rem 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Ed Tech Portal
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Interactive Learning & Assessment
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Welcome Back!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2rem' }}>
            Log in to access your courses, video lessons, and interactive assessments.
          </p>

          {demoAccounts.length > 0 && (
            <section
              aria-label="Demo accounts"
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
                <Users size={18} />
                <span>Demo Accounts</span>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {demoAccounts.map((account) => (
                  account.email ? (
                    <button
                      key={`${account.role}-${account.email}`}
                      type="button"
                      onClick={() => {
                        setEmail(account.email || '');
                        setPassword(account.password || '');
                        setError('');
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-main)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{account.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{account.email}</span>
                    </button>
                  ) : (
                    <div
                      key={account.role}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-main)',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{account.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Use configured admin email</span>
                    </div>
                  )
                ))}
              </div>
              <p style={{ margin: '0.75rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Select a demo account to fill its login fields.
              </p>
            </section>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#FFFFFF' }} />
                  <span>{isLoading ? 'Checking session...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create an account
            </Link>
          </div>
        </div>

        {/* Right Side: Informative Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
          padding: '3.5rem 2.5rem',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              2311CSC503R &bull; Project Review
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
              Ed Tech Interactive Learning & Assessment Portal
            </h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
              A full-stack MERN educational architecture delivering interactive video modules, comprehensive notes, 180 subject assessments, and 120 timed speed quizzes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
                <span style={{ fontSize: '0.9rem' }}>6 Core Computer Science & Security Subjects</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
                <span style={{ fontSize: '0.9rem' }}>Real-time Automatic Evaluation & Timed Quizzes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
                <span style={{ fontSize: '0.9rem' }}>Role-based Access for Students, Instructors & Admins</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', opacity: 0.75, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
            Presented by R. Shriva (310624149053) &bull; Guide: Ms. Divyanjali
          </div>
        </div>
      </div>
    </div>
  );
};
