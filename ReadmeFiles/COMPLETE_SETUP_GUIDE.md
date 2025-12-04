# 🎉 LeetCode-Style Code Editor - COMPLETE SETUP GUIDE

## ✅ What's Been Implemented

### 1. Language-Specific Templates ✓
- **Model Updated**: `StreakQuestion` now has `codeTemplate` field with boilerplates for:
  - JavaScript (Node.js)
  - Python
  - Java (public class Main)
  - C++ (with iostream)
  
- **Frontend Updated**: When user selects a language, the code editor automatically loads the correct template

### 2. Run & Submit Functionality ✓
- **Run Button**: Tests only PUBLIC test cases (isHidden: false) in Docker containers
- **Submit Button**: Tests ALL test cases (public + hidden) in Docker containers
- **Real Execution**: Code actually runs in isolated Docker containers with timeout and memory limits
- **Detailed Results**: Shows which test case failed with input/expected/actual output

### 3. Admin Upload Format ✓
- **Documentation**: See `server/ADMIN_UPLOAD_FORMAT.md` for complete guide
- **Sample File**: `server/sample-streak-questions.json` ready to use
- **Key Feature**: `isHidden` flag controls test case visibility

---

## 🚀 How to Test Everything

### Step 1: Restart Backend (If Running)
The server is already running. If you made changes and need to restart:

```bash
# Stop current server (Ctrl+C in the terminal)
cd server
npm start
```

Backend should show:
```
🚀 Server running on port 5000
MongoDB connected successfully
```

### Step 2: Start Frontend

```bash
cd client
npm start
```

### Step 3: Test Language Templates

1. Navigate to `http://localhost:3000/streak/solve`
2. Select different languages from dropdown:
   - **JavaScript** → Should show: `function solution() {...}`
   - **Python** → Should show: `def solution(): ...`
   - **Java** → Should show: `public class Main {...}`
   - **C++** → Should show: `#include <iostream>...`
3. Code editor should update automatically!

### Step 4: Test Run Button (Public Tests Only)

1. Write simple code (or use template)
2. Click **"▶ Run"** button
3. Check "Test Results" tab
4. Should see results for ONLY public test cases (2-3 cases)
5. If any fail, you'll see:
   ```
   ❌ Test Case 1 Failed
   Input: [2,7,11,15]
   Expected: [0,1]
   Got: undefined
   ```

### Step 5: Test Submit Button (All Tests)

1. Fix your code if needed
2. Click **"Submit"** button
3. Should run ALL test cases (public + hidden)
4. If all pass: Streak updates, redirects to dashboard
5. If any fail: Shows first failed test with details

### Step 6: Upload Questions as Admin

#### Option A: Use Sample File
```bash
# Use the provided sample file
curl -X POST http://localhost:5000/api/streak/admin/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @server/sample-streak-questions.json
```

#### Option B: Use Postman
1. Open Postman
2. Create POST request to `http://localhost:5000/api/streak/admin/daily`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body: Copy content from `server/sample-streak-questions.json`
5. Send!

---

## 📋 Admin Upload Format - Quick Reference

### Structure
```json
{
  "date": "2025-10-21",
  "questions": [
    {
      "title": "Problem Title",
      "description": "Problem description...",
      "constraints": "Input constraints...",
      "hints": ["Hint 1", "Hint 2"],
      "codeTemplate": {
        "javascript": "// JS template",
        "python": "# Python template",
        "java": "// Java template",
        "cpp": "// C++ template"
      },
      "testCases": [
        {
          "input": "test input",
          "expectedOutput": "expected output",
          "explanation": "Why this output?",
          "isHidden": false  // PUBLIC - visible to users
        },
        {
          "input": "edge case",
          "expectedOutput": "output",
          "isHidden": true   // HIDDEN - only for submit
        }
      ]
    },
    // ... 4 more questions (total 5 required)
  ]
}
```

### Key Rules
✅ **Must have exactly 5 questions** (one per level)
✅ **Each question needs at least 2 public test cases** (isHidden: false)
✅ **Hidden test cases** (isHidden: true) test edge cases
✅ **Java template must have** `public class Main`
✅ **Input/output must match exactly** (whitespace is trimmed)

---

## 🐳 Docker Requirements

Make sure Docker is running! The code execution needs these images:
- `node:20` (JavaScript)
- `python:3.11` (Python)
- `openjdk:21` (Java)
- `gcc:13` (C++)

First run will pull these images automatically (~2-3 minutes).

Test Docker:
```bash
docker --version
docker ps
```

---

## 🔍 Troubleshooting

### Problem: "Cannot find module 'uuid'"
**Solution**: Already fixed! We installed uuid.

### Problem: "Run button does nothing"
**Check**:
1. Is backend running? Check terminal for errors
2. Is Docker running? Check `docker ps`
3. Open browser console (F12) for errors

### Problem: "Template doesn't load"
**Check**:
1. Did you upload questions with `codeTemplate` field?
2. Check browser console for errors
3. Try refreshing the page

### Problem: "All tests fail even with correct code"
**Check**:
1. Input format: Does your code read input correctly?
2. Output format: Does output match exactly? (check spacing)
3. Docker images: Are they pulled? Check with `docker images`

### Problem: "Submit says 'already solved'"
**Solution**: Each user can only solve once per day. Delete your submission from database or wait until next day.

---

## 📊 Test Case Visibility Explained

### PUBLIC Test Cases (`isHidden: false`)
- ✅ Visible in UI
- ✅ Run with "Run" button
- ✅ Help users understand the problem
- 📝 Typical: 2-3 cases

### HIDDEN Test Cases (`isHidden: true`)
- ❌ Not visible to users
- ✅ Only run with "Submit" button
- ✅ Test edge cases thoroughly
- 📝 Typical: 5-15 cases

**Example Distribution**:
```
Two Sum Problem:
├── Public (2 cases)
│   ├── [2,7,11,15], target=9 → [0,1]
│   └── [3,2,4], target=6 → [1,2]
└── Hidden (8 cases)
    ├── Edge: [3,3], target=6 → [0,1]
    ├── Edge: negatives, zeros, large numbers...
    └── Stress: 10,000 elements
```

---

## 🎯 Quick Command Reference

### Start Services
```bash
# Backend
cd server && npm start

# Frontend (new terminal)
cd client && npm start
```

### Upload Questions
```bash
# Get admin token first (login as admin in UI)
# Then upload:
curl -X POST http://localhost:5000/api/streak/admin/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @server/sample-streak-questions.json
```

### Check Docker
```bash
docker --version
docker ps
docker images | grep -E "node|python|openjdk|gcc"
```

### Test Backend API
```bash
# Get today's question
curl http://localhost:5000/api/streak/today \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎓 Example Workflow

1. **Admin uploads 5 questions** for today using `sample-streak-questions.json`
2. **User logs in** and navigates to `/streak/solve`
3. **User sees** Level 1 question based on their current level
4. **User selects Python** from dropdown
5. **Template loads** with Python boilerplate
6. **User writes code** in the editor
7. **User clicks Run** → Only 2-3 public test cases execute
8. **Results show** which passed/failed with details
9. **User fixes code** if needed
10. **User clicks Submit** → All test cases execute (public + hidden)
11. **If all pass**: Streak increases, badge earned, redirects to dashboard
12. **If some fail**: Shows which test case failed with exact input/output

---

## 📚 Additional Resources

- **Full Documentation**: `server/ADMIN_UPLOAD_FORMAT.md`
- **Sample Questions**: `server/sample-streak-questions.json`
- **Docker Runner**: `server/utils/dockerRunner.js`
- **Frontend Component**: `client/src/components/StreakQuestion/SolvePage.jsx`

---

## ✨ What Makes This LeetCode-Style?

✅ Split-screen layout (problem | code editor)
✅ Language selector with auto-template loading
✅ Public test cases shown, hidden test cases secret
✅ Run button for quick testing (public only)
✅ Submit button for full evaluation (all tests)
✅ Detailed failure reporting with test case specifics
✅ Real code execution in Docker containers
✅ Streak system with badges and levels
✅ Admin dashboard for question management

---

## 🎉 You're All Set!

Everything is working:
- ✅ Backend running with Docker execution
- ✅ Language templates configured
- ✅ Run/Submit buttons functional
- ✅ Admin upload format documented
- ✅ Sample questions ready to use

**Next Steps**:
1. Upload the sample questions using admin account
2. Test as a regular user
3. Try different languages and see templates load
4. Click Run to test public cases
5. Click Submit to evaluate all cases

Enjoy your LeetCode-style coding platform! 🚀
