import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Terms of Service | Silvaniya',
  description: 'Read the terms and conditions for using Silvaniya website and purchasing our 925 sterling silver jewellery.',
};

export default function TermsOfServicePage() {
  return <PageContent slug="terms-of-service" />;
}
