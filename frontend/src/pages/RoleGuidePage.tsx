import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Users,
  Award,
  Video,
  ClipboardCheck,
  TrendingUp,
  Settings,
  Eye,
  Edit,
  UserCheck,
  BarChart2,
  Zap,
  PlayCircle,
  Bell,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ROLE_COLORS = {
  student:    { primary: '#7C3AED', light: '#EDE9FE', label: 'STUDENT',    emoji: '🎓' },
  instructor: { primary: '#EC4899', light: '#FCE7F3', label: 'INSTRUCTOR', emoji: '👨‍🏫' },
  admin:      { primary: '#DC2626', light: '#FEE2E2', label: 'ADMIN',      emoji: '🛡️' },
} as const;

type Role = keyof typeof ROLE_COLORS;

const Tick = ({ color }: { color: string }) => (
  <div style={{
    width: 28, height: 28, borderRadius: '50%',
    backgroundColor: color + '20',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, margin: '0 auto',
  }}>
    <CheckCircle size={16} color={color} />
  </div>
);

const Cross = () => (
  <div style={{
    width: 28, height: 28, borderRadius: '50%',
    backgroundColor: '#F1F5F9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, margin: '0 auto',
  }}>
    <XCircle size={16} color="#CBD5E1" />
  </div>
);

// ─── Matrix data ─────────────────────────────────────────────────────────────

const MATRIX = [
  { feature: 'Self-Registration (Public)',              student: true,  instructor: false, admin: false, note: 'Public registration always creates a student account; elevated roles are assigned by an administrator.' },
  { feature: 'Browse Published Course Catalog',         student: true,  instructor: true,  admin: true,  note: 'All authenticated roles can view the 6 core subjects.' },
  { feature: 'Enroll in a Course',                      student: true,  instructor: false, admin: false, note: 'Enrollment is a student-only action.' },
  { feature: 'Watch Video Lectures',                    student: true,  instructor: true,  admin: true,  note: 'Content readable by all roles.' },
  { feature: 'Read Study Notes',                        student: true,  instructor: true,  admin: true,  note: 'Content readable by all roles.' },
  { feature: 'Mark Lesson Completed & Track Progress',  student: true,  instructor: false, admin: false, note: 'Progress counters are student-specific; isolated per account.' },
  { feature: 'Attempt 30-Q Subject Assessments',        student: true,  instructor: true,  admin: true,  note: '180 total questions with auto server-side grading.' },
  { feature: 'Attempt 20-Q Timed Speed Quizzes',        student: true,  instructor: true,  admin: true,  note: '120 total questions with 20-min visible countdown.' },
  { feature: 'View Own Results & Answer Review',         student: true,  instructor: true,  admin: true,  note: 'Each user sees their own submissions only.' },
  { feature: 'View Progress Analytics Dashboard',        student: true,  instructor: false, admin: false, note: 'Progress % calculated only for student enrollments.' },
  { feature: 'Create / Edit Courses',                   student: false, instructor: true,  admin: true,  note: 'POST /api/courses — backend enforces instructor|admin role.' },
  { feature: 'Publish / Unpublish Courses',             student: false, instructor: true,  admin: true,  note: 'PATCH /api/courses/:id/publish — protected route.' },
  { feature: 'View Enrolled Student Roster',            student: false, instructor: true,  admin: true,  note: 'GET /api/instructor/students — instructor+ only.' },
  { feature: 'Inspect All Platform Submissions',         student: false, instructor: true,  admin: true,  note: 'Faculty can audit cohort exam scores.' },
  { feature: 'View System-wide Metrics',                student: false, instructor: false, admin: true,  note: 'GET /api/admin/stats — admin only.' },
  { feature: 'Manage All User Accounts',                student: false, instructor: false, admin: true,  note: 'GET /api/admin/users — admin only.' },
  { feature: 'Promote / Demote User Roles',             student: false, instructor: false, admin: true,  note: 'PATCH /api/admin/users/:id/role — admin only.' },
  { feature: 'Activate / Deactivate Accounts',          student: false, instructor: false, admin: true,  note: 'PATCH /api/admin/users/:id/status — admin only.' },
];

// ─── Workflow steps per role ──────────────────────────────────────────────────

const WORKFLOWS: Record<Role, { step: number; title: string; desc: string; icon: React.ElementType; exclusive?: boolean }[]> = {
  student: [
    { step: 1, title: 'Register / Login',        icon: UserCheck,      desc: 'Create a student account from the public registration page.' },
    { step: 2, title: 'Browse & Enroll',          icon: BookOpen,       desc: 'Explore 6 technical subjects and enroll in chosen courses.', exclusive: true },
    { step: 3, title: 'Watch & Read',             icon: Video,          desc: 'Stream video lectures, read study notes, mark lessons complete.', exclusive: true },
    { step: 4, title: 'Take 30-Q Assessments',    icon: ClipboardCheck, desc: 'Attempt subject assessments using the question palette runner.' },
    { step: 5, title: 'Take 20-Q Timed Quizzes',  icon: Zap,            desc: 'Race the 20-min countdown; auto-submitted on expiry.' },
    { step: 6, title: 'Review Results',           icon: Award,          desc: 'View your detailed score transcript and per-question explanations.' },
    { step: 7, title: 'Track Progress',           icon: TrendingUp,     desc: 'Check auto-calculated progress bars: lessons 60%, assess 20%, quiz 20%.', exclusive: true },
  ],
  instructor: [
    { step: 1, title: 'Login as Instructor',      icon: UserCheck,      desc: 'Sign in with an instructor account provisioned by an administrator.' },
    { step: 2, title: 'Create Course',            icon: Edit,           desc: 'Open the "+ New Course" modal, set title, category, level.', exclusive: true },
    { step: 3, title: 'Publish / Unpublish',      icon: Eye,            desc: 'Toggle course visibility: draft hidden from students, published visible.', exclusive: true },
    { step: 4, title: 'Review Course Catalog',    icon: BookOpen,       desc: 'Browse all published and draft courses in the platform.' },
    { step: 5, title: 'View Student Roster',      icon: Users,          desc: 'Inspect enrolled students, enrollment dates, and completion %.', exclusive: true },
    { step: 6, title: 'Audit Submissions',        icon: ClipboardCheck, desc: 'Review cohort assessment and quiz scores across subjects.', exclusive: true },
    { step: 7, title: 'Access Content & Exams',   icon: PlayCircle,     desc: 'Watch lectures, read notes and take assessments/quizzes yourself.' },
  ],
  admin: [
    { step: 1, title: 'Login as Admin',           icon: UserCheck,      desc: 'Sign in with an administrator account provisioned through trusted database access.' },
    { step: 2, title: 'Platform Metrics',         icon: BarChart2,      desc: 'View total users, instructors, courses, and pass rates.', exclusive: true },
    { step: 3, title: 'User Roster Audit',        icon: Users,          desc: 'Search and filter all registered accounts by role or name.', exclusive: true },
    { step: 4, title: 'Role Management',          icon: Settings,       desc: 'Promote / demote any user: Student ⇄ Instructor ⇄ Admin in one click.', exclusive: true },
    { step: 5, title: 'Account Control',          icon: ShieldAlert,    desc: 'Activate or deactivate accounts; deactivated users get 401 on login.', exclusive: true },
    { step: 6, title: 'Course Oversight',         icon: BookOpen,       desc: 'Browse all courses and publish/unpublish with admin authority.' },
    { step: 7, title: 'Notifications & Profile',  icon: Bell,           desc: 'Receive platform notifications and manage own profile.' },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export const RoleGuidePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'matrix'>('overview');

  const currentRole = (user?.role as Role) || 'student';
  const currentColor = ROLE_COLORS[currentRole];

  const TABS = [
    { key: 'overview' as const,  label: '🏠 Role Overview' },
    { key: 'workflows' as const, label: '📋 Workflows' },
    { key: 'matrix' as const,    label: '📊 Permissions Matrix' },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: '1200px' }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${currentColor.primary} 0%, ${currentColor.primary}BB 100%)`,
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            <Lock size={14} /> RBAC — Role-Based Access Control
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Role Access & Workflow Guide
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: '550px', lineHeight: 1.6 }}>
            Visually differentiate what each role can and cannot do — from backend JWT guards to frontend routing restrictions.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
        }}>
          <span style={{ fontSize: '1.75rem' }}>{currentColor.emoji}</span>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600 }}>YOUR ACTIVE ROLE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{currentColor.label}</div>
          </div>
        </div>
      </div>

      {/* ── Tab Nav ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '0.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '0.4rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        width: 'fit-content',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: activeTab === tab.key ? currentColor.primary : 'transparent',
              color: activeTab === tab.key ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Role Overview ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
            {(Object.keys(ROLE_COLORS) as Role[]).map(role => {
              const rc = ROLE_COLORS[role];
              const isActive = user?.role === role;
              const canDo = role === 'student'
                ? ['Enroll / unenroll from courses', 'Mark lessons complete', 'Personal progress tracking (60/20/20%)']
                : role === 'instructor'
                ? ['Create & publish courses', 'View enrolled student roster', 'Audit cohort exam scores']
                : ['Manage all user accounts', 'Promote / demote roles', 'Activate / deactivate accounts'];
              const cannotDo = role === 'student'
                ? ['Create or publish courses', 'Manage user accounts', 'View platform-wide metrics']
                : role === 'instructor'
                ? ['Enroll in courses (student)', 'Manage any user account', 'View platform-wide stats']
                : ['Enroll in courses', 'Track lesson progress (student)', 'Create courses (instructor)'];

              return (
                <div key={role} className="card" style={{
                  borderTop: `5px solid ${rc.primary}`,
                  backgroundColor: isActive ? rc.light : '#FFFFFF',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                  padding: '1.5rem',
                }}>
                  {isActive && (
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      backgroundColor: rc.primary, color: '#FFFFFF',
                      fontSize: '0.6rem', fontWeight: 800, padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)', letterSpacing: '0.05em',
                    }}>
                      ✓ ACTIVE NOW
                    </div>
                  )}

                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{rc.emoji}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: rc.primary, letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                    ROLE {role === 'student' ? '1' : role === 'instructor' ? '2' : '3'} — {rc.label}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                    {role === 'student' ? 'Learner' : role === 'instructor' ? 'Faculty / Course Author' : 'System Administrator'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
                    {role === 'student'
                      ? 'Enroll in courses, study video lectures & notes, attempt assessments and quizzes, and track personal progress.'
                      : role === 'instructor'
                      ? 'Create and manage course curricula, publish/unpublish courses, inspect the enrolled student roster, audit cohort scores.'
                      : 'Full governance: manage all user accounts, assign/revoke roles, activate/deactivate accounts, and monitor platform analytics.'}
                  </p>

                  {/* Role assignment */}
                  <div style={{
                    backgroundColor: '#F8FAFC', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Account access</div>
                    <div>{role === 'student' ? 'Available through public registration.' : 'Role assigned by an authorized administrator.'}</div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      After sign-in → <strong>{role === 'admin' ? '/admin/dashboard' : role === 'instructor' ? '/instructor/dashboard' : '/dashboard'}</strong>
                    </div>
                  </div>

                  {/* Exclusive capabilities */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: rc.primary, marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                      🔒 EXCLUSIVE TO THIS ROLE
                    </div>
                    {canDo.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                        <CheckCircle size={13} color={rc.primary} style={{ flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Cannot do */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                      ✗ CANNOT DO
                    </div>
                    {cannotDo.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        <XCircle size={13} color="#CBD5E1" style={{ flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)',
                    fontWeight: 700, fontSize: '0.875rem', textAlign: 'center',
                    backgroundColor: isActive ? rc.light : '#F8FAFC',
                    color: rc.primary,
                    border: `1px solid ${rc.primary}50`,
                  }}>
                    {isActive ? `✓ Currently ${rc.label}` : `${rc.label} permissions`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: Workflows ─────────────────────────────────────────────── */}
      {activeTab === 'workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(Object.keys(WORKFLOWS) as Role[]).map(role => {
            const rc = ROLE_COLORS[role];
            const steps = WORKFLOWS[role];
            return (
              <div key={role} style={{
                borderRadius: 'var(--radius-xl)',
                border: `2px solid ${rc.primary}30`,
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
              }}>
                {/* Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${rc.primary} 0%, ${rc.primary}BB 100%)`,
                  padding: '1.25rem 1.75rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: '#FFFFFF',
                }}>
                  <span style={{ fontSize: '1.75rem' }}>{rc.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.85, letterSpacing: '0.06em' }}>
                      {role === 'student' ? 'ROLE 1' : role === 'instructor' ? 'ROLE 2' : 'ROLE 3'} WORKFLOW
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {rc.label} — {role === 'student' ? 'Learning & Assessment' : role === 'instructor' ? 'Course Management & Oversight' : 'Governance & System Control'}
                    </div>
                  </div>
                  {user?.role === role && (
                    <div style={{ marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                      ← YOU ARE HERE
                    </div>
                  )}
                </div>

                {/* Steps */}
                <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'flex-start' }}>
                  {steps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <React.Fragment key={s.step}>
                        <div style={{
                          flex: '1', minWidth: '140px', maxWidth: '210px',
                          backgroundColor: s.exclusive ? rc.light : '#F8FAFC',
                          border: `1.5px solid ${s.exclusive ? rc.primary + '50' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem',
                          position: 'relative',
                        }}>
                          {s.exclusive && (
                            <div style={{
                              position: 'absolute', top: -9, right: 8,
                              backgroundColor: rc.primary, color: '#FFFFFF',
                              fontSize: '0.58rem', fontWeight: 800, padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-full)', letterSpacing: '0.04em',
                              whiteSpace: 'nowrap',
                            }}>
                              🔒 EXCLUSIVE
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              backgroundColor: rc.primary, color: '#FFFFFF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.65rem', fontWeight: 800, flexShrink: 0,
                            }}>
                              {s.step}
                            </div>
                            <Icon size={13} color={rc.primary} />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {s.desc}
                          </div>
                        </div>
                        {i < steps.length - 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem', color: rc.primary, opacity: 0.4, flexShrink: 0 }}>
                            <ArrowRight size={16} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center',
            padding: '1rem 1.25rem', backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>LEGEND:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ width: 14, height: 14, backgroundColor: '#7C3AED20', border: '1.5px solid #7C3AED50', borderRadius: 4 }} />
              <span><strong>🔒 EXCLUSIVE</strong> — only this role can perform this step</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ width: 14, height: 14, backgroundColor: '#F8FAFC', border: '1.5px solid var(--border)', borderRadius: 4 }} />
              <span>Shared — available to multiple roles</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Permissions Matrix ─────────────────────────────────────── */}
      {activeTab === 'matrix' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderBottom: '2px solid var(--border)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Full Permissions Matrix
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Every capability mapped to backend route protections — middleware: <code>authorize('role')</code>. Shaded rows are role-exclusive.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '260px' }}>
                    Functional Capability
                  </th>
                  {(Object.keys(ROLE_COLORS) as Role[]).map(role => (
                    <th key={role} style={{ padding: '1rem', textAlign: 'center', width: '110px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{ROLE_COLORS[role].emoji}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em', color: ROLE_COLORS[role].primary }}>
                          {ROLE_COLORS[role].label}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Security Rule
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, idx) => {
                  const trueCount = [row.student, row.instructor, row.admin].filter(Boolean).length;
                  const isExclusive = trueCount === 1;
                  return (
                    <tr key={idx} style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: isExclusive ? '#FAFAFA' : '#FFFFFF',
                    }}>
                      <td style={{ padding: '0.85rem 1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isExclusive && <Lock size={12} color="#94A3B8" style={{ flexShrink: 0 }} />}
                          {row.feature}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        {row.student ? <Tick color={ROLE_COLORS.student.primary} /> : <Cross />}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        {row.instructor ? <Tick color={ROLE_COLORS.instructor.primary} /> : <Cross />}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        {row.admin ? <Tick color={ROLE_COLORS.admin.primary} /> : <Cross />}
                      </td>
                      <td style={{ padding: '0.85rem 1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {row.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix legend */}
          <div style={{
            padding: '1rem 1.5rem', backgroundColor: '#F8FAFC',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={15} color="#7C3AED" /> Allowed for this role
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <XCircle size={15} color="#CBD5E1" /> Denied — backend returns 403 Forbidden
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Lock size={13} color="#94A3B8" /> Shaded row = capability exclusive to exactly one role
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
