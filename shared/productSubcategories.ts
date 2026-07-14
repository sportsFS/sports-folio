export interface SubcategoryProduct {
  name: string;
  category: string;
  image: string;
  description?: string;
}

export const SUBCATEGORY_PARENT_CATEGORIES = [
  'cricket',
  'badminton',
  'pickleball',
  'soccer',
  'volleyball',
  'jerseys',
  'awards',
  'dtf',
] as const;

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

const CRICKET_CATEGORIES = new Set(['bats', 'balls', 'protection', 'gloves', 'accessories', 'apparel', 'shoes']);

export function getDisplayProductCategory(product: Pick<SubcategoryProduct, 'name' | 'category'>) {
  if (product.category === 'apparel' && /jersey/i.test(product.name)) return 'jerseys';
  return product.category;
}

export function getParentProductCategory(product: Pick<SubcategoryProduct, 'name' | 'category'>) {
  const category = getDisplayProductCategory(product);
  return CRICKET_CATEGORIES.has(category) ? 'cricket' : category;
}

export function getProductSubcategories(product: SubcategoryProduct) {
  const category = getDisplayProductCategory(product);
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

  if (getParentProductCategory(product) !== 'cricket') return [];

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
