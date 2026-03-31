'use client';

import { Share2, Heart } from 'lucide-react';
import { useSavedListings } from '@/hooks/useSavedListings';
import { useState } from 'react';

interface ListingActionsProps {
  listingId: string;
  listingTitle: string;
}

export default function ListingActions({ listingId, listingTitle }: ListingActionsProps) {
  const { toggleSave, isSaved, isMounted } = useSavedListings();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    // Use the native mobile share menu if available (great for phones)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: `Check out this property on Xquisite Rentals: ${listingTitle}`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback: Copy to clipboard for desktop users
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Prevent rendering the heart as empty/filled incorrectly before reading local storage
  if (!isMounted) return null; 

  const saved = isSaved(listingId);

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleShare}
        className="relative p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
        title="Share Property"
      >
        <Share2 size={20} />
        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded-md">
            Copied!
          </span>
        )}
      </button>
      
      <button 
        onClick={() => toggleSave(listingId)}
        className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all duration-300"
        title={saved ? "Remove from Saved" : "Save Property"}
      >
        <Heart 
          size={20} 
          className={saved ? "fill-blue-500 text-blue-500 scale-110" : ""} 
        />
      </button>
    </div>
  );
}