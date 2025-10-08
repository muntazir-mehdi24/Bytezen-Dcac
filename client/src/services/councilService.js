import axios from 'axios';

const API_URL = '/api/council';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get all council members
const getAll = async (params = {}) => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching council members:', error);
    throw error.response?.data || error.message;
  }
};

// Get active council members
const getActiveMembers = async () => {
  try {
    const response = await api.get(`${API_URL}?active=true`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching active council members:', error);
    throw error.response?.data || error.message;
  }
};

// Get council member by ID
const getById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching council member with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Create a new council member
const create = async (memberData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await api.post(API_URL, memberData, config);
    return response.data.data;
  } catch (error) {
    console.error('Error creating council member:', error);
    throw error.response?.data || error.message;
  }
};

// Update a council member
const update = async (id, memberData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await api.put(`${API_URL}/${id}`, memberData, config);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating council member with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Delete a council member
const remove = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data.success;
  } catch (error) {
    console.error(`Error deleting council member with ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// Reorder council members
const reorder = async (orderedIds) => {
  try {
    const response = await api.put(`${API_URL}/reorder`, { orderedIds });
    return response.data.success;
  } catch (error) {
    console.error('Error reordering council members:', error);
    throw error.response?.data || error.message;
  }
};

const councilService = {
  getAll,
  getActiveMembers,
  getById,
  create,
  update,
  delete: remove,
  reorder,
};

export default councilService;
