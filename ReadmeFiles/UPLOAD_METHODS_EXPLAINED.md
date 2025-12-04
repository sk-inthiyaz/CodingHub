# 🚨 IMPORTANT: Two Different Upload Methods

## You Have TWO Question Systems:

### 1. Regular Questions (Upload Tab) ❌ Wrong for Streak
- **Location**: Admin Dashboard → "📥 Upload Questions" tab
- **Format**: Simple format with `difficulty` field
- **File to use**: `sample-questions-for-upload-tab.json`
- **Purpose**: General practice questions (not streak-specific)
- **Auto-publishes to streak**: YES, if you upload 5+ questions

### 2. Streak Questions (API Only) ✅ Correct for Streak
- **Location**: Use API directly (Postman/curl)
- **Endpoint**: `POST http://localhost:5000/api/streak/admin/daily`
- **Format**: Advanced format with `codeTemplate`, `isHidden` test cases
- **File to use**: `sample-streak-questions.json`
- **Purpose**: Daily streak challenges with language templates

---

## ⚠️ Your Current Error

You uploaded `sample-streak-questions.json` to the **Upload Tab**, but that tab expects the simpler format with `difficulty` field.

The streak file has `levelName` instead of `difficulty`, which caused the error:
```
Error: Invalid question format at index 0
```

---

## 🎯 Quick Fix - Choose Your Path:

### Path A: Upload to Regular Questions Tab (Easiest)
✅ **Use this file**: `sample-questions-for-upload-tab.json`

1. Go to Admin Dashboard
2. Click "📥 Upload Questions" tab
3. Upload `sample-questions-for-upload-tab.json`
4. It will automatically publish 5 questions to today's streak!

---

### Path B: Upload Directly to Streak API (Full Control)
✅ **Use this file**: `sample-streak-questions.json`

#### Using PowerShell:
```powershell
cd server

# First, get your admin token from browser localStorage
# Then run:
$token = "YOUR_ADMIN_TOKEN_HERE"

curl.exe -X POST http://localhost:5000/api/streak/admin/daily `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d "@sample-streak-questions.json"
```

#### Using Postman:
1. Create new POST request
2. URL: `http://localhost:5000/api/streak/admin/daily`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body (raw JSON): Copy entire content from `sample-streak-questions.json`
5. Send!

---

## 📋 File Comparison

### sample-questions-for-upload-tab.json (Simple Format)
```json
{
  "questions": [
    {
      "title": "Two Sum",
      "description": "...",
      "difficulty": "easy",  ← Simple difficulty
      "category": "Arrays",
      "hints": ["..."],
      "testCases": [
        { "input": "...", "expectedOutput": "..." }
      ]
    }
  ]
}
```

### sample-streak-questions.json (Advanced Format)
```json
{
  "date": "2025-10-21",
  "questions": [
    {
      "title": "Two Sum",
      "description": "...",
      "codeTemplate": {  ← Language-specific templates
        "javascript": "...",
        "python": "...",
        "java": "...",
        "cpp": "..."
      },
      "testCases": [
        {
          "input": "...",
          "expectedOutput": "...",
          "isHidden": false  ← Public/Hidden control
        }
      ]
    }
  ]
}
```

---

## 🎯 Recommended Solution

**For your use case (testing streak with language templates):**

### Option 1: Use Upload Tab (Simplest)
1. Upload `sample-questions-for-upload-tab.json` in Admin Dashboard
2. System auto-publishes to streak
3. You can test Run/Submit buttons
4. ⚠️ No custom language templates (uses defaults)

### Option 2: Use Streak API (Full Features)
1. Use Postman or curl with `sample-streak-questions.json`
2. Get full control over templates per language
3. Control public/hidden test cases with `isHidden`
4. ✅ Best for production

---

## 🔥 Quick Test Steps

### Using Upload Tab Method:
```
1. Admin Dashboard → Upload Questions tab
2. Select file: sample-questions-for-upload-tab.json
3. Click upload
4. Go to /streak/solve
5. Test Run/Submit buttons
```

### Using API Method:
```powershell
# In server folder
cd server

# Get admin token (check browser localStorage)
# Replace YOUR_TOKEN below

curl.exe -X POST http://localhost:5000/api/streak/admin/daily `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d "@sample-streak-questions.json"
```

---

## 📁 File Locations

- ✅ **For Upload Tab**: `server/sample-questions-for-upload-tab.json`
- ✅ **For Streak API**: `server/sample-streak-questions.json`
- 📖 **Full Streak Docs**: `server/ADMIN_UPLOAD_FORMAT.md`

---

## 🆘 Still Getting Errors?

### Error: "Invalid question format"
- ✅ Use `sample-questions-for-upload-tab.json` in Upload Tab
- ✅ Use `sample-streak-questions.json` with API only

### Error: "Must provide exactly 5 questions"
- ✅ Both files have 5 questions already

### Error: "Questions already exist"
- Delete existing questions first from Manage Streak tab

---

## Summary

| Feature | Upload Tab | Streak API |
|---------|------------|------------|
| File | `sample-questions-for-upload-tab.json` | `sample-streak-questions.json` |
| Method | Upload in UI | POST request |
| Language Templates | Default only | Custom per language |
| Public/Hidden Tests | No control | Full control |
| Difficulty | Easy/Hard | Level 1-5 |
| Best For | Quick testing | Production |

Choose based on what you need! 🚀
