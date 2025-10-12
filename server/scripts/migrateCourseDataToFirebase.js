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

// Course data to migrate (extracted from CourseDetail.jsx)
const coursesData = [
  {
    id: '1',
    title: 'AI/ML Mastery',
    description: 'Master machine learning algorithms and AI concepts with Python.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    duration: '24 weeks',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    thumbnail: '/ai-ml-course.jpg',
    modules: [] // Will be populated from the actual course data
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
    modules: []
  },
  {
    id: '3',
    title: 'MERN Stack',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '14 weeks',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    thumbnail: '/mern-stack-course.jpg',
    modules: []
  }
];

async function migrateCourses() {
  try {
    console.log('Starting course migration to Firebase...\n');

    for (const course of coursesData) {
      console.log(`Migrating course: ${course.title}...`);
      
      const courseData = {
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration,
        instructor: course.instructor || 'Muntazir Mehdi & Keshav Kashyap',
        thumbnail: course.thumbnail || '',
        modules: course.modules || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Create course with custom ID
      await db.collection('courses').doc(course.id).set(courseData);
      
      console.log(`✅ Successfully migrated: ${course.title}`);
    }

    console.log('\n✅ All courses migrated successfully!');
    console.log('\nNext steps:');
    console.log('1. The courses are now in Firebase with basic info');
    console.log('2. Use the admin panel to add weeks/modules and content');
    console.log('3. Or run the detailed migration script to import all course content');
    
    process.exit(0);
  } catch (error) {
    console.error('Error migrating courses:', error);
    process.exit(1);
  }
}

migrateCourses();
