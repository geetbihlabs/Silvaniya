'use client';

import {
  ShoppingCart,
  IndianRupee,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

// Placeholder stats - will be fetched from API
const stats = [
  {
    name: "Today's Orders",
    value: '12',
    change: '+20%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    name: "Today's Revenue",
    value: '₹45,230',
    change: '+15%',
    trend: 'up',
    icon: IndianRupee,
  },
  {
    name: 'Total Products',
    value: '124',
    change: '+3',
    trend: 'up',
    icon: Package,
  },
  {
    name: 'Total Customers',
    value: '1,234',
    change: '+56',
    trend: 'up',
    icon: Users,
  },
];

const recentOrders = [
  {
    id: 'SIL-20260107-0001',
    customer: 'Priya Sharma',
    total: '₹2,499',
    status: 'CONFIRMED',
    date: '2 hours ago',
  },
  {
    id: 'SIL-20260107-0002',
    customer: 'Rahul Kumar',
    total: '₹4,999',
    status: 'PROCESSING',
    date: '3 hours ago',
  },
  {
    id: 'SIL-20260106-0015',
    customer: 'Anita Patel',
    total: '₹1,899',
    status: 'SHIPPED',
    date: 'Yesterday',
  },
];

const lowStockProducts = [
  { name: 'Amethyst Silver Ring - Size 6', stock: 3, threshold: 5 },
  { name: 'Pearl Drop Earrings', stock: 2, threshold: 5 },
  { name: 'Silver Chain Necklace', stock: 4, threshold: 5 },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <span
                className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.total}</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <a
              href="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all orders →
            </a>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((product, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <p className="text-gray-900">{product.name}</p>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <a
              href="/inventory"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Manage inventory →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
