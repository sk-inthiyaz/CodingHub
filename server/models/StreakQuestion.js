const mongoose = require('mongoose');

const streakQuestionSchema = new mongoose.Schema({
  // Level mapping: 1=Easy, 2=Mid, 3=Mid-Easy, 4=Hard, 5=Mix
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    enum: [1, 2, 3, 4, 5]
  },
  levelName: {
    type: String,
    required: true,
    enum: ['Easy', 'Mid', 'Mid-Easy', 'Hard', 'Mix']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: false
  },
  hints: [{
    type: String
  }],
  starterCode: {
    type: String,
    default: '// Write your code here...'
  },
  codeTemplate: {
    javascript: { type: String, default: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n}\n' },
    python: { type: String, default: 'class Solution:\n    def twoSum(self, nums, target):\n        """\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        """\n        # Write your solution here\n        pass\n' },
    java: { type: String, default: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}\n' },
    cpp: { type: String, default: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        \n    }\n};\n' }
  },
  functionSignature: {
    name: { type: String, default: 'twoSum' },
    params: [{ type: String }],
    returnType: { 
      type: String,
      required: true,
      enum: [
        'int','long','float','double','string','boolean',
        'int[]','long[]','float[]','double[]','string[]','boolean[]',
        'int[][]','string[][]',
        'ListNode','TreeNode'
      ]
    }
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true,
      validate: {
        validator: function(v) { return v !== undefined && v !== null; },
        message: 'expectedOutput is required'
      }
    },
    explanation: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  // Date for which this question is active (stored as YYYY-MM-DD)
  activeDate: {
    type: Date,
    required: true,
    index: true
  },
  // Expiration date/time (defaults to 11:59 PM of activeDate)
  expirationDate: {
    type: Date,
    required: false,
    index: true
  },
  submissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    code: String,
    status: {
      type: String,
      enum: ['passed', 'failed', 'partial'],
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  solvedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index: ensure only ONE question per level per day
streakQuestionSchema.index({ activeDate: 1, level: 1 }, { unique: true });

// Helper method to get level number from name
streakQuestionSchema.statics.getLevelNumber = function(levelName) {
  const levelMap = {
    'Easy': 1,
    'Mid': 2,
    'Mid-Easy': 3,
    'Hard': 4,
    'Mix': 5
  };
  return levelMap[levelName] || 1;
};

// Helper method to get level name from number
streakQuestionSchema.statics.getLevelName = function(levelNumber) {
  const nameMap = {
    1: 'Easy',
    2: 'Mid',
    3: 'Mid-Easy',
    4: 'Hard',
    5: 'Mix'
  };
  return nameMap[levelNumber] || 'Easy';
};

module.exports = mongoose.model('StreakQuestion', streakQuestionSchema);
