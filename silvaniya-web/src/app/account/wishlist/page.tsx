'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Save items you love to buy them later</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden group">
              <Link href={`/products/${item.slug}`}>
                <div className="relative aspect-square bg-gray-100">
                  {item.primaryImage ? (
                    <img
                      src={item.primaryImage.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="font-semibold text-gray-900 mt-1">{formatPrice(item.basePrice)}</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button className="p-2 border rounded-lg text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
