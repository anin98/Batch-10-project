// lib/api/products.js
// API functions for product-related endpoints

import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Get all products with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} List of products
 */
export const getProducts = async (params = {}) => {
  try {
    // Convert params object to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/products/${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

/**
 * Get a single product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object>} Product details
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Get featured products
 * @returns {Promise<Array>} List of featured products
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/featured/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    throw error;
  }
};