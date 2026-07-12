import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(path, 'utf8');

const ci = read('.github/workflows/ci.yml');
const orders = read('convex/orders.ts');
const products = read('convex/products.ts');
const stripe = read('convex/stripe.ts');
const main = read('src/main.tsx');
const vercel = read('vercel.json');
const authPages = ['LoginPage', 'RegisterPage', 'ForgotPasswordPage']
  .map(name => read(`src/pages/${name}.tsx`))
  .join('\n');
const preloader = read('src/components/Preloader.tsx');

assert.match(ci, /branches:\s*\n\s*-\s*master/, 'CI must run on master pushes');

assert.doesNotMatch(orders, /export const placeOrder\s*=\s*mutation\(/, 'unpaid public order mutation must stay removed');
assert.match(orders, /export const placeOrderInternal\s*=\s*internalMutation\(/, 'Stripe-only order creation must stay internal');

for (const name of ['add', 'update', 'remove']) {
  assert.match(products, new RegExp(`export const ${name} = mutation[\\s\\S]*?await requireAdmin\\(ctx\\)`), `${name} product mutation must require admin`);
}

assert.match(products, /export const seed = internalMutation/, 'catalog seed must stay internal');
assert.match(products, /query\("products"\)\.first\(\)/, 'catalog seed must not duplicate products');

assert.match(orders, /withIndex\("by_userId",\s*q\s*=>\s*q\.eq\("userId",\s*caller\._id\)\)/, 'non-admin order list must be scoped to caller');

assert.match(stripe, /internal\.products\.getCheckoutItems/, 'Stripe checkout must use server-side product lookup');
assert.doesNotMatch(stripe, /price:\s*item\.price/, 'Stripe checkout must not trust client item prices');

assert.match(main, /signInForceRedirectUrl="\/"/, 'sign-in must stay on the current host');
assert.match(main, /signUpForceRedirectUrl="\/"/, 'sign-up must stay on the current host');
assert.match(vercel, /www\.sportsfoliostore\.com[\s\S]*https:\/\/sportsfoliostore\.com\/:path\*/, 'www must redirect to Clerk primary domain');
assert.match(vercel, /"source": "\/"[\s\S]*"destination": "https:\/\/sportsfoliostore\.com\/"/, 'www root must redirect to Clerk primary domain');
assert.doesNotMatch(authPages, /routing="hash"/, 'Clerk OTP routes must not share the app URL');
assert.match(authPages, /routing="path" path="\/register"/, 'Clerk registration must own its OTP sub-routes');
assert.match(preloader, /sessionStorage\.getItem\(SESSION_KEY\)/, 'entry loader must only show once per tab');

console.log('launch checks passed');
