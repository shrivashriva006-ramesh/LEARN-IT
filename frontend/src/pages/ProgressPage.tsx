import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  TrendingUp,
  CheckCircle,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ProgressItem, Course } from '../types';

export const ProgressPage: React.FC = () => {
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [overallPercentage, setOverallPercentage] = useState<number>(0);
  const [totalCompletedLessons, setTotalCompletedLessons] = useState<number>(0);
  const [performanceChart, setPerformanceChart] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.get('/progress/my-progress');
        if (res.data.success) {
          setProgressList(res.data.progressList || []);
          setOverallPercentage(res.data.overallPercentage || 0);
          setTotalCompletedLessons(res.data.totalCompletedLessonsCount || 0);
          setPerformanceChart(res.data.performanceChartData || []);
        }
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const pieData = [
    { name: 'Completed', value: overallPercentage },
    { name: 'Remaining', value: Math.max(0, 100 - overallPercentage) },
  ];
  const COLORS = ['#7C3AED', '#E2E8F0'];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <TrendingUp size={28} color="var(--primary)" />
            My Learning Progress & Analytics
          </h2>
          <p className="page-subtitle">
            Calculated in real-time from completed modules, video lessons, assessments, and quizzes.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Calculating academic progress...</span>
        </div>
      ) : (
        <>
          {/* Top Level Summary Cards */}
          <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={24}
                      outerRadius={38}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Total Degree Progress
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {overallPercentage}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Across all enrolled subjects
                </div>
              </div>
            </div>

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
                <CheckCircle size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Completed Lessons
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {totalCompletedLessons}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Video & notes units verified
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
                <BookOpen size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Active Enrolled Courses
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {progressList.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  6 subjects available in curriculum
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Progress Breakdown Cards */}
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Course-Wise Progress Bars
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {progressList.map((prog) => {
              const courseTitle = prog.course?.title || 'Course';
              const completedCount = prog.completedLessons?.length || 0;
              const totalLessons = prog.totalLessons || 3;

              return (
                <div key={prog._id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                        {prog.course?.category || 'General'}
                      </span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {courseTitle}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {prog.completionPercentage}%
                      </span>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        {completedCount} of {totalLessons} Lessons Finished
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="progress-container" style={{ height: '10px', marginBottom: '1.25rem' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${prog.completionPercentage}%` }}
                    />
                  </div>

                  {/* Modules & Milestones Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${completedCount > 0 ? 'badge-success' : 'badge-info'}`}>
                        {completedCount > 0 ? `${completedCount} Lessons Complete` : 'No Lessons Started'}
                      </span>
                      <span className={`badge ${prog.hasCompletedAssessment ? 'badge-success' : 'badge-warning'}`}>
                        {prog.hasCompletedAssessment ? '30-Q Assessment Done ✓' : 'Assessment Pending'}
                      </span>
                      <span className={`badge ${prog.hasCompletedQuiz ? 'badge-success' : 'badge-warning'}`}>
                        {prog.hasCompletedQuiz ? '20-Q Quiz Done ✓' : 'Quiz Pending'}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${prog.course?._id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <span>Continue Course</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
