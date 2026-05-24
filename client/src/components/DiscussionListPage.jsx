import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import leftArrow from './images/left-arrow (1).png';
import './DiscussionListPage.css';

const DiscussionListPage = ({ isDark }) => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    language: 'all',
    topic: 'all',
    sort: 'recent',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  });
  const [trendingDiscussions, setTrendingDiscussions] = useState([]);

  const languages = ['all', 'Java', 'Python', 'C++', 'JavaScript', 'General'];
  const topics = [
    'all',
    'Data Structures',
    'Algorithms',
    'Object-Oriented Programming',
    'Databases',
    'Web Development',
    'System Design',
    'Debugging',
    'Best Practices',
    'Other'
  ];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'mostViewed', label: 'Most Viewed' },
    { value: 'mostCommented', label: 'Most Commented' }
  ];

  useEffect(() => {
    fetchDiscussions();
    fetchTrendingDiscussions();
  }, [filters, pagination.page]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${window.API_BASE_URL}/api/discussions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          language: filters.language,
          topic: filters.topic,
          sort: filters.sort,
          search: filters.search,
          page: pagination.page,
          limit: 20
        }
      });

      setDiscussions(response.data.discussions);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingDiscussions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${window.API_BASE_URL}/api/discussions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sort: 'popular',
          limit: 5
        }
      });
      setTrendingDiscussions(response.data.discussions);
    } catch (error) {
      console.error('Error fetching trending discussions:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDiscussions();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  };

  const getLanguageColor = (language) => {
    const colors = {
      Java: '#f89820',
      Python: '#3776ab',
      'C++': '#00599c',
      JavaScript: '#f7df1e',
      General: '#6c757d'
    };
    return colors[language] || '#6c757d';
  };

  return (
    <div className="discussion-page-wrapper">
      <div className="discussion-list-container">
        {/* Filters at top */}
        <div className="discussion-filters">
          <div className="filter-row">
            <div className="filter-item">
              <label>Language:</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang === 'all' ? 'All Languages' : lang}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Topic:</label>
              <select
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic === 'all' ? 'All Topics' : topic}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search discussions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <button type="submit">🔍</button>
            </form>
          </div>

          {/* Create Discussion Button */}
          <button className="btn-create-discussion" onClick={() => navigate('/discussions/new')}>
            + Create Discussion
          </button>
        </div>

      {/* Discussion List */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading discussions...</p>
        </div>
      ) : discussions.length === 0 ? (
        <div className="no-discussions">
          <h3>No discussions found</h3>
          <p>Be the first to start a discussion!</p>
        </div>
      ) : (
        <>
          <div className="discussions-list">
            {discussions.map(discussion => (
              <div
                key={discussion._id}
                className="discussion-item"
              >
                <div 
                  className="discussion-content"
                  onClick={() => navigate(`/discussions/${discussion._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="discussion-title">
                    {discussion.title}
                    {discussion.isSolved && <span className="solved-tag">✓ Solved</span>}
                  </h3>
                  <p className="discussion-excerpt">
                    {discussion.content.substring(0, 200)}
                    {discussion.content.length > 200 ? '...' : ''}
                  </p>
                  <div className="discussion-footer">
                    <span className="author">by {discussion.author?.name}</span>
                    <span className="time">{formatTimeAgo(discussion.createdAt)}</span>
                    <div className="discussion-stats">
                      <span>👍 {discussion.votes}</span>
                      <span>💬 {discussion.commentCount}</span>
                      <span>👁️ {discussion.views}</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="discussion-avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${discussion.author?._id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                  title={`View ${discussion.author?.name}'s profile`}
                >
                  <div className="user-avatar">
                    {discussion.author?.avatarUrl ? (
                      <img 
                        src={discussion.author.avatarUrl} 
                        alt={discussion.author.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      discussion.author?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Add Button - Bottom Right */}
      <button className="fab-button" onClick={() => navigate('/discussions/new')} title="Create Discussion">
        +
      </button>
    </div>

    {/* Right Sidebar - Trending */}
    <div className="trending-sidebar">
      <h3>Top Trending Discussions</h3>
      <div className="trending-list">
        {trendingDiscussions.map(discussion => (
          <div
            key={discussion._id}
            className="trending-item"
            onClick={() => navigate(`/discussions/${discussion._id}`)}
          >
            <h4>{discussion.title}</h4>
            <div className="trending-stats">
              <span>👍 {discussion.votes}</span>
              <span>💬 {discussion.commentCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default DiscussionListPage;
