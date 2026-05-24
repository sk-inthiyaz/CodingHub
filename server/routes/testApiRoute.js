const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GEMINI_URL, API_KEY } = require('../config/geminiConfig');

// Test Gemini API key
router.get('/test-gemini', async (req, res) => {
    try {
        // Simple test prompt
        const testPrompt = {
            contents: [{
                parts: [{
                    text: "Hello, this is a test message. Please respond with 'OK' if you receive this."
                }]
            }]
        };

        console.log('[DEBUG] Testing Gemini API with URL:', GEMINI_URL);
        
        const response = await axios.post(GEMINI_URL, testPrompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('[DEBUG] Gemini API Response:', response.data);

        res.json({
            status: 'success',
            message: 'API key is valid',
            apiKeyLastFourDigits: API_KEY.slice(-4),
            response: response.data
        });

    } catch (error) {
        console.error('[ERROR] Gemini API test failed:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: 'error',
            message: 'API key validation failed',
            error: error.response?.data?.error || error.message,
            statusCode: error.response?.status
        });
    }
});

module.exports = router;
