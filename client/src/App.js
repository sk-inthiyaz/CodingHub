import React, { useState, useRef, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import ChatPage from "./components/pages/ChatPage";
import LearnHubMainPage from './components/pages/LearnHubMainPage';
import AskAIDoubts from './components/pages/AskAIDoubts';
import AICodingAssistant from './components/pages/AICodingAssistant';

import ProjectHome from "./components/pages/ProjectHome";

// Practice Components
import PracticeSelection from './components/practiceWithAI/PracticeSelection';
import PracticeLanding from './components/practiceWithAI/PracticeLanding';
import ProblemPage from './components/practiceWithAI/ProblemPage';
import AIFeedback from './components/practiceWithAI/AIFeedback';
import PracticeCodeEditor from './components/practiceWithAI/PracticeCodeEditor';

// Learning Components
import StartLearningMain from './components/startLearningComponent/data/StartLearningMain';

//Streak realted
// Admin Components
import AdminDashboard from './components/pages/AdminDashboard';
import AdminStreakDashboard from './components/StreakQuestion/AdminStreakDashboard';
import AdminPanel from './components/StreakQuestion/AdminPanel';
//StreakUserCard
import StreakPage from "./components/StreakQuestion/StreakPage";
import SolvePage from "./components/StreakQuestion/SolvePage";
import Leaderboard from "./components/StreakQuestion/Leaderboard";
import StreakHistory from "./components/StreakQuestion/StreakHistory";

// NEW: Interactive Practice Components
import ProblemsList from './components/Practice/ProblemsList';
import ProblemDetail from './components/Practice/ProblemDetail';
import CodeEditorPractice from './components/Practice/CodeEditorPractice';
import PracticeDashboard from './components/Practice/PracticeDashboard';
import AdminPracticeProblems from './components/Practice/AdminPracticeProblems';
import InteractivePractice from './components/pages/InteractivePractice';
import ProgressTrackerPage from './components/pages/ProgressTrackerPage';
import DiscussionListPage from './components/DiscussionListPage';
import NewDiscussionPage from './components/NewDiscussionPage';
import DiscussionDetailPage from './components/DiscussionDetailPage';
import ProfilePage from './components/pages/ProfilePage';
import SettingsPage from './components/pages/SettingsPage';
import AboutPage from './components/pages/AboutPage';

// Styles
import './index.css';
import './styles/theme.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const textareaRef = useRef(null);
  
  // Initialize theme state
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark', savedTheme);
    return savedTheme;
  });

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      document.body.classList.toggle('dark', newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  // Load messages from local storage on component mount or when user changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userId = user._id || user.userId;
      const savedMessages = localStorage.getItem(`chatMessages_${userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Optional: Set an initial message if no history exists
        setMessages([{ role: "ai", content: "This is AI Coding Assistance . Please enter code to get an explanation." }]);
      }
    } else {
      // Clear messages if user logs out
      setMessages([]);
    }
  }, []);

  // Save messages to local storage whenever messages state changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && messages.length > 0) {
      localStorage.setItem(`chatMessages_${user.userId}`, JSON.stringify(messages));
    }
  }, [messages]);

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Max height of 300px
    }
  };

  // Adjust height when input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputCode]);

  const handleExplain = async () => {
    if (!inputCode.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ code: inputCode })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.explanation }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, there was an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className={`app-container ${isDark ? 'dark' : 'light'}`}>
          <Toaster position="top-right" gutter={8} toastOptions={{ duration: 3000 }} />
          <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <main>
            <Routes>
              <Route path="/new-home" element={<ProjectHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/admin/dashboard/streak" 
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminStreakDashboard />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/admin/dashboard/practice-problems" 
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminPracticeProblems />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <ChatPage 
                      messages={messages}
                      setMessages={setMessages}
                      inputCode={inputCode}
                      setInputCode={setInputCode}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      textareaRef={textareaRef}
                      handleExplain={handleExplain}
                      isDark={isDark}
                    />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/LearnHub" 
                element={
                  <PrivateRoute>
                    <LearnHubMainPage isDark={isDark} />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/learnhub/topics" 
                element={
                  <PrivateRoute>
                    <StartLearningMain isDark={isDark} />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/learnhub/practice" 
                element={
                  <PrivateRoute>
                    <PracticeSelection isDark={isDark} />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/practice-code-editor" 
                element={
                  <PrivateRoute>
                    <PracticeCodeEditor isDark={isDark} />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/learnhub/askai" 
                element={
                  <PrivateRoute>
                    <AskAIDoubts isDark={isDark} />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/assistant" 
                element={
                  <PrivateRoute>
                    <AICodingAssistant />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/streak" 
                element={
                  <PrivateRoute>
                    <StreakPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/streak/solve" 
                element={
                  <PrivateRoute>
                    <SolvePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/streak/leaderboard" 
                element={
                  <PrivateRoute>
                    <Leaderboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/streak/history" 
                element={
                  <PrivateRoute>
                    <StreakHistory />
                  </PrivateRoute>
                } 
              />
              
              {/* NEW: Interactive Practice Routes */}
              <Route 
                path="/practice" 
                element={
                  <PrivateRoute>
                    <InteractivePractice />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/practice/problems" 
                element={
                  <PrivateRoute>
                    <ProblemsList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/practice/problems/:id" 
                element={
                  <PrivateRoute>
                    <ProblemDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/practice/editor" 
                element={
                  <PrivateRoute>
                    <CodeEditorPractice />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/practice/dashboard" 
                element={
                  <PrivateRoute>
                    <PracticeDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <PrivateRoute>
                    <ProgressTrackerPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/discussions" 
                element={
                  <PrivateRoute>
                    <DiscussionListPage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/discussions/new" 
                element={
                  <PrivateRoute>
                    <NewDiscussionPage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/discussions/:id" 
                element={
                  <PrivateRoute>
                    <DiscussionDetailPage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/user/:userId" 
                element={
                  <PrivateRoute>
                    <ProfilePage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <SettingsPage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PrivateRoute>
                    <AboutPage isDark={isDark} />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;