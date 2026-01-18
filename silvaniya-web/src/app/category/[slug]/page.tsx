'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heart, SlidersHorizontal, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number;
  primaryImage?: { url: string };
  avgRating: number;
  reviewCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children?: Category[];
  parent?: Category;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (slug) {
      fetchCategory();
      fetchProducts();
    }
  }, [slug, filters]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      params.append('categorySlug', slug);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            {category?.parent && (
              <>
                <Link href={`/category/${category.parent.slug}`} className="hover:text-gray-700">
                  {category.parent.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{categoryName}</span>
          </nav>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{categoryName}</h1>
          {category?.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {category?.children && category.children.length > 0 && (
        <div className="bg-white border-b">
          <div className="container-custom py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters({ ...filters, sortBy, sortOrder });
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="basePrice-asc">Price: Low to High</option>
                  <option value="basePrice-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{products.length} products</p>
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">No products found in this category</p>
                <Link href="/products" className="text-primary-600 hover:underline">
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                        {product.primaryImage ? (
                          <img
                            src={product.primaryImage.url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                        {product.compareAtPrice && (
                          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                            -{Math.round((1 - product.basePrice / product.compareAtPrice) * 100)}%
                          </span>
                        )}
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{formatPrice(product.basePrice)}</span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters({ ...filters, sortBy, sortOrder });
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="basePrice-asc">Price: Low to High</option>
                  <option value="basePrice-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full py-3 bg-primary-600 text-white rounded-lg font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
