import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import StreakQuestionManager from '../StreakQuestion/StreakQuestionManager';
import '../pages/AdminDashboard.css';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [jsonPreview, setJsonPreview] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'streak'
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeUsers: 0,
    longestStreak: 0
  });

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/streak/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalQuestions: data.totalQuestions || 0,
          activeUsers: data.activeUsers || 0,
          longestStreak: data.topStreaker?.streak || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/questions/questions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Accept both shapes: { questions: [...] } OR [ ... ]
      let normalized = null;
      if (json && Array.isArray(json.questions)) {
        normalized = { questions: json.questions };
      } else if (Array.isArray(json)) {
        normalized = { questions: json };
      } else {
        throw new Error('JSON must contain a questions array');
      }

      // Validate each question - support both formats (regular or streak)
      normalized.questions.forEach((question, index) => {
        // Check required common fields
        if (!question.title || !question.description || !Array.isArray(question.testCases)) {
          throw new Error(`Invalid question format at index ${index}`);
        }
        
        // Check for either regular question format OR streak question format
        const isRegularFormat = question.difficulty !== undefined;
        const isStreakFormat = question.functionSignature !== undefined || question.level !== undefined;
        
        if (!isRegularFormat && !isStreakFormat) {
          throw new Error(`Invalid question format at index ${index} - missing 'difficulty' or 'functionSignature'`);
        }
      });

      setJsonPreview(normalized);
      setError(null);
      toast.success('JSON file validated successfully!');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setError(error.message);
      setJsonPreview(null);
      toast.error(error.message);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonPreview) return;

    try {
      // Detect question type: check if it's streak format (has functionSignature or level)
      const firstQuestion = jsonPreview.questions[0];
      const isStreakFormat = firstQuestion && (firstQuestion.functionSignature || firstQuestion.level !== undefined);
      
      let endpoint = `${window.API_BASE_URL}/api/questions/bulk-import`;
      let payload = jsonPreview;
      
      if (isStreakFormat) {
        // For streak questions, support both:
        // - Single question: use /api/streak/admin/add (single question endpoint)
        // - Exactly 5 questions: use /api/streak/admin/daily (batch endpoint)
        if (jsonPreview.questions.length === 1) {
          // Single question upload
          endpoint = `${window.API_BASE_URL}/api/streak/admin/add`;
          payload = jsonPreview.questions[0];
        } else if (jsonPreview.questions.length === 5) {
          // Batch of 5 questions for today
          endpoint = `${window.API_BASE_URL}/api/streak/admin/daily`;
          
          // Get today's date in local timezone (YYYY-MM-DD format)
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const localDate = `${year}-${month}-${day}`;
          
          payload = {
            date: localDate,
            replaceExisting: true,  // Always replace existing questions to avoid duplicates
            questions: jsonPreview.questions
          };
        } else {
          throw new Error('Streak questions must have either 1 question or exactly 5 questions (one per level)');
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        // Show the specific error message from the server
        throw new Error(result.message || 'Failed to import questions');
      }

      const imported = Array.isArray(result.questions) ? result.questions : [];
      
      // Show any errors that occurred during import
      if (result.errors && result.errors.length > 0) {
        console.warn('Import warnings:', result.errors);
        result.errors.forEach(err => toast.error(err, { duration: 5000 }));
      }
      
      setQuestions(prev => [...prev, ...imported]);
      setJsonPreview(null);
      setError(null);
      
      // Show different message based on question type
      if (isStreakFormat) {
        if (jsonPreview.questions.length === 1) {
          toast.success(`✅ Streak question uploaded successfully!`);
        } else {
          toast.success(`🔥 5 streak questions uploaded successfully for today!`);
        }
      } else if (result.streakPublished) {
        toast.success(`✅ ${imported.length} questions imported and published to today's streak!`);
      } else if (imported.length >= 5) {
        toast.success(`✅ ${imported.length} questions imported! (Today's streak already exists)`);
      } else if (imported.length > 0) {
        toast.success(`✅ ${imported.length} questions imported! (Need 5+ to auto-publish streak)`);
      } else {
        toast.warning('⚠️ No new questions imported (all already exist)');
      }
    } catch (error) {
      console.error('Error importing questions:', error);
      setError('Failed to import questions: ' + error.message);
      toast.error(error.message || 'Failed to import questions');
    }
  };

  const handleClearAllQuestions = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL questions from the general questions pool (not streak questions). Are you sure?')) {
      return;
    }

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/questions/clear-all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Try to parse JSON; fall back to text to avoid "Unexpected token '<'" on HTML errors
      let result;
      let rawText = '';
      try {
        result = await response.json();
      } catch (_) {
        rawText = await response.text();
      }

      if (!response.ok) {
        const msg = (result && result.message) || rawText || 'Failed to clear questions';
        throw new Error(msg);
      }

      setQuestions([]);
      const successMsg = (result && result.message) || 'All questions cleared';
      toast.success(successMsg);
    } catch (error) {
      console.error('Error clearing questions:', error);
      toast.error(error.message || 'Failed to clear questions');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-dashboard-title">🎯 Admin Dashboard</h1>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <p className="stat-label">Total Questions</p>
              <p className="stat-value">{stats.totalQuestions}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <p className="stat-label">Active Users</p>
              <p className="stat-value">{stats.activeUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <p className="stat-label">Top Streak</p>
              <p className="stat-value">{stats.longestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📥 Upload Questions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveTab('streak')}
        >
          🔥 Manage Streak Questions
        </button>
      </div>
      
      <div className="admin-dashboard-content">
        {activeTab === 'upload' ? (
          <>
            <section className="question-import-section">
              <h2>Import Questions from JSON</h2>
              <div className="import-options">
                <div className="file-upload-container">
                  <h3>📄 Upload JSON File</h3>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <p className="helper-text">Upload a JSON file containing questions and test cases</p>
                  <p className="format-note">✨ <strong>Auto-Publish:</strong> Uploading 5+ questions will automatically publish them to today's streak!</p>
                  <p className="format-note">Note: Questions can be solved in any programming language</p>
                  
                  <pre className="json-format-example">
{`{
  "questions": [
    {
      "title": "Question Title",
      "description": "Problem description...",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "Sample input",
          "expectedOutput": "Expected output"
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
                <div className="json-preview-container">
                  {jsonPreview && (
                    <>
                      <h4>✅ Preview:</h4>
                      <div className="json-preview">
                        <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
                      </div>
                      <button 
                        onClick={handleJsonImport}
                        className="import-btn"
                      >
                        Import {jsonPreview.questions.length} Question(s)
                      </button>
                    </>
                  )}
                  {error && (
                    <div className="error-message">
                      ❌ {error}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="questions-list-section">
              <h2>📋 Existing Questions ({questions.length})</h2>
              {questions.length > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAllQuestions}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Clear All Questions
                </button>
              )}
              <div className="questions-list">
                {questions.map(question => (
                  <div key={question._id} className="question-card">
                    <h3>{question.title}</h3>
                    <div className="question-meta">
                      <span className={`difficulty ${question.difficulty}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p>{question.description}</p>
                    <div className="test-cases">
                      <strong>Test Cases:</strong>
                      {question.testCases.map((testCase, index) => (
                        <div key={index} className="test-case">
                          <div>Input: {testCase.input}</div>
                          <div>Expected: {testCase.expectedOutput}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="streak-question-section">
            <StreakQuestionManager />
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;