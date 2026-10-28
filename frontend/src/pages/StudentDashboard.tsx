import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  ClipboardCheck,
  Bell,
  Sparkles,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Course, Result, NotificationItem } from '../types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<Result[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [performanceChart, setPerformanceChart] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [enrollRes, progRes, resultsRes, notifRes] = await Promise.all([
          api.get('/enrollments/my-courses'),
          api.get('/progress/my-progress'),
          api.get('/results/my-results'),
          api.get('/notifications'),
        ]);

        if (enrollRes.data.success) {
          setEnrolledCourses(enrollRes.data.enrollments || []);
        }

        if (progRes.data.success) {
          setOverallProgress(progRes.data.overallPercentage || 0);
          if (progRes.data.performanceChartData && progRes.data.performanceChartData.length > 0) {
            setPerformanceChart(progRes.data.performanceChartData);
          } else {
            // Default sample display data if new student
            setPerformanceChart([
              { subject: 'Java', averageScore: 87 },
              { subject: 'Web Dev', averageScore: 78 },
              { subject: 'Database', averageScore: 82 },
              { subject: 'Security', averageScore: 90 },
              { subject: 'Cloud', averageScore: 75 },
              { subject: 'Python', averageScore: 85 },
            ]);
          }
        }

        if (resultsRes.data.success) {
          setRecentResults(resultsRes.data.results || []);
        }

        if (notifRes.data.success) {
          setNotifications(notifRes.data.notifications || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completedCoursesCount = enrolledCourses.filter(
    (e) => e.completionPercentage >= 100 || e.completionStatus === 'completed'
  ).length;

  const continueCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="page-wrapper">
      {/* ── Role Identity Banner ───────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 60%, #EC4899 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px -15px rgba(124, 58, 237, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.06em', marginBottom: '0.85rem',
          }}>
            <Sparkles size={13} /> ROLE 1 — STUDENT
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '1rem' }}>
            Your personal learning workspace. Instructors and Admins cannot enroll or track progress — that’s <strong>your exclusive power</strong>.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>🔒 STUDENT-EXCLUSIVE</div>
              {['Enroll & unenroll from courses', 'Mark lessons complete', 'Progress tracking (60/20/20%)', 'Personal learning dashboard'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#C4B5FD', fontWeight: 700 }}>✓</span> {p}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75, marginBottom: '0.4rem' }}>✗ CANNOT DO</div>
              {['Create or publish courses', 'Manage user accounts', 'View other students’ data'].map(p => (
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🎓</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE ROLE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user?.name?.split(' ')[0] || 'Student'}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/courses" style={{
              backgroundColor: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#FFFFFF', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)',
              fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
            }}>Courses</Link>
            <Link to="/assessments" style={{
              backgroundColor: 'rgba(255,255,255,0.9)', border: 'none',
              color: '#7C3AED', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)',
              fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
            }}>Take Test</Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Enrolled Courses
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {enrolledCourses.length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Completed Courses
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {completedCoursesCount}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Overall Progress
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              {overallProgress}%
            </div>
            <div className="progress-container" style={{ marginTop: '0.35rem', height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--warning-light)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Tests Completed
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {recentResults.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split: Continue Learning & Performance Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Left Column: Continue Learning & Enrolled Courses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {continueCourse && (
            <div className="card" style={{
              background: 'linear-gradient(to right, #FFFFFF, #FAF5FF)',
              borderLeft: '5px solid var(--primary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-primary">Continue Learning</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} /> Resume where you left off
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {continueCourse.course.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {continueCourse.course.description}
              </p>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Course Completion</span>
                  <span style={{ color: 'var(--primary)' }}>{continueCourse.completionPercentage}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar-fill" style={{ width: `${continueCourse.completionPercentage}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/courses/${continueCourse.course._id}`} className="btn btn-primary btn-sm">
                  <PlayCircle size={16} /> Open Course Materials
                </Link>
                <Link to="/learning-videos" className="btn btn-secondary btn-sm">
                  Watch Lectures
                </Link>
                <Link to="/study-notes" className="btn btn-secondary btn-sm">
                  Read Study Notes
                </Link>
              </div>
            </div>
          )}

          {/* Quick Subject Access Cards */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>My Courses</h3>
              <Link to="/courses" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All &rarr;
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {enrolledCourses.slice(0, 4).map((enr) => (
                <div
                  key={enr._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {enr.course.title.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                        {enr.course.title}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        {enr.course.category} &bull; {enr.completedLessonsCount || 0} lessons completed
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {enr.completionPercentage}%
                      </span>
                    </div>
                    <Link
                      to={`/courses/${enr.course._id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      Learn &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Performance Analytics Chart & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Assessment Performance Chart using Recharts */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>
              Assessment Performance
            </h3>
            <p className="card-desc" style={{ marginBottom: '1.25rem' }}>
              Subject-wise average test score percentages
            </p>
            <div style={{ width: '100%', height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: 'var(--shadow-md)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="averageScore" fill="url(#purplePinkGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="purplePinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Quiz Results */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Recent Results</h3>
              <Link to="/results" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            {recentResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No completed assessments or quizzes yet. Take a test to see your scores!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentResults.slice(0, 3).map((res) => (
                  <div
                    key={res._id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {res.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {res.subject} &bull; {res.itemType.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: res.passed ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {res.percentage}%
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {res.score}/{res.totalMarks} marks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
