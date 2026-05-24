import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './StreakStatusCard.css';

const StreakStatusCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/streak/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err?.message || 'Failed to load streak stats');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      toast.error('Unable to load streak stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="streak-status loading">Loading stats...</div>;
  if (!stats) return <div className="streak-status error">Unable to load stats</div>;

  const getLevelProgress = () => {
    const daysInLevel = stats.streak.current % 7;
    const progressPercent = (daysInLevel / 7) * 100;
    return { daysInLevel, progressPercent };
  };

  const { daysInLevel, progressPercent } = getLevelProgress();

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: 'Easy User', icon: '1️⃣', color: '#4CAF50', nextLevel: 'Mid User' },
      2: { name: 'Mid User', icon: '2️⃣', color: '#2196F3', nextLevel: 'Mid-Easy User' },
      3: { name: 'Mid-Easy User', icon: '3️⃣', color: '#FF9800', nextLevel: 'Hard User' },
      4: { name: 'Hard User', icon: '4️⃣', color: '#F44336', nextLevel: 'Pro User' },
      5: { name: 'Pro User', icon: '5️⃣', color: '#9C27B0', nextLevel: 'Max Level!' }
    };
    return levels[level] || levels[1];
  };

  const currentLevelInfo = getLevelInfo(stats.level);

  return (
    <div className="streak-status-card">
      <div className="stats-header">
        <h2>Your Streak Stats</h2>
        <span className="user-name">{stats.name}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <p className="stat-label">Current Streak</p>
            <p className="stat-value">{stats.streak.current} days</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <p className="stat-label">Longest Streak</p>
            <p className="stat-value">{stats.streak.longest} days</p>
          </div>
        </div>
        <div className="stat-box" style={{ borderColor: currentLevelInfo.color }}>
          <div className="stat-icon">{currentLevelInfo.icon}</div>
          <div className="stat-content">
            <p className="stat-label">Level</p>
            <p className="stat-value">{stats.levelName}</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Questions Solved</p>
            <p className="stat-value">{stats.totalSolved}</p>
          </div>
        </div>
      </div>

      {stats.level < 5 && (
        <div className="level-progress">
          <div className="progress-header">
            <h3>Progress to {currentLevelInfo.nextLevel}</h3>
            <span>{daysInLevel} / 7 days</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%`, backgroundColor: currentLevelInfo.color }}></div>
          </div>
          <p className="progress-text">Keep solving! {7 - daysInLevel} more day{7 - daysInLevel !== 1 ? 's' : ''} to level up!</p>
        </div>
      )}

      {stats.badges && stats.badges.length > 0 && (
        <div className="badges-section">
          <h3>🏅 Badges Earned</h3>
          <div className="badges-grid">
            {stats.badges.map((badge, index) => (
              <div key={index} className={`badge badge-${badge.type}`}>
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

      {stats.streak.lastQuestionDate && (
        <div className="last-activity">
          <p>Last solved: {new Date(stats.streak.lastQuestionDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default StreakStatusCard;
