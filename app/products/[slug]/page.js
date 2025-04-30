'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/app/CallAPI/product';

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product from API
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [slug]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    // We'll implement this in Class 2
    console.log(`Adding ${quantity} of ${product?.name} to cart`);
  };
  
  // Updated function to use the URL directly from the product model
  const getImageSrc = () => {
    if (!product || !product.image) {
      return '/placeholder-product.jpg';
    }
    
    // Just return the image URL as it is now stored as a URLField
    return product.image;
  };
  
  // Format price with proper error handling
  const formatPrice = (price) => {
    // Convert price to a number if it's not already
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number after conversion
    if (isNaN(numericPrice)) {
      return '$0.00';
    }
    
    // Format the price with 2 decimal places
    return `$${numericPrice.toFixed(2)}`;
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="mt-4">{error}</p>
        <Link 
          href="/products"
          className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }
  
  if (!product) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image 
            src={getImageSrc()} 
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="mt-4">
            <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</p>
            
            <p className="mt-2 text-sm text-gray-500">
              {product.stock > 0 
                ? `In stock (${product.stock} available)` 
                : 'Out of stock'}
            </p>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-base text-gray-500">{product.description}</p>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.stock || 10}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
          
          {/* Additional product details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Details</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="flex py-2">
                <dt className="w-1/3 text-sm font-medium text-gray-500">Category</dt>
                <dd className="w-2/3 text-sm text-gray-900">{product.category_name}</dd>
              </div>
              <div className="flex py-2">
                <dt className="w-1/3 text-sm font-medium text-gray-500">Availability</dt>
                <dd className="w-2/3 text-sm text-gray-900">
                  {product.available ? 'In stock' : 'Out of stock'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}