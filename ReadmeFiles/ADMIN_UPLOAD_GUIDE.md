# Admin Guide: Uploading 5 Streak Questions

## Overview
The streak system accepts **exactly 5 questions per upload** - one for each difficulty level (Easy, Mid, Mid-Easy, Hard, Mix). Questions are automatically assigned level 1-5 based on upload order.

## Upload Endpoint
```
POST /api/streak/admin/daily
Headers: Content-Type: application/json
         Authorization: Bearer <ADMIN_TOKEN>
```

## Request Body Structure

```json
{
  "date": "YYYY-MM-DD",
  "questions": [
    {
      "title": "Question Title",
      "description": "Detailed problem description",
      "constraints": "Problem constraints",
      "hints": ["Hint 1", "Hint 2"],
      "functionSignature": {
        "name": "functionName",
        "params": ["param1", "param2"],
        "returnType": "int|string|array|boolean|etc"
      },
      "codeTemplate": {
        "javascript": "// JavaScript template",
        "python": "# Python template",
        "java": "// Java template",
        "cpp": "// C++ template"
      },
      "testCases": [
        {
          "input": "INPUT_VALUE",
          "expectedOutput": "EXPECTED_OUTPUT",
          "explanation": "Why this output",
          "isHidden": false
        }
      ]
    }
    // Repeat 5 times total
  ]
}
```

## Input Format Rules

The `input` field format depends on function parameter count:

### Single Parameter Function
```json
"functionSignature": {
  "name": "singleNumber",
  "params": ["nums"],
  "returnType": "int"
},
"testCases": [
  {
    "input": "[2,2,1]",           // Single line: just the array/value
    "expectedOutput": "1"
  },
  {
    "input": "abcabcbb",          // Single line: just the string (NO quotes around it)
    "expectedOutput": "3"
  },
  {
    "input": "()",                 // Single line: string without escaped quotes
    "expectedOutput": "true"
  }
]
```

### Two Parameter Function
```json
"functionSignature": {
  "name": "twoSum",
  "params": ["nums", "target"],
  "returnType": "array"
},
"testCases": [
  {
    "input": "[2,7,11,15]\n9",     // Two lines: array + newline + integer
    "expectedOutput": "[0,1]"
  }
]
```

### Three+ Parameter Function
```json
"functionSignature": {
  "name": "merge",
  "params": ["nums1", "nums2", "m"],
  "returnType": "array"
},
"testCases": [
  {
    "input": "[1,2,3]\n[2,5,6]\n3",  // Multiple lines: param1 + newline + param2 + newline + param3
    "expectedOutput": "[1,2,2,3,5,6]"
  }
]
```

## Common Input Formats

| Parameter Type | Format | Example |
|---|---|---|
| Integer | Raw number | `5` |
| String | Raw string (no quotes) | `hello` |
| Array | JSON format | `[1,2,3]` |
| Boolean | JSON boolean | `true` or `false` |
| Multiple params | Newline-separated | `[1,2]\n3\ntrue` |

## ❌ Common Mistakes

### ❌ WRONG: Extra quotes around strings
```json
"input": "\"abcabcbb\""    // WRONG - escaped quotes
"input": "'hello'"         // WRONG - wrapped in quotes
```

### ✅ CORRECT: Raw values
```json
"input": "abcabcbb"        // CORRECT - raw string
"input": "hello"           // CORRECT - raw string
```

### ❌ WRONG: Not using newlines for multi-param
```json
"input": "[2,7,11,15], 9"           // WRONG - comma separator
"input": "[2,7,11,15] 9"            // WRONG - space separator
```

### ✅ CORRECT: Newline-separated parameters
```json
"input": "[2,7,11,15]\n9"           // CORRECT - newline separator
```

## Code Template Examples

### JavaScript
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
}
```

### Python
```python
class Solution:
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        # Write your solution here
        pass
```

### Java
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}
```

### C++
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};
```

## Return Type Guide

Common return types for `functionSignature.returnType`:
- `int` - Single integer
- `string` - String value
- `boolean` - true/false
- `array` - Array/list
- `void` - No return value
- `double` - Floating point
- Custom types (with caution)

## Expected Output Format

Match the return type exactly:

| Return Type | Expected Output | Example |
|---|---|---|
| `int` | Raw number | `42` |
| `string` | Raw string | `hello` |
| `boolean` | `true` or `false` | `true` |
| `array` | JSON array | `[1,2,3]` |
| `void` | Empty string or `null` | `` |

## Testing Your Upload

Use this Python snippet to validate JSON before uploading:

```python
import json
import requests

# Load and validate JSON
with open('5-questions-daily.json', 'r') as f:
    data = json.load(f)
    print(f"Valid JSON with {len(data['questions'])} questions")

# Upload
token = "YOUR_ADMIN_TOKEN"
response = requests.post(
    "http://localhost:5000/api/streak/admin/daily",
    json=data,
    headers={"Authorization": f"Bearer {token}"}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

## Success Response

```json
{
  "message": "5 daily questions added successfully!",
  "date": "2025-10-23T18:30:00.000Z",
  "questions": [
    {
      "level": 1,
      "levelName": "Easy",
      "title": "Question Title",
      "_id": "...",
      ...
    }
    // 5 questions total
  ]
}
```

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| Invalid question format at index X | Input field malformed | Check input format matches parameter count |
| Extra quotes around strings | Used `"\"value\""` | Use `"value"` instead |
| Missing newlines | Multiple params not separated | Use `\n` between parameters |
| 401 Unauthorized | Invalid token | Get new token via login |
| 400 Wrong number of questions | Not exactly 5 questions | Ensure exactly 5 questions in array |

## Example: Complete Upload File

See `5-questions-daily.json` in the project root for a complete, validated example with 5 diverse questions covering:
1. Single parameter - Find Single Number
2. Two parameters - Two Sum
3. Single parameter (string) - Valid Parentheses
4. Two parameters - Merge Sorted Arrays
5. Single parameter (string) - Longest Substring

This file can be used as a template for future uploads.
