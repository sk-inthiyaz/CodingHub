const express = require('express');
const router = express.Router();
const axios = require('axios');
const PracticeProblem = require('../models/PracticeProblem');
const { GEMINI_URL, API_KEY } = require('../config/geminiConfig');
const { auth } = require('../middleware/auth');
const practiceController = require('../controllers/practiceController');
const { validateProblemPayload, isAllowedReturnType } = require('../utils/validator');

// ===============================
// NEW PRACTICE SYSTEM ROUTES
// ===============================

// ===============================
// ADMIN ROUTES (MUST BE BEFORE DYNAMIC ROUTES)
// ===============================
const isAdmin = require('../middleware/isAdmin');

// Get all problems (admin only) - MUST BE BEFORE /problems/:id
router.get('/problems/all', isAdmin, async (req, res) => {
  try {
    console.log('📚 [GET /problems/all] ENDPOINT HIT - User:', req.user?.email, 'isAdmin:', req.user?.isAdmin);
    console.log('🔍 Attempting to find all practice problems...');
    console.log('🗄️ Database connection state:', require('mongoose').connection.readyState); // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    
    if (require('mongoose').connection.readyState !== 1) {
      throw new Error('Database not connected. Connection state: ' + require('mongoose').connection.readyState);
    }
    
    console.log('🔎 PracticeProblem model:', typeof PracticeProblem);
    console.log('🔎 PracticeProblem.find:', typeof PracticeProblem.find);
    
    const problems = await PracticeProblem.find().sort({ createdAt: -1 });
    
    console.log('✅ Query successful! Found', problems.length, 'problems');
    console.log('✅ First problem sample:', problems[0]?.title);
    console.log('📦 Sending response:', { problems: problems.length > 0 ? 'populated' : 'empty' });
    
    res.json({ problems });
  } catch (error) {
    console.error('❌ Error fetching problems:', error.message);
    console.error('🔥 Error stack:', error.stack);
    console.error('🔥 Error type:', error.constructor.name);
    res.status(500).json({ 
      message: 'Failed to fetch problems', 
      error: error.message,
      details: error.stack
    });
  }
});

// ===============================
// REGULAR USER ROUTES (AFTER ADMIN ROUTES)
// ===============================

// List all practice problems with filters
router.get('/problems', auth, practiceController.getProblems);

// Get specific problem details
router.get('/problems/:id', auth, practiceController.getProblemById);

// Run code without saving (for editor practice)
router.post('/editor/run', auth, practiceController.runCode);

// Submit solution with full validation
router.post('/problems/:id/submit', auth, practiceController.submitSolution);

// Get user practice statistics
router.get('/stats', auth, practiceController.getUserStats);

// Get submission details
router.get('/submissions/:submissionId', auth, practiceController.getSubmissionDetails);

// ===============================
// ADMIN UPLOAD ROUTE
// ===============================

// Upload practice problems (admin only)
router.post('/admin/upload-problems', isAdmin, async (req, res) => {
  try {
    const { problems, replaceExisting, autoMigrate } = req.body;
    console.log('📤 [POST /admin/upload-problems] User:', req.user?.email, 'Problems count:', problems?.length);

    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ message: 'Problems array is required' });
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const problemData of problems) {
      try {
        // Strict validations before touching DB
        if (!problemData.functionSignature || !isAllowedReturnType(problemData.functionSignature.returnType)) {
          if (autoMigrate) {
            const { migrateReturnTypeIfNeeded } = require('../utils/validator');
            const { migrated, warnings } = migrateReturnTypeIfNeeded(problemData);
            if (migrated && isAllowedReturnType(problemData.functionSignature.returnType)) {
              // continue with warnings noted
            } else {
              const rt = problemData.functionSignature?.returnType;
              results.failed.push({
                title: problemData.title || 'Unknown',
                error: `Invalid returnType '${rt}'. Use explicit tokens like int[], string[], boolean[].`,
                field: 'functionSignature.returnType',
                suggestion: "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode."
              });
              continue;
            }
          } else {
          const rt = problemData.functionSignature?.returnType;
          results.failed.push({
            title: problemData.title || 'Unknown',
            error: `Invalid returnType '${rt}'. Use explicit tokens like int[], string[], boolean[].`,
            field: 'functionSignature.returnType',
            suggestion: "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode."
          });
          continue;
          }
        }

        // Require all templates present
        const { errors, warnings } = validateProblemPayload(problemData);
        if (errors.length) {
          results.failed.push({ title: problemData.title || 'Unknown', errors });
          continue;
        }

        // Check if problem already exists
        const existing = await PracticeProblem.findOne({ title: problemData.title });
        
        if (existing) {
          if (replaceExisting) {
            // Update existing problem
            await PracticeProblem.findByIdAndUpdate(existing._id, {
              ...problemData,
              acceptanceRate: existing.acceptanceRate,
              totalSubmissions: existing.totalSubmissions,
              acceptedSubmissions: existing.acceptedSubmissions
            });
            results.success.push(problemData.title);
          } else {
            results.skipped.push(problemData.title);
          }
          continue;
        }

        // Create new problem
        const newProblem = new PracticeProblem({
          title: problemData.title,
          description: problemData.description,
          difficulty: problemData.difficulty,
          topic: problemData.topic,
          constraints: problemData.constraints || [],
          hints: problemData.hints || [],
          functionSignature: problemData.functionSignature,
          codeTemplate: problemData.codeTemplate,
          testCases: problemData.testCases || [],
          examples: problemData.examples || [],
          tags: problemData.tags || [problemData.topic],
          supportedLanguages: Object.keys(problemData.codeTemplate || {})
        });

        await newProblem.save();
        console.log('✅ Saved problem:', problemData.title);
        results.success.push(problemData.title);
      } catch (err) {
        console.error('❌ Error saving problem:', problemData.title, err.message);
        results.failed.push({ title: problemData.title, error: err.message });
      }
    }

    res.status(201).json({
      message: `Uploaded ${results.success.length} problems successfully`,
      results
    });
  } catch (error) {
    console.error('Error uploading problems:', error);
    res.status(500).json({ message: 'Failed to upload problems', error: error.message });
  }
});

// Get admin stats
router.get('/admin/stats', isAdmin, async (req, res) => {
  try {
    console.log('📊 [GET /admin/stats] Fetching statistics...');
    console.log('🗄️ Database connection state:', require('mongoose').connection.readyState);
    
    const totalProblems = await PracticeProblem.countDocuments();
    console.log('📈 Total problems:', totalProblems);
    
    const byDifficulty = await PracticeProblem.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    console.log('📊 By difficulty:', byDifficulty);
    
    const byTopic = await PracticeProblem.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);
    console.log('📚 By topic:', byTopic);

    const stats = {
      totalProblems,
      byDifficulty: byDifficulty.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      byTopic: byTopic.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {})
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    console.error('🔥 Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch stats', 
      error: error.message,
      details: error.stack
    });
  }
});

// Delete problem (admin only)
router.delete('/admin/problems/:id', isAdmin, async (req, res) => {
  try {
    const problem = await PracticeProblem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete problem', error: error.message });
  }
});

// Update problem (admin only)
router.put('/admin/problems/:id', isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, topic, constraints, hints } = req.body;
    
    const updateData = {
      title,
      description,
      difficulty,
      topic,
      constraints,
      hints: Array.isArray(hints) ? hints : []
    };

    const problem = await PracticeProblem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ message: 'Problem updated successfully', problem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update problem', error: error.message });
  }
});

// ===============================
// EXISTING AI ROUTES (KEPT)
// ===============================

// Generate 5 practice problems
router.post('/generate', async (req, res) => {
    console.log('[DEBUG] Entering /generate route handler');
    console.log('[DEBUG] Checking environment:', {
        hasApiKey: !!API_KEY,
        apiKeyLength: API_KEY ? API_KEY.length : 0,
        geminiUrl: GEMINI_URL
    });

    try {
        console.log('[DEBUG] Request body:', req.body);
        const { topic, difficulty } = req.body;

        const prompt = {
            contents: [{
                parts: [{
                    text: `Generate 5 unique coding problems with the following specifications:
                    Topic: ${topic}
                    Difficulty: ${difficulty}

                    Please provide the problems in this JSON format:
                    {
                        "problems": [
                            {
                                "id": "unique_id_1",
                                "title": "Problem title",
                                "description": "Detailed problem description",
                                "starterCode": "// Function signature and any helper code",
                                "testCases": [
                                    {
                                        "input": ["example input"],
                                        "expectedOutput": "expected output",
                                        "explanation": "Why this output is expected"
                                    }
                                ],
                                "constraints": ["constraint1", "constraint2"],
                                "hints": ["hint1", "hint2"],
                                "difficulty": "${difficulty}",
                                "topic": "${topic}"
                            }
                        ]
                    }

                    Ensure the problems are progressively challenging and cover different aspects of ${topic}.
                    For beginner: Focus on fundamental concepts
                    For medium: Include some optimization challenges
                    For advanced: Add complex algorithmic problems`
                }]
            }]
        };

        console.log('[DEBUG] Sending request to Gemini API:', {
            url: GEMINI_URL,
            promptLength: JSON.stringify(prompt).length
        });
        
        const response = await axios.post(GEMINI_URL, prompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('[DEBUG] Raw Gemini response received');
        
        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error('Unexpected response format from Gemini API');
        }

        // Remove markdown code block syntax and get the JSON content
        const jsonContent = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        console.log('[DEBUG] Cleaned JSON content');

        let problemsData;
        try {
            problemsData = JSON.parse(jsonContent);
            if (!problemsData.problems || !Array.isArray(problemsData.problems)) {
                throw new Error('Invalid response format: missing problems array');
            }
        } catch (parseError) {
            throw new Error(`Failed to parse response: ${parseError.message}`);
        }

        // Save problems to database
        const savedProblems = await Promise.all(
            problemsData.problems.map(async (problem) => {
                const newProblem = new PracticeProblem({
                    ...problem,
                    topic,
                    difficulty
                });
                return await newProblem.save();
            })
        );

        console.log('[DEBUG] Problems saved to database:', savedProblems.length);
        res.json({ problems: savedProblems });

    } catch (error) {
        console.error('Error generating problems:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.error?.message || error.message;
        const statusCode = error.response?.status || 500;
        
        res.status(statusCode).json({ 
            error: errorMessage,
            details: 'Failed to process the request. Please try again.',
            status: statusCode
        });
    }
});

// Analyze code and provide optimization suggestions
router.post('/analyze', async (req, res) => {
    try {
        const { code } = req.body;
        console.log('[DEBUG] Analyzing code:', code);

        const prompt = {
            contents: [{
                parts: [{
                    text: `You are a code analysis expert. Analyze this code and provide feedback in JSON format.

Code to analyze:
${code}

Provide your analysis in this exact JSON format:
{
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "suggestions": [
        "specific suggestion about the code",
        "another specific improvement suggestion"
    ],
    "explanation": "A detailed explanation of the code's performance and areas for improvement"
}`
                }]
            }]
        };

        console.log('[DEBUG] Sending request to Gemini API:', {
            url: GEMINI_URL,
            promptLength: JSON.stringify(prompt).length
        });
        
        const response = await axios.post(GEMINI_URL, prompt, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error('Unexpected response format from Gemini API');
        }

        const jsonContent = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
        const analysis = JSON.parse(jsonContent);
        res.json(analysis);

    } catch (error) {
        console.error('[DEBUG] Error analyzing code:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        // Get detailed error information
        const errorDetails = error.response?.data?.error || error.message;
        const statusCode = error.response?.status || 500;

        res.status(statusCode).json({
            error: 'Failed to analyze the code',
            details: errorDetails,
            status: statusCode
        });
    }
});

// ===== HEALTH CHECK & DIAGNOSTICS =====
// Simple health check (no auth required)
router.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const connectionState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'ok',
    database: states[connectionState],
    timestamp: new Date().toISOString()
  });
});

// Test database connection (admin only)
router.get('/admin/health', isAdmin, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Try a simple count query
    const count = await PracticeProblem.countDocuments();
    
    res.json({
      status: 'ok',
      database: states[connectionState],
      problemsCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'connection error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
