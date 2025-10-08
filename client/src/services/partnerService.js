import axios from 'axios';

const API_URL = '/api/partners';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
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

// Get all partners
const getAll = async (params = {}) => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error.response?.data || error.message;
  }
};

// Get partner by ID
const getById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching partner with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Create a new partner
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
    console.error('Error creating partner:', error);
    throw error.response?.data || error.message;
  }
};

// Update a partner
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
    console.error(`Error updating partner with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Delete a partner
const deletePartner = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting partner with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Get partner types
const getTypes = async () => {
  try {
    const response = await api.get(`${API_URL}/types`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching partner types:', error);
    return ['sponsor', 'partner', 'affiliate']; // Default types in case of error
  }
};

// Toggle partner status
const toggleStatus = async (id, isActive) => {
  try {
    const response = await api.patch(`${API_URL}/${id}/status`, { isActive });
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling status for partner ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Toggle featured status
const toggleFeatured = async (id, featured) => {
  try {
    const response = await api.patch(`${API_URL}/${id}/featured`, { featured });
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling featured status for partner ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

const partnerService = {
  getAll,
  getById,
  create,
  update,
  delete: deletePartner,
  getTypes,
  toggleStatus,
  toggleFeatured,
};

export default partnerService;
