import express from 'express';
import axios from 'axios';

const router = express.Router();

// Language IDs for Judge0
const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50
};

// @route   POST /api/code/execute
// @desc    Execute code using Judge0 API
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

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    
    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language'
      });
    }

    // Real code execution with Judge0
    const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

    if (!RAPIDAPI_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Code execution service not configured. Please add RAPIDAPI_KEY to .env file.'
      });
    }

    // Submit code
    const submission = await axios.post(
      `${JUDGE0_API}/submissions?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(code).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(input).toString('base64'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const result = submission.data;

    res.json({
      success: true,
      data: {
        output: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
        error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
        status: result.status.description,
        executionTime: result.time ? `${result.time}s` : 'N/A',
        memory: result.memory ? `${result.memory}KB` : 'N/A'
      }
    });


  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Code execution failed',
      message: error.message
    });
  }
});

export default router;
