import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--bg-main)'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          Loading portal session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--danger)', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You do not have the required permissions to access this page ({allowedRoles.join(', ')} only).
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return <Outlet />;
};
