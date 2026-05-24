const express = require('express');
const axios = require('axios');
const router = express.Router();
const { YOUTUBE_API_KEY, BASE_URL } = require('../config/youtubeConfig');
const { auth } = require('../middleware/auth');

// Cache object to store video results
const cache = {};
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

router.get('/:language/:topic', auth, async (req, res) => {
    try {
        const { language, topic } = req.params;
        const cacheKey = `${language}-${topic}`;

        // Check cache first
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
            return res.json(cache[cacheKey].data);
        }

        const query = `${language} programming ${topic} tutorial`;
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                key: YOUTUBE_API_KEY,
                part: 'snippet',
                q: query,
                maxResults: 6,
                type: 'video',
                relevanceLanguage: 'en',
                videoDefinition: 'high'
            }
        });

        const videos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channel: item.snippet.channelTitle,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt
        }));

        // Store in cache
        cache[cacheKey] = {
            timestamp: Date.now(),
            data: videos
        };

        res.json(videos);
    } catch (error) {
        console.error('YouTube API Error:', error);
        res.status(500).json({ error: 'Failed to fetch tutorials' });
    }
});

module.exports = router;
