'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from '@/components/product/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  compareAtPrice?: string | null;
  primaryImage?: {
    url: string;
    alt?: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
}

export function FeaturedProducts() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured?limit=8`);
        const data = await res.json();
        if (data.success && data.data) {
          setProducts(data.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: parseFloat(p.basePrice),
    comparePrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : undefined,
    image: p.primaryImage?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    isNew: p.isNew,
    isFeatured: p.isFeatured,
  }));

  return (
    <section className="py-16 lg:py-24 bg-cream-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-gold-500" />
              <span className="text-sm font-medium text-gold-600 uppercase tracking-wider">
                Curated Selection
              </span>
            </div>
            <h2 className="font-display text-display-md font-bold text-silver-900 mb-2">
              Featured Collection
            </h2>
            <p className="text-silver-600 max-w-md">
              Discover our most loved pieces, handpicked for their exceptional craftsmanship and timeless elegance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/products?filter=featured"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-silver-900 text-white font-semibold rounded-full hover:bg-silver-800 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-silver-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {mappedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center md:hidden"
        >
          <Link
            href="/products?filter=featured"
            className="inline-flex items-center gap-2 text-silver-900 font-semibold"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
