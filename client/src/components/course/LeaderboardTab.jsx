import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaFire, FaChartLine, FaCheckCircle, FaBook, FaCode, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/FirebaseAuthContext';

const LeaderboardTab = ({ courseId }) => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoringInfo, setScoringInfo] = useState(null);
  const [showScoringInfo, setShowScoringInfo] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [courseId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/combined-leaderboard/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setLeaderboardData(response.data.data);
        setScoringInfo(response.data.scoringFormula);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-2xl" />;
      case 3:
        return <FaMedal className="text-orange-600 text-2xl" />;
      default:
        return <span className="text-gray-600 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-white';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="text-center py-12">
        <FaTrophy className="text-gray-300 text-6xl mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No leaderboard data available yet.</p>
        <p className="text-gray-400 text-sm mt-2">Complete activities and attend sessions to appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Scoring Info */}
      <div className="bg-gradient-to-r from-[#2f8d46] to-[#1e5a2e] text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FaTrophy className="text-yellow-300" />
              Course Leaderboard
            </h2>
            <p className="text-green-100">Top performers based on attendance, progress, and points</p>
          </div>
          <button
            onClick={() => setShowScoringInfo(!showScoringInfo)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Scoring Information"
          >
            <FaInfoCircle className="text-2xl" />
          </button>
        </div>

        {showScoringInfo && scoringInfo && (
          <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaChartLine />
              Scoring Formula
            </h3>
            <p className="text-sm mb-3">{scoringInfo.description}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Attendance</div>
                <div className="text-xl font-bold">{scoringInfo.attendance}</div>
              </div>
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Progress</div>
                <div className="text-xl font-bold">{scoringInfo.progress}</div>
              </div>
              <div className="bg-white/10 rounded p-2">
                <div className="font-semibold">Points</div>
                <div className="text-xl font-bold">{scoringInfo.points}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {leaderboardData[1]?.userName?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                <FaMedal className="text-gray-400 text-xl" />
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="font-semibold text-gray-900">{leaderboardData[1]?.userName}</div>
              <div className={`text-2xl font-bold ${getScoreColor(leaderboardData[1]?.combinedScore)}`}>
                {leaderboardData[1]?.combinedScore}
              </div>
              <div className="text-xs text-gray-500">2nd Place</div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-yellow-300">
                {leaderboardData[0]?.userName?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                <FaTrophy className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="font-bold text-gray-900 text-lg">{leaderboardData[0]?.userName}</div>
              <div className={`text-3xl font-bold ${getScoreColor(leaderboardData[0]?.combinedScore)}`}>
                {leaderboardData[0]?.combinedScore}
              </div>
              <div className="text-xs text-gray-500">🏆 Champion</div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {leaderboardData[2]?.userName?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                <FaMedal className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="font-semibold text-gray-900">{leaderboardData[2]?.userName}</div>
              <div className={`text-2xl font-bold ${getScoreColor(leaderboardData[2]?.combinedScore)}`}>
                {leaderboardData[2]?.combinedScore}
              </div>
              <div className="text-xs text-gray-500">3rd Place</div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Combined Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((student, index) => {
                const isCurrentUser = student.userId === user?.uid;
                return (
                  <tr
                    key={student.userId}
                    className={`${
                      isCurrentUser ? 'bg-green-50 border-l-4 border-[#2f8d46]' : ''
                    } ${index < 3 ? getRankBadgeColor(student.rank) + ' bg-opacity-10' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {getRankIcon(student.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2f8d46] to-[#1e5a2e] flex items-center justify-center text-white font-semibold">
                            {student.userName?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {student.userName}
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 text-xs bg-[#2f8d46] text-white rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          {student.currentStreak > 0 && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <FaFire className="text-orange-500" />
                              {student.currentStreak} day streak
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(student.combinedScore)}`}>
                        {student.combinedScore}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`${getProgressBarColor(student.combinedScore)} h-2 rounded-full transition-all`}
                          style={{ width: `${student.combinedScore}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {student.attendancePercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.attendancePresent}/{student.attendanceTotal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {student.progressPercentage.toFixed(1)}%
                      </div>
                      <div className="w-16 mx-auto bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${student.progressPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-bold text-purple-600">
                        {student.totalPoints}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({student.normalizedPoints}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <div className="flex items-center gap-1" title="Articles Completed">
                          <FaBook className="text-blue-500" />
                          <span>{student.articlesCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Problems Solved">
                          <FaCode className="text-green-500" />
                          <span>{student.problemsCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Quizzes Completed">
                          <FaQuestionCircle className="text-purple-500" />
                          <span>{student.quizzesCompleted}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FaBook className="text-blue-500" />
            <span>Articles Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCode className="text-green-500" />
            <span>Problems Solved</span>
          </div>
          <div className="flex items-center gap-2">
            <FaQuestionCircle className="text-purple-500" />
            <span>Quizzes Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <FaFire className="text-orange-500" />
            <span>Current Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
