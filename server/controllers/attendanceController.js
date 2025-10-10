import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import admin from 'firebase-admin';

// @desc    Mark attendance for a session
// @route   POST /api/attendance/mark
// @access  Private (Teacher/Admin)
export const markAttendance = async (req, res) => {
  try {
    const { courseId, userId, sessionDate, sessionTitle, sessionType, status, notes, duration } = req.body;
    const markedBy = req.user.uid;

    // Validate required fields
    if (!courseId || !userId || !sessionDate || !sessionTitle || !status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Check if attendance already exists for this session
    const existingAttendance = await Attendance.findOne({
      courseId,
      userId,
      sessionDate: new Date(sessionDate)
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.sessionTitle = sessionTitle;
      existingAttendance.sessionType = sessionType || 'live';
      existingAttendance.notes = notes || '';
      existingAttendance.duration = duration || 60;
      existingAttendance.markedBy = markedBy;
      existingAttendance.markedAt = Date.now();

      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        data: existingAttendance,
        message: 'Attendance updated successfully'
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      courseId,
      userId,
      sessionDate: new Date(sessionDate),
      sessionTitle,
      sessionType: sessionType || 'live',
      status,
      markedBy,
      notes: notes || '',
      duration: duration || 60
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark attendance',
      message: error.message
    });
  }
};

// @desc    Mark attendance for multiple students
// @route   POST /api/attendance/mark-bulk
// @access  Private (Teacher/Admin)
export const markBulkAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    const markedBy = req.user.uid;

    // Check if it's an array of attendance records
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of attendance records'
      });
    }

    const attendanceRecords = [];
    const errors = [];

    for (const record of attendanceData) {
      const { courseId, userId, sessionDate, sessionTitle, sessionType, status, notes, duration } = record;

      if (!courseId || !userId || !sessionDate || !sessionTitle || !status) {
        errors.push({ userId, error: 'Missing required fields' });
        continue;
      }

      const sessionDateObj = new Date(sessionDate);

      try {
        // Check if attendance already exists
        const existingAttendance = await Attendance.findOne({
          courseId,
          userId,
          sessionDate: sessionDateObj
        });

        if (existingAttendance) {
          existingAttendance.status = status;
          existingAttendance.sessionTitle = sessionTitle;
          existingAttendance.sessionType = sessionType || 'live';
          existingAttendance.notes = notes || '';
          existingAttendance.duration = duration || 60;
          existingAttendance.markedBy = markedBy;
          existingAttendance.markedAt = Date.now();
          await existingAttendance.save();
          attendanceRecords.push(existingAttendance);
        } else {
          const attendance = await Attendance.create({
            courseId,
            userId,
            sessionDate: sessionDateObj,
            sessionTitle,
            sessionType: sessionType || 'live',
            status,
            markedBy,
            notes: notes || '',
            duration: duration || 60
          });
          attendanceRecords.push(attendance);
        }
      } catch (err) {
        errors.push({ userId, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      data: attendanceRecords,
      count: attendanceRecords.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Bulk attendance marked successfully. ${attendanceRecords.length} records created/updated${errors.length > 0 ? `, ${errors.length} errors` : ''}`
    });
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark bulk attendance',
      message: error.message
    });
  }
};

// @desc    Get attendance for a user in a course
// @route   GET /api/attendance/user/:courseId/:userId
// @access  Private
export const getUserAttendance = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const attendance = await Attendance.find({ courseId, userId }).sort({ sessionDate: -1 });
    const stats = await Attendance.getAttendanceStats(courseId, userId);

    res.status(200).json({
      success: true,
      data: {
        records: attendance,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance',
      message: error.message
    });
  }
};

// @desc    Get attendance statistics for current user
// @route   GET /api/attendance/my-stats/:courseId
// @access  Private
export const getMyAttendanceStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.uid;

    const attendance = await Attendance.find({ courseId, userId }).sort({ sessionDate: -1 });
    const stats = await Attendance.getAttendanceStats(courseId, userId);

    res.status(200).json({
      success: true,
      data: {
        records: attendance,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching my attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance',
      message: error.message
    });
  }
};

// @desc    Get all attendance records for a course
// @route   GET /api/attendance/course/:courseId
// @access  Private (Teacher/Admin)
export const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    const attendance = await Attendance.find({ courseId }).sort({ sessionDate: -1 });
    const stats = await Attendance.getCourseStats(courseId);

    // Get unique sessions
    const sessions = [...new Set(attendance.map(a => a.sessionDate.toISOString().split('T')[0]))];

    let enrolledStudents = [];

    // Try to get students from Firestore first
    try {
      if (admin.apps.length > 0) {
        const db = admin.firestore();
        console.log('Fetching students from Firestore for courseId:', courseId);
        
        // Get all users and filter on the client side for more flexibility
        const usersSnapshot = await db.collection('users').get();
        
        enrolledStudents = usersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              uid: data.userId || doc.id,
              name: data.name || 'Unknown',
              email: data.email || '',
              role: data.role || 'student',
              enrolledCourses: data.enrolledCourses || [],
              enrolledAt: data.createdAt || new Date()
            };
          })
          .filter(student => {
            // Only include students (not instructors/admins)
            if (student.role !== 'student') return false;
            
            // Check if enrolled in this course
            if (Array.isArray(student.enrolledCourses)) {
              return student.enrolledCourses.includes(courseId) || 
                     student.enrolledCourses.includes(parseInt(courseId)) ||
                     student.enrolledCourses.includes(String(courseId));
            }
            return false;
          })
          .map(student => ({
            uid: student.uid,
            name: student.name,
            email: student.email,
            enrolledAt: student.enrolledAt
          }));
        
        console.log(`Found ${enrolledStudents.length} enrolled students in Firestore`);
      }
    } catch (firestoreError) {
      console.log('Firestore fetch failed, trying MongoDB:', firestoreError.message);
    }

    // Fallback to MongoDB if Firestore fails or returns no results
    if (enrolledStudents.length === 0) {
      const mongoStudents = await User.find({
        'enrolledCourses.courseId': courseId,
        'enrolledCourses.status': 'active'
      }).select('uid name email enrolledCourses');

      enrolledStudents = mongoStudents.map(student => ({
        uid: student.uid,
        name: student.name,
        email: student.email,
        enrolledAt: student.enrolledCourses.find(c => c.courseId === courseId)?.enrolledAt
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        records: attendance,
        stats,
        sessions: sessions.length,
        enrolledStudents
      }
    });
  } catch (error) {
    console.error('Error fetching course attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course attendance',
      message: error.message
    });
  }
};

// @desc    Get attendance report for a specific session
// @route   GET /api/attendance/session/:courseId/:sessionDate
// @access  Private (Teacher/Admin)
export const getSessionAttendance = async (req, res) => {
  try {
    const { courseId, sessionDate } = req.params;

    const attendance = await Attendance.find({
      courseId,
      sessionDate: new Date(sessionDate)
    });

    // Get user details for each attendance record
    const userIds = attendance.map(a => a.userId);
    const users = await User.find({ uid: { $in: userIds } }).select('uid name email');

    const attendanceWithUsers = attendance.map(record => {
      const user = users.find(u => u.uid === record.userId);
      return {
        ...record.toObject(),
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown'
      };
    });

    res.status(200).json({
      success: true,
      data: attendanceWithUsers
    });
  } catch (error) {
    console.error('Error fetching session attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session attendance',
      message: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Teacher/Admin)
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance',
      message: error.message
    });
  }
};

// @desc    Get attendance leaderboard for a course
// @route   GET /api/attendance/leaderboard/:courseId
// @access  Private
export const getAttendanceLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const stats = await Attendance.getCourseStats(courseId);
    
    // Sort by percentage (descending) and get user details
    const sortedStats = stats.sort((a, b) => b.percentage - a.percentage).slice(0, limit);
    
    // Get user details
    const userIds = sortedStats.map(s => s.userId);
    const users = await User.find({ uid: { $in: userIds } }).select('uid name email');
    
    const leaderboard = sortedStats.map((stat, index) => {
      const user = users.find(u => u.uid === stat.userId);
      return {
        rank: index + 1,
        userId: stat.userId,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown',
        ...stat
      };
    });

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching attendance leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
      message: error.message
    });
  }
};
