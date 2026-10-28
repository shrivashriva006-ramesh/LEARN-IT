import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  ClipboardCheck,
  HelpCircle,
  Award,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
  ShieldAlert,
  GraduationCap,
  Users,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // Navigation items for students
  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Learning Videos', path: '/learning-videos', icon: Video },
    { name: 'Study Notes', path: '/study-notes', icon: FileText },
    { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'My Results', path: '/results', icon: Award },
    { name: 'My Progress', path: '/progress', icon: TrendingUp, exclusive: true },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Role Guide', path: '/role-guide', icon: Compass },
  ];

  // Navigation items for instructors
  const instructorNavItems = [
    { name: 'Faculty Dashboard', path: '/instructor/dashboard', icon: GraduationCap },
    { name: 'Course Curriculum', path: '/courses', icon: BookOpen },
    { name: 'Create Courses', path: '/instructor/dashboard', icon: Video, exclusive: true },
    { name: 'Video Lectures', path: '/learning-videos', icon: Video },
    { name: 'Study Notes Bank', path: '/study-notes', icon: FileText },
    { name: 'Assessments (30-Q)', path: '/assessments', icon: ClipboardCheck },
    { name: 'Speed Quizzes (20-Q)', path: '/quizzes', icon: HelpCircle },
    { name: 'Student Results', path: '/results', icon: Award, exclusive: true },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Role Guide', path: '/role-guide', icon: Compass },
  ];

  // Navigation items for administrators
  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldAlert },
    { name: 'User Management', path: '/admin/dashboard', icon: Users, exclusive: true },
    { name: 'Course Catalog Control', path: '/courses', icon: BookOpen },
    { name: 'Assessment Oversight', path: '/assessments', icon: ClipboardCheck },
    { name: 'Speed Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'All Submissions', path: '/results', icon: Award },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Role Guide', path: '/role-guide', icon: Compass },
  ];

  const getRoleHeader = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'ADMINISTRATOR',
          subtitle: 'System Control & Users',
          badgeClass: 'badge-danger',
          icon: ShieldAlert,
          color: 'var(--danger)',
          items: adminNavItems,
        };
      case 'instructor':
        return {
          title: 'INSTRUCTOR',
          subtitle: 'Faculty Course Manager',
          badgeClass: 'badge-accent',
          icon: GraduationCap,
          color: 'var(--accent)',
          items: instructorNavItems,
        };
      default:
        return {
          title: 'STUDENT',
          subtitle: 'Interactive Learning Workspace',
          badgeClass: 'badge-primary',
          icon: BookOpen,
          color: 'var(--primary)',
          items: studentNavItems,
        };
    }
  };

  const roleMeta = getRoleHeader();
  const IconHeader = roleMeta.icon;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 40,
            display: 'block',
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: '265px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          overflowY: 'auto',
          zIndex: 45,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Prominent Active Role Badge Banner */}
        <div style={{
          padding: '1.25rem 1rem 0.75rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: '#F8FAFC',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${roleMeta.color}`,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: `${roleMeta.color}15`,
              color: roleMeta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconHeader size={18} />
            </div>
            <div>
              <div style={{
                fontSize: '0.725rem',
                fontWeight: 800,
                color: roleMeta.color,
                letterSpacing: '0.05em',
                lineHeight: 1.2,
              }}>
                {roleMeta.title} MODE
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {roleMeta.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <div style={{
            fontSize: '0.725rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-light)',
            padding: '0 0.75rem 0.5rem',
          }}>
            Portal Navigation
          </div>

          {roleMeta.items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path + item.name}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? roleMeta.color : 'var(--text-muted)',
                  backgroundColor: isActive ? `${roleMeta.color}12` : 'transparent',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.name}</span>
                {(item as any).exclusive && (
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.04em',
                    color: roleMeta.color, backgroundColor: `${roleMeta.color}18`,
                    padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${roleMeta.color}40`,
                    flexShrink: 0,
                  }}>EXCL.</span>
                )}
              </NavLink>
            );
          })}

          {/* Quick Cross-Role Preview for Instructors & Admins */}
          {user?.role !== 'student' && (
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px dashed var(--border)',
            }}>
              <div style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                padding: '0 0.75rem 0.5rem',
              }}>
                Learner View
              </div>
              <NavLink
                to="/dashboard"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                <BookOpen size={16} />
                <span>Student View Preview</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: '#FAFAFA'
        }}>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--danger)',
              backgroundColor: 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
