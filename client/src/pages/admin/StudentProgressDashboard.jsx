import React, { useState, useEffect } from 'react';
import { FaSearch, FaChartLine, FaBook, FaCode, FaClipboardCheck, FaClock, FaTrophy, FaEye } from 'react-icons/fa';
import { progressAPI } from '../../services/api';

const StudentProgressDashboard = ({ courseId }) => {
  const [loading, setLoading] = useState(true);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailedProgress, setDetailedProgress] = useState(null);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('progress'); // progress, points, time, name

  useEffect(() => {
    fetchStudentsProgress();
  }, [courseId]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, studentsProgress, sortBy]);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getCourseStudentsProgress(courseId);
      setStudentsProgress(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students progress:', err);
      setError('Failed to load students progress');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...studentsProgress];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.overallProgress - a.overallProgress;
        case 'points':
          return b.totalPoints - a.totalPoints;
        case 'time':
          return b.timeSpent - a.timeSpent;
        case 'name':
          return (a.user?.name || '').localeCompare(b.user?.name || '');
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const viewStudentDetails = async (student) => {
    try {
      setSelectedStudent(student);
      const response = await progressAPI.getStudentProgress(student.user._id, courseId);
      setDetailedProgress(response.data.data);
    } catch (err) {
      console.error('Error fetching student details:', err);
      alert('Failed to load student details');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f8d46]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchStudentsProgress}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Detail Modal
  if (selectedStudent && detailedProgress) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {selectedStudent.user.profilePicture ? (
              <img
                src={selectedStudent.user.profilePicture}
                alt={selectedStudent.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#2f8d46] text-white flex items-center justify-center mr-4 text-xl font-bold">
                {selectedStudent.user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{selectedStudent.user.name}</h2>
              <p className="text-gray-600">{selectedStudent.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedStudent(null);
              setDetailedProgress(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to List
          </button>
        </div>

        {/* Student Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <FaChartLine className="text-2xl text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Overall Progress</p>
            <p className="text-2xl font-bold">{detailedProgress.overallProgress}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <FaTrophy className="text-2xl text-yellow-600 mb-2" />
            <p className="text-sm text-gray-600">Total Points</p>
            <p className="text-2xl font-bold">{detailedProgress.totalPoints}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <FaClock className="text-2xl text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Time Spent</p>
            <p className="text-2xl font-bold">{formatTime(detailedProgress.totalTimeSpent)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <FaChartLine className="text-2xl text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-2xl font-bold">{detailedProgress.currentStreak} days</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Articles */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaBook className="mr-2 text-blue-600" />
              Articles ({detailedProgress.totalArticlesCompleted})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {detailedProgress.completedArticles?.map((article, index) => (
                <div key={index} className="text-sm border-b pb-2">
                  <p className="font-medium text-gray-700">{article.articleId}</p>
                  <p className="text-gray-500">Time: {formatTime(article.timeSpent)}</p>
                  <p className="text-gray-400 text-xs">{formatDate(article.completedAt)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Problems */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCode className="mr-2 text-green-600" />
              Problems ({detailedProgress.totalProblemsCompleted})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {detailedProgress.completedProblems?.map((problem, index) => (
                <div key={index} className="text-sm border-b pb-2">
                  <p className="font-medium text-gray-700">{problem.problemId}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${
                      problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[#2f8d46] font-semibold">{problem.points} pts</span>
                  </div>
                  <p className="text-gray-400 text-xs">{formatDate(problem.completedAt)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quizzes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaClipboardCheck className="mr-2 text-purple-600" />
              Quizzes ({detailedProgress.totalQuizzesCompleted})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {detailedProgress.completedQuizzes?.map((quiz, index) => (
                <div key={index} className="text-sm border-b pb-2">
                  <p className="font-medium text-gray-700">{quiz.quizId}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Score:</span>
                    <span className={`font-semibold ${
                      quiz.score >= 80 ? 'text-green-600' :
                      quiz.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{formatDate(quiz.completedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Student Progress Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f8d46] focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f8d46] focus:border-transparent"
          >
            <option value="progress">Sort by Progress</option>
            <option value="points">Sort by Points</option>
            <option value="time">Sort by Time</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-3xl font-bold text-[#2f8d46]">{studentsProgress.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Progress</p>
          <p className="text-3xl font-bold text-blue-600">
            {studentsProgress.length > 0
              ? Math.round(studentsProgress.reduce((sum, s) => sum + s.overallProgress, 0) / studentsProgress.length)
              : 0}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Points</p>
          <p className="text-3xl font-bold text-yellow-600">
            {studentsProgress.length > 0
              ? Math.round(studentsProgress.reduce((sum, s) => sum + s.totalPoints, 0) / studentsProgress.length)
              : 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Active Students</p>
          <p className="text-3xl font-bold text-green-600">
            {studentsProgress.filter(s => s.overallProgress > 0).length}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problems
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quizzes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.user?.profilePicture ? (
                        <img
                          src={student.user.profilePicture}
                          alt={student.user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#2f8d46] text-white flex items-center justify-center mr-3 font-bold">
                          {student.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{student.user?.name}</p>
                        <p className="text-sm text-gray-500">{student.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                        <div
                          className="bg-[#2f8d46] h-2 rounded-full"
                          style={{ width: `${student.overallProgress}%` }}
                        ></div>
                      </div>
                      <span className={`font-semibold ${getProgressColor(student.overallProgress)}`}>
                        {student.overallProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.articlesCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.problemsCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.quizzesCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600">
                    {student.totalPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(student.timeSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => viewStudentDetails(student)}
                      className="flex items-center text-[#2f8d46] hover:text-[#267a3a] font-medium"
                    >
                      <FaEye className="mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDashboard;
