// app/page.js
import Hero from '@/components/Hero';
import FeaturedJobs from '@/components/FeaturedJobs';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedJobs />
      <HowItWorks />
    </>
  );
}