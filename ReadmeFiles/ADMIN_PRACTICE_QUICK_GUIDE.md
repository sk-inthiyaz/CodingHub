# 🎯 Admin Practice Problems - Quick Reference

## ✅ What's New

### Two Tabs:
1. **📤 Upload Problems** - Upload new problems from JSON
2. **📚 Problems History** - View/Edit/Delete uploaded problems with search & filters

---

## 🚀 How to Use

### Upload Problems
1. Go to Admin Dashboard → Practice Problems
2. Click "📤 Upload Problems" tab
3. Enter number of problems
4. Select JSON file
5. Click "🚀 Validate & Upload"
6. Success! Problems appear in History tab

### View/Search Problems
1. Click "📚 Problems History" tab
2. See all problems in a table
3. **Search**: Type in search box to filter
4. **Filter Difficulty**: Select Easy/Medium/Hard
5. **Filter Topic**: Select specific topic

### Edit a Problem
1. Find problem in History tab
2. Click ✏️ button
3. Edit fields in modal
4. Click "💾 Save Changes"

### Delete a Problem
1. Find problem in History tab
2. Click 🗑️ button
3. Confirm deletion
4. Problem removed ✅

---

## 📊 Features at a Glance

| Feature | Status | Description |
|---------|--------|-------------|
| Upload Multiple Problems | ✅ | Upload 1-100+ problems at once |
| Search | ✅ | Search by title or description |
| Filter by Difficulty | ✅ | Easy/Medium/Hard |
| Filter by Topic | ✅ | Arrays, Strings, DP, etc. |
| Edit Problem | ✅ | Update title, description, hints, etc. |
| Delete Problem | ✅ | Remove with confirmation |
| View Stats | ✅ | Total, Easy, Medium, Hard counts |
| Dark Mode | ✅ | Full support |

---

## 🎨 UI Components

### Stats Dashboard
```
📚 Total Problems  |  ⭐ Easy  |  🟡 Medium  |  🔴 Hard
      15          |     5     |      7      |     3
```

### Problems Table
```
# | Title          | Difficulty | Topic   | Test Cases | Actions
1 | Two Sum        | Easy       | Arrays  | 5 (2 🔒)   | ✏️ 🗑️
2 | Valid Parens   | Easy       | Strings | 4 (2 🔒)   | ✏️ 🗑️
```

### Edit Modal
```
┌─────────────────────────────────┐
│ ✏️ Edit Problem             ✖️  │
├─────────────────────────────────┤
│ Title:      [________________]  │
│ Description: [________________] │
│ Difficulty:  [Easy ▼]           │
│ Topic:       [Arrays]           │
│ Constraints: [________________] │
│ Hints:       [________________] │
├─────────────────────────────────┤
│           [Cancel] [💾 Save]     │
└─────────────────────────────────┘
```

---

## 🔗 API Endpoints

### Frontend Calls
```javascript
// Get all problems
GET /api/practice/problems/all

// Get stats
GET /api/practice/admin/stats

// Upload problems
POST /api/practice/admin/upload-problems
Body: { problems: [...] }

// Update problem
PUT /api/practice/admin/problems/:id
Body: { title, description, difficulty, topic, constraints, hints }

// Delete problem
DELETE /api/practice/admin/problems/:id
```

---

## 📝 JSON Format Example

```json
{
  "problems": [
    {
      "title": "Two Sum",
      "description": "Find two numbers that add up to target",
      "difficulty": "Easy",
      "topic": "Arrays",
      "constraints": "2 <= nums.length <= 10^4",
      "hints": ["Use a hash map", "Think O(n) solution"],
      "functionSignature": {
        "name": "twoSum",
        "params": ["nums", "target"],
        "returnType": "int[]"
      },
      "codeTemplate": {
        "javascript": "function twoSum(nums, target) {\n  // code\n}",
        "python": "def twoSum(nums, target):\n    pass",
        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n    }\n}",
        "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n    }\n};"
      },
      "testCases": [
        {
          "input": "[2,7,11,15], 9",
          "expectedOutput": "[0,1]",
          "explanation": "nums[0] + nums[1] = 9",
          "isHidden": false
        }
      ]
    }
  ]
}
```

---

## ⚡ Keyboard Shortcuts

- `Tab` - Switch between tabs
- `Ctrl+F` / `Cmd+F` - Focus search box (browser default)
- `Esc` - Close edit modal
- `Enter` - Save changes in modal

---

## 🎯 Common Tasks

### Task: Upload 5 new problems
1. Prepare JSON with 5 problems
2. Go to Upload tab
3. Enter "5" in count field
4. Select file
5. Click Validate & Upload

### Task: Find all Hard problems about Dynamic Programming
1. Go to History tab
2. Select "Hard" from difficulty dropdown
3. Select "Dynamic Programming" from topic dropdown
4. Results filtered automatically

### Task: Update problem constraints
1. Search for problem
2. Click ✏️ Edit
3. Update "Constraints" field
4. Click Save

### Task: Delete obsolete problem
1. Search for problem
2. Click 🗑️ Delete
3. Confirm deletion
4. Problem removed, stats updated

---

## 🔍 Troubleshooting

### Problem not showing after upload?
- Refresh the page
- Check if count matched JSON array length
- Verify JSON format is correct

### Can't find a problem?
- Clear search and filters
- Check if problem was deleted
- Verify spelling in search

### Edit not saving?
- Check all required fields filled
- Look for error toast message
- Check network tab for API errors

---

## 📦 Files Modified

```
client/src/components/Practice/
  ├── AdminPracticeProblems.jsx  ← Complete rewrite with tabs
  └── AdminPracticeProblems.css  ← New styles added

server/routes/
  └── practiceRoutes.js           ← Added PUT endpoint
```

---

## ✨ Benefits

1. **Clean UI** - LeetCode-inspired professional design
2. **Fast Search** - Find problems instantly
3. **Smart Filters** - Narrow down by difficulty/topic
4. **Easy Edits** - Update problems without re-uploading
5. **Safe Deletes** - Confirmation before removing
6. **Real-time Stats** - See counts update immediately
7. **Dark Mode** - Easy on the eyes
8. **Mobile Friendly** - Works on all screen sizes

---

## 🎉 Done!

You now have a **complete admin interface** for managing practice problems with:
- ✅ Upload
- ✅ View
- ✅ Search
- ✅ Filter
- ✅ Edit
- ✅ Delete

All in a clean, modern, production-ready UI! 🚀
