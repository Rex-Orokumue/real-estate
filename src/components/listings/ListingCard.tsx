'use client'; // Added this so we can use interactive hooks

import Link from 'next/link';
import { MapPin, Bed, Bath, Heart } from 'lucide-react';
import { Listing } from '@/types/listing';
import { useSavedListings } from '@/hooks/useSavedListings'; // Imported our hook

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Initialize the save logic
  const { toggleSave, isSaved, isMounted } = useSavedListings();

  const coverImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  // Check if it's saved (only after mounting to prevent hydration errors)
  const saved = isMounted ? isSaved(listing.id) : false;

  // Handle the click safely without triggering the card's link
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(listing.id);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 flex flex-col h-full relative">
      
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={coverImage} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900 dark:text-white shadow-sm uppercase tracking-wider z-20">
          {listing.status}
        </div>
        
        {/* INTERACTIVE SAVE BUTTON (Notice the z-20 to sit above the link) */}
        <button 
          onClick={handleSaveClick}
          className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors shadow-sm z-20"
          title={saved ? "Remove from Saved" : "Save Property"}
        >
          <Heart 
            size={18} 
            className={saved ? "fill-blue-500 text-blue-500 scale-110 transition-transform" : "transition-transform"} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white line-clamp-1">
            {listing.title}
          </h3>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg whitespace-nowrap">
            ₦{listing.price.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/yr</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-4">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Bed size={16} className="text-slate-400" />
              <span>{listing.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} className="text-slate-400" />
              <span>{listing.bathrooms} Baths</span>
            </div>
          </div>
          <span className="capitalize bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium">
            {listing.type}
          </span>
        </div>
      </div>

      {/* Clickable Overlay */}
      <Link href={`/listings/${listing.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View Details for {listing.title}</span>
      </Link>
    </div>
  );
}