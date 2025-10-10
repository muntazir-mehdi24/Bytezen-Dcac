import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Quiz from '../../components/Quiz';

// Sample quiz data
const quizzesData = {
  '1-1-q1': {
    id: '1-1-q1',
    title: 'Python Basics Quiz',
    totalQuestions: 17,
    totalMarks: 85,
    questions: [
      {
        id: 1,
        question: 'What is the main goal of Data Science?',
        marks: 5,
        options: [
          'To build websites',
          'To extract insights from data for better decision-making',
          'To study customer psychology',
          'To store data in folders'
        ],
        correctAnswer: 1,
        explanation: 'Data Science is used to collect insights from data to make better decisions to grow the businesses.'
      },
      {
        id: 2,
        question: 'Which of the following is NOT a step in the Data Science process?',
        marks: 5,
        options: [
          'Data Collection',
          'Data Cleaning',
          'Data Visualization',
          'Data Deletion'
        ],
        correctAnswer: 3,
        explanation: 'Data Deletion is not a standard step in the Data Science process. The key steps are Collection, Cleaning, Analysis, Visualization, and Decision-Making.'
      },
      {
        id: 3,
        question: 'What does the input() function return by default in Python?',
        marks: 5,
        options: [
          'Integer',
          'Float',
          'String',
          'Boolean'
        ],
        correctAnswer: 2,
        explanation: 'The input() function in Python always returns a string by default. You need to typecast it to convert to other data types.'
      },
      {
        id: 4,
        question: 'Which function is used to print output in Python?',
        marks: 5,
        options: [
          'echo()',
          'printf()',
          'print()',
          'output()'
        ],
        correctAnswer: 2,
        explanation: 'The print() function is used to display output in Python.'
      },
      {
        id: 5,
        question: 'Which of the following is a valid variable name in Python?',
        marks: 5,
        options: [
          '1variable',
          'variable-name',
          '_variable',
          'class'
        ],
        correctAnswer: 2,
        explanation: 'Variable names can start with underscore (_) or letters. They cannot start with digits, contain hyphens, or be Python keywords.'
      },
      {
        id: 6,
        question: 'What will be the output of: print(type(10))?',
        marks: 5,
        options: [
          '<class \'float\'>',
          '<class \'int\'>',
          '<class \'str\'>',
          '<class \'number\'>'
        ],
        correctAnswer: 1,
        explanation: 'The number 10 is an integer, so type(10) returns <class \'int\'>.'
      },
      {
        id: 7,
        question: 'Which keyword is used to define a function in Python?',
        marks: 5,
        options: [
          'function',
          'def',
          'func',
          'define'
        ],
        correctAnswer: 1,
        explanation: 'The \'def\' keyword is used to define functions in Python.'
      },
      {
        id: 8,
        question: 'What is the correct way to create a variable in Python?',
        marks: 5,
        options: [
          'int x = 5',
          'var x = 5',
          'x = 5',
          'declare x = 5'
        ],
        correctAnswer: 2,
        explanation: 'Python uses dynamic typing. You simply assign a value to a variable name: x = 5'
      },
      {
        id: 9,
        question: 'Which of the following is a Python keyword?',
        marks: 5,
        options: [
          'variable',
          'function',
          'while',
          'integer'
        ],
        correctAnswer: 2,
        explanation: '\'while\' is a Python keyword used for loops. The others are not keywords.'
      },
      {
        id: 10,
        question: 'What will int("10") return?',
        marks: 5,
        options: [
          'Error',
          '10 (as integer)',
          '"10" (as string)',
          '10.0 (as float)'
        ],
        correctAnswer: 1,
        explanation: 'int("10") converts the string "10" to integer 10.'
      },
      {
        id: 11,
        question: 'Which operator is used for exponentiation in Python?',
        marks: 5,
        options: [
          '^',
          '**',
          'exp',
          'pow'
        ],
        correctAnswer: 1,
        explanation: 'The ** operator is used for exponentiation in Python. For example, 2**3 = 8.'
      },
      {
        id: 12,
        question: 'What is the output of: print(5 / 2)?',
        marks: 5,
        options: [
          '2',
          '2.5',
          '2.0',
          'Error'
        ],
        correctAnswer: 1,
        explanation: 'In Python 3, the / operator performs float division, so 5/2 = 2.5'
      },
      {
        id: 13,
        question: 'Which method is used to get the length of a string?',
        marks: 5,
        options: [
          'length()',
          'size()',
          'len()',
          'count()'
        ],
        correctAnswer: 2,
        explanation: 'The len() function returns the length of a string or any sequence in Python.'
      },
      {
        id: 14,
        question: 'What does the del keyword do?',
        marks: 5,
        options: [
          'Deletes a file',
          'Deletes a variable from memory',
          'Deletes a function',
          'Deletes a class'
        ],
        correctAnswer: 1,
        explanation: 'The del keyword removes a variable from the namespace and frees up memory.'
      },
      {
        id: 15,
        question: 'Which of the following is used for comments in Python?',
        marks: 5,
        options: [
          '//',
          '/* */',
          '#',
          '--'
        ],
        correctAnswer: 2,
        explanation: 'Python uses # for single-line comments and triple quotes for multi-line comments.'
      },
      {
        id: 16,
        question: 'What is the correct way to swap two variables a and b in Python?',
        marks: 5,
        options: [
          'a, b = b, a',
          'swap(a, b)',
          'temp = a; a = b; b = temp',
          'Both A and C'
        ],
        correctAnswer: 3,
        explanation: 'Both methods work in Python. However, a, b = b, a is the Pythonic way and doesn\'t need a temporary variable.'
      },
      {
        id: 17,
        question: 'Which of the following is a mutable data type in Python?',
        marks: 5,
        options: [
          'String',
          'Tuple',
          'List',
          'Integer'
        ],
        correctAnswer: 2,
        explanation: 'Lists are mutable (can be changed after creation). Strings, tuples, and integers are immutable.'
      }
    ]
  },
  '1-2-q1': {
    id: '1-2-q1',
    title: 'Quiz 2: Data Types and Operators',
    totalQuestions: 11,
    totalMarks: 55,
    questions: [
      {
        id: 1,
        question: 'What is the output of: print(type(5.0))',
        marks: 5,
        options: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'str'>",
          "<class 'double'>"
        ],
        correctAnswer: 1,
        explanation: '5.0 is a floating-point number, so its type is float.'
      },
      {
        id: 2,
        question: 'Which operator is used for exponentiation in Python?',
        marks: 5,
        options: ['^', '**', 'exp', 'pow'],
        correctAnswer: 1,
        explanation: 'The ** operator is used for exponentiation. For example, 2**3 = 8.'
      },
      {
        id: 3,
        question: 'What is the output of: print(10 // 3)',
        marks: 5,
        options: ['3.33', '3', '3.0', '4'],
        correctAnswer: 1,
        explanation: 'The // operator performs floor division, returning only the integer part: 10 // 3 = 3.'
      },
      {
        id: 4,
        question: 'Which of the following is an immutable data type?',
        marks: 5,
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswer: 2,
        explanation: 'Tuples are immutable, meaning they cannot be modified after creation.'
      },
      {
        id: 5,
        question: 'What is the output of: print(5 == 5 and 3 > 2)',
        marks: 5,
        options: ['True', 'False', 'Error', 'None'],
        correctAnswer: 0,
        explanation: 'Both conditions are true (5 == 5 is True and 3 > 2 is True), so the result is True.'
      },
      {
        id: 6,
        question: 'How do you access the last element of a list named "items"?',
        marks: 5,
        options: ['items[last]', 'items[-1]', 'items[end]', 'items[0]'],
        correctAnswer: 1,
        explanation: 'Negative indexing allows access from the end. items[-1] gets the last element.'
      },
      {
        id: 7,
        question: 'What does the "in" operator do?',
        marks: 5,
        options: [
          'Assigns a value',
          'Checks membership in a sequence',
          'Performs division',
          'Compares two values'
        ],
        correctAnswer: 1,
        explanation: 'The "in" operator checks if a value exists in a sequence like a list, tuple, or string.'
      },
      {
        id: 8,
        question: 'What is the output of: print(not False)',
        marks: 5,
        options: ['True', 'False', '1', '0'],
        correctAnswer: 0,
        explanation: 'The "not" operator inverts the boolean value. not False = True.'
      },
      {
        id: 9,
        question: 'Which data type is used to store key-value pairs?',
        marks: 5,
        options: ['List', 'Tuple', 'Dictionary', 'Set'],
        correctAnswer: 2,
        explanation: 'Dictionaries store data as key-value pairs, e.g., {1: "one", 2: "two"}.'
      },
      {
        id: 10,
        question: 'What is the result of: 10 if 5 > 3 else 20',
        marks: 5,
        options: ['10', '20', 'True', 'False'],
        correctAnswer: 0,
        explanation: 'This is a ternary operator. Since 5 > 3 is True, it returns 10.'
      },
      {
        id: 11,
        question: 'What is the output of: print(type([1, 2, 3]))',
        marks: 5,
        options: [
          "<class 'tuple'>",
          "<class 'list'>",
          "<class 'array'>",
          "<class 'set'>"
        ],
        correctAnswer: 1,
        explanation: 'Square brackets [] define a list in Python, so the type is list.'
      }
    ]
  }
};

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    // Check if quiz data is passed via location state
    if (location.state && location.state.quiz) {
      setQuiz(location.state.quiz);
    } else {
      // Fallback to local quizzesData
      const quizData = quizzesData[quizId];
      if (quizData) {
        setQuiz(quizData);
      } else {
        navigate('/courses');
      }
    }
  }, [quizId, navigate, location.state]);

  const handleComplete = (result) => {
    console.log('Quiz completed:', result);
    // Save to backend, update progress, etc.
  };

  const handleBack = () => {
    const state = location.state;
    
    if (state && state.fromCourse) {
      navigate(`/courses/${state.fromCourse}`, {
        state: {
          openModule: state.fromModule,
          openLesson: state.fromLesson,
          activeFilter: state.activeTab || 'quiz'
        }
      });
    } else {
      if (document.referrer && document.referrer.includes('/courses/')) {
        window.history.back();
      } else {
        navigate('/courses');
      }
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2f8d46] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
          <span>Back to Course</span>
        </button>

        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-600">{quiz.totalQuestions} Questions • {quiz.totalMarks} Marks</p>
        </div>

        <div className="w-24"></div>
      </div>

      {/* Quiz Component */}
      <Quiz quiz={quiz} onComplete={handleComplete} />
    </div>
  );
};

export default QuizPage;
