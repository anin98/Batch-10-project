'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/app/CallAPI/orders';

export default function OrderConfirmationPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const orderData = await getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }

    // Check if user is logged in
    if (!localStorage.getItem('auth_token')) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [id, router]);

  // Format price helper
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '$0.00';
    return `$${numericPrice.toFixed(2)}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Order</h1>
        <p className="mt-4">{error}</p>
        <Link 
          href="/orders"
          className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
        </div>
        <p className="mt-2 text-green-700">
          Thank you for your order. Your order number is <strong>#{order.id}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
              <p className="mt-1 text-sm text-gray-900">#{order.id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(order.created)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
              <p className="mt-1 text-sm text-gray-900">
                {order.full_name}<br />
                {order.address}<br />
                {order.city}, {order.postal_code}<br />
                {order.email}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.product?.image || '/placeholder-product.jpg'}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="ml-4 flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.total_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}