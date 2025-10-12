import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaChartLine, FaDatabase, FaServer } from 'react-icons/fa';
import api from '../services/api';

// Icon mapping for categories
const categoryIcons = {
  'AI/ML': <FaChartLine className="w-8 h-8 text-[#2f8d46]" />,
  'Data Science': <FaDatabase className="w-8 h-8 text-[#2f8d46]" />,
  'Web Development': <FaServer className="w-8 h-8 text-[#2f8d46]" />
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f8d46]"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-[#2f8d46] hover:text-[#267a3a] mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-xl text-gray-600">
            Explore our comprehensive courses and start your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-[#f0f9f4] border-2 border-[#2f8d46]">
                    {categoryIcons[course.category] || <FaChartLine className="w-8 h-8 text-[#2f8d46]" />}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {course.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2f8d46] transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    ⏱ {course.duration}
                  </span>
                  <span className="inline-flex items-center text-sm font-medium text-[#2f8d46] group-hover:underline">
                    Learn More
                    <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
              <div className="bg-[#f0f9f4] px-6 py-3 border-t border-gray-200">
                <span className="text-xs font-medium text-gray-700">
                  📚 {course.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-[#f0f9f4] to-[#e8f5e9] border-2 border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">More Courses Coming Soon!</h2>
          <p className="text-gray-600">
            We're constantly adding new courses. Stay tuned for updates on Python, Java, DevOps, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
