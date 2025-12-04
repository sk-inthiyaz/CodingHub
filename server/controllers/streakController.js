const StreakQuestion = require("../models/StreakQuestion");
const User = require("../models/User");
const Submission = require("../models/Submission");
const { runCodeInDocker } = require("../utils/dockerRunner");
const { wrapCodeWithHarness } = require("../utils/codeHarness");
const { saveCode } = require("../utils/storageService");
const { formatErrorForDisplay } = require("../utils/errorParser");
const { validateProblemPayload, isAllowedReturnType } = require("../utils/validator");

// ⏰ Helper: Parse date string in YYYY-MM-DD format to local date at 00:00:00
function parseLocalDate(dateString) {
  if (!dateString) return new Date();
  
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) throw new Error('Invalid date format');
    
    // Create date in LOCAL timezone (not UTC)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
    return date;
  } catch (err) {
    console.error(`Error parsing date ${dateString}:`, err);
    // Fallback to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}

// ⏰ Helper: Get today's date in YYYY-MM-DD format (local timezone)
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: robust comparison of expected vs actual outputs
function normalizeExpected(expected) {
  if (expected === null || expected === undefined) return null;
  try {
    if (typeof expected === 'string') {
      const trimmed = expected.trim();
      // Try JSON parse if it looks like JSON/number
      if (/^[\[{]/.test(trimmed) || /^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return JSON.parse(trimmed);
      }
      return trimmed;
    }
    // Array/object/number/boolean
    return expected;
  } catch {
    return String(expected).trim();
  }
}

function normalizeActual(actual) {
  if (actual === null || actual === undefined) return '';
  const s = String(actual).trim();
  try {
    // Try parse arrays/objects/numbers
    if (/^[\[{]/.test(s) || /^-?\d+(?:\.\d+)?$/.test(s)) {
      return JSON.parse(s);
    }
  } catch {}
  return s;
}

function outputsEqual(expectedRaw, actualRaw) {
  const e = normalizeExpected(expectedRaw);
  const a = normalizeActual(actualRaw);
  // Deep compare by JSON stringification for objects/arrays
  if (typeof e === 'object' && e !== null) {
    try {
      return JSON.stringify(e) === JSON.stringify(a);
    } catch {
      return false;
    }
  }
  return String(e) === String(a);
}

// ✅ Admin: Add 5 streak questions for a specific date (one per level)
// Questions are active from 00:00 to 23:59 of the specified date
const addDailyQuestions = async (req, res) => {
  try {
    const { date, questions, replaceExisting } = req.body; // questions should be an array of 5 questions

    if (!questions || questions.length !== 5) {
      return res.status(400).json({ 
        message: "Please provide exactly 5 questions (one for each level)" 
      });
    }

    // Parse date in local timezone using helper
    const activeDate = parseLocalDate(date || getTodayDateString());
    
    // Set expiration to end of day (11:59:59 PM)
    const expirationDate = new Date(activeDate);
    expirationDate.setHours(23, 59, 59, 999);

    console.log(`Adding questions for date: ${activeDate.toDateString()}`);
    console.log(`Expiration date: ${expirationDate.toDateString()} ${expirationDate.toTimeString()}`);
    console.log(`Date to filter: activeDate = ${activeDate.toISOString()}`);

    // If replaceExisting is true, delete old questions for this date first
    if (replaceExisting) {
      const deleted = await StreakQuestion.deleteMany({ activeDate });
      console.log(`Deleted ${deleted.deletedCount} existing questions for date: ${activeDate.toDateString()}`);
    } else {
      // Check if ANY question exists for this date
      const existingQuestions = await StreakQuestion.find({ activeDate });
      if (existingQuestions.length > 0) {
        const existingLevel = existingQuestions[0].levelName;
        return res.status(400).json({ 
          message: `Question already exists for ${existingLevel} level on ${activeDate.toDateString()}. Use replaceExisting: true to overwrite.`
        });
      }
    }

    // Create all 5 questions
    const savedQuestions = [];
    for (let i = 0; i < 5; i++) {
      const q = questions[i];
      const levelNumber = i + 1;
      const levelName = StreakQuestion.getLevelName(levelNumber);

      const newQuestion = new StreakQuestion({
        level: levelNumber,
        levelName: levelName,
        title: q.title,
        description: q.description,
        constraints: q.constraints || '',
        hints: q.hints || [],
        starterCode: q.starterCode || '// Write your code here...',
        testCases: q.testCases,
        functionSignature: q.functionSignature || { name: 'solution', params: [], returnType: 'any' },
        codeTemplate: q.codeTemplate || {},
        activeDate: activeDate,
        expirationDate: expirationDate
      });

      const saved = await newQuestion.save();
      savedQuestions.push(saved);
    }

    res.status(201).json({
      message: "5 daily questions added successfully!",
      date: activeDate,
      expiresAt: expirationDate,
      note: "Questions will automatically expire at 11:59 PM and refresh at 12:00 AM",
      questions: savedQuestions
    });
  } catch (error) {
    console.error("Error adding daily questions:", error);
    res.status(500).json({ message: "Failed to add questions", error: error.message });
  }
};

// ✏️ Admin: Update a streak question by ID
const updateStreakQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      constraints,
      hints,
      starterCode,
      testCases,
      activeDate,
      levelName,
      functionSignature,
      codeTemplate
    } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (constraints !== undefined) update.constraints = constraints;
    if (Array.isArray(hints)) update.hints = hints;
    if (starterCode !== undefined) update.starterCode = starterCode;
    if (Array.isArray(testCases)) update.testCases = testCases;
    if (functionSignature) update.functionSignature = functionSignature;
    if (codeTemplate) update.codeTemplate = codeTemplate;
    if (activeDate) {
      const d = new Date(activeDate);
      d.setHours(0, 0, 0, 0);
      update.activeDate = d;
    }
    if (levelName) {
      update.levelName = levelName;
      update.level = StreakQuestion.getLevelNumber(levelName);
    }

    const updated = await StreakQuestion.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated", question: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "A question already exists for this date and level" });
    }
    res.status(500).json({ message: "Failed to update question", error: error.message });
  }
};

// 🗑️ Admin: Delete a streak question by ID
const deleteStreakQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StreakQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};

// ✅ Admin: Add a single streak question
const addStreakQuestion = async (req, res) => {
  try {
    const { levelName, title, description, constraints, testCases, hints, starterCode, activeDate, functionSignature, codeTemplate } = req.body;

    const level = StreakQuestion.getLevelNumber(levelName);
    const date = new Date(activeDate || Date.now());
    date.setHours(0, 0, 0, 0);

    // Strict validation
    if (!functionSignature || !isAllowedReturnType(functionSignature.returnType)) {
      return res.status(400).json({
        message: `Invalid returnType '${functionSignature?.returnType}'. Use explicit tokens like int[], string[], boolean[].`,
        field: 'functionSignature.returnType',
        suggestion: "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode."
      });
    }
    const { errors } = validateProblemPayload({ title, description, constraints, hints, testCases, functionSignature, codeTemplate });
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const newQuestion = new StreakQuestion({
      level,
      levelName,
      title,
      description,
      constraints: constraints || '',
      hints: hints || [],
      starterCode: starterCode || '// Write your code here...',
      testCases,
      functionSignature: functionSignature,
      codeTemplate: codeTemplate || {},
      activeDate: date
    });

    await newQuestion.save();
    res.status(201).json({
      message: "Streak question added successfully!",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "A question already exists for this date and level" 
      });
    }
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};

// 📅 Get today's question based on user's level
const getTodayQuestionForUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get today's date in local timezone
    const today = parseLocalDate(getTodayDateString());
    
    const now = new Date();

    console.log(`Fetching question for today: ${today.toDateString()} (${today.toISOString()}), user level: ${user.level}`);

    // Get question matching user's current level
    const question = await StreakQuestion.findOne({
      activeDate: today,
      level: user.level
    }).select('-submissions'); // Don't send other users' submissions

    if (!question) {
      console.log(`No question found for date ${today.toDateString()} and level ${user.level}`);
      return res.status(404).json({ 
        message: "No question available for your level today",
        userLevel: user.level,
        levelName: StreakQuestion.getLevelName(user.level),
        debug: {
          todayDate: today.toDateString(),
          userLevel: user.level
        }
      });
    }

    // Check if question has expired (past 11:59 PM)
    if (question.expirationDate && now > question.expirationDate) {
      return res.status(410).json({ 
        message: "Today's question has expired. Check back tomorrow!",
        expiredAt: question.expirationDate
      });
    }

    // Check if user already solved today
    const alreadySolved = question.solvedBy.includes(userId);

    res.json({
      question,
      userLevel: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      alreadySolved,
      currentStreak: user.streak.currentStreak,
      longestStreak: user.streak.longestStreak,
      expiresAt: question.expirationDate
    });
  } catch (error) {
    console.error("Error fetching today's question:", error);
    res.status(500).json({ message: "Failed to fetch today's question", error: error.message });
  }
};

// 🏃 Run code against PUBLIC test cases only (like LeetCode "Run" button)
const runCode = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const question = await StreakQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Filter ONLY public test cases (isHidden = false)
    const publicTestCases = question.testCases.filter(tc => !tc.isHidden);

    if (publicTestCases.length === 0) {
      return res.status(400).json({ message: "No public test cases available" });
    }

    // Run only public test cases using Docker
    let passed = 0;
    let failed = 0;
    const testResults = [];
    let firstFailedCase = null;
    let compileError = null;
    
    // Get language once before loop
    const runLanguage = req.body.language?.toLowerCase() || 'javascript';

    for (let index = 0; index < publicTestCases.length; index++) {
      const testCase = publicTestCases[index];
      try {
        // Wrap user code with test harness (LeetCode style)
        const wrappedCode = wrapCodeWithHarness(code, runLanguage, testCase, {
          functionSignature: question.functionSignature
        });
        
        const { stdout, stderr, exitCode } = await runCodeInDocker(wrappedCode, runLanguage, testCase.input);
        
        // Check if there's a compilation/runtime error
        if (stderr && stderr.trim()) {
          // Format error for display
          if (!compileError) {
            compileError = formatErrorForDisplay(stderr, runLanguage, code);
          }
          
          const result = {
            testCase: index + 1,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: stderr,
            error: true,
            errorMessage: compileError.errorMessage,
            explanation: testCase.explanation
          };
          failed++;
          testResults.push(result);
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
          continue;
        }
        
        const actualOutput = stdout || '';
        const passedTest = outputsEqual(testCase.expectedOutput, actualOutput);
        const result = {
          testCase: index + 1,
          passed: passedTest,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          explanation: testCase.explanation
        };
        testResults.push(result);
        if (passedTest) {
          passed++;
        } else {
          failed++;
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
        }
      } catch (err) {
        failed++;
        const result = {
          testCase: index + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: err.message,
          error: true,
          errorMessage: err.message,
          explanation: testCase.explanation
        };
        testResults.push(result);
        if (!firstFailedCase) {
          firstFailedCase = result;
        }
      }
    }

    const totalPublicCases = publicTestCases.length;

    if (failed === 0) {
      return res.json({
        success: true,
        message: `✓ All ${totalPublicCases} public test cases passed!`,
        passedCount: passed,
        totalCount: totalPublicCases,
        testResults
      });
    } else {
      return res.json({
        success: false,
        message: compileError 
          ? `❌ Compilation/Runtime Error - ${compileError.errorType}`
          : `✗ ${passed}/${totalPublicCases} public test cases passed`,
        passedCount: passed,
        totalCount: totalPublicCases,
        testResults,
        firstFailedCase,
        compileError: compileError ? compileError.errorMessage : null,
        hasCompileError: !!compileError
      });
    }
  } catch (error) {
    console.error("Error running code:", error);
    res.status(500).json({ message: "Failed to run code", error: error.message });
  }
};

// 🚀 Submit solution and update streak
const submitSolution = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    const question = await StreakQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Check if question has expired (past 11:59 PM)
    const now = new Date();
    if (question.expirationDate && now > question.expirationDate) {
      return res.status(410).json({ 
        success: false,
        message: "This question has expired. Check back tomorrow for new questions!",
        expiredAt: question.expirationDate
      });
    }
    
    // Check if user already solved this question today
    const alreadySolved = question.solvedBy.some(id => String(id) === String(userId));
    if (alreadySolved) {
      return res.status(400).json({ 
        success: false,
        message: "You've already solved today's question!",
        streak: user.streak.currentStreak
      });
    }

    // Run ALL test cases (public + hidden) and track detailed results
    let passed = 0;
    let failed = 0;
    const testResults = [];
    let firstFailedCase = null;
    let compileError = null;

    // Get language once before loop
    const submissionLanguage = req.body.language?.toLowerCase() || 'javascript';
    
    for (let index = 0; index < question.testCases.length; index++) {
      const testCase = question.testCases[index];
      try {
        // Wrap user code with test harness (LeetCode style)
        const wrappedCode = wrapCodeWithHarness(code, submissionLanguage, testCase, {
          functionSignature: question.functionSignature
        });
        
        const { stdout, stderr, exitCode } = await runCodeInDocker(wrappedCode, submissionLanguage, testCase.input);
        
        // Check if there's a compilation/runtime error
        if (stderr && stderr.trim()) {
          // Format error for display
          if (!compileError) {
            compileError = formatErrorForDisplay(stderr, submissionLanguage, code);
          }
          
          const result = {
            testCase: index + 1,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: stderr,
            error: true,
            errorMessage: compileError.errorMessage,
            isPublic: !testCase.isHidden
          };
          failed++;
          testResults.push(result);
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
          continue;
        }
        
        const actualOutput = stdout || '';
        const passedTest = outputsEqual(testCase.expectedOutput, actualOutput);
        const result = {
          testCase: index + 1,
          passed: passedTest,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          isPublic: !testCase.isHidden
        };
        testResults.push(result);
        if (passedTest) {
          passed++;
        } else {
          failed++;
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
        }
      } catch (err) {
        failed++;
        const result = {
          testCase: index + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: err.message,
          error: true,
          errorMessage: err.message,
          isPublic: !testCase.isHidden
        };
        testResults.push(result);
        if (!firstFailedCase) {
          firstFailedCase = result;
        }
      }
    }

    const status = failed === 0 ? 'passed' : (passed > 0 ? 'partial' : 'failed');
    const totalCases = question.testCases.length;

    // Record submission
    question.submissions.push({
      userId,
      code,
      status,
      submittedAt: new Date()
    });

    // If passed ALL cases, update streak and add to solvedBy
    if (status === 'passed') {
      question.solvedBy.push(userId);
      await question.save();

      // Update user streak
      await user.updateStreak(new Date());

      // Add to completed questions
      user.completedQuestions.push({
        questionId: question._id,
        difficulty: question.levelName,
        language: submissionLanguage,
        completedAt: new Date()
      });

      await user.save();

      // Save accepted submission to storage
      const submissionId = require('crypto').randomUUID();
      const storageKey = await saveCode(
        String(userId),
        String(question._id),
        submissionId,
        code,
        submissionLanguage
      );

      // Store submission metadata in DB
      const submission = new Submission({
        _id: submissionId,
        userId,
        problemId: question._id,
        language: submissionLanguage,
        status: 'accepted',
        runtimeMs: null, // TODO: track runtime if needed
        storageKey
      });
      await submission.save();

      return res.json({
        success: true,
        message: `🎉 Accepted! All ${totalCases} test cases passed!`,
        status: 'passed',
        passedCount: passed,
        totalCount: totalCases,
        testResults,
        submissionId, // Return for frontend reference
        streak: {
          current: user.streak.currentStreak,
          longest: user.streak.longestStreak
        },
        level: user.level,
        levelName: StreakQuestion.getLevelName(user.level),
        badges: user.badges,
        streakIncreased: true
      });
    } else {
      await question.save();
      return res.json({
        success: false,
        message: compileError 
          ? `❌ Compilation/Runtime Error - ${compileError.errorType}`
          : `❌ Wrong Answer - ${passed}/${totalCases} test cases passed`,
        status,
        passedCount: passed,
        totalCount: totalCases,
        firstFailedCase, // Show the specific failed test case
        compileError: compileError ? compileError.errorMessage : null,
        hasCompileError: !!compileError,
        streak: {
          current: user.streak.currentStreak,
          longest: user.streak.longestStreak
        }
      });
    }
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Failed to submit solution", error: error.message });
  }
};

// 📋 Get all streak questions (admin)
const getAllStreakQuestions = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      filter.activeDate = queryDate;
    }

    const questions = await StreakQuestion.find(filter)
      .sort({ activeDate: -1, level: 1 })
      .populate('solvedBy', 'name email');

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// 📊 Get user streak stats
const getUserStreakStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || req.user?.userId;

    const user = await User.findById(userId)
      .populate('completedQuestions.questionId', 'title levelName activeDate');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      streak: {
        current: user.streak.currentStreak,
        longest: user.streak.longestStreak,
        lastQuestionDate: user.streak.lastQuestionDate
      },
      level: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      badges: user.badges,
      completedQuestions: user.completedQuestions,
      totalSolved: user.completedQuestions.length
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats", error: error.message });
  }
};

// 📈 Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ 'streak.currentStreak': { $gt: 0 } })
      .select('name email streak.currentStreak streak.longestStreak level badges')
      .sort({ 'streak.currentStreak': -1, 'streak.longestStreak': -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      currentStreak: user.streak.currentStreak,
      longestStreak: user.streak.longestStreak,
      level: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      badges: user.badges.length
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};

// � Get paginated solved history for current user
const getSolvedHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '10', 10), 1), 50);

    const user = await User.findById(userId)
      .populate('completedQuestions.questionId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort in-memory by completedAt desc (array is small per user)
    const sorted = [...(user.completedQuestions || [])]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const total = sorted.length;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    res.json({
      page,
      pageSize,
      total,
      totalPages,
      items
    });
  } catch (error) {
    console.error('Error fetching solved history:', error);
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

// �📊 Admin stats dashboard
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'streak.currentStreak': { $gt: 0 } });
    const totalQuestions = await StreakQuestion.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayQuestions = await StreakQuestion.countDocuments({ activeDate: today });

    const topStreaker = await User.findOne()
      .sort({ 'streak.currentStreak': -1 })
      .select('name streak.currentStreak');

    const questionsByLevel = await StreakQuestion.aggregate([
      { $group: { 
        _id: '$levelName', 
        count: { $sum: 1 } 
      }}
    ]);

    const usersByLevel = await User.aggregate([
      { $group: { 
        _id: '$level', 
        count: { $sum: 1 } 
      }}
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalQuestions,
      todayQuestions,
      topStreaker: topStreaker ? {
        name: topStreaker.name,
        streak: topStreaker.streak.currentStreak
      } : null,
      questionsByLevel,
      usersByLevel
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

module.exports = {
  addDailyQuestions,
  addStreakQuestion,
  getTodayQuestionForUser,
  runCode,
  submitSolution,
  getAllStreakQuestions,
  getUserStreakStats,
  getLeaderboard,
  getAdminStats,
  updateStreakQuestion,
  deleteStreakQuestion,
  getSolvedHistory
};
