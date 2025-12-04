const PracticeProblem = require('../models/PracticeProblem');
const { validateProblemPayload, isAllowedReturnType } = require('../utils/validator');
const fs = require('fs');
const path = require('path');

/**
 * Bulk upload practice problems from JSON file
 * Usage: Call this from admin controller or run as standalone script
 */
async function uploadPracticeProblems(jsonFilePath) {
  try {
    // Read JSON file
    const filePath = path.resolve(jsonFilePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const problems = JSON.parse(fileContent);

    if (!Array.isArray(problems)) {
      throw new Error('JSON file must contain an array of problems');
    }

    console.log(`📚 Found ${problems.length} problems to upload`);

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    // Process each problem
    for (const problemData of problems) {
      try {
        // Check if problem already exists
        const existing = await PracticeProblem.findOne({ title: problemData.title });
        
        if (existing) {
          console.log(`⏭️  Skipping "${problemData.title}" (already exists)`);
          results.skipped.push(problemData.title);
          continue;
        }

        // Strict validation
        if (!problemData.functionSignature || !isAllowedReturnType(problemData.functionSignature.returnType)) {
          throw new Error(`Invalid returnType '${problemData.functionSignature?.returnType}'. Use explicit tokens like int[], string[], boolean[].`);
        }
        const { errors } = validateProblemPayload(problemData);
        if (errors.length) {
          throw new Error(errors.map(e => `${e.field}: ${e.message}`).join('; '));
        }

        // Create new problem
        const newProblem = new PracticeProblem({
          title: problemData.title,
          difficulty: problemData.difficulty,
          topic: problemData.topic,
          description: problemData.description,
          codeTemplate: problemData.codeTemplate || {},
          functionSignature: problemData.functionSignature,
          testCases: problemData.testCases || [],
          constraints: problemData.constraints || [],
          hints: problemData.hints || [],
          examples: problemData.examples || [],
          tags: problemData.tags || [],
          supportedLanguages: problemData.supportedLanguages || ['javascript', 'python', 'java', 'cpp'],
          acceptanceRate: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0
        });

        await newProblem.save();
        console.log(`✅ Uploaded "${problemData.title}"`);
        results.success.push(problemData.title);

      } catch (error) {
        console.error(`❌ Failed to upload "${problemData.title}":`, error.message);
        results.failed.push({ title: problemData.title, error: error.message });
      }
    }

    // Print summary
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${results.success.length}`);
    console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed Problems:');
      results.failed.forEach(f => console.log(`  - ${f.title}: ${f.error}`));
    }

    return results;

  } catch (error) {
    console.error('💥 Error during bulk upload:', error);
    throw error;
  }
}

/**
 * Add to admin controller for HTTP endpoint
 */
const bulkUploadProblems = async (req, res) => {
  try {
    const { problems } = req.body; // Array of problem objects from request

    if (!Array.isArray(problems)) {
      return res.status(400).json({ message: 'Request body must contain an array of problems' });
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const problemData of problems) {
      try {
        const existing = await PracticeProblem.findOne({ title: problemData.title });
        
        if (existing) {
          results.skipped.push(problemData.title);
          continue;
        }

        // Strict validation
        if (!problemData.functionSignature || !isAllowedReturnType(problemData.functionSignature.returnType)) {
          throw new Error(`Invalid returnType '${problemData.functionSignature?.returnType}'. Use explicit tokens like int[], string[], boolean[].`);
        }
        const v = validateProblemPayload(problemData);
        if (v.errors.length) {
          throw new Error(v.errors.map(e => `${e.field}: ${e.message}`).join('; '));
        }

        const newProblem = new PracticeProblem({
          title: problemData.title,
          difficulty: problemData.difficulty,
          topic: problemData.topic,
          description: problemData.description,
          codeTemplate: problemData.codeTemplate || {},
          functionSignature: problemData.functionSignature,
          testCases: problemData.testCases || [],
          constraints: problemData.constraints || [],
          hints: problemData.hints || [],
          examples: problemData.examples || [],
          tags: problemData.tags || [],
          supportedLanguages: problemData.supportedLanguages || ['javascript', 'python', 'java', 'cpp']
        });

        await newProblem.save();
        results.success.push(problemData.title);

      } catch (error) {
        results.failed.push({ title: problemData.title, error: error.message });
      }
    }

    res.json({
      message: 'Bulk upload completed',
      summary: {
        total: problems.length,
        success: results.success.length,
        skipped: results.skipped.length,
        failed: results.failed.length
      },
      results
    });

  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ message: 'Bulk upload failed', error: error.message });
  }
};

/**
 * Delete all practice problems (use with caution!)
 */
const deleteAllProblems = async (req, res) => {
  try {
    const result = await PracticeProblem.deleteMany({});
    res.json({
      message: 'All practice problems deleted',
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete problems', error: error.message });
  }
};

/**
 * Get all practice problems (admin view)
 */
const getAllProblemsAdmin = async (req, res) => {
  try {
    const problems = await PracticeProblem.find({})
      .select('title difficulty topic totalSubmissions acceptanceRate createdAt')
      .sort({ createdAt: -1 });

    res.json({
      count: problems.length,
      problems
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch problems', error: error.message });
  }
};

/**
 * Update problem acceptance rate (called after each submission)
 */
const updateAcceptanceRate = async (problemId) => {
  try {
    const problem = await PracticeProblem.findById(problemId);
    if (!problem) return;

    const acceptanceRate = problem.totalSubmissions > 0
      ? (problem.acceptedSubmissions / problem.totalSubmissions * 100).toFixed(1)
      : 0;

    await PracticeProblem.findByIdAndUpdate(problemId, { acceptanceRate });
  } catch (error) {
    console.error('Error updating acceptance rate:', error);
  }
};

module.exports = {
  uploadPracticeProblems,
  bulkUploadProblems,
  deleteAllProblems,
  getAllProblemsAdmin,
  updateAcceptanceRate
};
