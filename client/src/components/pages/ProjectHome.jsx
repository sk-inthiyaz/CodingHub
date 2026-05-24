import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectHome.css";

function ProjectHome() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ph-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".ph-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ph-root">
      {/* Animated background */}
      <div className="ph-bg-effects">
        <div className="ph-orb ph-orb-1"></div>
        <div className="ph-orb ph-orb-2"></div>
        <div className="ph-orb ph-orb-3"></div>
        <div className="ph-grid-overlay"></div>
      </div>

      <main className="ph-main">
        {/* Hero Section */}
        <section className="ph-hero" id="hero" ref={heroRef}>
          <div className="ph-hero-left">
            <div className="ph-hero-badge ph-animate">
              <span className="ph-badge-icon">⚡</span>
              <span>AI-Powered Learning Platform</span>
            </div>

            <h1 className="ph-hero-title ph-animate">
              Master Code.
              <span className="ph-hero-gradient"> Build Skills.</span>
              <span className="ph-hero-gradient-alt"> Ship Faster.</span>
            </h1>

            <p className="ph-hero-subtitle ph-animate">
              Your all-in-one coding workspace — AI assistant, LeetCode-style practice,
              daily streak challenges, interactive tutorials, and a vibrant developer community.
            </p>

            <div className="ph-hero-actions ph-animate">
              <button
                className="ph-btn ph-btn-primary"
                onClick={() => navigate("/chat")}
                id="hero-cta-primary"
              >
                <span className="ph-btn-shine"></span>
                🚀 Start Coding with AI
              </button>
              <button
                className="ph-btn ph-btn-glass"
                onClick={() => navigate("/LearnHub")}
                id="hero-cta-secondary"
              >
                📚 Explore LearnHub
              </button>
            </div>

            <div className="ph-hero-stats ph-animate">
              <div className="ph-stat">
                <span className="ph-stat-num">500+</span>
                <span className="ph-stat-label">Practice Problems</span>
              </div>
              <div className="ph-stat-divider"></div>
              <div className="ph-stat">
                <span className="ph-stat-num">4</span>
                <span className="ph-stat-label">Languages</span>
              </div>
              <div className="ph-stat-divider"></div>
              <div className="ph-stat">
                <span className="ph-stat-num">🔥</span>
                <span className="ph-stat-label">Daily Streaks</span>
              </div>
            </div>
          </div>

          <div className="ph-hero-right ph-animate">
            <div className="ph-terminal">
              <div className="ph-terminal-header">
                <div className="ph-terminal-dots">
                  <span className="ph-tdot ph-tdot-red"></span>
                  <span className="ph-tdot ph-tdot-yellow"></span>
                  <span className="ph-tdot ph-tdot-green"></span>
                </div>
                <span className="ph-terminal-title">AI Coding Assistant</span>
              </div>
              <div className="ph-terminal-body">
                <div className="ph-chat-msg ph-msg-user ph-type-animate" style={{"--delay": "0.3s"}}>
                  <span className="ph-msg-avatar">👤</span>
                  <div className="ph-msg-bubble">"Explain binary search with time complexity"</div>
                </div>
                <div className="ph-chat-msg ph-msg-ai ph-type-animate" style={{"--delay": "0.8s"}}>
                  <span className="ph-msg-avatar">🤖</span>
                  <div className="ph-msg-bubble">
                    <span className="ph-code-tag">Binary Search</span> divides the search space in half each step.
                    <br/>Time: <span className="ph-highlight">O(log n)</span> · Space: <span className="ph-highlight">O(1)</span>
                  </div>
                </div>
                <div className="ph-chat-msg ph-msg-user ph-type-animate" style={{"--delay": "1.3s"}}>
                  <span className="ph-msg-avatar">👤</span>
                  <div className="ph-msg-bubble">"Generate it in Java"</div>
                </div>
                <div className="ph-chat-msg ph-msg-ai ph-type-animate" style={{"--delay": "1.8s"}}>
                  <span className="ph-msg-avatar">🤖</span>
                  <div className="ph-msg-bubble">
                    <div className="ph-code-block">
                      <code>
                        {`int binarySearch(int[] arr, int target) {\n  int lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (arr[mid] == target) return mid;\n    else if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="ph-features" id="features">
          <div className="ph-section-header ph-animate">
            <span className="ph-section-badge">Features</span>
            <h2 className="ph-section-title">Everything you need to level up</h2>
            <p className="ph-section-sub">
              From AI-powered explanations to competitive daily streaks — CodingHub is designed
              to make you a better developer, every single day.
            </p>
          </div>

          <div className="ph-features-grid">
            <div className="ph-feature-card ph-animate" onClick={() => navigate("/chat")}>
              <div className="ph-feature-icon ph-fi-1">🤖</div>
              <h3>AI Coding Assistant</h3>
              <p>Get instant code explanations, generate solutions in any language, and learn concepts with AI.</p>
              <span className="ph-feature-link">Try it →</span>
            </div>

            <div className="ph-feature-card ph-animate" onClick={() => navigate("/practice")}>
              <div className="ph-feature-icon ph-fi-2">💻</div>
              <h3>Practice Problems</h3>
              <p>500+ curated problems with an in-browser code editor, auto-testing, and detailed solutions.</p>
              <span className="ph-feature-link">Start solving →</span>
            </div>

            <div className="ph-feature-card ph-animate" onClick={() => navigate("/streak")}>
              <div className="ph-feature-icon ph-fi-3">🔥</div>
              <h3>Daily Streak Challenge</h3>
              <p>Solve daily problems, maintain your streak, earn badges, and climb the leaderboard.</p>
              <span className="ph-feature-link">Join the streak →</span>
            </div>

            <div className="ph-feature-card ph-animate" onClick={() => navigate("/LearnHub")}>
              <div className="ph-feature-icon ph-fi-4">📚</div>
              <h3>Interactive Tutorials</h3>
              <p>Learn Java, Python, C++, JavaScript with video tutorials and GeeksforGeeks guides.</p>
              <span className="ph-feature-link">Start learning →</span>
            </div>

            <div className="ph-feature-card ph-animate" onClick={() => navigate("/discussions")}>
              <div className="ph-feature-icon ph-fi-5">💬</div>
              <h3>Community Discussions</h3>
              <p>Ask questions, share solutions, vote on answers, and learn from fellow developers.</p>
              <span className="ph-feature-link">Join discussions →</span>
            </div>

            <div className="ph-feature-card ph-animate" onClick={() => navigate("/profile")}>
              <div className="ph-feature-icon ph-fi-6">📊</div>
              <h3>Progress Tracking</h3>
              <p>Heatmaps, streak history, solved problems tracker, and detailed performance analytics.</p>
              <span className="ph-feature-link">View profile →</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="ph-how" id="how">
          <div className="ph-section-header ph-animate">
            <span className="ph-section-badge">How It Works</span>
            <h2 className="ph-section-title">Three steps to better code</h2>
          </div>

          <div className="ph-steps">
            <div className="ph-step ph-animate">
              <div className="ph-step-number">01</div>
              <h3>Learn</h3>
              <p>Pick a language, choose a topic, and learn through curated video tutorials and articles.</p>
            </div>
            <div className="ph-step-connector"></div>
            <div className="ph-step ph-animate">
              <div className="ph-step-number">02</div>
              <h3>Practice</h3>
              <p>Solve problems in our in-browser editor with real-time test execution and AI-powered hints.</p>
            </div>
            <div className="ph-step-connector"></div>
            <div className="ph-step ph-animate">
              <div className="ph-step-number">03</div>
              <h3>Compete</h3>
              <p>Maintain daily streaks, earn badges, climb leaderboards, and build an unbreakable coding habit.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="ph-cta ph-animate">
          <div className="ph-cta-content">
            <h2>Ready to write better code?</h2>
            <p>Join CodingHub and start your journey to becoming a stronger developer today.</p>
            <div className="ph-cta-actions">
              <button
                className="ph-btn ph-btn-primary ph-btn-lg"
                onClick={() => navigate("/signup")}
                id="cta-signup"
              >
                <span className="ph-btn-shine"></span>
                Get Started Free
              </button>
              <button
                className="ph-btn ph-btn-glass ph-btn-lg"
                onClick={() => navigate("/chat")}
                id="cta-demo"
              >
                Try AI Assistant
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="ph-footer">
        <div className="ph-footer-content">
          <span className="ph-footer-brand">⚡ CodingHub</span>
          <span className="ph-footer-text">Built for serious practice and clean code.</span>
        </div>
      </footer>
    </div>
  );
}

export default ProjectHome;