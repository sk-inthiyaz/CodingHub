import React from "react";
import { Link } from "react-router-dom";
import {
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiCpu,
  FiZap,
  FiCompass,
  FiMessageCircle,
  FiClock,
  FiRadio,
  FiCheck
} from "react-icons/fi";
import "./AboutPage.css";

const stats = [
  { icon: FiUsers, label: "Community Members", value: "12K+" },
  { icon: FiTrendingUp, label: "Daily Streaks Kept", value: "48K" },
  { icon: FiCpu, label: "AI Sessions", value: "220K" },
  { icon: FiShield, label: "Secure Resets", value: "6.2K" }
];

const pillars = [
  {
    icon: FiTarget,
    title: "Personalised Mastery",
    description:
      "Adaptive learning paths through LearnHub topics, curated streak challenges, and dynamic progress tracking that keep you growing every single day."
  },
  {
    icon: FiCompass,
    title: "Guided Practice",
    description:
      "Hands-on practice modes spanning algorithm drills, interview prep, and AI feedback loops so you can learn by doing in real time."
  },
  {
    icon: FiMessageCircle,
    title: "Collaborative Community",
    description:
      "Discussion forums, peer explanations, and admin-managed streak reminders that keep learners connected and accountable."
  },
  {
    icon: FiShield,
    title: "Enterprise-Grade Safety",
    description:
      "JWT-secured sessions, hashed credentials, tokenised password recovery, and granular notification controls safeguard every interaction."
  }
];

const milestones = [
  {
    phase: "Foundation",
    caption: "AI Code explanations across 25+ languages with contextual history."
  },
  {
    phase: "Engagement",
    caption: "Introduced streak gamification, LearnHub journeys, and topic playlists."
  },
  {
    phase: "Productivity",
    caption: "Shipped admin dashboards, auto-import tooling, and question upload pipelines."
  },
  {
    phase: "Experience",
    caption: "Crafted immersive layouts, theme-aware design, and consolidated Coding Hub branding."
  }
];

const featureHighlights = [
  "Full-stack AI chat with persistent context and shareable history",
  "LearnHub pathways covering theory, visuals, and practice modules",
  "Interactive coding workspace with AI debugging and solution reviews",
  "Daily streak manager with automated question distribution and reminders",
  "Admin tooling for question uploads, user management, and progress oversight",
  "Secure authentication flow with password reset, notifications, and account controls"
];

const AboutPage = ({ isDark }) => {
  return (
    <div className={`about-page ${isDark ? "dark-mode" : ""}`}>
      <section className="about-hero">
        <div className="hero-gradient" />
        <div className="hero-content">
          <span className="hero-tag">All-in-one coding accelerator</span>
          <h1 className="hero-title">Welcome to Coding Hub</h1>
          <p className="hero-subtitle">
            We built Coding Hub so every learner can decode complex problems, practice with confidence, and stay
            motivated through thoughtful guidance. From AI explanations to streak challenges, each module is crafted to
            make you unstoppable.
          </p>
          <div className="hero-actions">
            <Link to="/LearnHub" className="hero-button primary">Explore LearnHub</Link>
            <Link to="/practice" className="hero-button ghost">Jump into Practice</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit">
            <span className="orbit-dot" />
            <span className="orbit-dot" />
            <span className="orbit-dot" />
          </div>
          <div className="floating-card">
            <FiRadio />
            <p>Realtime AI explanations
              <span>Secured & contextual</span>
            </p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map(({ icon: Icon, label, value }, idx) => (
            <article
              key={label}
              className="stat-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="stat-icon">
                <Icon />
              </div>
              <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pillars-section">
        <h2>Our Product Pillars</h2>
        <p className="section-lead">
          Coding Hub is the unified experience of six major feature tracks crafted, iterated, and polished during this
          build. Each one solves a critical learner or admin workflow so the ecosystem stays cohesive.
        </p>
        <div className="pillars-grid">
          {pillars.map(({ icon: Icon, title, description }, idx) => (
            <article
              key={title}
              className="pillar-card"
              style={{ animationDelay: `${0.15 * idx}s` }}
            >
              <div className="pillar-icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="highlights-section">
        <div className="highlights-left">
          <h2>Everything we shipped</h2>
          <p>
            From architectural foundations to polished UI, Coding Hub reflects a production-ready system. We obsess over
            the details so every workflow feels purposeful, and every learner gets a premium experience.
          </p>
          <ul className="highlights-list">
            {featureHighlights.map((item, idx) => (
              <li key={item} style={{ animationDelay: `${0.1 * idx}s` }}>
                <FiCheck className="check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="highlights-timeline">
          {milestones.map(({ phase, caption }, idx) => (
            <div key={phase} className="timeline-card" style={{ animationDelay: `${0.12 * idx}s` }}>
              <span className="timeline-badge">{phase}</span>
              <p>{caption}</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="experience-section">
        <div className="experience-card" style={{ animationDelay: "0.1s" }}>
          <h2>Experience-first engineering</h2>
          <p>
            Every screen—from login flows to admin dashboards—was reimagined with accessibility, responsiveness, and dark
            mode fidelity in mind. We leaned into micro-interactions, cohesive typography, and a softer visual language
            to create a professional, calming workspace.
          </p>
          <div className="experience-meta">
            <div>
              <FiZap />
              <span>Lightning-fast AI replies powered by Node & Gemini integrations.</span>
            </div>
            <div>
              <FiClock />
              <span>Session persistence with cached transcripts and replayable context.</span>
            </div>
            <div>
              <FiShield />
              <span>Security-first mindset with protected routes and admin-only actions.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to continue the journey?</h2>
          <p>
            Dive back into LearnHub, tackle a streak challenge, or spin up a new AI session. Coding Hub is built for
            everyday practice and long-term mastery—stay curious and keep building.
          </p>
          <div className="cta-actions">
            <Link to="/streak" className="hero-button primary">Resume Streak</Link>
            <Link to="/discussions" className="hero-button ghost">Join Discussions</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
