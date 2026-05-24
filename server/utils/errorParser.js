/**
 * Parse compiler and runtime errors from different languages
 * Format them with line numbers and clear error messages
 */

/**
 * Parse C++ compiler/linker errors
 * Example: solution.cpp:5:5: error: expected ';' before 'return'
 */
function parseCppErrors(stderr) {
  if (!stderr) return null;
  
  const lines = stderr.split('\n').filter(line => line.trim());
  const errors = [];
  let errorCount = 0;

  for (const line of lines) {
    // Match pattern: file.cpp:line:col: error/warning: message
    const match = line.match(/^([^:]+):(\d+):(\d+):\s*(error|warning):\s*(.+)$/);
    if (match) {
      errorCount++;
      errors.push({
        type: match[4], // 'error' or 'warning'
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        message: match[5],
        fullLine: line
      });
    }
  }

  if (errors.length === 0) return null;

  // Return formatted error string
  return formatErrors(errors, errorCount);
}

/**
 * Parse Python runtime/syntax errors
 * Example: File "/code/solution.py", line 5, in <module>
 *   result = x +
 *          ^
 * SyntaxError: invalid syntax
 */
function parsePythonErrors(stderr) {
  if (!stderr) return null;

  const lines = stderr.split('\n');
  const errors = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    
    // Match traceback file reference: File "...", line N, in ...
    const fileMatch = line.match(/File "([^"]+)", line (\d+)/);
    if (fileMatch) {
      const lineNum = parseInt(fileMatch[2]);
      let errorType = 'Error';
      let errorMessage = '';
      let codeLine = '';
      let caretLine = '';

      // Look for the error type and message at the end
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        
        // Check for error message line (e.g., "SyntaxError: invalid syntax")
        const errorMatch = nextLine.match(/^(\w+(?:Error|Warning|Exception)):\s*(.+)$/);
        if (errorMatch) {
          errorType = errorMatch[1];
          errorMessage = errorMatch[2];
          break;
        }
        
        // Collect code lines
        if (!nextLine.match(/^(\w+(?:Error|Warning|Exception)):/)) {
          codeLine = codeLine || nextLine;
          if (nextLine.includes('^')) {
            caretLine = nextLine;
          }
        }
        j++;
      }

      errors.push({
        type: 'error',
        line: lineNum,
        message: `${errorType}: ${errorMessage}`,
        codeLine: codeLine.trim(),
        caretLine: caretLine
      });
      
      i = j + 1;
    } else {
      i++;
    }
  }

  if (errors.length === 0) return null;
  return formatPythonErrors(errors);
}

/**
 * Parse Java compiler errors
 * Example: Main.java:5: error: reached end of file while parsing
 */
function parseJavaErrors(stderr) {
  if (!stderr) return null;

  const lines = stderr.split('\n').filter(line => line.trim());
  const errors = [];

  for (const line of lines) {
    // Match: Main.java:5: error: message
    const match = line.match(/^([^:]+):(\d+):\s*(error|warning):\s*(.+)$/);
    if (match) {
      errors.push({
        type: match[3],
        line: parseInt(match[2]),
        message: match[4],
        fullLine: line
      });
    }
  }

  // Handle Java runtime exceptions, e.g.:
  // Exception in thread "main" java.util.NoSuchElementException
  //   at Main.main(Main.java:5)
  if (errors.length === 0) {
    let exceptionLine = '';
    let mainLine = 0;

    for (const line of lines) {
      if (!exceptionLine && /^Exception in thread|^\w+(?:\.\w+)*(?:Exception|Error):/.test(line)) {
        exceptionLine = line.trim();
      }

      const mainMatch = line.match(/\((?:Main|Solution)\.java:(\d+)\)/);
      if (mainMatch) {
        mainLine = parseInt(mainMatch[1]);
        break;
      }
    }

    if (exceptionLine) {
      const lineLabel = mainLine > 0 ? `Line ${mainLine}: ` : '';
      return `${lineLabel}${exceptionLine}`;
    }

    return null;
  }

  return formatErrors(errors, errors.length);
}

/**
 * Parse JavaScript/Node.js runtime errors
 * Example: ReferenceError: x is not defined
 */
function parseJavaScriptErrors(stderr) {
  if (!stderr) return null;

  const lines = stderr.split('\n').filter(line => line.trim());
  const errors = [];

  for (const line of lines) {
    // Check for standard error format
    if (line.includes('Error:') || line.includes('TypeError:') || line.includes('SyntaxError:')) {
      // Extract line number if available
      const lineMatch = line.match(/at\s+[^:]*:(\d+):/);
      const lineNum = lineMatch ? parseInt(lineMatch[1]) : 0;

      errors.push({
        type: line.split(':')[0] || 'Error',
        line: lineNum,
        message: line,
        fullLine: line
      });
    }
  }

  if (errors.length === 0) return null;
  return formatErrors(errors, errors.length);
}

/**
 * Format errors in a clean, readable way with line numbers
 */
function formatErrors(errors, totalCount) {
  let formatted = '';
  
  for (const error of errors) {
    formatted += `Line ${error.line}: ${error.type}: ${error.message}\n`;
  }

  formatted += `\n${totalCount} error${totalCount !== 1 ? 's' : ''} found`;
  return formatted;
}

/**
 * Format Python errors with better visualization
 */
function formatPythonErrors(errors) {
  let formatted = '';
  
  for (const error of errors) {
    formatted += `Line ${error.line}: ${error.message}\n`;
    if (error.codeLine) {
      formatted += `    ${error.codeLine}\n`;
    }
    if (error.caretLine) {
      formatted += `    ${error.caretLine}\n`;
    }
  }

  formatted += `\n${errors.length} error${errors.length !== 1 ? 's' : ''} found`;
  return formatted;
}

/**
 * Main function to parse stderr and return user-friendly error message
 */
function parseErrors(stderr, language) {
  if (!stderr || typeof stderr !== 'string') {
    return null;
  }

  const lang = (language || '').toLowerCase();

  if (lang === 'cpp' || lang === 'c++') {
    return parseCppErrors(stderr);
  } else if (lang === 'python' || lang === 'py') {
    return parsePythonErrors(stderr);
  } else if (lang === 'java') {
    return parseJavaErrors(stderr);
  } else if (lang === 'javascript' || lang === 'js' || lang === 'node') {
    return parseJavaScriptErrors(stderr);
  }

  // Fallback: return raw stderr if we can't parse it
  return stderr.split('\n').slice(0, 10).join('\n'); // Show first 10 lines
}

/**
 * Format error output for display in UI
 * Returns object with structured error info
 */
function formatErrorForDisplay(stderr, language, userCode = '') {
  const parsedError = parseErrors(stderr, language);
  
  if (!parsedError) {
    // Can't structured-parse the stderr — show the raw text so the user sees the actual error
    return {
      success: false,
      hasError: true,
      errorMessage: stderr || 'No error output captured',
      fullError: stderr || ''
    };
  }

  return {
    success: false,
    hasError: true,
    errorMessage: parsedError,
    fullError: stderr,
    language,
    errorType: extractErrorType(stderr),
    lineNumbers: extractLineNumbers(parsedError)
  };
}

/**
 * Extract error type (SyntaxError, CompileError, etc.)
 */
function extractErrorType(stderr) {
  if (!stderr) return 'Unknown Error';
  
  const match = stderr.match(/(\w+(?:Error|Exception|Warning)):/);
  return match ? match[1] : 'Error';
}

/**
 * Extract line numbers from error message
 */
function extractLineNumbers(errorMessage) {
  if (!errorMessage) return [];
  
  const matches = errorMessage.match(/Line (\d+):/g);
  return matches ? matches.map(m => parseInt(m.match(/\d+/)[0])) : [];
}

module.exports = {
  parseErrors,
  formatErrorForDisplay,
  parseCppErrors,
  parsePythonErrors,
  parseJavaErrors,
  parseJavaScriptErrors
};
