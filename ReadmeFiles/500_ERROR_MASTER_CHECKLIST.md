# ✅ 500 Error - Master Checklist

## 📋 Pre-Fix Checklist

### System Requirements
- [ ] Node.js installed
- [ ] MongoDB installed or Docker available
- [ ] Server code downloaded
- [ ] Client code downloaded
- [ ] .env file exists with MONGODB_URI

### Before You Start
- [ ] Close browser (optional)
- [ ] Stop any running servers (Ctrl+C)
- [ ] Open terminal/PowerShell
- [ ] Have DevTools ready (F12)

---

## 🚀 Quick Fix Checklist (2 minutes)

### Step 1: Start MongoDB
- [ ] Open new PowerShell/terminal
- [ ] Run: `mongod`
- [ ] Wait for: "waiting for connections on port 27017"
- [ ] Keep this terminal open

### Step 2: Start Server
- [ ] Go to server directory: `cd server`
- [ ] Run: `npm start`
- [ ] Wait for: "✅ MongoDB connected"
- [ ] Wait for: "✅ Server running on..."
- [ ] Keep this terminal open

### Step 3: Test Health Check
- [ ] Open browser
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Paste and run:
  ```javascript
  fetch('http://localhost:5000/api/practice/health')
    .then(r => r.json()).then(console.log)
  ```
- [ ] Check result shows: `database: 'connected'`

### Step 4: Test & Verify
- [ ] Go to Admin Practice Problems
- [ ] Go to Upload tab
- [ ] Upload a test problem
- [ ] Check console: `✅ Upload successful`
- [ ] Go to Problems History tab
- [ ] Check: Problems appear in table
- [ ] Check console: `✅ Fetched problems: X`

### Result
- [ ] All ✅? → **FIXED! 🎉**
- [ ] Any ❌? → **Continue to next checklist**

---

## 🔍 Diagnostic Checklist (5-10 minutes)

### Information Collection

#### Server Console
- [ ] Restart server with enhanced logging
- [ ] Run: `npm start`
- [ ] Capture these lines:
  - [ ] MongoDB connection status
  - [ ] "📚 [GET /problems/all]" message
  - [ ] "🗄️ Database connection state:" (note the number)
  - [ ] Any "❌ Error" messages
  - [ ] Any "🔥 Error stack:" content

#### Browser Console (F12)
- [ ] Open Console tab
- [ ] Attempt to fetch problems
- [ ] Capture:
  - [ ] "🔄 Fetching problems..."
  - [ ] "📊 Response status: [code]"
  - [ ] "✅ Fetched" OR "❌ Failed" message
  - [ ] Full error object if present

#### Database Check
- [ ] Open MongoDB Compass or shell
- [ ] Connect to: `mongodb://localhost:27017`
- [ ] Go to database: `ai-code-explainer`
- [ ] Go to collection: `practiceproblems`
- [ ] Count documents: `db.practiceproblems.countDocuments()`
- [ ] Note the count: ____

#### Network Tab
- [ ] Open DevTools → Network tab
- [ ] Attempt to fetch problems
- [ ] Find request: `problems/all`
- [ ] Check status code: ____
- [ ] Click response tab
- [ ] Copy response body

---

## 🛠️ Troubleshooting Checklist

### Issue: Database Connection State = 0

**Symptom:** Server shows `🗄️ Database connection state: 0`

**Diagnosis Steps:**
- [ ] Is MongoDB running? (Check for mongod window)
- [ ] Is correct database URL in .env?
- [ ] Is MongoDB port 27017 free?

**Fix Attempts (try in order):**
1. [ ] `mongod` (start MongoDB)
   - [ ] Test with health check
   - [ ] Did it work?
2. [ ] Restart server: `npm start`
   - [ ] Test with health check
   - [ ] Did it work?
3. [ ] Check .env file: `MONGODB_URI=...`
   - [ ] Correct? Or needs fixing?
4. [ ] If using MongoDB Atlas:
   - [ ] Check connection string
   - [ ] Add IP to whitelist
   - [ ] Restart server

**Result:**
- [ ] Fixed ✅
- [ ] Still broken ❌ → Continue to next issue

### Issue: Database Connection State = 1 but Fetch Returns 500

**Symptom:** Connected, but still getting 500 error

**Diagnosis Steps:**
- [ ] What's the exact error message?
  - [ ] "TypeError: ..."
  - [ ] "ValidationError: ..."
  - [ ] "MongoError: ..."
  - [ ] Other: ____
- [ ] Can MongoDB query work directly?
  - [ ] `db.practiceproblems.findOne()`
  - [ ] Does it return a problem?

**Fix Attempts (try in order):**
1. [ ] Check model loads: `npm install`
   - [ ] `npm start`
   - [ ] Test health check
   - [ ] Did it work?
2. [ ] Check schema validation:
   - [ ] Upload problem
   - [ ] Check server console for validation errors
   - [ ] Fix data if needed
3. [ ] Rebuild database:
   - [ ] `db.practiceproblems.drop()`
   - [ ] Upload fresh
   - [ ] Test fetch

**Result:**
- [ ] Fixed ✅
- [ ] Still broken ❌ → Share error details

### Issue: Model Not Loading

**Symptom:** Error shows "PracticeProblem is not a constructor"

**Diagnosis Steps:**
- [ ] Is models folder present?
- [ ] Is PracticeProblem.js in models folder?
- [ ] Are dependencies installed?

**Fix Attempts:**
1. [ ] Reinstall dependencies:
   ```bash
   cd server
   npm install
   npm start
   ```
   - [ ] Did it work?
2. [ ] Restart server:
   ```bash
   npm start
   ```
   - [ ] Did it work?

**Result:**
- [ ] Fixed ✅
- [ ] Still broken ❌ → Share error details

---

## 📤 Information to Gather If Still Broken

### Gather All 4

#### 1. Server Console Output
- [ ] Restart server
- [ ] Attempt fetch
- [ ] Copy-paste entire console output
- [ ] Include: MongoDB connection message, fetch attempt, error (if any)
- [ ] Save to: `server_console_output.txt`

#### 2. Browser Console Output
- [ ] Open F12 → Console
- [ ] Attempt fetch
- [ ] Screenshot or copy all messages
- [ ] Include: "🔄 Fetching", status, error message
- [ ] Save to: `browser_console_output.txt`

#### 3. Network Tab Response
- [ ] Open F12 → Network
- [ ] Attempt fetch
- [ ] Find `problems/all` request
- [ ] Click Response tab
- [ ] Copy entire response
- [ ] Save to: `network_response.txt`

#### 4. MongoDB Status
- [ ] Run: `db.practiceproblems.countDocuments()`
- [ ] Result: ____
- [ ] Run: `db.practiceproblems.findOne()`
- [ ] Result found? YES / NO

---

## 📝 Collected Information Template

```
SERVER CONSOLE OUTPUT:
[paste here]

BROWSER CONSOLE OUTPUT:
[paste here]

NETWORK RESPONSE:
[paste here]

MONGODB INFO:
- Problems count: ____
- Can find one? YES/NO
- Connection string: ____
- Running? YES/NO

ADDITIONAL NOTES:
[add any other details]
```

---

## ✅ Final Verification Checklist

### When You Think It's Fixed

- [ ] Restart browser completely (close and reopen)
- [ ] Go to Admin Practice Problems
- [ ] Click Upload tab
- [ ] Upload a fresh test problem
- [ ] Check console: `✅ Upload successful`
- [ ] Wait 1 second
- [ ] Click Problems History tab
- [ ] Check table: Problems appear?
- [ ] Check console: `✅ Fetched problems`
- [ ] Check stats card: Count updated?
- [ ] Refresh page (F5)
- [ ] Problems still there?
- [ ] No errors in console?

### All Checked?
- [ ] YES → **FIXED! 🎉**
- [ ] NO → Which step failed? ____

---

## 🎓 Learning Checklist

### Understanding the Fix

- [ ] Read: `500_ERROR_SUMMARY.md`
- [ ] Understand: What was changed
- [ ] Read: `CODE_CHANGES_500_ERROR.md`
- [ ] Understand: How each change helps
- [ ] Test: Run health check commands
- [ ] Test: Upload → Fetch flow
- [ ] Verify: All logging appears
- [ ] Know: How to diagnose future issues

---

## 📊 Status Tracking

### Before You Start
- [ ] Have 30 minutes available? (worst case)
- [ ] Have all access (terminals, browser)?
- [ ] Have database credentials ready?
- [ ] Have error documentation ready?

### During Fix
- [ ] Tracking which steps completed?
- [ ] Noting error messages as they appear?
- [ ] Keeping terminals open?
- [ ] Checking console after each action?

### After Fix
- [ ] Verified it's actually working?
- [ ] Tested multiple times?
- [ ] Refreshed page to confirm?
- [ ] Checked both browser and server logs?

---

## 🎯 Success Criteria

### Minimum (System Works)
- [ ] Upload succeeds
- [ ] Fetch returns data (no 500)
- [ ] Problems visible in table
- [ ] No console errors

### Good (System Robust)
- [ ] All above ✅
- [ ] Health checks working
- [ ] Error messages helpful
- [ ] Can debug future issues

### Excellent (System Optimized)
- [ ] All above ✅
- [ ] Understand root cause
- [ ] Can prevent recurrence
- [ ] Monitoring in place

---

## 📞 Support Escalation Path

### Level 1: Self-Service (You)
- [ ] Try quick fixes
- [ ] Follow action plan
- [ ] Collect diagnostic info
- [ ] Attempt troubleshooting

### Level 2: Documentation
- [ ] Read comprehensive guide
- [ ] Run diagnostic tests
- [ ] Check error message meanings
- [ ] Try advanced fixes

### Level 3: Support Request
- [ ] Gather all 4 information items
- [ ] Provide collected data
- [ ] Share this checklist completion
- [ ] Wait for response

### Level 4: Emergency (If Critical)
- [ ] Note exact error
- [ ] Note what you tried
- [ ] Note what failed
- [ ] Request immediate assistance

---

## ⏱️ Time Tracking

| Task | Est. Time | Actual | Status |
|------|-----------|--------|--------|
| Restart MongoDB | 1 min | __ min | [ ] |
| Start Server | 1 min | __ min | [ ] |
| Health Check | 1 min | __ min | [ ] |
| Upload Test | 2 min | __ min | [ ] |
| Fetch Test | 2 min | __ min | [ ] |
| Diagnostics | 5 min | __ min | [ ] |
| Troubleshoot | 5-15 min | __ min | [ ] |
| **Total** | **5-25 min** | __ min | |

---

## 🎉 Completion

### When All Fixed
- [ ] Check all success criteria
- [ ] Verify one final time
- [ ] Close documentation
- [ ] Mark complete
- [ ] Time to fix: ____ minutes
- [ ] Root cause was: ____
- [ ] Solution applied: ____

### Notes for Future
```
What happened: [describe issue]
How it was fixed: [describe fix]
What to watch for: [prevention tips]
Related docs: [reference files]
```

---

**Status: Checklist Ready** ✅

**Next: Print or save this checklist, then follow it step-by-step** 📋

**Track: Check off each item as you complete it** ✔️
