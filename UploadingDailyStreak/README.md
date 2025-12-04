# Daily Streak Questions Upload Guide

## 📁 File Location
`UploadingDailyStreak/daily-streak-questions.json`

## 📋 JSON Structure

Each question in the array must have the following structure:

```json
{
  "level": 1,                    // Required: 1=Easy, 2=Mid, 3=Mid-Easy, 4=Hard, 5=Mix
  "levelName": "Easy",          // Required: "Easy", "Mid", "Mid-Easy", "Hard", "Mix"
  "title": "Question Title",    // Required: Clear, descriptive title
  "description": "...",         // Required: Full problem description
  "constraints": "...",         // Optional: Problem constraints
  "hints": ["hint1", "hint2"],  // Optional: Array of hints
  "functionSignature": {        // Required: Function details
    "name": "functionName",
    "params": ["param1", "param2"],
    "returnType": "int"
  },
  "codeTemplate": {            // Required: Code for all languages
    "javascript": "...",
    "python": "...",
    "java": "...",
    "cpp": "..."
  },
  "testCases": [               // Required: At least 2 test cases
    {
      "input": "input_value",
      "expectedOutput": "output_value",
      "explanation": "Why this output",
      "isHidden": false        // false = visible to user, true = hidden
    }
  ],
  "activeDate": "2025-11-14",  // Required: Date when question is active (YYYY-MM-DD)
  "expirationDate": "2025-11-14T23:59:59.999Z"  // Optional: Auto-set to 11:59 PM if not provided
}
```

## 🎯 Important Rules

### Level System
- **Level 1 (Easy)**: Basic problems, beginner-friendly
- **Level 2 (Mid)**: Intermediate difficulty
- **Level 3 (Mid-Easy)**: Between Easy and Mid
- **Level 4 (Hard)**: Advanced problems
- **Level 5 (Mix)**: Mixed difficulty elements

### Date Rules
- Only **ONE question per level per day** is allowed
- If you upload multiple questions for the same level and date, the first one will be saved and others will be skipped
- Format: `YYYY-MM-DD` (e.g., "2025-11-14")
- Questions expire at 11:59 PM on their active date (unless custom expiration set)

### Code Templates
All 4 languages are **required**:
- `javascript`
- `python`
- `java`
- `cpp`

### Test Cases
- Minimum **2 test cases** required
- At least 1 should be visible (`isHidden: false`)
- Include edge cases as hidden tests

## 🚀 How to Upload from Admin Dashboard

### Method 1: Using Admin Dashboard UI

1. Login as Admin
2. Go to Admin Dashboard
3. Navigate to "Streak Questions" section
4. Click "Bulk Upload"
5. Select your `daily-streak-questions.json` file
6. Click "Upload"
7. View upload summary (success/skipped/failed)

### Method 2: Using API (Postman/curl)

**Endpoint:**
```
POST http://localhost:5000/api/admin/streak/bulk-upload
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ADMIN_TOKEN"
}
```

**Body (raw JSON):**
```json
{
  "questions": [
    // ... paste your questions array here
  ]
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/admin/streak/bulk-upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @daily-streak-questions.json
```

## 📊 Response Format

### Successful Upload
```json
{
  "message": "Bulk upload completed",
  "summary": {
    "total": 7,
    "successful": 5,
    "skipped": 2,
    "failed": 0
  },
  "results": {
    "success": [
      {
        "title": "Reverse String",
        "date": "2025-11-14",
        "level": 1
      }
    ],
    "skipped": [
      {
        "title": "Two Sum",
        "reason": "Question already exists for this date and level"
      }
    ],
    "failed": []
  }
}
```

## ⚠️ Common Errors and Solutions

### Error: "Missing required fields"
**Solution:** Ensure all required fields are present:
- `level` (number 1-5)
- `levelName` (string)
- `title`
- `description`
- `activeDate`
- `functionSignature`
- `codeTemplate` (all 4 languages)
- `testCases` (array with at least 1 item)

### Error: "Question already exists for this date and level"
**Solution:** 
- Change the `activeDate` to a different day
- Or change the `level` to a different level
- Or delete the existing question first

### Error: "activeDate is required"
**Solution:** Add `"activeDate": "YYYY-MM-DD"` to each question

### Error: "Invalid level"
**Solution:** Level must be a number between 1-5, and levelName must match:
- 1 → "Easy"
- 2 → "Mid"
- 3 → "Mid-Easy"
- 4 → "Hard"
- 5 → "Mix"

## 📝 Sample Question Template

```json
{
  "level": 1,
  "levelName": "Easy",
  "title": "Your Question Title",
  "description": "Full problem description with examples and explanations",
  "constraints": "Problem constraints and limitations",
  "hints": [
    "First hint to guide thinking",
    "Second hint with approach",
    "Third hint with implementation detail"
  ],
  "functionSignature": {
    "name": "yourFunctionName",
    "params": ["param1", "param2"],
    "returnType": "int"
  },
  "codeTemplate": {
    "javascript": "/**\\n * @param {type} param1\\n * @return {type}\\n */\\nfunction yourFunctionName(param1) {\\n    // Write your solution here\\n}\\n",
    "python": "class Solution:\\n    def yourFunctionName(self, param1):\\n        \\\"\\\"\\\"\\n        :type param1: Type\\n        :rtype: Type\\n        \\\"\\\"\\\"\\n        # Write your solution here\\n        pass\\n",
    "java": "class Solution {\\n    public int yourFunctionName(int param1) {\\n        // Write your solution here\\n        \\n    }\\n}\\n",
    "cpp": "class Solution {\\npublic:\\n    int yourFunctionName(int param1) {\\n        // Write your solution here\\n        \\n    }\\n};\\n"
  },
  "testCases": [
    {
      "input": "test_input",
      "expectedOutput": "expected_result",
      "explanation": "Why this is the correct output",
      "isHidden": false
    },
    {
      "input": "edge_case_input",
      "expectedOutput": "edge_case_output",
      "explanation": "Edge case explanation",
      "isHidden": true
    }
  ],
  "activeDate": "2025-11-20",
  "expirationDate": "2025-11-20T23:59:59.999Z"
}
```

## 🔍 Validation Checklist

Before uploading, verify:
- [ ] All required fields are present
- [ ] Level number (1-5) matches levelName
- [ ] All 4 code templates are provided
- [ ] At least 2 test cases exist
- [ ] activeDate is in YYYY-MM-DD format
- [ ] No duplicate level+date combinations
- [ ] Function signatures are consistent across languages
- [ ] Input/output formats in test cases are clear

## 📞 Support

If you encounter issues:
1. Check server console logs for detailed error messages
2. Verify JSON syntax using a JSON validator
3. Ensure you're logged in as an admin
4. Check that the backend server is running on port 5000

## 🎉 Success Tips

- Upload questions for 7+ days at once for a full week
- Use different levels (1-5) for each day to provide variety
- Include clear explanations in test cases
- Add 2-3 hints that progressively reveal the solution approach
- Test your questions manually before bulk upload
