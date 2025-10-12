import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../config/serviceAccountKey.json'), 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Helper function to generate unique IDs
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// This script will read the CourseDetail.jsx file and extract course data
// For now, we'll manually structure the courses based on the existing data

const courses = [
  {
    id: '1',
    title: 'AI/ML Mastery',
    description: 'Master machine learning algorithms and AI concepts with Python.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    duration: '24 weeks',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    thumbnail: '/ai-ml-course.jpg',
    // We'll add a sample week structure - you can expand this
    modules: [
      {
        id: generateId('week'),
        title: 'Week 1: Getting Started with Python',
        description: 'Learn Python fundamentals and set up your development environment',
        order: 1,
        lessons: [
          {
            id: generateId('lesson'),
            title: 'Week 1: Course Plan',
            type: 'article',
            content: `# Week 1: Course Plan

Welcome to Week 1 of your Data Science journey! This week sets the programming foundation you'll rely on throughout your course. You'll start by setting up Python and understanding how it works, then build your skills with variables, data types, control flow, functions and data structures. By the end of the week, you'll be comfortable writing clean, efficient Python code with practical features like file handling, OOP and decorators.

## Day 1 – Installation, Input/Output and Variables

Start from scratch by installing Python and writing your first few lines of code.

- Install Python and set up your environment
- Understand basic input and output operations
- Learn about variables and naming conventions
- Get introduced to Python keywords

## Day 2 – Data Types, Operators and Conditionals

Dive into how Python stores data and processes logic.

- Understand built-in data types like int, float, string, bool
- Use arithmetic, comparison and logical operators
- Write conditional programs using if, elif and else

## Day 3 – Loops, Functions and Lambda

Automate repetition and reuse code with loops and functions.

- Use for and while loops to iterate through data
- Learn how to define and call functions
- Explore lambda functions and understand when to use them

## Day 4 – Strings and Lists

Start working with sequences, two of Python's most used data types.

- Manipulate strings and use built-in string methods
- Learn list creation, indexing, slicing and common list operations

## Day 5 – Tuples, Sets and Dictionaries

Expand your toolkit with more advanced Python data structures.

- Understand immutability with tuples
- Explore unique-value storage using sets
- Create and manipulate key-value pairs with dictionaries

## Day 6 – Collections, Comprehensions and OOP

Make your Python code more efficient and organized.

- Learn specialized container types from the collections module
- Write one-liner logic with list, set and dictionary comprehensions
- Get introduced to Object-Oriented Programming in Python

## Day 7 – Exception Handling, File I/O and Advanced Python

Wrap up the week with advanced, real-world coding skills.

- Handle runtime errors with try, except, finally
- Work with files: read, write and manipulate text files
- Explore useful features: generators, decorators, context managers and a basic intro to APIs`,
            difficulty: 'Easy',
            points: 10,
            timeEstimate: 60,
            images: [],
            order: 1
          },
          {
            id: generateId('lesson'),
            title: 'Day 1: Introduction & Python Setup',
            type: 'article',
            content: `# Day 1: Introduction & Python Setup

## Installing Python

Python is a versatile and beginner-friendly programming language. Let's get started by installing it on your system.

### Windows
1. Visit [python.org](https://python.org)
2. Download the latest Python installer
3. Run the installer and check "Add Python to PATH"
4. Verify installation: Open Command Prompt and type \`python --version\`

### macOS
1. Python 2.x comes pre-installed, but we need Python 3.x
2. Install using Homebrew: \`brew install python3\`
3. Or download from [python.org](https://python.org)
4. Verify: \`python3 --version\`

### Linux
Most distributions come with Python. Update if needed:
\`\`\`bash
sudo apt update
sudo apt install python3
\`\`\`

## Your First Python Program

Create a file called \`hello.py\`:

\`\`\`python
print("Hello, World!")
\`\`\`

Run it:
\`\`\`bash
python hello.py
\`\`\`

## Variables and Data Types

Variables store data values:

\`\`\`python
# Integer
age = 25

# Float
height = 5.9

# String
name = "Alice"

# Boolean
is_student = True

print(age, height, name, is_student)
\`\`\`

## Input and Output

Get user input:

\`\`\`python
name = input("Enter your name: ")
print(f"Hello, {name}!")
\`\`\`

## Practice Exercises

1. Create a program that asks for your name and age, then prints a greeting
2. Calculate the area of a rectangle using user input
3. Convert temperature from Celsius to Fahrenheit`,
            difficulty: 'Easy',
            points: 10,
            timeEstimate: 45,
            images: [],
            order: 2
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Data Analytics',
    description: 'Learn data analysis and visualization with Python and popular libraries.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    thumbnail: '/data-analytics-course.jpg',
    modules: [
      {
        id: generateId('week'),
        title: 'Week 1: Introduction to Data Analytics',
        description: 'Get started with data analytics concepts and tools',
        order: 1,
        lessons: [
          {
            id: generateId('lesson'),
            title: 'What is Data Analytics?',
            type: 'article',
            content: `# Introduction to Data Analytics

Data analytics is the process of examining datasets to draw conclusions about the information they contain. It's used across industries to make informed business decisions.

## Key Concepts

- **Descriptive Analytics**: What happened?
- **Diagnostic Analytics**: Why did it happen?
- **Predictive Analytics**: What will happen?
- **Prescriptive Analytics**: What should we do?

## Tools We'll Use

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn

## Your First Analysis

Let's analyze a simple dataset:

\`\`\`python
import pandas as pd

# Create a simple dataset
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'Salary': [50000, 60000, 70000]
}

df = pd.DataFrame(data)
print(df)
print(df.describe())
\`\`\``,
            difficulty: 'Easy',
            points: 10,
            timeEstimate: 30,
            images: [],
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'MERN Stack Development',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '14 weeks',
    instructor: 'Tushar Pandey & Mehul Gupta',
    thumbnail: '/mern-course.jpg',
    modules: [
      {
        id: generateId('week'),
        title: 'Week 1: Introduction to MERN Stack',
        description: 'Understanding the MERN stack architecture',
        order: 1,
        lessons: [
          {
            id: generateId('lesson'),
            title: 'What is MERN Stack?',
            type: 'article',
            content: `# MERN Stack Overview

MERN is a full-stack JavaScript framework consisting of:

## M - MongoDB
A NoSQL database that stores data in flexible, JSON-like documents.

## E - Express.js
A minimal and flexible Node.js web application framework.

## R - React
A JavaScript library for building user interfaces.

## N - Node.js
A JavaScript runtime built on Chrome's V8 engine.

## Why MERN?

- **Single Language**: JavaScript everywhere
- **Fast Development**: Reusable components
- **Strong Community**: Extensive resources
- **Scalable**: Handles large applications

## Your First MERN App

We'll build a simple todo application that demonstrates all four technologies working together.

### Prerequisites
- Node.js installed
- Basic JavaScript knowledge
- Understanding of HTML/CSS

Let's get started!`,
            difficulty: 'Easy',
            points: 10,
            timeEstimate: 30,
            images: [],
            order: 1
          }
        ]
      }
    ]
  }
];

async function migrateCourses() {
  try {
    console.log('🚀 Starting full course migration to Firebase...\n');

    for (const course of courses) {
      console.log(`📚 Migrating course: ${course.title}...`);
      
      const courseData = {
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        modules: course.modules,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Create course with custom ID
      await db.collection('courses').doc(course.id).set(courseData);
      
      console.log(`✅ Successfully migrated: ${course.title}`);
      console.log(`   - ${course.modules.length} module(s)`);
      const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
      console.log(`   - ${totalLessons} lesson(s)\n`);
    }

    console.log('✅ All courses migrated successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Total courses: ${courses.length}`);
    console.log(`   - All courses now in Firebase Firestore`);
    console.log(`   - Ready for management through admin panel\n`);
    
    console.log('🎯 Next Steps:');
    console.log('   1. Go to /courses - See courses from Firebase');
    console.log('   2. Go to /admin/courses - Manage course content');
    console.log('   3. Add more weeks/lessons through admin panel');
    console.log('   4. Edit/delete content as needed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating courses:', error);
    process.exit(1);
  }
}

migrateCourses();
