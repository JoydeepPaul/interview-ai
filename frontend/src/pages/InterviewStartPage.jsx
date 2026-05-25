import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import api from '../services/api';
import '../styles/interview-start.css';

const InterviewStartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [topic, setTopic] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [useResume, setUseResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  const topics = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'SQL',
    'System Design',
    'HTML/CSS',
    'General'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/interviews/start', {
        topic,
        difficulty,
        questionCount,
        useResume
      });

      if (response.data.success) {
        navigate(`/interview/${response.data.data.interviewId}`);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setError(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-start-container">
      <div className="start-card">
        <div className="start-header">
          <h1>🎯 Start Interview Practice</h1>
          <p>Choose your topic and difficulty level</p>
        </div>

        <form onSubmit={handleStartInterview} className="start-form">
          {error && <div className="error-message">{error}</div>}

          {/* Topic Selection */}
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            >
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Selection */}
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <div className="difficulty-selector">
              {difficulties.map(d => (
                <button
                  key={d}
                  type="button"
                  className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === 'Easy' && '⭐'}
                  {d === 'Medium' && '⭐⭐'}
                  {d === 'Hard' && '⭐⭐⭐'}
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="form-group">
            <label htmlFor="questionCount">Number of Questions</label>
            <input
              id="questionCount"
              type="range"
              min="5"
              max="20"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
            <span className="range-value">{questionCount} questions</span>
          </div>

          {/* Use Resume Checkbox */}
          <div className="form-group checkbox">
            <input
              id="useResume"
              type="checkbox"
              checked={useResume}
              onChange={(e) => setUseResume(e.target.checked)}
            />
            <label htmlFor="useResume">Use my resume for context (if available)</label>
          </div>

          {/* Info Cards */}
          <div className="info-grid">
            <div className="info-card">
              <span className="info-icon">⏱️</span>
              <div>
                <strong>Time per Question</strong>
                <p>~{Math.round((300 / questionCount) * questionCount) / 60} minutes</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🎓</span>
              <div>
                <strong>Level</strong>
                <p>{difficulty} Difficulty</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">📊</span>
              <div>
                <strong>Get Feedback</strong>
                <p>AI-powered evaluation</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="start-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Starting...' : '🚀 Start Interview'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Back to Dashboard
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="tips-section">
          <h3>💡 Tips for Success</h3>
          <ul>
            <li>Read each question carefully before answering</li>
            <li>Take your time - there's no rush</li>
            <li>You can ask for hints if you're stuck</li>
            <li>Explain your thinking process</li>
            <li>Include code examples where applicable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewStartPage;
