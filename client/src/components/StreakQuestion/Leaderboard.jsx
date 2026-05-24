import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Leaderboard.css';

const Leaderboard = ({ embedMode = false, limit = 10 }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${window.API_BASE_URL}/api/streak/leaderboard`);
        const data = await res.json();
        const limited = embedMode ? (Array.isArray(data) ? data.slice(0, limit) : []) : (Array.isArray(data) ? data : []);
        setRows(limited);
      } catch (e) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [embedMode, limit]);

  if (loading) return <div className="leaderboard-loading">Loading...</div>;

  if (embedMode) {
    return (
      <div className="leaderboard-embed">
        {rows.length === 0 ? (
          <p className="no-data">No streak data yet</p>
        ) : (
          <div className="leaderboard-table-embed">
            {rows.map((r, idx) => (
              <div key={idx} className="leaderboard-row-embed">
                <div className="rank-badge">{r.rank}</div>
                <div className="user-info">
                  <div className="user-name">{r.name}</div>
                  <div className="user-meta">
                    <span>🔥 {r.currentStreak}</span>
                    <span className="level-tag">{r.levelName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="leaderboard-full">
      <div className="leaderboard-header">
        <h1>🏆 Streak Leaderboard</h1>
        <Link to="/streak" className="back-link">← Back to Streak</Link>
      </div>
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="th">Rank</div>
          <div className="th">Name</div>
          <div className="th">Current Streak</div>
          <div className="th">Longest Streak</div>
          <div className="th">Level</div>
          <div className="th">Badges</div>
        </div>
        <div className="table-body">
          {rows.map((r) => (
            <div key={r.rank} className="table-row">
              <div className="td rank">{r.rank}</div>
              <div className="td">{r.name}</div>
              <div className="td">🔥 {r.currentStreak}</div>
              <div className="td">🏆 {r.longestStreak}</div>
              <div className="td">{r.levelName}</div>
              <div className="td">🏅 {r.badges}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
