# Submission Storage & View Code Feature

## Overview
Stores only **accepted** submissions with secure code retrieval. Users can view their accepted code via a "View Code" button.

## Architecture

### Database Schema
**Submission Model** (`server/models/Submission.js`):
- `_id`: UUID (auto-generated)
- `userId`: ObjectId ref to User
- `problemId`: ObjectId ref to StreakQuestion
- `language`: enum [javascript, python, java, cpp]
- `status`: enum [accepted, rejected] (only 'accepted' stored)
- `runtimeMs`: optional number
- `storageKey`: path to code file
- `createdAt`: timestamp
- **Indexes**: (userId, problemId, createdAt DESC), (userId, status, createdAt DESC)

### Storage Service
**File**: `server/utils/storageService.js`

**Modes**:
- **Local (dev)**: Saves to `server/storage/submissions/{userId}/{problemId}/{submissionId}.{ext}`
- **S3/GCS (prod)**: TODO - use AWS SDK or @google-cloud/storage

**Key Functions**:
- `saveCode(userId, problemId, submissionId, code, language)`: Saves code, returns storageKey
- `getCode(storageKey)`: Retrieves code text
- `generatePresignedUrl(storageKey, userId)`: 
  - Local: generates HMAC-signed token (5 min expiry)
  - S3/GCS: generates presigned GET URL (5 min expiry)
- `verifyLocalToken(token)`: Validates local token and returns {storageKey, userId}

### Backend Endpoints

**Routes** (`server/routes/submissionRoutes.js`):

1. **GET /api/problems/:problemId/submissions/latest?status=accepted**
   - Auth required
   - Returns latest accepted submission metadata for authenticated user
   - Response: `{ _id, language, status, createdAt, runtimeMs }`

2. **GET /api/submissions/:submissionId/code**
   - Auth required
   - AuthZ: validates submission.userId === req.user.id
   - Generates presigned URL (5 min expiry)
   - Response: `{ signedUrl, language, expiresIn: 300 }`

3. **GET /api/submissions/view/:token** (Local dev only)
   - No auth (token validated)
   - Decodes token, verifies expiry and signature
   - Returns code as `text/plain`

### Submission Flow

**On Submit (Accept)**:
1. User submits code via `/api/streak/submit`
2. Backend runs all tests
3. If all pass (status='passed'):
   - Generate submissionId UUID
   - Save code to storage: `submissions/{userId}/{problemId}/{submissionId}.{ext}`
   - Create Submission doc in DB
   - Update user streak and completedQuestions
   - Return success with `submissionId`

**View Code Flow**:
1. User clicks "View Code" on solved question
2. Frontend calls `/api/problems/:problemId/submissions/latest?status=accepted`
3. Gets submission metadata
4. Frontend calls `/api/submissions/:submissionId/code`
5. Gets `signedUrl` (local token URL or S3 presigned)
6. Frontend fetches code from `signedUrl`
7. Renders in Monaco editor (read-only, dark theme)

## Frontend Integration

**Component**: `client/src/components/StreakQuestion/StreakPage.jsx`

**Features**:
- Shows top 3 streakers in sidebar
- Shows latest 3 solved questions below streakers
- Each solved question has "View Code" button
- Modal with Monaco editor displays accepted code
- Language mapped for syntax highlighting (cpp → C++)

**State**:
- `viewingCode`: `{ code, language, title }` or null
- `loadingCode`: boolean

**Modal Styling**: Dark overlay, Monaco editor (500px height), close button

## Security

- **AuthZ**: submission.userId must match req.user.id
- **Short-lived URLs**: 5 min expiry
- **Token signing**: HMAC SHA256 with JWT_SECRET (local mode)
- **No permanent URLs**: presigned URLs generated per request
- **Rate limiting**: Optional (TODO)

## Configuration

**Environment Variables**:
- `STORAGE_MODE`: 'local' (default) or 's3'
- `JWT_SECRET`: Used for local token signing
- (Future) `AWS_BUCKET`, `AWS_REGION`, `GCS_BUCKET` for cloud storage

## Future Enhancements

1. **S3/GCS Implementation**:
   - AWS SDK v3: use `PutObjectCommand`, `GetObjectCommand`, `getSignedUrl`
   - GCS: use `@google-cloud/storage` with `bucket.file().save()` and `getSignedUrl()`

2. **Runtime Tracking**:
   - Measure execution time in Docker runner
   - Store in `runtimeMs` field
   - Display on View Code modal

3. **Rate Limiting**:
   - Limit code view requests per user (e.g., 50/hour)
   - Prevent abuse of presigned URL generation

4. **Diff View**:
   - Compare multiple submissions
   - Show improvements over time

5. **Download**:
   - Allow users to download their accepted code

## Testing

**Local Dev**:
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm start
```

1. Solve a problem and get accepted
2. Go to `/streak` page
3. Click "View Code" on a solved question
4. Verify modal opens with code displayed in Monaco editor

**Check Storage**:
```bash
ls server/storage/submissions/
# Should see: {userId}/{problemId}/{submissionId}.{ext}
```

**Check DB**:
```javascript
// In MongoDB shell or Compass
db.submissions.find({ status: 'accepted' }).sort({ createdAt: -1 })
```

## Notes

- Only **accepted** submissions are stored (no failed attempts)
- Each problem can have multiple accepted submissions (tracked by timestamp)
- Latest submission is shown via `sort({ createdAt: -1 }).limit(1)`
- Storage keys follow pattern: `submissions/{userId}/{problemId}/{submissionId}.{ext}`
- Local tokens expire after 5 minutes; S3 presigned URLs also expire (configurable)
