import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/FirebaseAuthContext';
import { FaSearch, FaArrowRight, FaLaptopCode, FaServer, FaMobileAlt, FaChartLine, FaCode, FaDatabase, FaPython, FaReact } from 'react-icons/fa';
import PartnerForms from '../components/PartnerForms';
import axios from 'axios';

// Sample data
const featuredCourses = [
  {
    id: 1,
    title: 'AI/ML Mastery',
    description: 'Master machine learning algorithms and AI concepts with Python.',
    icon: <FaChartLine className="w-8 h-8 text-[#2f8d46]" />,
    category: 'AI/ML',
    difficulty: 'Advanced',
    duration: '12 weeks'
  },
  {
    id: 2,
    title: 'Data Analytics',
    description: 'Learn data analysis and visualization with Python and popular libraries.',
    icon: <FaDatabase className="w-8 h-8 text-[#2f8d46]" />,
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '10 weeks'
  },
  {
    id: 3,
    title: 'MERN Stack',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    icon: <FaServer className="w-8 h-8 text-[#2f8d46]" />,
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '14 weeks'
  }
];

const quickLinks = [
  { title: 'Data Analytics', icon: <FaCode />, link: '/courses' },
  { title: 'Python', icon: <FaPython />, link: '/courses' },
  { title: 'Web Dev', icon: <FaReact />, link: '/courses' },
  { title: 'Database', icon: <FaDatabase />, link: '/courses' }
];

const societyImages = [
  { path: '/Orientation_2025.jpeg', name: 'Adieu 25' },
  { path: '/guitar.jpeg', name: 'Freshers' },
  { path: '/Guest Lecture/candle lighting1.jpeg', name: 'Guest Lecture' },
  { path: '/Freshers/bytelog release 1.jpeg', name: 'ByteLog' },
  { path: '/poetry.jpeg', name: 'Freshers' },
  { path: '/team.jpeg', name: 'Team' },
  { path: '/Adieu 25/farewell.jpeg', name: 'Adieu 25 Event' },
  { path: '/Freshers/interaction.jpeg', name: 'Freshers Event' }
];

const partners = [
  { name: 'Physics Wallah', logo: '/pw logo.jpg' },
  { name: 'ByteZen', logo: '/gfg-image.jpg' },
];

const achievements = [
  { number: '100+', label: 'Active Students', icon: '👥' },
  { number: '20+', label: 'Expert Mentors', icon: '👨‍🏫' },
  { number: '20+', label: 'Events Conducted', icon: '🎯' },
  { number: '50+', label: 'Projects Completed', icon: '🚀' }
];

// Default testimonials as fallback
const defaultTestimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer at Google',
    image: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=2f8d46&color=fff',
    testimonial: 'ByteZen helped me build a strong foundation in DSA and web development. The hands-on projects and mentorship were invaluable!',
    rating: 5
  },
  {
    name: 'Priya Singh',
    role: 'Data Scientist at Microsoft',
    image: 'https://ui-avatars.com/api/?name=Priya+Singh&background=2f8d46&color=fff',
    testimonial: 'The AI/ML courses at ByteZen are comprehensive and industry-relevant. I landed my dream job thanks to the skills I learned here.',
    rating: 5
  },
  {
    name: 'Arjun Patel',
    role: 'Full Stack Developer at Amazon',
    image: 'https://ui-avatars.com/api/?name=Arjun+Patel&background=2f8d46&color=fff',
    testimonial: 'Amazing community and excellent learning resources. ByteZen is the best place to start your tech journey!',
    rating: 5
  }
];

const leadership = [
  { name: 'Tushar Pandey', role: 'Vice President', image: '/Counsil/vp.jpeg' },
  { name: 'Muntazir Mehdi', role: 'President', image: '/Counsil/president.jpeg' },
  { name: 'Sahil Kumar', role: 'General Secretary', image: '/Counsil/gen sec.jpeg' },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/testimonials');
        if (response.data.success && response.data.data.length > 0) {
          setTestimonials(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Keep default testimonials on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCourseClick = (e, courseId) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: location } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - GFG Style */}
      <div className="bg-gradient-to-r from-[#f0f9f4] to-[#e8f5e9] border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded bg-[#2f8d46] text-white text-xs font-medium mb-4">
                <span className="mr-2">🎓</span>
                Learn to Code
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                A Computer Science portal for <span className="text-[#2f8d46]">ByteZen learners</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Master programming, data structures, algorithms, and more with ByteZen's comprehensive tutorials and courses.
              </p>
              
              {/* Quick Links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-[#2f8d46] hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-2xl text-[#2f8d46] mb-2">{link.icon}</div>
                    <span className="text-xs font-medium text-gray-700">{link.title}</span>
                  </Link>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-6 py-3 bg-[#2f8d46] text-white font-medium rounded hover:bg-[#267a3a] transition-colors"
                  >
                    Go to Courses
                    <FaArrowRight className="ml-2" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-6 py-3 bg-[#2f8d46] text-white font-medium rounded hover:bg-[#267a3a] transition-colors"
                    >
                      Start Learning
                      <FaArrowRight className="ml-2" />
                    </Link>
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-6 py-3 bg-white text-[#2f8d46] font-medium rounded border-2 border-[#2f8d46] hover:bg-[#f0f9f4] transition-colors"
                    >
                      Explore Courses
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Image Content */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="/hero img.webp" 
                  alt="ByteZen Society" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses - GFG Style */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Popular Courses
            </h2>
            <p className="text-gray-600">
              Master in-demand skills with our comprehensive courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-[#f0f9f4] border-2 border-[#2f8d46]">
                      {course.icon}
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

          <div className="mt-8 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-white text-[#2f8d46] font-medium rounded border-2 border-[#2f8d46] hover:bg-[#f0f9f4] transition-colors"
            >
              View All Courses
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Society Insights - GFG Style */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Society Gallery
            </h2>
            <p className="text-gray-600">
              Explore our vibrant community and memorable events
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {societyImages.map((event, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#2f8d46] transition-all duration-200 h-48">
                <div className="w-full h-full">
                  <img
                    src={event.path}
                    alt={event.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <h3 className="text-white text-sm font-semibold">{event.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section - GFG Style */}
      <div className="py-12 bg-gradient-to-r from-[#2f8d46] to-[#267a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {achievement.number}
                </div>
                <div className="text-sm md:text-base text-green-100">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - GFG Style */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Student Success Stories
            </h2>
            <p className="text-gray-600">
              Hear from our alumni who are now working at top tech companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              ))
            ) : (
              testimonials.map((testimonial, index) => (
                <div key={testimonial._id || index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{testimonial.testimonial}"</p>
                  <div className="mt-4 flex text-yellow-400">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Our Partners & Sponsors - Redesigned GFG Style */}
      <div className="py-12 bg-white border-t-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Our Partners & Sponsors
            </h2>
            <p className="text-gray-600">
              Collaborating with industry leaders to provide the best learning experience
            </p>
          </div>
          
          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center hover:border-[#2f8d46] hover:shadow-md transition-all duration-200 h-32">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-20 max-w-full object-contain"
                />
              </div>
            ))}
            {/* Placeholder for more partners */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium">Your Logo Here</p>
                <p className="text-gray-300 text-xs mt-1">Become a Partner</p>
              </div>
            </div>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium">Your Logo Here</p>
                <p className="text-gray-300 text-xs mt-1">Become a Partner</p>
              </div>
            </div>
          </div>

          {/* Partnership Benefits */}
          <div className="bg-gradient-to-r from-[#f0f9f4] to-[#e8f5e9] rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Partner With ByteZen?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#2f8d46]">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Reach Talented Students</h4>
                <p className="text-sm text-gray-600">Connect with 100+ motivated tech enthusiasts</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#2f8d46]">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Brand Visibility</h4>
                <p className="text-sm text-gray-600">Showcase your brand at our events and platform</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#2f8d46]">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Community Impact</h4>
                <p className="text-sm text-gray-600">Support education and skill development</p>
              </div>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="bg-white border-2 border-[#2f8d46] rounded-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Become a Partner</h3>
              <p className="text-gray-600">
                Join our network of partners and sponsors to support our mission of empowering developers
              </p>
            </div>
            <PartnerForms />
          </div>
        </div>
      </div>

      {/* Why Choose ByteZen - GFG Style */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Why Choose ByteZen?
            </h2>
            <p className="text-gray-600">
              Your one-stop destination for mastering computer science and programming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Curriculum</h3>
              <p className="text-gray-600 text-sm">From basics to advanced topics, covering Data Analytics, Web Dev, AI/ML, and more</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hands-on Projects</h3>
              <p className="text-gray-600 text-sm">Build real-world projects to strengthen your portfolio and practical skills</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Mentorship</h3>
              <p className="text-gray-600 text-sm">Learn from industry professionals and experienced developers</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Programming</h3>
              <p className="text-gray-600 text-sm">Regular coding contests and hackathons to sharpen your skills</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Active Community</h3>
              <p className="text-gray-600 text-sm">Join a vibrant community of learners and collaborate on projects</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#2f8d46] transition-all duration-200">
              <div className="w-12 h-12 bg-[#f0f9f4] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Career Support</h3>
              <p className="text-gray-600 text-sm">Interview preparation, resume building, and placement assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Council Leadership - GFG Style */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Council Leadership
            </h2>
            <p className="text-gray-600">
              Meet the dedicated team leading our community forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((member, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#2f8d46] hover:shadow-lg transition-all duration-200 group">
                <div className="h-64 w-full bg-gray-50 flex items-center justify-center overflow-hidden relative">
                  <img
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={member.image}
                    alt={member.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Found';
                    }}
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'center center',
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                </div>
                <div className="p-6 text-center bg-gradient-to-r from-[#f0f9f4] to-[#e8f5e9]">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-[#2f8d46] font-medium mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-gradient-to-r from-[#2f8d46] to-[#267a3a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds  of students learning and building amazing projects with ByteZen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2f8d46] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Go to Courses
                <FaArrowRight className="ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2f8d46] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Get Started Free
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-bold rounded-lg border-2 border-white hover:bg-white hover:text-[#2f8d46] transition-colors text-lg"
                >
                  Explore Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
