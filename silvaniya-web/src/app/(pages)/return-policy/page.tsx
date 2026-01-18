import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Return Policy | Silvaniya',
  description: 'Learn about Silvaniya return and refund policy for silver coins and jewellery.',
};

export default function ReturnPolicyPage() {
  return <PageContent slug="return-policy" />;
}
