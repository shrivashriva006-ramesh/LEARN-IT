import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Send,
  Trash2,
} from 'lucide-react';
import { Course, Result } from '../types';

export const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Result[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'submissions'>('courses');

  // Course Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newDescription, setNewDescription] = useState('');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/instructor/stats'),
        api.get('/instructor/students'),
        api.get('/courses?status=all'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setSubmissions(statsRes.data.recentSubmissions || []);
      }

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.enrollments || []);
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses || []);
      }
    } catch (err) {
      console.error('Failed to load instructor metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const handleTogglePublish = async (courseId: string) => {
    try {
      const res = await api.patch(`/courses/${courseId}/publish`);
      if (res.data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c._id === courseId
              ? { ...c, status: c.status === 'published' ? 'draft' : 'published' }
              : c
          )
        );
        setActionMsg({ text: 'Course status toggled successfully!' });
      }
    } catch (err) {
      setActionMsg({ text: getErrorMessage(err), error: true });
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/courses', {
        title: newTitle.trim(),
        category: newCategory,
        description: newDescription.trim(),
        level: newLevel,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        learningObjectives: [
          'Comprehensive conceptual understanding',
          'Applied coding and architectural principles',
          'Assessment readiness',
        ],
      });

      if (res.data.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        setActionMsg({ text: 'New course created and published successfully!' });
        fetchInstructorData();
      }
    } catch (err) {
      setActionMsg({ text: getErrorMessage(err), error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* ── Role Identity Banner ───────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #EC4899 0%, #9D174D 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 20px 40px -15px rgba(236,72,153,0.4)',
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.06em', marginBottom: '0.85rem',
          }}>
            👨‍🏫 ROLE 2 — INSTRUCTOR
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Faculty Dashboard
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '1rem' }}>
            You are a <strong>Course Author & Faculty Manager</strong>. Only Students can enroll; you cannot be enrolled yourself.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>🔒 INSTRUCTOR-EXCLUSIVE</div>
              {['Create & publish courses', 'View enrolled student roster', 'Audit cohort exam scores', 'Toggle course publish status'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#FBCFE8', fontWeight: 700 }}>✓</span> {p}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>✗ CANNOT DO</div>
              {['Enroll in courses (student only)', 'Track personal lesson progress', 'Manage user accounts (admin only)'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.2rem', opacity: 0.75 }}>
                  <span>✗</span> {p}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem', textAlign: 'center', minWidth: '130px',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>👨‍🏫</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE ROLE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user?.name?.split(' ')[0] || 'Instructor'}</div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.5)',
              color: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <Plus size={16} /> Create Course
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className={`alert ${actionMsg.error ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {actionMsg.text}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Active Courses
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {stats?.totalCourses || courses.length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Enrolled Learners
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>
            {students.length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Total Assessments
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats?.totalAssessments || 6}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Test Submissions
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {submissions.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('courses')}
          className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Course Management
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`btn btn-sm ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Enrolled Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`btn btn-sm ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Recent Submissions ({submissions.length})
        </button>
      </div>

      {/* Tab 1: Course Management Table */}
      {activeTab === 'courses' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Course Title</th>
                  <th style={{ padding: '1rem 1rem' }}>Category</th>
                  <th style={{ padding: '1rem 1rem' }}>Level</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1rem' }}>Enrolled</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.lessons?.length || 3} Lessons</div>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>{c.category}</td>
                    <td style={{ padding: '1rem 1rem' }}>{c.level}</td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span className={`badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 700 }}>{c.enrolledCount} learners</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleTogglePublish(c._id)}
                        className="btn btn-secondary btn-sm"
                      >
                        {c.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Enrolled Students */}
      {activeTab === 'students' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Student Name</th>
                  <th style={{ padding: '1rem 1rem' }}>Email Address</th>
                  <th style={{ padding: '1rem 1rem' }}>Enrolled Course</th>
                  <th style={{ padding: '1rem 1rem' }}>Enrolled Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((e) => (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {e.student?.name || 'Student'}
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)' }}>
                      {e.student?.email}
                    </td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 600 }}>
                      {e.course?.title}
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Recent Submissions */}
      {activeTab === 'submissions' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Student</th>
                  <th style={{ padding: '1rem 1rem' }}>Assessment / Quiz</th>
                  <th style={{ padding: '1rem 1rem' }}>Subject</th>
                  <th style={{ padding: '1rem 1rem' }}>Score</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>
                      {typeof s.student === 'object' ? s.student.name : 'Learner'}
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      <span className={`badge ${s.itemType === 'assessment' ? 'badge-primary' : 'badge-accent'}`}>
                        {s.itemType.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)' }}>{s.subject}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 800 }}>
                      {s.score}/{s.totalMarks} ({s.percentage}%)
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span className={`badge ${s.passed ? 'badge-success' : 'badge-danger'}`}>
                        {s.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>
              Create New Technical Course
            </h3>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Advanced Distributed Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Java Programming">Java Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database Management">Database Management</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Python Programming">Python Programming</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={newLevel}
                  onChange={(e: any) => setNewLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the course syllabus, objectives, and outcomes..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Course...' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
