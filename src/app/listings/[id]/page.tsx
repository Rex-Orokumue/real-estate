import { listingService } from '@/services/listingService';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Home as HomeIcon, MessageCircle, Phone, Heart, Share2 } from 'lucide-react';
import ListingActions from '@/components/listings/ListingActions';

// In Next.js 15, params is a Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default async function SingleListingPage({ params }: Props) {
  const { id } = await params;
  
  const listing = await listingService.getListingById(id).catch(() => null);
  
  if (!listing) {
    notFound();
  }

  const coverImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  // Format the WhatsApp link (assuming Nigerian numbers for Xquisite Rentals)
  const formattedWhatsApp = listing.contactWhatsApp.startsWith('0') 
    ? `234${listing.contactWhatsApp.substring(1)}` 
    : listing.contactWhatsApp;
  
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=Hi,%20I%20saw%20your%20listing%20for%20"${encodeURIComponent(listing.title)}"%20on%20Xquisite%20Rentals.%20Is%20it%20still%20available?`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors">
      
      {/* Massive Image Header */}
      <div className="w-full h-[40vh] md:h-[60vh] relative bg-slate-200 dark:bg-slate-800">
        <img 
          src={coverImage} 
          alt={listing.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 bg-blue-600 text-white text-sm font-bold uppercase tracking-wider rounded-full">
                {listing.status}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-200 text-lg">
                <MapPin size={18} />
                {listing.location}
              </div>
            </div>
            
            {/* REPLACED THE STATIC BUTTONS WITH THE INTERACTIVE COMPONENT */}
            <ListingActions listingId={listing.id} listingTitle={listing.title} />
            
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-6 md:gap-12 py-6 border-b border-slate-200 dark:border-slate-800 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Bed size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bedrooms</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{listing.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Bath size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{listing.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <HomeIcon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Property Type</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg capitalize">{listing.type}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">About this Property</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              {/* Splitting by newline to create proper paragraphs */}
              {listing.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Video Tour */}
            {listing.videoUrl && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                  Video Tour
                </h2>
                <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
                  <video
                    src={listing.videoUrl}
                    controls
                    className="w-full max-h-[500px] object-contain"
                    poster={listing.images?.[0]}
                  />
                </div>
              </div>
            )}
        </div>

        {/* Sticky Contact Sidebar */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sticky top-28 shadow-xl dark:shadow-none transition-colors">
            <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Rent per year</p>
            <h3 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-8">
              ₦{listing.price.toLocaleString()}
            </h3>

            <div className="flex flex-col gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#1EBE57] transition-colors shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
              
              <a 
                href={`tel:${listing.contactPhone}`}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <Phone size={20} />
                Call Agent
              </a>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Mention <span className="font-semibold text-slate-700 dark:text-slate-300">Xquisite Rentals</span> when you call to get priority service.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}