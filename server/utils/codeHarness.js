/**
 * LeetCode-style test harness
 * Wraps user function code with test runner that calls the function with test inputs
 * Supports dynamic function signatures (different param counts, types, return types)
 */

const { mapReturnType } = require('./validator');

function wrapCodeWithHarness(userCode, language, testCase, questionMetadata = {}) {
  const funcSig = questionMetadata?.functionSignature || { name: 'solution', params: [] };
  const functionName = funcSig.name || 'solution';
  const paramCount = (funcSig.params || []).length || 1;
  const input = testCase.input || '';
  const returnTypeToken = funcSig.returnType || 'int';

  switch (language) {
    case 'javascript': return wrapJavaScript(userCode, functionName, paramCount, input, returnTypeToken);
    case 'python':     return wrapPython(userCode, functionName, paramCount, input, returnTypeToken);
    case 'java':       return wrapJava(userCode, functionName, paramCount, input, returnTypeToken);
    case 'cpp':        return wrapCpp(userCode, functionName, paramCount, input, returnTypeToken);
    default:           return userCode;
  }
}

/* ─── Input helpers ──────────────────────────────────────────────────────── */

function formatInputForStdin(input, paramCount) {
  return parseInputLines(input, paramCount).join('\n');
}

function parseInputLines(input, paramCount) {
  const trimmed = input.trim();
  if (trimmed.includes('\n')) {
    const lines = trimmed.split(/\r?\n/).filter(l => l.trim());
    return lines.slice(0, paramCount).map(l => l.trim());
  }
  if (paramCount === 2) {
    const match = trimmed.match(/^(\[.*?\]|\{.*?\})\s*,\s*(.+)$/);
    if (match) return [match[1].trim(), match[2].trim()];
  }
  return splitSmartComma(trimmed, paramCount).map(p => p.trim());
}

function splitSmartComma(str, expectedParts) {
  const parts = [];
  let current = '';
  let depth = 0;
  let inString = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i - 1] !== '\\') inString = !inString;
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

/* ─── JavaScript ─────────────────────────────────────────────────────────── */

function wrapJavaScript(userCode, functionName, paramCount, input, returnTypeToken) {
  const callsViaSolution = /class\s+Solution/.test(userCode);

  // Generic param parser: works for any paramCount
  const paramDecls = [];
  const paramArgs  = [];
  for (let i = 1; i <= paramCount; i++) {
    const idx = i - 1;
    const def = i === 1 ? "'[]'" : "'0'";
    paramDecls.push(
      `const param${i} = (lines[${idx}] != null && lines[${idx}].startsWith('"'))` +
      ` ? lines[${idx}].replace(/^"|"$/g, '')` +
      ` : (() => { try { return JSON.parse(lines[${idx}] || ${def}); } catch(e) { return lines[${idx}] || ''; } })();`
    );
    paramArgs.push(`param${i}`);
  }
  const argList  = paramArgs.join(', ');
  const callExpr = callsViaSolution
    ? `(new Solution()).${functionName}(${argList})`
    : `${functionName}(${argList})`;

  return `
${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
const lines = input.length ? input.split(/\\r?\\n/) : [];

${paramDecls.join('\n')}

const result = ${callExpr};

if (${JSON.stringify(returnTypeToken)} === 'string') {
  process.stdout.write(String(result == null ? '' : result));
} else {
  console.log(JSON.stringify(result));
}
`;
}

/* ─── Python ─────────────────────────────────────────────────────────────── */

function wrapPython(userCode, functionName, paramCount, input, returnTypeToken) {
  const callsViaSolution = /class\s+Solution/.test(userCode);

  // Universal safe parser helper (emitted once into every Python harness)
  const parseHelper = `
def _parse_param(line, default=None):
    if line is None:
        return default
    if line.startswith('"') and line.endswith('"'):
        return line[1:-1]   # quoted string
    try:
        return json.loads(line)
    except Exception:
        return line         # plain unquoted string e.g. "anagram"
`;

  const paramDecls = [];
  const paramArgs  = [];
  for (let i = 1; i <= paramCount; i++) {
    paramDecls.push(`param${i} = _parse_param(data[${i - 1}], []) if len(data) > ${i - 1} else []`);
    paramArgs.push(`param${i}`);
  }
  const argList = paramArgs.join(', ');
  const callCode = callsViaSolution
    ? `sol = Solution()\nresult = sol.${functionName}(${argList})`
    : `result = ${functionName}(${argList})`;

  return `
${userCode}

import json
import sys

data = sys.stdin.read().splitlines()

${parseHelper}
${paramDecls.join('\n')}

${callCode}

if ${JSON.stringify(returnTypeToken)} == 'string':
    sys.stdout.write(str(result) if result is not None else '')
else:
    print(json.dumps(result, separators=(',', ':')))
`;
}

/* ─── Java ───────────────────────────────────────────────────────────────── */

function wrapJava(userCode, functionName, paramCount, input, returnTypeToken) {
  // Parse param types from user's function signature
  const funcSigStr = userCode.match(/public\s+[\w<>\[\]]+\s+\w+\((.*?)\)/)?.[1] || '';
  const paramDeclarations = funcSigStr.split(',').map(p => p.trim());

  const getParamType = (index) => {
    if (paramDeclarations[index]) {
      return paramDeclarations[index].split(/\s+/)[0];
    }
    return 'int[]';
  };

  const javaReturnType = mapReturnType('java', returnTypeToken) || 'int';

  // Build the print/call statement based on returnType
  const buildCall = (args) => {
    const call = `var result = new Solution().${functionName}(${args});`;
    if (returnTypeToken === 'string[]')  return call + '\n    printStringArray(result);';
    if (returnTypeToken === 'boolean[]') return call + '\n    printBoolArray(result);';
    if (javaReturnType.includes('[]'))  return call + '\n    printIntArray(result);';
    return call + '\n    System.out.println(result);';
  };

  let readCode  = '';
  let paramsCode = '';
  let callCode  = '';

  if (paramCount === 1) {
    const p1 = getParamType(0);
    const def1 = p1.includes('[]') ? '[]' : (p1 === 'String' ? '' : '0');
    readCode = `String line1 = br.readLine();\n    if (line1 == null) line1 = "${def1}";`;
    if (p1.includes('[]')) {
      paramsCode = 'int[] param1 = parseIntArray(line1);';
    } else if (p1 === 'int') {
      paramsCode = 'int param1 = Integer.parseInt(line1.trim());';
    } else {
      paramsCode = 'String param1 = line1;';
    }
    callCode = buildCall('param1');

  } else if (paramCount === 2) {
    const p1 = getParamType(0);
    const p2 = getParamType(1);
    const def1 = p1.includes('[]') ? '[]' : '0';
    const def2 = p2.includes('[]') ? '[]' : '0';
    readCode = `String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "${def1}";\n    if (line2 == null) line2 = "${def2}";`;

    if (p1.includes('[]') && p2.includes('[]')) {
      // Both arrays (e.g. validateStackSequences)
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int[] param2 = parseIntArray(line2);';
    } else if (p1.includes('[]') && p2 === 'int') {
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
    } else if (p1.includes('[][]') && p2 === 'String') {
      paramsCode = 'char[][] param1 = parseCharArray(line1);\n    String param2 = line2;';
    } else if (p1 === 'String' && p2 === 'String') {
      paramsCode = 'String param1 = line1;\n    String param2 = line2;';
    } else {
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
    }
    callCode = buildCall('param1, param2');

  } else if (paramCount === 3) {
    readCode  = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    String line3 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";\n    if (line3 == null) line3 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());\n    int param3 = Integer.parseInt(line3.trim());';
    callCode  = buildCall('param1, param2, param3');

  } else {
    readCode  = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
    callCode  = buildCall('param1, param2');
  }

  const solutionCode = userCode.includes('class Solution') ? userCode : 'class Solution {\n  ' + userCode + '\n}';

  const parseIntArrayCode   = 'static int[] parseIntArray(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) { if (c != \'[\' && c != \']\') sb.append(c); }\n    String numsStr = sb.toString();\n    if (numsStr.isEmpty()) return new int[0];\n    String[] numStrs = numsStr.split(",");\n    int[] nums = new int[numStrs.length];\n    for (int i = 0; i < numStrs.length; i++) { if (!numStrs[i].trim().isEmpty()) nums[i] = Integer.parseInt(numStrs[i].trim()); }\n    return nums;\n  }';
  const printIntArrayCode   = 'static void printIntArray(int[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) { System.out.print(arr[i]); if (i < arr.length - 1) System.out.print(","); }\n    System.out.println("]");\n  }';
  const printStringArrayCode = 'static void printStringArray(String[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) { System.out.print(arr[i] == null ? "null" : arr[i]); if (i < arr.length - 1) System.out.print(","); }\n    System.out.println("]");\n  }';
  const printBoolArrayCode  = 'static void printBoolArray(boolean[] arr) {\n    System.out.print("[");\n    for (int i = 0; i < arr.length; i++) { System.out.print(arr[i] ? "true" : "false"); if (i < arr.length - 1) System.out.print(","); }\n    System.out.println("]");\n  }';
  const parseCharArrayCode  = 'static char[][] parseCharArray(String s) {\n    java.util.List<String> rows = new java.util.ArrayList<>();\n    StringBuilder cur = new StringBuilder();\n    for (char c : s.toCharArray()) {\n      if (c == \',\') { rows.add(cur.toString()); cur = new StringBuilder(); }\n      else if (c != \'[\' && c != \']\') cur.append(c);\n    }\n    if (cur.length() > 0) rows.add(cur.toString());\n    char[][] result = new char[rows.size()][];\n    for (int i = 0; i < rows.size(); i++) { String row = rows.get(i).trim(); result[i] = new char[row.length()]; for (int j = 0; j < row.length(); j++) result[i][j] = row.charAt(j); }\n    return result;\n  }';

  return (
    'import java.util.*;\nimport java.io.*;\n\n' +
    solutionCode +
    '\n\npublic class Main {\n  ' +
    parseIntArrayCode + '\n\n  ' +
    printIntArrayCode + '\n\n  ' +
    printStringArrayCode + '\n\n  ' +
    printBoolArrayCode + '\n\n  ' +
    parseCharArrayCode + '\n\n  ' +
    'public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    ' +
    readCode + '\n\n    ' +
    paramsCode + '\n\n    ' +
    callCode + '\n  }\n}\n'
  );
}

/* ─── C++ ────────────────────────────────────────────────────────────────── */

function wrapCpp(userCode, functionName, paramCount, input, returnTypeToken) {
  // Extract return type and param types from user's function signature
  const sigMatch  = userCode.match(/(\w+)\s+\w+\s*\(([\s\S]*?)\)\s*\{/);
  const returnType = sigMatch ? sigMatch[1] : 'int';
  const rawParams  = sigMatch ? sigMatch[2].split(',').map(p => p.trim()) : [];

  // Detect the base C++ type keyword for each param slot
  const getP = (i) => {
    const raw = (rawParams[i] || '').toLowerCase();
    if (raw.includes('vector')) return 'vector';
    if (raw.includes('string')) return 'string';
    return 'int';
  };

  // Helper: build a vector<int> reader from stdin into `varName`
  const readVecSnippet = (varName) =>
    `if (!getline(cin, line)) line = "[]";\n` +
    `  vector<int> ${varName};\n` +
    `  { string inner = line.size() >= 2 ? line.substr(1, line.size()-2) : "";\n` +
    `    if (!inner.empty()) { stringstream ss(inner); string tok;\n` +
    `      while (getline(ss, tok, ',')) if (!tok.empty()) ${varName}.push_back(stoi(tok)); } }`;

  // Helper: build output based on C++ return type
  const outSnippet = (v = 'result') => {
    if (returnType === 'bool')
      return `cout << (${v} ? "true" : "false") << "\\n";`;
    if (returnType === 'string' || returnType === 'String')
      return `cout << ${v} << "\\n";`;
    if (returnType === 'vector' || (sigMatch && sigMatch[1].startsWith('vector')))
      return `cout << "["; for (size_t _i=0;_i<${v}.size();_i++){cout<<${v}[_i];if(_i+1<${v}.size())cout<<",";} cout<<"]\\n";`;
    return `cout << ${v} << "\\n";`;
  };

  let readCode  = '';
  let callCode  = '';

  if (paramCount === 1) {
    const p1 = getP(0);
    if (p1 === 'string') {
      readCode = 'string line;\n  if (!getline(cin, line)) line = "";\n  string param1 = line;';
    } else {
      readCode = 'string line;\n  ' + readVecSnippet('param1');
    }
    callCode = `Solution sol;\n  auto result = sol.${functionName}(param1);\n  ${outSnippet()}`;

  } else if (paramCount === 2) {
    const p1 = getP(0);
    const p2 = getP(1);

    if (p1 === 'vector' && p2 === 'vector') {
      // Both array params
      readCode = 'string line;\n  ' + readVecSnippet('param1') + '\n  ' + readVecSnippet('param2');
    } else if (p1 === 'vector' && p2 === 'string') {
      readCode = 'string line;\n  ' + readVecSnippet('param1') + '\n  string param2;\n  if (!getline(cin, param2)) param2 = "";';
    } else if (p1 === 'vector') {
      // param2 is int
      readCode = 'string line;\n  ' + readVecSnippet('param1') + '\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch(...) { param2 = 0; }';
    } else {
      readCode = 'string line;\n  if (!getline(cin, line)) line = "0";\n  int param1 = 0;\n  try { param1 = stoi(line); } catch(...) { param1 = 0; }\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch(...) { param2 = 0; }';
    }
    callCode = `Solution sol;\n  auto result = sol.${functionName}(param1, param2);\n  ${outSnippet()}`;

  } else if (paramCount === 3) {
    readCode =
      'string line;\n  ' + readVecSnippet('param1') +
      '\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0; try { param2 = stoi(line); } catch(...) {}\n' +
      '  if (!getline(cin, line)) line = "0";\n  int param3 = 0; try { param3 = stoi(line); } catch(...) {}';
    callCode = `Solution sol;\n  auto result = sol.${functionName}(param1, param2, param3);\n  ${outSnippet()}`;

  } else {
    readCode = 'string line;\n  ' + readVecSnippet('param1') + '\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch(...) {}';
    callCode = `Solution sol;\n  auto result = sol.${functionName}(param1, param2);\n  ${outSnippet()}`;
  }

  const solutionCode = userCode.includes('class Solution') ? userCode : 'class Solution {\npublic:\n  ' + userCode + '\n};';

  return (
    '#include <bits/stdc++.h>\n' +
    '#include <iostream>\n' +
    '#include <vector>\n' +
    '#include <sstream>\n' +
    '#include <string>\n' +
    '#include <algorithm>\n' +
    '#include <map>\n' +
    '#include <unordered_map>\n' +
    '#include <set>\n' +
    '#include <unordered_set>\n' +
    '#include <queue>\n' +
    '#include <stack>\n' +
    'using namespace std;\n\n' +
    solutionCode +
    '\n\nint main() {\n' +
    '  ios::sync_with_stdio(false);\n' +
    '  cin.tie(nullptr);\n\n  ' +
    readCode +
    '\n\n  ' + callCode +
    '\n\n  return 0;\n}\n'
  );
}

module.exports = { wrapCodeWithHarness, formatInputForStdin };
