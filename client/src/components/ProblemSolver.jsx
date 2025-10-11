import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay, FaCheckCircle, FaClock, FaLightbulb, FaTimes } from 'react-icons/fa';
import { codeAPI } from '../services/api';

const ProblemSolver = ({ problem, onSubmit }) => {
  console.log('ProblemSolver received problem:', problem);
  
  // Check if there's a stored solution, otherwise use starter code
  const storedSolution = problem?.id ? localStorage.getItem(`solution_${problem.id}`) : null;
  const initialCode = storedSolution || problem?.starterCode || '';
  
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('compilation');
  const [customInput, setCustomInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">No problem data available</p>
      </div>
    );
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, startTime]);

  const toggleTimer = () => {
    if (!timerRunning) {
      setStartTime(Date.now());
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setShowOutput(true);
    setActiveTab('compilation');
    setOutput('');
    setSubmissionResult(null);
    
    try {
      // Use first test case input for compilation
      const testInput = problem.testCases && problem.testCases[0] 
        ? problem.testCases[0].input 
        : customInput;
      
      const expectedOutput = problem.testCases && problem.testCases[0]
        ? problem.testCases[0].expectedOutput
        : '';
      
      const response = await codeAPI.executeCode(code, language, testInput);
      
      if (response.data.success) {
        const { output: execOutput, error } = response.data.data;
        
        if (error) {
          setOutput(`Error:\n${error}`);
        } else {
          const actualOutput = execOutput || 'No output';
          
          // Format output with comparison
          const formattedOutput = `Your Output:\n${actualOutput}\n\n${'-'.repeat(50)}\n\nExpected Output:\n${expectedOutput}`;
          setOutput(formattedOutput);
        }
      } else {
        setOutput('Error: ' + (response.data.error || 'Compilation failed'));
      }
    } catch (error) {
      setOutput('Error executing code: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowOutput(true);
    setActiveTab('compilation');
    setSubmissionResult(null);
    
    const submitStartTime = Date.now();
    
    try {
      // Increment attempts
      setAttempts(prev => prev + 1);
      
      // Run code against all test cases
      const testCaseResults = [];
      let allPassed = true;
      
      for (const testCase of problem.testCases) {
        const response = await codeAPI.executeCode(code, language, testCase.input);
        
        if (response.data.success) {
          const { output: execOutput, error } = response.data.data;
          
          if (error) {
            allPassed = false;
            testCaseResults.push({ passed: false, error });
            break;
          }
          
          // Compare output (trim whitespace)
          const actualOutput = execOutput.trim();
          const expectedOutput = testCase.expectedOutput.trim();
          const passed = actualOutput === expectedOutput;
          
          testCaseResults.push({ passed, actualOutput, expectedOutput });
          
          if (!passed) {
            allPassed = false;
          }
        } else {
          allPassed = false;
          testCaseResults.push({ passed: false, error: 'Execution failed' });
          break;
        }
      }
      
      // Calculate time taken
      const timeTaken = ((Date.now() - submitStartTime) / 1000).toFixed(2);
      setExecutionTime(timeTaken);
      
      // Update attempts and correct attempts
      const newAttempts = attempts + 1;
      const newCorrectAttempts = allPassed ? correctAttempts + 1 : correctAttempts;
      
      setAttempts(newAttempts);
      if (allPassed) {
        setCorrectAttempts(newCorrectAttempts);
      }
      
      // Calculate accuracy
      const accuracy = Math.round((newCorrectAttempts / newAttempts) * 100);
      
      const testResults = {
        passed: testCaseResults.filter(r => r.passed).length,
        total: problem.testCases.length,
        attempts: newAttempts,
        correctAttempts: newCorrectAttempts,
        accuracy: accuracy,
        timeTaken: timeTaken,
        success: allPassed,
        testCaseResults
      };
      
      setSubmissionResult(testResults);
      
      // If all tests passed, store the solution and show success message
      if (allPassed) {
        // Store current code as the solution (user's successful submission)
        localStorage.setItem(`solution_${problem.id}`, code);
        
        // Show success celebration
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
      
      if (onSubmit) {
        onSubmit(testResults);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({
        success: false,
        error: error.response?.data?.error || error.message || 'Submission failed. Please try again.'
      });
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Success Celebration Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <FaCheckCircle className="text-3xl" />
            <div>
              <p className="text-xl font-bold">🎉 Congratulations!</p>
              <p className="text-sm">All test cases passed! +{problem.points || 0} points</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Left Panel - Problem Description */}
      <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded-full ${
                problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {problem.difficulty}
              </span>
              {problem.accuracy && <span>Accuracy: {problem.accuracy}</span>}
              {problem.submissions && <span>Submissions: {problem.submissions}</span>}
              {problem.points && <span>Points: {problem.points}</span>}
            </div>
          </div>

          {/* Problem Description */}
          <div className="prose max-w-none">
            {problem.description && <p className="text-gray-700 mb-6 whitespace-pre-wrap">{problem.description}</p>}

            {/* Tasks */}
            {problem.tasks && (
              <div className="mb-6">
                <ol className="list-decimal list-inside space-y-2">
                  {problem.tasks.map((task, index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{task.title}:</strong> {task.description}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Examples */}
            {problem.examples && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="mb-2">
                      <strong>Input:</strong> {example.input}
                    </div>
                    <div className="mb-2">
                      <strong>Output:</strong>
                      <pre className="mt-1 text-sm">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <strong>Explanation:</strong>
                        <p className="mt-1 text-sm text-gray-600">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {problem.moreExamplesButton && (
                  <button className="text-[#2f8d46] hover:underline text-sm">
                    Try more examples
                  </button>
                )}
              </div>
            )}

            {/* Topic Tags */}
            {problem.tags && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Topic Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col bg-white">
        {/* Editor Header */}
        <div className="border-b border-gray-200 p-3 flex items-center justify-between bg-gray-50">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
          >
            <option value="python">Python3</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTimer}
              className={`px-3 py-2 text-sm rounded flex items-center gap-2 ${
                timerRunning 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaClock className="text-xs" />
              {timerRunning ? formatTime(elapsedTime) : 'Start Timer'}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
            }}
          />
        </div>

        {/* Output Window */}
        {showOutput && (
          <div className="border-t border-gray-200 bg-white" style={{ height: '300px' }}>
            <div className="flex items-center justify-between px-4 py-2 bg-[#2f8d46] text-white">
              <h3 className="font-semibold">Output Window</h3>
              <button onClick={() => setShowOutput(false)} className="hover:bg-[#267a3a] p-1 rounded">
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('compilation')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'compilation'
                    ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compilation Results
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'input'
                    ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Custom Input
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 88px)' }}>
              {activeTab === 'compilation' && (
                <div>
                  {submissionResult ? (
                    <div>
                      {submissionResult.success ? (
                        <div>
                          <div className="flex items-center gap-2 text-green-600 mb-4">
                            <FaCheckCircle className="text-xl" />
                            <h4 className="text-lg font-semibold">Problem Solved Successfully ✓</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600 mb-1">Test Cases Passed</div>
                              <div className="text-2xl font-bold">{submissionResult.passed} / {submissionResult.total}</div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600 mb-1">Attempts : Correct / Total</div>
                              <div className="text-2xl font-bold">{submissionResult.correctAttempts} / {submissionResult.attempts}</div>
                              <div className="text-sm text-gray-600 mt-1">Accuracy : {submissionResult.accuracy}%</div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600 mb-1">Time Taken</div>
                              <div className="text-2xl font-bold">{submissionResult.timeTaken}s</div>
                            </div>
                          </div>

                          {submissionResult.correctAttempts === 1 && submissionResult.attempts === 1 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                              <p className="text-sm text-red-700">
                                ⚠️ You get marks only for the first correct submission if you solve the problem without viewing the full solution.
                              </p>
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold mb-2">Solve Next</h4>
                            <button className="text-[#2f8d46] hover:underline text-sm">
                              Start Coding - Python
                            </button>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Stay Ahead With:</h4>
                            {/* Add related content here */}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-red-600 mb-4">
                            <FaTimes className="text-xl" />
                            <h4 className="text-lg font-semibold">Submission Failed</h4>
                          </div>

                          {submissionResult.error ? (
                            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                              <p className="text-sm text-red-700">{submissionResult.error}</p>
                            </div>
                          ) : (
                            <div>
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                                <p className="text-sm text-yellow-800">
                                  ❌ Some test cases failed. Review your code and try again.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-4 rounded">
                                  <div className="text-sm text-gray-600 mb-1">Test Cases Passed</div>
                                  <div className="text-2xl font-bold text-red-600">{submissionResult.passed} / {submissionResult.total}</div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded">
                                  <div className="text-sm text-gray-600 mb-1">Attempts : Correct / Total</div>
                                  <div className="text-2xl font-bold">{submissionResult.correctAttempts} / {submissionResult.attempts}</div>
                                  <div className="text-sm text-gray-600 mt-1">Accuracy : {submissionResult.accuracy}%</div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded">
                                  <div className="text-sm text-gray-600 mb-1">Time Taken</div>
                                  <div className="text-2xl font-bold">{submissionResult.timeTaken}s</div>
                                </div>
                              </div>

                              {/* Show test case details */}
                              {submissionResult.testCaseResults && (
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2 text-sm">Test Case Details:</h4>
                                  {submissionResult.testCaseResults.map((result, index) => (
                                    <div key={index} className="mb-3 p-3 bg-gray-50 rounded text-xs">
                                      <div className="flex items-center gap-2 mb-2">
                                        {result.passed ? (
                                          <span className="text-green-600 font-semibold">✓ Test Case {index + 1} Passed</span>
                                        ) : (
                                          <span className="text-red-600 font-semibold">✗ Test Case {index + 1} Failed</span>
                                        )}
                                      </div>
                                      {!result.passed && result.actualOutput && (
                                        <div>
                                          <div className="mb-1">
                                            <strong>Expected:</strong>
                                            <pre className="bg-white p-2 rounded mt-1 text-xs">{result.expectedOutput}</pre>
                                          </div>
                                          <div>
                                            <strong>Your Output:</strong>
                                            <pre className="bg-white p-2 rounded mt-1 text-xs">{result.actualOutput}</pre>
                                          </div>
                                        </div>
                                      )}
                                      {result.error && (
                                        <div className="text-red-600">Error: {result.error}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <pre className="text-sm font-mono whitespace-pre-wrap">{output || 'Run your code to see output here...'}</pre>
                  )}
                </div>
              )}

              {activeTab === 'input' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter custom input for testing (one value per line):
                  </p>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    placeholder="Example:\nHello\n20\n5.5"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Use the format shown in the problem examples
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-3 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setShowOutput(true);
                setActiveTab('input');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              💡 Custom Input
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {isCompiling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Compiling...
                </>
              ) : (
                <>
                  <FaPlay className="text-xs" />
                  Compile & Run
                </>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#2f8d46] text-white rounded hover:bg-[#267a3a] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-xs" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;
