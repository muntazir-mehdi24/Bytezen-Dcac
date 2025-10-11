import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaClipboardList, 
  FaChartLine, 
  FaCalendarAlt,
  FaStar,
  FaHandshake,
  FaNewspaper,
  FaUserGraduate,
  FaCog,
  FaBook,
  FaTrophy,
  FaUsersCog,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../context/FirebaseAuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 3,
    activeEnrollments: 0,
    avgAttendance: 0,
    totalEvents: 0,
    totalBytelogs: 0
  });

  useEffect(() => {
    // Check if user is admin
    if (userProfile && userProfile.role !== 'admin' && userProfile.role !== 'instructor') {
      navigate('/');
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [userProfile, navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real data from APIs
      const [studentsRes, coursesRes, eventsRes, insightsRes, enrollmentsRes] = await Promise.all([
        api.get('/students').catch(() => ({ data: { data: [] } })),
        api.get('/courses').catch(() => ({ data: { data: [] } })),
        api.get('/events').catch(() => ({ data: { data: [] } })),
        api.get('/insights').catch(() => ({ data: { data: [] } })),
        api.get('/enrollment/stats').catch(() => ({ data: { totalEnrollments: 0 } }))
      ]);

      setStats({
        totalStudents: studentsRes.data.data?.length || 0,
        totalCourses: coursesRes.data.data?.length || 0,
        activeEnrollments: enrollmentsRes.data.totalEnrollments || 0,
        avgAttendance: 0, // Will be calculated from attendance data
        totalEvents: eventsRes.data.data?.length || 0,
        totalBytelogs: insightsRes.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const adminModules = [
    {
      title: 'Student Management',
      description: 'Add, edit, delete students, manage departments and divisions',
      icon: FaUserGraduate,
      color: 'blue',
      link: '/admin/students',
      stats: `${stats.totalStudents} Students`
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor student progress, course completion, and performance',
      icon: FaChartLine,
      color: 'green',
      link: '/admin/progress',
      stats: `${stats.activeEnrollments} Active`
    },
    {
      title: 'Attendance Management',
      description: 'Track and manage student attendance across all courses',
      icon: FaClipboardList,
      color: 'purple',
      link: '/courses/2', // Will show attendance tab
      stats: `${stats.avgAttendance}% Avg`
    },
    {
      title: 'Course Management',
      description: 'Add/edit articles, problems, quizzes with images',
      icon: FaBook,
      color: 'orange',
      link: '/admin/courses',
      stats: `${stats.totalCourses} Courses`
    },
    {
      title: 'Events Management',
      description: 'Schedule and manage workshops, webinars, and events',
      icon: FaCalendarAlt,
      color: 'red',
      link: '/admin/events',
      stats: `${stats.totalEvents} Events`
    },
    {
      title: 'ByteLogs Management',
      description: 'Create and publish technical articles and tutorials',
      icon: FaNewspaper,
      color: 'indigo',
      link: '/admin/insights',
      stats: `${stats.totalBytelogs} Articles`
    },
    {
      title: 'Testimonials',
      description: 'Manage student testimonials and success stories',
      icon: FaStar,
      color: 'yellow',
      link: '/admin/testimonials',
      stats: 'Featured'
    },
    {
      title: 'Partners Management',
      description: 'Manage partner organizations and collaborations',
      icon: FaHandshake,
      color: 'teal',
      link: '/admin/partners',
      stats: 'Active'
    },
    {
      title: 'Council Management',
      description: 'Manage council members and leadership team',
      icon: FaUsersCog,
      color: 'pink',
      link: '/admin/council',
      stats: 'Team'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-600',
      green: 'bg-green-50 border-green-200 hover:border-green-400 text-green-600',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-600',
      red: 'bg-red-50 border-red-200 hover:border-red-400 text-red-600',
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-600',
      yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 text-yellow-600',
      teal: 'bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-600',
      pink: 'bg-pink-50 border-pink-200 hover:border-pink-400 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'instructor')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {userProfile?.name || 'Admin'}! Manage your platform from here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <FaBell className="text-xl" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <FaCog className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Students</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUserGraduate className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Enrollments</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeEnrollments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBook className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Attendance</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.avgAttendance}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaClipboardList className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaChalkboardTeacher className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => (
              <Link
                key={index}
                to={module.link}
                className={`${getColorClasses(module.color)} border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white`}>
                    <module.icon className="text-2xl" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-white rounded-full">
                    {module.stats}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 px-4 py-3 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a] transition-colors">
              <FaUsers />
              <span>Add New Student</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaCalendarAlt />
              <span>Create Event</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <FaNewspaper />
              <span>Publish ByteLog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
