import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import leftArrowIcon from '../images/left-arrow (1).png';
import './ProgressTrackerPage.css';

const ProgressTrackerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: null,
    practice: null,
    learning: null
  });

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch Streak Stats
      const streakRes = await fetch(`${window.API_BASE_URL}/api/streak/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const streakData = streakRes.ok ? await streakRes.json() : null;

      // Fetch Practice Stats
      const practiceRes = await fetch(`${window.API_BASE_URL}/api/practice/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const practiceData = practiceRes.ok ? await practiceRes.json() : null;

      // Fetch Streak History
      const historyRes = await fetch(`${window.API_BASE_URL}/api/streak/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyData = historyRes.ok ? await historyRes.json() : null;

      // Get learning progress from localStorage
      const learningProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');

      setStats({
        streak: { ...streakData, history: historyData?.items || [] },
        practice: practiceData,
        learning: learningProgress
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const calculateLearningStats = () => {
    if (!stats.learning || Object.keys(stats.learning).length === 0) {
      return { totalCompleted: 0, totalTopics: 0, percentage: 0, byLanguage: {} };
    }

    const byLanguage = {};
    let totalCompleted = 0;

    Object.entries(stats.learning).forEach(([key, value]) => {
      const [lang] = key.split('-');
      if (!byLanguage[lang]) {
        byLanguage[lang] = { completed: 0, total: 0 };
      }
      byLanguage[lang].total++;
      if (value.completed) {
        byLanguage[lang].completed++;
        totalCompleted++;
      }
    });

    const totalTopics = Object.keys(stats.learning).length;
    const percentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

    return { totalCompleted, totalTopics, percentage, byLanguage };
  };

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: 'Easy User', icon: '1️⃣', color: '#4CAF50' },
      2: { name: 'Mid User', icon: '2️⃣', color: '#2196F3' },
      3: { name: 'Mid-Easy User', icon: '3️⃣', color: '#FF9800' },
      4: { name: 'Hard User', icon: '4️⃣', color: '#F44336' },
      5: { name: 'Pro User', icon: '5️⃣', color: '#9C27B0' }
    };
    return levels[level] || levels[1];
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#4CAF50',
      'Medium': '#FF9800',
      'Hard': '#F44336'
    };
    return colors[difficulty] || '#757575';
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const learningStats = calculateLearningStats();

  if (loading) {
    return (
      <div className="progress-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <div className="header-top">
          <div className="header-content">
            <h1>📊 Your Progress Dashboard</h1>
            <p>Track your learning journey across all platforms</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="overview-card total-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Total Achievements</h3>
            <p className="big-number">
              {(stats.streak?.totalSolved || 0) + (stats.practice?.totalSolved || 0) + learningStats.totalCompleted}
            </p>
            <span className="label">Problems & Topics Completed</span>
          </div>
        </div>

        <div className="overview-card streak-card">
          <div className="card-icon">🔥</div>
          <div className="card-content">
            <h3>Current Streak</h3>
            <p className="big-number">{stats.streak?.streak?.current || 0}</p>
            <span className="label">Days Active</span>
          </div>
        </div>

        <div className="overview-card practice-card">
          <div className="card-icon">💻</div>
          <div className="card-content">
            <h3>Practice Problems</h3>
            <p className="big-number">{stats.practice?.totalSolved || 0}</p>
            <span className="label">Problems Solved</span>
          </div>
        </div>

        <div className="overview-card learning-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Learning Topics</h3>
            <p className="big-number">{learningStats.totalCompleted}</p>
            <span className="label">Topics Mastered</span>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="progress-sections">
        {/* Streak Section */}
        <div className="section streak-section">
          <div className="section-header">
            <h2>🔥 Daily Streak Progress</h2>
            <button className="view-btn" onClick={() => navigate('/streak')}>
              View Details →
            </button>
          </div>

          <div className="section-content">
            {stats.streak ? (
              <>
                <div className="streak-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-bg" style={{ background: getLevelInfo(stats.streak.level).color }}>
                      {getLevelInfo(stats.streak.level).icon}
                    </div>
                    <div className="stat-details">
                      <h4>Current Level</h4>
                      <p className="stat-value">{getLevelInfo(stats.streak.level).name}</p>
                      <span className="stat-subtitle">Level {stats.streak.level}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-bg" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}>
                      🔥
                    </div>
                    <div className="stat-details">
                      <h4>Current Streak</h4>
                      <p className="stat-value">{stats.streak.streak?.current || 0} days</p>
                      <span className="stat-subtitle">Keep it going!</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-bg" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>
                      🏆
                    </div>
                    <div className="stat-details">
                      <h4>Longest Streak</h4>
                      <p className="stat-value">{stats.streak.streak?.longest || 0} days</p>
                      <span className="stat-subtitle">Personal Best</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-bg" style={{ background: 'linear-gradient(135deg, #11998E, #38EF7D)' }}>
                      ✅
                    </div>
                    <div className="stat-details">
                      <h4>Problems Solved</h4>
                      <p className="stat-value">{stats.streak.totalSolved || 0}</p>
                      <span className="stat-subtitle">Daily challenges</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                {stats.streak.badges && stats.streak.badges.length > 0 && (
                  <div className="badges-container">
                    <h3>🏅 Earned Badges</h3>
                    <div className="badges-grid">
                      {stats.streak.badges.map((badge, idx) => (
                        <div key={idx} className={`badge-item ${badge.type}`}>
                          <span className="badge-icon">
                            {badge.type === 'bronze' && '🥉'}
                            {badge.type === 'silver' && '🥈'}
                            {badge.type === 'gold' && '🥇'}
                            {badge.type === 'diamond' && '💎'}
                          </span>
                          <span className="badge-name">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Streak Activity */}
                {stats.streak.history && stats.streak.history.length > 0 && (
                  <div className="recent-activity">
                    <h3>📅 Recent Activity</h3>
                    <div className="activity-list">
                      {stats.streak.history.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="activity-item">
                          <div className="activity-date">{formatDate(item.completedAt)}</div>
                          <div className="activity-details">
                            <h4>{item.questionId?.title || 'Streak Question'}</h4>
                            <span className="activity-language">{item.language}</span>
                          </div>
                          <div className="activity-status">✅</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>Start your streak journey today!</p>
                <button className="start-btn" onClick={() => navigate('/streak')}>
                  Start Daily Challenge
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Practice Problems Section */}
        <div className="section practice-section">
          <div className="section-header">
            <h2>💻 Practice Problems</h2>
            <button className="view-btn" onClick={() => navigate('/practice')}>
              View All →
            </button>
          </div>

          <div className="section-content">
            {stats.practice ? (
              <>
                <div className="practice-overview">
                  <div className="progress-ring-container">
                    <svg className="progress-ring" width="160" height="160">
                      <circle
                        className="progress-ring-bg"
                        cx="80"
                        cy="80"
                        r="70"
                      />
                      <circle
                        className="progress-ring-fill"
                        cx="80"
                        cy="80"
                        r="70"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 70}`,
                          strokeDashoffset: `${2 * Math.PI * 70 * (1 - (stats.practice.totalSolved / 100))}`
                        }}
                      />
                      <text x="80" y="85" className="progress-text">
                        {stats.practice.totalSolved}
                      </text>
                      <text x="80" y="105" className="progress-label">
                        Solved
                      </text>
                    </svg>
                  </div>

                  <div className="difficulty-breakdown">
                    <h4>By Difficulty</h4>
                    <div className="difficulty-stats">
                      <div className="difficulty-item">
                        <div className="difficulty-header">
                          <span className="difficulty-label easy">Easy</span>
                          <span className="difficulty-count">
                            {stats.practice.difficultyStats?.Easy || 0}
                          </span>
                        </div>
                        <div className="difficulty-bar">
                          <div 
                            className="difficulty-fill easy"
                            style={{ width: `${(stats.practice.difficultyStats?.Easy || 0) / Math.max(stats.practice.totalSolved, 1) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="difficulty-item">
                        <div className="difficulty-header">
                          <span className="difficulty-label medium">Medium</span>
                          <span className="difficulty-count">
                            {stats.practice.difficultyStats?.Medium || 0}
                          </span>
                        </div>
                        <div className="difficulty-bar">
                          <div 
                            className="difficulty-fill medium"
                            style={{ width: `${(stats.practice.difficultyStats?.Medium || 0) / Math.max(stats.practice.totalSolved, 1) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="difficulty-item">
                        <div className="difficulty-header">
                          <span className="difficulty-label hard">Hard</span>
                          <span className="difficulty-count">
                            {stats.practice.difficultyStats?.Hard || 0}
                          </span>
                        </div>
                        <div className="difficulty-bar">
                          <div 
                            className="difficulty-fill hard"
                            style={{ width: `${(stats.practice.difficultyStats?.Hard || 0) / Math.max(stats.practice.totalSolved, 1) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {stats.practice.recentSolved && stats.practice.recentSolved.length > 0 && (
                  <div className="recent-solved">
                    <h3>🎯 Recently Solved</h3>
                    <div className="solved-list">
                      {stats.practice.recentSolved.slice(0, 5).map((problem, idx) => (
                        <div key={idx} className="solved-item">
                          <div className="solved-icon" style={{ background: getDifficultyColor(problem.difficulty) }}>
                            {problem.difficulty?.[0]}
                          </div>
                          <div className="solved-details">
                            <h4>{problem.title}</h4>
                            <span className="solved-date">{formatDate(problem.submittedAt)}</span>
                          </div>
                          <span className={`solved-difficulty ${problem.difficulty?.toLowerCase()}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>No practice problems solved yet!</p>
                <button className="start-btn" onClick={() => navigate('/practice/problems')}>
                  Start Practicing
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Topics Section */}
        <div className="section learning-section">
          <div className="section-header">
            <h2>📚 Learning Topics</h2>
            <button className="view-btn" onClick={() => navigate('/learnhub/topics')}>
              View All →
            </button>
          </div>

          <div className="section-content">
            {learningStats.totalTopics > 0 ? (
              <>
                <div className="learning-overview">
                  <div className="overall-progress">
                    <h4>Overall Progress</h4>
                    <div className="circular-progress">
                      <svg width="120" height="120">
                        <circle cx="60" cy="60" r="50" className="circle-bg" />
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          className="circle-progress"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 50}`,
                            strokeDashoffset: `${2 * Math.PI * 50 * (1 - learningStats.percentage / 100)}`
                          }}
                        />
                      </svg>
                      <div className="progress-percentage">{learningStats.percentage}%</div>
                    </div>
                    <p className="progress-stats">
                      {learningStats.totalCompleted} / {learningStats.totalTopics} topics completed
                    </p>
                  </div>

                  <div className="language-progress">
                    <h4>Progress by Language</h4>
                    <div className="language-list">
                      {Object.entries(learningStats.byLanguage).map(([lang, data]) => {
                        const percentage = Math.round((data.completed / data.total) * 100);
                        return (
                          <div key={lang} className="language-item">
                            <div className="language-header">
                              <span className="language-name">{lang}</span>
                              <span className="language-stats">
                                {data.completed}/{data.total}
                              </span>
                            </div>
                            <div className="language-bar">
                              <div 
                                className="language-fill"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="language-percentage">{percentage}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Start learning programming fundamentals!</p>
                <button className="start-btn" onClick={() => navigate('/learnhub/topics')}>
                  Explore Topics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerPage;
