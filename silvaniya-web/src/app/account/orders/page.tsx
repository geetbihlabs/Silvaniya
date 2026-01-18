'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">When you place orders, they will appear here</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white overflow-hidden"
                    >
                      {item.image && (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.items.length} items</p>
                  <p className="text-sm text-gray-500">Total: {formatPrice(order.totalAmount)}</p>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-1 text-primary-600 font-medium hover:underline"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
