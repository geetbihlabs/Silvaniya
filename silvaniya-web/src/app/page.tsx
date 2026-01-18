import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { NewArrivals } from '@/components/home/NewArrivals';
import { TrustBadges } from '@/components/home/TrustBadges';
import { Newsletter } from '@/components/home/Newsletter';

export default async function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CategoryShowcase />
      <FeaturedProducts />
      <NewArrivals />
      <Newsletter />
    </>
  );
}
