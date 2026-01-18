'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Award, Gem, BadgeCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const badges = [
  {
    icon: Shield,
    title: 'BIS Hallmarked',
    description: '925 Sterling Silver',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Pan India Delivery',
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '3-Day Return Policy',
    color: 'from-amber-500/20 to-amber-600/20',
    iconColor: 'text-amber-600',
  },
  {
    icon: BadgeCheck,
    title: 'Certified Quality',
    description: 'Authenticity Guaranteed',
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-600',
  },
];

export function TrustBadges() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
            hidden: {},
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-cream-50 rounded-2xl p-6 lg:p-8 border border-silver-100 hover:border-silver-200 hover:shadow-soft transition-all duration-300"
            >
              {/* Icon container */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <badge.icon className={`h-7 w-7 ${badge.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-silver-900 text-base lg:text-lg mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-silver-500">{badge.description}</p>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-silver-100 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-silver-500 mt-8"
        >
          <Gem className="inline h-4 w-4 mr-1 text-gold-500" />
          Trusted by over 10,000+ customers across India
        </motion.p>
      </div>
    </section>
  );
}
