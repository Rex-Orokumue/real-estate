'use client';

import { useState, useEffect } from 'react';

export function useSavedListings() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved items from local storage when the app mounts
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('xquisite_saved_listings');
    if (stored) {
      setSavedIds(JSON.parse(stored));
    }
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((item) => item !== id) : [...prev, id];
      // Save the new list back to local storage
      localStorage.setItem('xquisite_saved_listings', JSON.stringify(updated));
      return updated;
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved, isMounted };
}