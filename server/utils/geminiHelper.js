const axios = require('axios');
const { GEMINI_URL } = require('../config/geminiConfig');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiAPI(prompt) {
    // Increased retries to handle longer rate limit windows (up to ~2 minutes wait)
    let retries = 5;
    let attempt = 0;

    while (attempt <= retries) {
        try {
            const response = await axios.post(GEMINI_URL, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                attempt++;
                if (attempt > retries) {
                    console.error('Max retries reached for Gemini API rate limit.');
                    throw error;
                }
                // Exponential backoff: 4s, 8s, 16s, 32s, 64s
                // Previous error showed "retry in 53s", so we need to cover that range.
                const waitTime = 2000 * Math.pow(2, attempt);
                
                console.log(`[Gemini] Rate limit hit. Retrying in ${waitTime/1000}s... (Attempt ${attempt}/${retries})`);
                await delay(waitTime);
                continue;
            }
            console.error('Error calling Gemini API:', error);
            throw error;
        }
    }
}

module.exports = {
    callGeminiAPI
};
