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
        // Try multiple possible field names for user ID
        const uid = data.userId || data.uid || data.id || doc.id;
        
        return {
          uid: uid,
          name: data.name || data.displayName || 'Unknown',
          email: data.email || '',
          role: data.role || 'student',
          rollNumber: data.rollNumber || '',
          department: data.department || '',
          enrolledCourses: data.enrolledCourses || []
        };
      })
      .filter(user => user.role === 'student');

    console.log(`Found ${students.length} students in Firestore`);

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

// @route   POST /api/enrollment/set-course
// @desc    Set student's course (replaces all enrollments with single course)
// @access  Private (Admin/Instructor)
router.post('/set-course', protect, async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and Course ID are required'
      });
    }

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(studentId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Replace enrolledCourses with single course
    await userRef.update({
      enrolledCourses: [String(courseId)],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: 'Student course updated successfully'
    });
  } catch (error) {
    console.error('Error setting student course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set student course',
      message: error.message
    });
  }
});

// @route   POST /api/students
// @desc    Create a new student
// @access  Private (Admin/Instructor)
router.post('/students', protect, async (req, res) => {
  try {
    const { name, email, rollNumber, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    
    // Check if user with email already exists
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user document
    const newUserRef = db.collection('users').doc();
    const userData = {
      uid: newUserRef.id,
      name,
      email,
      rollNumber: rollNumber || '',
      department: department || '',
      role: 'student',
      enrolledCourses: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await newUserRef.set(userData);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { ...userData, uid: newUserRef.id }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create student',
      message: error.message
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Private (Admin/Instructor)
router.put('/students/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, department } = req.body;

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (rollNumber !== undefined) updateData.rollNumber = rollNumber;
    if (department !== undefined) updateData.department = department;
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: { uid: id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student',
      message: error.message
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private (Admin/Instructor)
router.delete('/students/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin not initialized'
      });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    await userRef.delete();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student',
      message: error.message
    });
  }
});

export default router;
