// Function to get problems based on topic and difficulty
export const generateProblems = async (topic, difficulty) => {
  try {
    console.log('[DEBUG] Getting problems for:', { topic, difficulty });
    
    // Dynamically import problems to avoid initialization issues
    const { default: practiceProblems } = await import('../data/practiceProblems');
    const problems = practiceProblems[topic]?.[difficulty];
    
    if (!problems || !Array.isArray(problems) || problems.length === 0) {
      throw new Error(`No problems found for ${topic} - ${difficulty}`);
    }
    
    // Randomly select 5 problems or return all if less than 5
    const selectedProblems = problems.length <= 5 
      ? problems 
      : shuffleArray([...problems]).slice(0, 5);
    
    console.log('[DEBUG] Selected problems:', selectedProblems);
    return selectedProblems;
  } catch (error) {
    console.error('[DEBUG] Error getting problems:', error);
    throw error;
  }
};

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to analyze code and provide optimization suggestions
export const analyzeCode = async (code) => {
  try {
    console.log('[DEBUG] Sending code for analysis:', code);
    const response = await fetch(`${window.API_BASE_URL}/api/practice/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] Server error response:', errorText);
      throw new Error(`Failed to analyze code: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Received analysis:', data);
    
    return {
      timeComplexity: data.timeComplexity,
      spaceComplexity: data.spaceComplexity,
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      explanation: data.explanation
    };
  } catch (error) {
    console.error('[DEBUG] Error analyzing code:', error);
    throw error;
  }
};
