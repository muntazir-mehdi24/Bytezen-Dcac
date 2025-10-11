import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProblemSolver from '../../components/ProblemSolver';

// Sample problem data
const problemsData = {
  'input-in-python': {
    id: 'input-in-python',
    title: 'Input In Python',
    difficulty: 'Easy',
    accuracy: '55.81%',
    submissions: '73K+',
    points: 2,
    description: 'You need to perform three separate tasks based on the given input:',
    tasks: [
      {
        title: 'String Input and Print',
        description: 'Take a text input as a string and print it as it is.'
      },
      {
        title: 'Integer Input and Add',
        description: 'Take an integer input n, add 10 to it, and print the result.'
      },
      {
        title: 'Float Input and Multiply',
        description: 'Take a floating-point number as input, multiply it by 10, and print the result.'
      }
    ],
    examples: [
      {
        input: 's = "Hello", n = 20, f = 5.5',
        output: 'Hello\n30\n55.0',
        explanation: 'The string Hello is printed as it is.\nThe integer 20 is increased by 10 and results in 30.\nThe floating-point number 5.5 is multiplied by 10 and results in 55.0.'
      }
    ],
    moreExamplesButton: true,
    tags: ['Python', 'Input/Output', 'Basics'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Take string input and print the string input

# Take integer input and add 10 to the integer input and print

# Take floating-point input and multiply the float input by 10

########### Write your code above ###########`,
    testCases: [
      {
        input: 'Hello\n20\n5.5',
        expectedOutput: 'Hello\n30\n55.0'
      },
      {
        input: 'World\n15\n3.2',
        expectedOutput: 'World\n25\n32.0'
      },
      {
        input: 'Test\n0\n1.1',
        expectedOutput: 'Test\n10\n11.0'
      }
    ]
  },
  'hello-world-python': {
    id: 'hello-world-python',
    title: 'Hello World in Python',
    difficulty: 'Easy',
    accuracy: '98.5%',
    submissions: '125K+',
    points: 1,
    description: 'Write a Python program to print "Hello World" to the console. This is the most basic program in any programming language.',
    tasks: [
      {
        title: 'Print Hello World',
        description: 'Use the print() function to display "Hello World" exactly as shown.'
      }
    ],
    examples: [
      {
        input: 'No input required',
        output: 'Hello World',
        explanation: 'The program simply prints the string "Hello World" to the console.'
      }
    ],
    tags: ['Python', 'Basics', 'Print'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Print "Hello World"


########### Write your code above ###########`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Hello World'
      }
    ]
  },
  'basic-input-output': {
    id: 'basic-input-output',
    title: 'Basic Input and Output',
    difficulty: 'Easy',
    accuracy: '72.3%',
    submissions: '89K+',
    points: 2,
    description: 'Write a program that takes a name as input and prints a personalized greeting message.',
    tasks: [
      {
        title: 'Take Name Input',
        description: 'Read a name from the user using input() function.'
      },
      {
        title: 'Print Greeting',
        description: 'Print "Hello, [name]! Welcome to Python programming." where [name] is the input name.'
      }
    ],
    examples: [
      {
        input: 'Alice',
        output: 'Hello, Alice! Welcome to Python programming.',
        explanation: 'The program reads the name "Alice" and prints a personalized greeting message.'
      },
      {
        input: 'Bob',
        output: 'Hello, Bob! Welcome to Python programming.',
        explanation: 'The program reads the name "Bob" and prints a personalized greeting message.'
      }
    ],
    tags: ['Python', 'Input/Output', 'String'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Take name as input


# Print greeting message


########### Write your code above ###########`,
    testCases: [
      {
        input: 'Alice',
        expectedOutput: 'Hello, Alice! Welcome to Python programming.'
      },
      {
        input: 'Bob',
        expectedOutput: 'Hello, Bob! Welcome to Python programming.'
      },
      {
        input: 'Charlie',
        expectedOutput: 'Hello, Charlie! Welcome to Python programming.'
      }
    ]
  },
  'variable-assignment': {
    id: 'variable-assignment',
    title: 'Variable Assignment and Arithmetic',
    difficulty: 'Easy',
    accuracy: '68.9%',
    submissions: '65K+',
    points: 2,
    description: 'Practice variable assignment and basic arithmetic operations in Python.',
    tasks: [
      {
        title: 'Create Variables',
        description: 'Take two integers as input and store them in variables a and b.'
      },
      {
        title: 'Perform Operations',
        description: 'Calculate and print: sum (a+b), difference (a-b), product (a*b), and quotient (a/b).'
      },
      {
        title: 'Print Results',
        description: 'Print each result on a separate line in the order: sum, difference, product, quotient.'
      }
    ],
    examples: [
      {
        input: '10\n5',
        output: '15\n5\n50\n2.0',
        explanation: 'For a=10 and b=5:\nSum: 10+5 = 15\nDifference: 10-5 = 5\nProduct: 10*5 = 50\nQuotient: 10/5 = 2.0'
      },
      {
        input: '20\n4',
        output: '24\n16\n80\n5.0',
        explanation: 'For a=20 and b=4:\nSum: 20+4 = 24\nDifference: 20-4 = 16\nProduct: 20*4 = 80\nQuotient: 20/4 = 5.0'
      }
    ],
    tags: ['Python', 'Variables', 'Arithmetic', 'Operators'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Take two integers as input


# Calculate sum, difference, product, and quotient


# Print all results


########### Write your code above ###########`,
    testCases: [
      {
        input: '10\n5',
        expectedOutput: '15\n5\n50\n2.0'
      },
      {
        input: '20\n4',
        expectedOutput: '24\n16\n80\n5.0'
      },
      {
        input: '100\n10',
        expectedOutput: '110\n90\n1000\n10.0'
      }
    ]
  },
  'simple-calculator': {
    id: 'simple-calculator',
    title: 'Simple Calculator',
    difficulty: 'Medium',
    accuracy: '54.2%',
    submissions: '52K+',
    points: 3,
    description: 'Create a simple calculator that performs operations based on user input.',
    tasks: [
      {
        title: 'Take Inputs',
        description: 'Read two numbers (num1 and num2) and an operator (+, -, *, /) from the user.'
      },
      {
        title: 'Perform Operation',
        description: 'Based on the operator, perform the corresponding arithmetic operation.'
      },
      {
        title: 'Print Result',
        description: 'Print the result of the operation. For division, print the result as a float.'
      }
    ],
    examples: [
      {
        input: '10\n5\n+',
        output: '15',
        explanation: 'The program reads 10, 5, and + operator, then calculates 10+5 = 15'
      },
      {
        input: '20\n4\n*',
        output: '80',
        explanation: 'The program reads 20, 4, and * operator, then calculates 20*4 = 80'
      },
      {
        input: '15\n3\n/',
        output: '5.0',
        explanation: 'The program reads 15, 3, and / operator, then calculates 15/3 = 5.0'
      }
    ],
    tags: ['Python', 'Conditionals', 'Operators', 'Calculator'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Take two numbers as input
num1 = float(input())
num2 = float(input())

# Take operator as input
operator = input()

# Perform operation based on operator and print result


########### Write your code above ###########`,
    testCases: [
      {
        input: '10\n5\n+',
        expectedOutput: '15.0'
      },
      {
        input: '20\n4\n*',
        expectedOutput: '80.0'
      },
      {
        input: '15\n3\n/',
        expectedOutput: '5.0'
      },
      {
        input: '30\n7\n-',
        expectedOutput: '23.0'
      }
    ]
  },
  'data-types-practice': {
    id: 'data-types-practice',
    title: 'Python Data Types Practice',
    difficulty: 'Easy',
    accuracy: '61.7%',
    submissions: '48K+',
    points: 2,
    description: 'Practice working with different Python data types including integers, floats, strings, and booleans.',
    tasks: [
      {
        title: 'Integer Operations',
        description: 'Take an integer input and print its double (multiply by 2).'
      },
      {
        title: 'String Operations',
        description: 'Take a string input and print its length using len() function.'
      },
      {
        title: 'Boolean Operations',
        description: 'Take two integers and print True if the first is greater than the second, otherwise print False.'
      }
    ],
    examples: [
      {
        input: '5\nPython\n10\n3',
        output: '10\n6\nTrue',
        explanation: 'Integer 5 doubled = 10\nString "Python" has length 6\n10 > 3 is True'
      },
      {
        input: '7\nHello\n2\n8',
        output: '14\n5\nFalse',
        explanation: 'Integer 7 doubled = 14\nString "Hello" has length 5\n2 > 8 is False'
      }
    ],
    tags: ['Python', 'Data Types', 'Boolean', 'String Methods'],
    starterCode: `#User function Template for python3

########### Write your code below ###########

# Take integer input and print its double


# Take string input and print its length


# Take two integers and compare them


########### Write your code above ###########`,
    testCases: [
      {
        input: '5\nPython\n10\n3',
        expectedOutput: '10\n6\nTrue'
      },
      {
        input: '7\nHello\n2\n8',
        expectedOutput: '14\n5\nFalse'
      },
      {
        input: '15\nWorld\n20\n20',
        expectedOutput: '30\n5\nFalse'
      }
    ]
  },
  'day2-problem-1': {
    id: 'day2-problem-1',
    title: 'Type Checker',
    difficulty: 'Easy',
    accuracy: '65.2%',
    submissions: '12K+',
    points: 2,
    description: 'Write a program that takes an input and prints its data type.',
    tasks: [
      {
        title: 'Take Input',
        description: 'Read input from the user.'
      },
      {
        title: 'Determine Type',
        description: 'Try to convert to int first, then float, otherwise keep as string.'
      },
      {
        title: 'Print Type',
        description: 'Print the type of the converted value.'
      }
    ],
    examples: [
      {
        input: '42',
        output: "<class 'int'>",
        explanation: 'The input "42" can be converted to an integer, so the type is int.'
      },
      {
        input: '3.14',
        output: "<class 'float'>",
        explanation: 'The input "3.14" can be converted to a float, so the type is float.'
      }
    ],
    tags: ['Python', 'Data Types', 'Type Conversion'],
    starterCode: `# Take input from user
value = input()

# Convert to appropriate type and print its type
# Hint: Try converting to int first, then float, otherwise keep as string
`,
    testCases: [
      {
        input: '42',
        expectedOutput: "<class 'int'>"
      },
      {
        input: '3.14',
        expectedOutput: "<class 'float'>"
      },
      {
        input: 'Hello',
        expectedOutput: "<class 'str'>"
      }
    ]
  },
  'day2-problem-2': {
    id: 'day2-problem-2',
    title: 'List Operations',
    difficulty: 'Easy',
    accuracy: '78.5%',
    submissions: '15K+',
    points: 2,
    description: 'Create a list with elements [10, 20, 30, 40, 50]. Print the first element, last element, and the element at index 2.',
    tasks: [
      {
        title: 'Create List',
        description: 'Create a list with the given elements.'
      },
      {
        title: 'Access Elements',
        description: 'Use indexing to access specific elements.'
      }
    ],
    examples: [
      {
        input: '',
        output: '10\n50\n30',
        explanation: 'First element: 10, Last element: 50, Element at index 2: 30'
      }
    ],
    tags: ['Python', 'Lists', 'Indexing'],
    starterCode: `# Create the list
my_list = [10, 20, 30, 40, 50]

# Print first element


# Print last element


# Print element at index 2

`,
    testCases: [
      {
        input: '',
        expectedOutput: '10\n50\n30'
      }
    ]
  },
  'day2-problem-3': {
    id: 'day2-problem-3',
    title: 'Simple Calculator',
    difficulty: 'Easy',
    accuracy: '72.1%',
    submissions: '18K+',
    points: 2,
    description: 'Take two numbers as input and print their sum, difference, product, and quotient (division).',
    tasks: [
      {
        title: 'Take Inputs',
        description: 'Read two numbers from the user.'
      },
      {
        title: 'Perform Operations',
        description: 'Calculate sum, difference, product, and quotient.'
      }
    ],
    examples: [
      {
        input: '10\n5',
        output: '15\n5\n50\n2.0',
        explanation: 'Sum: 15, Difference: 5, Product: 50, Quotient: 2.0'
      }
    ],
    tags: ['Python', 'Arithmetic', 'Operators'],
    starterCode: `# Take two numbers as input
a = int(input())
b = int(input())

# Print sum, difference, product, and quotient




`,
    testCases: [
      {
        input: '10\n5',
        expectedOutput: '15\n5\n50\n2.0'
      },
      {
        input: '20\n4',
        expectedOutput: '24\n16\n80\n5.0'
      }
    ]
  },
  'day2-problem-4': {
    id: 'day2-problem-4',
    title: 'Even or Odd Checker',
    difficulty: 'Medium',
    accuracy: '68.9%',
    submissions: '22K+',
    points: 3,
    description: 'Write a program that takes a number as input and prints "Even" if the number is even, otherwise prints "Odd". Use the modulus operator (%).',
    tasks: [
      {
        title: 'Take Input',
        description: 'Read a number from the user.'
      },
      {
        title: 'Check Even/Odd',
        description: 'Use modulus operator to determine if the number is even or odd.'
      }
    ],
    examples: [
      {
        input: '10',
        output: 'Even',
        explanation: '10 % 2 = 0, so the number is even.'
      },
      {
        input: '7',
        output: 'Odd',
        explanation: '7 % 2 = 1, so the number is odd.'
      }
    ],
    tags: ['Python', 'Conditionals', 'Modulus'],
    starterCode: `# Take number as input
num = int(input())

# Check if even or odd using modulus operator

`,
    testCases: [
      {
        input: '10',
        expectedOutput: 'Even'
      },
      {
        input: '7',
        expectedOutput: 'Odd'
      },
      {
        input: '0',
        expectedOutput: 'Even'
      }
    ]
  },
  'day2-problem-5': {
    id: 'day2-problem-5',
    title: 'Grade Calculator',
    difficulty: 'Medium',
    accuracy: '61.3%',
    submissions: '19K+',
    points: 3,
    description: 'Take marks (0-100) as input and print grade: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60).',
    tasks: [
      {
        title: 'Take Input',
        description: 'Read marks from the user.'
      },
      {
        title: 'Determine Grade',
        description: 'Use if-elif-else to determine the grade based on marks.'
      }
    ],
    examples: [
      {
        input: '95',
        output: 'A',
        explanation: 'Marks 95 falls in range 90-100, so grade is A.'
      },
      {
        input: '82',
        output: 'B',
        explanation: 'Marks 82 falls in range 80-89, so grade is B.'
      }
    ],
    tags: ['Python', 'Conditionals', 'If-Elif-Else'],
    starterCode: `# Take marks as input
marks = int(input())

# Determine and print grade using if-elif-else

`,
    testCases: [
      {
        input: '95',
        expectedOutput: 'A'
      },
      {
        input: '82',
        expectedOutput: 'B'
      },
      {
        input: '55',
        expectedOutput: 'F'
      }
    ]
  },
  'day2-problem-6': {
    id: 'day2-problem-6',
    title: 'Membership Test',
    difficulty: 'Medium',
    accuracy: '74.8%',
    submissions: '16K+',
    points: 3,
    description: 'Create a list of fruits: ["apple", "banana", "cherry", "date"]. Take a fruit name as input and check if it exists in the list. Print "Found" or "Not Found".',
    tasks: [
      {
        title: 'Create List',
        description: 'Create a list of fruits.'
      },
      {
        title: 'Check Membership',
        description: 'Use the "in" operator to check if the input fruit exists in the list.'
      }
    ],
    examples: [
      {
        input: 'banana',
        output: 'Found',
        explanation: '"banana" is in the list, so print "Found".'
      },
      {
        input: 'mango',
        output: 'Not Found',
        explanation: '"mango" is not in the list, so print "Not Found".'
      }
    ],
    tags: ['Python', 'Lists', 'Membership Operators'],
    starterCode: `# Create list of fruits
fruits = ["apple", "banana", "cherry", "date"]

# Take input
fruit = input()

# Check membership and print result

`,
    testCases: [
      {
        input: 'banana',
        expectedOutput: 'Found'
      },
      {
        input: 'mango',
        expectedOutput: 'Not Found'
      },
      {
        input: 'apple',
        expectedOutput: 'Found'
      }
    ]
  }
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    // Check if problem data is passed via location state
    if (location.state && location.state.problem) {
      console.log('Problem data from location state:', location.state.problem);
      setProblem(location.state.problem);
    } else {
      // Fallback to local problemsData
      const problemData = problemsData[problemId];
      console.log('Problem data from local:', problemData);
      if (problemData) {
        setProblem(problemData);
      } else {
        // Redirect to problems list if not found
        navigate('/courses');
      }
    }
  }, [problemId, navigate, location.state]);

  const handleSubmit = (result) => {
    console.log('Submission result:', result);
    // Handle submission - update progress, save to database, etc.
  };

  const handleBack = () => {
    // Check if we have state from the course page
    const state = location.state;
    
    if (state && state.fromCourse) {
      // Navigate back to the course with the specific lesson and tab
      navigate(`/courses/${state.fromCourse}`, {
        state: {
          openModule: state.fromModule,
          openLesson: state.fromLesson,
          activeFilter: state.activeTab || 'problems'
        }
      });
    } else {
      // Fallback: try browser back or go to courses
      if (document.referrer && document.referrer.includes('/courses/')) {
        window.history.back();
      } else {
        navigate('/courses');
      }
    }
  };

  if (!problem) {
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
          <span>Back to Problems</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
            💡 Problem
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
            📊 Submissions
          </button>
        </div>
      </div>

      {/* Problem Solver Component */}
      <ProblemSolver problem={problem} onSubmit={handleSubmit} />
    </div>
  );
};

export default ProblemPage;
