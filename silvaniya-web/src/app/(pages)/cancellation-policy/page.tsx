import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Silvaniya',
  description: 'Understand Silvaniya cancellation policy for your silver jewellery orders.',
};

export default function CancellationPolicyPage() {
  return <PageContent slug="cancellation-policy" />;
}
