import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaChartLine, FaTrophy } from 'react-icons/fa';
import { attendanceAPI } from '../../services/api';
import { useAuth } from '../../context/FirebaseAuthContext';

const AttendanceTab = ({ courseId }) => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeView, setActiveView] = useState('overview'); // overview, records, leaderboard
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) {
      fetchAttendanceData();
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceAPI.getMyAttendanceStats(courseId);
      if (response.data.success) {
        setAttendanceData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view attendance');
      } else {
        setError('Failed to load attendance data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await attendanceAPI.getLeaderboard(courseId, 10);
      if (response.data.success) {
        setLeaderboard(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FaCheckCircle className="text-green-500" />;
      case 'absent':
        return <FaTimesCircle className="text-red-500" />;
      case 'late':
        return <FaClock className="text-yellow-500" />;
      case 'excused':
        return <FaCheckCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      excused: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f8d46]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchAttendanceData}
          className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = attendanceData?.stats || { total: 0, present: 0, absent: 0, excused: 0, percentage: 0 };
  const records = attendanceData?.records || [];

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'overview'
                ? 'border-[#2f8d46] text-[#2f8d46]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('records')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'records'
                ? 'border-[#2f8d46] text-[#2f8d46]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendance Records
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'leaderboard'
                ? 'border-[#2f8d46] text-[#2f8d46]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leaderboard
          </button>
        </nav>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FaCalendarAlt className="text-3xl text-gray-400" />
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <FaCheckCircle className="text-3xl text-green-400" />
              </div>
            </div>

            <div className="bg-white border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <FaTimesCircle className="text-3xl text-red-400" />
              </div>
            </div>

            <div className="bg-white border-2 border-[#2f8d46] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance %</p>
                  <p className="text-2xl font-bold text-[#2f8d46]">{stats.percentage}%</p>
                </div>
                <FaChartLine className="text-3xl text-[#2f8d46]" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Overall Attendance</span>
                <span className="font-semibold">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-[#2f8d46] h-4 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{stats.present} Present</span>
                <span>{stats.absent} Absent</span>
                <span>{stats.excused} Excused</span>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No attendance records yet</p>
            ) : (
              <div className="space-y-3">
                {records.slice(0, 5).map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium text-gray-900">{record.sessionTitle}</p>
                        <p className="text-sm text-gray-500">{formatDate(record.sessionDate)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Records View */}
      {activeView === 'records' && (
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Attendance Records</h3>
          </div>
          {records.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No attendance records available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.sessionDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.sessionTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.sessionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.duration} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard View */}
      {activeView === 'leaderboard' && (
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              Attendance Leaderboard
            </h3>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No leaderboard data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = entry.userId === user?.uid;
                    return (
                      <tr 
                        key={entry.userId} 
                        className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-green-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {entry.rank <= 3 ? (
                              <FaTrophy 
                                className={`mr-2 ${
                                  entry.rank === 1 ? 'text-yellow-500' :
                                  entry.rank === 2 ? 'text-gray-400' :
                                  'text-orange-600'
                                }`}
                              />
                            ) : null}
                            <span className="text-sm font-medium text-gray-900">#{entry.rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.userName}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-green-600 font-semibold">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{entry.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          {entry.present}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-[#2f8d46]">{entry.percentage}%</span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#2f8d46] h-2 rounded-full"
                                style={{ width: `${entry.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
