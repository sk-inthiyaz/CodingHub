# 🎬 Visual Debug Flow - 500 Error

## Current Issue Flow

```
User uploads problem
        ↓
✅ Upload successful (201 Created)
        ↓
Problems History tab clicked
        ↓
fetchProblems() called
        ↓
GET /api/practice/problems/all
        ↓
❌ 500 Internal Server Error
        ↓
Console shows error details
```

---

## What We Added - Diagnosis Points

```
📊 FRONTEND (Browser Console F12)
├─ 🔄 Fetching problems...
├─ Token exists: true
├─ 📊 Response status: 200 or 500
└─ ❌ Failed with details: [error message]

📡 BACKEND (Server Console)
├─ 📚 [GET /problems/all] User: admin@email.com
├─ 🔍 Attempting to find all practice problems...
├─ 🗄️ Database connection state: 1 (0=bad, 1=good, 2=connecting, 3=disconnecting)
├─ ✅ Found 7 problems
└─ OR ❌ Error fetching problems: [error details]

🩺 HEALTH CHECKS (New endpoints)
├─ GET /api/practice/health
│  └─ Returns: { status: 'ok', database: 'connected' }
└─ GET /api/practice/admin/health (needs admin token)
   └─ Returns: { status: 'ok', database: 'connected', problemsCount: 7 }
```

---

## Diagnosis Tree

```
START: Server running?
├─ YES: Continue...
├─ NO: Run: npm start
│
NEXT: Health check OK?
├─ GET /api/practice/health returns success?
│  ├─ YES: Server responding ✅
│  ├─ NO: Server crashed or not running ❌
│  │
│  NEXT: Database connected?
│  ├─ Admin health check returns problemsCount?
│  │  ├─ YES: Database working ✅
│  │  ├─ NO: Database not running ❌
│  │     └─ Solution: Start MongoDB (mongod)
│  │
│  NEXT: Problems in database?
│  ├─ problemsCount > 0?
│  │  ├─ YES: Problems exist ✅
│  │  ├─ NO: Upload failed ❌
│  │     └─ Upload again and check server console
│  │
│  NEXT: Fetch problems returns data?
│  └─ Console shows "✅ Fetched problems"?
│     ├─ YES: FIXED! 🎉
│     ├─ NO: Server returning 500 ❌
│        └─ Check server console for error message
```

---

## Test Commands (Copy & Paste)

### Test 1: Server Health
```javascript
// Paste in browser console (F12)
fetch('http://localhost:5000/api/practice/health')
  .then(r => r.json())
  .then(d => console.log('Server:', d))
```

**Expected:** `{ status: 'ok', database: 'connected', timestamp: '...' }`

### Test 2: Database Health (After Login)
```javascript
// Paste in browser console (F12)
fetch('http://localhost:5000/api/practice/admin/health', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Database:', d))
```

**Expected:** `{ status: 'ok', database: 'connected', problemsCount: 7, timestamp: '...' }`

### Test 3: Fetch Problems (After Login)
```javascript
// Paste in browser console (F12)
fetch('http://localhost:5000/api/practice/problems/all', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
  .then(r => r.json())
  .then(d => console.log('Problems:', d.problems?.length, 'found'))
```

**Expected:** `Problems: 7 found`

---

## Error Messages Explained

| Message | Means | Fix |
|---------|-------|-----|
| `database: 'disconnected'` | MongoDB not running | Start MongoDB: `mongod` |
| `database: 'connecting'` | MongoDB starting | Wait a few seconds, try again |
| `problemsCount: 0` | No problems uploaded | Upload problems |
| `status: 500` | Server error | Check server console for details |
| `401 Unauthorized` | Not logged in | Login first |
| `403 Forbidden` | Not admin | Need admin account |
| `Cannot read property 'find'` | Model not loaded | `npm install` in server folder |

---

## Server Console Log Examples

### ✅ SUCCESS
```
📚 [GET /problems/all] User: admin@test.com isAdmin: true
🔍 Attempting to find all practice problems...
🗄️ Database connection state: 1
✅ Found 7 problems
📦 Sending response: { problems: 'populated' }
```

### ❌ DATABASE NOT CONNECTED
```
📚 [GET /problems/all] User: admin@test.com isAdmin: true
🔍 Attempting to find all practice problems...
🗄️ Database connection state: 0
❌ Error fetching problems: Error: Database not connected. Connection state: 0
🔥 Error type: Error
```

### ❌ MONGODB DOWN
```
📚 [GET /problems/all] User: admin@test.com isAdmin: true
🔍 Attempting to find all practice problems...
🗄️ Database connection state: 1
❌ Error fetching problems: MongooseError: Cannot connect to MongoDB
🔥 Error type: MongooseError
🔥 Error stack: [stack trace...]
```

### ❌ MODEL ERROR
```
❌ Error fetching problems: TypeError: PracticeProblem.find is not a function
🔥 Error type: TypeError
🔥 Error stack: [stack trace...]
```

---

## Quick Decision Matrix

| Find This | Look Here | Action |
|-----------|-----------|--------|
| Server running? | Terminal shows "Server running on 5000" | If not: `npm start` |
| DB connected? | Server console shows connection state | If 0: Start MongoDB |
| Problems exist? | Admin health endpoint returns count | If 0: Upload problems |
| Fetch working? | Browser console shows ✅ or ❌ | If ❌: Check server error |
| Error details? | Server console for "❌ Error fetching" | Share this message |

---

## Action Flow

```
1. Restart Server
   └─ npm start
   └─ Check: "MongoDB connected" appears?

2. Test Health Checks
   └─ Run Test 1 in console
   └─ Check: database: 'connected'?

3. Verify Database
   └─ Run Test 2 in console
   └─ Check: problemsCount > 0?

4. Upload Test Problem
   └─ Admin UI → Upload Tab
   └─ Check: "✅ Upload successful"?

5. Fetch Problems
   └─ Switch to History Tab
   └─ Check: Problems appear in table?

6. Check Console Output
   └─ Server: Look for ✅ or ❌
   └─ Browser: Look for success or error
   
7. If Error
   └─ Copy server console error message
   └─ Copy browser console error message
   └─ Share for diagnosis
```

---

## Most Common Fixes (in order of likelihood)

1. **Start MongoDB**
   ```bash
   mongod
   ```
   ✅ 60% chance this fixes it

2. **Restart Server**
   ```bash
   npm start
   ```
   ✅ 20% chance this fixes it

3. **Reinstall Dependencies**
   ```bash
   npm install
   npm start
   ```
   ✅ 10% chance this fixes it

4. **Check Connection String**
   - Open `.env`
   - Verify: `MONGODB_URI=mongodb://localhost:27017/ai-code-explainer`
   ✅ 5% chance this fixes it

5. **Check Database**
   ```bash
   mongosh
   use ai-code-explainer
   db.practiceproblems.countDocuments()
   ```
   ✅ 5% chance (usually OK if MongoDB running)

---

## Status Indicators

```
🟢 GREEN (All Good)
├─ Server: running
├─ DB: connected (state: 1)
├─ Problems: exist (count > 0)
├─ Fetch: returns 200
└─ Result: Problems display ✅

🟡 YELLOW (Needs Action)
├─ Server: running
├─ DB: connecting (state: 2)
├─ Problems: maybe exist
├─ Fetch: pending...
└─ Action: Wait, then retry

🔴 RED (Broken)
├─ Server: not running
├─ DB: disconnected (state: 0)
├─ Problems: don't exist
├─ Fetch: returns 500
└─ Action: Fix required
```

---

## Next Step

**Do This Right Now:**
1. Restart server: `Ctrl+C` then `npm start`
2. Run Test 1 in console
3. Share the result

If all green → Problems should display ✅
If any red → Share the error for immediate fix 🎯
