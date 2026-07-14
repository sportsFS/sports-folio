import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(path, 'utf8');

const ci = read('.github/workflows/ci.yml');
const orders = read('convex/orders.ts');
const products = read('convex/products.ts');
const catalog = read('src/data/catalog.ts');
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
assert.match(products, /validateAddOnProductIds[\s\S]*A product cannot be its own add-on[\s\S]*Add-on product not found/, 'add-on relationships must be validated server-side');
assert.match(products, /referencedBy[\s\S]*Remove this product from/, 'referenced add-on products must not be deleted');
assert.match(catalog, /product\.addOnProductIds[\s\S]*productsById[\s\S]*isEligible/, 'storefront add-ons must use configured products and availability');
assert.match(admin, /id: 'addons'[\s\S]*<AddOnsTab/, 'admin must expose dedicated add-on management');
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
assert.match(homePage, /isPaused[\s\S]*setInterval[\s\S]*4000[\s\S]*onFocusCapture/, 'testimonials must auto-advance and pause during interaction');
assert.match(shopPage, /product\.rating >= minimumRating[\s\S]*slice\(0, visibleCount\)/, 'shop rating filter and incremental product loading must remain functional');
assert.match(shopPage, /product\.isActive !== false && product\.price > 0/, 'shop must hide inactive and unpriced products');
for (const channel of [/mailto:/, /tel:/, /wa\.me/, /<iframe/]) {
  assert.match(contactPage, channel, 'contact page must expose working email, phone, WhatsApp, and map channels');
}

console.log('launch checks passed');
