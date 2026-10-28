import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar,
  Lock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setMsg(null);
      const res = await api.put('/auth/profile', { name: name.trim(), bio: bio.trim() });
      if (res.data.success) {
        updateUser(res.data.user);
        setMsg({ text: 'Profile information updated successfully!' });
      }
    } catch (err) {
      setMsg({ text: getErrorMessage(err), error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <User size={28} color="var(--primary)" />
            My Profile & Account Settings
          </h2>
          <p className="page-subtitle">
            Manage your personal profile, credentials, and learning portal preferences.
          </p>
        </div>
      </div>

      {msg && (
        <div className={`alert ${msg.error ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {msg.error ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <div>{msg.text}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '2rem' }}>
        {/* Left: User Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', height: 'fit-content' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '2.25rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {user?.name}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {user?.email}
          </p>

          <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : user?.role === 'instructor' ? 'badge-accent' : 'badge-primary'}`} style={{ textTransform: 'uppercase', padding: '0.35rem 0.85rem' }}>
              {user?.role} ACCOUNT
            </span>
          </div>

          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <strong style={{ color: 'var(--success)' }}>Active &bull; Verified</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Department:</span>
              <strong style={{ color: 'var(--text-main)' }}>CSE (Cyber Security)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Project:</span>
              <strong style={{ color: 'var(--text-main)' }}>2311CSC503R</strong>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
            Edit Profile Information
          </h3>

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#F1F5F9', color: 'var(--text-muted)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                Primary login email cannot be modified directly.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Academic Interests</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share your technical interests, goals, or certifications..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
