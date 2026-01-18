import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'Jewellery Care Guide | Silvaniya',
  description: 'Learn how to care for your 925 sterling silver jewellery. Tips to prevent tarnish and keep your Silvaniya jewellery shining.',
};

export default function JewelleryCarePage() {
  return <PageContent slug="jewellery-care" />;
}
