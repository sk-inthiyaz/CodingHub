const assert = require('assert');
const { validateProblemPayload } = require('../utils/validator');

function testStreakStringEmptyExpected() {
  const q = {
    title: 'Empty String Output',
    description: 'Return empty string',
    functionSignature: { name: 'foo', params: ['s'], returnType: 'string' },
    codeTemplate: {
      javascript: 'function foo(s){return \"\"; }',
      python: 'def foo(s):\n    return ""\n',
      java: 'class Solution { public String foo(String s){ return \"\"; } }',
      cpp: 'class Solution { public: string foo(string s){ return \"\"; } };'
    },
    testCases: [ { input: '"abc"', expectedOutput: '', isHidden: false } ]
  };
  const { errors } = validateProblemPayload(q);
  if (errors.length) {
    console.error('Validation errors:', errors);
  }
  assert.strictEqual(errors.length, 0, 'Expected no errors for empty string expectedOutput when returnType=string');
}

function testPracticeStringEmptyExpected() {
  const p = {
    title: 'Practice Empty String Output',
    description: 'Return empty',
    topic: 'Strings',
    difficulty: 'Easy',
    functionSignature: { name: 'bar', params: ['s'], returnType: 'string' },
    codeTemplate: {
      javascript: 'function bar(s){return \"\"; }',
      python: 'def bar(s):\n    return ""\n',
      java: 'class Solution { public String bar(String s){ return \"\"; } }',
      cpp: 'class Solution { public: string bar(string s){ return \"\"; } };'
    },
    testCases: [ { input: '"x"', expectedOutput: '', isHidden: false } ]
  };
  const { errors } = validateProblemPayload(p);
  if (errors.length) {
    console.error('Validation errors:', errors);
  }
  assert.strictEqual(errors.length, 0, 'Expected no errors for practice empty string expectedOutput when returnType=string');
}

try {
  testStreakStringEmptyExpected();
  testPracticeStringEmptyExpected();
  console.log('OK: regression-empty-expected');
} catch (e) {
  console.error('FAILED:', e.message);
  process.exit(1);
}
