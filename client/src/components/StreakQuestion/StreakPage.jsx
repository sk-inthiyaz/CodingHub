// import React, { useState, useEffect } from "react";
// import QuestionDisplay from "./QuestionDisplay";
// import CodeEditor from "./CodeEditor";
// import ResultBox from "./ResultBox";
// import ProgressTracker from "./ProgressTracker";
// import { fetchTodayQuestion, submitAnswer } from "./utils/questionAPI";
// import "./StreakQuestion.css";

// const StreakPage = () => {
//   const [question, setQuestion] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userLevel, setUserLevel] = useState("easy"); // can come from user profile later

//   useEffect(() => {
//     const loadQuestion = async () => {
//       const q = await fetchTodayQuestion(userLevel);
//       setQuestion(q);
//     };
//     loadQuestion();
//   }, [userLevel]);

//   const handleSubmit = async (code) => {
//     setLoading(true);
//     const res = await submitAnswer(code, question);
//     setResult(res);
//     setLoading(false);
//   };

//   if (!question) return <p className="loading">Loading today’s question...</p>;

//   return (
//     <div className="streak-page">
//       <ProgressTracker />
//       <QuestionDisplay question={question} />
//       <CodeEditor onSubmit={handleSubmit} loading={loading} />
//       {result && <ResultBox result={result} />}
//     </div>
//   );
// };

// export default StreakPage;

// import React, { useState } from "react";
// import UserStreakQuestionCard from "./UserStreakQuestionCard";
// import StreakStatusCard from "./StreakStatusCard";
// import QuestionDetails from "./QuestionDetails";
// import "./StreakPage.css";

// const StreakPage = () => {
//   const [showQuestion, setShowQuestion] = useState(false);

//   return (
//     <div className="streak-page">
//       <h1>🔥 Daily Streak Challenge</h1>
//       <StreakStatusCard />
//       {!showQuestion ? (
//         <UserStreakQuestionCard onStart={() => setShowQuestion(true)} />
//       ) : (
//         <QuestionDetails />
//       )}
//     </div>
//   );
// };

// export default StreakPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StreakStatusCard from "./StreakStatusCard";
import UserStreakQuestionCard from "./UserStreakQuestionCard";
import Leaderboard from "./Leaderboard";
import Editor from "@monaco-editor/react";
import "./StreakPage.css";
import leftArrow from '../images/left-arrow (1).png';

const StreakPage = () => {
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingCode, setViewingCode] = useState(null); // { code, language, title }
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${window.API_BASE_URL}/api/streak/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSolved(data.completedQuestions || []);
        } else {
          setError(data.message || 'Failed to load');
        }
      } catch (e) {
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchSolved();
  }, []);

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

  const closeModal = () => setViewingCode(null);

  return (
    <div className="streak-page">
      {/* Centered content */}
      <div className="streak-container">
        <div className="streak-header">
          <div className="title-row-header">
            <h1>🔥 Daily Streak Challenge</h1>
          </div>
          <p>Solve today's problem, keep your streak alive, and climb the leaderboard.</p>
          <Link to="/streak/leaderboard" className="btn-leaderboard">
            Full Leaderboard →
          </Link>
        </div>
        <div className="streak-grid">
        <div className="main-column">
          <StreakStatusCard />
          <UserStreakQuestionCard />
        </div>
        <aside className="sidebar-column">
          <div className="sidebar-card">
            <h3>🏆 Today's Top Streakers</h3>
            <Leaderboard embedMode={true} limit={3} />
          </div>
          <div className="sidebar-card" style={{ marginTop: 16 }}>
            <h3>✅ Solved Questions</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : solved.length === 0 ? (
              <p className="muted">No solved questions yet.</p>
            ) : (
              <ul className="solved-list">
                {solved.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="solved-item">
                    <span className="dot" />
                    <div className="solved-info">
                      <div className="title-row">
                        <span className="title">{item.questionId?.title || 'Question'}</span>
                        <span className={`badge ${String(item.difficulty || '').toLowerCase()}`}>{item.difficulty || 'Level'}</span>
                      </div>
                      <div className="meta">{new Date(item.completedAt).toLocaleDateString()}</div>
                    </div>
                    {item.questionId?._id && (
                      <button 
                        className="view-link" 
                        onClick={() => handleViewCode(item.questionId._id, item.questionId.title)}
                        disabled={loadingCode}
                      >
                        View Code
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 12 }}>
              <Link to="/streak/history" className="leaderboard-link">View full history →</Link>
            </div>
          </div>
        </aside>
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
    </div>
  );
};

export default StreakPage;
