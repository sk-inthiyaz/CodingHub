import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './NewDiscussionPage.css';

const NewDiscussionPage = ({ isDark }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language: 'General',
    topic: 'Other',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const languages = ['Java', 'Python', 'C++', 'JavaScript', 'General'];
  const topics = [
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const response = await axios.post(
        `${window.API_BASE_URL}/api/discussions`,
        {
          title: formData.title,
          content: formData.content,
          language: formData.language,
          topic: formData.topic,
          tags: tagsArray
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Discussion created successfully!');
      navigate(`/discussions/${response.data.discussion._id}`);
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error(error.response?.data?.message || 'Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-discussion-page">
      <div className="new-discussion-container">
        <div className="page-header">
          <h1>Create New Discussion</h1>
          <button onClick={() => navigate('/discussions')} className="btn-cancel">
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="discussion-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's your question or topic?"
              maxLength={200}
              required
            />
            <span className="char-count">{formData.title.length}/200</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Description *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your question or topic in detail..."
              maxLength={5000}
              rows={12}
              required
            />
            <span className="char-count">{formData.content.length}/5000</span>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas (e.g., arrays, sorting, beginner)"
            />
            <small>Add up to 5 tags to help others find your discussion</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/discussions')}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionPage;
