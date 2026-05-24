import React, { useState } from 'react';
import './LearningOptions.css';
import WatchTutorials from './data/WatchTutorials';
import ErrorBoundary from '../ErrorBoundary';

const LearningOptions = ({ language, topic }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Verified GFG URLs for each language and topic
  const getGFGUrl = (language, topic) => {
    const lang = language.toLowerCase();
    const t = topic.toLowerCase();

    const gfgLinks = {
      java: {
        'basic syntax': 'https://www.geeksforgeeks.org/java/java-basic-syntax/',
        'data types & variables': 'https://www.geeksforgeeks.org/java/java-data-types/',
        'operators': 'https://www.geeksforgeeks.org/java/operators-in-java/',
        'control flow': 'https://www.geeksforgeeks.org/java/decision-making-javaif-else-switch-break-continue-jump/',
        'loops': 'https://www.geeksforgeeks.org/java/loops-in-java/',
        'functions': 'https://www.geeksforgeeks.org/java/methods-in-java/',
        'data structures': 'https://www.geeksforgeeks.org/java/java-collections/',
        'input/output': 'https://www.geeksforgeeks.org/java/java-io-input-output-in-java-with-examples/',
        'error handling': 'https://www.geeksforgeeks.org/java/exceptions-in-java/',
      },
      python: {
        'basic syntax': 'https://www.geeksforgeeks.org/python/python-syntax/',
        'data types & variables': 'https://www.geeksforgeeks.org/python/python-data-types/',
        'operators': 'https://www.geeksforgeeks.org/python/python-operators/',
        'control flow': 'https://www.geeksforgeeks.org/python/python3-if-if-else-nested-if-if-elif-statements/',
        'loops': 'https://www.geeksforgeeks.org/python/python-for-loops/',
        'functions': 'https://www.geeksforgeeks.org/python/python-functions/',
        'data structures': 'https://www.geeksforgeeks.org/python/python-data-structures/',
        'input/output': 'https://www.geeksforgeeks.org/python/python-input-output/',
        'error handling': 'https://www.geeksforgeeks.org/python/python-exception-handling/',
      },
      'c++': {
        'basic syntax': 'https://www.geeksforgeeks.org/cpp/cpp-basic-syntax/',
        'data types & variables': 'https://www.geeksforgeeks.org/cpp/cpp-data-types/',
        'operators': 'https://www.geeksforgeeks.org/cpp/operators-in-cpp/',
        'control flow': 'https://www.geeksforgeeks.org/cpp/decision-making-cpp/',
        'loops': 'https://www.geeksforgeeks.org/cpp/cpp-loops/',
        'functions': 'https://www.geeksforgeeks.org/cpp/functions-in-cpp/',
        'data structures': 'https://www.geeksforgeeks.org/cpp/cpp-stl-standard-template-library/',
        'input/output': 'https://www.geeksforgeeks.org/cpp/basic-input-output-in-cpp/',
        'error handling': 'https://www.geeksforgeeks.org/cpp/exception-handling-in-cpp/',
      },
      javascript: {
        'basic syntax': 'https://www.geeksforgeeks.org/javascript/javascript-syntax/',
        'data types & variables': 'https://www.geeksforgeeks.org/javascript/javascript-data-types/',
        'operators': 'https://www.geeksforgeeks.org/javascript/javascript-operators/',
        'control flow': 'https://www.geeksforgeeks.org/javascript/javascript-if-else/',
        'loops': 'https://www.geeksforgeeks.org/javascript/loops-in-javascript/',
        'functions': 'https://www.geeksforgeeks.org/javascript/functions-in-javascript/',
        'data structures': 'https://www.geeksforgeeks.org/javascript/javascript-data-structures/',
        'input/output': 'https://www.geeksforgeeks.org/javascript/javascript-console-log/',
        'error handling': 'https://www.geeksforgeeks.org/javascript/javascript-error-handling/',
      },
      js: {
        'basic syntax': 'https://www.geeksforgeeks.org/javascript/javascript-syntax/',
        'data types & variables': 'https://www.geeksforgeeks.org/javascript/javascript-data-types/',
        'operators': 'https://www.geeksforgeeks.org/javascript/javascript-operators/',
        'control flow': 'https://www.geeksforgeeks.org/javascript/javascript-if-else/',
        'loops': 'https://www.geeksforgeeks.org/javascript/loops-in-javascript/',
        'functions': 'https://www.geeksforgeeks.org/javascript/functions-in-javascript/',
        'data structures': 'https://www.geeksforgeeks.org/javascript/javascript-data-structures/',
        'input/output': 'https://www.geeksforgeeks.org/javascript/javascript-console-log/',
        'error handling': 'https://www.geeksforgeeks.org/javascript/javascript-error-handling/',
      },
    };

    // Look up the specific link
    const langLinks = gfgLinks[lang];
    if (langLinks && langLinks[t]) {
      return langLinks[t];
    }

    // Fallback to GFG search
    const query = `${language} ${topic}`;
    return `https://www.geeksforgeeks.org/search?q=${encodeURIComponent(query)}`;
  };

  const gfgLink = getGFGUrl(language, topic);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  if (selectedOption === 'watch') {
    return (
      <ErrorBoundary>
        <WatchTutorials language={language} topic={topic} />
      </ErrorBoundary>
    );
  }

  if (selectedOption === 'learn') {
    window.open(gfgLink, '_blank', 'noopener,noreferrer');
    setSelectedOption(null);
  }

  return (
    <div className="learning-options">
      <h2>How would you like to learn {language} - {topic}?</h2>
      <div className="tutorial-buttons">
        <button 
          className="watch-btn" 
          onClick={() => handleOptionSelect('watch')}
        >
          📺 Watch Video Tutorials
        </button>
        <button 
          className="learn-btn"
          onClick={() => handleOptionSelect('learn')}
        >
          📚 Learn with GeeksforGeeks
        </button>
      </div>
    </div>
  );
};

export default LearningOptions;
