import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import api from '../services/api';
import '../styles/interview.css';

const InterviewPracticePage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${interviewId}`);
        if (response.data.success) {
          setInterview(response.data.data);
          setCurrentQuestion(response.data.data.questions[0]);
        }
      } catch (error) {
        console.error('Error fetching interview:', error);
        alert('Failed to load interview');
        navigate('/dashboard');
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId, navigate]);

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGetHint = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/interviews/${interviewId}/question/${currentQuestion.id}/hint`
      );
      if (response.data.success) {
        setHint(response.data.data.hint);
        setShowHint(true);
      }
    } catch (error) {
      console.error('Error getting hint:', error);
      alert('Failed to get hint');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter an answer before submitting');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        `/interviews/${interviewId}/submit`,
        {
          questionId: currentQuestion.id,
          answer: userAnswer,
          timeSpent: 300 - timeRemaining
        }
      );

      if (response.data.success) {
        setEvaluation(response.data.data.evaluation);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < interview.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestion(interview.questions[currentIndex + 1]);
      setUserAnswer('');
      setEvaluation(null);
      setSubmitted(false);
      setShowHint(false);
      setHint(null);
      setTimeRemaining(300);
    } else {
      handleEndInterview();
    }
  };

  const handleSkipQuestion = async () => {
    try {
      setLoading(true);
      await api.post(`/interviews/${interviewId}/skip`);
      handleNextQuestion();
    } catch (error) {
      console.error('Error skipping question:', error);
      alert('Failed to skip question');
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/interviews/${interviewId}/end`);
      if (response.data.success) {
        navigate(`/interview-results/${interviewId}`);
      }
    } catch (error) {
      console.error('Error ending interview:', error);
      alert('Failed to end interview');
    } finally {
      setLoading(false);
    }
  };

  if (!interview || !currentQuestion) {
    return (
      <div className="interview-loading">
        <div className="spinner"></div>
        <p>Loading interview...</p>
      </div>
    );
  }

  const isTimeWarning = timeRemaining < 60;

  return (
    <div className="interview-container">
      {/* Header */}
      <div className="interview-header">
        <div className="interview-info">
          <h1>{interview.topic} - {interview.difficulty}</h1>
          <p>Question {currentIndex + 1} of {interview.questionCount}</p>
        </div>
        <div className={`timer ${isTimeWarning ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / interview.questionCount) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="interview-content">
        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <h2>{currentQuestion.title}</h2>
            <span className="difficulty-badge">{interview.difficulty}</span>
          </div>
          <div className="question-description">
            <p>{currentQuestion.description}</p>
          </div>
          <div className="question-footer">
            <small>Estimated time: {currentQuestion.estimatedTime} seconds</small>
          </div>
        </div>

        {/* Answer Section */}
        {!submitted ? (
          <div className="answer-section">
            <label htmlFor="answer">Your Answer</label>
            <textarea
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={loading}
              maxLength={5000}
            />
            <div className="answer-footer">
              <span>{userAnswer.length}/5000</span>
            </div>
          </div>
        ) : (
          <div className="evaluation-section">
            <div className={`evaluation-card ${evaluation.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="evaluation-score">
                <span className="score-label">Score</span>
                <span className="score-value">{evaluation.score}/100</span>
              </div>
              <div className="evaluation-feedback">
                <h3>Feedback</h3>
                <p>{evaluation.feedback}</p>
              </div>
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div className="evaluation-strengths">
                  <h4>✅ Strengths</h4>
                  <ul>
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                <div className="evaluation-weaknesses">
                  <h4>⚠️ Areas to Improve</h4>
                  <ul>
                    {evaluation.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="interview-actions">
          {!submitted ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleGetHint}
                disabled={loading}
              >
                💡 Get Hint
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Answer'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleSkipQuestion}
                disabled={loading}
              >
                Skip
              </button>
            </>
          ) : (
            <>
              {currentIndex + 1 < interview.questionCount ? (
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  disabled={loading}
                >
                  Next Question
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleEndInterview}
                  disabled={loading}
                >
                  Finish Interview
                </button>
              )}
            </>
          )}
          <button
            className="btn btn-danger"
            onClick={handleEndInterview}
            disabled={loading}
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Hint Display */}
      {showHint && hint && (
        <div className="hint-popup">
          <div className="hint-content">
            <h3>Hint 💡</h3>
            <p>{hint}</p>
            <button
              className="btn btn-small"
              onClick={() => setShowHint(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPracticePage;
