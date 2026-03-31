'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSavedListings } from '@/hooks/useSavedListings';

const navLinks = [
  { label: 'Listings', href: '/listings' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { savedIds, isMounted: savedMounted } = useSavedListings();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savedCount = savedMounted ? savedIds.length : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
          Xquisite<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Saved Button with Count Badge */}
          <Link
            href="/saved"
            className="relative flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <Heart size={16} />
            Saved
            {savedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 dark:bg-white dark:text-slate-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">

          {/* Saved Button (Mobile) */}
          <Link
            href="/saved"
            className="relative p-2 text-slate-600 dark:text-slate-400"
            aria-label="Saved Properties"
          >
            <Heart size={22} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle (Mobile) */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 dark:text-slate-400"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            className="text-slate-900 dark:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-6 flex flex-col gap-6 shadow-lg absolute w-full top-full left-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-600 dark:text-slate-400 font-medium text-lg hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}