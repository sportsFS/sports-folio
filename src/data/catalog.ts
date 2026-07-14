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
  { label: 'Jerseys', value: 'jerseys' },
  { label: 'Awards', value: 'awards' },
  { label: 'DTF', value: 'dtf' },
];

export const PRODUCT_SUBCATEGORIES: Record<string, readonly { label: string; value: string }[]> = {
  cricket: [
    { label: 'English Willow Bats', value: 'cricket-english-willow' },
    { label: 'Kashmir Willow Bats', value: 'cricket-kashmir-willow' },
    { label: 'Tapeball Bats', value: 'cricket-tapeball-bats' },
    { label: 'Hard Tennis Scoop Bats', value: 'cricket-scoop-bats' },
    { label: 'Leather Balls', value: 'cricket-leather-balls' },
    { label: 'Hard Tennis Balls', value: 'cricket-hard-tennis-balls' },
    { label: 'Batting Gloves', value: 'cricket-batting-gloves' },
    { label: 'Wicket Keeping Gloves', value: 'cricket-wicket-keeping-gloves' },
    { label: 'Wicket Keeping Pads', value: 'cricket-wicket-keeping-pads' },
    { label: 'Helmets', value: 'cricket-helmets' },
    { label: 'Shoes', value: 'cricket-shoes' },
    { label: 'Batting Leg Guards', value: 'cricket-batting-leg-guards' },
    { label: 'Protective Guards', value: 'cricket-protective-guards' },
    { label: 'Accessories', value: 'cricket-accessories' },
    { label: 'Juniors', value: 'cricket-juniors' },
  ],
  badminton: [
    { label: 'Yonex', value: 'badminton-yonex' },
    { label: 'Li-Ning', value: 'badminton-li-ning' },
    { label: 'Victor', value: 'badminton-victor' },
    { label: 'Accessories', value: 'badminton-accessories' },
  ],
  pickleball: [
    { label: 'Paddles', value: 'pickleball-paddles' },
    { label: 'Accessories', value: 'pickleball-accessories' },
  ],
};

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

const CRICKET_CATEGORIES = new Set(['bats', 'balls', 'protection', 'gloves', 'accessories', 'apparel', 'shoes']);
const SUBCATEGORY_LABELS = new Map(
  Object.values(PRODUCT_SUBCATEGORIES).flat().map(option => [option.value, option.label])
);

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
  if (category === 'cricket') return CRICKET_CATEGORIES.has(displayCategory);
  return displayCategory === category;
}

type SubcategoryProduct = Pick<Product, 'name' | 'category' | 'image' | 'description'>;

export function getProductSubcategories(product: SubcategoryProduct) {
  const category = getProductCategory(product);
  const text = `${product.name} ${product.image} ${product.description || ''}`.toLowerCase().replace(/[-_]/g, ' ');

  if (category === 'badminton') {
    if (/\byonex\b/.test(text)) return ['badminton-yonex'];
    if (/\b(li ning|lining)\b/.test(text)) return ['badminton-li-ning'];
    if (/\bvictor\b/.test(text)) return ['badminton-victor'];
    return ['badminton-accessories'];
  }

  if (category === 'pickleball') {
    if (/\b(covers?|bags?|balls?|grips?|tapes?|cases?|nets?|accessor)\b/.test(text)) return ['pickleball-accessories'];
    return /\bpaddles?\b/.test(text) ? ['pickleball-paddles'] : ['pickleball-accessories'];
  }

  if (!productMatchesCategory(product, 'cricket')) return [];

  const matches: string[] = [];
  if (category === 'bats') {
    if (/\benglish willow\b/.test(text)) matches.push('cricket-english-willow');
    else if (/\bkashmir willow\b/.test(text)) matches.push('cricket-kashmir-willow');
    else if (/\bscoop bats?\b/.test(text)) matches.push('cricket-scoop-bats');
    else if (/\btape ?balls?\b|\btape bats?\b/.test(text)) matches.push('cricket-tapeball-bats');
  } else if (category === 'balls') {
    matches.push(/\b(tennis|sixer|soft|yellow|nivia)\b/.test(text) ? 'cricket-hard-tennis-balls' : 'cricket-leather-balls');
  } else if (category === 'gloves') {
    if (/\b(wk|wicket keeping)\b/.test(text) && /\bpads?\b/.test(text)) matches.push('cricket-wicket-keeping-pads');
    else if (/\b(wk|wicket keeping)\b/.test(text)) matches.push('cricket-wicket-keeping-gloves');
    else matches.push('cricket-batting-gloves');
  } else if (category === 'protection') {
    if (/\bhelmets?\b/.test(text)) matches.push('cricket-helmets');
    else if (/\b(leg guards?|batting pads?|colored pads?|protection pads?)\b/.test(text)) matches.push('cricket-batting-leg-guards');
    else matches.push('cricket-protective-guards');
  } else if (/\b(shoes?|spikes?)\b/.test(text) || category === 'shoes') {
    matches.push('cricket-shoes');
  } else if (category === 'accessories' || category === 'apparel') {
    matches.push('cricket-accessories');
  }

  if (/\b(kids?|youth|junior|harrow|size [3-6])\b/.test(text)) matches.push('cricket-juniors');
  return matches;
}

export function productMatchesSubcategory(product: SubcategoryProduct, subcategory: string) {
  return subcategory === 'all' || getProductSubcategories(product).includes(subcategory);
}

export function productMatchesSearch(product: SubcategoryProduct, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const subcategoryLabels = getProductSubcategories(product).map(value => SUBCATEGORY_LABELS.get(value) || '');
  const searchableText = [product.name, product.description, getProductCategoryLabel(product), ...subcategoryLabels]
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
