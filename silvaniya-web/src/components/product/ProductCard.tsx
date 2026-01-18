'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    image: string;
    isNew?: boolean;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    // Use a consistent format to avoid hydration mismatch
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <motion.div
          className="relative aspect-square bg-cream-100 rounded-2xl overflow-hidden mb-4"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Background gradient placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-cream-200 via-cream-100 to-silver-100" />

          {/* Image zoom effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/0"
            animate={{ backgroundColor: isHovered ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNew && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1.5 text-xs font-bold bg-silver-900 text-white rounded-full uppercase tracking-wider"
              >
                New
              </motion.span>
            )}
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-full"
              >
                -{discount}%
              </motion.span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-2.5 rounded-full shadow-soft backdrop-blur-sm transition-colors ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-silver-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Quick add button */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
              className="w-full py-3 bg-silver-900 text-white text-sm font-semibold rounded-xl hover:bg-silver-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </button>
          </motion.div>
        </motion.div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-silver-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-silver-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-silver-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          {/* Subtle purity indicator */}
          <p className="text-xs text-silver-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            925 Sterling Silver
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
