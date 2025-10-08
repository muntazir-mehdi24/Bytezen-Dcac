import express from 'express';
import axios from 'axios';

const router = express.Router();

// Language mappings for Piston API
const PISTON_LANGUAGES = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'c++',
  c: 'c'
};

// @route   POST /api/code/execute
// @desc    Execute code using Piston API (Free, No API Key Required)
// @access  Public
router.post('/execute', async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const pistonLanguage = PISTON_LANGUAGES[language.toLowerCase()];
    
    if (!pistonLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language'
      });
    }

    // Execute code using Piston API (Free, No API Key!)
    const PISTON_API = 'https://emkc.org/api/v2/piston';

    const response = await axios.post(
      `${PISTON_API}/execute`,
      {
        language: pistonLanguage,
        version: '*', // Use latest version
        files: [
          {
            name: `main.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}`,
            content: code
          }
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    const result = response.data;

    res.json({
      success: true,
      data: {
        output: result.run?.stdout || '',
        error: result.run?.stderr || result.compile?.stderr || '',
        status: result.run?.code === 0 ? 'Accepted' : 'Error',
        executionTime: 'N/A',
        memory: 'N/A'
      }
    });


  } catch (error) {
    console.error('Code execution error:', error.message);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    });
    
    // Handle timeout errors specifically
    if (error.response?.status === 504 || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'Code execution timed out',
        message: 'The code execution service is taking too long to respond. Please try again or use a simpler code example.'
      });
    }
    
    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Service unavailable',
        message: 'Unable to connect to code execution service. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Code execution failed',
      message: error.response?.data?.message || error.message || 'An unexpected error occurred'
    });
  }
});

export default router;
