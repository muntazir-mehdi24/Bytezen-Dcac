import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-[#2f8d46] hover:text-[#267a3a] mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ByteZen DCAC</h1>
          <p className="text-xl text-gray-600">
            A Computer Science portal for ByteZen learners
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            ByteZen DCAC is dedicated to empowering the next generation of developers and tech enthusiasts 
            through quality education, hands-on projects, and a vibrant community. We believe in making 
            computer science education accessible and practical for everyone.
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Quality Education</h3>
              <p className="text-gray-700">Comprehensive courses covering DSA, Web Development, AI/ML, and more</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍💻 Hands-on Projects</h3>
              <p className="text-gray-700">Real-world projects to build your portfolio and practical skills</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🤝 Community</h3>
              <p className="text-gray-700">Active community of learners and experienced mentors</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Career Support</h3>
              <p className="text-gray-700">Interview preparation and placement assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
