import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { Quiz, Result, Question } from '../types';

export const TakeQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qNum: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);
  const [error, setError] = useState<string>('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${id}`);
        if (res.data.success) {
          setQuiz(res.data.quiz);
          setTimeLeft((res.data.quiz.durationMinutes || 20) * 60);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Quiz Countdown Timer
  useEffect(() => {
    if (loading || submissionResult || !quiz) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, submissionResult, quiz]);

  const handleSelectOption = (qNum: number, optIndex: number) => {
    if (submissionResult) return;
    setAnswers((prev) => ({
      ...prev,
      [qNum]: optIndex,
    }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 20;

  const handleAutoSubmit = async () => {
    submitQuizInternal(true);
  };

  const handleManualSubmit = () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finish the quiz?`
      );
      if (!confirmSubmit) return;
    }
    submitQuizInternal(false);
  };

  const submitQuizInternal = async (timedOut: boolean) => {
    if (isSubmitting || submissionResult) return;

    try {
      setIsSubmitting(true);
      setError('');
      if (timerRef.current) clearInterval(timerRef.current);

      const totalDuration = (quiz?.durationMinutes || 20) * 60;
      const timeSpentSeconds = Math.max(0, totalDuration - timeLeft);

      const res = await api.post(`/quizzes/${id}/submit`, {
        answers,
        timeSpentSeconds,
        timedOut,
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
        <span style={{ color: 'var(--text-muted)' }}>Loading speed quiz questions...</span>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1rem' }}>
          {error}
        </div>
        <Link to="/quizzes" className="btn btn-primary">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  if (!quiz || !quiz.questions) return null;

  const currentQ: Question = quiz.questions[currentIndex];

  // ==========================================
  // Post-Quiz Submission Result
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
            {submissionResult.passed ? 'Speed Quiz Passed! ⚡' : 'Quiz Completed'}
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marks Scored</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
                {submissionResult.score} / {submissionResult.totalMarks}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score Percentage</div>
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
                setTimeLeft((quiz.durationMinutes || 20) * 60);
              }}
              className="btn btn-accent"
            >
              <RotateCcw size={16} /> Retake Quiz
            </button>
          </div>
        </div>

        {/* Detailed Solutions */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Detailed Answer Summary (20 Questions)
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
                <span className="badge badge-accent">Quiz Question {item.questionNumber}</span>
                <span className={`badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                  {item.isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {item.questionText}
              </div>

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

              {item.explanation && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F1F5F9',
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)',
                  borderLeft: '3px solid var(--accent)',
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
  // Quiz Active Runner View
  // ==========================================
  const isUrgent = timeLeft < 120; // under 2 minutes

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            <ArrowLeft size={16} /> Exit Quiz
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {quiz.title}
          </h2>
        </div>

        {/* Visible Quiz Timer & Submission Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isUrgent ? 'var(--danger-light)' : '#FFFFFF',
            border: `2px solid ${isUrgent ? 'var(--danger)' : 'var(--accent)'}`,
            color: isUrgent ? 'var(--danger)' : 'var(--accent)',
            fontWeight: 800,
            fontSize: '1.1rem',
            animation: isUrgent ? 'pulse 1s infinite' : 'none',
          }}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}>
            {answeredCount} / {totalQuestions} Answered
          </div>

          <button
            onClick={handleManualSubmit}
            className="btn btn-accent"
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? 'Evaluating...' : 'Submit Quiz'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Main Runner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2rem' }}>
        {/* Left Question Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-accent">
              Quiz Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              1 Mark &bull; Timed Test
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '2rem' }}>
            {currentQ.questionText}
          </h3>

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
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--accent-light)' : '#FFFFFF',
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
                    border: `2px solid ${isSelected ? 'var(--accent)' : '#CBD5E1'}`,
                    backgroundColor: isSelected ? 'var(--accent)' : '#FFFFFF',
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
                    color: isSelected ? '#9D174D' : 'var(--text-main)',
                  }}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Previous / Next buttons */}
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
              <ChevronLeft size={18} /> Previous
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="btn btn-accent"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleManualSubmit}
                className="btn btn-accent"
                disabled={isSubmitting}
              >
                <Send size={16} /> Submit Quiz
              </button>
            )}
          </div>
        </div>

        {/* Right Palette (20 questions) */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Quiz Palette (20 Questions)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Jump to any question quickly.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.questionNumber] !== undefined;
              const isCurrent = currentIndex === idx;

              let bg = '#F1F5F9';
              let text = 'var(--text-main)';
              let border = 'var(--border)';

              if (isAnswered) {
                bg = 'var(--accent)';
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
                    border: isCurrent ? '2px solid var(--primary)' : `1px solid ${border}`,
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
              <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent)', borderRadius: '3px' }} />
              <span>Answered ({answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#F1F5F9', border: '1px solid var(--border)', borderRadius: '3px' }} />
              <span>Unanswered ({totalQuestions - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
