# 🔥 How to Use the Streak System

## Problem You Had
When you uploaded 5 questions via JSON in Admin Dashboard, users couldn't see them on the Streak page.

## Why This Happened
The app has **two separate question systems**:
1. **General Questions** (`Question` collection) - Questions you upload via JSON
2. **Daily Streak Questions** (`StreakQuestion` collection) - Questions users solve on the Streak page

Previously, uploading JSON only created general questions, but didn't publish them to the streak.

## ✅ FIXED: Auto-Publish Feature

Now when you upload a JSON file with **5 or more questions**, they are **automatically published to today's streak**!

## How to Use

### Step 1: Prepare Your JSON File
Create a JSON file with at least 5 questions:

```json
{
  "questions": [
    {
      "title": "Reverse a String",
      "description": "Write a function that reverses a string.",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "hello",
          "expectedOutput": "olleh"
        }
      ]
    },
    // ... 4 more questions
  ]
}
```

### Step 2: Upload via Admin Dashboard
1. Go to **Admin Dashboard** → **Upload Questions** tab
2. Click "Choose File" and select your JSON
3. Click "Import X Question(s)"
4. You'll see: **"✅ 5 questions imported and published to today's streak!"**

### Step 3: Users Can Now Solve
1. Users visit the **Streak** page (`/streak`)
2. They see "Today's Challenge" with the question matching their level
3. They click "Start Solving" and submit their solution
4. Streak counter increases! 🔥

## Level Assignment

Questions are assigned to levels based on order in your JSON:
- **Question 1** → Level 1 (Novice)
- **Question 2** → Level 2 (Beginner)
- **Question 3** → Level 3 (Intermediate)
- **Question 4** → Level 4 (Advanced)
- **Question 5** → Level 5 (Expert)

Users see the question matching their current level.

## What if Today's Streak Already Exists?

If you upload more questions after already publishing today's streak, they will be stored in the general questions pool but won't override today's streak. You can:
- Manually assign them to future dates via "Daily Streak Questions" tab
- Or wait until tomorrow and upload again (auto-publish will work for the new day)

## Manual Publishing (Alternative)

If you want more control over which question goes to which level:
1. Upload your JSON (creates general questions)
2. Go to **Daily Streak Questions** tab
3. Manually select a date and assign specific questions to each level

## Sample Questions

Use the included `server/sample-questions.json` file to test!

## Testing

1. **Upload**: Admin Dashboard → Upload Questions → Select JSON → Import
2. **Verify Backend**: Check terminal logs for "✅ Auto-published 5 questions to today's streak"
3. **Check User View**: Go to `/streak` → Should see "Today's Challenge"
4. **Solve**: Click "Start Solving" → Write code → Submit
5. **Streak**: After solving, your streak counter increases! 🔥

## Troubleshooting

**Problem**: "No Question Available" after uploading
- **Solution**: Make sure you uploaded **5 or more** questions
- Check server terminal logs for any errors
- Verify today's date doesn't already have streak questions

**Problem**: Questions imported but not in streak
- **Solution**: Upload contained fewer than 5 questions
- Either upload 5+ at once, or use "Daily Streak Questions" tab to manually publish

**Problem**: "Questions already exist for this date and level"
- **Solution**: Today's streak already published. Wait until tomorrow or manually manage via "Daily Streak Questions" tab

## Summary

✨ **Upload 5+ questions → Auto-published to today → Users can solve immediately!** ✨
