export type ListingStatus = 'available' | 'rented';

export type ListingType =
  | 'apartment'
  | 'duplex'
  | 'self-contained'
  | 'bungalow'
  | 'terrace'
  | 'studio';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;               // monthly rent in Naira
  location: string;
  type: ListingType;
  bedrooms: number;
  bathrooms: number;
  images: string[];            // Cloudinary URLs
  videoUrl?: string;           // Cloudinary video URL (optional)
  status: ListingStatus;
  featured: boolean;           // shown in the homepage Featured section
  contactPhone: string;
  contactWhatsApp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  location: string;
  type: ListingType;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  videoUrl?: string;
  featured?: boolean;
  contactPhone: string;
  contactWhatsApp: string;
}