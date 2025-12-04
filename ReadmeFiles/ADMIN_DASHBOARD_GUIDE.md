# AdminDashboard - Question Upload Guide

## Two Upload Methods

The AdminDashboard now supports **two question types**:

### 1️⃣ Regular Questions (General Question Bank)
Used for the general learning/practice sections.

**Format:**
```json
{
  "questions": [
    {
      "title": "Question Title",
      "description": "Problem description",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "Sample input",
          "expectedOutput": "Expected output"
        }
      ]
    }
  ]
}
```

**Endpoint:** `/api/questions/bulk-import`

**Auto-Publish:** When uploading 5+ regular questions, they automatically become today's streak questions (if streak not already set for today)

---

### 2️⃣ Streak Questions (Daily Challenge System)
Used for the daily 5-level streak system. **Must be exactly 5 questions** (one per level).

**Format:**
```json
{
  "questions": [
    {
      "title": "Find Single Number",
      "description": "Given an array where every element appears twice except one...",
      "functionSignature": {
        "name": "singleNumber",
        "params": ["nums"],
        "returnType": "int"
      },
      "codeTemplate": {
        "javascript": "function singleNumber(nums) { /* ... */ }",
        "python": "def singleNumber(nums): pass",
        "java": "public int singleNumber(int[] nums) { }",
        "cpp": "int singleNumber(vector<int>& nums) { }"
      },
      "testCases": [
        {
          "input": "[2,2,1]",
          "expectedOutput": "1",
          "isHidden": false
        }
      ]
    }
    // ... 4 more questions (exactly 5 total)
  ]
}
```

**Endpoint:** `/api/streak/admin/daily`

**Requirements:**
- Exactly 5 questions (one for each level: Easy, Mid, Mid-Easy, Hard, Mix)
- Each question must have `functionSignature` with name, params, and returnType
- Must have `codeTemplate` for all 4 languages
- Test cases must have correct input format based on parameter count

---

## How to Upload

### Step 1: Prepare Your JSON File

Choose regular or streak format depending on your needs.

### Step 2: Navigate to AdminDashboard

- Open the admin panel
- Click on **📥 Upload Questions** tab

### Step 3: Upload the File

- Click on the file input area
- Select your JSON file (`admin-upload-streak.json` or similar)
- The system will automatically validate and detect the format

### Step 4: Review Preview

- Check the JSON preview for accuracy
- If all questions pass validation, you'll see ✅ Preview
- If there are errors, you'll see ❌ error message

### Step 5: Import

- Click **Import X Question(s)** button
- Wait for the upload to complete
- You'll see a success message:
  - **Streak:** "🔥 5 streak questions uploaded successfully for today!"
  - **Regular:** "✅ X questions imported!"

---

## Format Detection

The AdminDashboard **automatically detects** question type:

| Detection Method | Format Detected |
|---|---|
| Has `difficulty` field | Regular question |
| Has `functionSignature` field | Streak question |
| Has `level` field | Streak question |
| Missing both | ❌ ERROR |

---

## Validation Rules

✅ **Required for ALL questions:**
- `title` (string)
- `description` (string)
- `testCases` (array)

✅ **Required for REGULAR questions:**
- `difficulty` (easy, medium, hard)

✅ **Required for STREAK questions:**
- `functionSignature` (with name, params, returnType)
- `codeTemplate` (for JavaScript, Python, Java, C++)
- Exactly 5 questions (no more, no less)

---

## Streak Question Input Format Rules

The input format in testCases depends on function parameters:

### Single Parameter
```json
"testCases": [
  {
    "input": "[2,2,1]",           // Single line
    "expectedOutput": "1"
  },
  {
    "input": "hello",             // Single line - raw string
    "expectedOutput": "world"
  }
]
```

### Two Parameters
```json
"testCases": [
  {
    "input": "[2,7,11,15]\n9",   // Two lines with \n separator
    "expectedOutput": "[0,1]"
  }
]
```

### Three+ Parameters
```json
"testCases": [
  {
    "input": "[1,2,3]\n[4,5,6]\n2",  // Multiple lines with \n
    "expectedOutput": "[1,2,3,4,5,6]"
  }
]
```

---

## Error Messages & Solutions

| Error | Cause | Solution |
|---|---|---|
| "Invalid question format at index 0" | Missing required fields | Add `title`, `description`, `testCases` |
| "Missing 'difficulty' or 'functionSignature'" | Not regular AND not streak | Add either `difficulty` or `functionSignature` |
| "Streak questions must have exactly 5 questions" | Wrong number of questions | Upload exactly 5 streak questions |
| "Failed to import questions" | Server error | Check console for details |

---

## Example Files

### Regular Questions Example
File: `questions-regular.json`
```json
{
  "questions": [
    {
      "title": "Hello World",
      "description": "Print hello world",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "",
          "expectedOutput": "hello world"
        }
      ]
    }
  ]
}
```

### Streak Questions Example
File: `admin-upload-streak.json` (ready to use in project root)
```json
{
  "questions": [
    {
      "title": "Find Single Number",
      "description": "...",
      "functionSignature": {
        "name": "singleNumber",
        "params": ["nums"],
        "returnType": "int"
      },
      "codeTemplate": { /* ... */ },
      "testCases": [ /* ... */ ]
    },
    // ... 4 more questions
  ]
}
```

---

## Tips & Tricks

✨ **Pro Tips:**
- Start with the example files and modify them
- Validate JSON syntax before uploading (use jsonlint.com)
- For streak questions, always verify parameter count matches input format
- Test locally first before uploading to production
- Keep version history of your question files

⚠️ **Common Mistakes:**
- ❌ Using escaped quotes in string inputs: `"\"hello\""` 
- ✅ Use raw strings: `"hello"`
- ❌ Forgetting `\n` between multi-param inputs
- ✅ Always separate with newlines: `"[1,2]\n3"`
- ❌ Uploading 4 or 6 streak questions
- ✅ Always upload exactly 5 for streak

---

## Next Steps

After uploading streak questions:
1. Visit the **🔥 Manage Streak Questions** tab to view today's questions
2. Users will see these questions in their daily streak challenge
3. Each level will show one question with dynamic function signature
4. Users can code in JavaScript, Python, Java, or C++
