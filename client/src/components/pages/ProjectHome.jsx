import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectHome.css";

function ProjectHome() {
  const navigate = useNavigate();

  return (
    <div className="ph-root">
      {/* Section 1: Hero */}
      <main className="ph-main">
        <section className="ph-hero" id="hero">
          <div className="ph-hero-left">
            <div className="ph-hero-eyebrow">
              <span className="ph-hero-mark">{`</>`}</span>
              Coding Hub
            </div>
            <h1 className="ph-hero-title">
              Understand, Practice, and Ship Code
              <span className="ph-hero-highlight"> Faster with AI.</span>
            </h1>
            <p className="ph-hero-subtitle">
              Coding Hub is your all‑in‑one workspace for
              reading code, solving LeetCode‑style problems,
              tracking daily practice streaks, and managing question banks
              — with production‑grade admin tools on top.
            </p>

            <div className="ph-hero-actions">
              <button
                className="ph-btn ph-btn-primary"
                onClick={() => navigate("/")}
              >
                Open AI Coding Assistant
              </button>
              <button
                className="ph-btn ph-btn-ghost"
                onClick={() => navigate("/LearnHub")}
              >
                Explore LearnHub
              </button>
            </div>

            <div className="ph-hero-metrics">
              <div className="ph-metric">
                <span className="ph-metric-number">500+</span>
                <span className="ph-metric-label">Practice Problems</span>
              </div>
              <div className="ph-metric">
                <span className="ph-metric-number">5</span>
                <span className="ph-metric-label">Daily Question Flow</span>
              </div>
              <div className="ph-metric">
                <span className="ph-metric-number">Streak</span>
                <span className="ph-metric-label">Built‑in Tracker</span>
              </div>
            </div>
          </div>

          {/* Right hero: visual summary of your system */}
          <div className="ph-hero-right">
            <div className="ph-card ph-card-chat">
              <div className="ph-card-header">
                <span className="ph-dot ph-dot-red" />
                <span className="ph-dot ph-dot-yellow" />
                <span className="ph-dot ph-dot-green" />
                <span className="ph-card-title">AI Coding Assistant</span>
              </div>
              <div className="ph-card-body">
                <div className="ph-chat-bubble ph-chat-user">
                  “Explain this recursion step by step.”
                </div>
                <div className="ph-chat-bubble ph-chat-ai">
                  I’ll walk through the call stack, base case,
                  and time complexity in plain English.
                </div>
                <div className="ph-chat-bubble ph-chat-user">
                  “Generate a DFS solution in Java.”
                </div>
                <div className="ph-chat-bubble ph-chat-ai">
                  Here is a runnable DFS function, plus usage and
                  complexity analysis.
                </div>
              </div>
            </div>

            <div className="ph-card-grid">
              <div className="ph-mini-card">
                <h3>Practice System</h3>
                <p>
                  Curated JSON question sets, 5‑question daily drills,
                  and LeetCode‑style flows wired to your UI.
                </p>
              </div>
              <div className="ph-mini-card">
                <h3>Admin Dashboard</h3>
                <p>
                  Upload problems, manage streak rules, and debug
                  question visibility with dedicated admin screens.
                </p>
              </div>
              <div className="ph-mini-card">
                <h3>Streak & History</h3>
                <p>
                  Track progress across days, view chat history,
                  and keep a clean record of every coding session.
                </p>
              </div>
              <div className="ph-mini-card">
                <h3>Error‑Proofed Setup</h3>
                <p>
                  End‑to‑end docs for fixing 400/500 errors, auth flows,
                  and dark‑mode behaviour in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Three main columns that mirror the app */}
        <section className="ph-section ph-pillar-section" id="features">
          <h2 className="ph-section-title">Everything your Coding Hub workflow needs</h2>
          <p className="ph-section-subtitle">
            This project isn’t just a chat. It’s a full learning
            environment: AI‑assisted explanation, structured practice,
            and operational tooling for real users and admins.
          </p>

          <div className="ph-pillars">
            <div className="ph-pillar">
              <h3>1. AI Coding Assistant</h3>
              <ul>
                <li>Generate complete, runnable solutions in your language of choice.</li>
                <li>Explain existing code, line by line, with complexity analysis.</li>
                <li>Teach core CS concepts with short, focused examples.</li>
              </ul>
            </div>
            <div className="ph-pillar">
              <h3>2. LearnHub & Daily Practice</h3>
              <ul>
                <li>Start Learning: topic‑based guided content.</li>
                <li>Interactive Coding Practice with in‑browser editor.</li>
                <li>Solve streak questions and maintain daily discipline.</li>
                <li>Progress Tracker and Discussions to stay accountable.</li>
              </ul>
            </div>
            <div className="ph-pillar">
              <h3>3. Admin & Operations</h3>
              <ul>
                <li>Admin dashboard for uploading and validating problems.</li>
                <li>Debug guides for “questions not showing” and 500 errors.</li>
                <li>Documentation index that explains every major module.</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Section 3: Screens / cards for key flows */}
        <section className="ph-section ph-screens-section" id="screens">
          <div className="ph-screens-grid">
            <article className="ph-screen-card">
              <h3>Daily Streak Questions</h3>
              <p>
                A focused 5‑question flow powered by your streak engine.
                Perfect for recruiters to see discipline and consistency.
              </p>
              <ul>
                <li>Curated problems surfaced every day.</li>
                <li>Visual streak timeline and history.</li>
                <li>Designed to make “one day at a time” easy.</li>
              </ul>
            </article>

            <article className="ph-screen-card">
              <h3>Interactive Practice</h3>
              <p>
                A dedicated playground with problem lists, editor, and AI
                feedback that mirrors real interview preparation.
              </p>
              <ul>
                <li>Browse problems, open details, and code in the browser.</li>
                <li>Request AI feedback on correctness and complexity.</li>
                <li>Built on top of your Practice and LeetCode‑style flows.</li>
              </ul>
            </article>

            <article className="ph-screen-card">
              <h3>Admin, Settings & Profile</h3>
              <p>
                A full operational layer on top of the learning experience
                so real users and admins can manage the system safely.
              </p>
              <ul>
                <li>Admin upload flows for practice and streak questions.</li>
                <li>Settings page for theme, preferences, and behaviour.</li>
                <li>Profile view with progress, discussions, and history.</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Section 4: Why Coding Hub? (recruiter view) */}
        <section className="ph-section ph-why-section" id="why">
          <h2 className="ph-section-title">Why Coding Hub stands out for recruiters</h2>
          <p className="ph-section-subtitle">
            This isn&apos;t a demo toy. It&apos;s a small production system:
            multiple routes, auth flows, admin tooling, and a deep
            documentation set backing the UI.
          </p>
          <div className="ph-why-grid">
            <div className="ph-why-card">
              <h3>Solid Architecture</h3>
              <ul>
                <li>Clear separation between assistant, LearnHub, and admin tools.</li>
                <li>React + React Router structure with private routes for auth.</li>
                <li>JSON‑driven question banks for practice and streak modules.</li>
              </ul>
            </div>
            <div className="ph-why-card">
              <h3>Error‑Handling & Reliability</h3>
              <ul>
                <li>Dedicated 400/500 error guides and fix summaries.</li>
                <li>Resilient chat history and delete flows for the assistant.</li>
                <li>Dark mode and UI states tuned for real‑world usage.</li>
              </ul>
            </div>
            <div className="ph-why-card">
              <h3>Auth & User Experience</h3>
              <ul>
                <li>Login, signup, forgot password, and reset flows implemented.</li>
                <li>Profile and settings pages that mirror SaaS patterns.</li>
                <li>LearnHub routes that feel like a cohesive learning product.</li>
              </ul>
            </div>
            <div className="ph-why-card">
              <h3>Documentation Culture</h3>
              <ul>
                <li>Rich README and index files describing flows and decisions.</li>
                <li>Admin and implementation guides for each major feature.</li>
                <li>Perfect for recruiters to inspect how you think as an engineer.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Simple footer */}
      <footer className="ph-footer">
        <span>Coding Hub · Built for serious practice and clean code.</span>
      </footer>
    </div>
  );
}

export default ProjectHome;