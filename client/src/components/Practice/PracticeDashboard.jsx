import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Practice.css';
import leftArrowIcon from '../images/left-arrow (1).png';

const PracticeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your progress...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <h2>Unable to load statistics</h2>
        <Link to="/practice/problems" className="btn-submit" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
          Start Solving Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="practice-header">
        <div className="problems-list-header">
          <button 
            className="back-button-icon" 
            onClick={() => navigate('/LearnHub')}
            title="Back to LearnHub"
          >
            <img src={leftArrowIcon} alt="Back" />
          </button>
          <h1>📊 My Practice Progress</h1>
        </div>
        <p style={{ marginTop: '0.5rem' }}>Track your coding journey and celebrate your achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Total Solved */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total Solved</h3>
            <span className="stat-card-icon">🎯</span>
          </div>
          <div className="stat-card-value">{stats.totalSolved || 0}</div>
          <div className="stat-card-label">Problems Completed</div>
          
          <div className="difficulty-breakdown">
            <div className="difficulty-stat" style={{ background: '#d1fae5' }}>
              <span className="difficulty-stat-number" style={{ color: '#065f46' }}>
                {stats.difficultyStats?.Easy || 0}
              </span>
              <span className="difficulty-stat-label">Easy</span>
            </div>
            <div className="difficulty-stat" style={{ background: '#fed7aa' }}>
              <span className="difficulty-stat-number" style={{ color: '#9a3412' }}>
                {stats.difficultyStats?.Medium || 0}
              </span>
              <span className="difficulty-stat-label">Medium</span>
            </div>
            <div className="difficulty-stat" style={{ background: '#fecaca' }}>
              <span className="difficulty-stat-number" style={{ color: '#991b1b' }}>
                {stats.difficultyStats?.Hard || 0}
              </span>
              <span className="difficulty-stat-label">Hard</span>
            </div>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total Attempts</h3>
            <span className="stat-card-icon">📝</span>
          </div>
          <div className="stat-card-value">{stats.totalSubmissions || 0}</div>
          <div className="stat-card-label">Code Submissions</div>
        </div>

        {/* Success Rate */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Success Rate</h3>
            <span className="stat-card-icon">✨</span>
          </div>
          <div className="stat-card-value">
            {stats.totalSubmissions > 0
              ? ((stats.totalSolved / stats.totalSubmissions) * 100).toFixed(1)
              : 0}%
          </div>
          <div className="stat-card-label">Acceptance Rate</div>
        </div>
      </div>

      {/* Recent Solved Problems */}
      {stats.recentSolved && stats.recentSolved.length > 0 && (
        <div className="recent-activity">
          <h2>🏆 Recently Solved</h2>
          <ul className="activity-list">
            {stats.recentSolved.map((item, idx) => (
              <li key={idx} className="activity-item">
                <div className="activity-info">
                  <h4>{item.title}</h4>
                  <div className="activity-meta">
                    <span className={`difficulty-badge ${item.difficulty}`}>
                      {item.difficulty}
                    </span>
                    <span>{item.language}</span>
                    <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link 
                  to={`/practice/problems/${item.problemId}`}
                  className="btn-run"
                  style={{ 
                    textDecoration: 'none', 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.85rem',
                    background: 'transparent',
                    color: '#667eea',
                    border: '2px solid #667eea'
                  }}
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission History */}
      {stats.submissionHistory && stats.submissionHistory.length > 0 && (
        <div className="recent-activity" style={{ marginTop: '2rem' }}>
          <h2>📜 Submission History</h2>
          <ul className="activity-list">
            {stats.submissionHistory.map((sub, idx) => (
              <li key={idx} className="activity-item">
                <div className="activity-info">
                  <h4>{sub.problemId?.title || 'Problem'}</h4>
                  <div className="activity-meta">
                    <span className={`difficulty-badge ${sub.status === 'accepted' ? 'Easy' : 'Hard'}`} style={{ fontSize: '0.75rem' }}>
                      {sub.status}
                    </span>
                    <span className={`difficulty-badge ${sub.problemId?.difficulty}`}>
                      {sub.problemId?.difficulty}
                    </span>
                    <span>{sub.language}</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {sub.executionTime && (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    ⏱️ {sub.executionTime}ms
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty State */}
      {(!stats.recentSolved || stats.recentSolved.length === 0) && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px', marginTop: '2rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</p>
          <h3 style={{ marginBottom: '1rem' }}>Start Your Coding Journey!</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Solve your first problem and track your progress here
          </p>
          <Link 
            to="/practice/problems" 
            className="btn-submit" 
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Browse Problems
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link 
          to="/practice/problems" 
          className="btn-submit" 
          style={{ textDecoration: 'none' }}
        >
          📚 All Problems
        </Link>
        <Link 
          to="/practice/editor" 
          className="btn-run" 
          style={{ textDecoration: 'none', background: '#10b981', color: 'white' }}
        >
          💻 Code Editor
        </Link>
      </div>
    </div>
  );
};

export default PracticeDashboard;
