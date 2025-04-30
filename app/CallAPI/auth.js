// lib/api/auth.js
// API functions for authentication-related endpoints

import { API_BASE_URL, DEFAULT_HEADERS, getAuthHeaders, handleResponse } from './config';

/**
 * Log in a user
 * @param {Object} credentials - User credentials (username, password)
 * @returns {Promise<Object>} User data and token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.access) {
      localStorage.setItem('auth_token', data.access);
      
      // Store refresh token if available
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      
      // Store user data if available
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registered user data
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // Remove auth tokens and user data from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  
  // Return a resolved promise to maintain consistency with other API functions
  return Promise.resolve();
};

/**
 * Get current user data
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    // First check if we have the user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // For development, we'll return the stored user data
      // In production, you might want to verify with the server regardless
      return JSON.parse(storedUser);
    }
    
    // If not, fetch from API
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const userData = await handleResponse(response);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Failed to get current user:', error);
    // Clear stored user data if API call fails
    localStorage.removeItem('user');
    throw error;
  }
};