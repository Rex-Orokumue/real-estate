'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { listingService } from '@/services/listingService';
import { ListingType } from '@/types/listing';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUpload, { VideoUpload } from '@/components/ui/ImageUpload';

const propertyTypes: ListingType[] = [
  'apartment', 'duplex', 'self-contained', 'bungalow', 'terrace', 'studio'
];

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    type: 'apartment' as ListingType,
    bedrooms: 1,
    bathrooms: 1,
    videoUrl: '',
    contactPhone: '',
    contactWhatsApp: '',
    status: 'available' as 'available' | 'rented',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      // Auth guard
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Load existing listing data
      try {
        const listing = await listingService.getListingById(id);
        setForm({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          location: listing.location,
          type: listing.type,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          videoUrl: listing.videoUrl || '',
          contactPhone: listing.contactPhone,
          contactWhatsApp: listing.contactWhatsApp,
          status: listing.status,
          featured: listing.featured ?? false,
        });
        setImages(listing.images || []);
      } catch (err) {
        setError('Could not load listing. It may have been deleted.');
      } finally {
        setFetching(false);
      }
    }
    init();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : name === 'price' || name === 'bedrooms' || name === 'bathrooms'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await listingService.updateListing(id, { ...form, images });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Loading skeleton while fetching existing data
  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 transition-colors">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-16 z-40">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </header>
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 transition-colors">

      {/* Admin Topbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-16 z-40">
        <Link
          href="/admin/dashboard"
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
          Edit Listing
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Basic Info */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Basic Information
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Listing Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Luxury 3-Bedroom Duplex in Lekki"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the property — features, environment, nearby landmarks..."
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Annual Rent (₦)
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price || ''}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="e.g. 1500000"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Property Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors capitalize"
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Bedrooms
                </label>
                <input
                  name="bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min={0}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Bathrooms
                </label>
                <input
                  name="bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min={0}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Status — only shown on edit, not on new listing */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Listing Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Mark as &ldquo;Rented&rdquo; to hide this listing from public search results.
              </p>
            </div>

            {/* Featured toggle */}
            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Featured on Homepage</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  When enabled, this listing appears in the &ldquo;Featured Properties&rdquo; section on the homepage.
                </p>
              </div>
            </label>
          </section>

          {/* Images */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Images
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                First image will be used as the cover photo.
              </p>
            </div>
            <ImageUpload
              images={images}
              onChange={setImages}
            />
          </section>

          {/* Video */}
<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
  <div>
    <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
      Video Tour
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Upload a walkthrough video to give renters a better feel for the property.
    </p>
  </div>
  <VideoUpload
    videoUrl={form.videoUrl}
    onChange={(url: string) => setForm((prev) => ({ ...prev, videoUrl: url }))}
  />
</section>

          {/* Contact */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 08012345678"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  WhatsApp Number
                </label>
                <input
                  name="contactWhatsApp"
                  value={form.contactWhatsApp}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 08012345678"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}