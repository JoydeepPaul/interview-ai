import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import api from '../services/api';
import '../styles/results.css';

const InterviewResultsPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${interviewId}`);
        if (response.data.success) {
          setInterview(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching interview results:', error);
        alert('Failed to load results');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId, navigate]);

  if (loading) {
    return (
      <div className="results-loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!interview) {
    return <div className="results-error">Interview not found</div>;
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const scorePercentage = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <h1>🎉 Interview Complete!</h1>
        <p className="subtitle">{interview.topic} - {interview.difficulty}</p>
      </div>

      {/* Score Summary */}
      <div className="score-summary">
        <div className="score-card">
          <div className="score-value">
            <span className={`score ${scorePercentage(interview.overallScore)}`}>
              {interview.overallScore}
            </span>
            <span className="score-unit">/100</span>
          </div>
          <div className="score-label">Overall Score</div>
        </div>

        <div className="score-card">
          <div className="score-value">
            <span className={`score ${scorePercentage(interview.overallAccuracy)}`}>
              {interview.overallAccuracy}%
            </span>
          </div>
          <div className="score-label">Accuracy</div>
        </div>

        <div className="score-card">
          <div className="score-value">
            <span className="score">{interview.userAnswers.length}/{interview.questionCount}</span>
          </div>
          <div className="score-label">Questions Answered</div>
        </div>

        <div className="score-card">
          <div className="score-value">
            <span className="score">{formatDuration(interview.totalDuration)}</span>
          </div>
          <div className="score-label">Total Duration</div>
        </div>
      </div>

      {/* AI Feedback */}
      {interview.aiAnalysis && (
        <div className="ai-feedback-section">
          <h2>📊 AI Analysis</h2>
          <div className="feedback-content">
            <div className="analysis-summary">
              <p className="analysis-text">{interview.aiAnalysis.overallAnalysis}</p>
            </div>

            <div className="analysis-grid">
              {interview.aiAnalysis.strengths && (
                <div className="analysis-card strengths">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {interview.aiAnalysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interview.aiAnalysis.weaknesses && (
                <div className="analysis-card weaknesses">
                  <h3>⚠️ Needs Improvement</h3>
                  <ul>
                    {interview.aiAnalysis.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {interview.aiAnalysis.improvements && (
              <div className="improvements-section">
                <h3>📚 Recommended Next Steps</h3>
                <ol>
                  {interview.aiAnalysis.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Results */}
      <div className="detailed-results">
        <h2>Question-by-Question Breakdown</h2>
        <div className="results-list">
          {interview.scores.map((score, index) => (
            <div key={index} className={`result-item ${scorePercentage(score.score)}`}>
              <div className="result-header">
                <h4>Question {index + 1}</h4>
                <span className="result-score">{score.score}/100</span>
              </div>
              <p className="result-feedback">{score.feedback}</p>
              {score.aiEvaluation?.suggestions && (
                <div className="result-suggestions">
                  <strong>Suggestions:</strong>
                  <ul>
                    {score.aiEvaluation.suggestions.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/interview-start?topic=${interview.topic}`)}
        >
          Retake Interview
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
        >
          View Dashboard
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/interview-history')}
        >
          Interview History
        </button>
      </div>
    </div>
  );
};

export default InterviewResultsPage;
