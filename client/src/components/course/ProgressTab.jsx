import React, { useState, useEffect } from 'react';
import { FaChartLine, FaBook, FaCode, FaClipboardCheck, FaClock, FaTrophy, FaFire, FaCalendarAlt } from 'react-icons/fa';
import { progressAPI } from '../../services/api';

const ProgressTab = ({ courseId }) => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [courseId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getDetailedProgress(courseId);
      setProgressData(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
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
          onClick={fetchProgressData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No progress data available yet. Start learning to track your progress!</p>
      </div>
    );
  }

  const { overall, articles, problems, quizzes, weeks, days } = progressData;

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-[#2f8d46] to-[#267a3a] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Progress Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <FaChartLine className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Overall Progress</p>
            <p className="text-3xl font-bold">{overall.progress}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <FaTrophy className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Total Points</p>
            <p className="text-3xl font-bold">{overall.points}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <FaClock className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Time Spent</p>
            <p className="text-3xl font-bold">{formatTime(overall.timeSpent)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <FaFire className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-3xl font-bold">{overall.streak} days</p>
          </div>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Articles Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaBook className="text-2xl text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Articles</h3>
              <p className="text-sm text-gray-600">{articles.completed} completed</p>
            </div>
          </div>
          <div className="space-y-2">
            {articles.list && articles.list.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {articles.list.slice(-5).reverse().map((article, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-gray-700 truncate">{article.articleId}</span>
                    <span className="text-gray-500">{formatTime(article.timeSpent)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No articles completed yet</p>
            )}
          </div>
        </div>

        {/* Problems Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaCode className="text-2xl text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Problems</h3>
              <p className="text-sm text-gray-600">{problems.completed} solved • {problems.totalPoints} pts</p>
            </div>
          </div>
          <div className="space-y-2">
            {problems.list && problems.list.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {problems.list.slice(-5).reverse().map((problem, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <span className="text-gray-700 truncate block">{problem.problemId}</span>
                      <span className={`text-xs ${
                        problem.difficulty === 'Easy' ? 'text-green-600' :
                        problem.difficulty === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <span className="text-[#2f8d46] font-semibold">{problem.points} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No problems solved yet</p>
            )}
          </div>
        </div>

        {/* Quizzes Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaClipboardCheck className="text-2xl text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Quizzes</h3>
              <p className="text-sm text-gray-600">{quizzes.completed} completed • Avg: {quizzes.averageScore}%</p>
            </div>
          </div>
          <div className="space-y-2">
            {quizzes.list && quizzes.list.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {quizzes.list.slice(-5).reverse().map((quiz, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-gray-700 truncate">{quiz.quizId}</span>
                    <span className={`font-semibold ${
                      quiz.score >= 80 ? 'text-green-600' :
                      quiz.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No quizzes completed yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Week/Day Progress */}
      {weeks && weeks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-[#2f8d46]" />
            Weekly Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeks.map((week, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{week.weekId}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles:</span>
                    <span className="font-medium">{week.articlesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Problems:</span>
                    <span className="font-medium">{week.problemsCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quizzes:</span>
                    <span className="font-medium">{week.quizzesCompleted || 0}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#2f8d46] h-2 rounded-full"
                        style={{ width: `${week.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{week.progressPercentage || 0}% complete</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaFire className="mr-2 text-orange-500" />
          Learning Streak
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2">Current Streak</p>
            <div className="flex items-center">
              <FaFire className="text-4xl text-orange-500 mr-3" />
              <span className="text-4xl font-bold text-[#2f8d46]">{overall.streak}</span>
              <span className="text-xl text-gray-600 ml-2">days</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Longest Streak</p>
            <div className="flex items-center">
              <FaTrophy className="text-4xl text-yellow-500 mr-3" />
              <span className="text-4xl font-bold text-gray-700">{overall.longestStreak}</span>
              <span className="text-xl text-gray-600 ml-2">days</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Keep it up!</strong> Learning consistently helps you retain information better. 
            Try to maintain your streak by completing at least one activity each day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTab;
