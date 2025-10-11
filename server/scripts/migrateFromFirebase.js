import admin from 'firebase-admin';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/Student.js';
import Event from '../models/Event.js';
import Insight from '../models/Insight.js';
import User from '../models/User.js';

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Migrate Users
const migrateUsers = async () => {
  console.log('\n📦 Migrating Users...');
  try {
    const usersSnapshot = await db.collection('users').get();
    let count = 0;
    
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      
      // Check if user already exists
      const existingUser = await User.findOne({ uid: doc.id });
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        continue;
      }
      
      await User.create({
        uid: doc.id,
        name: userData.name || userData.displayName,
        email: userData.email,
        role: userData.role || 'student',
        photoURL: userData.photoURL,
        createdAt: userData.createdAt?.toDate() || new Date()
      });
      
      count++;
      console.log(`✅ Migrated user: ${userData.email}`);
    }
    
    console.log(`✅ Migrated ${count} users`);
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
};

// Migrate Students
const migrateStudents = async () => {
  console.log('\n📦 Migrating Students...');
  try {
    const studentsSnapshot = await db.collection('students').get();
    let count = 0;
    
    for (const doc of studentsSnapshot.docs) {
      const studentData = doc.data();
      
      // Check if student already exists
      const existingStudent = await Student.findOne({ 
        $or: [
          { uid: doc.id },
          { email: studentData.email }
        ]
      });
      
      if (existingStudent) {
        console.log(`⏭️  Student ${studentData.email} already exists, skipping...`);
        continue;
      }
      
      await Student.create({
        uid: doc.id,
        name: studentData.name,
        email: studentData.email,
        rollNumber: studentData.rollNumber,
        phone: studentData.phone,
        department: studentData.department,
        division: studentData.division,
        year: studentData.year,
        enrolledCourses: studentData.enrolledCourses || [],
        role: 'student',
        isActive: studentData.isActive !== false,
        createdAt: studentData.createdAt?.toDate() || new Date()
      });
      
      count++;
      console.log(`✅ Migrated student: ${studentData.name} (${studentData.email})`);
    }
    
    console.log(`✅ Migrated ${count} students`);
  } catch (error) {
    console.error('❌ Error migrating students:', error);
  }
};

// Migrate Events
const migrateEvents = async () => {
  console.log('\n📦 Migrating Events...');
  try {
    const eventsSnapshot = await db.collection('events').get();
    let count = 0;
    
    for (const doc of eventsSnapshot.docs) {
      const eventData = doc.data();
      
      // Check if event already exists
      const existingEvent = await Event.findOne({ 
        title: eventData.title,
        date: eventData.date?.toDate()
      });
      
      if (existingEvent) {
        console.log(`⏭️  Event "${eventData.title}" already exists, skipping...`);
        continue;
      }
      
      await Event.create({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date?.toDate() || new Date(),
        time: eventData.time,
        location: eventData.location,
        eventType: eventData.eventType || 'workshop',
        mode: eventData.mode || 'offline',
        registrationLink: eventData.registrationLink,
        maxParticipants: eventData.maxParticipants,
        isPublished: eventData.isPublished !== false,
        images: eventData.images || [],
        createdAt: eventData.createdAt?.toDate() || new Date()
      });
      
      count++;
      console.log(`✅ Migrated event: ${eventData.title}`);
    }
    
    console.log(`✅ Migrated ${count} events`);
  } catch (error) {
    console.error('❌ Error migrating events:', error);
  }
};

// Migrate ByteLogs (Insights)
const migrateInsights = async () => {
  console.log('\n📦 Migrating ByteLogs (Insights)...');
  try {
    const insightsSnapshot = await db.collection('insights').get();
    let count = 0;
    
    for (const doc of insightsSnapshot.docs) {
      const insightData = doc.data();
      
      // Check if insight already exists
      const existingInsight = await Insight.findOne({ 
        title: insightData.title
      });
      
      if (existingInsight) {
        console.log(`⏭️  ByteLog "${insightData.title}" already exists, skipping...`);
        continue;
      }
      
      await Insight.create({
        title: insightData.title,
        content: insightData.content,
        author: insightData.author || 'Admin',
        thumbnailUrl: insightData.thumbnailUrl,
        slug: insightData.slug || insightData.title.toLowerCase().replace(/\s+/g, '-'),
        isPublished: insightData.isPublished !== false,
        tags: insightData.tags || [],
        viewCount: insightData.viewCount || 0,
        date: insightData.date?.toDate() || insightData.createdAt?.toDate() || new Date()
      });
      
      count++;
      console.log(`✅ Migrated bytelog: ${insightData.title}`);
    }
    
    console.log(`✅ Migrated ${count} bytelogs`);
  } catch (error) {
    console.error('❌ Error migrating insights:', error);
  }
};

// Main migration function
const migrate = async () => {
  console.log('🚀 Starting Firebase to MongoDB Migration...\n');
  
  await connectDB();
  
  await migrateUsers();
  await migrateStudents();
  await migrateEvents();
  await migrateInsights();
  
  console.log('\n✅ Migration Complete!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${await User.countDocuments()}`);
  console.log(`   Students: ${await Student.countDocuments()}`);
  console.log(`   Events: ${await Event.countDocuments()}`);
  console.log(`   ByteLogs: ${await Insight.countDocuments()}`);
  
  process.exit(0);
};

// Run migration
migrate().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
