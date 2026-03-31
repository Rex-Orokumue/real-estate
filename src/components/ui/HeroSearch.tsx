'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ChevronDown } from 'lucide-react';

const propertyTypes = [
  { value: '', label: 'Property Type' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'studio', label: 'Studio' },
  { value: 'self-contained', label: 'Self-Contained' },
  { value: 'bungalow', label: 'Bungalow' },
];

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [type, setType] = useState(propertyTypes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.append('location', location.trim());
    if (type.value) params.append('type', type.value);
    
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3 max-w-3xl transition-all"
    >
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
        <MapPin className="text-slate-400 dark:text-slate-500 shrink-0" size={20} />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where do you want to live?"
          className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg"
        />
      </div>
      
      <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
      
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 relative" ref={dropdownRef}>
        <Building className="text-slate-400 dark:text-slate-500 shrink-0" size={20} />
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between bg-transparent border-none outline-none text-slate-900 dark:text-white text-lg cursor-pointer"
          >
            <span className="truncate">{type.label}</span>
            <ChevronDown 
              className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              size={18} 
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-4 w-full min-w-[220px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-[60] overflow-hidden">
              <div className="py-2 max-h-60 overflow-y-auto">
                {propertyTypes.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setType(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                      type.value === option.value 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit"
        className="w-full md:w-auto bg-blue-600 text-white h-14 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-semibold shadow-sm shrink-0"
      >
        <Search size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}