# 🚀 Interactive Coding Practice System - Complete Guide

## Overview

The **Interactive Coding Practice** system provides two powerful ways to practice coding:

1. **📚 Guided Practice with Problems** - LeetCode-style problem solving
2. **💻 Code Editor Practice** - Free-form coding with AI feedback

---

## 🎯 Features

### Guided Practice (LeetCode-Style)
- ✅ Curated problems: Easy, Medium, Hard
- ✅ Multi-language support: JavaScript, Python, Java, C++
- ✅ Real-time code execution in Docker containers
- ✅ Instant test case validation
- ✅ Progress tracking and statistics
- ✅ Submission history
- ✅ Hidden test cases (like real interviews!)

### Code Editor Practice
- ✅ Free-form code editor with Monaco Editor
- ✅ Run code without saving
- ✅ AI-powered code analysis (complexity, suggestions)
- ✅ Custom input support
- ✅ Real-time syntax highlighting

---

## 🗂️ File Structure

```
server/
├── controllers/
│   └── practiceController.js     # Main practice logic
├── models/
│   ├── PracticeProblem.js        # Problem schema
│   └── PracticeSubmission.js     # Submission tracking
├── routes/
│   └── practiceRoutes.js         # Practice API endpoints
└── utils/
    ├── codeHarness.js            # Code wrapping for tests
    ├── dockerRunner.js           # Secure code execution
    └── errorParser.js            # Error formatting

client/src/components/Practice/
├── ProblemsList.jsx              # Browse all problems
├── ProblemDetail.jsx             # Solve specific problem
├── CodeEditorPractice.jsx        # Free-form editor
├── PracticeDashboard.jsx         # User statistics
└── Practice.css                  # LeetCode-style design
```

---

## 🔧 API Endpoints

### Backend Routes

```javascript
// Practice Problems
GET    /api/practice/problems              // List all with filters
GET    /api/practice/problems/:id          // Get problem details
POST   /api/practice/problems/:id/submit   // Submit solution

// Code Editor
POST   /api/practice/editor/run            // Run code (no save)

// Statistics
GET    /api/practice/stats                 // User progress
GET    /api/practice/submissions/:id       // Submission details
```

---

## 📋 Usage Guide

### 1. Browse Problems

Navigate to: **`/practice/problems`**

**Features:**
- Filter by difficulty (Easy/Medium/Hard)
- Filter by topic (Arrays, Strings, Trees, etc.)
- Search by title/description
- See which problems you've solved (✓ checkmark)
- View acceptance rates
- Pagination support

**Example:**
```
Filter: Difficulty = Easy, Topic = Arrays
Result: "Two Sum", "Reverse String", etc.
```

---

### 2. Solve a Problem

Click any problem → redirected to **`/practice/problems/:id`**

**Layout:**
- **Left Panel:** Problem description, examples, constraints, hints
- **Right Panel:** Code editor, language selector, run/submit buttons

**Workflow:**
1. Select language (JavaScript, Python, Java, C++)
2. Write solution in Monaco Editor
3. Click **"Run Code"** to test (shows visible test cases)
4. Click **"Submit"** for full validation (includes hidden tests)

**Example Problem: Two Sum**
```javascript
function twoSum(nums, target) {
    const map = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in map) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }
}
```

**Results:**
```
✅ All test cases passed!
Test Case 1: ✓ Passed
Test Case 2: ✓ Passed
Test Case 3 (Hidden): ✓ Passed

⏱️ Execution time: 245ms
```

---

### 3. Free Code Editor

Navigate to: **`/practice/editor`**

**Use Cases:**
- Test code snippets
- Practice without constraints
- Get AI complexity analysis

**Workflow:**
1. Write any code
2. (Optional) Add custom input
3. Click **"Run"** to execute
4. Click **"Analyze"** for AI feedback

**AI Analysis Example:**
```
🤖 AI Analysis
Time Complexity: O(n²)
Space Complexity: O(1)

💡 Suggestions:
- Use a hash map to optimize to O(n) time
- Consider edge cases like empty arrays
- Add input validation
```

---

### 4. Track Progress

Navigate to: **`/practice/dashboard`**

**Statistics:**
- Total problems solved (by difficulty)
- Total submissions count
- Acceptance rate
- Recent solved problems
- Full submission history with timestamps

**Visual Breakdown:**
```
📊 My Practice Progress

Total Solved: 15
├─ Easy: 8
├─ Medium: 5
└─ Hard: 2

Total Attempts: 47
Success Rate: 31.9%
```

---

## 🛠️ Admin: Add Practice Problems

### Option 1: Upload JSON

Navigate to **Admin Dashboard** → **Practice Problems** → **Upload JSON**

**JSON Format:**
```json
{
  "title": "Two Sum",
  "difficulty": "Easy",
  "topic": "Arrays",
  "description": "Given an array...",
  "functionSignature": {
    "name": "twoSum",
    "params": [
      { "name": "nums", "type": "int[]" },
      { "name": "target", "type": "int" }
    ],
    "returnType": "int[]"
  },
  "codeTemplate": {
    "javascript": "function twoSum(nums, target) {\n  // Your code\n}",
    "python": "def twoSum(nums, target):\n    # Your code\n    pass"
  },
  "testCases": [
    {
      "input": "[2,7,11,15]\n9",
      "expectedOutput": "[0,1]",
      "isHidden": false
    }
  ],
  "constraints": ["2 <= nums.length <= 10^4"],
  "hints": ["Use a hash table"],
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "nums[0] + nums[1] = 9"
    }
  ],
  "tags": ["Array", "Hash Table"],
  "supportedLanguages": ["javascript", "python", "java", "cpp"]
}
```

### Option 2: Manual Entry via Form

Fill out form with:
- Title, difficulty, topic
- Description, constraints, hints
- Test cases (input/output pairs)
- Code templates for each language

---

## 🔐 How Code Execution Works

### Security: Docker Isolation

1. User submits code
2. Backend wraps code with test harness (`codeHarness.js`)
3. Code runs in isolated Docker container (`dockerRunner.js`)
4. Time limit: 10 seconds
5. Results returned (output, errors, execution time)

**Supported Languages:**
- JavaScript → `node:20-alpine`
- Python → `python:3.11-alpine`
- Java → `openjdk:17-alpine`
- C++ → `gcc:latest`

**Example Docker Execution:**
```javascript
// User code + test harness
const wrappedCode = wrapCodeWithHarness(
  userCode,
  'javascript',
  testCase,
  { functionSignature: { name: 'twoSum', params: [...] }}
);

// Execute securely
const result = await runCodeInDocker(
  wrappedCode,
  'javascript',
  testInput,
  10 // timeout seconds
);
```

---

## 🎨 UI/UX Design

**LeetCode-Inspired:**
- Clean split-panel layout
- Professional gradients (purple/indigo)
- Dark mode support (`data-theme="dark"`)
- Difficulty badges with color coding:
  - 🟢 Easy: Green
  - 🟠 Medium: Orange
  - 🔴 Hard: Red

**Responsive Design:**
- Mobile-friendly (stacks panels vertically)
- Touch-optimized buttons
- Accessible color contrasts

---

## 🧪 Testing Workflow

### Test Case Format

**Input Format:**
```
For single param: "[2,7,11,15]"
For two params: "[2,7,11,15]\n9"
For three params: "[1,2,3]\n2\n5"
```

**Expected Output:**
```
Arrays: "[0,1]"
Numbers: "6"
Booleans: "true"
Strings: "\"hello\""
```

### Run vs Submit

| Feature | Run Code | Submit |
|---------|----------|--------|
| Test Cases | Visible only | All (including hidden) |
| Saves to DB | ❌ No | ✅ Yes |
| Updates Stats | ❌ No | ✅ Yes |
| Purpose | Quick testing | Official submission |

---

## 📊 Database Schema

### PracticeProblem
```javascript
{
  title: String,
  difficulty: Enum['Easy', 'Medium', 'Hard'],
  topic: String,
  description: String,
  codeTemplate: { javascript, python, java, cpp },
  functionSignature: { name, params[], returnType },
  testCases: [{ input, expectedOutput, isHidden }],
  constraints: [String],
  hints: [String],
  examples: [{ input, output, explanation }],
  supportedLanguages: [String],
  acceptanceRate: Number,
  totalSubmissions: Number,
  acceptedSubmissions: Number
}
```

### PracticeSubmission
```javascript
{
  userId: ObjectId,
  problemId: ObjectId,
  code: String,
  language: Enum['javascript', 'python', 'java', 'cpp'],
  status: Enum['accepted', 'wrong_answer', 'runtime_error', ...],
  testResults: [{ input, expectedOutput, actualOutput, passed }],
  executionTime: Number,
  submittedAt: Date
}
```

---

## 🚀 Quick Start Commands

### Start Backend
```bash
cd server
npm install
npm start
```

### Start Frontend
```bash
cd client
npm install
npm start
```

### Upload Sample Problems
```bash
# Use provided sample-practice-problems.json
# Go to Admin Dashboard → Upload JSON
```

---

## 🔗 Navigation

From **Learn Hub** (`/LearnHub`):
- **📚 Practice Problems** → `/practice/problems`
- **💻 Code Editor Practice** → `/practice/editor`
- **📊 My Practice Progress** → `/practice/dashboard`

---

## 🎯 Key Differences vs Streak System

| Feature | Streak System | Practice System |
|---------|---------------|-----------------|
| Purpose | Daily challenge | Anytime practice |
| Time Limit | 24 hours | None |
| Difficulty | Progressive levels | User chooses |
| Rewards | Badges, streaks | Progress tracking |
| Problem Count | 1 per day | Unlimited library |

---

## 🛡️ Error Handling

**Common Errors:**
```
Compilation Error → Shows syntax issues
Runtime Error → Shows stack trace
Time Limit Exceeded → "Execution timed out after 10s"
Wrong Answer → Shows expected vs actual output
```

**Error Display:**
```
❌ Test Case 2 Failed

Input: [3,2,4]
         6
Expected: [1,2]
Your Output: [0,1]

Error: Index out of range
```

---

## 📈 Future Enhancements

- [ ] Video solution explanations
- [ ] Difficulty ratings (thumbs up/down)
- [ ] Discussion forum per problem
- [ ] Company tags (Google, Meta, etc.)
- [ ] Similar problems suggestions
- [ ] Time/space complexity analysis
- [ ] Solution templates
- [ ] Interview preparation playlists

---

## 🆘 Troubleshooting

**Problem: Code not running**
- Check Docker is installed and running
- Verify backend port 5000 is not blocked
- Check browser console for auth token

**Problem: Test cases failing incorrectly**
- Verify input format matches expected (newline-separated)
- Check function signature matches problem
- Ensure return type is correct (array vs number)

**Problem: Monaco Editor not loading**
- Clear browser cache
- Check internet connection (CDN loads)
- Verify `@monaco-editor/react` is installed

---

## 💡 Tips for Success

1. **Read constraints carefully** - They hint at optimal approach
2. **Start with examples** - Understand problem before coding
3. **Test edge cases** - Empty arrays, single elements, duplicates
4. **Use hints sparingly** - Try solving first, use hints if stuck
5. **Analyze AI feedback** - Learn optimization techniques
6. **Track progress** - Celebrate small wins!

---

## 📚 Sample Problems Included

1. **Two Sum** - Easy, Arrays
2. **Reverse String** - Easy, Strings
3. **Valid Parentheses** - Easy, Stack
4. **Merge Two Sorted Lists** - Easy, Linked List
5. **Longest Substring Without Repeating** - Medium, Strings
6. **3Sum** - Medium, Arrays
7. **Container With Most Water** - Medium, Two Pointers
8. **Binary Tree Level Order Traversal** - Medium, Trees
9. **Median of Two Sorted Arrays** - Hard, Binary Search
10. **Trapping Rain Water** - Hard, Arrays

---

## 🎓 Learning Resources

**Algorithms:**
- Time Complexity: Big O notation basics
- Space Complexity: Memory usage analysis
- Data Structures: Arrays, Trees, Graphs, Heaps

**Best Practices:**
- Write clean, readable code
- Add comments for complex logic
- Use meaningful variable names
- Handle edge cases

---

## 🏆 Achievement System (Future)

- 🥉 Bronze: 10 Easy problems
- 🥈 Silver: 25 total problems
- 🥇 Gold: 50 total problems
- 💎 Diamond: 100 total problems
- 🏅 Platinum: All Hard problems

---

## 📞 Support

**Issues?**
- Check this guide first
- Review console errors
- Contact admin or raise GitHub issue

**Feature Requests:**
- Submit via feedback form
- Join community Discord
- Contribute via pull request

---

## ✅ Summary

The **Interactive Coding Practice System** combines:
- 🎯 Real interview-style problems
- 🔒 Secure Docker execution
- 🤖 AI-powered analysis
- 📊 Progress tracking
- 🎨 Beautiful UI/UX

**Start practicing now at `/practice/problems`!** 🚀

---

**Last Updated:** October 25, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
