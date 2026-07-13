export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews?: number;
  badge?: string;
  badgeClass?: string;
  description?: string;
  stockQuantity?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  isActive?: boolean;
}

// Products are now managed in Convex
// See convex/seed.ts for the initial seed data
export const allProducts: Product[] = [];
