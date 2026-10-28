import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Shield, Award, BookOpen } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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
                  placeholder="e.g. student@edtech.com"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#FFFFFF' }} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Role-Based Quick Access & Workflows */}
          <div style={{
            marginTop: '1.75rem',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>SELECT DEMO ROLE & WORKFLOW:</span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>Click to fill credentials</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Student Role */}
              <div
                onClick={() => fillDemoAccount('student@edtech.com', 'Student@123')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: email === 'student@edtech.com' ? 'var(--primary-light)' : '#FFFFFF',
                  border: `1.5px solid ${email === 'student@edtech.com' ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)' }}>
                    <BookOpen size={16} />
                    <span>Student Role</span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>student@edtech.com</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <strong>Workflow:</strong> Enroll in courses, stream video lectures, take 180 assessment questions, attempt 120 timed quizzes & track real progress.
                </div>
              </div>

              {/* Instructor Role */}
              <div
                onClick={() => fillDemoAccount('instructor@edtech.com', 'Instructor@123')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: email === 'instructor@edtech.com' ? 'var(--accent-light)' : '#FFFFFF',
                  border: `1.5px solid ${email === 'instructor@edtech.com' ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--accent)' }}>
                    <Award size={16} />
                    <span>Instructor Role</span>
                  </div>
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>instructor@edtech.com</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <strong>Workflow:</strong> Create courses, publish/unpublish curriculum, upload learning materials, view enrolled students & inspect test results.
                </div>
              </div>

              {/* Admin Role */}
              <div
                onClick={() => fillDemoAccount('admin@edtech.com', 'Admin@123')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: email === 'admin@edtech.com' ? 'var(--danger-light)' : '#FFFFFF',
                  border: `1.5px solid ${email === 'admin@edtech.com' ? 'var(--danger)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--danger)' }}>
                    <Shield size={16} />
                    <span>Administrator Role</span>
                  </div>
                  <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>admin@edtech.com</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <strong>Workflow:</strong> Full platform metrics, user management, toggle active/inactive account status, modify user roles (Student ⇄ Instructor ⇄ Admin).
                </div>
              </div>
            </div>
          </div>

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
