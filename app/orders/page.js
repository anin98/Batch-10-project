'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders } from '@/app/CallAPI/orders';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    }

    // Check if user is logged in
    if (!localStorage.getItem('auth_token')) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [router]);

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
      day: 'numeric'
    });
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
        <h1 className="text-2xl font-bold text-red-600">Error Loading Orders</h1>
        <p className="mt-4">{error}</p>
        <Link 
          href="/products"
          className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <Link 
            href="/products"
            className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.created)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Total: <span className="font-semibold text-gray-900">{formatPrice(order.total_price)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Items: <span className="font-semibold text-gray-900">{order.items.length}</span>
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}