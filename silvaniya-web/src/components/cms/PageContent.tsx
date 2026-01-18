'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDesc?: string;
}

interface PageContentProps {
  slug: string;
}

export function PageContent({ slug }: PageContentProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/pages/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPage(data.data);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        setError('Failed to load page');
        console.error('Failed to fetch page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-silver-200 rounded w-1/3 mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-silver-200 rounded w-full" />
                <div className="h-4 bg-silver-200 rounded w-5/6" />
                <div className="h-4 bg-silver-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-cream-50 py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-silver-900 mb-4">Page Not Found</h1>
          <p className="text-silver-600">{error || 'The requested page could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-silver-900 via-silver-800 to-silver-900 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl lg:text-5xl font-bold text-white text-center"
          >
            {page.title}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft p-8 lg:p-12"
          >
            <div
              className="prose prose-silver max-w-none
                prose-headings:font-display prose-headings:text-silver-900
                prose-h1:text-3xl prose-h1:mb-6
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-silver-200 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-silver-700 prose-p:leading-relaxed
                prose-ul:text-silver-700 prose-ul:my-4
                prose-li:my-1
                prose-strong:text-silver-900
                prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
