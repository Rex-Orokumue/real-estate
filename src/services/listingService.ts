import { supabase } from '@/lib/supabase';
import { Listing, CreateListingInput } from '@/types/listing';

// ─────────────────────────────────────────────
// This is the ONLY file that knows about Supabase.
// If you migrate to Firebase or another backend,
// only rewrite this file. Nothing else changes.
// ─────────────────────────────────────────────

export const listingService = {

  async getAllListings(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('"createdAt"', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Listing[];
  },

  async getAvailableListings(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'available')
      .order('"createdAt"', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Listing[];
  },

  async getListingById(id: string): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Listing;
  },

  async createListing(input: CreateListingInput): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .insert([input])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Listing;
  },

  async updateListing(id: string, input: Partial<CreateListingInput>): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Listing;
  },

  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async searchListings(query: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
      .eq('status', 'available');

    if (error) throw new Error(error.message);
    return data as Listing[];
  },

  async filterListings(filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Listing[]> {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'available');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Listing[];
  },
};