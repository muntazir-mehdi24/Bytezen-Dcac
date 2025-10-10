import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUsers, FaBook, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/FirebaseAuthContext';

const EnrollmentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get Firebase token
      const token = await user.getIdToken();
      
      // Fetch students from Firestore via backend
      const studentsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/enrollment/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch courses
      const coursesRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/courses`
      );
      
      setStudents(studentsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const filtered = filteredStudents();
    if (selectedStudents.length === filtered.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filtered.map(s => s.uid));
    }
  };

  const handleBulkEnroll = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      alert('Please select a course and at least one student');
      return;
    }

    try {
      setEnrolling(true);
      const token = await user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/enrollment/bulk-enroll-selected`,
        {
          courseId: selectedCourse,
          studentIds: selectedStudents
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Successfully enrolled ${selectedStudents.length} students!`);
      setSelectedStudents([]);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling students:', error);
      alert('Failed to enroll students: ' + (error.response?.data?.error || error.message));
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnrollAllInCourse = async () => {
    if (!selectedCourse) {
      alert('Please select a course');
      return;
    }

    if (!confirm('Are you sure you want to enroll ALL students in this course?')) {
      return;
    }

    try {
      setEnrolling(true);
      const token = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/enrollment/bulk-enroll`,
        { courseId: selectedCourse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling all students:', error);
      alert('Failed to enroll students: ' + (error.response?.data?.error || error.message));
    } finally {
      setEnrolling(false);
    }
  };

  const filteredStudents = () => {
    return students.filter(student => 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const isStudentEnrolled = (student, courseId) => {
    if (!student.enrolledCourses || !courseId) return false;
    return student.enrolledCourses.includes(courseId) ||
           student.enrolledCourses.includes(parseInt(courseId)) ||
           student.enrolledCourses.includes(String(courseId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filtered = filteredStudents();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUserPlus className="text-blue-600" />
            Student Enrollment Management
          </h1>
          <p className="mt-2 text-gray-600">Manage student enrollments across courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              </div>
              <FaUsers className="text-4xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <FaBook className="text-4xl text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Students</p>
                <p className="text-3xl font-bold text-gray-900">{selectedStudents.length}</p>
              </div>
              <FaCheck className="text-4xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Enrollment Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Enrollment Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a Course --</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleBulkEnroll}
              disabled={!selectedCourse || selectedStudents.length === 0 || enrolling}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {enrolling ? 'Enrolling...' : `Enroll Selected (${selectedStudents.length})`}
            </button>
            
            <button
              onClick={handleEnrollAllInCourse}
              disabled={!selectedCourse || enrolling}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Enroll All Students
            </button>

            <button
              onClick={handleSelectAll}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {selectedStudents.length === filtered.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Students List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filtered.length && filtered.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(student => (
                  <tr key={student.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.uid)}
                        onChange={() => handleSelectStudent(student.uid)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.enrolledCourses?.length || 0} courses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedCourse && isStudentEnrolled(student, selectedCourse) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FaCheck className="mr-1" /> Enrolled
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          <FaTimes className="mr-1" /> Not Enrolled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;
