import React, { useEffect, useState } from 'react';
import './WatchTutorials.css';

const WatchTutorials = ({ language, topic }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/tutorials/${language}/${topic}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tutorials');
        }

        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error('Error fetching tutorials:', err);
        setError('Failed to load tutorials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [language, topic]);

  if (loading) {
    return (
      <div className="watch-tutorials">
        <div className="loading">Loading tutorials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-tutorials">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="watch-tutorials">
      <h2>Watch {language} {topic} Tutorials</h2>
      <div className="videos-grid">
        {videos.map((video) => (
          <a 
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
          >
            <div className="video-thumbnail">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
              />
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.channel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WatchTutorials;
