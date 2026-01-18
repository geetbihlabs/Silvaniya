'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from '@/components/product/ProductCard';

const newArrivals = [
  {
    id: '5',
    name: 'Minimalist Stud Earrings',
    slug: 'minimalist-stud-earrings',
    price: 999,
    image: '/images/product-5.jpg',
    isNew: true,
  },
  {
    id: '6',
    name: 'Twisted Hoop Earrings',
    slug: 'twisted-hoop-earrings',
    price: 1499,
    image: '/images/product-6.jpg',
    isNew: true,
  },
  {
    id: '7',
    name: 'Layered Chain Bracelet',
    slug: 'layered-chain-bracelet',
    price: 1799,
    image: '/images/product-7.jpg',
    isNew: true,
  },
  {
    id: '8',
    name: 'Statement Cocktail Ring',
    slug: 'statement-cocktail-ring',
    price: 2899,
    comparePrice: 3299,
    image: '/images/product-8.jpg',
    isNew: true,
  },
];

export function NewArrivals() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-100/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gold-100/30 rounded-full blur-3xl translate-x-1/2" />
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
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                Just Dropped
              </span>
            </div>
            <h2 className="font-display text-display-md font-bold text-silver-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-silver-600 max-w-md">
              Be the first to own our latest designs. Fresh styles crafted with 925 sterling silver, just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/products?filter=new"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-silver-900 text-silver-900 font-semibold rounded-full hover:bg-silver-900 hover:text-white transition-all duration-300"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {newArrivals.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center md:hidden"
        >
          <Link
            href="/products?filter=new"
            className="inline-flex items-center gap-2 text-silver-900 font-semibold"
          >
            View All New Arrivals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Decorative bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-silver-200 to-transparent"
        />
      </div>
    </section>
  );
}
