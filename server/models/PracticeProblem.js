const mongoose = require('mongoose');

const practiceProblemSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    // Multi-language starter code templates
    codeTemplate: {
        javascript: {
            type: String,
            default: '// Write your code here\nfunction solution() {\n  \n}'
        },
        python: {
            type: String,
            default: '# Write your code here\ndef solution():\n    pass'
        },
        java: {
            type: String,
            default: '// Write your code here\nclass Solution {\n    public void solution() {\n        \n    }\n}'
        },
        cpp: {
            type: String,
            default: '// Write your code here\nclass Solution {\npublic:\n    void solution() {\n        \n    }\n};'
        }
    },
    // Function signature for code execution
    functionSignature: {
        name: { type: String, default: 'solution' },
        // Accept array of strings or objects; store raw
        params: { type: Array, default: [] },
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
    // Test cases for validation
    testCases: [{
        input: String, // Raw input string (e.g., "[2,7,11,15]\n9")
        expectedOutput: String, // Expected output as string
        explanation: String,
        isHidden: {
            type: Boolean,
            default: false // Hidden test cases not shown to user
        }
    }],
    constraints: [String],
    hints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    // Supported languages for this problem
    supportedLanguages: {
        type: [String],
        default: ['javascript', 'python', 'java', 'cpp']
    },
    // Metadata
    acceptanceRate: {
        type: Number,
        default: 0
    },
    totalSubmissions: {
        type: Number,
        default: 0
    },
    acceptedSubmissions: {
        type: Number,
        default: 0
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for efficient queries
practiceProblemSchema.index({ difficulty: 1, topic: 1 });
practiceProblemSchema.index({ tags: 1, difficulty: 1 });

module.exports = mongoose.model('PracticeProblem', practiceProblemSchema);
