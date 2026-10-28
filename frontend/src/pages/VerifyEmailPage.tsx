import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setMessage('This verification link is missing its token. Request a new registration link.');
      setIsLoading(false);
      return;
    }

    api.post('/auth/verify-email', { token })
      .then((response) => {
        setIsVerified(true);
        setMessage(response.data.message || 'Email verified successfully. You can now sign in.');
      })
      .catch((error) => {
        setMessage(getErrorMessage(error));
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

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
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.15)',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 1.5rem',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}>
          <GraduationCap size={27} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Verify your email
        </h2>
        {isLoading ? (
          <div className="spinner" style={{ width: '24px', height: '24px', margin: '1.5rem auto' }} />
        ) : (
          <div className={`alert ${isVerified ? 'alert-success' : 'alert-error'}`} role="status" style={{ textAlign: 'left' }}>
            {isVerified
              ? <CheckCircle size={18} style={{ flexShrink: 0 }} />
              : <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            <div>{message}</div>
          </div>
        )}
        {!isLoading && (
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Continue to sign in
          </Link>
        )}
      </div>
    </div>
  );
};
