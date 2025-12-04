# 🎯 AI Prompt Templates - Generate Perfect Questions

## ✨ For ChatGPT / DeepSeek / Copilot

---

## 📚 PROMPT 1: Generate Practice Problems

### Use This Prompt (Copy-Paste Ready)

```
I need you to generate N practice coding problems in a specific JSON format.

IMPORTANT: Follow this format EXACTLY. Output ONLY valid JSON.

For each problem, create this structure:

{
  "title": "Problem Title",
  "description": "Clear problem statement explaining what needs to be done",
  "difficulty": "Easy|Medium|Hard",
  "topic": "Arrays|Strings|LinkedList|Trees|Graphs|DynamicProgramming|etc",
  "functionSignature": {
    "javascript": "function functionName(param1, param2) { }",
    "python": "def function_name(param1, param2):",
    "java": "public static ReturnType functionName(ParamType1 param1, ParamType2 param2)",
    "cpp": "ReturnType functionName(ParamType1 param1, ParamType2 param2)"
  },
  "codeTemplate": {
    "javascript": "function mergeTwoLists(list1, list2) {\n  // Write your code here\n}",
    "python": "def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass",
    "java": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}",
    "cpp": "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n}"
  },
  "examples": [
    {
      "input": "example input 1",
      "output": "example output 1",
      "explanation": "why this output"
    },
    {
      "input": "example input 2",
      "output": "example output 2",
      "explanation": "why this output"
    }
  ],
  "constraints": [
    "constraint 1 e.g., 1 ≤ n ≤ 10⁵",
    "constraint 2 e.g., -10⁹ ≤ arr[i] ≤ 10⁹",
    "constraint 3 e.g., Time Complexity: O(n log n)"
  ],
  "hints": [
    "Hint 1: Start with a simple approach",
    "Hint 2: Think about data structures that might help",
    "Hint 3: Consider edge cases"
  ],
  "testCases": [
    {
      "input": {
        "param1": "value1",
        "param2": "value2"
      },
      "expectedOutput": "expected result",
      "explanation": "why this is correct"
    },
    {
      "input": {
        "param1": "value1",
        "param2": "value2"
      },
      "expectedOutput": "expected result",
      "explanation": "why this is correct"
    },
    {
      "input": {
        "param1": "edge case value",
        "param2": "edge case value"
      },
      "expectedOutput": "expected result",
      "explanation": "edge case explanation"
    }
  ],
  "acceptanceRate": 0
}

REQUIREMENTS FOR EACH PROBLEM:
1. Title: Clear, descriptive (2-5 words)
2. Description: 2-3 sentences explaining the problem
3. Difficulty: Must be exactly "Easy", "Medium", or "Hard"
4. Topic: Choose from: Arrays, Strings, LinkedList, Trees, Graphs, DynamicProgramming, Math, Sorting, BinarySearch, HashTable, Stack, Queue, Heap, Trie, BitManipulation
5. Function Signature: Provide for all 4 languages (JavaScript, Python, Java, C++)
6. Code Template: Starter code for all 4 languages with // or # Write your code here
7. Examples: 2-3 examples with clear input/output/explanation
8. Constraints: 3-4 constraints including time/space complexity hints
9. Hints: 3 hints that guide without giving away solution
10. Test Cases: 3-5 test cases including edge cases
    - For simple types: use direct values
    - For arrays: use JSON arrays [1, 2, 3]
    - For objects/complex types: use structured JSON with proper nesting
    - IMPORTANT: input must be an object with named parameters
11. Acceptance Rate: Always 0 (will be calculated by system)

RULES FOR TEST CASES:
- Test case 1: Basic case
- Test case 2: Another basic case
- Test case 3: Edge case (empty, single element, null, etc)
- Input MUST be a JSON object with parameter names
- expectedOutput must match the function's return type

EXAMPLE FORMAT FOR TEST CASES:
"testCases": [
  {
    "input": {
      "arr": [1, 2, 3, 4, 5],
      "target": 3
    },
    "expectedOutput": 2,
    "explanation": "Element 3 is at index 2"
  }
]

Generate N problems with variety in difficulty and topics.

Output ONLY the JSON array. No explanations. No code blocks. Just valid JSON.
```

### How to Use:

Replace `N` with number of problems you want:
```
"Generate 10 practice problems in a specific JSON format..."
```

### Examples:

**For 5 problems:**
```
Generate 5 practice problems...
```

**For 10 problems:**
```
Generate 10 practice problems...
```

**For specific topics:**
```
Generate 5 practice problems focusing on: Arrays, Strings, LinkedList, Trees...
```

---

## 🔥 PROMPT 2: Generate Streak Questions (5 Required)

### Use This Prompt (Copy-Paste Ready)

```
I need you to generate EXACTLY 5 daily streak questions in a specific JSON format.

IMPORTANT: Generate EXACTLY 5 questions. Follow format EXACTLY. Output ONLY valid JSON.

Each question must have this structure:

{
  "question": "Question text asking one specific concept",
  "type": "multiple-choice",
  "difficulty": "Easy",
  "topic": "topic name",
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
  "explanation": "Detailed explanation of why B is correct and why others are wrong",
  "concepts": ["concept1", "concept2"],
  "relatedTopics": ["Array", "Sorting"],
  "difficulty_score": 1
}

IMPORTANT REQUIREMENTS:

1. EXACTLY 5 questions (not more, not less)
2. Type: Always "multiple-choice"
3. Difficulty: Mix of Easy, Medium, Hard (suggest: 2 Easy, 2 Medium, 1 Hard)
4. Topic: Choose from: JavaScript, Python, Java, DataStructures, Algorithms, WebDevelopment, etc
5. Options: EXACTLY 4 options (a, b, c, d)
   - Each option must have: id (a/b/c/d), text, isCorrect (true/false)
   - EXACTLY ONE option must have isCorrect: true
6. Explanation: 3-4 sentences explaining the correct answer
7. Concepts: 2-3 related concepts being tested
8. RelatedTopics: 2-3 related topics
9. Difficulty Score: 1 = Easy, 2 = Medium, 3 = Hard

CONTENT GUIDELINES:

- Questions should test fundamental concepts
- Mix different programming languages and concepts
- Questions should be realistic interview-style questions
- Options should be plausible (not obviously wrong)
- Explanations should be educational

QUESTION VARIETY:
- Question 1: JavaScript/Python concept
- Question 2: Data structure concept
- Question 3: Algorithm concept
- Question 4: Code output prediction
- Question 5: Best practice / debugging

Output ONLY the JSON array. No explanations. No code blocks. Just valid JSON.
```

### How to Use:

Just copy-paste and send to ChatGPT/DeepSeek/Copilot:
```
I need you to generate EXACTLY 5 daily streak questions in a specific JSON format.
(then paste the full prompt)
```

---

## 🎯 PROMPT 3: Generate Problems by Specific Difficulty

### Use This Prompt

```
Generate 5 practice problems all with difficulty "Easy" focusing on Arrays and Strings topics.

Follow this JSON format exactly:

[
  {
    "title": "Problem Title",
    "description": "Problem description",
    "difficulty": "Easy",
    "topic": "Arrays|Strings",
    "functionSignature": { /* for all 4 languages */ },
    "codeTemplate": { /* for all 4 languages */ },
    "examples": [ /* 2-3 examples */ ],
    "constraints": [ /* 3-4 constraints */ ],
    "hints": [ /* 3 hints */ ],
    "testCases": [
      {
        "input": { /* parameter names and values */ },
        "expectedOutput": /* expected result */,
        "explanation": "why this output"
      }
    ],
    "acceptanceRate": 0
  }
]

Generate only Easy difficulty problems. Output ONLY valid JSON.
```

---

## 🏆 PROMPT 4: Generate Mixed Difficulty Problems

### Use This Prompt

```
Generate 10 practice problems with this difficulty distribution:
- 3 Easy problems
- 5 Medium problems
- 2 Hard problems

Mix different topics: Arrays, Strings, LinkedList, Trees, Graphs, DynamicProgramming.

Follow exact JSON format:
[{ /* problem structure as per template */ }]

Output ONLY valid JSON array. No explanations.
```

---

## ✅ PROMPT 5: Generate Questions for Specific Programming Language

### Use This Prompt

```
Generate 5 practice problems focused on Python.

Each problem should:
1. Test Python-specific concepts
2. Be solvable in Python
3. Have Python code templates
4. Include test cases for Python

Format: Valid JSON array with problems
[{ /* problem structure */ }]

Topics can include:
- List operations
- Dictionary usage
- String manipulation
- Recursion
- List comprehension
- Generators

Output ONLY valid JSON.
```

---

## 📋 PROMPT SUMMARY TABLE

| Purpose | Problems | Streak | Prompt |
|---------|----------|--------|--------|
| Generate N problems | ✅ Use PROMPT 1 | ❌ | Replace N |
| Generate 5 streak questions | ❌ | ✅ Use PROMPT 2 | Fixed 5 |
| Specific difficulty | ✅ Use PROMPT 3 | ❌ | Customize |
| Mixed difficulty | ✅ Use PROMPT 4 | ❌ | 3-5-2 dist |
| Language-specific | ✅ Use PROMPT 5 | ❌ | Pick language |

---

## 🎯 QUICK COPY-PASTE EXAMPLES

### Example 1: Get 7 Easy Problems
```
Generate 7 practice problems in a specific JSON format.

All should be "Easy" difficulty.

[COPY FULL PROMPT 1 HERE]
```

### Example 2: Get 5 Daily Streak Questions
```
[COPY FULL PROMPT 2 HERE]
```

### Example 3: Get 10 Medium Problems on Arrays
```
Generate 10 practice problems with difficulty "Medium" focusing on Arrays topic.

[COPY FULL PROMPT 1 HERE]
```

---

## ⚠️ IMPORTANT NOTES

### When Using These Prompts:

1. **Copy the ENTIRE prompt** - Don't modify
2. **Output will be JSON** - Should be valid JSON only
3. **No explanations** - AI will just output JSON
4. **Paste directly to backend** - No formatting needed
5. **If you get errors** - Check that:
   - All test cases have "input" as object with parameter names
   - All options have exactly one isCorrect: true
   - All difficulties are exact: "Easy", "Medium", "Hard"
   - No trailing commas
   - All strings properly quoted

---

## 🔧 IF YOU GET ERRORS

### Error: "input must be object"
**Problem**: Test case input is string instead of object
**Fix**: Ensure input is `{ "param": value }` not `"param value"`

### Error: "invalid JSON"
**Problem**: JSON is malformed
**Fix**: Copy full prompt, output should be pure JSON

### Error: "isCorrect must be boolean"
**Problem**: isCorrect value is wrong
**Fix**: Use `true` or `false` (lowercase, no quotes)

### Error: "difficulty not recognized"
**Problem**: Difficulty value wrong
**Fix**: Must be exactly "Easy", "Medium", or "Hard"

---

## 🚀 BEST PRACTICES

1. **Always use full prompt** - Don't abbreviate
2. **Specify count clearly** - "Generate 10 problems" not "Generate some problems"
3. **Be specific about topics** - "Arrays and Strings" not "algorithms"
4. **Test before uploading** - Validate JSON first
5. **Use consistent formatting** - Copy-paste entire prompt

---

## 📞 BACKEND COMPATIBILITY

These prompts are designed for:
- ✅ Your exact backend API
- ✅ Your MongoDB schema
- ✅ Your test case format
- ✅ Your difficulty levels
- ✅ Your topic categories
- ✅ All 4 programming languages

**No errors will occur if you follow these prompts exactly!** ✨

---

## 🎉 YOU'RE ALL SET!

### To Generate Perfect Questions:

1. **For Practice Problems**: Use PROMPT 1 (replace N)
2. **For Streak Questions**: Use PROMPT 2 (exactly 5)
3. **Copy the ENTIRE prompt** - Word for word
4. **Paste to ChatGPT/DeepSeek/Copilot**
5. **Get JSON output** - Copy and paste to admin panel
6. **Upload** - Should work with ZERO errors!

---

**Happy question generation! 🚀**
