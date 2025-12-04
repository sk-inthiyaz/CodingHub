import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import leftArrow from './images/left-arrow (1).png';
import "./Navbar.css";

const Navbar = ({ isDark, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define routes where back button should appear
  const routesWithBackButton = [
    '/learnhub/topics',
    '/practice',
    '/streak',
    '/progress',
    '/discussions',
    '/profile'
  ];

  // Check if current route matches any of the routes with back button
  const showBackButton = routesWithBackButton.some(route => 
    location.pathname.toLowerCase().startsWith(route.toLowerCase())
  );

  const handleBackClick = () => {
    navigate('/LearnHub');
  };

  const handleTitleClick = () => {
    navigate('/new-home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-inner">
        <div className="navbar-left-group">
          {showBackButton && (
            <button className="navbar-back-btn" onClick={handleBackClick}>
              <img src={leftArrow} alt="Back" />
            </button>
          )}
          <span className="navbar-title" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
            Coding Hub
          </span>
        </div>
        <div className="navbar-right-group">
          {user && (
            <span className="navbar-welcome">Welcome, {user.name}</span>
          )}
          {user && (
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          )}
          <button
            className="navbar-darkmode-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
