import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import leftArrow from '../images/left-arrow (1).png';
import '../../styles/ProfilePage.css';

const MOCK_PROFILE = {
  name: 'Inthiyaz Khan',
  email: 'inthiyaz@example.com',
  phone: '+1 (555) 123-4567',
  country: 'India',
  college: 'Tech University',
  age: 22,
  joinedOn: '2024-01-15T00:00:00.000Z',
  codingLevel: 'Advanced Coder',
  codingLevelPercent: 72,
  avatarUrl: '',
  stats: {
    solvedPerWeek: [
      { week: 'Week 1', solved: 12 },
      { week: 'Week 2', solved: 18 },
      { week: 'Week 3', solved: 15 },
      { week: 'Week 4', solved: 22 }
    ],
    languageBreakdown: [
      { name: 'Java', value: 40 },
      { name: 'Python', value: 35 },
      { name: 'C++', value: 25 }
    ],
    difficultyBreakdown: [
      { name: 'Easy', easy: 28, medium: 0, hard: 0 },
      { name: 'Medium', easy: 0, medium: 16, hard: 0 },
      { name: 'Hard', easy: 0, medium: 0, hard: 6 }
    ],
    streakHistory: [
      { day: 'Mon', streak: 3 },
      { day: 'Tue', streak: 4 },
      { day: 'Wed', streak: 4 },
      { day: 'Thu', streak: 5 },
      { day: 'Fri', streak: 6 },
      { day: 'Sat', streak: 7 },
      { day: 'Sun', streak: 2 }
    ],
    heatmap: Array.from({ length: 140 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const learningTicks = Math.floor(Math.random() * 4);
      const practiceProblems = Math.floor(Math.random() * 3);
      const streakCompleted = Math.random() > 0.3 ? 1 : 0;
      const total = learningTicks + practiceProblems + streakCompleted;
      return {
        date: date.toISOString().split('T')[0],
        count: total,
        learningTicks,
        practiceProblems,
        streakCompleted
      };
    })
  }
};

const HEAT_LEVELS = [
  { threshold: 0, color: 'var(--heatmap-empty)' },
  { threshold: 1, color: 'var(--heatmap-low)' },
  { threshold: 3, color: 'var(--heatmap-medium)' },
  { threshold: 5, color: 'var(--heatmap-high)' },
  { threshold: 7, color: 'var(--heatmap-very-high)' }
];
const FALLBACK_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#312e81"/><circle cx="80" cy="62" r="34" fill="white" opacity="0.18"/><path d="M80 88c-24 0-44 17-44 38v12h88v-12c0-21-20-38-44-38z" fill="white" opacity="0.22"/><text x="50%" y="54%" text-anchor="middle" font-size="52" fill="white" font-family="Arial" dy="0.35em">AI</text></svg>'
)}`;
const PROFILE_PRIMARY_FIELDS = ['name', 'codingLevel', 'bio'];
const DETAIL_FIELDS = [
  { name: 'email', label: 'Email', type: 'email', visible: true },
  { name: 'phone', label: 'Phone', type: 'tel', visible: false },
  { name: 'location', label: 'Location', type: 'text', visible: false },
  { name: 'college', label: 'College', type: 'text', visible: false }
];
const FORM_FIELD_KEYS = [...PROFILE_PRIMARY_FIELDS, ...DETAIL_FIELDS.map((field) => field.name)];

const buildFormState = (source) => {
  const nextState = {};
  FORM_FIELD_KEYS.forEach((key) => {
    if (source && source[key] !== undefined && source[key] !== null) {
      nextState[key] = source[key];
    } else if (MOCK_PROFILE[key] !== undefined) {
      nextState[key] = MOCK_PROFILE[key];
    } else {
      nextState[key] = '';
    }
  });
  return nextState;
};

const ProfilePage = ({ isDark }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formValues, setFormValues] = useState(() => buildFormState(MOCK_PROFILE));
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) {
            setProfile({ ...MOCK_PROFILE, isNew: true });
            setFormValues(buildFormState(MOCK_PROFILE));
            setLoading(false);
          }
          return;
        }

        const endpoint = userId 
          ? `${window.API_BASE_URL}/api/profile/user/${userId}`
          : `${window.API_BASE_URL}/api/profile/me`;
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!mounted) return;

        const currentUser = JSON.parse(localStorage.getItem('user'));
        const isOwn = !userId || userId === (currentUser?._id || currentUser?.userId);
        setIsOwnProfile(isOwn);

        if (response.data) {
          const profileData = {
            ...response.data,
            // Ensure stats structure exists
            stats: response.data.stats || MOCK_PROFILE.stats
          };
          setProfile(profileData);
          setFormValues(buildFormState(response.data));
        } else {
          setProfile({ ...MOCK_PROFILE, isNew: true });
          setFormValues(buildFormState(MOCK_PROFILE));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        if (mounted) {
          // Use mock data as fallback
          setProfile({ ...MOCK_PROFILE, isNew: true });
          setFormValues(buildFormState(MOCK_PROFILE));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const activityGrid = useMemo(() => {
    if (!profile?.stats?.heatmap) return { weeks: [], months: [] };
    const reversed = [...profile.stats.heatmap].reverse();
    const weeks = [];
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentMonth = null;
    let monthStartWeek = 0;
    
    while (reversed.length) {
      const weekData = reversed.splice(0, 7);
      weeks.push(weekData);
      
      // Track month changes for labels
      if (weekData.length > 0) {
        const firstDayDate = new Date(weekData[0].date);
        const month = firstDayDate.getMonth();
        
        if (currentMonth !== month) {
          if (weeks.length - monthStartWeek >= 2) { // Only show label if month spans at least 2 weeks
            months.push({
              name: monthNames[month],
              startWeek: monthStartWeek,
              weekCount: weeks.length - monthStartWeek
            });
          }
          currentMonth = month;
          monthStartWeek = weeks.length - 1;
        }
      }
    }
    
    // Add final month
    if (weeks.length - monthStartWeek >= 2) {
      const lastWeek = weeks[weeks.length - 1];
      if (lastWeek && lastWeek.length > 0) {
        const lastDate = new Date(lastWeek[lastWeek.length - 1].date);
        months.push({
          name: monthNames[lastDate.getMonth()],
          startWeek: monthStartWeek,
          weekCount: weeks.length - monthStartWeek
        });
      }
    }
    
    return { weeks: weeks.slice(-20), months }; // show ~20 weeks (~5 months)
  }, [profile]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      setFormValues((prev) => ({ ...prev, avatar: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to update your profile');
        return;
      }

      const payload = {};
      FORM_FIELD_KEYS.forEach((key) => {
        const value = formValues[key];
        if (value !== undefined && value !== null) {
          payload[key] = value;
        }
      });
      
      // Add avatar if it exists
      if (formValues.avatar) {
        payload.avatar = formValues.avatar;
      }

      await axios.put(`${window.API_BASE_URL}/api/profile/me`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const sanitizedValues = FORM_FIELD_KEYS.reduce((acc, key) => {
        if (formValues[key] !== undefined && formValues[key] !== null) {
          acc[key] = formValues[key];
        }
        return acc;
      }, {});
      const baseProfile = profile || { ...MOCK_PROFILE };
      const updatedProfile = {
        ...baseProfile,
        ...sanitizedValues,
        avatarUrl: preview || baseProfile.avatarUrl,
        isNew: false
      };

      setProfile(updatedProfile);
      setFormValues(buildFormState(updatedProfile));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile', error);
      toast.error('Unable to save profile right now');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreview('');
    setFormValues(buildFormState(profile || { ...MOCK_PROFILE }));
  };

  const joinedLabel = useMemo(() => {
    if (!profile?.joinedOn) return 'Not set';
    return new Date(profile.joinedOn).toLocaleDateString();
  }, [profile]);

  const codingLevelPercent = profile?.codingLevelPercent ?? 0;
  const avatarSrc = preview || profile?.avatarUrl || FALLBACK_AVATAR;

  if (loading) {
    return (
      <div className="profile-page skeleton">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`profile-page ${isDark ? 'dark' : 'light'}`}>
      <header className="profile-header">
        <h1>🧑‍💻 Profile Page</h1>
        <p className="subtitle">Review your coding journey, update your profile, and stay on track.</p>
      </header>

      <section className="profile-layout">
        <div className="stats-column">
          <div className="stats-card">
            <div className="stats-card-header">
              <h2>📈 Solved per Week</h2>
              <button type="button" className="btn-outline">View Full Stats</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={profile?.stats?.solvedPerWeek || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="week" stroke="var(--text-color)" />
                <YAxis stroke="var(--text-color)" allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                <Bar dataKey="solved" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-card">
            <div className="stats-card-header">
              <h2>⏱️ Streak Tracker</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={profile?.stats?.streakHistory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-color)" />
                <YAxis stroke="var(--text-color)" allowDecimals={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="streak" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Coding Activity Section - Moved here */}
          <div className="stats-card activity-section-inline">
            <div className="activity-header">
              <h2>🔥 Coding Activity</h2>
              <p>Track your daily progress across learning, practice, and streak challenges.</p>
            </div>
            <div className="heatmap-container">
              <div className="heatmap-grid">
                {activityGrid.weeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="heatmap-week">
                    {week.map((day) => {
                      const level = HEAT_LEVELS.slice().reverse().find((threshold) => day.count >= threshold.threshold);
                      const learningCount = day.learningTicks || 0;
                      const practiceCount = day.practiceProblems || 0;
                      const streakCount = day.streakCompleted || 0;
                      const totalCount = learningCount + practiceCount + streakCount;
                      
                      const tooltipText = `${new Date(day.date).toLocaleDateString()}\n` +
                        `Total Activities: ${totalCount}\n` +
                        `📚 Learning: ${learningCount}\n` +
                        `💻 Practice: ${practiceCount}\n` +
                        `🔥 Streak: ${streakCount}`;
                      
                      return (
                        <div
                          key={day.date}
                          className="heatmap-cell"
                          style={{ backgroundColor: level?.color }}
                          title={tooltipText}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="heatmap-months">
                {activityGrid.months.map((month, idx) => (
                  <div
                    key={`${month.name}-${idx}`}
                    className="month-label"
                    style={{ 
                      left: `${(month.startWeek / 20) * 100}%`,
                      width: `${(month.weekCount / 20) * 100}%`
                    }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="profile-column">
          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              <div
                className="avatar-ring"
                style={{
                  background: `conic-gradient(var(--primary) 0% ${codingLevelPercent}%, var(--avatar-ring-background) ${codingLevelPercent}% 100%)`
                }}
              >
                <img src={avatarSrc} alt="Profile" className="profile-avatar" />
              </div>
              {isOwnProfile && (
                <label className="btn-outline small">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                </label>
              )}
            </div>

            <div className="profile-info">
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  name="name"
                  value={formValues.name || ''}
                  placeholder="Full name"
                  onChange={handleFieldChange}
                />
              ) : (
                <h2>{profile?.name || 'New User'}</h2>
              )}
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  name="codingLevel"
                  value={formValues.codingLevel || ''}
                  placeholder="Coding level"
                  onChange={handleFieldChange}
                />
              ) : (
                <p className="coding-rank">{profile?.codingLevel || 'Beginner'}</p>
              )}
              <p className="joined-on">Joined on {joinedLabel}</p>
            </div>

            {/* Bio Section */}
            <div className="profile-bio-section">
              {isEditing ? (
                <textarea
                  className="profile-bio-input"
                  name="bio"
                  value={formValues.bio || ''}
                  placeholder="Tell us about yourself..."
                  onChange={handleFieldChange}
                  rows={3}
                />
              ) : (
                <p className="profile-bio-text">
                  {profile?.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            <div className="profile-details">
              {/* Always visible field - Email */}
              {DETAIL_FIELDS.filter(f => f.visible).map(({ name, label, type }) => (
                <div className="detail-row" key={name}>
                  <span className="label">{label}</span>
                  {isEditing ? (
                    <input
                      type={type}
                      name={name}
                      value={formValues[name] ?? ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span className="value">
                      {profile && (profile[name] || profile[name] === 0) ? profile[name] : '—'}
                    </span>
                  )}
                </div>
              ))}

              {/* Collapsible fields */}
              {showMore && DETAIL_FIELDS.filter(f => !f.visible).map(({ name, label, type }) => (
                <div className="detail-row" key={name}>
                  <span className="label">{label}</span>
                  {isEditing ? (
                    <input
                      type={type}
                      name={name}
                      value={formValues[name] ?? ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span className="value">
                      {profile && (profile[name] || profile[name] === 0) ? profile[name] : '—'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {!isEditing && (
              <button 
                type="button" 
                className="btn-show-more" 
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? '▲ Show Less' : '▼ Show More'}
              </button>
            )}

            {isOwnProfile && (
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button type="button" className="btn-primary" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                    <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ProfilePage;
