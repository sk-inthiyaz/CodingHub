const categoryPrompts = {
    general: 'Please provide a clear and helpful response.',
    debugging: 'Help debug and fix the following issue:',
    optimization: 'Analyze the following for performance optimization:',
    explanation: 'Provide a detailed explanation of the following:',
    implementation: 'Help implement the following:',
};

const generatePrompt = (input, type) => {
    const baseContext = `You are an expert programming AI assistant. Your responses should be clear, detailed, and educational. Focus on providing practical, working solutions with thorough explanations.`;
    
    if (type === 'generate') {
        return `${baseContext}

The user has requested: "${input}"

Please provide:
1. A complete, working implementation of the requested code
2. A detailed explanation of how the code works
3. Time and space complexity analysis (if applicable)
4. Best practices and potential optimizations
5. Example usage

Format your response like this:
\`\`\`[language]
// Complete code implementation here
\`\`\`

### Explanation:
[Detailed explanation of how the code works]

### Time & Space Complexity:
[Analysis of the algorithm's efficiency]

### Best Practices & Tips:
[Additional insights and recommendations]

### Example Usage:
[Show how to use the code]`;
    }

    // Check if the input contains code
    const containsCode = input.includes('```') || /^[\s{]*[class|function|import|const|let|var|public|private|def|#include]/.test(input);

    if (containsCode) {
        return `${baseContext}
Please analyze this code:
${input}

Provide:
1. A clear explanation of what the code does
2. Any potential improvements or best practices
3. Possible bugs or issues to watch out for
4. Suggestions for optimization if applicable`;
    }

    return `${baseContext}
${categoryPrompts['general']}

Query: ${input}

Provide:
1. A direct answer to the question
2. Code examples where applicable
3. Best practices and common pitfalls
4. Additional resources or related concepts to explore`;
}

module.exports = {
    generatePrompt
};