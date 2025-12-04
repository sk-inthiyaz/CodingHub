# Sample Questions for Testing

This file contains 5 sample coding questions that you can use to test the Admin Dashboard question import feature.

## How to Use

1. **Login as Admin**
   - Navigate to http://localhost:3000/login
   - Login with admin credentials

2. **Go to Admin Dashboard**
   - Navigate to http://localhost:3000/admin/dashboard
   - Click on "📥 Upload Questions" tab

3. **Upload the JSON File**
   - Click "Choose File" and select `sample-questions.json`
   - You'll see a preview of the questions
   - Click "Import X Question(s)" to add them to the database

## Questions Included

1. **Two Sum** (Easy)
   - Classic array problem
   - 3 test cases

2. **Reverse String** (Easy)
   - String manipulation
   - 2 test cases

3. **Palindrome Number** (Easy)
   - Number validation
   - 3 test cases

4. **Valid Parentheses** (Medium)
   - Stack-based problem
   - 5 test cases

5. **Merge Two Sorted Lists** (Easy)
   - Linked list problem
   - 3 test cases

## For Daily Streak Questions

To add questions for the daily streak feature:

1. Go to Admin Dashboard
2. Click "🔥 Daily Streak Questions" tab
3. Fill in questions for all 5 levels (Easy, Mid, Mid-Easy, Hard, Mix)
4. Select the date
5. Click "Publish 5 Daily Questions"

## Testing the Editor

After importing questions:
1. Go to http://localhost:3000/streak
2. Click "Start Solving" on today's challenge
3. You'll see the code editor where you can write and submit solutions
4. The editor supports multiple languages: JavaScript, Python, Java, C++

## Notes

- Questions support any programming language
- Test cases are evaluated on the backend
- Users can see hints during solving
- Successfully solving updates the user's streak

## Sample JSON Structure

```json
{
  "questions": [
    {
      "title": "Question Title",
      "description": "Problem description with examples...",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "Sample input",
          "expectedOutput": "Expected output"
        }
      ]
    }
  ]
}
```

## Troubleshooting

- If import fails, check console for validation errors
- Make sure all required fields are present: title, description, difficulty, testCases
- Each test case must have input and expectedOutput
- Difficulty must be one of: "easy", "medium", "hard"
