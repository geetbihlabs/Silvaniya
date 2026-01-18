import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'FAQ | Silvaniya - Frequently Asked Questions',
  description: 'Find answers to common questions about Silvaniya jewellery, payments, delivery, returns, and care instructions.',
};

export default function FAQPage() {
  return <PageContent slug="faq" />;
}
