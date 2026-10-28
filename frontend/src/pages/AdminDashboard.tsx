import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  BookOpen,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  UserCheck,
  Search,
  Filter,
  UserPlus,
  UserX,
} from 'lucide-react';
import { User, Course } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [actionMsg, setActionMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, requestsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/instructor-requests'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.users || []);
      }
      if (requestsRes.data.success) {
        setInstructorRequests(requestsRes.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || (u as any)._id === userId
              ? { ...u, status: res.data.status }
              : u
          )
        );
        setActionMsg({ text: res.data.message });
      }
    } catch (err) {
      setActionMsg({ text: getErrorMessage(err), error: true });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || (u as any)._id === userId
              ? { ...u, role: res.data.user.role }
              : u
          )
        );
        setActionMsg({ text: `User role updated to ${newRole}` });
      }
    } catch (err) {
      setActionMsg({ text: getErrorMessage(err), error: true });
    }
  };

  const handleInstructorRequest = async (userId: string, decision: 'approve' | 'reject') => {
    try {
      const res = await api.patch(`/admin/instructor-requests/${userId}`, { decision });
      if (res.data.success) {
        setInstructorRequests((prev) =>
          prev.filter((request: any) => (request._id || request.id) !== userId)
        );
        setUsers((prev) =>
          prev.map((existing: any) =>
            (existing._id || existing.id) === userId
              ? { ...existing, role: res.data.user.role, instructorRequestStatus: res.data.user.instructorRequestStatus }
              : existing
          )
        );
        setActionMsg({ text: res.data.message });
      }
    } catch (err) {
      setActionMsg({ text: getErrorMessage(err), error: true });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      {/* ── Role Identity Banner ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 20px 40px -15px rgba(220,38,38,0.4)',
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.06em', marginBottom: '0.85rem',
          }}>
            🛡️ ROLE 3 — ADMINISTRATOR
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Admin Control Center
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '1rem' }}>
            You have <strong>full governance authority</strong> over this platform. Students and Instructors cannot access this dashboard.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>🔒 ADMIN-EXCLUSIVE</div>
              {['Manage all user accounts', 'Promote / demote any role', 'Activate / deactivate accounts', 'Platform-wide metrics'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#FCA5A5', fontWeight: 700 }}>✓</span> {p}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>✗ CANNOT DO</div>
              {['Enroll in courses (student only)', 'Track lesson progress (student)', 'Create courses as instructor'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.2rem', opacity: 0.75 }}>
                  <span>✗</span> {p}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.75rem', textAlign: 'center', minWidth: '130px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🛡️</div>
          <div style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE ROLE</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user?.name?.split(' ')[0] || 'Admin'}</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>{user?.email}</div>
        </div>
      </div>

      {actionMsg && (
        <div className={`alert ${actionMsg.error ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {actionMsg.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>Instructor Access Requests</h3>
          <p className="card-desc">Review requests before granting instructor permissions.</p>
        </div>
        {instructorRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>There are no pending instructor requests.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {instructorRequests.map((request: any) => {
              const requestId = request._id || request.id;
              return (
                <div key={requestId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{request.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{request.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleInstructorRequest(requestId, 'approve')}
                    >
                      <UserPlus size={14} /> Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleInstructorRequest(requestId, 'reject')}
                    >
                      <UserX size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Total Registered Students
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {stats?.totalStudents || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Total Instructors
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>
            {stats?.totalInstructors || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Active Courses
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.totalCourses || 6}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Total Test Attempts
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.25rem' }}>
            {stats?.totalResults || 0}
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>
              User Account Management
            </h3>
            <p className="card-desc">
              Manage student, instructor, and administrator permissions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', fontSize: '0.85rem', width: '220px' }}
                placeholder="Search user by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['All', 'student', 'instructor', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: roleFilter === r ? 'var(--primary)' : '#F1F5F9',
                    color: roleFilter === r ? '#FFFFFF' : 'var(--text-main)',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Name & Email</th>
                <th style={{ padding: '1rem 1rem' }}>Current Role</th>
                <th style={{ padding: '1rem 1rem' }}>Account Status</th>
                <th style={{ padding: '1rem 1rem' }}>Change Role</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u: any) => {
                const uid = u._id || u.id;
                const isSelf = uid === user?.id;

                return (
                  <tr key={uid} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {u.name} {isSelf && <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>(You)</span>}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'instructor' ? 'badge-accent' : 'badge-primary'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(uid, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: '130px' }}
                        disabled={isSelf}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(uid)}
                        className={`btn ${u.status === 'active' ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                        disabled={isSelf}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
