import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCode, FiArrowRight, FiCheck } from 'react-icons/fi';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      alert('🎉 Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side - Branding */}
        <div className="signup-branding">
          <div className="branding-content">
            <div className="brand-icon">
              <FiCode className="code-icon" />
            </div>
            <h1 className="brand-title">Join Coding Hub</h1>
            <p className="brand-subtitle">
              Start your coding journey with AI-powered learning and practice
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <FiCheck className="check-icon" />
                <span>Free forever - No credit card required</span>
              </div>
              <div className="feature-item">
                <FiCheck className="check-icon" />
                <span>Access to all learning resources</span>
              </div>
              <div className="feature-item">
                <FiCheck className="check-icon" />
                <span>Track your progress & streaks</span>
              </div>
              <div className="feature-item">
                <FiCheck className="check-icon" />
                <span>Join our coding community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="signup-form-section">
          <div className="signup-form-container">
            <div className="signup-header">
              <h2 className="signup-title">Create Account</h2>
              <p className="signup-subtitle">Sign up to start learning today</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="At least 6 characters"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                className="signup-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>

            <div className="login-prompt">
              <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
