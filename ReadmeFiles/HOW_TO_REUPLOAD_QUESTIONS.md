# 🔄 How to Re-upload Questions (Duplicate Issue Fix)

## The Problem You're Seeing

When you upload `sample-questions-5-levels.json`, you see:

```
⚠️ Question "Two Sum" already exists
⚠️ Question "Reverse String" already exists
⚠️ Question "Binary Tree Maximum Path Sum" already exists
⚠️ Question "Longest Consecutive Sequence" already exists
⚠️ No new questions imported (all already exist)
```

**Why?** The questions are already in your database from a previous upload.

## ✅ Solution: Clear and Re-upload

### Option 1: Use the New "Clear All Questions" Button (Easiest)

1. **Go to Admin Dashboard → Upload Questions tab**
2. **Scroll down to "📋 Existing Questions"** section
3. **Click the red "🗑️ Clear All Questions" button**
4. **Confirm the warning**
   ```
   ⚠️ WARNING: This will delete ALL questions from the general 
   questions pool (not streak questions). Are you sure?
   ```
5. **Upload your JSON again**
6. **See success:**
   ```
   ✅ 5 questions imported and published to today's streak!
   ```

### Option 2: Delete Streak Questions First, Then Re-upload

1. **Go to Admin Dashboard → Manage Streak Questions tab**
2. **Click "🗑️ Delete All for 18/10/2025"**
3. **Go to Upload Questions tab**
4. **Click "🗑️ Clear All Questions"** (if questions exist)
5. **Upload your JSON**

### Option 3: Manual Database Clear (Advanced)

If you have MongoDB Compass or CLI access:

```javascript
// In MongoDB shell or Compass
use your_database_name

// Clear general questions
db.questions.deleteMany({})

// Clear streak questions for today
db.streakquestions.deleteMany({ 
  activeDate: ISODate("2025-10-18T00:00:00.000Z") 
})
```

## 🔍 Understanding the Two Collections

Your app has **two separate question collections**:

### 1. **Question Collection** (General Pool)
- Created by: JSON uploads
- Used for: Storage and future assignments
- Cleared by: "🗑️ Clear All Questions" button

### 2. **StreakQuestion Collection** (Daily Challenges)
- Created by: Auto-publish (when uploading 5+ questions)
- Used for: Daily user challenges on /streak page
- Cleared by: "🗑️ Delete All for [date]" button in Manage Streak tab

## 📋 Step-by-Step: Clean Slate Upload

### Step 1: Clear Existing Questions
```
Admin Dashboard → Upload Questions tab
↓
Scroll to "📋 Existing Questions (6)"
↓
Click "🗑️ Clear All Questions"
↓
Confirm warning
↓
See: "Successfully deleted 6 questions"
```

### Step 2: Upload Fresh JSON
```
Click "Choose File"
↓
Select sample-questions-5-levels.json
↓
Click "Import 5 Question(s)"
↓
Wait for processing...
```

### Step 3: Verify Success
```
Server logs show:
📥 Bulk import request received
✅ Found 5 questions in req.body.questions
📝 Processing question 1/5: "Two Sum"
✅ Imported: "Two Sum"
📝 Processing question 2/5: "Valid Parentheses"
✅ Imported: "Valid Parentheses"
... (etc for all 5)
✅ Auto-published 5 questions to today's streak

Toast message:
✅ 5 questions imported and published to today's streak!
```

### Step 4: Check Manage Streak Tab
```
Click "🔥 Manage Streak Questions" tab
↓
See table with today's date (18/10/2025)
↓
5 questions listed (Levels 1-5)
```

### Step 5: Verify User View
```
Go to /streak page (as regular user)
↓
See "🧩 Today's Challenge"
↓
Question matches your level
```

## 🎯 Quick Reference

| I want to... | Do this... |
|--------------|------------|
| Delete all general questions | Click "🗑️ Clear All Questions" in Upload tab |
| Delete today's streak | Click "🗑️ Delete All for [today]" in Manage Streak tab |
| Re-upload fresh questions | Clear All → Upload JSON |
| Start completely fresh | Clear All Questions + Delete today's streak → Upload |

## ⚠️ Important Notes

### "Clear All Questions" vs "Delete All for [date]"

**Clear All Questions:**
- Deletes from **Question** collection (general pool)
- Does NOT delete streak questions
- Use when: Re-uploading JSON with different questions

**Delete All for [date]:**
- Deletes from **StreakQuestion** collection (daily challenges)
- Does NOT delete general questions
- Use when: Want to re-publish different questions for a specific date

### To Completely Start Fresh:

1. Clear All Questions (general pool)
2. Delete All for [date] (streak questions)
3. Upload new JSON
4. Auto-publishes to streak

## 🔄 The Upload Flow

```
Upload JSON with 5 questions
         ↓
  Questions checked for duplicates by title
         ↓
    ┌────┴────┐
    │ Exists? │
    └────┬────┘
         │
    ┌────┴────────────┐
    │                 │
   YES               NO
    │                 │
 Skip it          Save it
    │                 │
    └────┬────────────┘
         │
  Count saved questions
         │
    ┌────┴────┐
    │ >= 5?   │
    └────┬────┘
         │
    ┌────┴─────────┐
    │              │
   YES            NO
    │              │
Auto-publish   Don't publish
 to streak      to streak
```

## 🚀 Your Next Steps

1. **Right now:** Click "🗑️ Clear All Questions" button
2. **Upload:** Your `sample-questions-5-levels.json` file
3. **Verify:** Check Manage Streak tab to see 5 questions
4. **Test:** Go to /streak page as a user

## 📝 Summary

**Problem:** Questions already exist, so upload skips them  
**Solution:** Added "Clear All Questions" button to delete existing questions  
**Result:** Can now re-upload JSON and auto-publish to streak  

**The button is in the "Upload Questions" tab, above the questions list!** 🎉
