# Quick Test Guide - Dark Mode & Admin Features

## 🚀 Quick Start

### 1. Start the Application

```powershell
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm start
```

The app will open at http://localhost:3000

---

## 🌓 Test Dark Mode Fixes

### Step 1: Navigate to Streak Page
1. Login to the application
2. Go to http://localhost:3000/streak

### Step 2: Toggle Dark Mode
- Click the theme toggle button in the navbar
- Switch between light and dark mode

### Step 3: Verify Visibility
✅ Check these elements are visible in BOTH modes:
- [ ] Page title and description
- [ ] Streak status card (gradient box with stats)
  - Current streak number
  - Longest streak
  - Level and badge count
  - Progress bar
- [ ] Today's challenge card
  - Question title
  - Description preview
  - Test case count
  - "Start Solving" button
- [ ] Leaderboard sidebar (right side)
  - Top 10 users
  - Names and streaks
  - Level badges

---

## 👨‍💼 Test Admin Dashboard

### Step 1: Login as Admin
1. You need admin credentials
2. Go to http://localhost:3000/admin/dashboard

### Step 2: Check Stats Display
✅ Verify you see:
- [ ] Total Questions count
- [ ] Active Users count
- [ ] Top Streak number

### Step 3: Test Question Upload
1. Click "📥 Upload Questions" tab
2. Click "Choose File"
3. Select `sample-questions.json` from the project root
4. ✅ Verify preview appears
5. Click "Import X Question(s)"
6. ✅ Verify toast notification appears
7. ✅ Check questions appear in the list below

### Step 4: Test Daily Streak Questions
1. Click "🔥 Daily Streak Questions" tab
2. ✅ Verify you see the AdminQuestionForm
3. You should see:
   - Date selector
   - Tabs for levels 1-5
   - Title, description, constraints fields
   - Hints section
   - Test cases section
   - "Publish 5 Daily Questions" button

---

## ✏️ Test Code Editor

### Step 1: Navigate to Solve Page
1. From `/streak`, click "Start Solving" button
2. You'll be taken to `/streak/solve`

### Step 2: Verify Layout
✅ Check you see:
- [ ] Back button (top left)
- [ ] Two-column layout
  - Left: Question details, test cases, constraints
  - Right: Code editor with language selector
- [ ] Submit button below editor

### Step 3: Test Editor in Both Themes
1. Type some code in the editor
2. ✅ Verify text is visible
3. Toggle dark mode
4. ✅ Verify code is still readable
5. ✅ Check test cases on left are visible
6. ✅ Check constraints box is readable

### Step 4: Test Submission
1. Write some code (any language)
2. Click "Submit Solution"
3. ✅ Verify result box appears
4. ✅ Check test results are visible
5. ✅ Check streak update message (if passed)

---

## 📋 Dark Mode Checklist

### Elements to Test in BOTH Modes

#### Streak Page (`/streak`)
- [ ] Header text
- [ ] Description text
- [ ] Gradient card (stats) - all text visible
- [ ] White card (today's question) - all text visible
- [ ] Sidebar leaderboard - names and badges visible
- [ ] Buttons have proper contrast

#### Solve Page (`/streak/solve`)
- [ ] Question title and description
- [ ] Test cases background and text
- [ ] Constraints code block
- [ ] Editor background and text color
- [ ] Language selector dropdown
- [ ] Submit button
- [ ] Result message box
- [ ] Back button

#### Admin Dashboard (`/admin/dashboard`)
- [ ] Page title
- [ ] Stat cards (3 boxes at top)
- [ ] Tab buttons
- [ ] File upload section
- [ ] JSON preview box
- [ ] Import button
- [ ] Questions list cards
- [ ] Difficulty badges
- [ ] Test case boxes

#### Leaderboard (Full) (`/streak/leaderboard`)
- [ ] Page title
- [ ] Table headers
- [ ] User names
- [ ] Streak numbers
- [ ] Level names
- [ ] Badge counts

---

## 🎨 Visual Testing Tips

### Light Mode
- Background should be light gray/white
- Text should be dark (near black)
- Borders should be subtle but visible
- Cards should have slight shadows

### Dark Mode
- Background should be dark blue/gray
- Text should be light (near white)
- Borders should be lighter than background
- Cards should have darker shadows

### Common Issues to Look For
❌ Text disappearing
❌ Borders invisible
❌ Low contrast (hard to read)
❌ Buttons blending with background
❌ Code editor unreadable
❌ Test results invisible

---

## 📸 Screenshots to Capture (Optional)

For documentation, take screenshots of:
1. Streak page in light mode
2. Streak page in dark mode
3. Solve page with editor in light mode
4. Solve page with editor in dark mode
5. Admin dashboard stats section
6. Admin dashboard with uploaded questions

---

## 🐛 If You Find Issues

1. Check browser console for errors
2. Verify the server is running
3. Clear browser cache
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. Check if you're logged in
6. Verify you have admin privileges (for admin routes)

---

## ✅ Success Criteria

All tests pass when:
- ✅ Every text element is readable in both light and dark mode
- ✅ No elements "disappear" when switching themes
- ✅ All buttons and interactive elements are clearly visible
- ✅ Code editor works and is readable in both themes
- ✅ Admin dashboard loads and displays stats
- ✅ Sample questions can be imported successfully
- ✅ Toast notifications appear for actions
- ✅ Leaderboard displays in sidebar and full page

---

## 🎉 What's New

1. **Dark Mode Support** - All streak components now fully support dark theme
2. **Enhanced Admin Dashboard** - Stats, tabs, better organization
3. **Code Editor Visibility** - Fixed contrast issues in both themes
4. **Sample Questions** - Ready-to-import JSON file with 5 problems
5. **Leaderboard** - Compact sidebar view + full page view
6. **Toast Notifications** - Better user feedback for actions

Enjoy testing! 🚀
