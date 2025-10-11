import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    index: true
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  sessionDate: {
    type: Date,
    required: [true, 'Session date is required']
  },
  sessionTitle: {
    type: String,
    required: [true, 'Session title is required']
  },
  sessionType: {
    type: String,
    enum: ['live', 'recorded', 'lab', 'workshop', 'other'],
    default: 'live'
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent'
  },
  markedBy: {
    type: String,
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 60
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ courseId: 1, userId: 1, sessionDate: 1 });

// Static method to get attendance statistics for a user in a course
attendanceSchema.statics.getAttendanceStats = async function(courseId, userId) {
  const records = await this.find({ courseId, userId });
  
  const total = records.length;
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const excused = records.filter(r => r.status === 'excused').length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
  
  return {
    total,
    present,
    absent,
    excused,
    percentage: parseFloat(percentage)
  };
};

// Static method to get course-wide attendance statistics
attendanceSchema.statics.getCourseStats = async function(courseId) {
  const records = await this.find({ courseId });
  
  // Group by user
  const userStats = {};
  records.forEach(record => {
    if (!userStats[record.userId]) {
      userStats[record.userId] = {
        userId: record.userId,
        userName: null, // Will be populated later
        userEmail: null,
        total: 0,
        present: 0,
        absent: 0,
        excused: 0
      };
    }
    
    userStats[record.userId].total++;
    if (record.status === 'present' || record.status === 'late') {
      userStats[record.userId].present++;
    } else if (record.status === 'absent') {
      userStats[record.userId].absent++;
    } else if (record.status === 'excused') {
      userStats[record.userId].excused++;
    }
  });
  
  // Fetch user names from Firebase or MongoDB
  const userIds = Object.keys(userStats);
  try {
    const admin = (await import('firebase-admin')).default;
    if (admin.apps.length > 0) {
      const db = admin.firestore();
      const usersSnapshot = await db.collection('users').get();
      const usersMap = {};
      
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const uid = data.userId || doc.id;
        usersMap[uid] = {
          name: data.name || 'Unknown Student',
          email: data.email || ''
        };
      });
      
      // Populate user names
      userIds.forEach(userId => {
        if (usersMap[userId]) {
          userStats[userId].userName = usersMap[userId].name;
          userStats[userId].userEmail = usersMap[userId].email;
        } else {
          userStats[userId].userName = userId; // Fallback to ID
        }
      });
    }
  } catch (error) {
    console.log('Error fetching user names:', error.message);
    // Fallback: use userId as name
    userIds.forEach(userId => {
      if (!userStats[userId].userName) {
        userStats[userId].userName = userId;
      }
    });
  }
  
  // Calculate percentages
  Object.keys(userStats).forEach(userId => {
    const stats = userStats[userId];
    stats.percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0;
  });
  
  return Object.values(userStats);
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
