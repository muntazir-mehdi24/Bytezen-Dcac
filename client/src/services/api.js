import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    // Try to get token from localStorage first (for traditional auth)
    let token = localStorage.getItem('token');
    
    // If no token, try to get Firebase token
    if (!token) {
      try {
        // Import Firebase auth from the initialized app
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
      } catch (err) {
        console.error('Error getting Firebase token:', err);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're using Firebase auth
      try {
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        if (auth.currentUser) {
          // User is authenticated with Firebase, don't redirect
          // The token might just need to be refreshed
          return Promise.reject(error);
        }
      } catch (err) {
        console.error('Error checking Firebase auth:', err);
      }
      
      // Only clear and redirect if not using Firebase auth
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => 
    api.put(`/auth/resetpassword/${token}`, { password }),
  updatePassword: (currentPassword, newPassword) =>
    api.put('/auth/updatepassword', { currentPassword, newPassword }),
};

// Course API
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),
  getEnrolledCourses: () => api.get('/courses/user/enrolled'),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
};

// Progress API
export const progressAPI = {
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  getDetailedProgress: (courseId) => api.get(`/progress/${courseId}/detailed`),
  markLessonComplete: (courseId, lessonId, completed) => 
    api.post(`/progress/${courseId}/lesson`, { lessonId, completed }),
  markArticleComplete: (courseId, articleId, timeSpent) =>
    api.post(`/progress/${courseId}/article`, { articleId, timeSpent }),
  markProblemComplete: (courseId, problemId, difficulty, points, timeSpent, attempts) =>
    api.post(`/progress/${courseId}/problem`, { problemId, difficulty, points, timeSpent, attempts }),
  markQuizComplete: (courseId, quizId, score, totalQuestions, timeSpent) =>
    api.post(`/progress/${courseId}/quiz`, { quizId, score, totalQuestions, timeSpent }),
  getUserStats: () => api.get('/progress/user/stats'),
  // Admin endpoints
  getCourseStudentsProgress: (courseId) => api.get(`/progress/admin/course/${courseId}`),
  getStudentProgress: (userId, courseId) => api.get(`/progress/admin/student/${userId}/${courseId}`),
};

// Code Execution API
export const codeAPI = {
  executeCode: (code, language, input = '') =>
    api.post('/code/execute', { code, language, input }),
};

// Attendance API
export const attendanceAPI = {
  // Student endpoints
  getMyAttendanceStats: (courseId) => api.get(`/attendance/my-stats/${courseId}`),
  getLeaderboard: (courseId, limit = 10) => 
    api.get(`/attendance/leaderboard/${courseId}?limit=${limit}`),
  
  // Teacher/Admin endpoints
  markAttendance: (attendanceData) => api.post('/attendance/mark', attendanceData),
  markBulkAttendance: (bulkData) => api.post('/attendance/mark-bulk', bulkData),
  getUserAttendance: (courseId, userId) => 
    api.get(`/attendance/user/${courseId}/${userId}`),
  getCourseAttendance: (courseId) => api.get(`/attendance/course/${courseId}`),
  getSessionAttendance: (courseId, sessionDate) => 
    api.get(`/attendance/session/${courseId}/${sessionDate}`),
  deleteAttendance: (id) => api.delete(`/attendance/${id}`),
};

export default api;
