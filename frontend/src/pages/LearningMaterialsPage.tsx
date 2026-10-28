import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Video,
  FileText,
  Download,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Lesson, Course } from '../types';

export const LearningMaterialsPage: React.FC = () => {
  const location = useLocation();
  const initialType = location.pathname.includes('learning-videos')
    ? 'video'
    : location.pathname.includes('study-notes')
    ? 'notes'
    : 'all';

  const [filterType, setFilterType] = useState<string>(initialType);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const subjects = [
    'All',
    'Java Programming',
    'Web Development',
    'Database Management',
    'Cyber Security',
    'Cloud Computing',
    'Python Programming',
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, coursesRes, progRes] = await Promise.all([
        api.get('/lessons'),
        api.get('/courses'),
        api.get('/progress/my-progress'),
      ]);

      if (lessonsRes.data.success) {
        setLessons(lessonsRes.data.lessons || []);
        if (lessonsRes.data.lessons?.length > 0) {
          setActiveLesson(lessonsRes.data.lessons[0]);
        }
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses || []);
      }

      if (progRes.data.success && progRes.data.progressList) {
        const completed: string[] = [];
        progRes.data.progressList.forEach((p: any) => {
          (p.completedLessons || []).forEach((l: any) => {
            completed.push(l._id || l);
          });
        });
        setCompletedLessonIds(completed);
      }
    } catch (err) {
      console.error('Failed to load learning materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleComplete = async (lessonId: string) => {
    try {
      const res = await api.patch(`/progress/${lessonId}`);
      if (res.data.success) {
        setCompletedLessonIds((prev) =>
          prev.includes(lessonId)
            ? prev.filter((id) => id !== lessonId)
            : [...prev, lessonId]
        );
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const courseObj = typeof l.course === 'object' ? (l.course as Course) : courses.find((c) => c._id === l.course);
    const matchesSubject =
      selectedSubject === 'All' ||
      (courseObj && courseObj.category.toLowerCase() === selectedSubject.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      l.contentType === filterType ||
      (filterType === 'notes' && (l.contentType === 'notes' || l.contentType === 'pdf'));

    return matchesSubject && matchesType;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {filterType === 'video' ? (
              <Video size={28} color="var(--primary)" />
            ) : (
              <FileText size={28} color="var(--accent)" />
            )}
            Learning Materials & Resources
          </h2>
          <p className="page-subtitle">
            Interactive high-definition video lectures, curated study notes, and supplementary PDF handouts.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Content Type Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Resources
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`btn btn-sm ${filterType === 'video' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Video size={15} /> Video Lectures
          </button>
          <button
            onClick={() => setFilterType('notes')}
            className={`btn btn-sm ${filterType === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={15} /> Study Notes & PDFs
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedSubject === s ? 'var(--accent)' : '#F1F5F9',
                color: selectedSubject === s ? '#FFFFFF' : 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: selectedSubject === s ? 700 : 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Material Viewer / List Split */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Loading learning resources...</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: '2rem' }}>
          {/* Left: Material Units List */}
          <div className="card" style={{ padding: '1.5rem', maxHeight: '780px', overflowY: 'auto' }}>
            <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Available Modules</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {filteredLessons.length} Items
              </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredLessons.map((lesson) => {
                const isSelected = activeLesson?._id === lesson._id;
                const isCompleted = completedLessonIds.includes(lesson._id);
                const courseObj = typeof lesson.course === 'object' ? (lesson.course as Course) : courses.find((c) => c._id === lesson.course);

                return (
                  <div
                    key={lesson._id}
                    onClick={() => setActiveLesson(lesson)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: lesson.contentType === 'video' ? '#EDE9FE' : '#FCE7F3',
                          color: lesson.contentType === 'video' ? 'var(--primary)' : 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {lesson.contentType === 'video' ? <Video size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                            {lesson.lessonTitle}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {courseObj?.category || 'Computer Science'} &bull; {lesson.durationMinutes} min
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(lesson._id);
                        }}
                        style={{ padding: '0.2rem' }}
                        title="Toggle Completed"
                      >
                        <CheckCircle
                          size={18}
                          color={isCompleted ? 'var(--success)' : '#CBD5E1'}
                          fill={isCompleted ? '#D1FAE5' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Material Player / Document Reader */}
          <div className="card">
            {activeLesson ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                      {activeLesson.contentType.toUpperCase()} MATERIAL
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {activeLesson.lessonTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleComplete(activeLesson._id)}
                    className={`btn ${completedLessonIds.includes(activeLesson._id) ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  >
                    <CheckCircle size={16} />
                    {completedLessonIds.includes(activeLesson._id) ? 'Completed ✓' : 'Mark Lesson Completed'}
                  </button>
                </div>

                {/* Video Player */}
                {activeLesson.contentType === 'video' && activeLesson.contentUrl && (
                  <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    marginBottom: '1.5rem',
                  }}>
                    <iframe
                      src={activeLesson.contentUrl}
                      title={activeLesson.lessonTitle}
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

                {/* Notes Content */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  lineHeight: 1.7,
                  fontSize: '0.925rem',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                  marginBottom: '1.5rem',
                }}>
                  {activeLesson.notesContent || activeLesson.description}
                </div>

                {/* PDF Resource Download Box */}
                {activeLesson.pdfUrl && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-light)',
                    border: '1px dashed var(--accent)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={20} color="var(--accent)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#9D174D' }}>
                          Downloadable PDF Learning Handout
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Official syllabus notes and reference documentation
                        </div>
                      </div>
                    </div>
                    <a
                      href={activeLesson.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-accent btn-sm"
                    >
                      <Download size={14} /> Open PDF
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Select a learning material from the list to begin studying.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
