import Link from 'next/link';
import { ArrowRight, ShieldCheck, Wallet, Home as HomeIcon } from 'lucide-react';
import HeroSearch from '@/components/ui/HeroSearch';
import ListingCard from '@/components/listings/ListingCard';
import { listingService } from '@/services/listingService';

export default async function HomePage() {
  const featuredListings = await listingService.getFeaturedListings();
  // Fallback: if no listings have been marked featured, show 3 most-recent available ones
  const displayListings =
    featuredListings.length > 0
      ? featuredListings
      : (await listingService.getAvailableListings()).slice(0, 3);


  return (
    <div className="min-h-screen flex flex-col">

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex-grow flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 transition-colors">
              Discover a home that <br className="hidden md:block" />
              matches your <span className="text-blue-600 dark:text-blue-500">ambition.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed transition-colors">
              Explore premium, verified apartments and luxury homes. No scams, no hidden fees — just your next address.
            </p>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">100% Verified Listings</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We physically verify every property on our platform to ensure your safety and peace of mind.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <Wallet size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Transparent Pricing</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No hidden agency fees. What you see is what you pay, dealing directly with verified providers.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <HomeIcon size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Quality Selection</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A curated portfolio ranging from modern studios to luxury duplexes across the region.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-3 transition-colors">
                Featured Properties
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
                Handpicked homes available right now.
              </p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              View all listings <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayListings.length > 0 ? (
              displayListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <p className="text-slate-500 col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                Refreshing our featured listings. Check back shortly!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. OWNER CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl transition-all">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Are you a property owner?
              </h2>
              <p className="text-slate-300 dark:text-blue-50 text-lg">
                List your property on Xquisite Rentals and connect with verified tenants across the region.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors whitespace-nowrap w-full md:w-auto text-center"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}