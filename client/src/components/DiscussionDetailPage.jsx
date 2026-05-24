import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DiscussionDetailPage.css';
import leftArrow from './images/left-arrow (1).png';

const DiscussionDetailPage = ({ isDark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${window.API_BASE_URL}/api/discussions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscussion(response.data.discussion);
      setComments(response.data.comments);
      setEditData({
        title: response.data.discussion.title,
        content: response.data.discussion.content
      });
    } catch (error) {
      console.error('Error fetching discussion:', error);
      toast.error('Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${window.API_BASE_URL}/api/discussions/${id}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

        // Just refetch the discussion to get updated data
        fetchDiscussion();
      
    } catch (error) {
        console.error('Vote error:', error);
      toast.error('Failed to vote');
    }
  };

  const handleCommentVote = async (commentId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${window.API_BASE_URL}/api/discussions/comments/${commentId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDiscussion();
    } catch (error) {
      toast.error('Failed to vote on comment');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmittingComment(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${window.API_BASE_URL}/api/discussions/${id}/comments`,
        {
          content: newComment,
          parentCommentId: replyTo
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Comment added!');
      setNewComment('');
      setReplyTo(null);
      fetchDiscussion();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${window.API_BASE_URL}/api/discussions/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Comment deleted');
      fetchDiscussion();
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleUpdateDiscussion = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${window.API_BASE_URL}/api/discussions/${id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Discussion updated!');
      setEditMode(false);
      fetchDiscussion();
    } catch (error) {
      toast.error('Failed to update discussion');
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${window.API_BASE_URL}/api/discussions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Discussion deleted');
      navigate('/discussions');
    } catch (error) {
      toast.error('Failed to delete discussion');
    }
  };

  const handleMarkSolved = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${window.API_BASE_URL}/api/discussions/${id}/solved`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(discussion.isSolved ? 'Marked as unsolved' : 'Marked as solved');
      fetchDiscussion();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  };

  const isAuthor = discussion?.author?._id === (currentUser?._id || currentUser?.userId);
  const hasUpvoted = discussion?.upvotedBy?.includes(currentUser?._id || currentUser?.userId);
  const hasDownvoted = discussion?.downvotedBy?.includes(currentUser?._id || currentUser?.userId);

  if (loading) {
    return (
      <div className="discussion-detail-loading">
        <div className="spinner"></div>
        <p>Loading discussion...</p>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="discussion-detail-error">
        <h2>Discussion not found</h2>
        <button onClick={() => navigate('/discussions')}>Back to Discussions</button>
      </div>
    );
  }

  return (
    <div className="discussion-detail-page">
      <div className="discussion-detail-container">
        <button className="btn-back" onClick={() => navigate('/discussions')}>
            <img src={leftArrow} alt="Back" style={{ width: 20, height: 20, marginRight: 8 }} />
            Back to Discussions
        </button>

        {/* Discussion Content */}
        <div className="discussion-content-card">
          <div className="discussion-header-row">
            <div className="author-section">
              <div 
                className="author-avatar"
                onClick={() => navigate(`/user/${discussion.author?._id}`)}
                style={{ cursor: 'pointer' }}
                title={`View ${discussion.author?.name}'s profile`}
              >
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
              <div className="author-info">
                <span 
                  className="author-name"
                  onClick={() => navigate(`/user/${discussion.author?._id}`)}
                  style={{ cursor: 'pointer' }}
                  title={`View ${discussion.author?.name}'s profile`}
                >
                  {discussion.author?.name}
                </span>
                <span className="post-time">{formatTimeAgo(discussion.createdAt)}</span>
              </div>
            </div>

            {isAuthor && (
              <div className="discussion-actions">
                {!editMode && (
                  <>
                    <button onClick={() => setEditMode(true)} className="btn-icon">✏️</button>
                    <button onClick={handleMarkSolved} className="btn-icon">
                      {discussion.isSolved ? '↩️' : '✓'}
                    </button>
                    <button onClick={handleDeleteDiscussion} className="btn-icon danger">🗑️</button>
                  </>
                )}
              </div>
            )}
          </div>

          {editMode ? (
            <div className="edit-form">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="edit-title"
              />
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                className="edit-content"
                rows={8}
              />
              <div className="edit-actions">
                <button onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleUpdateDiscussion} className="btn-primary">Save</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="discussion-title">
                {discussion.title}
                {discussion.isSolved && <span className="solved-badge">✓ Solved</span>}
              </h1>

              <div className="discussion-meta">
                <span className="meta-badge">{discussion.language}</span>
                <span className="meta-badge">{discussion.topic}</span>
                <span className="meta-stat">👁️ {discussion.views} views</span>
                <span className="meta-stat">💬 {discussion.commentCount} comments</span>
              </div>

              <div className="discussion-body">
                {discussion.content}
              </div>

              {discussion.tags && discussion.tags.length > 0 && (
                <div className="discussion-tags">
                  {discussion.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Vote Section */}
          <div className="vote-section">
            <button
              onClick={() => handleVote('upvote')}
              className={`vote-btn ${hasUpvoted ? 'active' : ''}`}
            >
              👍
            </button>
            <span className="vote-count">{discussion.votes}</span>
            <button
              onClick={() => handleVote('downvote')}
              className={`vote-btn ${hasDownvoted ? 'active' : ''}`}
            >
              👎
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h2>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="add-comment-form">
            {replyTo && (
              <div className="reply-indicator">
                <span>Replying to comment...</span>
                <button type="button" onClick={() => setReplyTo(null)}>✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              rows={4}
              maxLength={2000}
            />
            <div className="comment-form-footer">
              <span className="char-count">{newComment.length}/2000</span>
              <button type="submit" disabled={submittingComment} className="btn-primary">
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <div 
                      className="author-avatar small"
                      onClick={() => navigate(`/user/${comment.author?._id}`)}
                      style={{ cursor: 'pointer' }}
                      title={`View ${comment.author?.name}'s profile`}
                    >
                      {comment.author?.avatarUrl ? (
                        <img 
                          src={comment.author.avatarUrl} 
                          alt={comment.author.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        comment.author?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span 
                      className="author-name"
                      onClick={() => navigate(`/user/${comment.author?._id}`)}
                      style={{ cursor: 'pointer' }}
                      title={`View ${comment.author?.name}'s profile`}
                    >
                      {comment.author?.name}
                    </span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                  </div>

                  {(comment.author?._id === (currentUser?._id || currentUser?.userId)) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn-delete-comment"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="comment-content">{comment.content}</div>

                <div className="comment-actions">
                  <button
                    onClick={() => handleCommentVote(comment._id, 'upvote')}
                    className="vote-btn-small"
                  >
                    👍 {comment.votes}
                  </button>
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="reply-btn"
                  >
                    Reply
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies-list">
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="reply-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div 
                              className="author-avatar small"
                              onClick={() => navigate(`/user/${reply.author?._id}`)}
                              style={{ cursor: 'pointer' }}
                              title={`View ${reply.author?.name}'s profile`}
                            >
                              {reply.author?.avatarUrl ? (
                                <img 
                                  src={reply.author.avatarUrl} 
                                  alt={reply.author.name}
                                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                reply.author?.name?.charAt(0).toUpperCase()
                              )}
                            </div>
                            <span 
                              className="author-name"
                              onClick={() => navigate(`/user/${reply.author?._id}`)}
                              style={{ cursor: 'pointer' }}
                              title={`View ${reply.author?.name}'s profile`}
                            >
                              {reply.author?.name}
                            </span>
                            <span className="comment-time">{formatTimeAgo(reply.createdAt)}</span>
                          </div>

                          {(reply.author?._id === (currentUser?._id || currentUser?.userId)) && (
                            <button
                              onClick={() => handleDeleteComment(reply._id)}
                              className="btn-delete-comment"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        <div className="comment-content">{reply.content}</div>

                        <div className="comment-actions">
                          <button
                            onClick={() => handleCommentVote(reply._id, 'upvote')}
                            className="vote-btn-small"
                          >
                            👍 {reply.votes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailPage;

