# Complete Streak Question Upload Flow

## Overview

This document explains the **complete end-to-end flow** for uploading and running streak questions with dynamic function signatures.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AdminDashboard (UI)                       │
│  • Detects question format (Regular vs Streak)                   │
│  • Validates required fields                                     │
│  • Routes to correct endpoint                                    │
└────┬─────────────────────────────────────────┬───────────────────┘
     │                                         │
     ▼                                         ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│  Regular Questions      │         │  Streak Questions       │
│  /api/questions/        │         │  /api/streak/           │
│  bulk-import            │         │  admin/daily            │
│                         │         │                         │
│  - difficulty field     │         │  - functionSignature    │
│  - General bank         │         │  - codeTemplate (4 lang)│
│  - Auto-5+ → streak     │         │  - Exactly 5 questions  │
└────────┬────────────────┘         └────────┬────────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         ▼
              ┌─────────────────────────┐
              │   MongoDB StreakQuestion │
              │   • level (1-5)         │
              │   • title               │
              │   • functionSignature   │
              │   • codeTemplate        │
              │   • testCases           │
              └────────┬────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    User Front-end / Code Harness / Docker Runner
         │             │             │
         └─────────────┼─────────────┘
                       ▼
            ┌─────────────────────────┐
            │   Dynamic Test Runner   │
            │  • Parse inputs by      │
            │    parameter count      │
            │  • Wrap user code       │
            │  • Execute in Docker    │
            │  • Compare outputs      │
            └────────┬────────────────┘
                     ▼
            ┌─────────────────────────┐
            │   Results & Storage     │
            │  • Pass/Fail verdict    │
            │  • Store accepted code  │
            │  • Update streak        │
            └─────────────────────────┘
```

---

## Step-by-Step Flow

### 1. Prepare Questions (Admin)

**Input Format:**
```json
{
  "questions": [
    {
      "title": "Find Single Number",
      "description": "...",
      "functionSignature": {
        "name": "singleNumber",
        "params": ["nums"],          // Variable params
        "returnType": "int"
      },
      "codeTemplate": {
        "javascript": "function singleNumber(nums) { }",
        "python": "def singleNumber(nums): pass",
        "java": "public int singleNumber(int[] nums) { }",
        "cpp": "int singleNumber(vector<int>& nums) { }"
      },
      "testCases": [
        {
          "input": "[2,2,1]",        // Single param: no \n
          "expectedOutput": "1",
          "isHidden": false
        }
      ]
    },
    // ... repeat 4 more times (exactly 5 questions)
  ]
}
```

### 2. Upload via AdminDashboard (Admin)

**File:** `admin-upload-streak.json`
**Action:** Click **Upload Questions** → Select file → Click **Import 5 Question(s)**

**AdminDashboard Logic:**
```javascript
// Detect format
const isStreakFormat = data.questions[0].functionSignature !== undefined;

if (isStreakFormat) {
  // Route to streak endpoint
  endpoint = "/api/streak/admin/daily"
  payload = { date: "2025-10-24", questions: [...] }
} else {
  // Route to regular endpoint
  endpoint = "/api/questions/bulk-import"
  payload = { questions: [...] }
}

// POST to correct endpoint
```

**Success Response (201):**
```json
{
  "message": "5 daily questions added successfully!",
  "questions": [
    {
      "level": 1,
      "levelName": "Easy",
      "title": "Find Single Number",
      "functionSignature": { "name": "singleNumber", "params": ["nums"], "returnType": "int" },
      "codeTemplate": { "javascript": "...", "python": "...", ... },
      "testCases": [ ... ],
      "_id": "..."
    },
    // ... 4 more
  ]
}
```

### 3. User Attempts Question

**Frontend Route:** `/streak`
**User Action:** Click "Try" on a level

**Load Question:**
```javascript
// Get question by level
GET /api/streak/today
Response: {
  level: 1,
  levelName: "Easy",
  title: "Find Single Number",
  functionSignature: { name: "singleNumber", params: ["nums"], returnType: "int" },
  codeTemplate: { javascript: "function singleNumber(nums) { }", ... },
  testCases: [ { input: "[2,2,1]", expectedOutput: "1", isHidden: false }, ... ]
}
```

**Display Correct Template:**
```javascript
// Get codeTemplate for selected language
const template = question.codeTemplate[userLanguage];
// e.g., "function singleNumber(nums) { }"
// ✅ CORRECT: Dynamic signature, not hardcoded "twoSum"
```

### 4. User Writes Code

**User Input:**
```javascript
function singleNumber(nums) {
    let result = 0;
    for (let num of nums) {
        result ^= num;
    }
    return result;
}
```

**User Tests (Run Public Tests):**
```
POST /api/streak/run
{
  "questionId": "...",
  "code": "function singleNumber(nums) { ... }",
  "language": "javascript"
}
```

### 5. Code Harness - Dynamic Wrapping

**Backend: streakController.js**
```javascript
// Get question to access functionSignature
const question = await StreakQuestion.findById(questionId);

// Pass metadata to harness
const results = await testCode(
  userCode,
  language,
  testCase,
  { functionSignature: question.functionSignature }  // ✅ Dynamic
);
```

**Backend: codeHarness.js**
```javascript
function wrapCodeWithHarness(userCode, language, testCase, questionMetadata) {
  const { functionSignature } = questionMetadata;
  const paramCount = functionSignature.params.length;
  
  // Example: singleNumber(nums) - 1 param
  // Wrap user code with test harness
  
  if (language === 'javascript') {
    return `
      ${userCode}
      
      // Parse input based on param count
      const input = "${testCase.input}";
      const paramCount = ${paramCount};
      const params = parseInputLines(input, paramCount);
      
      // Call function with correct params
      const result = ${functionSignature.name}(...params);
      
      // Output result
      console.log(JSON.stringify(result, null, 0));
    `;
  }
}

function parseInputLines(input, paramCount) {
  const lines = input.split(/\r?\n/);
  
  if (paramCount === 1) {
    // Single param: parse as JSON or string
    return [JSON.parse(lines[0])];  // [2,2,1] → [[2,2,1]]
  } else if (paramCount === 2) {
    // Two params: parse each line
    return [JSON.parse(lines[0]), JSON.parse(lines[1])];  // "[2,7,11,15]\n9" → [[2,7,11,15], 9]
  } else if (paramCount === 3) {
    // Three params: parse each line
    return [JSON.parse(lines[0]), JSON.parse(lines[1]), JSON.parse(lines[2])];
  }
}
```

### 6. Docker Execution

**Docker Runner:**
```bash
# For JavaScript (Node.js)
docker run --rm -i node:20-alpine node -e "
  function singleNumber(nums) {
      let result = 0;
      for (let num of nums) {
          result ^= num;
      }
      return result;
  }
  
  const input = '[2,2,1]';
  const lines = input.split('\\n');
  const params = [JSON.parse(lines[0])];
  const result = singleNumber(...params);
  console.log(JSON.stringify(result));
"

# Output: 1
```

### 7. Test Verification

**Backend: streakController.js**
```javascript
// Compare outputs robustly
function outputsEqual(actual, expected) {
  // Normalize both to JSON for comparison
  const normActual = JSON.parse(JSON.stringify(actual));
  const normExpected = JSON.parse(JSON.stringify(expected));
  
  return JSON.stringify(normActual) === JSON.stringify(normExpected);
}

// Check result
if (outputsEqual(result, testCase.expectedOutput)) {
  return { passed: true };
} else {
  return { passed: false, expectedOutput, actualOutput: result };
}
```

### 8. Response to User

**Test Run Response:**
```json
{
  "success": true,
  "message": "✅ 2/2 public test cases passed",
  "passedCount": 2,
  "totalCount": 2,
  "testResults": [
    {
      "testCase": 1,
      "passed": true,
      "input": "[2,2,1]",
      "expectedOutput": "1",
      "actualOutput": "1"
    },
    {
      "testCase": 2,
      "passed": true,
      "input": "[4,1,2,1,2]",
      "expectedOutput": "4",
      "actualOutput": "4"
    }
  ]
}
```

### 9. Final Submission

**User Action:** Click "Submit Solution"
```
POST /api/streak/submit
{
  "questionId": "...",
  "code": "function singleNumber(nums) { ... }",
  "language": "javascript"
}
```

**Backend:**
- Runs ALL tests (public + hidden)
- If all pass:
  - Save accepted submission
  - Update user streak
  - Grant points
  - Show "View Code" option on leaderboard

---

## Key Features Enabled by Dynamic Signatures

### ✅ Feature 1: Variable Parameters
```
Level 1: singleNumber(nums)           ← 1 param
Level 2: twoSum(nums, target)         ← 2 params
Level 3: isValid(s)                   ← 1 param (different type)
Level 4: merge(nums1, nums2)          ← 2 params
Level 5: lengthOfLongestSubstring(s)  ← 1 param (different type)
```

Each question has correct function signature, NOT hardcoded "twoSum"!

### ✅ Feature 2: Multi-Language Templates
```javascript
// Same function signature, different templates
Level 2 JavaScript:
function twoSum(nums, target) { }

Level 2 Python:
def twoSum(self, nums, target): pass

Level 2 Java:
public int[] twoSum(int[] nums, int target) { }

Level 2 C++:
vector<int> twoSum(vector<int>& nums, int target) { }
```

### ✅ Feature 3: Correct Parameter Parsing
```
Input parsing automatically adapts:

1 param: "[2,2,1]"           → parseInputLines(..., 1) → [[2,2,1]]
2 params: "[2,7]\n9"         → parseInputLines(..., 2) → [[2,7], 9]
3 params: "[1]\n[2]\n3"      → parseInputLines(..., 3) → [[1], [2], 3]
```

### ✅ Feature 4: Correct Function Calls
```javascript
// Harness automatically calls with correct params
// Based on functionSignature.params length

For singleNumber(nums):
  const result = singleNumber(...params);  // 1 arg

For twoSum(nums, target):
  const result = twoSum(...params);        // 2 args
```

---

## Database Schema

### StreakQuestion Collection
```javascript
{
  level: 1,                          // 1-5 (Easy, Mid, Mid-Easy, Hard, Mix)
  levelName: "Easy",
  title: "Find Single Number",
  description: "...",
  constraints: "...",
  hints: ["..."],
  
  functionSignature: {               // ✅ Dynamic per question
    name: "singleNumber",
    params: ["nums"],
    returnType: "int"
  },
  
  codeTemplate: {                    // ✅ Dynamic per question
    javascript: "function singleNumber(nums) { }",
    python: "def singleNumber(nums): pass",
    java: "public int singleNumber(int[] nums) { }",
    cpp: "int singleNumber(vector<int>& nums) { }"
  },
  
  testCases: [
    {
      input: "[2,2,1]",              // Format matches param count
      expectedOutput: "1",
      explanation: "...",
      isHidden: false
    }
  ],
  
  activeDate: "2025-10-24T00:00:00Z",
  solvedBy: [],
  createdAt: "...",
  updatedAt: "..."
}
```

---

## Summary of Fixed Issues

| Issue | Before | After |
|---|---|---|
| All questions showed "twoSum" template | ❌ Hardcoded | ✅ Dynamic from DB |
| Input parsing failed for different param counts | ❌ Hardcoded for 2 params | ✅ Adaptive parser |
| Couldn't upload multiple question types | ❌ Only twoSum | ✅ Any signature |
| Test inputs malformed for 1 param | ❌ "[2,2,1]\n9" (wrong) | ✅ "[2,2,1]" (correct) |
| AdminDashboard rejected streak questions | ❌ "Invalid format" | ✅ Auto-detects format |

---

## Testing Checklist

- [ ] Upload `admin-upload-streak.json` via AdminDashboard
- [ ] See ✅ "5 streak questions uploaded successfully"
- [ ] View each question in StreakPage
- [ ] Verify each has correct function signature (not twoSum)
- [ ] Write solutions in all 4 languages
- [ ] Verify public tests run correctly
- [ ] Verify inputs parsed correctly per parameter count
- [ ] Submit solution and check hidden tests
- [ ] Verify streak updates on success
- [ ] Check View Code modal shows submitted code
