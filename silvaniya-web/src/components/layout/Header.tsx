'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, Heart, ShoppingBag, ChevronDown, Sparkles, Gift, TrendingUp } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

const categories = {
  rings: {
    name: 'Rings',
    href: '/category/rings',
    description: 'Statement & everyday rings',
    subcategories: [
      { name: 'All Rings', href: '/category/rings' },
      { name: 'Solitaire Rings', href: '/category/rings?type=solitaire' },
      { name: 'Statement Rings', href: '/category/rings?type=statement' },
      { name: 'Stackable Rings', href: '/category/rings?type=stackable' },
      { name: 'Band Rings', href: '/category/rings?type=band' },
      { name: 'Cocktail Rings', href: '/category/rings?type=cocktail' },
    ],
  },
  earrings: {
    name: 'Earrings',
    href: '/category/earrings',
    description: 'Studs to statement drops',
    subcategories: [
      { name: 'All Earrings', href: '/category/earrings' },
      { name: 'Stud Earrings', href: '/category/earrings?type=studs' },
      { name: 'Hoop Earrings', href: '/category/earrings?type=hoops' },
      { name: 'Drop Earrings', href: '/category/earrings?type=drops' },
      { name: 'Jhumkas', href: '/category/earrings?type=jhumkas' },
      { name: 'Chandeliers', href: '/category/earrings?type=chandeliers' },
    ],
  },
  necklaces: {
    name: 'Necklaces',
    href: '/category/necklaces',
    description: 'Chains & pendants',
    subcategories: [
      { name: 'All Necklaces', href: '/category/necklaces' },
      { name: 'Chains', href: '/category/necklaces?type=chains' },
      { name: 'Pendant Necklaces', href: '/category/necklaces?type=pendants' },
      { name: 'Layered Sets', href: '/category/necklaces?type=layered' },
      { name: 'Chokers', href: '/category/necklaces?type=chokers' },
      { name: 'Mangalsutra', href: '/category/necklaces?type=mangalsutra' },
    ],
  },
  bracelets: {
    name: 'Bracelets',
    href: '/category/bracelets',
    description: 'Bangles & cuffs',
    subcategories: [
      { name: 'All Bracelets', href: '/category/bracelets' },
      { name: 'Bangles', href: '/category/bracelets?type=bangles' },
      { name: 'Cuff Bracelets', href: '/category/bracelets?type=cuffs' },
      { name: 'Chain Bracelets', href: '/category/bracelets?type=chains' },
      { name: 'Charm Bracelets', href: '/category/bracelets?type=charms' },
      { name: 'Tennis Bracelets', href: '/category/bracelets?type=tennis' },
    ],
  },
  anklets: {
    name: 'Anklets',
    href: '/category/anklets',
    description: 'Delicate ankle jewellery',
    subcategories: [
      { name: 'All Anklets', href: '/category/anklets' },
      { name: 'Chain Anklets', href: '/category/anklets?type=chains' },
      { name: 'Charm Anklets', href: '/category/anklets?type=charms' },
      { name: 'Payal Sets', href: '/category/anklets?type=payal' },
    ],
  },
  pendants: {
    name: 'Pendants',
    href: '/category/pendants',
    description: 'Religious & trendy',
    subcategories: [
      { name: 'All Pendants', href: '/category/pendants' },
      { name: 'Religious Pendants', href: '/category/pendants?type=religious' },
      { name: 'Initial Pendants', href: '/category/pendants?type=initials' },
      { name: 'Heart Pendants', href: '/category/pendants?type=hearts' },
      { name: 'Evil Eye', href: '/category/pendants?type=evil-eye' },
    ],
  },
  nosePins: {
    name: 'Nose Pins',
    href: '/category/nose-pins',
    description: 'Studs & rings',
    subcategories: [
      { name: 'All Nose Pins', href: '/category/nose-pins' },
      { name: 'Nose Studs', href: '/category/nose-pins?type=studs' },
      { name: 'Nose Rings', href: '/category/nose-pins?type=rings' },
      { name: 'Septum Rings', href: '/category/nose-pins?type=septum' },
    ],
  },
  silverCoins: {
    name: 'Silver Coins',
    href: '/category/silver-coins',
    description: 'Investment & gifting',
    subcategories: [
      { name: 'All Coins', href: '/category/silver-coins' },
      { name: '10 Gram Coins', href: '/category/silver-coins?weight=10g' },
      { name: '20 Gram Coins', href: '/category/silver-coins?weight=20g' },
      { name: '50 Gram Coins', href: '/category/silver-coins?weight=50g' },
      { name: '100 Gram Coins', href: '/category/silver-coins?weight=100g' },
    ],
  },
};

const quickLinks = [
  { name: 'New Arrivals', href: '/products?filter=new', icon: Sparkles, color: 'text-purple-500' },
  { name: 'Bestsellers', href: '/products?filter=bestsellers', icon: TrendingUp, color: 'text-green-500' },
  { name: 'Gifts Under 2K', href: '/products?maxPrice=2000', icon: Gift, color: 'text-pink-500' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((state) => state.itemCount);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-silver-900 text-white text-center py-2.5 text-sm tracking-wide"
      >
        <span className="text-gold-400">✦</span>
        <span className="mx-2">Free Shipping on All Orders</span>
        <span className="hidden sm:inline mx-2">|</span>
        <span className="hidden sm:inline">BIS Hallmarked 925 Sterling Silver</span>
        <span className="ml-2 text-gold-400">✦</span>
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft'
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-silver-700 hover:text-silver-900"
            >
              <Menu className="h-6 w-6" />
            </motion.button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <motion.h1
                className="font-display text-2xl lg:text-3xl font-bold text-silver-900"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative">
                  Silvaniya
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {/* Shop Dropdown */}
              <div ref={shopMenuRef} className="relative">
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                    isShopMenuOpen ? 'text-silver-900' : 'text-silver-600 hover:text-silver-900'
                  }`}
                >
                  Shop
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Mega Menu */}
                <AnimatePresence>
                  {isShopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      onMouseLeave={() => setIsShopMenuOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white rounded-2xl shadow-elegant border border-silver-100 p-6 mt-2"
                    >
                      {/* Quick Links */}
                      <div className="flex gap-4 mb-6 pb-6 border-b border-silver-100">
                        {quickLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsShopMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-cream-50 rounded-full hover:bg-cream-100 transition-colors"
                          >
                            <link.icon className={`h-4 w-4 ${link.color}`} />
                            <span className="text-sm font-medium text-silver-700">{link.name}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-4 gap-6">
                        {Object.entries(categories).map(([key, category]) => (
                          <div key={key} className="group">
                            <Link
                              href={category.href}
                              onClick={() => setIsShopMenuOpen(false)}
                              className="block mb-3"
                            >
                              <h3 className="font-semibold text-silver-900 group-hover:text-gold-600 transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-xs text-silver-500">{category.description}</p>
                            </Link>
                            <ul className="space-y-1.5">
                              {category.subcategories.slice(1, 5).map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    onClick={() => setIsShopMenuOpen(false)}
                                    className="text-sm text-silver-600 hover:text-gold-600 transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Promo Banner */}
                      <div className="mt-6 pt-6 border-t border-silver-100">
                        <Link
                          href="/collections/wedding"
                          onClick={() => setIsShopMenuOpen(false)}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl hover:from-gold-100 hover:to-amber-100 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-gold-700">Wedding Collection</p>
                            <p className="text-xs text-silver-600">Discover bridal & wedding jewellery</p>
                          </div>
                          <span className="text-sm font-semibold text-gold-600">Shop Now →</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Nav Items */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/products?filter=new"
                  className="relative px-4 py-2 text-sm font-medium text-silver-600 hover:text-silver-900 transition-colors group"
                >
                  New Arrivals
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/products?filter=bestsellers"
                  className="relative px-4 py-2 text-sm font-medium text-silver-600 hover:text-silver-900 transition-colors group"
                >
                  Bestsellers
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/collections"
                  className="relative px-4 py-2 text-sm font-medium text-silver-600 hover:text-silver-900 transition-colors group"
                >
                  Collections
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/category/silver-coins"
                  className="relative px-4 py-2 text-sm font-medium text-silver-600 hover:text-silver-900 transition-colors group"
                >
                  Silver Coins
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-silver-600 hover:text-silver-900 hover:bg-silver-100 rounded-full transition-colors"
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* Account */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/account"
                  className="hidden sm:flex p-2.5 text-silver-600 hover:text-silver-900 hover:bg-silver-100 rounded-full transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
              </motion.div>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/account/wishlist"
                  className="hidden sm:flex p-2.5 text-silver-600 hover:text-silver-900 hover:bg-silver-100 rounded-full transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/cart"
                  className="relative p-2.5 text-silver-600 hover:text-silver-900 hover:bg-silver-100 rounded-full transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-silver-900">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-silver-600 hover:text-silver-900"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-50 rounded-full text-sm"
                    >
                      <link.icon className={`h-3.5 w-3.5 ${link.color}`} />
                      <span className="text-silver-700">{link.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Categories Accordion */}
                <nav className="space-y-1">
                  {Object.entries(categories).map(([key, category]) => (
                    <div key={key} className="border-b border-silver-100">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <span className="font-medium text-silver-800">{category.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-silver-400 transition-transform ${
                            expandedCategory === key ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedCategory === key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-4 space-y-1">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-4 py-2 text-sm text-silver-600 hover:text-silver-900 hover:bg-cream-50 rounded-lg"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-silver-200">
                  <div className="space-y-1">
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-silver-700 hover:text-silver-900 hover:bg-cream-100 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-silver-700 hover:text-silver-900 hover:bg-cream-100 rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-silver-700 hover:text-silver-900 hover:bg-cream-100 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Orders
                    </Link>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-cream-100 rounded-xl">
                  <p className="text-sm text-silver-600">Need help?</p>
                  <p className="font-medium text-silver-900">support@silvaniya.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 bg-white z-50 shadow-elegant"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4">
                  <Search className="h-6 w-6 text-silver-400" />
                  <input
                    type="text"
                    placeholder="Search for rings, earrings, necklaces..."
                    autoFocus
                    className="flex-1 text-lg outline-none placeholder:text-silver-400"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-silver-600 hover:text-silver-900"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-silver-100">
                  <p className="text-sm text-silver-500 mb-2">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Silver Rings', 'Jhumka Earrings', 'Chain Necklace', 'Silver Bangles', 'Nose Pins', 'Anklets'].map((term) => (
                      <Link
                        key={term}
                        href={`/products?search=${encodeURIComponent(term)}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="px-3 py-1.5 text-sm bg-cream-100 text-silver-700 rounded-full hover:bg-cream-200 transition-colors"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
