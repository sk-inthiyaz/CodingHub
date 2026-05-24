# CodingHub — AI Problem Generation Prompt

Paste everything inside the triple-backtick block below to any AI (ChatGPT, Claude, Gemini).
Replace [PLACEHOLDERS] with your actual values before sending.

---

## PROMPT TO COPY

You are generating coding practice problems for a custom judge platform called CodingHub.
The platform has a strict JSON schema. Follow every rule below exactly — do NOT deviate.

TASK:
Generate [NUMBER] coding problem(s):
  - Difficulty: [Easy | Medium | Hard]
  - Topic: [Arrays | Strings | LinkedList | Trees | Graphs | DP | Math | Sorting | etc.]
  - Problem: [PROBLEM NAME or "your choice"]

OUTPUT FORMAT (strict JSON, no extra text, no markdown, pure JSON only):

{
  "problems": [
    {
      "title": "Unique problem title",
      "difficulty": "Easy",
      "topic": "Arrays",
      "description": "Full problem statement.",
      "constraints": ["1 <= nums.length <= 10^4", "each constraint as a separate string"],
      "hints": ["Hint 1", "Hint 2"],
      "tags": ["tag1", "tag2"],
      "supportedLanguages": ["javascript", "python", "java", "cpp"],
      "functionSignature": {
        "name": "functionName",
        "params": ["param1", "param2"],
        "returnType": "int"
      },
      "codeTemplate": {
        "javascript": "...",
        "python": "...",
        "java": "...",
        "cpp": "..."
      },
      "examples": [
        { "input": "nums = [2,7], target = 9", "output": "[0,1]", "explanation": "2+7=9" }
      ],
      "testCases": [ ... 53 total: 3 public + 50 private ... ]
    }
  ]
}

ALLOWED returnType VALUES (use EXACTLY one):
"int" | "long" | "float" | "double" | "string" | "boolean" |
"int[]" | "long[]" | "float[]" | "double[]" | "string[]" | "boolean[]" |
"int[][]" | "string[][]" | "ListNode" | "TreeNode"

CODE TEMPLATE RULES (all 4 languages REQUIRED):

JAVASCRIPT:
  Must contain: function functionName(param1, param2) {
  No type annotations.
  Example: "function twoSum(nums, target) {\n    // Your code here\n}"

PYTHON:
  Must contain: def functionName(param1, param2):
  STRICTLY NO type hints. Never use (s: str) or -> bool.
  CORRECT:  def twoSum(nums, target):
  WRONG:    def twoSum(nums: List[int], target: int) -> List[int]:

JAVA:
  Must contain: class Solution { public <ReturnType> functionName(
  Type map: string->String, int[]->int[], string[]->String[], boolean[]->boolean[]
  Example: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}"

C++:
  Must contain: class Solution { public: <ReturnType> functionName(
  Type map: boolean->bool, int[]->vector<int>, string[]->vector<string>,
            boolean[]->vector<bool>, int[][]->vector<vector<int>>
  Example: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) { return {}; }\n};"

TEST CASE INPUT FORMAT:
  Rule: one parameter per line, use literal \n between parameters.
  1 param:        "[2,7,11,15]"
  2 params:       "[2,7,11,15]\n9"
  3 params:       "hello\nworld\n5"
  String array:   "[\"flower\",\"flow\",\"flight\"]"
  Plain string:   "anagram"   (NEVER "\"anagram\"" with surrounding quotes)

TEST CASE expectedOutput FORMAT:
  returnType   format                example
  int          raw number            "6"
  boolean      lowercase ONLY        "true"  or  "false"  (never "True")
  string       raw, NO outer quotes  "fl"    (NEVER "\"fl\"")
  int[]        JSON, no spaces       "[0,1]" (NEVER "[0, 1]")
  string[]     JSON array            "[\"a\",\"b\"]"
  empty string empty string          ""

TEST CASE DISTRIBUTION (per problem):
  Total: 53 test cases
  - 3  isHidden: false  (public, shown to user on Run button)
  - 50 isHidden: true   (private, run on Submit button)
  Private cases must cover:
  - Single element / minimum size inputs
  - Large values near constraint boundaries
  - Negatives (if applicable)
  - Duplicates / repeated values
  - Edge cases (empty, all same, sorted, reverse sorted)
  - Mix of true/false for boolean problems

VERIFICATION CHECKLIST (check all before outputting):
  [ ] difficulty is exactly "Easy", "Medium", or "Hard" (capital first letter)
  [ ] returnType is from the allowed list
  [ ] All 4 code templates present
  [ ] Python template has ZERO type hints
  [ ] Java has "class Solution" with correct Java return type
  [ ] C++ has "class Solution" with correct C++ return type
  [ ] Test case inputs use \n between parameters
  [ ] String expectedOutput has NO surrounding quotes ("fl" not "\"fl\"")
  [ ] Boolean expectedOutput is lowercase ("true"/"false" not "True"/"False")
  [ ] Array expectedOutput has no spaces ("[0,1]" not "[0, 1]")
  [ ] Exactly 3 public (isHidden:false) test cases
  [ ] Exactly 50 private (isHidden:true) test cases
  [ ] All 53 inputs are unique strings
  [ ] All expectedOutput values are mathematically correct (verify each one)
  [ ] Valid JSON (no trailing commas, strings properly escaped)
  [ ] Root is { "problems": [...] } — NOT a bare array [...]

COMPLETE EXAMPLE (follow this exact structure):

{
  "problems": [
    {
      "title": "Valid Anagram",
      "difficulty": "Easy",
      "topic": "Strings",
      "description": "Given two strings s and t, return true if t is an anagram of s, false otherwise.",
      "constraints": ["1 <= s.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
      "hints": ["Use a frequency counter (hash map)", "Sort both strings and compare"],
      "tags": ["string", "hash-map"],
      "supportedLanguages": ["javascript", "python", "java", "cpp"],
      "functionSignature": { "name": "isAnagram", "params": ["s", "t"], "returnType": "boolean" },
      "codeTemplate": {
        "javascript": "function isAnagram(s, t) {\n    // Your code here\n}",
        "python": "def isAnagram(s, t):\n    # Your code here\n    pass",
        "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
        "cpp": "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};"
      },
      "examples": [
        { "input": "s = \"anagram\", t = \"nagaram\"", "output": "true", "explanation": "Same letters rearranged" }
      ],
      "testCases": [
        { "input": "anagram\nnagaram", "expectedOutput": "true",  "explanation": "Same letters", "isHidden": false },
        { "input": "rat\ncar",         "expectedOutput": "false", "explanation": "r-a-t vs c-a-r", "isHidden": false },
        { "input": "listen\nsilent",   "expectedOutput": "true",  "explanation": "Rearranged",    "isHidden": false },
        { "input": "cat\nact",         "expectedOutput": "true",  "isHidden": true },
        { "input": "hello\nworld",     "expectedOutput": "false", "isHidden": true },
        { "input": "a\na",             "expectedOutput": "true",  "isHidden": true },
        { "input": "ab\nba",           "expectedOutput": "true",  "isHidden": true },
        { "input": "abc\nabcd",        "expectedOutput": "false", "isHidden": true }
      ]
    }
  ]
}

Now generate the problem(s) described. Output ONLY valid JSON. No explanation text.

---

## Quick Reference Card

| Field            | Rule                                                         |
|------------------|--------------------------------------------------------------|
| difficulty       | "Easy" / "Medium" / "Hard"  — capital first letter           |
| returnType       | Must be from the allowed enum list                           |
| Python template  | NO type hints — def fn(a, b): not def fn(a: int) -> bool:   |
| String output    | No outer quotes — "fl"  not  "\"fl\""                       |
| Boolean output   | Lowercase — "true" not "True"                                |
| Array output     | No spaces — "[0,1]" not "[0, 1]"                             |
| Input separator  | \n between params — "[1,2,3]\n9"                             |
| String input     | No quotes — "anagram" not "\"anagram\""                      |
| Public tests     | Exactly 3  (isHidden: false)                                 |
| Private tests    | Exactly 50 (isHidden: true)                                  |
| Root wrapper     | { "problems": [...] }  — NOT a bare array [...]              |
