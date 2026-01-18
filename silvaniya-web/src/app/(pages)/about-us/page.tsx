import { Metadata } from 'next';
import { PageContent } from '@/components/cms/PageContent';

export const metadata: Metadata = {
  title: 'About Us | Silvaniya - The Art of Eternal Shine',
  description: 'Discover Silvaniya - crafting hallmarked 925 sterling silver jewellery that blends artistry, purity, and modern design.',
};

export default function AboutUsPage() {
  return <PageContent slug="about-us" />;
}
