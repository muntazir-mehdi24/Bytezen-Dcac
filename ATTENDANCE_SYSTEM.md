# Course Attendance Tracking System

## Overview
A complete attendance tracking system integrated into the ByteZen course platform. Students can view their attendance records and statistics, while teachers and admins can mark attendance and generate reports.

## Features

### For Students
- **Attendance Overview**: View total sessions, present/absent counts, and attendance percentage
- **Detailed Records**: See all attendance records with session details, dates, and status
- **Leaderboard**: Compare attendance with other students in the course
- **Visual Progress**: Progress bars and charts showing attendance statistics

### For Teachers/Admins
- **Mark Attendance**: Mark attendance for individual students or bulk operations
- **Session Management**: Create and manage attendance sessions with different types (live, recorded, lab, workshop)
- **Student Reports**: View attendance statistics for all students in a course
- **Export Data**: Export attendance records to CSV for external analysis

## API Endpoints

### Student Endpoints
```
GET /api/attendance/my-stats/:courseId
- Get current user's attendance statistics for a course
- Returns: records array and stats object

GET /api/attendance/leaderboard/:courseId?limit=10
- Get attendance leaderboard for a course
- Query params: limit (default: 10)
- Returns: sorted list of students by attendance percentage
```

### Teacher/Admin Endpoints
```
POST /api/attendance/mark
- Mark attendance for a single student
- Body: { courseId, userId, sessionDate, sessionTitle, sessionType, status, notes, duration }

POST /api/attendance/mark-bulk
- Mark attendance for multiple students at once
- Body: { courseId, userIds[], sessionDate, sessionTitle, sessionType, status, notes, duration }

GET /api/attendance/user/:courseId/:userId
- Get attendance records for a specific user
- Returns: records array and stats object

GET /api/attendance/course/:courseId
- Get all attendance records for a course
- Returns: records array, stats array, session count

GET /api/attendance/session/:courseId/:sessionDate
- Get attendance for a specific session
- Returns: attendance records with user details

DELETE /api/attendance/:id
- Delete an attendance record
```

## Database Schema

### Attendance Model
```javascript
{
  courseId: String (required, indexed),
  userId: String (required, indexed),
  sessionDate: Date (required),
  sessionTitle: String (required),
  sessionType: String (enum: ['live', 'recorded', 'lab', 'workshop', 'other']),
  status: String (enum: ['present', 'absent', 'late', 'excused']),
  markedBy: String (required),
  markedAt: Date (default: now),
  notes: String,
  duration: Number (in minutes, default: 60),
  timestamps: true
}
```

### Compound Indexes
- `{ courseId: 1, userId: 1, sessionDate: 1 }` - For efficient queries

## Frontend Components

### AttendanceTab.jsx
Student-facing component with three views:
1. **Overview**: Stats cards, progress bar, recent sessions
2. **Records**: Complete table of all attendance records
3. **Leaderboard**: Ranked list of students by attendance percentage

### AttendanceManagement.jsx
Teacher/admin component for:
- Marking attendance (single or bulk)
- Viewing student statistics
- Exporting data to CSV

## Integration

The attendance tab is integrated into the CourseDetail page alongside existing tabs:
- Chapters
- Live
- Leaderboard
- Noticeboard
- **Attendance** (new)

## Usage

### For Students
1. Navigate to any course page
2. Click on the "ATTENDANCE" tab
3. View your attendance statistics, records, and leaderboard position

### For Teachers/Admins
1. Navigate to the course page
2. Click on "ATTENDANCE" tab
3. Click "Mark Attendance" to create a new session
4. Fill in session details and mark students present/absent
5. View statistics and export reports as needed

## Status Codes
- **present**: Student attended the session
- **absent**: Student did not attend
- **late**: Student arrived late but attended
- **excused**: Absence was excused

## Session Types
- **live**: Live online or in-person class
- **recorded**: Recorded lecture viewing
- **lab**: Practical lab session
- **workshop**: Workshop or special session
- **other**: Other types of sessions

## Statistics Calculation
- **Total**: Total number of sessions
- **Present**: Count of 'present' and 'late' statuses
- **Absent**: Count of 'absent' status
- **Excused**: Count of 'excused' status
- **Percentage**: (Present / Total) × 100

## Future Enhancements
- QR code-based attendance marking
- Geolocation verification
- Automated attendance from video analytics
- Email notifications for low attendance
- Attendance certificates
- Integration with calendar systems
- Mobile app support
- Biometric attendance integration

## Notes
- Attendance records are immutable once created (can only be updated by authorized users)
- The system supports multiple sessions per day
- Leaderboard updates in real-time
- All timestamps are stored in UTC
- The system is designed to scale to thousands of students per course
