import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/FirebaseAuthContext';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Get Firestore instance
const auth = getAuth();
const db = getFirestore();

// Main CAMS Component
const CAMS = () => {
  const navigate = useNavigate();
  const { user, userProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // App States
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [students, setStudents] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'attendance', 'report', 'history'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cams' } } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load user role when user is available
  useEffect(() => {
    if (user && userProfile) {
      setUserRole(userProfile);
      setLoading(false);
    }
  }, [user, userProfile]);

  // Load User Role from Firestore (fallback)
  const loadUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data());
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading user role:', err);
      setLoading(false);
    }
  };

  // Initialize Mock Data
  const initializeMockData = async () => {
    try {
      // Check if data already exists
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      if (!coursesSnapshot.empty) return;

      // Create mock courses
      const mockCourses = [
        {
          courseId: 'CS101',
          name: 'Introduction to Computer Science',
          instructorId: 'instructor1',
          studentIds: []
        },
        {
          courseId: 'MATH202',
          name: 'Advanced Mathematics',
          instructorId: 'instructor1',
          studentIds: []
        }
      ];

      for (const course of mockCourses) {
        await setDoc(doc(db, 'courses', course.courseId), course);
      }

      console.log('Mock data initialized');
    } catch (err) {
      console.error('Error initializing mock data:', err);
    }
  };

  // Auth Functions
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user profile
      await setDoc(doc(db, 'users', uid), {
        userId: uid,
        name: name,
        role: role,
        enrolledCourses: []
      });
      
      await initializeMockData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, 'users', uid), {
          userId: uid,
          name: result.user.displayName,
          role: 'student',
          enrolledCourses: []
        });
        await initializeMockData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setSelectedCourse(null);
    setView('dashboard');
    navigate('/');
  };

  // Load Courses
  useEffect(() => {
    if (!user || !userRole) return;

    const coursesRef = collection(db, 'courses');
    let q;

    if (userRole.role === 'admin') {
      q = coursesRef;
    } else if (userRole.role === 'instructor') {
      q = query(coursesRef, where('instructorId', '==', user.uid));
    } else {
      q = query(coursesRef, where('studentIds', 'array-contains', user.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = [];
      snapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesData);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  // Load Students for Selected Course
  useEffect(() => {
    if (!selectedCourse) return;

    const loadStudents = async () => {
      const studentsData = [];
      for (const studentId of selectedCourse.studentIds) {
        const studentDoc = await getDoc(doc(db, 'users', studentId));
        if (studentDoc.exists()) {
          studentsData.push({ id: studentId, ...studentDoc.data() });
        }
      }
      setStudents(studentsData);
    };

    loadStudents();
  }, [selectedCourse]);

  // Load Attendance for Selected Date
  useEffect(() => {
    if (!selectedCourse || !selectedDate) return;

    const attendanceId = `${selectedCourse.courseId}_${selectedDate}`;
    const unsubscribe = onSnapshot(doc(db, 'attendance', attendanceId), (doc) => {
      if (doc.exists()) {
        setAttendanceRecords(doc.data().records || {});
      } else {
        setAttendanceRecords({});
      }
    });

    return () => unsubscribe();
  }, [selectedCourse, selectedDate]);

  // Mark Attendance
  const markAttendance = async (studentId, status) => {
    if (!selectedCourse || !selectedDate) return;

    const attendanceId = `${selectedCourse.courseId}_${selectedDate}`;
    const newRecords = { ...attendanceRecords, [studentId]: status };

    try {
      await setDoc(doc(db, 'attendance', attendanceId), {
        courseId: selectedCourse.courseId,
        date: selectedDate,
        records: newRecords,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  // Calculate Attendance Stats
  const calculateStats = async (courseId, studentId = null) => {
    try {
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('courseId', '==', courseId)
      );
      const snapshot = await getDocs(attendanceQuery);
      
      const stats = {};
      let totalClasses = snapshot.size;

      snapshot.forEach((doc) => {
        const records = doc.data().records || {};
        Object.keys(records).forEach((sid) => {
          if (!stats[sid]) {
            stats[sid] = { present: 0, total: 0 };
          }
          stats[sid].total++;
          if (records[sid] === 'Present') {
            stats[sid].present++;
          }
        });
      });

      if (studentId) {
        const studentStats = stats[studentId] || { present: 0, total: 0 };
        return {
          totalClasses,
          attended: studentStats.present,
          percentage: totalClasses > 0 ? ((studentStats.present / totalClasses) * 100).toFixed(1) : 0
        };
      }

      return { stats, totalClasses };
    } catch (err) {
      console.error('Error calculating stats:', err);
      return studentId ? { totalClasses: 0, attended: 0, percentage: 0 } : { stats: {}, totalClasses: 0 };
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading CAMS...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect to login
  if (!user || !userRole) {
    return null;
  }

  // Main App - Instructor/Admin View
  if (userRole?.role === 'instructor' || userRole?.role === 'admin') {
    return (
      <InstructorView
        user={user}
        userRole={userRole}
        courses={courses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        students={students}
        attendanceRecords={attendanceRecords}
        markAttendance={markAttendance}
        calculateStats={calculateStats}
        view={view}
        setView={setView}
        handleLogout={handleLogout}
      />
    );
  }

  // Student View
  return (
    <StudentView
      user={user}
      userRole={userRole}
      courses={courses}
      selectedCourse={selectedCourse}
      setSelectedCourse={setSelectedCourse}
      calculateStats={calculateStats}
      handleLogout={handleLogout}
    />
  );
};

// Instructor/Admin View Component
const InstructorView = ({
  user,
  userRole,
  courses,
  selectedCourse,
  setSelectedCourse,
  selectedDate,
  setSelectedDate,
  students,
  attendanceRecords,
  markAttendance,
  calculateStats,
  view,
  setView,
  handleLogout
}) => {
  const [stats, setStats] = useState({ stats: {}, totalClasses: 0 });
  const [historicalDates, setHistoricalDates] = useState([]);

  useEffect(() => {
    if (selectedCourse && view === 'report') {
      calculateStats(selectedCourse.courseId).then(setStats);
    }
  }, [selectedCourse, view]);

  useEffect(() => {
    if (selectedCourse && view === 'history') {
      loadHistoricalDates();
    }
  }, [selectedCourse, view]);

  const loadHistoricalDates = async () => {
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('courseId', '==', selectedCourse.courseId)
    );
    const snapshot = await getDocs(attendanceQuery);
    const dates = snapshot.docs.map(doc => doc.data().date).sort().reverse();
    setHistoricalDates(dates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CAMS</h1>
                <p className="text-sm text-gray-600">{userRole.role === 'admin' ? 'Administrator' : 'Instructor'} Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userRole.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          // Course Selection Dashboard
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('dashboard');
                  }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold">
                      {course.courseId}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.studentIds.length} Students</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    Open Course →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Course Management View
          <div>
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                    <p className="text-gray-600">{selectedCourse.courseId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('dashboard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'dashboard'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setView('attendance')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'attendance'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => setView('report')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'report'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => setView('history')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === 'history'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard View */}
            {view === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Classes Held</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalClasses || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Today's Date</p>
                      <p className="text-xl font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Marking View */}
            {view === 'attendance' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                                {student.name.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.userId.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => markAttendance(student.id, 'Present')}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                  attendanceRecords[student.id] === 'Present'
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => markAttendance(student.id, 'Absent')}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                  attendanceRecords[student.id] === 'Absent'
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Report View */}
            {view === 'report' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Attendance Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Classes Attended</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => {
                        const studentStats = stats.stats[student.id] || { present: 0, total: 0 };
                        const percentage = studentStats.total > 0 
                          ? ((studentStats.present / studentStats.total) * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-semibold">
                              {stats.totalClasses}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-semibold">
                              {studentStats.present}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                percentage >= 75
                                  ? 'bg-green-100 text-green-800'
                                  : percentage >= 50
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* History View */}
            {view === 'history' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Attendance History</h3>
                <div className="space-y-4">
                  {historicalDates.map((date) => (
                    <div key={date} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <button
                        onClick={() => {
                          setSelectedDate(date);
                          setView('attendance');
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-500">Click to view/edit attendance</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  ))}
                  {historicalDates.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No attendance records yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Student View Component
const StudentView = ({
  user,
  userRole,
  courses,
  selectedCourse,
  setSelectedCourse,
  calculateStats,
  handleLogout
}) => {
  const [myStats, setMyStats] = useState({ totalClasses: 0, attended: 0, percentage: 0 });
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      loadMyStats();
      loadAttendanceHistory();
    }
  }, [selectedCourse]);

  const loadMyStats = async () => {
    const stats = await calculateStats(selectedCourse.courseId, user.uid);
    setMyStats(stats);
  };

  const loadAttendanceHistory = async () => {
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('courseId', '==', selectedCourse.courseId)
    );
    const snapshot = await getDocs(attendanceQuery);
    const history = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.records[user.uid]) {
        history.push({
          date: data.date,
          status: data.records[user.uid]
        });
      }
    });
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceHistory(history);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CAMS</h1>
                <p className="text-sm text-gray-600">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userRole.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          // Course Selection
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold">
                      {course.courseId}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                    </div>
                  </div>
                  <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    View Attendance →
                  </button>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Course Attendance View
          <div>
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                  <p className="text-gray-600">{selectedCourse.courseId}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{myStats.totalClasses}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Classes Attended</p>
                    <p className="text-3xl font-bold text-gray-900">{myStats.attended}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    myStats.percentage >= 75
                      ? 'bg-green-100 text-green-600'
                      : myStats.percentage >= 50
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Attendance %</p>
                    <p className="text-3xl font-bold text-gray-900">{myStats.percentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Attendance History</h3>
              <div className="space-y-3">
                {attendanceHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {record.status === 'Present' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500">{record.date}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))}
                {attendanceHistory.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No attendance records yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CAMS;
