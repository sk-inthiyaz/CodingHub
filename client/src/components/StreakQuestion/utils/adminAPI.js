const BASE_URL = `${window.API_BASE_URL}/api`;

// Fetch all questions
export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/questions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Add a new question
export const addQuestion = async (questionData) => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error('Failed to add question');
    return await response.json();
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (!response.ok) throw new Error('Failed to delete question');
    return true;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Get question statistics
export const getQuestionStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (!response.ok) throw new Error('Failed to fetch question statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching question statistics:', error);
    throw error;
  }
};

// New: Add 5 daily questions
export const addDailyQuestions = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/streak/admin/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to add daily questions');
    return await response.json();
  } catch (error) {
    console.error('Error adding daily questions:', error);
    throw error;
  }
};