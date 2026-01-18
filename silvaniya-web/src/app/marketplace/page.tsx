import { Metadata } from 'next';
import { MarketplacePage } from '@/components/marketplace/MarketplacePage';

export const metadata: Metadata = {
  title: 'Marketplace | Silvaniya - Shop from Partner Jewellers',
  description: 'Discover exquisite silver jewellery from our partner vendors across India. Shop authentic 925 sterling silver from trusted jewellers.',
};

export default function Marketplace() {
  return <MarketplacePage />;
}
