import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/FirebaseAuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ByteLogPage from './pages/ByteLogPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import CourseDetail from './pages/courses/CourseDetail';
import CoursesPage from './pages/CoursesPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProblemPage from './pages/problems/ProblemPage';
import QuizPage from './pages/quiz/QuizPage';
import CAMS from './pages/CAMS';
import AdminDashboard from './pages/admin/AdminDashboard';
import EnrollmentManagement from './pages/admin/EnrollmentManagement';
import StudentProgressDashboard from './pages/admin/StudentProgressDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageInsights from './pages/admin/ManageInsights';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManagePartners from './pages/admin/ManagePartners';
import ManageCouncil from './pages/admin/ManageCouncil';

// Main App Component with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

// Public Route component - only allows access when not authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Routes Component that uses useAuth hook
function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <Layout>
          <Login />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout>
          <Register />
        </Layout>
      } />
      <Route path="/forgot-password" element={
        <Layout>
          <ForgotPassword />
        </Layout>
      } />
      <Route path="/reset-password/:token" element={
        <Layout>
          <ResetPassword />
        </Layout>
      } />
      <Route path="/verify-email/:token" element={
        <Layout>
          <VerifyEmail />
        </Layout>
      } />

      {/* Protected routes */}
      <Route path="/bytelogs" element={
        <ProtectedRoute>
          <Layout>
            <ByteLogPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/enrollment" element={
        <ProtectedRoute>
          <Layout>
            <EnrollmentManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/enrollments" element={
        <ProtectedRoute>
          <Layout>
            <EnrollmentManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/progress" element={
        <ProtectedRoute>
          <Layout>
            <StudentProgressDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute>
          <Layout>
            <ManageEvents />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/insights" element={
        <ProtectedRoute>
          <Layout>
            <ManageInsights />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/testimonials" element={
        <ProtectedRoute>
          <Layout>
            <ManageTestimonials />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/partners" element={
        <ProtectedRoute>
          <Layout>
            <ManagePartners />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/council" element={
        <ProtectedRoute>
          <Layout>
            <ManageCouncil />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Public landing page */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      {/* Courses Page */}
      <Route path="/courses" element={
        <Layout>
          <CoursesPage />
        </Layout>
      } />
      
      {/* Course Detail Page - Protected */}
      <Route path="/courses/:id" element={
        <ProtectedRoute>
          <Layout>
            <CourseDetail />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Problem Solving Page */}
      <Route path="/problems/:problemId" element={
        <ProblemPage />
      } />

      {/* Quiz Page */}
      <Route path="/quiz/:quizId" element={
        <QuizPage />
      } />

      {/* CAMS - Course Attendance Management System */}
      <Route path="/cams" element={
        <CAMS />
      } />

      {/* Events Page */}
      <Route path="/events" element={
        <Layout>
          <EventsPage />
        </Layout>
      } />

      {/* About Page */}
      <Route path="/about" element={
        <Layout>
          <AboutPage />
        </Layout>
      } />

      {/* Contact Page */}
      <Route path="/contact" element={
        <Layout>
          <ContactPage />
        </Layout>
      } />

      {/* Team Page - Placeholder */}
      <Route path="/team" element={
        <Layout>
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              <p className="text-gray-600">Team page coming soon!</p>
            </div>
          </div>
        </Layout>
      } />

      {/* Privacy Policy */}
      <Route path="/privacy-policy" element={
        <Layout>
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                <p className="text-gray-600">Privacy policy content coming soon.</p>
              </div>
            </div>
          </div>
        </Layout>
      } />

      {/* Terms of Service */}
      <Route path="/terms" element={
        <Layout>
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                <p className="text-gray-600">Terms of service content coming soon.</p>
              </div>
            </div>
          </div>
        </Layout>
      } />

      {/* Code of Conduct */}
      <Route path="/code-of-conduct" element={
        <Layout>
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Code of Conduct</h1>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                <p className="text-gray-600">Code of conduct content coming soon.</p>
              </div>
            </div>
          </div>
        </Layout>
      } />

      {/* 404 - Not Found */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
              <div className="space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

export default App
