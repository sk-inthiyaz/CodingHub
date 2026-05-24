import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminPracticeProblems.css';

const AdminPracticeProblems = () => {
  // State Management
  const [uploadCount, setUploadCount] = useState('');
  const [jsonPreview, setJsonPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    byTopic: {}
  });
  
  // Tab and Filter States
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  
  // Edit Modal States
  const [editingProblem, setEditingProblem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchProblems();
    fetchStats();
  }, []);

  // Fetch all problems
  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/problems/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ Failed to fetch problems:', res.status, errorData);
        // ✅ Do NOT wipe existing problems on a transient error
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      // ✅ Keep existing list — don't set to []
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📊 Fetching stats...');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Fetched stats:', data);
        setStats(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ Failed to fetch stats:', res.status, errorData);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setJsonPreview(json);
        setError('');
      } catch (err) {
        setError('Invalid JSON format. Please check your file.');
        setJsonPreview(null);
      }
    };
    reader.readAsText(file);
  };

  // Validate and upload problems
  const validateAndUpload = async () => {
    if (!uploadCount || uploadCount <= 0) {
      setError('Please enter the number of problems to upload');
      return;
    }

    if (!jsonPreview) {
      setError('Please select a JSON file');
      return;
    }

    const expectedCount = parseInt(uploadCount);
    const actualCount = jsonPreview.problems?.length || 0;

    if (actualCount !== expectedCount) {
      setError(
        `❌ Matching is wrong! Expected ${expectedCount} problem(s) but got ${actualCount}. Please provide correct matching.`
      );
      return;
    }

    // Validate problem structure
    for (let i = 0; i < jsonPreview.problems.length; i++) {
      const p = jsonPreview.problems[i];
      if (!p.title || !p.description) {
        setError(`Problem ${i + 1} is missing required fields (title, description)`);
        return;
      }
      if (!p.difficulty || !p.topic) {
        setError(`Problem ${i + 1} is missing difficulty or topic`);
        return;
      }
      if (!p.functionSignature || !p.functionSignature.name) {
        setError(`Problem ${i + 1} must have functionSignature with name`);
        return;
      }
      if (!p.codeTemplate || !p.codeTemplate.javascript) {
        setError(`Problem ${i + 1} must have codeTemplate for at least javascript`);
        return;
      }
      if (!p.testCases || p.testCases.length === 0) {
        setError(`Problem ${i + 1} must have at least one test case`);
        return;
      }
    }

    // Upload problems
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/admin/upload-problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // ✅ Always pass replaceExisting:true so re-uploads update instead of silently skip
        body: JSON.stringify({ problems: jsonPreview.problems, replaceExisting: true })
      });

      if (res.ok) {
        const result = await res.json();
        const successCount = result.results?.success?.length ?? 0;
        const skippedCount = result.results?.skipped?.length ?? 0;
        const failedCount  = result.results?.failed?.length  ?? 0;

        if (failedCount > 0) {
          const failedNames = result.results.failed.map(f => f.title || f).join(', ');
          toast.error(`⚠️ ${failedCount} problem(s) failed: ${failedNames}`);
          setError(`Failed: ${failedNames}`);
        } else if (skippedCount > 0) {
          toast(`⚠️ ${skippedCount} problem(s) skipped (already exist). ${successCount} uploaded.`);
        } else {
          toast.success(`✅ ${successCount} problem(s) uploaded successfully!`);
        }

        setUploadCount('');
        setJsonPreview(null);
        setError('');

        // Refresh list after short delay to let DB settle
        setTimeout(() => {
          fetchProblems();
          fetchStats();
          setActiveTab('history');
        }, 600);
      } else {
        const data = await res.json();
        console.error('❌ Upload failed:', data);
        setError(data.message || 'Failed to upload problems');
      }
    } catch (err) {
      setError('Error uploading problems: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete problem
  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/admin/problems/${problemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('✅ Problem deleted successfully');
        fetchProblems();
        fetchStats();
      } else {
        toast.error('❌ Failed to delete problem');
      }
    } catch (err) {
      toast.error('❌ Error deleting problem');
    }
  };

  // Open edit modal
  const handleEditProblem = (problem) => {
    setEditingProblem({ ...problem });
    setShowEditModal(true);
  };

  // Update problem
  const handleUpdateProblem = async () => {
    if (!editingProblem) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/practice/admin/problems/${editingProblem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProblem)
      });

      if (res.ok) {
        toast.success('✅ Problem updated successfully');
        setShowEditModal(false);
        setEditingProblem(null);
        fetchProblems();
        fetchStats();
      } else {
        toast.error('❌ Failed to update problem');
      }
    } catch (err) {
      toast.error('❌ Error updating problem');
    }
  };

  // Filter problems based on search and filters
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
    const matchesTopic = filterTopic === 'All' || problem.topic === filterTopic;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // Get unique topics for filter dropdown
  const uniqueTopics = ['All', ...new Set(problems.map(p => p.topic))];

  return (
    <div className="admin-practice-container">
      {/* Header */}
      <div className="admin-practice-header">
        <h1>📝 Admin Practice Problems Manager</h1>
        <p>Upload and manage coding practice problems</p>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Total Problems</p>
            <p className="stat-value">{stats.totalProblems}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Easy</p>
            <p className="stat-value">{stats.byDifficulty?.Easy || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <p className="stat-label">Medium</p>
            <p className="stat-value">{stats.byDifficulty?.Medium || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <p className="stat-label">Hard</p>
            <p className="stat-value">{stats.byDifficulty?.Hard || 0}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Problems
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📚 Problems History ({problems.length})
        </button>
      </div>

      {/* UPLOAD TAB */}
      {activeTab === 'upload' && (
        <>
          <div className="upload-section">
            <h2>📤 Upload Problems</h2>
            <div className="upload-form">
              <div className="form-group">
                <label>Number of Problems to Upload</label>
                <input
                  type="number"
                  min="1"
                  value={uploadCount}
                  onChange={(e) => setUploadCount(e.target.value)}
                  placeholder="e.g., 3"
                  className="input-field"
                />
                <p className="helper-text">Enter how many problems you want to upload</p>
              </div>

              <div className="form-group">
                <label>Select JSON File</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <p className="helper-text">Upload a JSON file with your problems</p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {jsonPreview && (
                <div className="preview-section">
                  <h3>✅ JSON Preview</h3>
                  <div className="preview-content">
                    <p><strong>Problems Found:</strong> {jsonPreview.problems?.length || 0}</p>
                    <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
                  </div>
                </div>
              )}

              <button
                onClick={validateAndUpload}
                disabled={loading || !uploadCount || !jsonPreview}
                className="btn-upload"
              >
                {loading ? '⏳ Uploading...' : '🚀 Validate & Upload'}
              </button>
            </div>
          </div>

          {/* JSON Format Guide */}
          <div className="format-guide">
            <h2>📋 Required JSON Format</h2>
            <pre className="code-block">
{`{
  "problems": [
    {
      "title": "Two Sum",
      "description": "Find two numbers that add up to target...",
      "difficulty": "Easy",
      "topic": "Arrays",
      "constraints": "2 <= nums.length <= 10^4",
      "hints": ["Use a hash map"],
      "functionSignature": {
        "name": "twoSum",
        "params": ["nums", "target"],
        "returnType": "int[]"
      },
      "codeTemplate": {
        "javascript": "function twoSum(nums, target) {\\n  // Your code\\n}",
        "python": "def twoSum(nums, target):\\n    pass",
        "java": "class Solution {\\n    public int[] twoSum(int[] nums, int target) {\\n    }\\n}",
        "cpp": "class Solution {\\npublic:\\n    vector<int> twoSum(vector<int>& nums, int target) {\\n    }\\n};"
      },
      "testCases": [
        {
          "input": "[2,7,11,15], 9",
          "expectedOutput": "[0,1]",
          "explanation": "nums[0] + nums[1] = 9",
          "isHidden": false
        }
      ]
    }
  ]
}`}
            </pre>
          </div>
        </>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="history-section">
          <div className="history-header">
            <h2>📚 Uploaded Problems History</h2>
            
            {/* Search and Filters */}
            <div className="filters-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-group">
                <select 
                  value={filterDifficulty} 
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select 
                  value={filterTopic} 
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="filter-select"
                >
                  {uniqueTopics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Problems Table */}
          {filteredProblems.length === 0 ? (
            <div className="no-problems">
              <p>📭 No problems found matching your criteria</p>
            </div>
          ) : (
            <div className="problems-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Topic</th>
                    <th>Test Cases</th>
                    <th>Acceptance</th>
                    <th>Submissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem, index) => (
                    <tr key={problem._id}>
                      <td>{index + 1}</td>
                      <td className="problem-title-cell">
                        <div className="problem-title">{problem.title}</div>
                        <div className="problem-function">
                          🔧 {problem.functionSignature?.name || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="topic-badge">{problem.topic}</span>
                      </td>
                      <td>
                        <div className="test-info">
                          <span>Total: {problem.testCases?.length || 0}</span>
                          <span className="hidden-tests">
                            🔒 {problem.testCases?.filter(tc => tc.isHidden).length || 0}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="acceptance-rate">
                          {problem.acceptanceRate || 0}%
                        </span>
                      </td>
                      <td>{problem.totalSubmissions || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditProblem(problem)}
                            title="Edit Problem"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-delete-small"
                            onClick={() => handleDeleteProblem(problem._id)}
                            title="Delete Problem"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingProblem && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Problem</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✖️
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingProblem.title}
                  onChange={(e) => setEditingProblem({...editingProblem, title: e.target.value})}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingProblem.description}
                  onChange={(e) => setEditingProblem({...editingProblem, description: e.target.value})}
                  className="textarea-field"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={editingProblem.difficulty}
                    onChange={(e) => setEditingProblem({...editingProblem, difficulty: e.target.value})}
                    className="input-field"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Topic</label>
                  <input
                    type="text"
                    value={editingProblem.topic}
                    onChange={(e) => setEditingProblem({...editingProblem, topic: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Constraints</label>
                <textarea
                  value={editingProblem.constraints || ''}
                  onChange={(e) => setEditingProblem({...editingProblem, constraints: e.target.value})}
                  className="textarea-field"
                  rows="2"
                  placeholder="e.g., 1 <= n <= 10^5"
                />
              </div>

              <div className="form-group">
                <label>Hints (comma-separated)</label>
                <textarea
                  value={Array.isArray(editingProblem.hints) ? editingProblem.hints.join(', ') : ''}
                  onChange={(e) => setEditingProblem({
                    ...editingProblem, 
                    hints: e.target.value.split(',').map(h => h.trim()).filter(h => h)
                  })}
                  className="textarea-field"
                  rows="2"
                  placeholder="Hint 1, Hint 2, Hint 3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-save"
                onClick={handleUpdateProblem}
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPracticeProblems;
