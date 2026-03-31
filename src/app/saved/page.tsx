'use client';

import { useEffect, useState } from 'react';
import { useSavedListings } from '@/hooks/useSavedListings';
import { listingService } from '@/services/listingService';
import { Listing } from '@/types/listing';
import ListingCard from '@/components/listings/ListingCard';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function SavedPage() {
  const { savedIds, isMounted } = useSavedListings();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMounted) return;

    async function fetchSaved() {
      setLoading(true);
      if (savedIds.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      // Fetch all saved listings in parallel
      const results = await Promise.allSettled(
        savedIds.map((id) => listingService.getListingById(id))
      );

      const fetched = results
        .filter((r): r is PromiseFulfilledResult<Listing> => r.status === 'fulfilled')
        .map((r) => r.value);

      setListings(fetched);
      setLoading(false);
    }

    fetchSaved();
  }, [savedIds, isMounted]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to listings
          </Link>
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            Saved Properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isMounted && !loading
              ? `${listings.length} saved ${listings.length === 1 ? 'property' : 'properties'}`
              : 'Loading your saved properties...'}
          </p>
        </div>

        {/* Loading State */}
        {(!isMounted || loading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isMounted && !loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
              No saved properties yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
              When you save a property, it will appear here so you can revisit it anytime.
            </p>
            <Link
              href="/listings"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {isMounted && !loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}