const PracticeProblem = require('../models/PracticeProblem');
const PracticeSubmission = require('../models/PracticeSubmission');
const User = require('../models/User');
const { runCodeInDocker } = require('../utils/dockerRunner');
const { wrapCodeWithHarness, formatInputForStdin } = require('../utils/codeHarness');
const { formatErrorForDisplay } = require('../utils/errorParser');

// Helper: Normalize expected/actual outputs for comparison
function normalizeExpected(expected) {
  if (expected === null || expected === undefined) return null;
  try {
    if (typeof expected === 'string') {
      const trimmed = expected.trim();
      // Strip surrounding double-quotes from string values stored as `"fl"` or `""`
      // The code harness outputs raw strings (no quotes), so we must normalize expected too
      if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
        // It could be a JSON string — parse it to get the raw value
        try { return JSON.parse(trimmed); } catch {}
        // Fallback: manually strip outer quotes
        return trimmed.slice(1, -1);
      }
      // JSON arrays / numbers
      if (/^[\[{]/.test(trimmed) || /^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        try { return JSON.parse(trimmed); } catch {}
      }
      return trimmed;
    }
    return expected;
  } catch {
    return String(expected).trim();
  }
}

function normalizeActual(actual) {
  if (actual === null || actual === undefined) return '';
  const s = String(actual).trim();
  try {
    if (/^[\[{]/.test(s) || /^-?\d+(?:\.\d+)?$/.test(s)) {
      return JSON.parse(s);
    }
  } catch {}
  return s;
}

function outputsEqual(expectedRaw, actualRaw) {
  const e = normalizeExpected(expectedRaw);
  const a = normalizeActual(actualRaw);
  if (typeof e === 'object' && e !== null) {
    try {
      return JSON.stringify(e) === JSON.stringify(a);
    } catch {
      return false;
    }
  }
  return String(e) === String(a);
}

function codeLikelyNeedsStdin(code, language) {
  const lang = String(language || '').toLowerCase();
  const source = String(code || '');

  if (lang === 'java') {
    return /Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)|System\.in/.test(source);
  }
  if (lang === 'python' || lang === 'py') {
    return /\binput\s*\(/.test(source);
  }
  if (lang === 'cpp' || lang === 'c++') {
    return /\bcin\s*>>|\bgetline\s*\(\s*cin\s*,/.test(source);
  }
  if (lang === 'javascript' || lang === 'js' || lang === 'node') {
    return /process\.stdin|readline\s*\./.test(source);
  }

  return false;
}

// ✅ GET /api/practice/problems - List all practice problems with filters
const getProblems = async (req, res) => {
  try {
    const { difficulty, topic, tag, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Apply filters
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topic = new RegExp(topic, 'i');
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const problems = await PracticeProblem.find(query)
      .select('title difficulty topic tags acceptanceRate totalSubmissions createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PracticeProblem.countDocuments(query);

    // Get user's solved problems if authenticated
    let solvedIds = [];
    if (req.user) {
      const solved = await PracticeSubmission.find({
        userId: req.user._id,
        status: 'accepted'
      }).distinct('problemId');
      solvedIds = solved.map(id => id.toString());
    }

    // Add solved status to each problem
    const problemsWithStatus = problems.map(p => ({
      ...p.toObject(),
      isSolved: solvedIds.includes(p._id.toString())
    }));

    res.json({
      problems: problemsWithStatus,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Failed to fetch problems', error: error.message });
  }
};

// ✅ GET /api/practice/problems/:id - Get problem details
const getProblemById = async (req, res) => {
  try {
  const { id } = req.params;
  const problem = await PracticeProblem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Hide hidden test cases from response
    const publicTestCases = problem.testCases.filter(tc => !tc.isHidden);
    const problemData = problem.toObject();
    problemData.testCases = publicTestCases;

    // Get user's submission history for this problem
    if (req.user) {
      const submissions = await PracticeSubmission.find({
        userId: req.user._id,
        problemId: id
      })
        .select('language status submittedAt executionTime')
        .sort({ submittedAt: -1 })
        .limit(10);

      problemData.userSubmissions = submissions;

      // Check if user has solved this problem
      const hasSolved = submissions.some(s => s.status === 'accepted');
      problemData.isSolved = hasSolved;
    }

    res.json(problemData);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Failed to fetch problem', error: error.message });
  }
};

// ✅ POST /api/practice/editor/run - Run code without saving (for editor practice)
const runCode = async (req, res) => {
  try {
    const { code, language, testInput = '', problemId } = req.body;

    console.log('[runCode] Request received:', {
      language,
      codeLength: code?.length,
      hasTestInput: !!testInput,
      problemId
    });

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const startTime = Date.now();
    let testCases = [];
    let problem = null;

    // If problemId provided, fetch problem and test cases
    if (problemId) {
      problem = await PracticeProblem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      // Use only visible test cases
      testCases = problem.testCases.filter(tc => !tc.isHidden);
    }

    // If we have test cases, run them all and show results
    if (testCases.length > 0) {
      const testResults = [];
      let allPassed = true;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        try {
          // Wrap code with test harness for this test case
          const wrappedCode = wrapCodeWithHarness(
            code,
            language,
            testCase,
            { functionSignature: problem.functionSignature }
          );

          // Format input for stdin (convert single-line to multi-line)
          const paramCount = problem.functionSignature?.params?.length || 2;
          const formattedInput = formatInputForStdin(testCase.input, paramCount);

          // Execute code in Docker with formatted input
          const result = await runCodeInDocker(wrappedCode, language, formattedInput, 10);
          
          const actualOutput = result.stdout?.trim() ?? '';
          // ✅ Use outputsEqual() — handles quoted strings, arrays, booleans, empty strings
          const passed = result.exitCode === 0 && outputsEqual(testCase.expectedOutput, actualOutput);
          
          if (!passed) allPassed = false;

          testResults.push({
            passed,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: actualOutput !== '' ? actualOutput : 'No output',
            error: (result.exitCode !== 0 && result.stderr)
              ? formatErrorForDisplay(result.stderr, language).errorMessage
              : null
          });

        } catch (error) {
          allPassed = false;
          testResults.push({
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '',
            error: error.message || 'Execution failed'
          });
        }
      }

      const executionTime = Date.now() - startTime;
      const passedCount = testResults.filter(t => t.passed).length;

      return res.json({
        success: allPassed,
        testResults,
        passedTests: passedCount,
        totalTests: testResults.length,
        message: allPassed 
          ? 'All test cases passed!' 
          : `${passedCount}/${testResults.length} test cases passed`,
        executionTime
      });

    } else {
      // Free-form code editor - run as-is without test cases
      const result = await runCodeInDocker(code, language, testInput, 10);
      const executionTime = Date.now() - startTime;

      // Format error for display
      let errorMessage = null;
      if (result.stderr) {
        const formattedError = formatErrorForDisplay(result.stderr, language);
        errorMessage = formattedError.errorMessage || formattedError.fullError || result.stderr;
      } else if (result.exitCode === 124 || result.exitCode === 143) {
        // Timeout exit codes (124 = GNU timeout, 143 = SIGTERM)
        if (codeLikelyNeedsStdin(code, language) && !String(testInput || '').trim()) {
          errorMessage = 'Execution timed out: Your code is waiting for input (stdin). Enter the required input in the stdin box above, then click Run again.';
        } else {
          errorMessage = 'Time Limit Exceeded (10s). Check for infinite loops or heavy computation.';
        }
      } else if (result.exitCode !== 0) {
        errorMessage = `Execution failed (exit code ${result.exitCode}). If your program expects input, provide it in the stdin box above.`;
      }

      return res.json({
        success: result.exitCode === 0,
        output: result.stdout || '',
        error: errorMessage,
        executionTime
      });
    }

  } catch (error) {
    console.error('[runCode] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Code execution failed'
    });
  }
};

// ✅ POST /api/practice/problems/:id/submit - Submit solution with full test validation
const submitSolution = async (req, res) => {
  try {
    const { id } = req.params;
  const { code, language } = req.body;
  const userId = req.user._id;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Fetch problem with ALL test cases (including hidden ones)
    const problem = await PracticeProblem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (!problem.supportedLanguages.includes(language)) {
      return res.status(400).json({ message: `Language ${language} not supported for this problem` });
    }

    const testResults = [];
    let allPassed = true;
    let status = 'accepted';
    let failureReason = null;
    const startTime = Date.now();

    // Run code against all test cases
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      
      try {
        // Wrap user code with test harness
        const wrappedCode = wrapCodeWithHarness(
          code,
          language,
          testCase,
          { functionSignature: problem.functionSignature }
        );

        // Format input for stdin
        const paramCount = problem.functionSignature?.params?.length || 2;
        const formattedInput = formatInputForStdin(testCase.input, paramCount);

        // Execute in Docker with formatted input
        const result = await runCodeInDocker(wrappedCode, language, formattedInput, 10);

        const actualOutput = result.stdout.trim();
        const passed = result.exitCode === 0 && outputsEqual(testCase.expectedOutput, actualOutput);

        testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: actualOutput,
          passed: passed,
          error: result.stderr || null,
          isHidden: testCase.isHidden
        });

        if (!passed) {
          allPassed = false;
          if (result.exitCode !== 0) {
            status = result.stderr.includes('timeout') ? 'time_limit_exceeded' : 'runtime_error';
            failureReason = formatErrorForDisplay(result.stderr, language);
          } else {
            status = 'wrong_answer';
            failureReason = `Test case ${i + 1} failed`;
          }
          break; // Stop on first failure
        }

      } catch (error) {
        allPassed = false;
        status = 'runtime_error';
        failureReason = error.message;
        testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          error: error.message,
          isHidden: testCase.isHidden
        });
        break;
      }
    }

    const executionTime = Date.now() - startTime;

    // Save submission to database
    const submission = new PracticeSubmission({
      userId,
      problemId: id,
      code,
      language,
      status,
      testResults,
      executionTime
    });

    await submission.save();

    // Update problem statistics
    await PracticeProblem.findByIdAndUpdate(id, {
      $inc: {
        totalSubmissions: 1,
        acceptedSubmissions: allPassed ? 1 : 0
      }
    });

    // Calculate new acceptance rate
    const updatedProblem = await PracticeProblem.findById(id);
    const acceptanceRate = updatedProblem.totalSubmissions > 0
      ? (updatedProblem.acceptedSubmissions / updatedProblem.totalSubmissions * 100).toFixed(1)
      : 0;

    await PracticeProblem.findByIdAndUpdate(id, { acceptanceRate });

    // If accepted, user stats are tracked via PracticeSubmission records
    // (No need to update User model - getUserStats aggregates from PracticeSubmission)

    // Filter visible test results for response
    const visibleTestResults = testResults.filter(tr => !tr.isHidden);

    res.json({
      success: allPassed,
      status,
      message: allPassed ? '✅ All test cases passed!' : failureReason,
      testResults: visibleTestResults,
      totalTests: problem.testCases.length,
      passedTests: testResults.filter(tr => tr.passed).length,
      executionTime,
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({
      success: false,
      message: 'Submission failed',
      error: error.message
    });
  }
};

// ✅ GET /api/practice/stats - Get user's practice statistics
const getUserStats = async (req, res) => {
  try {
  const userId = req.user._id;

    // Get all accepted submissions
    const acceptedSubmissions = await PracticeSubmission.find({
      userId,
      status: 'accepted'
    })
      .populate('problemId', 'title difficulty topic')
      .sort({ submittedAt: -1 });

    // Count by difficulty
    const difficultyStats = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    const uniqueSolved = new Set();
    const recentSubmissions = [];

    for (const sub of acceptedSubmissions) {
      if (sub.problemId) {
        const problemId = sub.problemId._id.toString();
        if (!uniqueSolved.has(problemId)) {
          uniqueSolved.add(problemId);
          difficultyStats[sub.problemId.difficulty]++;
          
          if (recentSubmissions.length < 10) {
            recentSubmissions.push({
              problemId: sub.problemId._id,
              title: sub.problemId.title,
              difficulty: sub.problemId.difficulty,
              language: sub.language,
              submittedAt: sub.submittedAt
            });
          }
        }
      }
    }

    // Get total submissions count
    const totalSubmissions = await PracticeSubmission.countDocuments({ userId });

    // Get submission history (last 20)
    const submissionHistory = await PracticeSubmission.find({ userId })
      .populate('problemId', 'title difficulty')
      .select('problemId language status submittedAt executionTime')
      .sort({ submittedAt: -1 })
      .limit(20);

    res.json({
      totalSolved: uniqueSolved.size,
      totalSubmissions,
      difficultyStats,
      recentSolved: recentSubmissions,
      submissionHistory
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

// ✅ GET /api/practice/submissions/:submissionId - Get submission details
const getSubmissionDetails = async (req, res) => {
  try {
  const { submissionId } = req.params;
  const userId = req.user._id;

    const submission = await PracticeSubmission.findOne({
      _id: submissionId,
      userId
    }).populate('problemId', 'title difficulty');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  runCode,
  submitSolution,
  getUserStats,
  getSubmissionDetails
};
