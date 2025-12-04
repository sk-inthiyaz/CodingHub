import StreakQuestion from "../models/StreakQuestion.js";
import { validateProblemPayload, isAllowedReturnType } from "../utils/validator.js";

// ➕ Add Question
export const addQuestion = async (req, res) => {
  try {
    const question = await StreakQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: "Error adding question", error });
  }
};

// � Bulk Upload Streak Questions
export const bulkUploadStreakQuestions = async (req, res) => {
  try {
    const { questions, autoMigrate } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ 
        message: "Request body must contain an array of questions",
        success: false 
      });
    }

    console.log(`📚 Attempting to upload ${questions.length} streak questions`);

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const questionData of questions) {
      try {
        // Validate required fields
        if (!questionData.level || !questionData.levelName || !questionData.title || !questionData.activeDate) {
          results.failed.push({
            title: questionData.title || 'Unknown',
            error: 'Missing required fields: level, levelName, title, or activeDate'
          });
          continue;
        }

        // Strict returnType and template validation
        if (!questionData.functionSignature || !isAllowedReturnType(questionData.functionSignature.returnType)) {
          if (autoMigrate) {
            const { migrateReturnTypeIfNeeded } = await import('../utils/validator.js');
            const { migrated } = migrateReturnTypeIfNeeded(questionData);
            if (!migrated || !isAllowedReturnType(questionData.functionSignature.returnType)) {
              const rt = questionData.functionSignature?.returnType;
              results.failed.push({
                title: questionData.title || 'Unknown',
                error: `Invalid returnType '${rt}'. Use explicit tokens like int[], string[], boolean[].`,
                field: 'functionSignature.returnType',
                suggestion: "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode."
              });
              continue;
            }
          } else {
          const rt = questionData.functionSignature?.returnType;
          results.failed.push({
            title: questionData.title || 'Unknown',
            error: `Invalid returnType '${rt}'. Use explicit tokens like int[], string[], boolean[].`,
            field: 'functionSignature.returnType',
            suggestion: "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode."
          });
          continue;
          }
        }
        const { errors } = validateProblemPayload(questionData);
        if (errors.length) {
          results.failed.push({ title: questionData.title || 'Unknown', errors });
          continue;
        }

        // Convert activeDate to Date object if it's a string
        const activeDate = new Date(questionData.activeDate);
        activeDate.setHours(0, 0, 0, 0);

        // Set expiration date if not provided
        let expirationDate;
        if (questionData.expirationDate) {
          expirationDate = new Date(questionData.expirationDate);
        } else {
          expirationDate = new Date(activeDate);
          expirationDate.setHours(23, 59, 59, 999);
        }

        // Check if question already exists for this date and level
        const existing = await StreakQuestion.findOne({
          activeDate: activeDate,
          level: questionData.level
        });

        if (existing) {
          console.log(`⏭️  Skipping "${questionData.title}" (already exists for ${activeDate.toISOString().split('T')[0]}, Level ${questionData.level})`);
          results.skipped.push({
            title: questionData.title,
            reason: `Question already exists for this date and level`
          });
          continue;
        }

        // Create new streak question
        const newQuestion = new StreakQuestion({
          level: questionData.level,
          levelName: questionData.levelName,
          title: questionData.title,
          description: questionData.description,
          constraints: questionData.constraints || '',
          hints: questionData.hints || [],
          starterCode: questionData.starterCode || '// Write your code here...',
          codeTemplate: questionData.codeTemplate || {},
          functionSignature: questionData.functionSignature,
          testCases: questionData.testCases || [],
          activeDate: activeDate,
          expirationDate: expirationDate,
          submissions: [],
          solvedBy: []
        });

        await newQuestion.save();
        console.log(`✅ Uploaded "${questionData.title}" for ${activeDate.toISOString().split('T')[0]}`);
        results.success.push({
          title: questionData.title,
          date: activeDate.toISOString().split('T')[0],
          level: questionData.level
        });

      } catch (error) {
        console.error(`❌ Failed to upload "${questionData.title}":`, error.message);
        results.failed.push({
          title: questionData.title,
          error: error.message
        });
      }
    }

    // Return summary
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${results.success.length}`);
    console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    res.status(200).json({
      message: 'Bulk upload completed',
      summary: {
        total: questions.length,
        successful: results.success.length,
        skipped: results.skipped.length,
        failed: results.failed.length
      },
      results: results
    });

  } catch (error) {
    console.error('💥 Error during bulk upload:', error);
    res.status(500).json({ 
      message: "Error during bulk upload", 
      error: error.message,
      success: false
    });
  }
};

// �📜 Get All Questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await StreakQuestion.find().sort({ date: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

// 🗑️ Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await StreakQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
