'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export function HeroBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      if (imageRef.current) {
        const scrolled = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0002})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const titleWords = "The Art of Eternal Shine".split(' ');

  return (
    <section ref={containerRef} className="relative h-[90vh] lg:h-screen overflow-hidden bg-silver-900">
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 scale-110"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-silver-900/95 via-silver-900/70 to-silver-900/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-silver-900/80 via-transparent to-transparent z-10" />

        {/* Placeholder background - replace with actual image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-silver-800 to-gold-900/30" />

        {/* Decorative elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8"
            >
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span className="text-sm font-medium text-white/90">BIS Hallmarked 925 Sterling Silver</span>
            </motion.div>

            {/* Title with word-by-word animation */}
            <h1 className="font-display text-display-xl font-bold text-white mb-6 leading-tight">
              {titleWords.map((word, index) => (
                <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + index * 0.1,
                      ease: [0.6, 0.01, 0.05, 0.95],
                    }}
                  >
                    {word === 'Eternal' || word === 'Shine' ? (
                      <span className="text-gold-400">{word}</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg lg:text-xl text-white/80 mb-10 max-w-xl leading-relaxed"
            >
              Discover our exquisite collection of hallmarked 925 sterling silver jewellery.
              Each piece is crafted with precision and designed to celebrate your unique style.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-silver-900 font-semibold rounded-full shadow-elegant hover:shadow-glow transition-all duration-300"
                >
                  Explore Collection
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/products?filter=new">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  New Arrivals
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-16 flex items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/60">Free Pan-India Shipping</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/60">Certified Authenticity</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/60">3-Day Easy Returns</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream-50 to-transparent z-10" />
    </section>
  );
}
