import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './StreakPage.css';

const StreakHistory = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingCode, setViewingCode] = useState(null); // { code, language, title }
  const [loadingCode, setLoadingCode] = useState(false);

  const closeModal = () => {
    setViewingCode(null);
  };

  const handleViewCode = async (problemId, title) => {
    setLoadingCode(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch latest accepted submission
      const subRes = await fetch(
        `${window.API_BASE_URL}/api/problems/${problemId}/submissions/latest?status=accepted`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!subRes.ok) {
        alert('No accepted submission found');
        setLoadingCode(false);
        return;
      }
      
      const submission = await subRes.json();
      
      // Fetch presigned URL for code
      const codeRes = await fetch(
        `${window.API_BASE_URL}/api/submissions/${submission._id}/code`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!codeRes.ok) {
        alert('Failed to get code URL');
        setLoadingCode(false);
        return;
      }
      
      const { signedUrl, language } = await codeRes.json();
      
      // Fetch actual code from signed URL
      const codeTextRes = await fetch(signedUrl);
      const codeText = await codeTextRes.text();
      
      setViewingCode({ code: codeText, language, title });
    } catch (err) {
      console.error('Error viewing code:', err);
      alert('Failed to load code');
    } finally {
      setLoadingCode(false);
    }
  };

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE_URL}/api/streak/history?page=${p}&pageSize=${pageSize}` , {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to load');
      }
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  return (
    <div className="streak-page" style={{ padding: 24 }}>
      <div className="streak-header">
        <h1>🗂️ Solved History</h1>
        <Link to="/streak" className="leaderboard-link">Back to Streak →</Link>
      </div>

      <div className="sidebar-card" style={{ maxWidth: 920 }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : items.length === 0 ? (
          <p>No solved questions yet.</p>
        ) : (
          <ul className="solved-list">
            {items.map((item, idx) => (
              <li key={idx} className="solved-item">
                <span className="dot" />
                <div className="solved-info">
                  <div className="title-row">
                    <span className="title">{item.questionId?.title || 'Question'}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${String(item.questionId?.difficulty || item.difficulty || '').toLowerCase()}`}>{item.questionId?.difficulty || item.difficulty || 'Level'}</span>
                      <span className={`badge language-badge ${String(item.questionId?.language || item.language || 'javascript').toLowerCase()}`}>{item.questionId?.language || item.language || 'JavaScript'}</span>
                    </div>
                  </div>
                  <div className="meta">{new Date(item.completedAt).toLocaleString()}</div>
                </div>
                {item.questionId?._id && (
                  <button 
                    className="view-link" 
                    onClick={() => handleViewCode(item.questionId._id, item.questionId.title)}
                    disabled={loadingCode}
                  >
                    View
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="pager" style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
        </div>
      </div>

      {/* Code viewer modal */}
      {viewingCode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📄 {viewingCode.title} - Accepted Solution</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <Editor
                height="500px"
                language={viewingCode.language === 'cpp' ? 'cpp' : viewingCode.language}
                value={viewingCode.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakHistory;
