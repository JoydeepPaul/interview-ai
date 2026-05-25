import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import api from '../services/api';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [topicPerformance, setTopicPerformance] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [summaryRes, topicsRes, historyRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/topics'),
          api.get('/interviews?limit=5')
        ]);

        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (topicsRes.data.success) setTopicPerformance(topicsRes.data.data);
        if (historyRes.data.success) setRecentInterviews(historyRes.data.data.interviews);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>👋 Welcome, {user?.username}!</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/interview-start')}
        >
          🚀 Start New Interview
        </button>
      </div>

      {/* Stats Grid */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{summary.totalInterviews}</div>
              <div className="stat-label">Total Interviews</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{summary.avgScore}</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{summary.avgAccuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">{summary.totalDuration}</div>
              <div className="stat-label">Total Minutes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{summary.topicsCovered}</div>
              <div className="stat-label">Topics Covered</div>
            </div>
          </div>

          {summary.bestTopic && (
            <div className="stat-card highlight">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{summary.bestTopic.score}</div>
                <div className="stat-label">Best: {summary.bestTopic.topic}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance by Topic */}
      {topicPerformance.length > 0 && (
        <div className="performance-section">
          <h2>📈 Performance by Topic</h2>
          <div className="topic-list">
            {topicPerformance.map((topic, index) => (
              <div key={index} className="topic-item">
                <div className="topic-header">
                  <h3>{topic.topic}</h3>
                  <span className="topic-attempts">{topic.attempts} attempts</span>
                </div>
                <div className="topic-stats">
                  <div className="stat">
                    <span className="label">Average</span>
                    <span className="value">{topic.avgScore}/100</span>
                  </div>
                  <div className="stat">
                    <span className="label">High</span>
                    <span className="value">{topic.highestScore}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Low</span>
                    <span className="value">{topic.lowestScore}</span>
                  </div>
                  <div className={`stat trend ${topic.accuracyTrend > 0 ? 'positive' : 'negative'}`}>
                    <span className="label">Trend</span>
                    <span className="value">
                      {topic.accuracyTrend > 0 ? '📈' : '📉'} {Math.abs(topic.accuracyTrend)}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${topic.avgScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Interviews */}
      {recentInterviews.length > 0 && (
        <div className="recent-section">
          <h2>📅 Recent Interviews</h2>
          <div className="recent-list">
            {recentInterviews.map((interview) => (
              <div key={interview._id} className="recent-item">
                <div className="recent-header">
                  <h3>{interview.topic}</h3>
                  <span className="recent-score">{interview.overallScore}/100</span>
                </div>
                <div className="recent-details">
                  <span className="difficulty">{interview.difficulty}</span>
                  <span className="date">
                    {new Date(interview.completedAt).toLocaleDateString()}
                  </span>
                  <span className="duration">
                    {Math.floor(interview.totalDuration / 60)}m
                  </span>
                </div>
                <button
                  className="btn btn-small"
                  onClick={() => navigate(`/interview-results/${interview._id}`)}
                >
                  View Results
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/interview-history')}
          >
            View All Interviews →
          </button>
        </div>
      )}

      {/* Empty State */}
      {summary && summary.totalInterviews === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h2>No Interviews Yet</h2>
          <p>Start your first interview to begin practicing and tracking your progress!</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/interview-start')}
          >
            Start Your First Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
