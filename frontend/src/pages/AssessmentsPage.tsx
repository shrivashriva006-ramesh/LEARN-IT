import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ClipboardCheck,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Assessment, Result } from '../types';

export const AssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const [assessRes, resultsRes] = await Promise.all([
          api.get('/assessments'),
          api.get('/results/my-results?itemType=assessment'),
        ]);

        if (assessRes.data.success) {
          setAssessments(assessRes.data.assessments || []);
        }

        if (resultsRes.data.success) {
          setResults(resultsRes.data.results || []);
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
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
            <ClipboardCheck size={28} color="var(--primary)" />
            Subject Assessments (180 Total Questions)
          </h2>
          <p className="page-subtitle">
            Formal 30-question examinations across all 6 core subjects with automatic evaluation and grading.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Loading assessment directory...</span>
        </div>
      ) : (
        <div className="grid-cols-2">
          {assessments.map((a) => {
            const bestResult = getBestScore(a.subject);

            return (
              <div
                key={a._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--primary)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary">{a.subject}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      30 Questions &bull; 30 Marks
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {a.description || `Comprehensive examination evaluating concepts, syntax, and problem-solving skills in ${a.subject}.`}
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
                        <span style={{ color: 'var(--text-muted)' }}>Highest Score: </span>
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

                  <Link to={`/assessments/${a._id}`} className="btn btn-primary btn-sm">
                    <span>{bestResult ? 'Retake Test' : 'Start Assessment'}</span>
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
