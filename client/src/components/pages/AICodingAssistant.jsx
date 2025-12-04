import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaCopy } from 'react-icons/fa';
import './AICodingAssistant.css';

// Mode presets: Generate Code, Explain Code, Explain Concepts
const MODES = [
  { id: 'generate', label: 'Generate Code' },
  { id: 'explain', label: 'Explain Code' },
  { id: 'concepts', label: 'Explain Concepts' },
];

const QUICK_PROMPTS = {
  generate: [
    'Generate DFS in Java',
    'Write a binary search in Python',
    'Implement Dijkstra in C++',
    'Build a React component for a todo list',
  ],
  explain: [
    'Explain this code and give time/space complexity',
    'Why does this recursion overflow? Explain step-by-step',
    'Explain two-pointer technique on this snippet',
  ],
  concepts: [
    'Explain time vs space complexity with examples',
    'What is dynamic programming? Give a simple example',
    'Explain Big-O for common operations',
  ],
};

function shapePrompt(mode, userText) {
  const base = userText.trim();
  if (!base) return '';

  switch (mode) {
    case 'generate':
      return `You are an AI coding assistant for our Coding Hub app. Generate complete, runnable code for: ${base}.
- Include function/class with clear names
- Add minimal required inputs and return values
- Provide brief usage example
- Avoid extra commentary unless essential
- Prefer standard library
- Add time and space complexity if algorithmic`;
    case 'explain':
      return `You are an AI code explainer for our Coding Hub app. Analyze the following code or request and provide:
- What it does (plain English)
- Step-by-step explanation
- Edge cases
- Time and space complexity
- Improvements or best practices
Code/request:\n${base}`;
    case 'concepts':
      return `You are an AI tutor for our Coding Hub app. Explain the concept clearly with:
- Definition
- Intuition
- Simple example (code if relevant)
- Common pitfalls
- Where it’s used in interviews/projects
Topic: ${base}`;
    default:
      return base;
  }
}

const AICodingAssistant = () => {
  const [mode, setMode] = useState('generate');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const adjustTextarea = () => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  };
  useEffect(adjustTextarea, [input]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      mode,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const prompt = shapePrompt(mode, trimmed);

    try {
      // Use existing backend explain endpoint to leverage AI
      const res = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ code: prompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.explanation || 'No response content',
        mode,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: 'Sorry, there was an error generating the response. Please try again.',
          mode,
          time: new Date().toLocaleTimeString(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  const setQuick = (q) => {
    setInput(q);
    setTimeout(send, 100);
  };

  return (
    <div className="assistant-root">
      <div className="assistant-header">
        <div className="title">
          <FaRobot />
          <h1>AI Coding Assistant</h1>
        </div>
        <p>Generate code, explain code, and clarify concepts — tailored for Coding Hub users.</p>
      </div>

      <div className="mode-tabs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`mode-tab ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="quick-row">
        {(QUICK_PROMPTS[mode] || []).map((q) => (
          <button key={q} className="quick-btn" onClick={() => setQuick(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-box">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="msg-head">
              <div className="avatar">{m.role === 'user' ? <FaUser /> : <FaRobot />}</div>
              <div className="meta">
                <span className="who">{m.role === 'user' ? 'You' : 'Assistant'}</span>
                <span className="time">{m.time}</span>
                <span className="mode-tag">{m.mode}</span>
              </div>
              <button className="copy" onClick={() => copy(m.content)} title="Copy"><FaCopy /></button>
            </div>
            <div className={`msg-body ${m.error ? 'error' : ''}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg ai loading">
            <div className="msg-head">
              <div className="avatar"><FaRobot /></div>
              <div className="meta"><span className="who">Assistant</span></div>
            </div>
            <div className="msg-body">
              <div className="typing"><span></span><span></span><span></span></div>
              Working on it...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            mode === 'generate'
              ? 'Describe the code to generate (e.g., Generate DFS in Java)'
              : mode === 'explain'
              ? 'Paste code or describe what needs explaining'
              : 'Enter a concept/topic to learn'
          }
          rows={1}
          disabled={loading}
        />
        <button className="send" onClick={send} disabled={loading || !input.trim()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default AICodingAssistant;
