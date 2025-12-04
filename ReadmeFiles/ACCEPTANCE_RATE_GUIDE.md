# 📊 Understanding Acceptance Rate - Complete Guide

## What is Acceptance Rate?

**Definition**: The percentage of total submissions that result in an accepted (correct) solution.

```
Acceptance Rate = (Total Accepted Submissions / Total Submissions) × 100
```

---

## Example Scenarios

### Example 1: Simple Problem
```
Problem: "Sum two numbers"

Total Submissions:   1000
Accepted:           750
Failed:             250

Acceptance Rate = (750 / 1000) × 100 = 75%
```

**Interpretation**: This is an easy problem. 75% of people who try it, solve it correctly.

---

### Example 2: Medium Problem
```
Problem: "Longest Substring"

Total Submissions:   2000
Accepted:           800
Failed:             1200

Acceptance Rate = (800 / 2000) × 100 = 40%
```

**Interpretation**: This is a medium difficulty problem. 40% solve it correctly.

---

### Example 3: Hard Problem
```
Problem: "Complex Algorithm"

Total Submissions:   500
Accepted:           40
Failed:             460

Acceptance Rate = (40 / 500) × 100 = 8%
```

**Interpretation**: This is a hard problem. Only 8% of people solve it correctly.

---

## Factors Affecting Acceptance Rate

### 1. **Problem Difficulty** 🎯
- **Easy Problems**: 60-90% acceptance
- **Medium Problems**: 30-60% acceptance
- **Hard Problems**: 5-30% acceptance

### 2. **Problem Description Clarity** 📝
- Clear problems → Higher acceptance
- Ambiguous problems → Lower acceptance

### 3. **Edge Cases** ⚠️
- Problems with hidden edge cases → Lower acceptance
- Straightforward problems → Higher acceptance

### 4. **Time Constraints** ⏱️
- Easier problems → More submissions
- Harder problems → Fewer submissions

### 5. **Problem Type** 🔧
- String manipulation: 40-50%
- Dynamic programming: 10-25%
- Array operations: 50-70%
- Graph problems: 15-30%
- Bit manipulation: 20-40%

---

## How to Calculate In Your System

### Backend Implementation

```javascript
// In your controller or service

async function calculateAcceptanceRate(problemId) {
  try {
    // Get all submissions for this problem
    const allSubmissions = await Submission.find({ problemId });
    
    // Count accepted submissions
    const acceptedCount = allSubmissions.filter(
      sub => sub.status === 'accepted' || sub.success === true
    ).length;
    
    // Calculate rate
    const total = allSubmissions.length;
    const rate = total > 0 
      ? (acceptedCount / total) * 100 
      : 0;
    
    // Round to 1 decimal place
    return parseFloat(rate.toFixed(1));
  } catch (error) {
    console.error('Error calculating acceptance rate:', error);
    return 0;
  }
}
```

### Store In Database

```javascript
// PracticeProblem Schema
{
  title: String,
  description: String,
  difficulty: String,
  topic: String,
  // ... other fields
  acceptanceRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  }
}
```

### Update On Submission

```javascript
// When a submission is made

async function updateAcceptanceRate(problemId, accepted) {
  try {
    const problem = await PracticeProblem.findById(problemId);
    
    // Increment total
    problem.totalSubmissions += 1;
    
    // Increment accepted if passed
    if (accepted) {
      problem.acceptedSubmissions += 1;
    }
    
    // Calculate new rate
    problem.acceptanceRate = (
      (problem.acceptedSubmissions / problem.totalSubmissions) * 100
    ).toFixed(1);
    
    // Save
    await problem.save();
  } catch (error) {
    console.error('Error updating acceptance rate:', error);
  }
}
```

---

## Frontend Display

### Where It Appears
```jsx
// In ProblemDetail component
<div className="meta-item">
  <span className="meta-label">Acceptance</span>
  <span className="meta-value">
    {problem.acceptanceRate || 0}%
  </span>
</div>
```

### With Difficulty Color

```jsx
// Enhanced version with color coding
const getAcceptanceColor = (rate) => {
  if (rate >= 70) return '#10b981'; // Green - Easy
  if (rate >= 40) return '#f59e0b'; // Orange - Medium
  return '#ef4444'; // Red - Hard
};

<span 
  className="meta-value"
  style={{ color: getAcceptanceColor(problem.acceptanceRate) }}
>
  {problem.acceptanceRate}%
</span>
```

---

## Common Ranges by Difficulty

### Easy Problems (1-100 difficulty score)
```
Acceptance Rate: 60% - 90%
Average:         75%

Examples:
- Simple array operations: 85%
- Basic string problems: 75%
- Easy math problems: 80%
```

### Medium Problems (101-200 difficulty score)
```
Acceptance Rate: 30% - 60%
Average:         45%

Examples:
- Tree traversal: 40%
- Binary search variations: 45%
- Hash map problems: 50%
```

### Hard Problems (201-300 difficulty score)
```
Acceptance Rate: 5% - 30%
Average:         15%

Examples:
- Complex DP: 10%
- Graph algorithms: 12%
- System design: 8%
```

---

## Real-World Examples

### LeetCode Statistics
```
Problem Type          Acceptance Rate
─────────────────────────────────────
Two Sum               47.3%
Add Two Numbers       33.1%
Longest Substring     32.3%
Median Arrays         27.1%
Regular Expression    26.7%
Container Water       49.1%
Trap Rain Water       48.0%
Merge k Lists         39.3%
Reverse Nodes         44.4%
Swap Pairs            54.9%
```

---

## What Acceptance Rate Tells You

### High Rate (>70%) 🟢
```
✓ Problem is straightforward
✓ Most people understand it
✓ Good for beginners
✓ Test your basic skills
✓ Build confidence
```

### Medium Rate (30-70%) 🟡
```
✓ Problem requires some thought
✓ Might need optimization
✓ Good interview prep
✓ Medium difficulty
✓ Useful problem-solving practice
```

### Low Rate (<30%) 🔴
```
✓ Problem is challenging
✓ Might have tricky edge cases
✓ Requires advanced techniques
✓ Good for mastery
✓ Competitive programming level
```

---

## How to Improve Your Acceptance Rate

### For New Problems
```
1. Read carefully (30% miss edge cases)
2. Check examples (understand I/O format)
3. Identify constraints (affects solution)
4. Plan before coding (avoid bugs)
5. Test with examples first
6. Submit once confident
```

### For Retrying Failed Problems
```
1. Review failed test cases
2. Print debug info
3. Check edge cases
4. Trace through your logic
5. Optimize if needed
6. Test again
```

### General Strategy
```
Start Easy:     Build confidence
Practice Medium: Develop skills
Attempt Hard:   Challenge yourself
Review Fails:   Learn patterns
```

---

## Statistics Dashboard Idea

You could show users:
```
┌─────────────────────────────────┐
│   YOUR PRACTICE STATISTICS      │
├─────────────────────────────────┤
│                                 │
│ Overall Acceptance:   68%  🟢    │
│ ─────────────────────────────    │
│                                 │
│ By Difficulty:                  │
│   Easy:    87%  (23 solved)     │
│   Medium:  54%  (12 solved)     │
│   Hard:    22%  (4 solved)      │
│                                 │
│ By Topic:                       │
│   Arrays:   72%  (18 solved)    │
│   Trees:    45%  (9 solved)     │
│   DP:       38%  (7 solved)     │
│   Graphs:   25%  (3 solved)     │
│                                 │
│ Total Attempts:  89             │
│ Total Solved:    60             │
│ Success Rate:    67.4%          │
│                                 │
└─────────────────────────────────┘
```

---

## Database Queries for Analytics

### Get All Acceptance Rates
```javascript
// Sorted by acceptance rate
const problems = await PracticeProblem.find()
  .sort({ acceptanceRate: -1 })
  .limit(10);

// Returns problems from hardest to easiest
```

### Get Problem Statistics
```javascript
// Aggregate stats
const stats = await PracticeProblem.aggregate([
  {
    $group: {
      _id: '$difficulty',
      avgAcceptance: { $avg: '$acceptanceRate' },
      count: { $sum: 1 }
    }
  }
]);

// Result:
// [
//   { _id: 'Easy', avgAcceptance: 78, count: 50 },
//   { _id: 'Medium', avgAcceptance: 42, count: 75 },
//   { _id: 'Hard', avgAcceptance: 15, count: 25 }
// ]
```

### Get User's Acceptance Rate
```javascript
// For a specific user
const userAcceptance = await Submission.aggregate([
  { $match: { userId: userId } },
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      accepted: {
        $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      acceptanceRate: {
        $multiply: [
          { $divide: ['$accepted', '$total'] },
          100
        ]
      }
    }
  }
]);
```

---

## Tips for Problem Creators

When uploading a problem:

### 1. Make Problem Clear ✍️
- Clear problem statement → Higher acceptance
- Ambiguous statement → Lower acceptance

### 2. Provide Good Examples 📋
- Multiple examples help understanding
- Include edge case examples
- Show both simple and complex cases

### 3. Set Reasonable Constraints ⚙️
- Too loose = trivial (99% acceptance)
- Too tight = impossible (2% acceptance)
- Aim for 40-50% = good difficulty

### 4. Hide Edge Cases Wisely 🎯
- Public test cases: Basic cases
- Hidden test cases: Edge cases, large inputs
- Mix helps users learn and challenges them

### 5. Provide Hints 💡
- Better hints → Higher acceptance
- Vague hints → Lower acceptance

---

## Summary

**Acceptance Rate** is a metric showing problem difficulty and clarity:

- Calculated from successful submissions
- Ranges from 0% (impossible) to 100% (trivial)
- Helps users choose appropriate problems
- Guides problem creators on difficulty level
- Shows practice progress over time

**Use it to:**
- Choose problems at your skill level
- Track your improvement
- Understand relative difficulty
- Benchmark against others
- Calibrate problem difficulty

---

**Keep practicing, track your acceptance rate, and improve! 📈** 🎯
