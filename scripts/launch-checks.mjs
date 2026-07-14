import fs from 'node:fs';
import assert from 'node:assert/strict';
import {
  PRODUCT_SUBCATEGORIES,
  getParentProductCategory,
  getProductSubcategories,
  productMatchesSearch,
} from '../src/data/catalog.ts';
import { PRODUCTS } from '../convex/productData.ts';

const read = path => fs.readFileSync(path, 'utf8');

const ci = read('.github/workflows/ci.yml');
const orders = read('convex/orders.ts');
const products = read('convex/products.ts');
const subcategories = read('convex/subcategories.ts');
const catalog = read('src/data/catalog.ts');
const sharedSubcategories = read('shared/productSubcategories.ts');
const stripe = read('convex/stripe.ts');
const schema = read('convex/schema.ts');
const crons = read('convex/crons.ts');
const shippingPolicy = read('src/pages/ShippingPage.tsx');
const myOrders = read('src/pages/MyOrdersPage.tsx');
const admin = read('src/pages/AdminPage.tsx');
const main = read('src/main.tsx');
const vercel = read('vercel.json');
const authPages = ['LoginPage', 'RegisterPage', 'ForgotPasswordPage']
  .map(name => read(`src/pages/${name}.tsx`))
  .join('\n');
const preloader = read('src/components/Preloader.tsx');
const header = read('src/components/Header.tsx');
const productQuickView = read('src/components/ProductQuickView.tsx');
const productCard = read('src/components/ProductCard.tsx');
const searchBar = read('src/components/SearchBar.tsx');
const homePage = read('src/pages/HomePage.tsx');
const shopPage = read('src/pages/ShopPage.tsx');
const contactPage = read('src/pages/ContactPage.tsx');

assert.match(ci, /branches:\s*\n\s*-\s*master/, 'CI must run on master pushes');

assert.doesNotMatch(orders, /export const placeOrder\s*=\s*mutation\(/, 'unpaid public order mutation must stay removed');
assert.match(orders, /export const placeOrderInternal\s*=\s*internalMutation\(/, 'Stripe-only order creation must stay internal');

for (const name of ['add', 'update', 'remove']) {
  assert.match(products, new RegExp(`export const ${name} = mutation[\\s\\S]*?await requireAdmin\\(ctx\\)`), `${name} product mutation must require admin`);
}

assert.match(products, /export const seed = internalMutation/, 'catalog seed must stay internal');
assert.match(products, /query\("products"\)\.first\(\)/, 'catalog seed must not duplicate products');

assert.match(orders, /withIndex\("by_userId",\s*q\s*=>\s*q\.eq\("userId",\s*caller\._id\)\)/, 'non-admin order list must be scoped to caller');
assert.match(orders, /getCheckoutForAction[\s\S]*order\.userId !== caller\._id/, 'checkout resume and cancellation must be scoped to the order owner');

assert.match(stripe, /internal\.products\.getCheckoutItems/, 'Stripe checkout must use server-side product lookup');
assert.doesNotMatch(stripe, /price:\s*item\.price/, 'Stripe checkout must not trust client item prices');
assert.match(stripe, /shippingAmount = checkout\.total > 99 \? 0 : 9\.99/, 'server shipping must match the cart rule');
assert.match(stripe, /allowed_countries:\s*\["CA"\]/, 'checkout delivery must be restricted to Canada');
assert.match(stripe, /fixed_amount:[\s\S]*currency:\s*"cad"/, 'delivery charges must use CAD');
assert.match(stripe, /resumeCheckoutSession[\s\S]*getCheckoutForAction[\s\S]*sessions\.retrieve\(checkout\.stripeSessionId\)/, 'payment resume must retrieve the owner-scoped server session');
assert.match(stripe, /cancelCheckoutSession[\s\S]*checkout\.sessions\.expire[\s\S]*releaseCheckoutReservation/, 'checkout cancellation must expire Stripe before releasing inventory');
assert.match(orders, /shippingAddress: args\.shippingAddress/, 'verified checkout address must be stored on the order');
assert.match(admin, /Delivery address[\s\S]*order\.shippingAddress/, 'admin must show the delivery address');

assert.match(schema, /stockQuantity:[\s\S]*reservedQuantity:/, 'products must track on-hand and reserved stock');
assert.match(products, /availableQuantity[\s\S]*availableQuantity < item\.qty/, 'checkout must enforce available stock');
assert.match(schema, /addOnProductIds:\s*v\.optional\(v\.array\(v\.id\("products"\)\)\)/, 'products must store admin-managed add-on relationships');
assert.match(schema, /subcategoryIds:\s*v\.optional\(v\.array\(v\.id\("subcategories"\)\)\)/, 'products must store admin-managed subcategory relationships');
assert.match(schema, /subcategories:\s*defineTable[\s\S]*by_parentCategory[\s\S]*by_key/, 'subcategories must support parent filtering and stable migration keys');
assert.match(products, /validateAddOnProductIds[\s\S]*A product cannot be its own add-on[\s\S]*Add-on product not found/, 'add-on relationships must be validated server-side');
assert.match(products, /validateSubcategoryIds[\s\S]*subcategory\.parentCategory !== parentCategory/, 'product subcategories must be validated against their parent server-side');
assert.match(products, /referencedBy[\s\S]*Remove this product from/, 'referenced add-on products must not be deleted');
assert.match(catalog, /product\.addOnProductIds[\s\S]*productsById[\s\S]*isEligible/, 'storefront add-ons must use configured products and availability');
assert.equal(PRODUCT_SUBCATEGORIES.cricket.length, 15, 'cricket must expose every requested subcategory');
assert.equal(PRODUCT_SUBCATEGORIES.badminton.length, 4, 'badminton must expose every requested subcategory');
assert.equal(PRODUCT_SUBCATEGORIES.pickleball.length, 2, 'pickleball must expose every requested subcategory');
const unclassifiedSeedProducts = PRODUCTS.filter(product =>
  getParentProductCategory(product) === 'cricket' && getProductSubcategories(product).length === 0
);
assert.deepEqual(unclassifiedSeedProducts.map(product => product.name), [], 'every seeded cricket product must survive subcategory migration');

const subcategorySamples = [
  ['cricket-english-willow', { name: 'MRF Bat', category: 'bats', image: '/bat-english-willow-mrf.webp' }],
  ['cricket-kashmir-willow', { name: 'Kashmir Bat', category: 'bats', image: '/bat-kashmir-willow.webp' }],
  ['cricket-tapeball-bats', { name: 'CA Tape Bat', category: 'bats', image: '/bat-tapeball-tennis.webp' }],
  ['cricket-scoop-bats', { name: 'Kerala Scoop Bats', category: 'bats', image: '/scoop.webp' }],
  ['cricket-leather-balls', { name: 'SG Club Leather', category: 'balls', image: '/ball.webp' }],
  ['cricket-hard-tennis-balls', { name: 'Nivia Ball Dozen', category: 'balls', image: '/ball.webp', description: 'Hard tennis balls' }],
  ['cricket-batting-gloves', { name: 'Batting Gloves', category: 'gloves', image: '/gloves-batting.webp' }],
  ['cricket-wicket-keeping-gloves', { name: 'WK Gloves', category: 'gloves', image: '/gloves-wicketkeeping.webp' }],
  ['cricket-wicket-keeping-pads', { name: 'WK Pads', category: 'gloves', image: '/gloves-wicketkeeping-pad.webp' }],
  ['cricket-helmets', { name: 'Shrey Helmet', category: 'protection', image: '/helmet.webp' }],
  ['cricket-shoes', { name: 'Cricket Shoes', category: 'shoes', image: '/shoes.webp' }],
  ['cricket-batting-leg-guards', { name: 'Colored Pads', category: 'protection', image: '/pads.webp', description: 'Batting leg guards' }],
  ['cricket-protective-guards', { name: 'Elbow Guard', category: 'protection', image: '/guard.webp' }],
  ['cricket-accessories', { name: 'Bat Mallet', category: 'accessories', image: '/mallet.webp' }],
  ['cricket-juniors', { name: 'Aztral Size 5', category: 'bats', image: '/bat-english-willow.webp' }],
  ['badminton-yonex', { name: 'Yonex Racquet', category: 'badminton', image: '/racquet.webp' }],
  ['badminton-li-ning', { name: 'Li-Ning Racquet', category: 'badminton', image: '/racquet.webp' }],
  ['badminton-victor', { name: 'Victor Racquet', category: 'badminton', image: '/racquet.webp' }],
  ['badminton-accessories', { name: 'Shuttlecocks', category: 'badminton', image: '/shuttle.webp' }],
  ['pickleball-paddles', { name: 'Carbon Paddle', category: 'pickleball', image: '/paddle.webp' }],
  ['pickleball-accessories', { name: 'Pickleball Bag', category: 'pickleball', image: '/bag.webp' }],
  ['pickleball-accessories', { name: 'Paddle Cover', category: 'pickleball', image: '/cover.webp' }],
];
for (const [expected, product] of subcategorySamples) {
  assert.ok(getProductSubcategories(product).includes(expected), `${product.name} must map to ${expected}`);
}
assert.ok(productMatchesSearch(subcategorySamples[0][1], 'english willow'), 'search must match derived subcategory names');
assert.equal(productMatchesSearch(subcategorySamples[0][1], 'english willow', [], false), false, 'managed catalogs must not leak legacy subcategory search matches');
assert.ok(productMatchesSearch(subcategorySamples[0][1], 'premium willow', ['Premium Willow'], false), 'search must match admin-managed subcategory names');
for (const name of ['listAll', 'create', 'update', 'remove', 'migrateExisting']) {
  assert.match(subcategories, new RegExp(`export const ${name} = (?:query|mutation)\\([\\s\\S]*?await requireAdmin\\(ctx\\)`), `${name} subcategory operation must require admin`);
}
assert.match(subcategories, /remove[\s\S]*subcategoryIds\?\.includes[\s\S]*before deleting it/, 'referenced subcategories must not be deleted');
assert.match(subcategories, /migrateExisting[\s\S]*product\.subcategoryIds !== undefined[\s\S]*getProductSubcategories[\s\S]*subcategoryIds/, 'subcategory migration must preserve explicit assignments and backfill legacy products');
assert.match(sharedSubcategories, /getParentProductCategory[\s\S]*getProductSubcategories/, 'server migration and storefront must share one category classifier');
assert.match(admin, /id: 'addons'[\s\S]*<AddOnsTab/, 'admin must expose dedicated add-on management');
assert.match(admin, /id: 'subcategories'[\s\S]*<SubcategoriesTab/, 'admin must expose dedicated subcategory management');
assert.match(admin, /subcategoryIds[\s\S]*admin-subcategory-options[\s\S]*type="checkbox"/, 'product editor must support multiple subcategory assignments');
assert.match(orders, /inventoryStatus !== "reserved"[\s\S]*requestedByProduct[\s\S]*stockQuantity: product\.stockQuantity - quantity/, 'paid checkout must consume a valid reservation');
assert.match(crons, /release expired checkout reservations[\s\S]*cleanupExpiredReservationsInternal/, 'expired inventory reservations must be cleaned automatically');
assert.match(orders, /order\.userId !== user\._id[\s\S]*returnRequest:/, 'return requests must be scoped to the signed-in order owner');
assert.match(myOrders, /requestReturn\(returnForm\.orderId/, 'customers must be able to request an exchange or replacement');
assert.match(myOrders, /AWAITING PAYMENT[\s\S]*Continue payment[\s\S]*Cancel checkout/, 'customers must be able to resume or cancel unpaid checkouts');
assert.match(shippingPolicy, /No cash refunds except where required by law/, 'policy must state the cash refund limitation');

assert.match(main, /signInForceRedirectUrl="\/"/, 'sign-in must stay on the current host');
assert.match(main, /signUpForceRedirectUrl="\/"/, 'sign-up must stay on the current host');
assert.match(vercel, /www\.sportsfoliostore\.com[\s\S]*https:\/\/sportsfoliostore\.com\/:path\*/, 'www must redirect to Clerk primary domain');
assert.match(vercel, /"source": "\/"[\s\S]*"destination": "https:\/\/sportsfoliostore\.com\/"/, 'www root must redirect to Clerk primary domain');
assert.doesNotMatch(authPages, /routing="hash"/, 'Clerk OTP routes must not share the app URL');
assert.match(authPages, /routing="path" path="\/register"/, 'Clerk registration must own its OTP sub-routes');
assert.match(preloader, /sessionStorage\.getItem\(SESSION_KEY\)/, 'entry loader must only show once per tab');
assert.match(header, /!isAuthLoading && !isLoggedIn/, 'header must not flash signed-out actions while auth restores');
assert.match(productQuickView, /<dialog/, 'quick view must use the native dialog element');
assert.match(productQuickView, /findSuggestedAddOns[\s\S]*selectedAddOnIds[\s\S]*addToCart/, 'quick view must use configured add-ons when adding to cart');
assert.match(productCard + homePage, /ProductQuickView/g, 'shop and home product cards must expose quick view');
assert.match(searchBar, /function closeSearch\(\)[\s\S]*setSearchQuery\(''\)[\s\S]*setExpanded\(false\)/, 'closing search must clear the shared product query');
assert.doesNotMatch(searchBar, /onBlur=\{handleBlur\}/, 'opening a product must not clear search through input blur');
assert.match(shopPage, /function selectCategory[\s\S]*setSearchQuery\(''\)[\s\S]*setCategory/, 'choosing a category must clear stale search filters');
assert.match(shopPage, /productMatchesSubcategory[\s\S]*productMatchesSearch/, 'shop must combine subcategory and searchable catalog filtering');
assert.match(shopPage, /shop-subcategory-list[\s\S]*aria-pressed/, 'shop subcategories must expose accessible selected states');
assert.match(shopPage, /api\.subcategories\.storefront[\s\S]*managedCatalogInitialized[\s\S]*product\.subcategoryIds\?\.includes/, 'shop must use active admin-managed assignments after migration');
assert.match(homePage, /isPaused[\s\S]*setInterval[\s\S]*4000[\s\S]*onFocusCapture/, 'testimonials must auto-advance and pause during interaction');
assert.match(shopPage, /product\.rating >= minimumRating[\s\S]*slice\(0, visibleCount\)/, 'shop rating filter and incremental product loading must remain functional');
assert.match(shopPage, /product\.isActive !== false && product\.price > 0/, 'shop must hide inactive and unpriced products');
for (const channel of [/mailto:/, /tel:/, /wa\.me/, /<iframe/]) {
  assert.match(contactPage, channel, 'contact page must expose working email, phone, WhatsApp, and map channels');
}

console.log('launch checks passed');
