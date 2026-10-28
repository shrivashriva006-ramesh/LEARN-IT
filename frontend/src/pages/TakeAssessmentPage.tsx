import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  Award,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { Assessment, Result, Question } from '../types';

export const TakeAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qNum: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/assessments/${id}`);
        if (res.data.success) {
          setAssessment(res.data.assessment);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleSelectOption = (qNum: number, optIndex: number) => {
    if (submissionResult) return; // Prevent changing after submission
    setAnswers((prev) => ({
      ...prev,
      [qNum]: optIndex,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment?.questions?.length || 30;

  const handleSubmit = async () => {
    if (isSubmitting || submissionResult) return;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit your assessment?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

      const res = await api.post(`/assessments/${id}/submit`, {
        answers,
        timeSpentSeconds,
      });

      if (res.data.success) {
        setSubmissionResult(res.data.result);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px' }} />
        <span style={{ color: 'var(--text-muted)' }}>Preparing examination questions...</span>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1rem' }}>
          {error}
        </div>
        <Link to="/assessments" className="btn btn-primary">
          Back to Assessments
        </Link>
      </div>
    );
  }

  if (!assessment || !assessment.questions) return null;

  const currentQ: Question = assessment.questions[currentIndex];

  // ==========================================
  // Post-submission Result View
  // ==========================================
  if (submissionResult) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          maxWidth: '750px',
          margin: '0 auto 2.5rem',
          boxShadow: 'var(--shadow-lg)',
          borderTop: `6px solid ${submissionResult.passed ? 'var(--success)' : 'var(--danger)'}`,
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: submissionResult.passed ? 'var(--success-light)' : 'var(--danger-light)',
            color: submissionResult.passed ? 'var(--success)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            {submissionResult.passed ? <CheckCircle size={36} /> : <XCircle size={36} />}
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {submissionResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            {submissionResult.title} &bull; {submissionResult.subject}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score Obtained</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                {submissionResult.score} / {submissionResult.totalMarks}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Percentage</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: submissionResult.passed ? 'var(--success)' : 'var(--danger)' }}>
                {submissionResult.percentage}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct / Total</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {submissionResult.correctAnswers} / {submissionResult.totalQuestions}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/results" className="btn btn-secondary">
              View All Results
            </Link>
            <button
              onClick={() => {
                setSubmissionResult(null);
                setAnswers({});
                setCurrentIndex(0);
              }}
              className="btn btn-primary"
            >
              <RotateCcw size={16} /> Retake Assessment
            </button>
          </div>
        </div>

        {/* Detailed Question Review with Explanations */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Detailed Solution Breakdown (30 Questions)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {submissionResult.answersSummary?.map((item) => (
            <div
              key={item.questionNumber}
              className="card"
              style={{
                borderLeft: `5px solid ${item.isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">Question {item.questionNumber}</span>
                <span className={`badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                  {item.isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {item.questionText}
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                {item.options.map((opt, oIdx) => {
                  const isUserSelection = item.selectedOption === oIdx;
                  const isCorrectChoice = item.correctOption === oIdx;

                  let bg = '#F8FAFC';
                  let border = 'var(--border)';
                  let color = 'var(--text-main)';

                  if (isCorrectChoice) {
                    bg = 'var(--success-light)';
                    border = 'var(--success)';
                    color = '#065F46';
                  } else if (isUserSelection && !isCorrectChoice) {
                    bg = 'var(--danger-light)';
                    border = 'var(--danger)';
                    color = '#991B1B';
                  }

                  return (
                    <div
                      key={oIdx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color: color,
                        fontSize: '0.875rem',
                        fontWeight: isUserSelection || isCorrectChoice ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                      {isCorrectChoice && <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>✓ Correct</span>}
                      {isUserSelection && !isCorrectChoice && <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>✗ Your Choice</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F1F5F9',
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)',
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <strong>Explanation: </strong> {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // Assessment Taking View (1 Question at a time with Navigation & Tracker)
  // ==========================================
  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/assessments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            <ArrowLeft size={16} /> Exit to Assessments
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {assessment.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--primary)',
          }}>
            Answered: {answeredCount} / {totalQuestions}
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-accent"
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Main Grid: Question Card & Question Selector Palette */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2rem' }}>
        {/* Left: Current Question Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-primary">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              1 Mark &bull; Single Choice
            </span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            {currentQ.questionText}
          </h3>

          {/* Optional Code Snippet */}
          {currentQ.codeSnippet && (
            <pre style={{
              backgroundColor: '#0F172A',
              color: '#38BDF8',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              overflowX: 'auto',
              marginBottom: '1.75rem',
            }}>
              <code>{currentQ.codeSnippet}</code>
            </pre>
          )}

          {/* 4 Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            {currentQ.options.map((option, optIdx) => {
              const isSelected = answers[currentQ.questionNumber] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.questionNumber, optIdx)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--primary)' : '#CBD5E1'}`,
                    backgroundColor: isSelected ? 'var(--primary)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                  }}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons: Previous & Next */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
          }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="btn btn-secondary"
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={18} /> Previous Question
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="btn btn-primary"
              >
                Next Question <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-accent"
                disabled={isSubmitting}
              >
                <Send size={16} /> Submit Assessment
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigation Matrix (All 30 questions) */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Question Palette (30 Questions)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Click any question number to jump directly to it.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            {assessment.questions.map((q, idx) => {
              const isAnswered = answers[q.questionNumber] !== undefined;
              const isCurrent = currentIndex === idx;

              let bg = '#F1F5F9';
              let text = 'var(--text-main)';
              let border = 'var(--border)';

              if (isCurrent) {
                border = 'var(--primary)';
              }

              if (isAnswered) {
                bg = 'var(--primary)';
                text = '#FFFFFF';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: bg,
                    color: text,
                    border: isCurrent ? '2px solid var(--accent)' : `1px solid ${border}`,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
              <span>Answered ({answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#F1F5F9', border: '1px solid var(--border)', borderRadius: '3px' }} />
              <span>Unanswered ({totalQuestions - answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', border: '2px solid var(--accent)', borderRadius: '3px' }} />
              <span>Current Question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
