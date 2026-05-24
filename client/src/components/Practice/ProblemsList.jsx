import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Practice.css';
import leftArrowIcon from '../images/left-arrow (1).png';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    topic: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.topic) queryParams.append('topic', filters.topic);
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);

      const res = await fetch(
        `${window.API_BASE_URL}/api/practice/problems?${queryParams}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
      } else {
        console.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProblemClick = (problemId) => {
    navigate(`/practice/problems/${problemId}`);
  };

  const handleBackClick = () => {
    navigate('/practice'); // Navigate back to practice dashboard
  };

  return (
    <div className="practice-container">
      {/* Header with Back Button and Title */}
      <div className="problems-list-header">
        <button 
          className="back-button-icon" 
          onClick={handleBackClick}
          title="Back to Practice"
        >
          <img src={leftArrowIcon} alt="Back" />
        </button>
        <h1>📚 Practice Problems</h1>
      </div>

      {/* Filters */}
      <div className="problems-filters">
        <div className="filter-group">
          <label>Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Topic</label>
          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
          >
            <option value="">All Topics</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked List">Linked List</option>
            <option value="Stack">Stack</option>
            <option value="Trees">Trees</option>
            <option value="Binary Search">Binary Search</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Greedy">Greedy</option>
            <option value="Graph">Graph</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            className="search-input"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>&nbsp;</label>
          <button 
            className="btn-submit" 
            onClick={() => setFilters({
              difficulty: '',
              topic: '',
              search: '',
              page: 1,
              limit: 20
            })}
            style={{ padding: '0.6rem 1.5rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Problems Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading problems...</p>
        </div>
      ) : problems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            No problems found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="problems-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Status</th>
                  <th>Title</th>
                  <th style={{ width: '150px' }}>Difficulty</th>
                  <th style={{ width: '150px' }}>Topic</th>
                  <th style={{ width: '120px' }}>Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr 
                    key={problem._id} 
                    onClick={() => handleProblemClick(problem._id)}
                  >
                    <td>
                      {problem.isSolved && (
                        <span className="solved-check" title="Solved">✓</span>
                      )}
                    </td>
                    <td>
                      <div className="problem-title">
                        {problem.title}
                      </div>
                    </td>
                    <td>
                      <span className={`difficulty-badge ${problem.difficulty}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {problem.topic}
                      </span>
                    </td>
                    <td>
                      <span className="acceptance-rate">
                        {problem.acceptanceRate ? `${problem.acceptanceRate}%` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} problems)
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Quick Links */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link to="/practice/dashboard" className="btn-submit" style={{ marginRight: '1rem', textDecoration: 'none', display: 'inline-block' }}>
          📊 View My Progress
        </Link>
        <Link to="/practice/editor" className="btn-run" style={{ textDecoration: 'none', display: 'inline-block', background: '#10b981', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>
          🖊️ Open Free Editor
        </Link>
      </div>
    </div>
  );
};

export default ProblemsList;
