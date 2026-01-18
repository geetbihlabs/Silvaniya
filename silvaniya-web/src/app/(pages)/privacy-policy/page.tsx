import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | Silvaniya',
  description: 'Learn how Silvaniya collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return <PageContent slug="privacy-policy" />;
}
