import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  ClipboardCheck,
  HelpCircle,
  Clock,
  Award,
  ArrowLeft,
  Video,
} from 'lucide-react';
import { Course, Lesson, Assessment, Quiz } from '../types';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [enrollMsg, setEnrollMsg] = useState<string>('');

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseRes, progRes, assessRes, quizRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/progress/course/${id}`),
        api.get(`/assessments?courseId=${id}`),
        api.get(`/quizzes?courseId=${id}`),
      ]);

      if (courseRes.data.success) {
        setCourse(courseRes.data.course);
        setLessons(courseRes.data.course.lessons || []);
        if (courseRes.data.course.lessons && courseRes.data.course.lessons.length > 0) {
          setSelectedLesson(courseRes.data.course.lessons[0]);
        }
      }

      if (progRes.data.success && progRes.data.progress) {
        setProgress(progRes.data.progress);
        setIsEnrolled(true);
      }

      if (assessRes.data.success && assessRes.data.assessments?.length > 0) {
        setAssessment(assessRes.data.assessments[0]);
      }

      if (quizRes.data.success && quizRes.data.quizzes?.length > 0) {
        setQuiz(quizRes.data.quizzes[0]);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const res = await api.post(`/courses/${id}/enroll`);
      if (res.data.success) {
        setIsEnrolled(true);
        setEnrollMsg('Successfully enrolled! You can now track your learning completion.');
        fetchCourseData();
      }
    } catch (err) {
      setEnrollMsg(getErrorMessage(err));
    }
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    try {
      const res = await api.patch(`/progress/${lessonId}`);
      if (res.data.success) {
        fetchCourseData();
      }
    } catch (err) {
      console.error('Failed to update lesson completion:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
        <span style={{ color: 'var(--text-muted)' }}>Loading course content...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const completedLessonIds = (progress?.completedLessons || []).map((l: any) => (l._id || l));
  const completionPercentage = progress?.completionPercentage || 0;

  return (
    <div className="page-wrapper">
      <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.5rem',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-primary">{course.category}</span>
            <span className="badge badge-accent">{course.level} Level</span>
            {isEnrolled && <span className="badge badge-success">Enrolled</span>}
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            {course.title}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {course.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <div>Instructor: <strong style={{ color: 'var(--text-main)' }}>{course.instructor?.name || 'Prof. Divyanjali'}</strong></div>
            <div>Enrolled: <strong style={{ color: 'var(--text-main)' }}>{course.enrolledCount} learners</strong></div>
          </div>

          {/* Progress bar if enrolled */}
          {isEnrolled ? (
            <div style={{ maxWidth: '450px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Your Course Progress</span>
                <span style={{ color: 'var(--primary)' }}>{completionPercentage}%</span>
              </div>
              <div className="progress-container" style={{ height: '10px' }}>
                <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          ) : (
            <div>
              {enrollMsg && (
                <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                  {enrollMsg}
                </div>
              )}
              <button onClick={handleEnroll} className="btn btn-primary btn-lg">
                Enroll in This Course
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail & Quick Action Box */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
          <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-around' }}>
            {assessment && (
              <Link to={`/assessments/${assessment._id}`} className="btn btn-primary btn-sm">
                <ClipboardCheck size={16} /> 30-Q Assessment
              </Link>
            )}
            {quiz && (
              <Link to={`/quizzes/${quiz._id}`} className="btn btn-accent btn-sm">
                <HelpCircle size={16} /> 20-Q Speed Quiz
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Course Learning Objectives */}
      {course.learningObjectives && course.learningObjectives.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Learning Objectives</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
            {course.learningObjectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Lessons & Interactive Reader Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: '2rem' }}>
        {/* Left: Lessons List */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Course Lessons</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              {lessons.length} Modules
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lessons.map((lesson) => {
              const isSelected = selectedLesson?._id === lesson._id;
              const isDone = completedLessonIds.includes(lesson._id);

              return (
                <div
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: lesson.contentType === 'video' ? 'var(--primary-light)' : 'var(--accent-light)',
                      color: lesson.contentType === 'video' ? 'var(--primary)' : 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {lesson.contentType === 'video' ? <Video size={16} /> : <FileText size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {lesson.lessonTitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {lesson.contentType.toUpperCase()} &bull; {lesson.durationMinutes} mins
                      </div>
                    </div>
                  </div>

                  {/* Mark complete checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLessonComplete(lesson._id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: isDone ? 'var(--success)' : 'var(--text-light)',
                    }}
                    title="Toggle Completion"
                  >
                    <CheckCircle size={20} color={isDone ? 'var(--success)' : '#CBD5E1'} fill={isDone ? '#D1FAE5' : 'none'} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Lesson Content Reader / Video Player */}
        <div className="card">
          {selectedLesson ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                    {selectedLesson.contentType.toUpperCase()} LESSON
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedLesson.lessonTitle}
                  </h3>
                </div>

                <button
                  onClick={() => handleToggleLessonComplete(selectedLesson._id)}
                  className={`btn ${completedLessonIds.includes(selectedLesson._id) ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                >
                  <CheckCircle size={16} />
                  {completedLessonIds.includes(selectedLesson._id) ? 'Completed ✓' : 'Mark as Completed'}
                </button>
              </div>

              {/* Video Embed Player */}
              {selectedLesson.contentType === 'video' && selectedLesson.contentUrl && (
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  backgroundColor: '#000000',
                }}>
                  <iframe
                    src={selectedLesson.contentUrl}
                    title={selectedLesson.lessonTitle}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Study Notes & Markdown Text */}
              <div style={{
                backgroundColor: '#F8FAFC',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                fontSize: '0.925rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                color: 'var(--text-main)',
              }}>
                {selectedLesson.notesContent || selectedLesson.description}
              </div>

              {/* Downloadable / Viewable PDF Learning Material */}
              {selectedLesson.pdfUrl && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={22} color="var(--primary)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-dark)' }}>
                        Attached Learning Reference PDF
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Supplementary study handout for {course.title}
                      </div>
                    </div>
                  </div>
                  <a
                    href={selectedLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={14} /> Open PDF
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Select a lesson from the left to view the interactive lecture and study material.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
