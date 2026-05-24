const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Supported languages and their Docker images/commands
const languageConfigs = {
  javascript: {
    image: 'node:20-alpine',
    extension: 'js',
    getCmd: (filename) => `node /code/${filename}`
  },
  python: {
    image: 'python:3.11-alpine',
    extension: 'py',
    getCmd: (filename) => `python /code/${filename}`
  },
  java: {
    image: 'eclipse-temurin:17-alpine',
    extension: 'java',
    // Compile with javac, then run. Both steps needed.
    getCmd: (filename) => `javac /code/${filename} && java -cp /code Main`
  },
  cpp: {
    image: 'gcc:latest',
    extension: 'cpp',
    getCmd: (filename, outfile) => `g++ /code/${filename} -o /code/${outfile} && /code/${outfile}`
  }
};

function normalizeLanguage(lang) {
  if (!lang) return 'javascript';
  const l = String(lang).toLowerCase().trim();
  if (l === 'c++' || l === 'cplus' || l === 'cplusplus') return 'cpp';
  if (l === 'js' || l === 'node' || l === 'javascript') return 'javascript';
  if (l === 'py' || l === 'python') return 'python';
  if (l === 'java') return 'java';
  if (l === 'cpp' || l === 'g++') return 'cpp';
  return l;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function normalizeStdinInput(input) {
  if (input === undefined || input === null) return '';
  const raw = (typeof input === 'string') ? input : JSON.stringify(input);
  // Users often type "5\\n10" in a single-line input box — convert escaped sequences
  return raw
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
}

/**
 * Runs code in a Docker container for the given language and input.
 * Uses execFile (not exec) to bypass the Windows cmd.exe shell entirely.
 * Docker args are passed as a proper array — no shell escaping needed.
 *
 * @param {string} code - The code to execute
 * @param {string} language - One of 'javascript', 'python', 'java', 'cpp'
 * @param {string} input - stdin to pipe into the container
 * @param {number} [timeout=10] - Timeout in seconds (passed to BusyBox timeout inside container)
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
async function runCodeInDocker(code, language, input, timeout = 10) {
  const lang = normalizeLanguage(language);
  if (!languageConfigs[lang]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  const config = languageConfigs[lang];

  const tempDir = path.join(__dirname, '../../temp_code');
  ensureDir(tempDir);

  // Use unique subdirectory per execution to prevent concurrency issues (especially Java)
  const execId = uuidv4();
  const execDir = path.join(tempDir, execId);
  ensureDir(execDir);

  // Java: class name must match filename → always 'Main.java'
  // C++: use unique filenames to avoid concurrent execution conflicts
  const baseName = (lang === 'java') ? 'Main' : execId;
  const filename = `${baseName}.${config.extension}`;
  const outfileName = (lang === 'cpp') ? `${baseName}.out` : null;
  const filepath = path.join(execDir, filename);

  // Write user code to temp file
  fs.writeFileSync(filepath, code, 'utf8');

  // Build the shell command to run INSIDE the container.
  // This is a single string passed as the argument to `sh -c`.
  // No Windows-side escaping needed because execFile passes it directly as a Docker arg.
  const innerCmd = (lang === 'cpp')
    ? config.getCmd(filename, outfileName)
    : config.getCmd(filename);

  // Wrap with timeout (BusyBox/Alpine compatible numeric seconds, no suffix)
  const timedCmd = `timeout ${timeout} sh -c "${innerCmd.replace(/"/g, '\\"')}"`;

  // Build docker args array — execFile receives these directly, no shell parsing
  const dockerArgs = [
    'run', '--rm', '-i',
    '--network', 'none',
    '-m', '128m',
    '--cpus', '0.5',
    '-v', `${execDir}:/code`,
    config.image,
    'sh', '-c', timedCmd
  ];

  console.log('[dockerRunner] docker', dockerArgs.join(' '));

  return new Promise((resolve) => {
    // Node-level timeout = container timeout + 5s grace period
    const execTimeout = (timeout + 5) * 1000;

    const child = execFile('docker', dockerArgs, {
      maxBuffer: 1024 * 1024,
      timeout: execTimeout
    }, (error, stdout, stderr) => {
      // Cleanup entire execution directory
      try { fs.rmSync(execDir, { recursive: true, force: true }); } catch {}

      // error.code = numeric exit code, or null/undefined if killed by signal
      const exitCode = error
        ? (typeof error.code === 'number' ? error.code : 1)
        : 0;

      console.log('[dockerRunner] exitCode:', exitCode, '| stderr:', stderr?.slice(0, 200));

      resolve({
        stdout: (stdout || '').trim(),
        stderr: (stderr || '').trim(),
        exitCode
      });
    });

    // Always close stdin so the subprocess receives EOF immediately.
    // Without this, Scanner/input()/cin will block forever waiting for more data.
    const inputStr = normalizeStdinInput(input);
    if (inputStr.length > 0) {
      child.stdin.write(inputStr.endsWith('\n') ? inputStr : inputStr + '\n');
    }
    child.stdin.end();
  });
}

module.exports = { runCodeInDocker };
