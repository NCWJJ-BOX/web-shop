import { supabase } from './supabase';
import { Product, Category } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data || []).map((c: Record<string, unknown>) => ({
    id: String(c.id),
    name: c.name as string,
    icon: (c.icon as string) || '',
    count: (c.count as number) || 0,
  }));
}

export async function fetchProducts(categoryId?: string, search?: string): Promise<Product[]> {
  let query = supabase
    .from('Product')
    .select('*')
    .eq('isActive', true)
    .order('name');

  if (categoryId && categoryId !== 'all') {
    query = query.eq('categoryId', categoryId);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .eq('isActive', true)
    .eq('isFeatured', true)
    .limit(6);
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapProduct(data);
}

function mapProduct(p: Record<string, unknown>): Product {
  return {
    id: String(p.id),
    name: p.name as string,
    price: p.price as number,
    originalPrice: p.originalPrice as number | undefined,
    image: p.image as string,
    images: Array.isArray(p.images) ? (p.images as string[]) : [p.image as string],
    category: (p.categoryId as string) || '',
    rating: (p.rating as number) || 0,
    reviews: (p.reviews as number) || 0,
    description: (p.description as string) || '',
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
    inStock: (p.inStock as boolean) ?? true,
    discount: p.discount as number | undefined,
    isNew: p.isNew as boolean | undefined,
    isFeatured: p.isFeatured as boolean | undefined,
  };
}
