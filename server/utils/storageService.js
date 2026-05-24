const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Storage interface: local disk for dev, S3/GCS for production
// Switch via env var STORAGE_MODE=local|s3

const STORAGE_MODE = process.env.STORAGE_MODE || 'local';
const LOCAL_STORAGE_ROOT = path.join(__dirname, '../../storage');

// Extension mapping for languages
const LANG_EXTENSIONS = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  cpp: 'cpp'
};

/**
 * Save code to storage
 * @param {string} userId 
 * @param {string} problemId 
 * @param {string} submissionId 
 * @param {string} code 
 * @param {string} language 
 * @returns {Promise<string>} storageKey
 */
async function saveCode(userId, problemId, submissionId, code, language) {
  const ext = LANG_EXTENSIONS[language] || 'txt';
  const storageKey = `submissions/${userId}/${problemId}/${submissionId}.${ext}`;

  if (STORAGE_MODE === 'local') {
    const fullPath = path.join(LOCAL_STORAGE_ROOT, storageKey);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, code, 'utf8');
    return storageKey;
  }

  // TODO: S3/GCS implementation
  // For S3: use AWS SDK putObject with Key=storageKey, Body=code
  // For GCS: use @google-cloud/storage bucket.file(storageKey).save(code)
  throw new Error('S3/GCS not implemented yet');
}

/**
 * Get code from storage (returns raw code string)
 * @param {string} storageKey 
 * @returns {Promise<string>} code
 */
async function getCode(storageKey) {
  if (STORAGE_MODE === 'local') {
    const fullPath = path.join(LOCAL_STORAGE_ROOT, storageKey);
    const code = await fs.readFile(fullPath, 'utf8');
    return code;
  }

  // TODO: S3/GCS implementation
  // For S3: use AWS SDK getObject and stream to string
  // For GCS: use bucket.file(storageKey).download()
  throw new Error('S3/GCS not implemented yet');
}

/**
 * Generate a short-lived presigned URL for code retrieval
 * For local dev, we return a special token that the endpoint validates
 * For S3/GCS, generate actual presigned URL (5 min expiry)
 * @param {string} storageKey 
 * @param {string} userId - for local authZ
 * @returns {Promise<string>} signedUrl or local token
 */
async function generatePresignedUrl(storageKey, userId) {
  if (STORAGE_MODE === 'local') {
    // Generate a short-lived token (5 min) with HMAC
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    const payload = `${storageKey}:${userId}:${expiry}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/api/submissions/view/${token}`;
  }

  // TODO: S3/GCS presigned URL generation
  // For S3: use s3.getSignedUrlPromise('getObject', { Bucket, Key, Expires: 300 })
  // For GCS: use bucket.file(storageKey).getSignedUrl({ action: 'read', expires: Date.now() + 5*60*1000 })
  throw new Error('S3/GCS not implemented yet');
}

/**
 * Verify and decode local presigned token
 * @param {string} token 
 * @returns {{ storageKey: string, userId: string } | null}
 */
function verifyLocalToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return null;
    const [storageKey, userId, expiry, signature] = parts;
    
    // Check expiry
    if (Date.now() > parseInt(expiry, 10)) return null;
    
    // Verify signature
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = `${storageKey}:${userId}:${expiry}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (signature !== expectedSig) return null;
    
    return { storageKey, userId };
  } catch {
    return null;
  }
}

module.exports = {
  saveCode,
  getCode,
  generatePresignedUrl,
  verifyLocalToken,
  STORAGE_MODE
};
