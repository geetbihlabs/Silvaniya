'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Mail, Phone, Instagram, Facebook, CreditCard, Wallet, Banknote, Shield } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/products?filter=new' },
    { name: 'Bestsellers', href: '/products?filter=bestseller' },
    { name: 'Rings', href: '/category/rings' },
    { name: 'Earrings', href: '/category/earrings' },
    { name: 'Necklaces', href: '/category/necklaces' },
    { name: 'Marketplace', href: '/marketplace' },
  ],
  help: [
    { name: 'Track Order', href: '/track' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Cancellation Policy', href: '/cancellation-policy' },
    { name: 'FAQ', href: '/faq' },
  ],
  about: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Jewellery Care', href: '/jewellery-care' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ],
};

export function Footer() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <footer className="bg-silver-900 text-silver-300" ref={ref}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="col-span-2 lg:col-span-1"
          >
            <Link href="/">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">
                Silvaniya
              </h2>
            </Link>
            <p className="text-sm text-silver-400 mb-6 leading-relaxed">
              The Art of Eternal Shine. Discover hallmarked 925 sterling silver jewellery, crafted with love.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/silvaniya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors group"
              >
                <Instagram className="h-5 w-5 text-silver-400 group-hover:text-white" />
              </a>
              <a
                href="https://facebook.com/silvaniya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors group"
              >
                <Facebook className="h-5 w-5 text-silver-400 group-hover:text-white" />
              </a>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-400 hover:text-gold-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-400 hover:text-gold-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-400 hover:text-gold-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-2 md:col-span-4 lg:col-span-1"
          >
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-silver-400">support@silvaniya.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-silver-400">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-silver-400">
                  New Cinema Road, Below Town Post Office,<br />
                  Siliguri, West Bengal - 734004
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Payment & Trust Section */}
      <div className="border-t border-silver-800">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-silver-500">We accept:</span>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white/10 rounded flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-silver-400" />
                  <span className="text-xs text-silver-400">Cards</span>
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-silver-400" />
                  <span className="text-xs text-silver-400">UPI</span>
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-silver-400" />
                  <span className="text-xs text-silver-400">COD</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-sm text-silver-500">
              <Shield className="h-5 w-5 text-gold-500" />
              <span>100% Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-silver-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-silver-500">
              &copy; {new Date().getFullYear()} Silvaniya (Vernium Gold Private Limited). All rights reserved.
            </p>
            <p className="text-xs text-silver-600">
              Crafted with love in Siliguri, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
