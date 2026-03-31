import { listingService } from '@/services/listingService';
import ListingCard from '@/components/listings/ListingCard';
import SearchFilter from '@/components/listings/SearchFilter';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AllListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const locationQuery = typeof params.location === 'string' ? params.location : '';
  const typeQuery = typeof params.type === 'string' ? params.type : '';

  let listings = await listingService.filterListings({
    type: typeQuery || undefined,
  });

  if (locationQuery) {
    const lowerQuery = locationQuery.toLowerCase();
    listings = listings.filter(
      (listing) =>
        listing.location.toLowerCase().includes(lowerQuery) ||
        listing.title.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            {locationQuery || typeQuery ? 'Search Results' : 'Browse Properties'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
            Showing {listings.length} available {listings.length === 1 ? 'property' : 'properties'}
            {locationQuery && ` near "${locationQuery}"`}
            {typeQuery && ` of type "${typeQuery}"`}.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filter Sidebar — wrapped in Suspense because it uses useSearchParams */}
          <aside className="w-full lg:w-72 shrink-0">
            <Suspense fallback={<div className="h-96 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />}>
              <SearchFilter />
            </Suspense>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="relative h-full">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            {listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-slate-400" size={24} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                  We couldn't find any properties matching your search. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}