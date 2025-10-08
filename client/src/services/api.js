import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
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
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
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
  markLessonComplete: (courseId, lessonId, completed) => 
    api.post(`/progress/${courseId}/lesson`, { lessonId, completed }),
  markArticleComplete: (courseId, articleId) =>
    api.post(`/progress/${courseId}/article`, { articleId }),
  getUserStats: () => api.get('/progress/user/stats'),
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
