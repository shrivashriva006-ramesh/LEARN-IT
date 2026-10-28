import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Award,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';
import { Result } from '../types';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeModalResult, setActiveModalResult] = useState<Result | null>(null);

  const subjects = [
    'All',
    'Java Programming',
    'Web Development',
    'Database Management',
    'Cyber Security',
    'Cloud Computing',
    'Python Programming',
  ];

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/results/my-results');
      if (res.data.success) {
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter((r) => {
    const matchesType = filterType === 'all' || r.itemType === filterType;
    const matchesSubj = selectedSubject === 'All' || r.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesType && matchesSubj;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Award size={28} color="var(--primary)" />
            My Examination & Quiz Results
          </h2>
          <p className="page-subtitle">
            Historical transcript of completed assessments and speed quizzes with question-level solution breakdowns.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
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
        {/* Type Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Results ({results.length})
          </button>
          <button
            onClick={() => setFilterType('assessment')}
            className={`btn btn-sm ${filterType === 'assessment' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Assessments ({results.filter(r => r.itemType === 'assessment').length})
          </button>
          <button
            onClick={() => setFilterType('quiz')}
            className={`btn btn-sm ${filterType === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Quizzes ({results.filter(r => r.itemType === 'quiz').length})
          </button>
        </div>

        {/* Subject Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedSubject === s ? 'var(--primary)' : '#F1F5F9',
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

      {/* Results Table / Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Retrieving examination transcripts...</span>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <FileCheck size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Results Found
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            You haven't completed any assessments or quizzes matching the selected filters yet.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Title & Subject</th>
                  <th style={{ padding: '1rem 1rem' }}>Type</th>
                  <th style={{ padding: '1rem 1rem' }}>Score</th>
                  <th style={{ padding: '1rem 1rem' }}>Percentage</th>
                  <th style={{ padding: '1rem 1rem' }}>Correct / Total</th>
                  <th style={{ padding: '1rem 1rem' }}>Submission Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => {
                  const dateStr = new Date(r.submissionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={r._id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {r.subject}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <span className={`badge ${r.itemType === 'assessment' ? 'badge-primary' : 'badge-accent'}`}>
                          {r.itemType.toUpperCase()}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {r.score} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {r.totalMarks}</span>
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: r.passed ? 'var(--success)' : 'var(--danger)',
                        }}>
                          {r.percentage}%
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)' }}>
                        {r.correctAnswers} / {r.totalQuestions} Qs
                      </td>

                      <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        {dateStr}
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setActiveModalResult(r)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Eye size={14} /> Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {activeModalResult && (
        <div className="modal-overlay" onClick={() => setActiveModalResult(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '850px' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <span className={`badge ${activeModalResult.itemType === 'assessment' ? 'badge-primary' : 'badge-accent'}`} style={{ marginBottom: '0.35rem' }}>
                  {activeModalResult.itemType.toUpperCase()} REVIEW
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeModalResult.title}
                </h3>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {activeModalResult.subject} &bull; Score: {activeModalResult.score}/{activeModalResult.totalMarks} ({activeModalResult.percentage}%)
                </div>
              </div>

              <button
                onClick={() => setActiveModalResult(null)}
                style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Questions List in Modal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {activeModalResult.answersSummary?.map((q) => (
                <div
                  key={q.questionNumber}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${q.isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Question {q.questionNumber}
                    </span>
                    <span className={`badge ${q.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                      {q.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    {q.questionText}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {q.options.map((opt, oIdx) => {
                      const isUser = q.selectedOption === oIdx;
                      const isCorrect = q.correctOption === oIdx;

                      let bg = '#FFFFFF';
                      let border = 'var(--border)';
                      let color = 'var(--text-main)';

                      if (isCorrect) {
                        bg = 'var(--success-light)';
                        border = 'var(--success)';
                        color = '#065F46';
                      } else if (isUser && !isCorrect) {
                        bg = 'var(--danger-light)';
                        border = 'var(--danger)';
                        color = '#991B1B';
                      }

                      return (
                        <div
                          key={oIdx}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: bg,
                            border: `1px solid ${border}`,
                            color: color,
                            fontSize: '0.8rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {isCorrect && <span style={{ fontWeight: 700 }}>✓</span>}
                          {isUser && !isCorrect && <span style={{ fontWeight: 700 }}>✗</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--primary)', paddingLeft: '0.5rem' }}>
                      <strong>Solution: </strong>{q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setActiveModalResult(null)} className="btn btn-secondary">
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
