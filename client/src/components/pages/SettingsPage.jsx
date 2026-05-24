import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import { FiLock, FiBell, FiTrash2, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    streakReminders: true,
    discussionUpdates: true
  });

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Load user settings
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || {
          emailNotifications: true,
          streakReminders: true,
          discussionUpdates: true
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/settings/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password. Please try again.' });
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notifications })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification settings updated!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating settings. Please try again.' });
      console.error('Error updating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (deleteConfirmation !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm' });
      return;
    }

    if (!window.confirm('Are you absolutely sure? This action cannot be undone!')) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.API_BASE_URL}/api/settings/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your account has been deleted successfully');
        navigate('/login');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting account. Please try again.' });
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('password');
              setMessage({ type: '', text: '' });
            }}
          >
            <FiLock /> Change Password
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('notifications');
              setMessage({ type: '', text: '' });
            }}
          >
            <FiBell /> Notifications
          </button>
          <button
            className={`settings-tab ${activeTab === 'delete' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('delete');
              setMessage({ type: '', text: '' });
            }}
          >
            <FiTrash2 /> Delete Account
          </button>
        </div>

        {message.text && (
          <div className={`settings-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-content">
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="settings-form">
              <h2>Change Password</h2>
              <p className="settings-description">
                Update your password to keep your account secure
              </p>

              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="settings-submit-btn" disabled={loading}>
                <FiSave /> {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationUpdate} className="settings-form">
              <h2>Notification Preferences</h2>
              <p className="settings-description">
                Manage how you receive notifications
              </p>

              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email updates about your activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                      disabled={loading}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Streak Reminders</h3>
                    <p>Get reminded to maintain your daily streak</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.streakReminders}
                      onChange={(e) => setNotifications({ ...notifications, streakReminders: e.target.checked })}
                      disabled={loading}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Discussion Updates</h3>
                    <p>Notifications when someone replies to your discussions</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.discussionUpdates}
                      onChange={(e) => setNotifications({ ...notifications, discussionUpdates: e.target.checked })}
                      disabled={loading}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <button type="submit" className="settings-submit-btn" disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          )}

          {activeTab === 'delete' && (
            <form onSubmit={handleDeleteAccount} className="settings-form delete-form">
              <h2>Delete Account</h2>
              <div className="danger-zone">
                <p className="settings-description danger-text">
                  ⚠️ Warning: This action is permanent and cannot be undone!
                </p>
                <p className="settings-description">
                  Deleting your account will:
                </p>
                <ul className="delete-info-list">
                  <li>Permanently delete all your data</li>
                  <li>Remove all your submissions and progress</li>
                  <li>Delete your discussions and comments</li>
                  <li>Erase your streak history</li>
                </ul>

                <div className="form-group">
                  <label>Type "DELETE" to confirm</label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE"
                    disabled={loading}
                    className="delete-confirmation-input"
                  />
                </div>

                <button type="submit" className="settings-submit-btn delete-btn" disabled={loading}>
                  <FiTrash2 /> {loading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
