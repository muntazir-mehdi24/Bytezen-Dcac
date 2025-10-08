import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaPlay, FaCheck } from 'react-icons/fa';
import { codeAPI } from '../services/api';

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInputField, setShowInputField] = useState(false);

  // Check if code contains input() function
  const hasInput = children && children.includes('input(');

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    
    // Show input field if code has input() and no input provided yet
    if (hasInput && !showInputField) {
      setShowInputField(true);
      setIsRunning(false);
      return;
    }
    
    try {
      const response = await codeAPI.executeCode(children, language, userInput);
      
      if (response.data.success) {
        const { output: execOutput, error, status } = response.data.data;
        
        if (error) {
          setOutput(`Error:\n${error}`);
        } else {
          setOutput(execOutput || 'Code executed successfully with no output.');
        }
      } else {
        setOutput('Error: ' + (response.data.error || 'Code execution failed'));
      }
    } catch (error) {
      setOutput('Error executing code: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsRunning(false);
      setShowInputField(false);
    }
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
      {/* Code Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono uppercase">{language || 'code'}</span>
        <div className="flex items-center space-x-2">
          {language === 'python' && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-1 px-3 py-1 bg-[#2f8d46] text-white text-xs rounded hover:bg-[#267a3a] transition-colors disabled:opacity-50"
              title="Run Code"
            >
              <FaPlay className="text-xs" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            title="Copy Code"
          >
            {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={true}
      >
        {children}
      </SyntaxHighlighter>

      {/* Input Section */}
      {showInputField && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Input (one value per line):</div>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input values here (e.g., for multiple inputs, put each on a new line)"
            className="w-full bg-gray-900 text-white text-sm font-mono p-2 rounded border border-gray-600 focus:border-[#2f8d46] focus:outline-none resize-y"
            rows="3"
          />
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 bg-[#2f8d46] text-white text-xs rounded hover:bg-[#267a3a] transition-colors disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Run with Input'}
            </button>
            <button
              onClick={() => {
                setShowInputField(false);
                setUserInput('');
              }}
              className="px-4 py-2 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div className="bg-gray-900 border-t border-gray-700 px-4 py-3">
          <div className="text-xs text-gray-400 mb-1 font-semibold">Output:</div>
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
