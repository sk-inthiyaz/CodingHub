# Adding Different Question Types with Dynamic Function Signatures

The system now supports questions with **different function signatures** (different parameter counts, types, and return types).

## How It Works

When you upload a question, include `functionSignature` with:
- `name`: function name (e.g., "twoSum", "findSingleNumber", "mergeArrays")
- `params`: array of parameter names (e.g., ["nums", "target"] for twoSum)
- `returnType`: what the function returns (e.g., "array", "int", "string")

The harness automatically wraps user code with the correct function call.

## Examples

### Example 1: Two Sum (2 parameters)

```json
{
  "levelName": "Easy",
  "title": "Two Sum",
  "description": "Find two numbers that add up to target",
  "constraints": "1 <= nums.length <= 10^4",
  "testCases": [
    {
      "input": "[2,7,11,15]\n9",
      "expectedOutput": "[0,1]",
      "explanation": "nums[0] + nums[1] == 9"
    },
    {
      "input": "[3,2,4]\n6",
      "expectedOutput": "[1,2]"
    }
  ],
  "functionSignature": {
    "name": "twoSum",
    "params": ["nums", "target"],
    "returnType": "array"
  },
  "codeTemplate": {
    "javascript": "function twoSum(nums, target) {\n    // Write your solution here\n}\n",
    "python": "class Solution:\n    def twoSum(self, nums, target):\n        # Write your solution here\n        pass\n",
    "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}\n",
    "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};\n"
  }
}
```

### Example 2: Find Single Number (1 parameter)

```json
{
  "levelName": "Easy",
  "title": "Find Single Number",
  "description": "Find the element that appears once; all others appear twice",
  "constraints": "1 <= nums.length <= 3*10^4",
  "testCases": [
    {
      "input": "[2,2,1]",
      "expectedOutput": "1",
      "explanation": "1 appears once, 2 appears twice"
    },
    {
      "input": "[4,1,2,1,2]",
      "expectedOutput": "4"
    }
  ],
  "functionSignature": {
    "name": "singleNumber",
    "params": ["nums"],
    "returnType": "int"
  },
  "codeTemplate": {
    "javascript": "function singleNumber(nums) {\n    // Write your solution here\n}\n",
    "python": "class Solution:\n    def singleNumber(self, nums):\n        # Write your solution here\n        pass\n",
    "java": "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution here\n    }\n}\n",
    "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your solution here\n    }\n};\n"
  }
}
```

### Example 3: Merge Sorted Arrays (3 parameters)

```json
{
  "levelName": "Easy",
  "title": "Merge Sorted Arrays",
  "description": "Merge two sorted arrays into one sorted array",
  "constraints": "0 <= nums1.length, nums2.length <= 200",
  "testCases": [
    {
      "input": "[1,2,3]\n[2,5,6]\n0",
      "expectedOutput": "[1,2,2,3,5,6]"
    }
  ],
  "functionSignature": {
    "name": "merge",
    "params": ["nums1", "nums2", "k"],
    "returnType": "array"
  },
  "codeTemplate": {
    "javascript": "function merge(nums1, nums2, k) {\n    // Write your solution here\n}\n",
    "python": "class Solution:\n    def merge(self, nums1, nums2, k):\n        # Write your solution here\n        pass\n",
    "java": "class Solution {\n    public int[] merge(int[] nums1, int[] nums2, int k) {\n        // Write your solution here\n    }\n}\n",
    "cpp": "class Solution {\npublic:\n    vector<int> merge(vector<int>& nums1, vector<int>& nums2, int k) {\n        // Write your solution here\n    }\n};\n"
  }
}
```

## How Parameters Are Parsed

The harness parses stdin based on parameter count:

### 1 Parameter
```
Input: [2,2,1]
→ Line 1 = [2,2,1]
→ param1 = JSON.parse("[2,2,1]") = [2, 2, 1]
→ Call: singleNumber([2,2,1])
```

### 2 Parameters
```
Input: [2,7,11,15]
       9
→ Line 1 = [2,7,11,15]
→ Line 2 = 9
→ param1 = JSON.parse("[2,7,11,15]") = [2,7,11,15]
→ param2 = JSON.parse("9") = 9
→ Call: twoSum([2,7,11,15], 9)
```

### 3+ Parameters
```
Input: [1,2,3]
       [2,5,6]
       0
→ Line 1 = [1,2,3] → param1 = [1,2,3]
→ Line 2 = [2,5,6] → param2 = [2,5,6]
→ Line 3 = 0 → param3 = 0
→ Call: merge([1,2,3], [2,5,6], 0)
```

## Important Notes

1. **Each line = one parameter** (split by newline)
2. **JSON values** are parsed (arrays, numbers, strings)
3. **Function names must match** between `functionSignature.name` and `codeTemplate`
4. **Parameter order** in input lines must match parameter order in function signature
5. **All test cases** for a question must use the same parameter count

## Admin Upload Endpoint

**POST** `/api/streak/admin/add`
Headers: `Authorization: Bearer <token>`
Body:
```json
{
  "levelName": "Easy",
  "title": "Question Title",
  "description": "...",
  "constraints": "...",
  "testCases": [...],
  "functionSignature": {
    "name": "functionName",
    "params": ["param1", "param2"],
    "returnType": "returnType"
  },
  "codeTemplate": {
    "javascript": "...",
    "python": "...",
    "java": "...",
    "cpp": "..."
  },
  "activeDate": "2025-10-23"
}
```

## Testing

1. Upload a question with custom `functionSignature`
2. Get today's question
3. Write code using the provided template
4. Run/Submit - the harness will automatically use the correct function signature
5. Code should pass tests without modification

## Examples in Code

If you're testing locally, here are sample Python submissions for each type:

**Two Sum:**
```python
class Solution:
    def twoSum(self, nums, target):
        for i, num in enumerate(nums):
            if target - num in {nums[j] for j in range(len(nums)) if j != i}:
                for j in range(i+1, len(nums)):
                    if nums[i] + nums[j] == target:
                        return [i, j]
        return []
```

**Find Single Number:**
```python
class Solution:
    def singleNumber(self, nums):
        result = 0
        for num in nums:
            result ^= num
        return result
```

**Merge Sorted Arrays:**
```python
class Solution:
    def merge(self, nums1, nums2, k):
        return sorted(nums1 + nums2)
```
