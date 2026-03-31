'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search } from 'lucide-react';

const propertyTypes = ['apartment', 'duplex', 'studio', 'self-contained', 'bungalow', 'terrace'];

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state FROM the current URL params so filters persist on page load
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (selectedType) params.set('type', selectedType);
    router.push(`/listings?${params.toString()}`);
  };

  const handleClear = () => {
    setLocation('');
    setSelectedType('');
    router.push('/listings');
  };

  const handleTypeToggle = (type: string) => {
    // Clicking the same type again deselects it
    setSelectedType((prev) => (prev === type ? '' : type));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-28 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-heading font-bold text-lg text-slate-900 dark:text-white">
          <SlidersHorizontal size={20} className="text-blue-600 dark:text-blue-500" />
          Filters
        </div>
        {(location || selectedType) && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Location Search */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Search location..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Property Type */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
          Property Type
        </h4>
        <div className="flex flex-col gap-3">
          {propertyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedType === type}
                onChange={() => handleTypeToggle(type)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-transparent"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}