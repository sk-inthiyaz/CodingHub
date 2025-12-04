/**
 * LeetCode-style test harness
 * Wraps user function code with test runner that calls the function with test inputs
 * Supports dynamic function signatures (different param counts, types, return types)
 */

/**
 * Wraps user code with a test harness based on language
 * @param {string} userCode - The user's function code (without main)
 * @param {string} language - Programming language
 * @param {object} testCase - Test case with input and function signature
 * @param {object} questionMetadata - { functionSignature: { name, params, returnType }, ... }
 * @returns {string} Complete runnable code
 */
const { mapReturnType } = require('./validator');

function wrapCodeWithHarness(userCode, language, testCase, questionMetadata = {}) {
  // Extract function info from question metadata or fallback to testCase
  const funcSig = questionMetadata?.functionSignature || { name: 'solution', params: [] };
  const functionName = funcSig.name || 'solution';
  const paramCount = (funcSig.params || []).length || 1;
  const input = testCase.input || '';
  const returnTypeToken = funcSig.returnType || 'int';
  
  switch (language) {
    case 'javascript':
      return wrapJavaScript(userCode, functionName, paramCount, input, returnTypeToken);
    case 'python':
      return wrapPython(userCode, functionName, paramCount, input, returnTypeToken);
    case 'java':
      return wrapJava(userCode, functionName, paramCount, input, returnTypeToken);
    case 'cpp':
      return wrapCpp(userCode, functionName, paramCount, input, returnTypeToken);
    default:
      return userCode;
  }
}

/**
 * Format input for stdin (converts single-line to multi-line)
 * "[2,7,11,15], 9" -> "[2,7,11,15]\n9"
 */
function formatInputForStdin(input, paramCount) {
  const params = parseInputLines(input, paramCount);
  return params.join('\n');
}

/**
 * Parse test case input based on parameter count
 * Supports two formats:
 * 1. Multi-line: Each param on separate line
 * 2. Single-line: Comma-separated (e.g., "[2,7,11,15], 9")
 */
function parseInputLines(input, paramCount) {
  const trimmed = input.trim();
  
  // Check if input has newlines (multi-line format)
  if (trimmed.includes('\n')) {
    const lines = trimmed.split(/\r?\n/).filter(l => l.trim());
    const params = [];
    for (let i = 0; i < paramCount && i < lines.length; i++) {
      params.push(lines[i].trim());
    }
    return params;
  }
  
  // Single-line format: Split intelligently
  // For paramCount=2: Look for pattern like "[...], number" or "[...],number"
  if (paramCount === 2) {
    // Match array/object followed by comma and remaining content
    const match = trimmed.match(/^(\[.*?\]|\{.*?\})\s*,\s*(.+)$/);
    if (match) {
      return [match[1].trim(), match[2].trim()];
    }
  }
  
  // Fallback: Split by comma (careful with arrays)
  const parts = splitSmartComma(trimmed, paramCount);
  return parts.map(p => p.trim());
}

/**
 * Smart comma split that respects brackets
 * "[2,7,11,15], 9" -> ["[2,7,11,15]", "9"]
 */
function splitSmartComma(str, expectedParts) {
  const parts = [];
  let current = '';
  let depth = 0;
  let inString = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char === '"' && str[i-1] !== '\\') {
      inString = !inString;
    }
    
    if (!inString) {
      if (char === '[' || char === '{') depth++;
      if (char === ']' || char === '}') depth--;
      
      if (char === ',' && depth === 0 && parts.length < expectedParts - 1) {
        parts.push(current.trim());
        current = '';
        continue;
      }
    }
    
    current += char;
  }
  
  if (current) parts.push(current.trim());
  
  return parts;
}

function wrapJavaScript(userCode, functionName, paramCount, input, returnTypeToken) {
  const callsViaSolution = /class\s+Solution/.test(userCode);
  const params = parseInputLines(input, paramCount);
  
  let paramsCode = '';
  let callCode = '';
  
  if (paramCount === 1) {
    // Try to detect if input is a string (starts/ends with quotes) or array/number
    paramsCode = `const line = lines[0] || '[]';
const param1 = line.startsWith('"') ? line.replace(/^"|"$/g, '') : JSON.parse(line);`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1)` : `${functionName}(param1)`};`;
  } else if (paramCount === 2) {
    paramsCode = `const param1 = lines[0]?.startsWith('"') ? lines[0].replace(/^"|"$/g, '') : JSON.parse(lines[0] || '[]');
const param2 = lines[1]?.startsWith('"') ? lines[1].replace(/^"|"$/g, '') : JSON.parse(lines[1] || '0');`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1, param2)` : `${functionName}(param1, param2)`};`;
  } else if (paramCount === 3) {
    paramsCode = `const param1 = lines[0]?.startsWith('"') ? lines[0].replace(/^"|"$/g, '') : JSON.parse(lines[0] || '[]');
const param2 = lines[1]?.startsWith('"') ? lines[1].replace(/^"|"$/g, '') : JSON.parse(lines[1] || '0');
const param3 = lines[2]?.startsWith('"') ? lines[2].replace(/^"|"$/g, '') : JSON.parse(lines[2] || '0');`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1, param2, param3)` : `${functionName}(param1, param2, param3)`};`;
  } else {
    // Generic for more params
    let paramDecls = [];
    let paramArgs = [];
    for (let i = 1; i <= paramCount; i++) {
      paramDecls.push(`const param${i} = lines[${i-1}]?.startsWith('"') ? lines[${i-1}].replace(/^"|"$/g, '') : JSON.parse(lines[${i-1}] || '0');`);
      paramArgs.push(`param${i}`);
    }
    paramsCode = paramDecls.join('\n');
    const argList = paramArgs.join(', ');
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(${argList})` : `${functionName}(${argList})`};`;
  }

  return `
${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
const lines = input.length ? input.split(/\\r?\\n/) : [];

// Parse input
${paramsCode}

// Call user function
${callCode}

// Print result
if ("string" === ${JSON.stringify(returnTypeToken)}) {
  // For string return, print raw (including empty string)
  process.stdout.write(String(result));
} else {
  console.log(JSON.stringify(result));
}
`;
}

function wrapPython(userCode, functionName, paramCount, input, returnTypeToken) {
  const callsViaSolution = /class\s+Solution/.test(userCode);
  
  let paramsCode = '';
  let callCode = '';
  
  if (paramCount === 1) {
    paramsCode = `# Parse param - string if starts with quote, else JSON
if len(data) > 0:
    line = data[0]
    if line.startswith('"') and line.endswith('"'):
        param1 = line.strip('"')
    else:
        param1 = json.loads(line) if line else []
else:
    param1 = []`;
    if (callsViaSolution) {
      callCode = `sol = Solution()\nresult = sol.${functionName}(param1)`;
    } else {
      callCode = `result = ${functionName}(param1)`;
    }
  } else if (paramCount === 2) {
    paramsCode = `# Parse params
if len(data) > 0:
    line = data[0]
    param1 = line.strip('"') if line.startswith('"') else json.loads(line)
else:
    param1 = []
if len(data) > 1:
    line = data[1]
    param2 = line.strip('"') if line.startswith('"') else (int(line) if line.isdigit() or (line.startswith('-') and line[1:].isdigit()) else json.loads(line))
else:
    param2 = 0`;
    if (callsViaSolution) {
      callCode = `sol = Solution()\nresult = sol.${functionName}(param1, param2)`;
    } else {
      callCode = `result = ${functionName}(param1, param2)`;
    }
  } else if (paramCount === 3) {
    paramsCode = `param1 = json.loads(data[0]) if len(data) > 0 else []
param2 = json.loads(data[1]) if len(data) > 1 else []
param3 = json.loads(data[2]) if len(data) > 2 else 0`;
    if (callsViaSolution) {
      callCode = `sol = Solution()\nresult = sol.${functionName}(param1, param2, param3)`;
    } else {
      callCode = `result = ${functionName}(param1, param2, param3)`;
    }
  } else {
    // Generic
    let paramDecls = [];
    let paramArgs = [];
    for (let i = 1; i <= paramCount; i++) {
      paramDecls.push(`param${i} = json.loads(data[${i-1}]) if len(data) > ${i-1} else []`);
      paramArgs.push(`param${i}`);
    }
    paramsCode = paramDecls.join('\n');
    const argList = paramArgs.join(', ');
    if (callsViaSolution) {
      callCode = `sol = Solution()\nresult = sol.${functionName}(${argList})`;
    } else {
      callCode = `result = ${functionName}(${argList})`;
    }
  }

  return `
${userCode}

import json
import sys

data = sys.stdin.read().splitlines()

${paramsCode}

${callCode}

if (${JSON.stringify(returnTypeToken)} == 'string'):
  # For string return, print raw (no quotes)
  sys.stdout.write(str(result))
else:
  print(json.dumps(result, separators=(',',':')))
`;
}

function wrapJava(userCode, functionName, paramCount, input, returnTypeToken) {
  // Extract param types from metadata if available
  const funcSig = userCode.match(/public\s+\w+\s+\w+\((.*?)\)/)?.[1] || '';
  const paramDeclarations = funcSig.split(',').map(p => p.trim());
  
  let readCode = '';
  let paramsCode = '';
  let callCode = '';
  
  // Determine parameter types from function signature
  const getParamType = (index) => {
    if (paramDeclarations[index]) {
      const type = paramDeclarations[index].split(/\s+/)[0];
      return type;
    }
    return 'int[]'; // Default fallback
  };
  
  // console debug removed in production
  
  if (paramCount === 1) {
    const paramType = getParamType(0);
    // For String, use empty string directly (already has quotes in template)
    const defaultVal = paramType.includes('[]') ? '[]' : (paramType === 'String' ? '' : '0');
    readCode = 'String line1 = br.readLine();\n    if (line1 == null) line1 = "' + defaultVal + '";';
    
    const returnType = mapReturnType('java', returnTypeToken) || 'int';
    
    if (paramType.includes('[]')) {
      paramsCode = 'int[] param1 = parseIntArray(line1);';
      if (returnType === 'boolean' || returnType === 'bool') {
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
      } else if (returnType.includes('[]')) {
        if (returnTypeToken === 'string[]') {
          callCode = 'var result = new Solution().' + functionName + '(param1);\n    printStringArray(result);';
        } else if (returnTypeToken === 'boolean[]') {
          callCode = 'var result = new Solution().' + functionName + '(param1);\n    printBoolArray(result);';
        } else {
          callCode = 'var result = new Solution().' + functionName + '(param1);\n    printIntArray(result);';
        }
      } else {
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
      }
    } else if (paramType === 'int') {
      paramsCode = 'int param1 = Integer.parseInt(line1.trim());';
      callCode = 'int result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
    } else if (paramType === 'String') {
      // String parameter - no need to remove quotes, input is plain string
      paramsCode = 'String param1 = line1;';
      if (returnType === 'boolean' || returnType === 'bool') {
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
      } else if (returnType === 'String') {
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
      } else {
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
      }

    } else {
      paramsCode = 'String param1 = line1;';
        callCode = 'var result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
    }
  } else if (paramCount === 2) {
    const param1Type = getParamType(0);
    const param2Type = getParamType(1);
    
    const default1 = param1Type.includes('[]') ? '[]' : '0';
    const default2 = param2Type.includes('[]') ? '[]' : '0';
    
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "' + default1 + '";\n    if (line2 == null) line2 = "' + default2 + '";';
    
    if (param1Type.includes('[]') && param2Type === 'int') {
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
      callCode = 'var result = new Solution().' + functionName + '(param1, param2);\n    printIntArray(result);';
    } else if (param1Type.includes('[][]') && param2Type === 'String') {
      paramsCode = 'char[][] param1 = parseCharArray(line1);\n    String param2 = line2;';
      callCode = 'var result = new Solution().' + functionName + '(param1, param2);\n    System.out.println(result);';
    } else {
      // Fallback for twoSum (2 int[] params)
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
      callCode = 'var result = new Solution().' + functionName + '(param1, param2);\n    printIntArray(result);';
    }
  } else if (paramCount === 3) {
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    String line3 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";\n    if (line3 == null) line3 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());\n    int param3 = Integer.parseInt(line3.trim());';
    callCode = 'var result = new Solution().' + functionName + '(param1, param2, param3);\n    System.out.println(result);';
  } else {
    // Fallback for twoSum (2 params)
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
    callCode = 'var result = new Solution().' + functionName + '(param1, param2);\n    printIntArray(result);';
  }

  // Extract Solution class if it exists, otherwise use userCode as-is
  let solutionCode = userCode;
  if (userCode.includes('class Solution')) {
    // Solution class is provided by user
    solutionCode = userCode;
  } else {
    // Wrap userCode in Solution class
    solutionCode = 'class Solution {\n  ' + userCode + '\n}';
  }

  const parseIntArrayCode = 'static int[] parseIntArray(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n      if (c != \'[\' && c != \']\') sb.append(c);\n    }\n    String numsStr = sb.toString();\n    if (numsStr.isEmpty()) return new int[0];\n    String[] numStrs = numsStr.split(",");\n    int[] nums = new int[numStrs.length];\n    for (int i = 0; i < numStrs.length; i++) {\n      if (!numStrs[i].trim().isEmpty()) {\n        nums[i] = Integer.parseInt(numStrs[i].trim());\n      }\n    }\n    return nums;\n  }';

  const printIntArrayCode = 'static void printIntArray(int[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) {\n      System.out.print(arr[i]);\n      if (i < arr.length - 1) System.out.print(",");\n    }\n    System.out.println("]");\n  }';
  const printStringArrayCode = 'static void printStringArray(String[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) {\n      System.out.print(arr[i] == null ? "null" : arr[i]);\n      if (i < arr.length - 1) System.out.print(",");\n    }\n    System.out.println("]");\n  }';
  const printBoolArrayCode = 'static void printBoolArray(boolean[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) {\n      System.out.print(arr[i] ? "true" : "false");\n      if (i < arr.length - 1) System.out.print(",");\n    }\n    System.out.println("]");\n  }';

  const parseCharArrayCode = 'static char[][] parseCharArray(String s) {\n    java.util.List<String> rows = new java.util.ArrayList<>();\n    StringBuilder current = new StringBuilder();\n    for (char c : s.toCharArray()) {\n      if (c == \',\') {\n        rows.add(current.toString());\n        current = new StringBuilder();\n      } else if (c != \'[\' && c != \']\') {\n        current.append(c);\n      }\n    }\n    if (current.length() > 0) rows.add(current.toString());\n    char[][] result = new char[rows.size()][];\n    for (int i = 0; i < rows.size(); i++) {\n      String row = rows.get(i).trim();\n      result[i] = new char[row.length()];\n      for (int j = 0; j < row.length(); j++) {\n        result[i][j] = row.charAt(j);\n      }\n    }\n    return result;\n  }';

  return 'import java.util.*;\nimport java.io.*;\n\n' + solutionCode + '\n\npublic class Main {\n  ' + parseIntArrayCode + '\n\n  ' + printIntArrayCode + '\n\n  ' + printStringArrayCode + '\n\n  ' + printBoolArrayCode + '\n\n  ' + parseCharArrayCode + '\n\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    ' + readCode + '\n\n    ' + paramsCode + '\n    \n    ' + callCode + '\n  }\n}\n';
}

function wrapCpp(userCode, functionName, paramCount, input, returnTypeToken) {
  // Extract function signature to detect return and param types
  const funcSigMatch = userCode.match(/(\w+)\s+(\w+)\((.*?)\)/);
  const returnType = funcSigMatch ? funcSigMatch[1] : 'int';
  const paramTypes = funcSigMatch ? funcSigMatch[3].split(',').map(p => p.trim().split(/\s+/)[0]) : [];
  
  let readCode = '';
  let paramsCode = '';
  let callCode = '';

  if (paramCount === 1) {
    const paramType = paramTypes[0] || 'vector<int>';
    
    if (paramType === 'string' || paramType === 'String') {
      // Handle string parameter - no need to remove quotes, input is plain string
      readCode = 'string line;\n  if (!getline(cin, line)) line = "";';
      paramsCode = 'string param1 = line;';
      
      callCode = 'Solution sol;\n  auto result = sol.' + functionName + '(param1);\n  cout << result << endl;';
    } else {
      // Handle vector/array parameter
      readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }';
      
      callCode = 'Solution sol;\n  auto result = sol.' + functionName + '(param1);\n  cout << result << endl;';
    }
  } else if (paramCount === 2) {
    readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }\n  \n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch (...) { param2 = 0; }';
    callCode = 'Solution sol;\n  auto result = sol.' + functionName + '(param1, param2);\n  cout << "[";\n  for (size_t i = 0; i < result.size(); i++) {\n    cout << result[i];\n    if (i < result.size() - 1) cout << ",";\n  }\n  cout << "]" << endl;';
  } else {
    // Fallback
    readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch (...) { param2 = 0; }';
    callCode = 'Solution sol;\n  auto result = sol.' + functionName + '(param1, param2);\n  cout << "[";\n  for (size_t i = 0; i < result.size(); i++) {\n    cout << result[i];\n    if (i < result.size() - 1) cout << ",";\n  }\n  cout << "]" << endl;';
  }

  // Extract Solution class if it exists, otherwise use userCode as-is
  let solutionCode = userCode;
  if (userCode.includes('class Solution')) {
    // Solution class is provided by user
    solutionCode = userCode;
  } else {
    // Wrap userCode in Solution class
    solutionCode = 'class Solution {\npublic:\n  ' + userCode + '\n};';
  }

  return '#include <bits/stdc++.h>\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <unordered_map>\n#include <set>\n#include <unordered_set>\n#include <queue>\n#include <stack>\nusing namespace std;\n\n' + solutionCode + '\n\nint main() {\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n\n  ' + readCode + '\n  ' + (paramsCode ? paramsCode + '\n\n  ' : '') + callCode + '\n\n  return 0;\n}\n';
}

module.exports = { wrapCodeWithHarness, formatInputForStdin };
