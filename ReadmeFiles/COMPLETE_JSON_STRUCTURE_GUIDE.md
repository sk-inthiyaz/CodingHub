# 🎯 COMPLETE JSON STRUCTURE GUIDE
## Zero-Error Upload Format for Practice Problems & Streak Questions

---

## 📋 TABLE OF CONTENTS

1. [Practice Problems Structure](#practice-problems-structure)
2. [Streak Questions Structure](#streak-questions-structure)
3. [Test Cases by Problem Type](#test-cases-by-problem-type)
4. [Complete Examples](#complete-examples)
5. [AI Prompts with Structure](#ai-prompts-with-structure)

---

## 🏗️ PRACTICE PROBLEMS STRUCTURE

### Complete JSON Schema

```json
[
  {
    "title": "string (2-5 words)",
    "description": "string (problem statement)",
    "difficulty": "Easy|Medium|Hard (exact)",
    "topic": "string (category)",
    "functionSignature": {
      "javascript": "string (function declaration)",
      "python": "string (function declaration)",
      "java": "string (function declaration)",
      "cpp": "string (function declaration)"
    },
    "codeTemplate": {
      "javascript": "string (starter code)",
      "python": "string (starter code)",
      "java": "string (starter code)",
      "cpp": "string (starter code)"
    },
    "examples": [
      {
        "input": "string (example input)",
        "output": "string (example output)",
        "explanation": "string (why this output)"
      }
    ],
    "constraints": [
      "string (constraint 1)",
      "string (constraint 2)"
    ],
    "hints": [
      "string (hint 1)",
      "string (hint 2)",
      "string (hint 3)"
    ],
    "testCases": [
      {
        "input": {
          "parameterName": "value (type varies)"
        },
        "expectedOutput": "value (type varies)",
        "explanation": "string (why this result)"
      }
    ],
    "acceptanceRate": 0
  }
]
```

---

## 🔥 STREAK QUESTIONS STRUCTURE

### Complete JSON Schema

```json
[
  {
    "question": "string (question text)",
    "type": "multiple-choice",
    "difficulty": "Easy|Medium|Hard",
    "topic": "string (topic name)",
    "options": [
      {
        "id": "a",
        "text": "string (option text)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "string (option text)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "string (option text)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "string (option text)",
        "isCorrect": false
      }
    ],
    "explanation": "string (detailed explanation)",
    "concepts": ["string", "string"],
    "relatedTopics": ["string", "string"],
    "difficulty_score": 1
  }
]
```

---

## 🎯 TEST CASES BY PROBLEM TYPE

### 1️⃣ ARRAYS (Single Array Input)

```json
"testCases": [
  {
    "input": {
      "nums": [2, 7, 11, 15],
      "target": 9
    },
    "expectedOutput": [0, 1],
    "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
  },
  {
    "input": {
      "nums": [3, 2, 4],
      "target": 6
    },
    "expectedOutput": [1, 2],
    "explanation": "nums[1] + nums[2] = 2 + 4 = 6"
  },
  {
    "input": {
      "nums": [],
      "target": 0
    },
    "expectedOutput": [],
    "explanation": "Empty array edge case"
  }
]
```

### 2️⃣ ARRAYS (Multiple Array Inputs)

```json
"testCases": [
  {
    "input": {
      "nums1": [1, 2, 3, 0, 0, 0],
      "m": 3,
      "nums2": [2, 5, 6],
      "n": 3
    },
    "expectedOutput": [1, 2, 2, 3, 5, 6],
    "explanation": "Merge two sorted arrays"
  },
  {
    "input": {
      "nums1": [1],
      "m": 1,
      "nums2": [],
      "n": 0
    },
    "expectedOutput": [1],
    "explanation": "Second array is empty"
  }
]
```

### 3️⃣ STRINGS (Single String)

```json
"testCases": [
  {
    "input": {
      "s": "hello"
    },
    "expectedOutput": "olleh",
    "explanation": "Reverse the string"
  },
  {
    "input": {
      "s": "a"
    },
    "expectedOutput": "a",
    "explanation": "Single character"
  },
  {
    "input": {
      "s": ""
    },
    "expectedOutput": "",
    "explanation": "Empty string edge case"
  }
]
```

### 4️⃣ STRINGS (Multiple Strings)

```json
"testCases": [
  {
    "input": {
      "haystack": "hello world",
      "needle": "world"
    },
    "expectedOutput": 6,
    "explanation": "Found at index 6"
  },
  {
    "input": {
      "haystack": "aaaaa",
      "needle": "bba"
    },
    "expectedOutput": -1,
    "explanation": "Substring not found"
  }
]
```

### 5️⃣ LINKED LISTS (List as Array)

**IMPORTANT**: For Linked Lists, pass arrays and mention conversion in problem description

```json
"testCases": [
  {
    "input": {
      "list1": [1, 2, 4],
      "list2": [1, 3, 4]
    },
    "expectedOutput": [1, 1, 2, 3, 4, 4],
    "explanation": "Merge two sorted linked lists"
  },
  {
    "input": {
      "list1": [],
      "list2": [0]
    },
    "expectedOutput": [0],
    "explanation": "First list is empty"
  },
  {
    "input": {
      "list1": [],
      "list2": []
    },
    "expectedOutput": [],
    "explanation": "Both lists are empty"
  }
]
```

### 6️⃣ TREES (Tree as Array - Level Order)

```json
"testCases": [
  {
    "input": {
      "root": [3, 9, 20, null, null, 15, 7]
    },
    "expectedOutput": 3,
    "explanation": "Maximum depth is 3"
  },
  {
    "input": {
      "root": [1, null, 2]
    },
    "expectedOutput": 2,
    "explanation": "Tree with only right child"
  },
  {
    "input": {
      "root": []
    },
    "expectedOutput": 0,
    "explanation": "Empty tree"
  }
]
```

### 7️⃣ NUMBERS (Single Number)

```json
"testCases": [
  {
    "input": {
      "n": 5
    },
    "expectedOutput": 120,
    "explanation": "5! = 5 * 4 * 3 * 2 * 1 = 120"
  },
  {
    "input": {
      "n": 0
    },
    "expectedOutput": 1,
    "explanation": "0! = 1 by definition"
  }
]
```

### 8️⃣ NUMBERS (Multiple Numbers)

```json
"testCases": [
  {
    "input": {
      "a": 5,
      "b": 3
    },
    "expectedOutput": 8,
    "explanation": "5 + 3 = 8"
  },
  {
    "input": {
      "a": -1,
      "b": 1
    },
    "expectedOutput": 0,
    "explanation": "Negative and positive sum to zero"
  }
]
```

### 9️⃣ MATRIX (2D Array)

```json
"testCases": [
  {
    "input": {
      "matrix": [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
    },
    "expectedOutput": [1, 2, 3, 6, 9, 8, 7, 4, 5],
    "explanation": "Spiral order traversal"
  },
  {
    "input": {
      "matrix": [[1]]
    },
    "expectedOutput": [1],
    "explanation": "Single element matrix"
  }
]
```

### 🔟 BOOLEAN OUTPUT

```json
"testCases": [
  {
    "input": {
      "s": "([)]"
    },
    "expectedOutput": false,
    "explanation": "Brackets are not properly closed"
  },
  {
    "input": {
      "s": "()"
    },
    "expectedOutput": true,
    "explanation": "Valid parentheses"
  }
]
```

---

## 📚 COMPLETE EXAMPLE 1: PRACTICE PROBLEMS (MEDIUM - 3 PROBLEMS)

```json
[
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "difficulty": "Easy",
    "topic": "Arrays",
    "functionSignature": {
      "javascript": "function twoSum(nums, target) { }",
      "python": "def two_sum(nums, target):",
      "java": "public static int[] twoSum(int[] nums, int target)",
      "cpp": "vector<int> twoSum(vector<int>& nums, int target)"
    },
    "codeTemplate": {
      "javascript": "function twoSum(nums, target) {\n  // Write your code here\n}",
      "python": "def two_sum(nums, target):\n    # Write your code here\n    pass",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}",
      "cpp": "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}"
    },
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    "constraints": [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists"
    ],
    "hints": [
      "Try using a hash map to store the numbers you've seen",
      "For each number, check if target - number exists in your map",
      "Remember to return the indices, not the values"
    ],
    "testCases": [
      {
        "input": {
          "nums": [2, 7, 11, 15],
          "target": 9
        },
        "expectedOutput": [0, 1],
        "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
      },
      {
        "input": {
          "nums": [3, 2, 4],
          "target": 6
        },
        "expectedOutput": [1, 2],
        "explanation": "nums[1] + nums[2] = 2 + 4 = 6"
      },
      {
        "input": {
          "nums": [3, 3],
          "target": 6
        },
        "expectedOutput": [0, 1],
        "explanation": "nums[0] + nums[1] = 3 + 3 = 6"
      }
    ],
    "acceptanceRate": 0
  },
  {
    "title": "Reverse String",
    "description": "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    "difficulty": "Easy",
    "topic": "Strings",
    "functionSignature": {
      "javascript": "function reverseString(s) { }",
      "python": "def reverse_string(s):",
      "java": "public static void reverseString(char[] s)",
      "cpp": "void reverseString(vector<char>& s)"
    },
    "codeTemplate": {
      "javascript": "function reverseString(s) {\n  // Write your code here\n}",
      "python": "def reverse_string(s):\n    # Write your code here\n    pass",
      "java": "class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}",
      "cpp": "void reverseString(vector<char>& s) {\n    // Write your code here\n}"
    },
    "examples": [
      {
        "input": "s = ['h','e','l','l','o']",
        "output": "['o','l','l','e','h']",
        "explanation": "The string is reversed in place"
      },
      {
        "input": "s = ['H','a','n','n','a','h']",
        "output": "['h','a','n','n','a','H']",
        "explanation": "The string 'Hannah' becomes 'hannaH'"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10⁵",
      "s[i] is a printable ascii character",
      "Must use O(1) extra space"
    ],
    "hints": [
      "Use two pointers approach - one at start, one at end",
      "Swap characters and move pointers towards center",
      "Stop when pointers meet in the middle"
    ],
    "testCases": [
      {
        "input": {
          "s": ["h", "e", "l", "l", "o"]
        },
        "expectedOutput": ["o", "l", "l", "e", "h"],
        "explanation": "Reverse the entire string"
      },
      {
        "input": {
          "s": ["H", "a", "n", "n", "a", "h"]
        },
        "expectedOutput": ["h", "a", "n", "n", "a", "H"],
        "explanation": "Palindrome-like string reversed"
      },
      {
        "input": {
          "s": ["a"]
        },
        "expectedOutput": ["a"],
        "explanation": "Single character remains same"
      }
    ],
    "acceptanceRate": 0
  },
  {
    "title": "Merge Two Sorted Lists",
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list. NOTE: Lists are provided as arrays and will be converted to linked lists automatically.",
    "difficulty": "Easy",
    "topic": "LinkedList",
    "functionSignature": {
      "javascript": "function mergeTwoLists(list1, list2) { }",
      "python": "def merge_two_lists(list1, list2):",
      "java": "public static ListNode mergeTwoLists(ListNode list1, ListNode list2)",
      "cpp": "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2)"
    },
    "codeTemplate": {
      "javascript": "function mergeTwoLists(list1, list2) {\n  // Write your code here\n  // list1 and list2 are arrays representing linked lists\n}",
      "python": "def merge_two_lists(list1, list2):\n    # Write your code here\n    # list1 and list2 are arrays representing linked lists\n    pass",
      "java": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}",
      "cpp": "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n    return nullptr;\n}"
    },
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Merge two sorted lists into one"
      },
      {
        "input": "list1 = [], list2 = [0]",
        "output": "[0]",
        "explanation": "First list is empty"
      }
    ],
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 ≤ Node.val ≤ 100",
      "Both list1 and list2 are sorted in non-decreasing order"
    ],
    "hints": [
      "Use a dummy node to simplify the merge process",
      "Compare the values and attach the smaller node",
      "Don't forget to handle remaining nodes from either list"
    ],
    "testCases": [
      {
        "input": {
          "list1": [1, 2, 4],
          "list2": [1, 3, 4]
        },
        "expectedOutput": [1, 1, 2, 3, 4, 4],
        "explanation": "Merge two sorted linked lists"
      },
      {
        "input": {
          "list1": [],
          "list2": [0]
        },
        "expectedOutput": [0],
        "explanation": "First list is empty"
      },
      {
        "input": {
          "list1": [],
          "list2": []
        },
        "expectedOutput": [],
        "explanation": "Both lists are empty"
      },
      {
        "input": {
          "list1": [5],
          "list2": [1, 2, 4]
        },
        "expectedOutput": [1, 2, 4, 5],
        "explanation": "First list has only one element"
      }
    ],
    "acceptanceRate": 0
  }
]
```

---

## 🔥 COMPLETE EXAMPLE 2: STREAK QUESTIONS (5 REQUIRED)

```json
[
  {
    "question": "What is the time complexity of accessing an element in an array by index?",
    "type": "multiple-choice",
    "difficulty": "Easy",
    "topic": "DataStructures",
    "options": [
      {
        "id": "a",
        "text": "O(n)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "O(1)",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "O(log n)",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "O(n²)",
        "isCorrect": false
      }
    ],
    "explanation": "Array elements are stored in contiguous memory locations. Accessing any element by its index is a direct memory access operation, which takes constant time O(1) regardless of the array size.",
    "concepts": ["Arrays", "TimeComplexity", "RandomAccess"],
    "relatedTopics": ["DataStructures", "Algorithms"],
    "difficulty_score": 1
  },
  {
    "question": "Which JavaScript method is used to add an element to the end of an array?",
    "type": "multiple-choice",
    "difficulty": "Easy",
    "topic": "JavaScript",
    "options": [
      {
        "id": "a",
        "text": "array.add()",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "array.append()",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "array.push()",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "array.insert()",
        "isCorrect": false
      }
    ],
    "explanation": "The push() method adds one or more elements to the end of an array and returns the new length of the array. Example: [1, 2].push(3) results in [1, 2, 3].",
    "concepts": ["JavaScript", "ArrayMethods", "Syntax"],
    "relatedTopics": ["JavaScript", "Arrays"],
    "difficulty_score": 1
  },
  {
    "question": "What will be the output of: console.log(typeof null)?",
    "type": "multiple-choice",
    "difficulty": "Medium",
    "topic": "JavaScript",
    "options": [
      {
        "id": "a",
        "text": "null",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "undefined",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "object",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "number",
        "isCorrect": false
      }
    ],
    "explanation": "This is a well-known JavaScript quirk. typeof null returns 'object' due to a bug in the original JavaScript implementation that has been kept for backward compatibility. In reality, null is a primitive value representing the intentional absence of any object value.",
    "concepts": ["JavaScript", "TypeSystem", "Quirks"],
    "relatedTopics": ["JavaScript", "DataTypes"],
    "difficulty_score": 2
  },
  {
    "question": "In a Binary Search Tree (BST), what is true about the left subtree of any node?",
    "type": "multiple-choice",
    "difficulty": "Medium",
    "topic": "DataStructures",
    "options": [
      {
        "id": "a",
        "text": "All values are greater than the node's value",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "All values are less than the node's value",
        "isCorrect": true
      },
      {
        "id": "c",
        "text": "Values can be both greater and less than the node's value",
        "isCorrect": false
      },
      {
        "id": "d",
        "text": "All values are equal to the node's value",
        "isCorrect": false
      }
    ],
    "explanation": "In a Binary Search Tree, the fundamental property is that for any node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater than the node's value. This property enables efficient searching with O(log n) time complexity in balanced BSTs.",
    "concepts": ["BinarySearchTree", "TreeProperties", "DataStructures"],
    "relatedTopics": ["Trees", "Algorithms", "Searching"],
    "difficulty_score": 2
  },
  {
    "question": "What is the worst-case time complexity of QuickSort algorithm?",
    "type": "multiple-choice",
    "difficulty": "Hard",
    "topic": "Algorithms",
    "options": [
      {
        "id": "a",
        "text": "O(n log n)",
        "isCorrect": false
      },
      {
        "id": "b",
        "text": "O(n)",
        "isCorrect": false
      },
      {
        "id": "c",
        "text": "O(n²)",
        "isCorrect": true
      },
      {
        "id": "d",
        "text": "O(log n)",
        "isCorrect": false
      }
    ],
    "explanation": "QuickSort has a worst-case time complexity of O(n²), which occurs when the pivot selection is poor (e.g., always picking the smallest or largest element as pivot in an already sorted array). However, the average-case complexity is O(n log n), and with good pivot selection strategies (like random pivot or median-of-three), the worst case is rarely encountered in practice.",
    "concepts": ["QuickSort", "TimeComplexity", "SortingAlgorithms"],
    "relatedTopics": ["Algorithms", "Sorting", "ComplexityAnalysis"],
    "difficulty_score": 3
  }
]
```

---

## 🎯 ULTIMATE AI PROMPT WITH COMPLETE STRUCTURE

### FOR PRACTICE PROBLEMS (Copy This)

```
Generate {N} coding practice problems in this EXACT JSON format.

CRITICAL: Follow this structure EXACTLY. Output ONLY valid JSON.

Each problem must have:

{
  "title": "Problem Title (2-5 words)",
  "description": "Clear problem statement (2-3 sentences)",
  "difficulty": "Easy|Medium|Hard (EXACT - case sensitive)",
  "topic": "Arrays|Strings|LinkedList|Trees|Graphs|DynamicProgramming|Math|Sorting|BinarySearch|HashTable|Stack|Queue|Heap|Trie|BitManipulation",
  "functionSignature": {
    "javascript": "function functionName(param1, param2) { }",
    "python": "def function_name(param1, param2):",
    "java": "public static ReturnType functionName(ParamType param1, ParamType param2)",
    "cpp": "ReturnType functionName(ParamType param1, ParamType param2)"
  },
  "codeTemplate": {
    "javascript": "function functionName(param1, param2) {\n  // Write your code here\n}",
    "python": "def function_name(param1, param2):\n    # Write your code here\n    pass",
    "java": "class Solution {\n    public ReturnType functionName(ParamType param1, ParamType param2) {\n        // Write your code here\n        return defaultValue;\n    }\n}",
    "cpp": "ReturnType functionName(ParamType param1, ParamType param2) {\n    // Write your code here\n    return defaultValue;\n}"
  },
  "examples": [
    {
      "input": "param1 = value1, param2 = value2",
      "output": "expected output",
      "explanation": "why this is the output"
    },
    {
      "input": "param1 = value1, param2 = value2",
      "output": "expected output",
      "explanation": "why this is the output"
    }
  ],
  "constraints": [
    "1 ≤ n ≤ 10⁵",
    "-10⁹ ≤ arr[i] ≤ 10⁹",
    "Time Complexity: O(n log n) or better"
  ],
  "hints": [
    "Hint 1: Start with brute force approach",
    "Hint 2: Think about what data structure could help",
    "Hint 3: Consider edge cases like empty input"
  ],
  "testCases": [
    {
      "input": {
        "parameterName1": value,
        "parameterName2": value
      },
      "expectedOutput": value,
      "explanation": "why this output"
    }
  ],
  "acceptanceRate": 0
}

TEST CASE FORMAT RULES (CRITICAL):

1. Arrays Problems:
   "input": { "nums": [1, 2, 3], "target": 5 }
   "expectedOutput": [0, 2]

2. String Problems:
   "input": { "s": "hello" }
   "expectedOutput": "olleh"

3. Multiple Arrays:
   "input": { "nums1": [1, 2], "nums2": [3, 4] }
   "expectedOutput": [1, 2, 3, 4]

4. Linked Lists (as arrays):
   "input": { "list1": [1, 2, 4], "list2": [1, 3, 4] }
   "expectedOutput": [1, 1, 2, 3, 4, 4]

5. Trees (as arrays - level order with null):
   "input": { "root": [3, 9, 20, null, null, 15, 7] }
   "expectedOutput": 3

6. Matrix/2D Arrays:
   "input": { "matrix": [[1, 2], [3, 4]] }
   "expectedOutput": [[4, 3], [2, 1]]

7. Numbers:
   "input": { "n": 5 }
   "expectedOutput": 120

8. Boolean outputs:
   "input": { "s": "()" }
   "expectedOutput": true

9. Multiple parameters:
   "input": { "nums": [1, 2, 3], "k": 2, "target": 5 }
   "expectedOutput": [0, 2]

REQUIREMENTS:
- Generate {N} problems
- Mix difficulties: Easy, Medium, Hard
- Mix topics: Arrays, Strings, LinkedList, etc.
- Each problem must have 3-5 test cases
- Test case 1-2: Basic cases
- Test case 3: Edge case (empty, single element, null)
- Test case 4-5: Additional edge cases
- Input MUST be object with parameter names
- expectedOutput type matches function return type
- All 4 languages must have code templates
- acceptanceRate always 0

Output ONLY valid JSON array. No explanations. No markdown. Just JSON.
```

### FOR STREAK QUESTIONS (Copy This)

```
Generate EXACTLY 5 daily streak questions in this EXACT JSON format.

CRITICAL: EXACTLY 5 questions. Follow structure EXACTLY. Output ONLY valid JSON.

Each question must have:

{
  "question": "Question text asking one specific concept",
  "type": "multiple-choice",
  "difficulty": "Easy|Medium|Hard",
  "topic": "JavaScript|Python|Java|DataStructures|Algorithms|WebDevelopment|etc",
  "options": [
    {
      "id": "a",
      "text": "Option A text",
      "isCorrect": false
    },
    {
      "id": "b",
      "text": "Option B text",
      "isCorrect": true
    },
    {
      "id": "c",
      "text": "Option C text",
      "isCorrect": false
    },
    {
      "id": "d",
      "text": "Option D text",
      "isCorrect": false
    }
  ],
  "explanation": "3-4 sentences explaining why the correct answer is correct and why others are wrong",
  "concepts": ["concept1", "concept2", "concept3"],
  "relatedTopics": ["Topic1", "Topic2"],
  "difficulty_score": 1
}

REQUIREMENTS:
- EXACTLY 5 questions (not 4, not 6)
- Type: Always "multiple-choice"
- Difficulty distribution: 2 Easy, 2 Medium, 1 Hard
- Options: EXACTLY 4 options (a, b, c, d)
- EXACTLY ONE option with isCorrect: true
- difficulty_score: 1=Easy, 2=Medium, 3=Hard
- Question topics: Mix JavaScript, Python, DataStructures, Algorithms
- Questions should test: syntax, concepts, output prediction, best practices
- Explanation: Educational and detailed

QUESTION TYPES TO INCLUDE:
1. Language syntax/features
2. Data structure properties
3. Algorithm complexity
4. Code output prediction
5. Best practices/debugging

Output ONLY valid JSON array of 5 questions. No explanations. Just JSON.
```

---

## ✅ VALIDATION CHECKLIST

### Before Uploading Practice Problems:

- [ ] All problems have title, description, difficulty
- [ ] Difficulty is EXACTLY: "Easy", "Medium", or "Hard"
- [ ] All 4 languages have function signatures
- [ ] All 4 languages have code templates
- [ ] Examples array has 2-3 examples
- [ ] Constraints array has 3-4 items
- [ ] Hints array has 3 hints
- [ ] testCases array has 3-5 test cases
- [ ] Each test case has: input (object), expectedOutput, explanation
- [ ] Input is ALWAYS an object: { "param": value }
- [ ] acceptanceRate is 0
- [ ] Valid JSON (no trailing commas, proper quotes)

### Before Uploading Streak Questions:

- [ ] EXACTLY 5 questions
- [ ] Type is "multiple-choice" for all
- [ ] Each has difficulty: Easy, Medium, or Hard
- [ ] Each has topic specified
- [ ] Each has EXACTLY 4 options (a, b, c, d)
- [ ] Each option has: id, text, isCorrect
- [ ] EXACTLY ONE option has isCorrect: true
- [ ] Explanation is 3-4 sentences
- [ ] concepts array has 2-3 items
- [ ] relatedTopics array has 2-3 items
- [ ] difficulty_score: 1, 2, or 3
- [ ] Valid JSON (no trailing commas, proper quotes)

---

## 🎯 QUICK REFERENCE: TEST CASE FORMATS

| Problem Type | Input Format | Example |
|-------------|--------------|---------|
| Single Array | `{"nums": []}` | `{"nums": [1,2,3]}` |
| Two Arrays | `{"arr1": [], "arr2": []}` | `{"arr1": [1,2], "arr2": [3,4]}` |
| Array + Number | `{"nums": [], "k": 0}` | `{"nums": [1,2,3], "k": 2}` |
| Single String | `{"s": ""}` | `{"s": "hello"}` |
| Two Strings | `{"s1": "", "s2": ""}` | `{"s1": "abc", "s2": "def"}` |
| Single Number | `{"n": 0}` | `{"n": 5}` |
| Multiple Numbers | `{"a": 0, "b": 0}` | `{"a": 5, "b": 3}` |
| Linked List | `{"head": []}` | `{"head": [1,2,3]}` |
| Two Lists | `{"list1": [], "list2": []}` | `{"list1": [1,2], "list2": [3,4]}` |
| Tree | `{"root": []}` | `{"root": [1,2,3,null,null,4,5]}` |
| Matrix | `{"matrix": [[]]}` | `{"matrix": [[1,2],[3,4]]}` |
| Boolean Output | Any input | `expectedOutput: true` or `false` |

---

## 🚀 YOU'RE READY!

### Upload Process:

1. **Copy the AI prompt** (Practice or Streak)
2. **Paste to ChatGPT/DeepSeek/Copilot**
3. **Get JSON output** (should be pure JSON)
4. **Validate JSON** (use JSONLint.com if needed)
5. **Save as .json file**
6. **Upload to Admin Dashboard**
7. **Zero errors!** ✅

---

## 🎉 GUARANTEED ZERO ERRORS!

If you follow:
- ✅ Exact structure from this guide
- ✅ Test case formats from examples
- ✅ AI prompts as provided
- ✅ Validation checklist

You will get **ZERO upload errors** and **ZERO runtime errors**! 🚀

**All the best, friend!** 💪
