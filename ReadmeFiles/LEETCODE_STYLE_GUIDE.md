# 🎯 LeetCode-Style Function Testing - Complete Guide

## What Changed

### Before (Full Program Style):
User writes complete program with `main()` function:
```java
public class Main {
    public static void main(String[] args) {
        // User writes everything including input parsing
    }
}
```

### After (LeetCode Style):
User writes ONLY the function:
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // User writes only the logic
    }
}
```

---

## Files Modified

### 1. Docker Images (Lighter & Faster)
**File:** `server/utils/dockerRunner.js`

Changed to Alpine-based images for faster downloads:
- `node:20` → `node:20-alpine` (smaller)
- `python:3.11` → `python:3.11-alpine`
- `openjdk:21` → `openjdk:17-alpine`
- `gcc:13` → `gcc:13-alpine`

### 2. Code Templates (Function-Only)
**File:** `server/models/StreakQuestion.js`

Added LeetCode-style templates:
```javascript
// JavaScript
function twoSum(nums, target) {
    // User code
}

// Python
class Solution:
    def twoSum(self, nums, target):
        pass

// Java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}

// C++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};
```

### 3. Test Harness (Auto-wraps functions)
**File:** `server/utils/codeHarness.js` (NEW)

Automatically wraps user functions with test runner code.

---

## How It Works Now

### Step 1: User Writes Function Only
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

### Step 2: System Auto-Wraps with Test Runner
```java
import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // User's code here
    }
}

public class Main {
    public static void main(String[] args) {
        // Parse input: [2,7,11,15]\n9
        // Call: solution.twoSum(nums, target)
        // Print: [0,1]
    }
}
```

### Step 3: Docker Runs Complete Code
- Input sent via stdin
- Output compared with expected
- Pass/Fail result returned

---

## New Question Format

**File:** `server/sample-leetcode-style-questions.json`

```json
{
  "date": "2025-10-21",
  "questions": [
    {
      "title": "Two Sum",
      "description": "...",
      "functionSignature": {
        "name": "twoSum",
        "params": ["nums", "target"],
        "returnType": "array"
      },
      "codeTemplate": {
        "javascript": "function twoSum(nums, target) { }",
        "python": "class Solution:\n    def twoSum(self, nums, target):\n        pass",
        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) { }\n}",
        "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) { }\n};"
      },
      "testCases": [
        {
          "input": "[2,7,11,15]\n9",
          "expectedOutput": "[0,1]",
          "isHidden": false
        }
      ]
    }
  ]
}
```

---

## Fixing Docker Network Issue

### Problem:
```
docker: failed to copy: ... no such host
```

### Solutions:

#### Option 1: Manual Pull (Try First)
```powershell
# Pull Alpine images (smaller & faster)
docker pull node:20-alpine
docker pull python:3.11-alpine
docker pull openjdk:17-alpine
docker pull gcc:13-alpine
```

#### Option 2: Check Docker DNS
```powershell
# Check Docker is running
docker ps

# Test basic pull
docker pull hello-world

# If that fails, restart Docker Desktop
```

#### Option 3: Configure DNS
1. Open Docker Desktop
2. Settings → Docker Engine
3. Add DNS config:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```
4. Apply & Restart

#### Option 4: Use WSL2 Backend
1. Docker Desktop → Settings → General
2. Enable "Use the WSL 2 based engine"
3. Restart Docker

---

## Testing The New System

### 1. Pull Docker Images First
```powershell
cd server
docker pull node:20-alpine
docker pull python:3.11-alpine
docker pull openjdk:17-alpine
docker pull gcc:13-alpine
```

### 2. Upload LeetCode-Style Questions
Use API or create upload feature for this format:
```powershell
curl -X POST http://localhost:5000/api/streak/admin/daily `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d "@sample-leetcode-style-questions.json"
```

### 3. Test in UI
1. Go to `/streak/solve`
2. Select Java
3. You'll see:
   ```java
   class Solution {
       public int[] twoSum(int[] nums, int target) {
           // Write your solution here
       }
   }
   ```
4. Write your solution (JUST the function logic)
5. Click Run → Test public cases
6. Click Submit → Test all cases

---

## What Users See vs What Runs

### User Sees (Editor):
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

### What Actually Runs (Auto-wrapped):
```java
import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // User's code
    }
}

public class Main {
    public static void main(String[] args) {
        String[] lines = "[2,7,11,15]\n9".split("\n");
        int[] nums = parseArray(lines[0]);
        int target = Integer.parseInt(lines[1]);
        
        Solution sol = new Solution();
        int[] result = sol.twoSum(nums, target);
        
        System.out.println(Arrays.toString(result));
    }
}
```

---

## Key Benefits

✅ **No main function needed** - User writes pure logic  
✅ **Auto-wrapping** - System adds test harness  
✅ **Smaller Docker images** - Alpine variants (faster pulls)  
✅ **True LeetCode experience** - Class Solution pattern  
✅ **Language-agnostic** - Works for JS, Python, Java, C++  

---

## Current Status

### ✅ Completed:
- Docker images updated to Alpine
- Code templates changed to function-only
- Test harness utility created
- Sample LeetCode-style questions ready
- Model updated with functionSignature field

### 🔧 To Complete:
Need to integrate `codeHarness.js` into controllers to auto-wrap user code before Docker execution.

### Next Step:
Integrate the harness into `runCode` and `submitSolution` functions in `streakController.js`.

---

## Quick Start Commands

```powershell
# 1. Pull Docker images
docker pull node:20-alpine
docker pull python:3.11-alpine
docker pull openjdk:17-alpine
docker pull gcc:13-alpine

# 2. Restart backend (if running)
cd server
npm start

# 3. Test with sample questions
# Upload sample-leetcode-style-questions.json via API or admin UI
```

---

## Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `dockerRunner.js` | Docker execution | ✅ Updated |
| `codeHarness.js` | Auto-wrap functions | ✅ Created |
| `StreakQuestion.js` | Model with templates | ✅ Updated |
| `streakController.js` | Needs harness integration | 🔧 Pending |
| `sample-leetcode-style-questions.json` | Example questions | ✅ Ready |

---

## Need Help?

**Docker issues?** Run `docker pull node:20-alpine` and check if it downloads.  
**Still can't pull?** Try restarting Docker Desktop or checking your internet/firewall.  
**Code not wrapping?** The harness integration is next - need to modify controllers.

Ready to integrate the harness next? 🚀
