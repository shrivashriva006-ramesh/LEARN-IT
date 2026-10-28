import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Quiz, Result } from '../types';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const [quizRes, resultRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/results/my-results?itemType=quiz'),
        ]);

        if (quizRes.data.success) {
          setQuizzes(quizRes.data.quizzes || []);
        }

        if (resultRes.data.success) {
          setResults(resultRes.data.results || []);
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const getBestScore = (subject: string) => {
    const matches = results.filter((r) => r.subject.toLowerCase() === subject.toLowerCase());
    if (matches.length === 0) return null;
    return matches.sort((a, b) => b.percentage - a.percentage)[0];
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Zap size={28} color="var(--accent)" />
            Subject Speed Quizzes (120 Total Questions)
          </h2>
          <p className="page-subtitle">
            Timed 20-minute rapid-fire challenge quizzes with visible countdown timer and automatic score evaluation.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Loading speed quizzes...</span>
        </div>
      ) : (
        <div className="grid-cols-2">
          {quizzes.map((q) => {
            const bestResult = getBestScore(q.subject);

            return (
              <div
                key={q._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--accent)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-accent">{q.subject}</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <Clock size={14} /> {q.durationMinutes} Minutes &bull; 20 Marks
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {q.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    20 curated multiple choice questions testing rapid comprehension and problem solving. Auto-submits when time expires.
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    {bestResult ? (
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Best Score: </span>
                        <strong style={{ color: bestResult.passed ? 'var(--success)' : 'var(--danger)' }}>
                          {bestResult.score}/{bestResult.totalMarks} ({bestResult.percentage}%)
                        </strong>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        Not yet attempted
                      </span>
                    )}
                  </div>

                  <Link to={`/quizzes/${q._id}`} className="btn btn-accent btn-sm">
                    <span>{bestResult ? 'Retake Quiz' : 'Start Timed Quiz'}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
