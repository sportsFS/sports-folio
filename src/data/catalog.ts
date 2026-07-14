import type { Product } from './products';

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
  { label: 'Cricket Bats', value: 'bats' },
  { label: 'Cricket Balls', value: 'balls' },
  { label: 'Protective Gear', value: 'protection' },
  { label: 'Gloves & Wicket Keeping', value: 'gloves' },
  { label: 'Accessories & Training', value: 'accessories' },
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
  jerseys: 'Jerseys',
  awards: 'Awards',
  dtf: 'DTF',
};

const SPORT_ONLY_CATEGORIES = new Set(['badminton', 'pickleball', 'soccer', 'volleyball']);

export function getProductCategory(product: Pick<Product, 'name' | 'category'>) {
  if (product.category === 'apparel' && /jersey/i.test(product.name)) return 'jerseys';
  return product.category;
}

export function getProductCategoryLabel(product: Pick<Product, 'name' | 'category'>) {
  return PRODUCT_CATEGORY_LABELS[getProductCategory(product)] || PRODUCT_CATEGORY_LABELS[product.category] || product.category;
}

export function productMatchesCategory(product: Pick<Product, 'name' | 'category'>, category: string) {
  const displayCategory = getProductCategory(product);
  if (category === 'all') return true;
  if (category === 'cricket') return !SPORT_ONLY_CATEGORIES.has(displayCategory) && displayCategory !== 'awards' && displayCategory !== 'dtf';
  return displayCategory === category;
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
