import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaUsers, FaSearch } from 'react-icons/fa';
import { attendanceAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AttendanceManagement = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [stats, setStats] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionData, setSessionData] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    sessionTitle: '',
    sessionType: 'live',
    duration: 60,
    notes: ''
  });
  const [studentAttendance, setStudentAttendance] = useState({});
  const [activeTab, setActiveTab] = useState('stats'); // stats, history
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourseAttendance();
  }, [courseId]);

  const fetchCourseAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getCourseAttendance(courseId);
      if (response.data.success) {
        setCourseAttendance(response.data.data.records);
        setStats(response.data.data.stats);
        const students = response.data.data.enrolledStudents || [];
        setEnrolledStudents(students);
        
        // Initialize all students as present by default
        const initialAttendance = {};
        students.forEach(student => {
          initialAttendance[student.uid] = 'present';
        });
        setStudentAttendance(initialAttendance);
      }
    } catch (err) {
      console.error('Error fetching course attendance:', err);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkAttendance = async (e) => {
    e.preventDefault();
    
    if (!sessionData.sessionTitle.trim()) {
      toast.error('Please enter a session title');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create attendance records for all students
      const attendanceRecords = Object.entries(studentAttendance).map(([userId, status]) => ({
        courseId,
        userId,
        sessionDate: sessionData.sessionDate,
        sessionTitle: sessionData.sessionTitle,
        sessionType: sessionData.sessionType,
        status,
        duration: sessionData.duration,
        notes: sessionData.notes
      }));
      
      // Send bulk attendance request
      const response = await attendanceAPI.markBulkAttendance(attendanceRecords);
      
      if (response.data.success) {
        toast.success(`Attendance marked for ${attendanceRecords.length} students`);
        setShowMarkModal(false);
        fetchCourseAttendance();
        
        // Reset form
        setSessionData({
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTitle: '',
          sessionType: 'live',
          duration: 60,
          notes: ''
        });
      }
    } catch (err) {
      console.error('Error marking bulk attendance:', err);
      toast.error(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentStatus = (userId) => {
    setStudentAttendance(prev => {
      const currentStatus = prev[userId];
      let newStatus;
      
      // Cycle through: present -> absent -> late -> present
      if (currentStatus === 'present') newStatus = 'absent';
      else if (currentStatus === 'absent') newStatus = 'late';
      else newStatus = 'present';
      
      return { ...prev, [userId]: newStatus };
    });
  };

  const markAllAs = (status) => {
    const updatedAttendance = {};
    enrolledStudents.forEach(student => {
      updatedAttendance[student.uid] = status;
    });
    setStudentAttendance(updatedAttendance);
  };

  const handleEditSession = (session) => {
    // Group all attendance records for this session
    const sessionRecords = courseAttendance.filter(
      record => record.sessionDate === session.sessionDate && record.sessionTitle === session.sessionTitle
    );
    
    // Set session data
    setSessionData({
      sessionDate: session.sessionDate.split('T')[0],
      sessionTitle: session.sessionTitle,
      sessionType: session.sessionType,
      duration: session.duration,
      notes: session.notes || ''
    });
    
    // Set student attendance from existing records
    const attendance = {};
    sessionRecords.forEach(record => {
      attendance[record.userId] = record.status;
    });
    
    // Fill in missing students as absent
    enrolledStudents.forEach(student => {
      if (!attendance[student.uid]) {
        attendance[student.uid] = 'absent';
      }
    });
    
    setStudentAttendance(attendance);
    setEditingSession(session);
    setShowEditModal(true);
  };

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create attendance records for all students
      const attendanceRecords = Object.entries(studentAttendance).map(([userId, status]) => ({
        courseId,
        userId,
        sessionDate: sessionData.sessionDate,
        sessionTitle: sessionData.sessionTitle,
        sessionType: sessionData.sessionType,
        status,
        duration: sessionData.duration,
        notes: sessionData.notes
      }));
      
      // Update attendance (backend should handle upsert)
      const response = await attendanceAPI.markBulkAttendance(attendanceRecords);
      
      if (response.data.success) {
        toast.success('Attendance updated successfully!');
        setShowEditModal(false);
        setEditingSession(null);
        fetchCourseAttendance();
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      toast.error(err.response?.data?.error || 'Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (session) => {
    if (!window.confirm(`Are you sure you want to delete attendance for "${session.sessionTitle}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      // Delete all records for this session
      await attendanceAPI.deleteSession(courseId, session.sessionDate, session.sessionTitle);
      toast.success('Session deleted successfully!');
      fetchCourseAttendance();
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Session', 'Type', 'Student Name', 'Student ID', 'Status', 'Duration'];
    
    // Create a map of userId to userName from stats
    const userNameMap = {};
    stats.forEach(stat => {
      userNameMap[stat.userId] = stat.userName || stat.userId;
    });
    
    const rows = courseAttendance.map(record => [
      new Date(record.sessionDate).toLocaleDateString(),
      record.sessionTitle,
      record.sessionType,
      userNameMap[record.userId] || record.userId,
      record.userId,
      record.status,
      record.duration
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${courseId}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Group attendance by sessions
  const getSessionsList = () => {
    const sessionsMap = new Map();
    
    courseAttendance.forEach(record => {
      const key = `${record.sessionDate}-${record.sessionTitle}`;
      if (!sessionsMap.has(key)) {
        sessionsMap.set(key, {
          sessionDate: record.sessionDate,
          sessionTitle: record.sessionTitle,
          sessionType: record.sessionType,
          duration: record.duration,
          notes: record.notes,
          records: []
        });
      }
      sessionsMap.get(key).records.push(record);
    });
    
    return Array.from(sessionsMap.values()).sort((a, b) => 
      new Date(b.sessionDate) - new Date(a.sessionDate)
    );
  };

  if (loading && courseAttendance.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f8d46]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowMarkModal(true)}
            className="flex items-center px-4 py-2 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a] transition-colors"
          >
            <FaPlus className="mr-2" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'stats'
              ? 'border-[#2f8d46] text-[#2f8d46]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'history'
              ? 'border-[#2f8d46] text-[#2f8d46]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Session History
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
            </div>
            <FaUsers className="text-3xl text-gray-400" />
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Attendance</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.length > 0
                  ? (stats.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / stats.length).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.length > 0 ? Math.max(...stats.map(s => s.total)) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' ? (
        /* Student Statistics Table */
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Student Attendance Statistics</h3>
              <div className="relative w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f8d46] focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
          {stats.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No attendance data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.filter(stat => 
                    (stat.userName || stat.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (stat.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((stat) => (
                    <tr key={stat.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {stat.userName || stat.userId}
                        </div>
                        {stat.userEmail && (
                          <div className="text-xs text-gray-500">{stat.userEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {stat.present}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        {stat.absent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-[#2f8d46]">{stat.percentage}%</span>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#2f8d46] h-2 rounded-full"
                              style={{ width: `${stat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Session History */
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Session History - Edit Previous Attendance</h3>
          </div>
          {getSessionsList().length === 0 ? (
            <p className="text-gray-500 text-center py-12">No sessions found</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {getSessionsList().map((session, index) => {
                const presentCount = session.records.filter(r => r.status === 'present').length;
                const absentCount = session.records.filter(r => r.status === 'absent').length;
                const lateCount = session.records.filter(r => r.status === 'late').length;
                
                return (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{session.sessionTitle}</h4>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {session.sessionType}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>📅 {new Date(session.sessionDate).toLocaleDateString()}</span>
                          <span>⏱️ {session.duration} min</span>
                          <span>👥 {session.records.length} students</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600 font-semibold">✓ {presentCount} Present</span>
                          <span className="text-red-600 font-semibold">✗ {absentCount} Absent</span>
                          <span className="text-yellow-600 font-semibold">⏰ {lateCount} Late</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSession(session)}
                          className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mark Attendance for All Students</h3>
            <form onSubmit={handleBulkMarkAttendance} className="space-y-4">
              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Date *
                  </label>
                  <input
                    type="date"
                    value={sessionData.sessionDate}
                    onChange={(e) => setSessionData({ ...sessionData, sessionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={sessionData.sessionTitle}
                    onChange={(e) => setSessionData({ ...sessionData, sessionTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    placeholder="e.g., Week 1 - Python Basics"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <select
                    value={sessionData.sessionType}
                    onChange={(e) => setSessionData({ ...sessionData, sessionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                  >
                    <option value="live">Live</option>
                    <option value="recorded">Recorded</option>
                    <option value="lab">Lab</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Quick Mark All As:</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => markAllAs('present')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAs('absent')}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    All Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAs('late')}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    All Late
                  </button>
                </div>
              </div>

              {/* Students List */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                {enrolledStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No enrolled students found</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrolledStudents.map((student) => (
                        <tr key={student.uid} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleStudentStatus(student.uid)}
                              className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
                                studentAttendance[student.uid] === 'present'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : studentAttendance[student.uid] === 'absent'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              {studentAttendance[student.uid] === 'present' && '✓ Present'}
                              {studentAttendance[student.uid] === 'absent' && '✗ Absent'}
                              {studentAttendance[student.uid] === 'late' && '⏰ Late'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                  rows="2"
                  placeholder="Additional notes about this session..."
                />
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Summary:</strong> {Object.values(studentAttendance).filter(s => s === 'present').length} Present, {' '}
                  {Object.values(studentAttendance).filter(s => s === 'absent').length} Absent, {' '}
                  {Object.values(studentAttendance).filter(s => s === 'late').length} Late
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || enrolledStudents.length === 0}
                  className="flex-1 px-4 py-2 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Marking...' : `Mark Attendance for ${enrolledStudents.length} Students`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit Attendance - {sessionData.sessionTitle}
            </h3>
            <form onSubmit={handleUpdateAttendance} className="space-y-4">
              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Date *
                  </label>
                  <input
                    type="date"
                    value={sessionData.sessionDate}
                    onChange={(e) => setSessionData({ ...sessionData, sessionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={sessionData.sessionTitle}
                    onChange={(e) => setSessionData({ ...sessionData, sessionTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <select
                    value={sessionData.sessionType}
                    onChange={(e) => setSessionData({ ...sessionData, sessionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                  >
                    <option value="live">Live</option>
                    <option value="recorded">Recorded</option>
                    <option value="lab">Lab</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8d46]"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Quick Mark All As:</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => markAllAs('present')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAs('absent')}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    All Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAs('late')}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    All Late
                  </button>
                </div>
              </div>

              {/* Students List */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrolledStudents.map((student) => (
                      <tr key={student.uid} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStudentStatus(student.uid)}
                            className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
                              studentAttendance[student.uid] === 'present'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : studentAttendance[student.uid] === 'absent'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            {studentAttendance[student.uid] === 'present' && '✓ Present'}
                            {studentAttendance[student.uid] === 'absent' && '✗ Absent'}
                            {studentAttendance[student.uid] === 'late' && '⏰ Late'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Summary:</strong> {Object.values(studentAttendance).filter(s => s === 'present').length} Present, {' '}
                  {Object.values(studentAttendance).filter(s => s === 'absent').length} Absent, {' '}
                  {Object.values(studentAttendance).filter(s => s === 'late').length} Late
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSession(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
