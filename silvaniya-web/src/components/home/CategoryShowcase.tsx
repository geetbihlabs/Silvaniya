'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

const categoryColors: Record<string, string> = {
  rings: 'from-rose-900/80 to-rose-700/60',
  earrings: 'from-violet-900/80 to-violet-700/60',
  necklaces: 'from-amber-900/80 to-amber-700/60',
  bracelets: 'from-teal-900/80 to-teal-700/60',
  anklets: 'from-pink-900/80 to-pink-700/60',
  pendants: 'from-indigo-900/80 to-indigo-700/60',
  'nose-pins': 'from-purple-900/80 to-purple-700/60',
  'silver-coins': 'from-yellow-900/80 to-yellow-700/60',
};

export function CategoryShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        if (data.success && data.data) {
          // Get first 4 main categories
          const mainCategories = data.data.filter((c: Category) =>
            ['rings', 'earrings', 'necklaces', 'bracelets'].includes(c.slug)
          );
          setCategories(mainCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-sm font-medium text-gold-600 uppercase tracking-wider mb-3 block">
            Browse Categories
          </span>
          <h2 className="font-display text-display-md font-bold text-silver-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-silver-600 max-w-xl mx-auto">
            Explore our stunning collection of 925 sterling silver jewellery,
            crafted for every occasion and style.
          </p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-silver-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  {/* Background Image */}
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-silver-200 to-silver-300" />
                  )}

                  {/* Gradient Overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-t ${categoryColors[category.slug] || 'from-silver-900/80 to-silver-700/60'}`}
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.85 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/50 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                    <motion.div
                      initial={{ y: 0 }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white/70 text-sm mb-1">{category.description || 'Shop now'}</p>
                      <h3 className="text-white font-display text-xl lg:text-2xl font-bold mb-3">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <span>Explore</span>
                        <motion.span
                          className="inline-block"
                          whileHover={{ x: 4, y: -4 }}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover effect - subtle scale */}
                  <motion.div
                    className="absolute inset-0 bg-white/0"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 lg:mt-16"
        >
          <Link
            href="/category/silver-coins"
            className="group block relative bg-gradient-to-r from-gold-100 via-gold-50 to-amber-100 rounded-2xl overflow-hidden"
          >
            <div className="px-6 lg:px-12 py-8 lg:py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <span className="text-sm font-medium text-gold-700 uppercase tracking-wider mb-2 block">
                  Special Collection
                </span>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-silver-900 mb-2">
                  Silver Coins & Gift Sets
                </h3>
                <p className="text-silver-600">
                  Perfect for gifting, celebrations, and investments
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-silver-900 text-white font-semibold rounded-full flex items-center gap-2 group-hover:bg-silver-800 transition-colors"
              >
                Shop Now
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
