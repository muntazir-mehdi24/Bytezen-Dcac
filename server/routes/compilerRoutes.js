import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// External compiler API configuration
const COMPILER_API_URL = process.env.COMPILER_API_URL || 'https://api.jdoodle.com/v1/execute';
const CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

// Verdict constants
const VERDICT = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  RUNTIME_ERROR: 'Runtime Error',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  COMPILATION_ERROR: 'Compilation Error',
  INTERNAL_ERROR: 'Internal Error'
};

/**
 * @route   POST /api/compile
 * @desc    Compile and execute code with test cases
 * @access  Private
 * @body    {string} code - The source code to compile/execute
 * @body    {string} language - The programming language ('python' or 'javascript')
 * @body    {Array} testCases - Array of test cases to run against the code
 * @returns {Object} Results of the code execution
 */
router.post('/compile', protect, async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required fields'
      });
    }

    // Map language to JDoodle language code
    const languageMap = {
      'python': 'python3',
      'javascript': 'nodejs'
    };

    const languageVersion = languageMap[language.toLowerCase()];
    
    if (!languageVersion) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language. Supported languages are: python, javascript'
      });
    }

    // Process test cases if provided
    let results = [];
    let allPassed = true;
    let firstFailedTestCase = null;
    
    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      for (const [index, testCase] of testCases.entries()) {
        try {
          // For each test case, we'll append the test case input to the code
          const testCode = `${code}\n\n// Test case ${index + 1}\n${testCase.input}`;
          
          // Execute the code with a timeout
          const response = await executeCode(testCode, languageVersion);
          
          // Normalize outputs for comparison
          const normalizedExpected = testCase.expectedOutput.toString().trim();
          const normalizedActual = response.output.trim();
          
          // Determine the verdict
          let verdict;
          let passed = false;
          
          if (response.error) {
            verdict = response.error.includes('Time limit exceeded') 
              ? VERDICT.TIME_LIMIT_EXCEEDED 
              : VERDICT.RUNTIME_ERROR;
          } else if (normalizedActual === normalizedExpected) {
            verdict = VERDICT.ACCEPTED;
            passed = true;
          } else {
            verdict = VERDICT.WRONG_ANSWER;
            allPassed = false;
            if (!firstFailedTestCase) {
              firstFailedTestCase = index + 1;
            }
          }
          
          const result = {
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: normalizedExpected,
            actualOutput: normalizedActual,
            verdict,
            passed,
            error: response.error || null,
            executionTime: response.cpuTime || 0,
            memoryUsed: response.memory || 0
          };
          
          results.push(result);
        } catch (error) {
          console.error(`Error executing test case ${index + 1}:`, error);
          results.push({
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: null,
            passed: false,
            error: error.message || 'Failed to execute test case',
            executionTime: 0
          });
        }
      }
    } else {
      // If no test cases, just execute the code directly
      try {
        const response = await executeCode(code, languageVersion);
        results.push({
          input: '',
          output: response.output,
          error: response.error,
          executionTime: response.cpuTime || 0
        });
      } catch (error) {
        console.error('Error executing code:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to execute code',
          details: error.message
        });
      }
    }

    // Determine overall verdict
    const overallVerdict = allPassed 
      ? VERDICT.ACCEPTED 
      : firstFailedTestCase 
        ? `${VERDICT.WRONG_ANSWER} on test case ${firstFailedTestCase}`
        : VERDICT.INTERNAL_ERROR;

    res.json({
      success: true,
      language,
      verdict: overallVerdict,
      passed: allPassed,
      totalTestCases: testCases?.length || 0,
      passedTestCases: results.filter(r => r.passed).length,
      executionTime: results.reduce((sum, r) => sum + (r.executionTime || 0), 0),
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Execute code using the JDoodle API
 * @param {string} code - The source code to execute
 * @param {string} language - The language identifier for the compiler API
 * @returns {Promise<Object>} The execution result
 */
async function executeCode(code, language) {
  try {
    const response = await axios({
      method: 'post',
      url: COMPILER_API_URL,
      data: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        script: code,
        language: language,
        versionIndex: '0',
        stdin: ''
      },
      timeout: 10000 // 10 seconds timeout
    });

    // Handle different response formats from the compiler API
    const output = response.data.output || '';
    const error = response.data.error || 
                 (response.data.statusCode >= 400 ? 'Runtime error' : null);
    
    return {
      output: output,
      error: error,
      statusCode: response.data.statusCode || 200,
      memory: parseInt(response.data.memory) || 0,
      cpuTime: parseFloat(response.data.cpuTime) || 0
    };
  } catch (error) {
    console.error('Error calling compiler API:', error.response?.data || error.message);
    
    // Handle different types of errors
    let errorMessage = 'Failed to execute code';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Execution timed out';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      output: '',
      error: errorMessage,
      statusCode: 500,
      memory: 0,
      cpuTime: 0
    };
  }
}

export default router;
