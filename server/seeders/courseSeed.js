import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import connectDB from '../db.js';

dotenv.config();

const courses = [
  {
    title: 'AI/ML Mastery',
    description: 'Master machine learning algorithms and AI concepts with Python.',
    category: 'AI/ML',
    duration: '24 weeks',
    level: 'Advanced',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    image: '/ai-ml-course.jpg',
    modules: [
      {
        id: 'week-1',
        title: 'Week 1: Getting Started with Python',
        duration: '7 days',
        lessons: [
          { 
            id: '1-0', 
            title: 'Week 1: Course Plan', 
            duration: '1 Article',
            type: 'article',
            completed: false,
            content: 'Course plan content here...'
          },
          { 
            id: '1-1', 
            title: 'Day 1: Introduction & Python Setup', 
            duration: '5 Articles • 5 Problems • 10 MCQs',
            type: 'day',
            completed: false,
            articles: [],
            problems: [],
            quiz: []
          }
        ]
      }
    ],
    whatYouWillLearn: [
      'Fundamentals of AI and Machine Learning',
      'Python programming for data science',
      'Data preprocessing and visualization',
      'Building and training ML models',
      'Model evaluation and optimization',
      'Real-world AI applications'
    ],
    requirements: [
      'Basic programming knowledge',
      'High school level mathematics',
      'Python installation (we\'ll guide you)'
    ]
  },
  {
    title: 'Data Analytics',
    description: 'Learn data analysis and visualization with Python and popular libraries.',
    category: 'Data Science',
    duration: '18 weeks',
    level: 'Intermediate',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    image: '/data-analytics-course.jpg',
    modules: [],
    whatYouWillLearn: [
      'Data cleaning and preprocessing',
      'Exploratory data analysis',
      'Data visualization with Matplotlib and Seaborn',
      'Statistical analysis',
      'Creating data dashboards',
      'Telling stories with data'
    ],
    requirements: [
      'Basic Python knowledge',
      'No prior data analysis experience needed',
      'Curiosity to explore data'
    ]
  },
  {
    title: 'MERN Stack Development',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    category: 'Web Development',
    duration: '14 weeks',
    level: 'Intermediate',
    instructor: 'Tushar Pandey & Mehul Gupta',
    image: '/mern-course.jpg',
    modules: [],
    whatYouWillLearn: [
      'Full-stack JavaScript development',
      'Building RESTful APIs with Express',
      'Frontend development with React',
      'Database design with MongoDB',
      'User authentication and authorization',
      'Deploying MERN applications'
    ],
    requirements: [
      'Basic HTML, CSS, and JavaScript',
      'Basic understanding of web development',
      'Node.js and npm installed'
    ]
  }
];

const seedCourses = async () => {
  try {
    await connectDB();
    
    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');
    
    // Insert new courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Successfully seeded ${createdCourses.length} courses`);
    
    createdCourses.forEach(course => {
      console.log(`  - ${course.title} (ID: ${course._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
