import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './StreakQuestionManager.css';

const StreakQuestionManager = () => {
  const [streakQuestions, setStreakQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedQuestions, setGroupedQuestions] = useState({});

  useEffect(() => {
    fetchStreakQuestions();
  }, []);

  const fetchStreakQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${window.API_BASE_URL}/api/streak/admin/questions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch streak questions');
      }

      const data = await response.json();
      setStreakQuestions(data);
      
      // Group questions by date
      const grouped = data.reduce((acc, question) => {
        const date = new Date(question.activeDate).toLocaleDateString('en-GB');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(question);
        return acc;
      }, {});
      
      setGroupedQuestions(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streak questions:', error);
      toast.error('Failed to load streak questions');
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/streak/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      toast.success('Question deleted successfully');
      fetchStreakQuestions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteAllForDate = async (date) => {
    if (!window.confirm(`Are you sure you want to delete ALL questions for ${date}?`)) {
      return;
    }

    try {
      // Convert from DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = date.split('/');
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch(`${window.API_BASE_URL}/api/streak/admin/questions?date=${dateStr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete questions');
      }

      const result = await response.json();
      toast.success(result.message || 'Questions deleted successfully');
      fetchStreakQuestions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting questions:', error);
      toast.error('Failed to delete questions');
    }
  };

  if (loading) {
    return (
      <div className="streak-manager-loading">
        <div className="spinner"></div>
        <p>Loading streak questions...</p>
      </div>
    );
  }

  if (streakQuestions.length === 0) {
    return (
      <div className="streak-manager-empty">
        <h3>📭 No Streak Questions Yet</h3>
        <p>Upload questions via "Upload Questions" tab to auto-publish them to today's streak,</p>
        <p>or use the form below to manually add daily questions.</p>
      </div>
    );
  }

  return (
    <div className="streak-question-manager">
      <div className="manager-header">
        <h2>🗓️ Streak Questions Management</h2>
        <p className="manager-subtitle">View and manage all published streak questions by date</p>
      </div>

      <div className="questions-by-date">
        {Object.keys(groupedQuestions).sort((a, b) => {
          const [dayA, monthA, yearA] = a.split('/');
          const [dayB, monthB, yearB] = b.split('/');
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB - dateA; // Most recent first
        }).map(date => (
          <div key={date} className="date-group">
            <div className="date-header">
              <h3>📅 {date}</h3>
              <button 
                className="delete-all-btn"
                onClick={() => handleDeleteAllForDate(date)}
              >
                🗑️ Delete All for {date}
              </button>
            </div>

            <div className="questions-table-container">
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Question Title</th>
                    <th>Test Cases</th>
                    <th>Users Solved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedQuestions[date].sort((a, b) => a.level - b.level).map(question => (
                    <tr key={question._id}>
                      <td>
                        <span className={`level-badge level-${question.level}`}>
                          {question.level}️⃣ {question.levelName}
                        </span>
                      </td>
                      <td>
                        <div className="question-title-cell">
                          <strong>{question.title}</strong>
                          <p className="question-description-preview">
                            {question.description.substring(0, 80)}...
                          </p>
                        </div>
                      </td>
                      <td className="text-center">
                        {question.testCases?.length || 0}
                      </td>
                      <td className="text-center">
                        <span className="solved-count">
                          {question.solvedBy?.length || 0} users
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteQuestion(question._id)}
                          title="Delete this question"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="manager-footer">
        <p className="info-text">
          💡 <strong>Tip:</strong> Upload 5+ questions via "Upload Questions" tab to auto-publish them to today's streak.
        </p>
      </div>
    </div>
  );
};

export default StreakQuestionManager;
