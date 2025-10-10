import express from 'express';
import admin from 'firebase-admin';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/enrollment/students
// @desc    Get all students with their enrollment data
// @access  Private (Admin/Instructor)
router.get('/students', protect, async (req, res) => {
  try {
    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').get();

    const students = usersSnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          uid: data.userId || doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          role: data.role || 'student',
          enrolledCourses: data.enrolledCourses || []
        };
      })
      .filter(user => user.role === 'student');

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
      message: error.message
    });
  }
});

// @route   POST /api/enrollment/bulk-enroll-selected
// @desc    Enroll selected students in a course
// @access  Private (Admin/Instructor)
router.post('/bulk-enroll-selected', protect, async (req, res) => {
  try {
    const { courseId, studentIds } = req.body;

    if (!courseId || !studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        error: 'Course ID and student IDs array are required'
      });
    }

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const batch = db.batch();
    let enrolledCount = 0;
    let alreadyEnrolledCount = 0;

    for (const studentId of studentIds) {
      const userRef = db.collection('users').doc(studentId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) continue;

      const userData = userDoc.data();
      const enrolledCourses = userData.enrolledCourses || [];

      // Check if already enrolled
      if (enrolledCourses.includes(courseId) || 
          enrolledCourses.includes(parseInt(courseId)) ||
          enrolledCourses.includes(String(courseId))) {
        alreadyEnrolledCount++;
        continue;
      }

      // Add course to enrolledCourses
      batch.update(userRef, {
        enrolledCourses: admin.firestore.FieldValue.arrayUnion(String(courseId))
      });
      enrolledCount++;
    }

    await batch.commit();

    res.status(200).json({
      success: true,
      message: `Successfully enrolled ${enrolledCount} students`,
      data: {
        enrolledCount,
        alreadyEnrolledCount,
        totalRequested: studentIds.length
      }
    });
  } catch (error) {
    console.error('Error enrolling selected students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll students',
      message: error.message
    });
  }
});

// @route   POST /api/enrollment/bulk-enroll
// @desc    Bulk enroll all students in a course
// @access  Private (Admin/Instructor)
router.post('/bulk-enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: 'Course ID is required'
      });
    }

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    
    // Get all students
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'student')
      .get();

    let enrolledCount = 0;
    let alreadyEnrolledCount = 0;
    const batch = db.batch();

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const enrolledCourses = data.enrolledCourses || [];
      
      // Check if already enrolled
      if (enrolledCourses.includes(courseId) || 
          enrolledCourses.includes(parseInt(courseId)) ||
          enrolledCourses.includes(String(courseId))) {
        alreadyEnrolledCount++;
        return;
      }

      // Add course to enrolledCourses array
      batch.update(doc.ref, {
        enrolledCourses: admin.firestore.FieldValue.arrayUnion(String(courseId))
      });
      enrolledCount++;
    });

    // Commit the batch
    await batch.commit();

    res.status(200).json({
      success: true,
      message: `Successfully enrolled ${enrolledCount} students in course ${courseId}`,
      data: {
        enrolledCount,
        alreadyEnrolledCount,
        totalStudents: usersSnapshot.docs.length
      }
    });
  } catch (error) {
    console.error('Error bulk enrolling students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll students',
      message: error.message
    });
  }
});

// @route   POST /api/enrollment/enroll
// @desc    Enroll a single student in a course
// @access  Private
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Course ID and User ID are required'
      });
    }

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();
    const enrolledCourses = userData.enrolledCourses || [];

    // Check if already enrolled
    if (enrolledCourses.includes(courseId) || 
        enrolledCourses.includes(parseInt(courseId)) ||
        enrolledCourses.includes(String(courseId))) {
      return res.status(400).json({
        success: false,
        error: 'Student already enrolled in this course'
      });
    }

    // Add course to enrolledCourses
    await userRef.update({
      enrolledCourses: admin.firestore.FieldValue.arrayUnion(String(courseId))
    });

    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll student',
      message: error.message
    });
  }
});

export default router;
