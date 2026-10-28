import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Bell,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Bell size={28} color="var(--primary)" />
            Notifications & Announcements
          </h2>
          <p className="page-subtitle">
            Stay updated with assessment results, speed quiz evaluation alerts, and course releases.
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Retrieving notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Bell size={40} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Notifications
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            You're all caught up! New test scores and announcements will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((n) => {
            const dateStr = new Date(n.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={n._id}
                onClick={() => handleMarkAsRead(n._id, n.link)}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: n.isRead ? '#FFFFFF' : '#FAF5FF',
                  borderLeft: `5px solid ${n.isRead ? 'transparent' : 'var(--primary)'}`,
                  cursor: n.link ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: n.isRead ? '#F1F5F9' : 'var(--primary-light)',
                    color: n.isRead ? 'var(--text-muted)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.2rem',
                  }}>
                    <Bell size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {n.title}
                      </h4>
                      {!n.isRead && <span className="badge badge-primary">New</span>}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} /> {dateStr}
                    </div>
                  </div>
                </div>

                {n.link && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>View</span>
                    <ExternalLink size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
