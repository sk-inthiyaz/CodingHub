# 💻 Code Examples & Reference

## Component State Management

### Initial State Setup
```javascript
const [problem, setProblem] = useState(null);
const [code, setCode] = useState('');
const [language, setLanguage] = useState('javascript');
const [running, setRunning] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [results, setResults] = useState(null);
const [activeDescriptionTab, setActiveDescriptionTab] = useState('description');
const [submissionHistory, setSubmissionHistory] = useState([]);
```

---

## Navigation & Tab Switching

### Back Button Function
```javascript
const handleBackClick = () => {
  navigate('/practice/problems');
};
```

### Tab Switch Function
```javascript
const switchTab = (tabName) => {
  setActiveDescriptionTab(tabName);
};

// Usage in JSX
<button 
  className={`problem-tab ${activeDescriptionTab === 'description' ? 'active' : ''}`}
  onClick={() => switchTab('description')}
>
  📋 Description
</button>
```

---

## Submission Handling

### Enhanced Submit Handler
```javascript
const handleSubmit = async () => {
  setSubmitting(true);
  setResults(null);
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `http://localhost:5000/api/practice/problems/${id}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      }
    );

    const data = await res.json();
    setResults(data);
    
    // Add to history
    setSubmissionHistory(prev => [{
      ...data,
      timestamp: new Date().toISOString(),
      language: language
    }, ...prev]);
    
    // AUTO-SWITCH TO SUBMISSIONS TAB ✨
    setActiveDescriptionTab('submissions');

    // Refresh problem if successful
    if (data.success) {
      setTimeout(fetchProblem, 500);
    }
  } catch (error) {
    console.error('Error submitting:', error);
    setResults({ 
      success: false, 
      message: 'Failed to submit solution' 
    });
  } finally {
    setSubmitting(false);
  }
};
```

---

## JSX Structure

### Back Button & Header
```jsx
<div className="problem-detail-header">
  <button 
    className="back-button-icon" 
    onClick={handleBackClick}
    title="Back to Problems"
  >
    <img src={leftArrowIcon} alt="Back" />
  </button>
  
  <div className="problem-title-header">
    <h1>{problem.title}</h1>
    {problem.isSolved && (
      <span className="solved-check">✓</span>
    )}
  </div>
</div>
```

### Tab Navigation
```jsx
<div className="problem-tabs-container">
  <div className="problem-tabs">
    <button
      className={`problem-tab ${activeDescriptionTab === 'description' ? 'active' : ''}`}
      onClick={() => setActiveDescriptionTab('description')}
    >
      📋 Description
    </button>
    
    <button
      className={`problem-tab ${activeDescriptionTab === 'submissions' ? 'active' : ''}`}
      onClick={() => setActiveDescriptionTab('submissions')}
    >
      ✓ Submissions {submissionHistory.length > 0 && 
        <span className="tab-badge">{submissionHistory.length}</span>
      }
    </button>
  </div>
</div>
```

### Conditional Tab Content
```jsx
<div className="tab-content-container">
  {activeDescriptionTab === 'description' && (
    <div className="tab-content description-content">
      {/* Description content here */}
    </div>
  )}
  
  {activeDescriptionTab === 'submissions' && (
    <div className="tab-content submissions-content">
      {/* Submissions content here */}
    </div>
  )}
</div>
```

---

## Submission Result Display

### Accepted Result
```jsx
{results && results.success && (
  <div className="submission-result accepted">
    <div className="submission-header">
      <div className="submission-status">
        <div className="status-icon success">✓</div>
        <div>
          <h4>Accepted</h4>
          <p>Your solution passed all test cases!</p>
        </div>
      </div>
      
      <div className="submission-metrics">
        <div className="metric">
          <span className="metric-label">Runtime:</span>
          <span className="metric-value">{results.executionTime}ms</span>
        </div>
        {results.memoryUsage && (
          <div className="metric">
            <span className="metric-label">Memory:</span>
            <span className="metric-value">{results.memoryUsage}</span>
          </div>
        )}
      </div>
    </div>
    
    {/* Test results below */}
  </div>
)}
```

### Failed Result
```jsx
{results && !results.success && (
  <div className="submission-result rejected">
    <div className="submission-header">
      <div className="submission-status">
        <div className="status-icon failed">✗</div>
        <div>
          <h4>Not Accepted</h4>
          <p>{results.message || 'Some test cases failed'}</p>
        </div>
      </div>
      
      <div className="submission-metrics">
        <div className="metric">
          <span className="metric-label">Runtime:</span>
          <span className="metric-value">{results.executionTime}ms</span>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## Test Case Rendering

### Test Results List
```jsx
{results?.testResults && results.testResults.length > 0 && (
  <div className="test-results-section">
    <div className="test-summary">
      <span className="test-count">
        {results.passedTests}/{results.totalTests} test cases passed
      </span>
    </div>
    
    <div className="test-results-list">
      {results.testResults.map((test, idx) => (
        <div
          key={idx}
          className={`test-case-result ${test.passed ? 'passed' : 'failed'}`}
        >
          {/* Test case details */}
        </div>
      ))}
    </div>
  </div>
)}
```

### Individual Test Case
```jsx
<div className={`test-case-result ${test.passed ? 'passed' : 'failed'}`}>
  <div className="test-case-header">
    <span>Test Case {idx + 1}</span>
    <span>{test.passed ? '✓ Passed' : '✗ Failed'}</span>
  </div>
  
  <div className="test-case-details">
    <div className="detail-row">
      <strong>Input:</strong>
      <pre>{test.input}</pre>
    </div>
    
    <div className="detail-row">
      <strong>Expected:</strong>
      <pre>{test.expectedOutput}</pre>
    </div>
    
    <div className="detail-row">
      <strong>Your Output:</strong>
      <pre>{test.actualOutput || 'N/A'}</pre>
    </div>
    
    {test.error && (
      <div className="detail-row error">
        <strong>Error:</strong>
        <pre>{test.error}</pre>
      </div>
    )}
  </div>
</div>
```

---

## Submission History

### History List Rendering
```jsx
{submissionHistory.length > 0 && !results && (
  <div className="submission-history">
    <h4>Recent Submissions</h4>
    {submissionHistory.map((sub, idx) => (
      <div 
        key={idx} 
        className={`history-item ${sub.success ? 'accepted' : 'rejected'}`}
      >
        <span className="history-status">
          {sub.success ? '✓ Accepted' : '✗ Failed'}
        </span>
        
        <span className="history-language">
          {sub.language}
        </span>
        
        <span className="history-time">
          {new Date(sub.timestamp).toLocaleTimeString()}
        </span>
      </div>
    ))}
  </div>
)}
```

### Empty State
```jsx
{!results && submissionHistory.length === 0 && (
  <div className="empty-submissions">
    <div className="empty-icon">📨</div>
    <p>No submissions yet</p>
    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
      Submit your solution to see results here
    </p>
  </div>
)}
```

---

## CSS Styling Examples

### Back Button Styling
```css
.back-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-button-icon:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1), 
    rgba(118, 75, 162, 0.1)
  );
  transform: translateX(-3px);
}

.back-button-icon:active {
  transform: translateX(-1px);
}
```

### Tab Styling
```css
.problem-tab {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.problem-tab:hover {
  color: var(--text-primary);
  background: var(--card-bg);
}

.problem-tab.active {
  color: #667eea;
}

.problem-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px 3px 0 0;
}
```

### Submission Result Card
```css
.submission-result {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.submission-result.accepted {
  border-color: #10b981;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(16, 185, 129, 0.02) 100%
  );
}

.submission-result.rejected {
  border-color: #ef4444;
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.05) 0%, 
    rgba(239, 68, 68, 0.02) 100%
  );
}
```

### Status Icon Styling
```css
.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.status-icon.success {
  background: #d1fae5;
  color: #10b981;
}

.status-icon.failed {
  background: #fee2e2;
  color: #ef4444;
}
```

### Test Case Result Styling
```css
.test-case-result.passed {
  border-color: #d1fae5;
  background: var(--bg-primary);
}

.test-case-result.failed {
  border-color: #fee2e2;
  background: var(--bg-primary);
}

.test-case-result.passed .test-case-header {
  background: rgba(16, 185, 129, 0.05);
  color: #10b981;
}

.test-case-result.failed .test-case-header {
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
}
```

### Animation
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content-container {
  animation: fadeIn 0.3s ease;
}
```

---

## Responsive Design

### Mobile Styles
```css
@media (max-width: 768px) {
  .problem-detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .back-button-icon {
    width: 36px;
    height: 36px;
  }

  .problem-tab {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .submission-header {
    flex-direction: column;
    gap: 1rem;
  }

  .submission-metrics {
    text-align: left;
    flex-direction: row;
    gap: 1.5rem;
  }

  .test-case-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-row pre {
    font-size: 0.75rem;
  }

  .history-item {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .empty-submissions {
    padding: 2rem 1rem;
  }
}
```

---

## Backend Integration Example

### Submission Controller
```javascript
// Example: api/practice/problems/:id/submit
const handleSubmit = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.id;
    const userId = req.user.id;

    // Get problem
    const problem = await PracticeProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Problem not found' 
      });
    }

    // Run test cases
    const testResults = [];
    let passedTests = 0;

    for (let testCase of problem.testCases) {
      const result = await executeCode(
        code, 
        language, 
        testCase
      );
      
      testResults.push({
        passed: result.output === testCase.expectedOutput,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        error: result.error
      });

      if (result.output === testCase.expectedOutput) {
        passedTests++;
      }
    }

    const success = passedTests === problem.testCases.length;

    // Save submission
    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: success ? 'accepted' : 'failed',
      testResults,
      executionTime: calculateTime(testResults)
    });
    await submission.save();

    // Update acceptance rate
    await updateAcceptanceRate(problemId, success);

    return res.json({
      success,
      message: success 
        ? 'All tests passed!' 
        : 'Some tests failed',
      testResults,
      passedTests,
      totalTests: problem.testCases.length,
      executionTime: submission.executionTime
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

---

## Usage Examples

### Import & Setup
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './Practice.css';
import leftArrowIcon from '../images/left-arrow (1).png';

const ProblemDetail = () => {
  // ... component code
};

export default ProblemDetail;
```

### Conditional Rendering Example
```javascript
// Show loading
if (loading) return <div className="loading">Loading...</div>;

// Show error
if (!problem) return <div className="error">Not found</div>;

// Show content
return (
  <div className="problem-detail-container">
    {/* Back button and tabs */}
    {/* Tab content with conditional rendering */}
    {/* Results display */}
  </div>
);
```

---

## Common Patterns

### State Update Pattern
```javascript
// Update with new data
setState(prev => [...prev, newItem]);

// Toggle boolean
setState(prev => !prev);

// Update object
setState(prev => ({ ...prev, key: value }));

// Conditional update
setState(prev => prev > 0 ? prev - 1 : 0);
```

### Effect Hook Pattern
```javascript
// Run once on mount
useEffect(() => {
  fetchData();
}, []);

// Run when dependency changes
useEffect(() => {
  updateCode();
}, [language, problem]);

// Cleanup effect
useEffect(() => {
  return () => cleanup();
}, []);
```

### Event Handler Pattern
```javascript
const handleClick = (e) => {
  e.preventDefault();
  // Handle click
};

const handleChange = (value) => {
  setState(value);
};

const handleAsync = async () => {
  try {
    const data = await fetch(...);
    setState(data);
  } catch (error) {
    setError(error);
  }
};
```

---

## Debugging Tips

### Console Logging
```javascript
console.log('Component mounted');
console.log('Results:', results);
console.log('Active tab:', activeDescriptionTab);
console.log('Error:', error);
```

### React DevTools
```
1. Install React DevTools extension
2. Open DevTools in browser
3. View component hierarchy
4. Inspect state values
5. Monitor re-renders
```

### Common Issues & Solutions
```
Issue: Tab not switching
Solution: Check setState, verify condition in onClick

Issue: Results not showing
Solution: Check API response, verify error handling

Issue: Styling not applied
Solution: Check class names, inspect CSS, clear cache

Issue: Back button not working
Solution: Check navigate function, verify router setup
```

---

**These examples cover the main patterns and should help with maintenance and customization!** 💡
