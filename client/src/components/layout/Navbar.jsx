import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/FirebaseAuthContext';
import { FaSearch, FaBars, FaTimes, FaCode, FaBook, FaLaptopCode, FaBriefcase, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowProfileMenu(false);
    navigate('/');
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return 'U';
    const name = userProfile?.name || user?.displayName || user?.email || 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Top Bar - GFG Style */}
      <div className="bg-[#2f8d46] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-xs">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">A Computer Science portal for ByteZen learners</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-[#2f8d46] flex items-center justify-center font-bold text-sm shadow-md">
                      {getInitials()}
                    </div>
                    <span className="hidden sm:inline">{userProfile?.name || user?.displayName || 'User'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-900">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{userProfile?.name || user?.displayName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" state={{ from: location }} className="hover:text-gray-200 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-white text-[#2f8d46] px-3 py-1 rounded hover:bg-gray-100 transition-colors font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded overflow-hidden border-2 border-[#2f8d46]">
                  <img
                    className="h-full w-full object-cover"
                    src="/bytezen logo.jpg"
                    alt="ByteZen Logo"
                  />
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-800">
                  ByteZen
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className="text-gray-700 hover:text-[#2f8d46] px-4 py-2 text-sm font-medium transition-colors flex items-center">
              <FaCode className="mr-1" />
              Home
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-[#2f8d46] px-4 py-2 text-sm font-medium transition-colors flex items-center">
              <FaBook className="mr-1" />
              Courses
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-[#2f8d46] px-4 py-2 text-sm font-medium transition-colors flex items-center">
              <FaLaptopCode className="mr-1" />
              Events
            </Link>
            <Link to="/bytelogs" className="text-gray-700 hover:text-[#2f8d46] px-4 py-2 text-sm font-medium transition-colors flex items-center">
              <FaBriefcase className="mr-1" />
              ByteLogs
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f8d46] focus:border-transparent text-sm"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#2f8d46]">
                <FaSearch className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#2f8d46] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2f8d46]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          <form onSubmit={handleSearch} className="px-4 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#2f8d46] focus:border-[#2f8d46]"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2f8d46] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2f8d46] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/events"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2f8d46] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>
          <Link
            to="/bytelogs"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2f8d46] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            ByteLogs
          </Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
