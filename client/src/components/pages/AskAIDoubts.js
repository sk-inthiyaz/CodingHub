import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaCopy, FaRobot, FaUser, FaLightbulb, FaCode, FaBook, FaBug, FaTrash, FaSave, FaDownload } from 'react-icons/fa';
import './AskAIDoubts.css';

const AskAIDoubts = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const categories = [
    { id: 'code-explain', name: 'Code Explanation', icon: '�', color: '#3b82f6' },
    { id: 'debugging', name: 'Debug & Fix', icon: '🐞', color: '#ef4444' },
    { id: 'algorithms', name: 'Algorithm Help', icon: '🧠', color: '#8b5cf6' },
    { id: 'problem-solving', name: 'Problem Solving', icon: '⚡', color: '#10b981' },
    { id: 'best-practices', name: 'Code Review', icon: '⭐', color: '#f59e0b' },
    { id: 'optimization', name: 'Optimization', icon: '�', color: '#6366f1' }
  ];

  const quickPrompts = [
    "Explain this code snippet...",
    "How can I optimize this algorithm?",
    "Debug this error...",
    "Help me solve this coding problem...",
    "Review my code for best practices...",
    "Convert this code to another language..."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      category: selectedCategory,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: inputMessage,
          context: `This is a ${categories.find(c => c.id === selectedCategory)?.name} question. Please provide a detailed explanation.`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.explanation,
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const saveConversation = () => {
    const conversation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      category: selectedCategory,
      messages: messages
    };
    
    const saved = JSON.parse(localStorage.getItem('savedConversations') || '[]');
    saved.push(conversation);
    localStorage.setItem('savedConversations', JSON.stringify(saved));
    
    alert('Conversation saved successfully!');
  };

  const exportConversation = () => {
    const content = messages.map(msg => 
      `[${msg.timestamp}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-doubts-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  const selectQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="ask-ai-container">
      {/* Header */}
      <div className="ask-ai-header">
        <div className="header-content">
          <div className="header-title">
            <FaRobot className="header-icon" />
            <h1>Ask AI Doubts</h1>
            <span className="beta-badge">BETA</span>
          </div>
          <p className="header-subtitle">
            Get instant answers to your programming questions with AI-powered explanations
          </p>
        </div>
        
        {/* Conversation Actions */}
        {messages.length > 0 && (
          <div className="conversation-actions">
            <button onClick={saveConversation} className="action-btn save-btn">
              <FaSave /> Save
            </button>
            <button onClick={exportConversation} className="action-btn export-btn">
              <FaDownload /> Export
            </button>
            <button onClick={clearConversation} className="action-btn clear-btn">
              <FaTrash /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Category Selector */}
      <div className="category-selector">
        <h3>Question Category:</h3>
        <div className="category-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ '--category-color': category.color }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="quick-prompts">
          <h3>Quick Start Prompts:</h3>
          <div className="prompts-grid">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-btn"
                onClick={() => selectQuickPrompt(prompt)}
              >
                <FaLightbulb className="prompt-icon" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <FaRobot className="empty-icon" />
            <h3>Ready to help with your coding doubts!</h3>
            <p>Ask any programming question and get detailed AI-powered explanations.</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}-message`}>
                <div className="message-header">
                  <div className="message-avatar">
                    {message.role === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className="message-info">
                    <span className="message-sender">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="message-time">{message.timestamp}</span>
                    <span className="message-category">
                      {categories.find(c => c.id === message.category)?.icon} 
                      {categories.find(c => c.id === message.category)?.name}
                    </span>
                  </div>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(message.content)}
                    title="Copy message"
                  >
                    <FaCopy />
                  </button>
                </div>
                <div className={`message-content ${message.isError ? 'error' : ''}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai-message loading">
                <div className="message-header">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-info">
                    <span className="message-sender">AI Assistant</span>
                  </div>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask your ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} question here...`}
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className="input-tips">
          <span>💡 Tip: Be specific about your problem for better answers</span>
          <span>⌨️ Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default AskAIDoubts;
