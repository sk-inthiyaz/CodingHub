import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "./UserStreakQuestionCard.css";

const UserStreakQuestionCard = () => {
  const [todayQuestion, setTodayQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayQuestion();
    fetchUserStats();
  }, []);

  const fetchTodayQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view today\'s question');
      }
      const response = await fetch(`${window.API_BASE_URL}/api/streak/today`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        // No question published for today — show friendly empty state instead of an error
        setTodayQuestion(null);
        setError(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to fetch today\'s question');
      }

      const data = await response.json();
      setTodayQuestion(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/streak/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err?.message || 'Failed to load user stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      toast.error('Unable to load user stats');
    }
  };

  const handleStartSolving = () => {
    if (!todayQuestion?.question?._id) {
      toast('Question not ready yet, try again shortly');
      return;
    }
    navigate('/streak/solve', { state: todayQuestion });
  };

  if (loading) {
    return (
      <div className="streak-card loading">
        <div className="spinner"></div>
        <p>Loading today's challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="streak-card error">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <p>Please make sure you're logged in.</p>
      </div>
    );
  }

  if (!todayQuestion || !todayQuestion.question) {
    return (
      <div className="streak-card no-question">
        <h3>📅 No Question Available</h3>
        <p>Check back tomorrow for a new challenge!</p>
        {userStats && (
          <div className="stats-preview">
            <p>🔥 Current Streak: <strong>{userStats.streak.current} days</strong></p>
            <p>🏆 Level: <strong>{userStats.level} - {userStats.levelName}</strong></p>
          </div>
        )}
      </div>
    );
  }

  const { question, alreadySolved, levelName, currentStreak } = todayQuestion;

  return (
    <div className="streak-card">
      <div className="streak-header">
        <h2>🧩 Today's Challenge</h2>
        <span className={`level-badge level-${levelName.toLowerCase()}`}>
          {levelName}
        </span>
      </div>

      <div className="question-preview">
        <h3>{question.title}</h3>
        <p className="question-description">
          {question.description.substring(0, 150)}
          {question.description.length > 150 && '...'}
        </p>
      </div>

      <div className="streak-info">
        <div className="info-item">
          <span className="icon">🔥</span>
          <div>
            <p className="label">Current Streak</p>
            <p className="value">{currentStreak} days</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">🎯</span>
          <div>
            <p className="label">Test Cases</p>
            <p className="value">{question.testCases.length}</p>
          </div>
        </div>
      </div>

      {alreadySolved ? (
        <div className="already-solved">
          <p>✅ You've already solved today's question!</p>
          <p className="small">Come back tomorrow for a new challenge</p>
        </div>
      ) : (
        <button className="start-btn" onClick={handleStartSolving}>
          Start Solving 🚀
        </button>
      )}

      {question.hints && question.hints.length > 0 && (
        <p className="hint-available">💡 {question.hints.length} hints available</p>
      )}
    </div>
  );
};

export default UserStreakQuestionCard;
