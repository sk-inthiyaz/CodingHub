const API_KEY = process.env.GEMINI_API_KEY;
// Using API key authentication instead of OAuth
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

module.exports = {
    GEMINI_URL,
    API_KEY
};
