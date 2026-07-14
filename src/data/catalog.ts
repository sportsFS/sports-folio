import type { Product } from './products';
import {
  PRODUCT_SUBCATEGORIES,
  getDisplayProductCategory,
  getParentProductCategory,
  getProductSubcategories,
} from '../../shared/productSubcategories.ts';

export {
  PRODUCT_SUBCATEGORIES,
  getParentProductCategory,
  getProductSubcategories,
  productMatchesSubcategory,
} from '../../shared/productSubcategories.ts';

export const GAME_CATEGORIES = [
  { label: 'Cricket', value: 'cricket' },
  { label: 'Badminton', value: 'badminton' },
  { label: 'Pickleball', value: 'pickleball' },
  { label: 'Soccer', value: 'soccer' },
  { label: 'Volleyball', value: 'volleyball' },
];

export const HERO_GAME_CATEGORIES = GAME_CATEGORIES.filter(game =>
  ['cricket', 'badminton', 'pickleball', 'soccer'].includes(game.value)
);

export const SHOP_FILTER_CATEGORIES = [
  { label: 'All Products', value: 'all' },
  ...GAME_CATEGORIES,
  { label: 'Jerseys', value: 'jerseys' },
  { label: 'Awards', value: 'awards' },
  { label: 'DTF', value: 'dtf' },
];

export const ADMIN_PRODUCT_CATEGORIES = [
  { value: 'bats', label: 'Cricket Bats' },
  { value: 'balls', label: 'Cricket Balls' },
  { value: 'protection', label: 'Protective Gear' },
  { value: 'gloves', label: 'Gloves & Wicket Keeping' },
  { value: 'accessories', label: 'Accessories & Training Tools' },
  { value: 'apparel', label: 'Apparel, Bags & Kits' },
  { value: 'shoes', label: 'Cricket Shoes' },
  { value: 'jerseys', label: 'Jerseys' },
  { value: 'awards', label: 'Awards' },
  { value: 'dtf', label: 'DTF' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'pickleball', label: 'Pickleball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'volleyball', label: 'Volleyball' },
];

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  all: 'All Products',
  cricket: 'Cricket',
  badminton: 'Badminton',
  pickleball: 'Pickleball',
  soccer: 'Soccer',
  volleyball: 'Volleyball',
  bats: 'Cricket Bats',
  balls: 'Cricket Balls',
  protection: 'Protective Gear',
  gloves: 'Gloves & WK',
  accessories: 'Accessories',
  apparel: 'Apparel, Bags & Kits',
  shoes: 'Cricket Shoes',
  jerseys: 'Jerseys',
  awards: 'Awards',
  dtf: 'DTF',
};

const SUBCATEGORY_LABELS = new Map(
  Object.values(PRODUCT_SUBCATEGORIES).flat().map(option => [option.value, option.label])
);

export function getProductCategory(product: Pick<Product, 'name' | 'category'>) {
  return getDisplayProductCategory(product);
}

export function getProductCategoryLabel(product: Pick<Product, 'name' | 'category'>) {
  return PRODUCT_CATEGORY_LABELS[getProductCategory(product)] || PRODUCT_CATEGORY_LABELS[product.category] || product.category;
}

export function productMatchesCategory(product: Pick<Product, 'name' | 'category'>, category: string) {
  const displayCategory = getProductCategory(product);
  if (category === 'all') return true;
  if (category === 'cricket') return getParentProductCategory(product) === 'cricket';
  return displayCategory === category;
}

type SearchableProduct = Pick<Product, 'name' | 'category' | 'image' | 'description'>;

export function productMatchesSearch(
  product: SearchableProduct,
  query: string,
  managedSubcategoryLabels: string[] = [],
  includeDerivedSubcategories = true
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const subcategoryLabels = includeDerivedSubcategories
    ? getProductSubcategories(product).map(value => SUBCATEGORY_LABELS.get(value) || '')
    : [];
  const searchableText = [product.name, product.description, getProductCategoryLabel(product), ...subcategoryLabels, ...managedSubcategoryLabels]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return terms.every(term => searchableText.includes(term));
}

export function findSuggestedAddOns(product: Product, products: Product[], cart: Product[] = []) {
  const cartIds = new Set(cart.map(item => item.id));
  const isEligible = (candidate: Product) =>
    candidate.price > 0 &&
    candidate.isActive !== false &&
    (candidate.availableQuantity ?? 0) > 0 &&
    candidate.id !== product.id &&
    !cartIds.has(candidate.id);

  if (product.addOnProductIds === undefined) {
    if (product.category !== 'bats') return [];
    const fallback = products.find(candidate => candidate.category === 'balls' && isEligible(candidate));
    return fallback ? [fallback] : [];
  }

  const productsById = new Map(products.map(candidate => [candidate.id, candidate]));
  return product.addOnProductIds
    .map(id => productsById.get(id))
    .filter((candidate): candidate is Product => Boolean(candidate && isEligible(candidate)));
}
