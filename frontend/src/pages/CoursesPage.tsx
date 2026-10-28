import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  PlayCircle,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Course } from '../types';

export const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [enrollMsg, setEnrollMsg] = useState<{ id: string; text: string; error?: boolean } | null>(null);

  const categories = [
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
      const [coursesRes, enrollRes] = await Promise.all([
        api.get('/courses'),
        api.get('/enrollments/my-courses'),
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses || []);
      }

      if (enrollRes.data.success && enrollRes.data.enrollments) {
        const ids = enrollRes.data.enrollments.map((e: any) => e.course?._id || e.course);
        setEnrolledCourseIds(ids);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await api.post(`/courses/${courseId}/enroll`);
      if (res.data.success) {
        setEnrolledCourseIds((prev) => [...prev, courseId]);
        setEnrollMsg({ id: courseId, text: 'Enrolled successfully!' });
      }
    } catch (err) {
      setEnrollMsg({ id: courseId, text: getErrorMessage(err), error: true });
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <BookOpen size={28} color="var(--primary)" />
            Course Catalog
          </h2>
          <p className="page-subtitle">
            Explore 6 comprehensive technical disciplines curated for beginner-to-advanced learners.
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search courses by title, keywords or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#F1F5F9',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Loading course catalog...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <BookOpen size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No courses found
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search criteria or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course._id);
            const msg = enrollMsg && enrollMsg.id === course._id ? enrollMsg : null;

            return (
              <div
                key={course._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Course Thumbnail */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '0.5rem',
                  }}>
                    <span className="badge badge-primary" style={{ backdropFilter: 'blur(4px)' }}>
                      {course.category}
                    </span>
                    <span className="badge badge-accent">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Card Body */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {course.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {course.description}
                  </p>

                  {/* Highlights */}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '0.85rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.775rem',
                    color: 'var(--text-muted)',
                  }}>
                    <span>{course.lessons?.length || 3} Learning Units</span>
                    <span>30 Assessments &bull; 20 Quizzes</span>
                  </div>

                  {msg && (
                    <div className={`alert ${msg.error ? 'alert-error' : 'alert-success'}`} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                      {msg.text}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.85rem' }}
                    >
                      View Details
                    </Link>

                    {isEnrolled ? (
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.85rem' }}
                      >
                        <CheckCircle size={15} />
                        Enrolled
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="btn btn-accent"
                        style={{ flex: 1, fontSize: '0.85rem' }}
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
