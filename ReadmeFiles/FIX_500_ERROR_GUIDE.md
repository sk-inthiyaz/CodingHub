# 🚨 500 Internal Server Error - Fix Guide

## Issue Identified
```
❌ Failed to fetch problems: 500 Internal Server Error
```

The server is throwing an error when trying to fetch problems from the database.

---

## What We've Done

Added **detailed error logging** to help diagnose the issue:

### ✅ Frontend Updates (AdminPracticeProblems.jsx):
```javascript
// Now shows:
// - Response status AND statusText
// - Full error object with details
// - Backend error message if available
// - Stack trace if provided by server
```

### ✅ Backend Updates (practiceRoutes.js):

1. **GET /problems/all** - Now logs:
   - Database connection state (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
   - Database query attempt
   - Problems found count
   - Full error stack trace if query fails

2. **GET /admin/stats** - Now logs:
   - Database connection state
   - Query attempts for each aggregation
   - Detailed error information

3. **New Health Check Endpoints**:
   - `GET /api/practice/health` - Public health check (no auth)
   - `GET /api/practice/admin/health` - Admin health check with database test

---

## 🔧 Troubleshooting Steps

### Step 1: Check Server Is Running & Connected

**In Browser Console (F12):**
```javascript
// Test 1: Server is responding
fetch('http://localhost:5000/api/practice/health')
  .then(r => r.json())
  .then(d => console.log('Server health:', d))

// Test 2: Database is connected (requires login as admin)
fetch('http://localhost:5000/api/practice/admin/health', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Database health:', d))
```

**Expected Outputs:**
```javascript
// Test 1 Should Show:
{ status: 'ok', database: 'connected', timestamp: '...' }

// Test 2 Should Show:
{ status: 'ok', database: 'connected', problemsCount: 7, timestamp: '...' }
```

### Step 2: Check Server Console Output

**Look for these messages when you try to fetch problems:**

```
🔄 Fetching problems...
Token exists: true
📊 Response status: 200 OK
🔍 Attempting to find all practice problems...
🗄️ Database connection state: 1  ← 1 = connected, other numbers = problem
✅ Found 7 problems
📦 Sending response: { problems: 'populated' }
```

**If you see errors like:**
```
❌ Error fetching problems: [Error message]
🔥 Error stack: [Full stack trace]
🔥 Error type: MongooseError / ValidationError / etc.
```

That's what we need to fix!

### Step 3: Restart Server with Enhanced Logging

**In terminal running server (stop with Ctrl+C, then restart):**

```bash
cd server
npm start
```

Should see:
```
✅ Server running on http://localhost:5000
✅ MongoDB connected
```

### Step 4: Test Upload → Fetch Flow

**Do this:**
1. Open DevTools (F12)
2. Go to Console tab
3. Switch to Admin Practice Problems
4. Upload a test problem
5. Capture ALL console output
6. Switch to "Problems History" tab
7. Capture console output again

**Send this information:**
- ✅ Console messages from both steps
- ✅ Server terminal output during upload
- ✅ Server terminal output during fetch
- ✅ Any error messages from either

---

## 🎯 Common Causes (in order of likelihood)

### Cause 1: Database Connection Issue
**Symptoms:**
- Server shows: `🗄️ Database connection state: 0` or `2` or `3`
- MongoDB is not running

**Fix:**
```bash
# Windows
mongod  # or whatever command starts MongoDB

# Docker
docker-compose up -d mongodb  # if using Docker

# Or check MongoDB Atlas connection
# - Verify connection string in .env
# - Check IP whitelist allows your IP
```

### Cause 2: Model Import Error
**Symptoms:**
- Server shows: `cannot find module` or `TypeError: PracticeProblem is not a constructor`
- Backend logs show: `require('../models/PracticeProblem')` failed

**Fix:**
```bash
cd server
npm install  # Reinstall dependencies
npm start    # Restart
```

### Cause 3: Schema Validation Error
**Symptoms:**
- Server shows: `ValidationError: path X is required`
- Saved problems don't match schema requirements

**Fix:**
- Upload problems with correct structure
- Ensure all required fields are present
- Check `server/models/PracticeProblem.js` for required fields

### Cause 4: Mongoose Query Error
**Symptoms:**
- Server shows: `MongoError` or `QueryError`
- Database collection might be corrupted

**Fix:**
```bash
# Check MongoDB:
mongosh
use ai-code-explainer
db.practiceproblems.findOne()

# If problematic, rebuild:
db.practiceproblems.drop()
# Upload problems again
```

### Cause 5: Memory/Resource Issue
**Symptoms:**
- Server crashes or becomes unresponsive
- Many Node processes running

**Fix:**
```bash
# Kill all Node processes
Get-Process node | Stop-Process -Force

# Restart server fresh
cd server
npm start
```

---

## 📋 Advanced Diagnostics

### Check Database Directly

**Using MongoDB Compass:**
1. Connect to `mongodb://localhost:27017` (or your connection string)
2. Database: `ai-code-explainer`
3. Collection: `practiceproblems`
4. Should see uploaded problems
5. Check if collection exists and has documents

**Using MongoDB Shell:**
```bash
mongosh mongodb://localhost:27017/ai-code-explainer

# Check problems exist
db.practiceproblems.countDocuments()

# See first problem
db.practiceproblems.findOne()

# See all problem titles
db.practiceproblems.find({}, { title: 1 })
```

### Check Network Request Details

**In Browser DevTools (F12) → Network tab:**

1. **Upload Request**
   - Method: POST
   - URL: `http://localhost:5000/api/practice/admin/upload-problems`
   - Status: 201 Created ✅
   - Response: `{ message: "Uploaded...", results: {...} }`

2. **Fetch Request**
   - Method: GET
   - URL: `http://localhost:5000/api/practice/problems/all`
   - Status: Should be 200 ✅ or 500 ❌
   - Response: Should show the error details if 500

3. **Click the request** → Response tab to see full error message

---

## 🚀 Step-by-Step Fix Process

### For 500 Error on /problems/all:

1. **Check server console for error message**
   - If you see the error type, search for it below
   - Look at the stack trace for the exact line

2. **Verify database connection**
   ```bash
   # In server console, does it say "MongoDB connected"?
   # If not, start MongoDB first
   ```

3. **Check if PracticeProblem model loads**
   ```bash
   # In server, on startup should show no require errors
   # If yes, reinstall: npm install mongoose
   ```

4. **Verify problems were actually saved**
   ```bash
   # Use MongoDB to check if problems exist after upload
   db.practiceproblems.countDocuments()
   # Should show 7 if upload worked
   ```

5. **Restart everything if still stuck**
   ```bash
   # Stop all Node processes
   Get-Process node | Stop-Process -Force
   
   # Kill any MongoDB issues
   Get-Process mongod | Stop-Process -Force  # if applicable
   
   # Restart MongoDB (if local)
   mongod
   
   # Restart server
   cd server && npm start
   
   # In separate terminal, restart client
   cd client && npm start
   ```

---

## ✅ Verification Checklist

After each fix attempt, check:

- [ ] Server shows "MongoDB connected"
- [ ] `GET /api/practice/health` returns success
- [ ] `GET /api/practice/admin/health` returns success + problemsCount
- [ ] Console logs show: `✅ Found X problems`
- [ ] No "❌ Error" messages in server console
- [ ] Network tab shows 200 for fetch request
- [ ] Problems table populates in Admin UI
- [ ] Stats card shows correct count

---

## 📝 Next Steps

1. **Restart server** with new error logging
2. **Attempt to fetch problems** (upload a test one first)
3. **Copy all console output** from both browser and server
4. **Share the output** with these key details:
   - Database connection state (0-3)
   - Exact error message from server
   - Error stack trace if available
   - Whether problems exist in MongoDB

With that info, we can pinpoint the exact issue! 🎯

---

## 🆘 Need Help?

**Share This Information:**
1. Complete server console output (from npm start to error)
2. Complete browser console output (from F12)
3. Screenshot of Network tab for the failed request
4. Result of: `db.practiceproblems.countDocuments()` in MongoDB

This will help us identify the exact issue immediately! ✨
