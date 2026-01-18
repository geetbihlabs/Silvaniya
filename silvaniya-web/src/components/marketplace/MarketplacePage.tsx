'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Store, MapPin, ExternalLink, Heart, ShoppingBag } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  city?: string;
  state?: string;
  isFeatured: boolean;
  _count: {
    products: number;
  };
}

interface VendorProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  category?: string;
  purity?: string;
  externalUrl?: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
}

export function MarketplacePage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vendorsRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/products?limit=12`),
        ]);

        const vendorsData = await vendorsRes.json();
        const productsData = await productsRes.json();

        if (vendorsData.success && vendorsData.data) {
          setVendors(vendorsData.data);
        }

        if (productsData.success && productsData.data) {
          setProducts(productsData.data.data || productsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = selectedVendor
    ? products.filter((p) => p.vendor.slug === selectedVendor)
    : products;

  const formatPrice = (price: string | number) => {
    return `₹${parseFloat(String(price)).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gold-900 via-gold-800 to-amber-900 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Store className="h-8 w-8 text-gold-300" />
              <span className="text-gold-300 text-sm font-medium uppercase tracking-wider">
                Partner Jewellers
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mb-4">
              Silvaniya Marketplace
            </h1>
            <p className="text-gold-200 max-w-2xl mx-auto text-lg">
              Discover exquisite silver jewellery from our trusted partner vendors across India.
              Each piece is crafted with the same commitment to quality and authenticity.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Vendors Section */}
        <section ref={ref} className="mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl lg:text-3xl font-bold text-silver-900 mb-8"
          >
            Our Partner Jewellers
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-silver-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map((vendor, index) => (
                <motion.button
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() =>
                    setSelectedVendor(selectedVendor === vendor.slug ? null : vendor.slug)
                  }
                  className={`relative p-6 rounded-2xl text-left transition-all ${
                    selectedVendor === vendor.slug
                      ? 'bg-gold-50 border-2 border-gold-500 shadow-lg'
                      : 'bg-white border-2 border-transparent shadow-soft hover:shadow-medium hover:border-gold-200'
                  }`}
                >
                  {vendor.isFeatured && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-gold-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    {vendor.logo ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-silver-100 flex-shrink-0">
                        <Image
                          src={vendor.logo}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-silver-900 mb-1">
                        {vendor.name}
                      </h3>
                      {(vendor.city || vendor.state) && (
                        <p className="flex items-center gap-1 text-sm text-silver-500 mb-2">
                          <MapPin className="h-3 w-3" />
                          {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-silver-600 line-clamp-2">{vendor.description}</p>
                      <p className="mt-2 text-xs text-gold-600 font-medium">
                        {vendor._count.products} products
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-silver-900">
              {selectedVendor
                ? `Products from ${vendors.find((v) => v.slug === selectedVendor)?.name}`
                : 'All Marketplace Products'}
            </h2>
            {selectedVendor && (
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-sm text-gold-600 hover:text-gold-700 font-medium"
              >
                View All
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-silver-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-silver-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-square bg-cream-100 rounded-2xl overflow-hidden mb-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-silver-200 to-silver-300" />
                    )}

                    {/* Vendor Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                      <p className="text-xs font-medium text-silver-700">{product.vendor.name}</p>
                    </div>

                    {/* Discount Badge */}
                    {product.compareAtPrice && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -
                        {Math.round(
                          ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
                            parseFloat(product.compareAtPrice)) *
                            100
                        )}
                        %
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {product.externalUrl ? (
                        <a
                          href={product.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-gold-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gold-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View at {product.vendor.name}
                        </a>
                      ) : (
                        <button className="w-full py-2.5 bg-silver-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-silver-800 transition-colors">
                          <ShoppingBag className="h-4 w-4" />
                          Quick View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-silver-900 mb-1 line-clamp-2 group-hover:text-gold-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-silver-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-silver-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {product.purity && (
                      <p className="text-xs text-silver-500 mt-1">
                        {product.purity} Sterling Silver
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
