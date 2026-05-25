import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import api from '../services/api';
import '../styles/history.css';

const InterviewHistoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ topic: '', difficulty: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchInterviews();
  }, [filter, page]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: 10,
        skip: (page - 1) * 10,
        ...(filter.topic && { topic: filter.topic }),
        ...(filter.difficulty && { difficulty: filter.difficulty })
      });

      const response = await api.get(`/interviews?${params}`);
      if (response.data.success) {
        setInterviews(response.data.data.interviews);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      alert('Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>📅 Interview History</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/interview-start')}
        >
          Start New Interview
        </button>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <select
          value={filter.topic}
          onChange={(e) => {
            setFilter({ ...filter, topic: e.target.value });
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Topics</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="SQL">SQL</option>
          <option value="System Design">System Design</option>
        </select>

        <select
          value={filter.difficulty}
          onChange={(e) => {
            setFilter({ ...filter, difficulty: e.target.value });
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilter({ topic: '', difficulty: '' });
            setPage(1);
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* History List */}
      {loading ? (
        <div className="history-loading">
          <div className="spinner"></div>
          <p>Loading interviews...</p>
        </div>
      ) : interviews.length > 0 ? (
        <div className="history-list">
          <table className="history-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Score</th>
                <th>Accuracy</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id} className="history-row">
                  <td className="topic">{interview.topic}</td>
                  <td className="difficulty">{interview.difficulty}</td>
                  <td className={`score ${getScoreClass(interview.overallScore)}`}>
                    {interview.overallScore}
                  </td>
                  <td className="accuracy">
                    {interview.overallAccuracy}%
                  </td>
                  <td className="questions">
                    {interview.userAnswers.length}/{interview.questionCount}
                  </td>
                  <td className="duration">
                    {formatDuration(interview.totalDuration)}
                  </td>
                  <td className="date">
                    {formatDate(interview.completedAt)}
                  </td>
                  <td className="action">
                    <button
                      className="btn btn-small"
                      onClick={() => navigate(`/interview-results/${interview._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="history-empty">
          <div className="empty-icon">📭</div>
          <h2>No Interviews Yet</h2>
          <p>Start your first interview to see your history!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/interview-start')}
          >
            Start First Interview
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && interviews.length > 0 && (
        <div className="history-pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(page + 1)}
            disabled={interviews.length < 10}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewHistoryPage;
