const ALLOWED_RETURN_TYPES = new Set([
  'int','long','float','double','string','boolean',
  'int[]','long[]','float[]','double[]','string[]','boolean[]',
  'int[][]','string[][]',
  'ListNode','TreeNode'
]);

function isAllowedReturnType(t) {
  return typeof t === 'string' && ALLOWED_RETURN_TYPES.has(t);
}

function suggestForInvalidReturnType(t) {
  if (!t) return "Provide a returnType from the allowed set.";
  if (t.toLowerCase() === 'array') return "Use int[] or string[] explicitly.";
  if (t.toLowerCase() === 'list') return "Use int[] or string[] or ListNode if linked list.";
  if (t.toLowerCase() === 'object') return "Specify a concrete type (e.g., string or string[]).";
  return "Use one of: int, long, float, double, string, boolean, int[], long[], float[], double[], string[], boolean[], int[][], string[][], ListNode, TreeNode.";
}

function mapReturnType(lang, token) {
  const m = {
    javascript: {
      int: 'number', long: 'number', float: 'number', double: 'number', boolean: 'boolean', string: 'string',
      'int[]': 'number[]', 'long[]': 'number[]', 'float[]': 'number[]', 'double[]': 'number[]', 'boolean[]': 'boolean[]', 'string[]': 'string[]',
      'int[][]': 'number[][]', 'string[][]': 'string[][]',
      ListNode: 'ListNode', TreeNode: 'TreeNode'
    },
    python: {
      int: 'int', long: 'int', float: 'float', double: 'float', boolean: 'bool', string: 'str',
      'int[]': 'List[int]', 'long[]': 'List[int]', 'float[]': 'List[float]', 'double[]': 'List[float]', 'boolean[]': 'List[bool]', 'string[]': 'List[str]',
      'int[][]': 'List[List[int]]', 'string[][]': 'List[List[str]]',
      ListNode: 'ListNode', TreeNode: 'TreeNode'
    },
    java: {
      int: 'int', long: 'long', float: 'float', double: 'double', boolean: 'boolean', string: 'String',
      'int[]': 'int[]', 'long[]': 'long[]', 'float[]': 'float[]', 'double[]': 'double[]', 'boolean[]': 'boolean[]', 'string[]': 'String[]',
      'int[][]': 'int[][]', 'string[][]': 'String[][]',
      ListNode: 'ListNode', TreeNode: 'TreeNode'
    },
    cpp: {
      int: 'int', long: 'long long', float: 'float', double: 'double', boolean: 'bool', string: 'string',
      'int[]': 'vector<int>', 'long[]': 'vector<long long>', 'float[]': 'vector<float>', 'double[]': 'vector<double>', 'boolean[]': 'vector<bool>', 'string[]': 'vector<string>',
      'int[][]': 'vector<vector<int>>', 'string[][]': 'vector<vector<string>>',
      ListNode: 'ListNode*', TreeNode: 'TreeNode*'
    }
  };
  return m[lang]?.[token];
}

function lintCodeTemplateLanguages(codeTemplate) {
  const missing = [];
  for (const lang of ['javascript','python','java','cpp']) {
    if (!codeTemplate || typeof codeTemplate[lang] !== 'string' || !codeTemplate[lang].trim()) missing.push(lang);
  }
  return missing;
}

function buildSigRegexes(signature, returnTypeToken) {
  const { name, params } = signature;
  const paramList = params.join('\\s*,\\s*');
  const javaRet = mapReturnType('java', returnTypeToken) || 'int';
  const cppRet = mapReturnType('cpp', returnTypeToken) || 'int';
  return {
    js: new RegExp(`function\\s+${name}\\s*\\(\\s*${params.length ? paramList : ''}\\s*\\)`),
    jsClass: new RegExp(`class\\s+Solution[\\s\\S]*?${name}\\s*\\(\\s*${params.length ? paramList : ''}\\s*\\)`),
    py: new RegExp(`def\\s+${name}\\s*\\(\\s*${params.length ? params.join('\\s*,\\s*') : ''}\\s*\\)\\s*:`),
    java: new RegExp(`class\\s+Solution[\\s\\S]*?public\\s+${javaRet}\\s+${name}\\s*\\(`),
    cpp: new RegExp(`class\\s+Solution[\\s\\S]*?${cppRet}\\s+${name}\\s*\\(`)
  };
}

function validateProblemPayload(problem) {
  const errors = [];
  const warnings = [];

  const sig = problem.functionSignature || {};
  if (!isAllowedReturnType(sig.returnType)) {
    errors.push({ field: 'functionSignature.returnType', message: `Invalid returnType '${sig.returnType}'.`, suggestion: suggestForInvalidReturnType(sig.returnType) });
  }

  const missingLangs = lintCodeTemplateLanguages(problem.codeTemplate);
  if (missingLangs.length) {
    errors.push({ field: 'codeTemplate', message: `Missing code templates: ${missingLangs.join(', ')}`, suggestion: 'Include javascript, python, java, cpp templates.' });
  }

  // Signature matching
  if (problem.codeTemplate) {
    const re = buildSigRegexes(sig, sig.returnType);
    if (problem.codeTemplate.javascript && !(re.js.test(problem.codeTemplate.javascript) || re.jsClass.test(problem.codeTemplate.javascript))) {
      errors.push({ field: 'codeTemplate.javascript', message: 'JavaScript template signature mismatch.', suggestion: `Expected function ${sig.name}(${(sig.params||[]).join(', ')}) or class Solution { ${sig.name}(...) }.` });
    }
    if (problem.codeTemplate.python && !re.py.test(problem.codeTemplate.python)) {
      errors.push({ field: 'codeTemplate.python', message: 'Python template signature mismatch.', suggestion: `Expected def ${sig.name}(${(sig.params||[]).join(', ')}):` });
    }
    if (problem.codeTemplate.java && !re.java.test(problem.codeTemplate.java)) {
      errors.push({ field: 'codeTemplate.java', message: 'Java template signature mismatch.', suggestion: `Expected class Solution { public ${mapReturnType('java', sig.returnType)} ${sig.name}(...)}.` });
    }
    if (problem.codeTemplate.cpp && !re.cpp.test(problem.codeTemplate.cpp)) {
      errors.push({ field: 'codeTemplate.cpp', message: 'C++ template signature mismatch.', suggestion: `Expected class Solution { ${mapReturnType('cpp', sig.returnType)} ${sig.name}(...)}.` });
    }
  }

  // testCases checks
  const inputs = new Set();
  let visibleCount = 0;
  for (const [idx, tc] of (problem.testCases||[]).entries()) {
    if (!tc || typeof tc.input !== 'string') {
      errors.push({ field: `testCases[${idx}].input`, message: 'Test case input must be a string.', suggestion: 'Provide a single string per test case.' });
      continue;
    }
    if (inputs.has(tc.input)) {
      errors.push({ field: `testCases[${idx}].input`, message: 'Duplicate testCases.input.', suggestion: 'Ensure each test case input is unique.' });
    }
    inputs.add(tc.input);
    // Escaped outer quotes (e.g., \"abc\") are invalid
    if (/^\\\".*\\\"$/.test(tc.input)) {
      errors.push({ field: `testCases[${idx}].input`, message: 'Invalid testCases.input format — remove escaped outer quotes.', suggestion: 'Provide raw value without escape characters wrapping the value.' });
    } else if (/^".*"$/.test(tc.input)) {
      // Plain surrounding quotes are acceptable but discouraged
      warnings.push({ field: `testCases[${idx}].input`, message: 'Input has surrounding quotes; treated as raw string.', suggestion: 'Prefer unquoted raw value unless quotes are semantically required.' });
    }
    // expectedOutput validation
    if (tc.expectedOutput === undefined || tc.expectedOutput === null) {
      errors.push({ field: `testCases[${idx}].expectedOutput`, message: 'expectedOutput is required and cannot be omitted', suggestion: 'Provide expectedOutput as a string. Empty string is allowed for string returnType.' });
    } else if (tc.expectedOutput === '') {
      // Allow empty string only if returnType is string
      if (sig.returnType !== 'string') {
        errors.push({ field: `testCases[${idx}].expectedOutput`, message: `Empty expectedOutput not allowed for returnType '${sig.returnType}'`, suggestion: 'Use a valid literal (e.g., 0, false, [], or "[]" for arrays) or change returnType to string if appropriate.' });
      }
    }

    if (tc.isHidden === false) visibleCount++;
  }
  if (visibleCount === 0 && (problem.testCases||[]).length > 0) {
    errors.push({ field: 'testCases', message: 'At least one visible test case required.', suggestion: 'Mark at least one test with isHidden=false.' });
  }

  // title uniqueness and param count checks can be enforced at route-level with DB/context.
  return { errors, warnings };
}

// Migration helpers
function inferArrayReturnTypeFromExpected(expected) {
  try {
    const val = typeof expected === 'string' ? JSON.parse(expected) : expected;
    if (Array.isArray(val)) {
      if (val.every(v => typeof v === 'number')) return 'int[]';
      if (val.every(v => typeof v === 'boolean')) return 'boolean[]';
      if (val.every(v => typeof v === 'string')) return 'string[]';
    }
  } catch {}
  return null;
}

function migrateReturnTypeIfNeeded(problem) {
  const warnings = [];
  if (!problem?.functionSignature) return { migrated: false, warnings };
  const rt = problem.functionSignature.returnType;
  if (rt && rt.toLowerCase && rt.toLowerCase() === 'array') {
    // Try infer from first visible or first test case expectedOutput
    const tc = (problem.testCases || []).find(t => t && typeof t.expectedOutput === 'string') || null;
    const inferred = tc ? inferArrayReturnTypeFromExpected(tc.expectedOutput) : null;
    if (inferred) {
      problem.functionSignature.returnType = inferred;
      warnings.push({ field: 'functionSignature.returnType', message: `Auto-migrated returnType 'array' -> '${inferred}'.`, suggestion: 'Confirm the inferred element type is correct.' });
      return { migrated: true, warnings };
    }
    warnings.push({ field: 'functionSignature.returnType', message: "Could not infer element type for 'array' returnType.", suggestion: "Replace with int[]/string[]/boolean[] explicitly." });
  }
  return { migrated: false, warnings };
}

module.exports = {
  ALLOWED_RETURN_TYPES,
  isAllowedReturnType,
  suggestForInvalidReturnType,
  mapReturnType,
  validateProblemPayload,
  lintCodeTemplateLanguages,
  migrateReturnTypeIfNeeded,
  inferArrayReturnTypeFromExpected
};
