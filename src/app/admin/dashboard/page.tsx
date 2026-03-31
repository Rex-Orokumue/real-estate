'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { listingService } from '@/services/listingService';
import { Listing } from '@/types/listing';
import Link from 'next/link';
import {
  Plus, LogOut, Pencil, Trash2,
  Home, CheckCircle, XCircle, LayoutDashboard
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      await fetchListings();
    }
    init();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const data = await listingService.getAllListings();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeletingId(id);
    try {
      await listingService.deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const available = listings.filter((l) => l.status === 'available').length;
  const rented = listings.filter((l) => l.status === 'rented').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 transition-colors">

      {/* Admin Topbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-16 z-40">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} className="text-blue-600" />
          <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/listings/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Listing
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
              <Home size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Listings</p>
              <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{listings.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
              <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{available}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500">
              <XCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rented</p>
              <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{rented}</p>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              All Listings
            </h2>
            <span className="text-sm text-slate-400">{listings.length} total</span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <Home size={32} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="font-heading font-bold text-slate-900 dark:text-white mb-1">No listings yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Add your first property to get started.
              </p>
              <Link
                href="/admin/listings/new"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add First Listing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home size={18} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {listing.location} · ₦{listing.price.toLocaleString()}/yr
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${
                    listing.status === 'available'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                  }`}>
                    {listing.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/listings/${listing.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      {deletingId === listing.id ? (
                        <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}