import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Quiz = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quiz?.questions?.[currentQuestion];

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">No quiz questions available.</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
    setShowExplanation({
      ...showExplanation,
      [questionIndex]: true
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
    const score = calculateScore();
    if (onComplete) {
      onComplete({ score, total: quiz.questions.length, answers });
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getQuestionStatus = (index) => {
    if (answers[index] === undefined) return 'unanswered';
    if (answers[index] === quiz.questions[index].correctAnswer) return 'correct';
    return 'wrong';
  };

  const getStatusColor = (index) => {
    const status = getQuestionStatus(index);
    if (status === 'correct') return 'bg-green-200 text-green-800';
    if (status === 'wrong') return 'bg-red-200 text-red-800';
    return 'bg-gray-100 text-gray-700';
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const isCorrect = question && answers[currentQuestion] === question.correctAnswer;

  const correctCount = quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const wrongCount = Object.keys(answers).length - correctCount;
  const unansweredCount = quiz.questions.length - Object.keys(answers).length;

  if (quizCompleted) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Great job! Here are your results:</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>

          <button
            onClick={() => {
              setQuizCompleted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setShowExplanation({});
            }}
            className="px-6 py-3 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a] transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Question Numbers */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Quiz ({quiz.questions.length})</h3>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-12 h-12 rounded flex items-center justify-center font-semibold transition-colors ${
                currentQuestion === index
                  ? 'ring-2 ring-[#2f8d46]'
                  : ''
              } ${getStatusColor(index)}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Status Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span>{correctCount} Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>{wrongCount} Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span>{unansweredCount} Unanswered</span>
          </div>
        </div>
      </div>

      {/* Main Content - Question */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              QUESTION {currentQuestion + 1}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">⭕</span>
              <span className="text-sm font-medium text-gray-700">{question.marks} marks</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <p className="text-lg text-gray-800">{question.question}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrectOption = index === question.correctAnswer;
              const showResult = showExplanation[currentQuestion];

              let optionClass = 'border-2 border-gray-200 bg-white hover:border-gray-300';
              
              if (showResult) {
                if (isCorrectOption) {
                  optionClass = 'border-2 border-green-500 bg-green-50';
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-2 border-red-500 bg-red-50';
                } else {
                  optionClass = 'border-2 border-gray-200 bg-gray-50';
                }
              } else if (isSelected) {
                optionClass = 'border-2 border-[#2f8d46] bg-green-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`p-4 rounded-lg text-left transition-all ${optionClass}`}
                  disabled={showExplanation[currentQuestion]}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      showResult && isCorrectOption
                        ? 'border-green-500 bg-green-500'
                        : showResult && isSelected && !isCorrectOption
                        ? 'border-red-500'
                        : isSelected
                        ? 'border-[#2f8d46] bg-[#2f8d46]'
                        : 'border-gray-300'
                    }`}>
                      {showResult && isCorrectOption && (
                        <FaCheckCircle className="text-white text-xs" />
                      )}
                      {isSelected && !showResult && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && showExplanation[currentQuestion] && (
            <div className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {isCorrect ? (
                  <FaCheckCircle className="text-green-600 mt-1" />
                ) : (
                  <FaTimesCircle className="text-yellow-600 mt-1" />
                )}
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isCorrect ? 'Your submitted response was correct.' : 'Your submitted response was incorrect.'}
                </p>
              </div>
              
              {question.explanation && (
                <div className="mt-3 pl-6">
                  <p className="font-semibold text-gray-700 mb-1">Explanation</p>
                  <p className="text-gray-600 text-sm">{question.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>

            <div className="flex gap-3">
              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-[#2f8d46] text-white rounded-lg font-semibold hover:bg-[#267a3a] transition-all shadow-md hover:shadow-lg"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#2f8d46] text-white rounded-lg font-semibold hover:bg-[#267a3a] transition-all shadow-md hover:shadow-lg"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
