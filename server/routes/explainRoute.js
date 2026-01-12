const express = require("express");
const dotenv = require("dotenv");
const { callGeminiAPI } = require("../utils/geminiHelper");

dotenv.config();

const router = express.Router();

// Simple heuristic to check if input looks like code
function isLikelyCode(input) {
  // Allow natural language requests that ask for code generation or explanation
  const intentKeywords = /(generate|create|write|explain|how|what|impl)/i;
  if (intentKeywords.test(input)) return true;

  const codeIndicators = [
    /;/, // semicolons (common in JS, Java, C)
    /def |class |import |function /, // Python, JS
    /public |private |void /, // Java
    /#include|int main\(/, // C/C++
    /<[^>]+>/, // HTML tags
    /console\.log|System\.out\.println/, // Logging
    /=|{|}|\(|\)/ // Basic syntax
  ];
  return codeIndicators.some(regex => regex.test(input));
}

router.post("/", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    // 👇 Filter: Don't allow random text like "how are you"
    if (!isLikelyCode(code)) {
      return res.status(200).json({
        explanation: `👋 Hi! I'm a code explainer bot.\n\nPlease paste your code snippet and I'll explain it in a clean and structured way. 💻\n\nLet’s make learning easier! 🚀`,
      });
    }

    const prompt = `You are a professional programming assistant.

Explain the following code in a clean, beginner-friendly, and well-structured format using markdown.

Organize the explanation into the following sections with appropriate emojis and markdown formatting:

- 📘 **Explanation**
- 🔧 **Method / Function Description**
- 🧪 **Driver Code / Main Logic**
- 📈 **Time & Space Complexity**
- 💡 **Extra Notes / Tips**
- 🧠 **Expected Output**

Here is the code to explain:

${code}`;

    const explanation = await callGeminiAPI(prompt);

    if (!explanation) {
      throw new Error("Invalid response from Gemini API");
    }

    res.json({ explanation });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Failed to generate explanation",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

module.exports = router;
