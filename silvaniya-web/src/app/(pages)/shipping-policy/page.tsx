import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Shipping Policy | Silvaniya - Free Pan-India Delivery',
  description: 'Learn about Silvaniya shipping policy, delivery timelines, and our partnership with Blue Dart.',
};

export default function ShippingPolicyPage() {
  return <PageContent slug="shipping-policy" />;
}
