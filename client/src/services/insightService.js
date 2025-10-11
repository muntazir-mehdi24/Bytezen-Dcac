import axios from 'axios';

const API_URL = '/api/insights';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // You can add more specific error handling here
    }
    return Promise.reject(error);
  }
);

// Get all insights
const getAll = async (params = {}) => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error.response?.data || error.message;
  }
};

// Get insight by ID
const getById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching insight with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Get insights by tag
const getByTag = async (tag) => {
  try {
    const response = await api.get(`${API_URL}/tags/${tag}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching insights by tag ${tag}:`, error);
    throw error.response?.data || error.message;
  }
};

// Create a new insight
const create = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await api.post(API_URL, formData, config);
    return response.data.data;
  } catch (error) {
    console.error('Error creating insight:', error);
    throw error.response?.data || error.message;
  }
};

// Update an insight
const update = async (id, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await api.put(`${API_URL}/${id}`, formData, config);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating insight with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Delete an insight
const deleteInsight = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting insight with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Toggle publish status
const togglePublishStatus = async (id, isPublished) => {
  try {
    const response = await api.patch(`${API_URL}/${id}/publish`, { isPublished });
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling publish status for insight ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Get popular tags
const getPopularTags = async (limit = 10) => {
  try {
    const response = await api.get(`${API_URL}/tags/popular`, { params: { limit } });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return [];
  }
};

// Get all unique tags
const getAllTags = async () => {
  try {
    const response = await api.get(`${API_URL}/tags`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
};

const insightService = {
  getAll,
  getById,
  getByTag,
  create,
  update,
  delete: deleteInsight,
  togglePublishStatus,
  getPopularTags,
  getAllTags,
};

export default insightService;
