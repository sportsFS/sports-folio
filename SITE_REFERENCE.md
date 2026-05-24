# Sports Folio Store — Site Map & Plain-English Reference

> Use this to describe which part of the site you want to change.
> Say: *"the [name]"* and I'll know exactly what you mean.

---

## HEADER (appears on every page)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo] [Sports Folio Store]     [Home] [Shop ▼] [Contact Us]      │
│                                    [Login/Register or Hi Name/Logout]│
│                                    [Sign In] [🌙] [🛒 3] [☰]      │
└─────────────────────────────────────────────────────────────────────┘
```

| Your name | What I call it | File/Line |
|---|---|---|
| **Logo** | Logo button | `Header.tsx` |
| **Site name** | Header logo text | `Header.tsx` — hidden on mobile ≤600px |
| **Home button** | Home nav button | `Header.tsx` |
| **Shop button** | Shop nav button (with dropdown) | `Header.tsx` — hover to see categories |
| **Category list** | Shop category dropdown | `Header.tsx` — Bats, Balls, etc. |
| **Contact button** | Contact Us nav button | `Header.tsx` |
| **Login button** | Login nav button | `Header.tsx` — only when logged out |
| **Register button** | Register nav button | `Header.tsx` — only when logged out |
| **Hi, [name]** | User greeting | `Header.tsx` — only when logged in |
| **Logout button** | Logout button | `Header.tsx` — only when logged in |
| **Admin Panel link** | Admin Panel nav button | `Header.tsx` — only for admin |
| **Sign In pill** | Sign In pill button | `Header.tsx` — always visible, right side |
| **Theme switch** | Theme toggle | `Header.tsx` — sun/moon slider |
| **Cart icon** | Cart button with count | `Header.tsx` — shows number of items |
| **Hamburger menu** | Mobile menu trigger | `Header.tsx` — ☰ on mobile only |
| **Mobile menu** | Mobile nav dropdown | `Header.tsx` — full menu on mobile |

---

## HOME PAGE

```
┌─────────────────────────────────────────────────────┐
│  A. Hero Slideshow (full-screen background images)  │
│     ┌─────────────────────────────────────────┐     │
│     │  🏆 SPORTS EQUIPMENT                    │     │
│     │  Your Game. Your Gear. Your Store.      │     │
│     │  Premium sports equipment for every...  │     │
│     │  [SHOP NOW →]  [EXPLORE MORE]           │     │
│     │  ⚽ Football  🏏 Cricket  🏀 Basketball │     │
│     └─────────────────────────────────────────┘     │
│     ● ● ● ● ●  (dot navigation)                    │
├─────────────────────────────────────────────────────┤
│  B. Scrolling Discount Bar                          │
│     "FLASH SALE — UP TO 50% OFF" (scrolls forever) │
├─────────────────────────────────────────────────────┤
│  C. Trending Products Grid                          │
│     [Product] [Product] [Product]                   │
│     [Product] [Product] [Product]  [VIEW ALL →]    │
├─────────────────────────────────────────────────────┤
│  D. "Gear Up for Victory" Banner                    │
│     Dark background with [EXPLORE PRO RANGE]        │
├─────────────────────────────────────────────────────┤
│  E. Why Choose Us? (4 feature cards)                │
│     🚚 Free Shipping | ✅ 100% Authentic | ...     │
├─────────────────────────────────────────────────────┤
│  F. Trusted Brands Scroller (auto-scrolls)          │
│     "SS Cricket  SG Sports  MRF  ..."              │
├─────────────────────────────────────────────────────┤
│  G. Customer Testimonials (auto-rotates)            │
│     ★★★★★  "..."  — Rahul Kumar, District Player   │
│     ● ● ●  (dot navigation)                        │
├─────────────────────────────────────────────────────┤
│  H. Newsletter Signup                               │
│     "JOIN THE CREASE CLUB" — [email input] [SUBSCRIBE]│
├─────────────────────────────────────────────────────┤
│  I. Footer                                          │
└─────────────────────────────────────────────────────┘
```

| Your name | What I call it | File/Line |
|---|---|---|
| **Hero / Top banner / Slideshow** | Hero section (full-screen image carousel) | `HomePage.tsx` — 5 images, crossfade 5s |
| **Hero dots** | Hero dot navigation | `HomePage.tsx` — click to switch image |
| **Hero headline** | "Your Game. Your Gear. Your Store." | `HomePage.tsx` |
| **Hero tag** | "🏆 SPORTS EQUIPMENT" badge | `HomePage.tsx` |
| **Hero subtext** | Subtext paragraph | `HomePage.tsx` |
| **Shop Now button** | Primary CTA button | `HomePage.tsx` |
| **Explore More button** | Secondary CTA button | `HomePage.tsx` |
| **Category pills** | Quick category links | `HomePage.tsx` — Football, Cricket, etc. |
| **Scrolling discount bar** | Flash sale marquee | `HomePage.tsx` |
| **Trending products** | Product grid (6 items) | `HomePage.tsx` |
| **View All button** | "VIEW ALL PRODUCTS →" | `HomePage.tsx` |
| **Gear up banner** | Parallax banner | `HomePage.tsx` |
| **Explore Pro Range** | Parallax CTA | `HomePage.tsx` |
| **Feature cards** | Why Choose Us section | `HomePage.tsx` |
| **Brands scroller** | Trusted Brands marquee | `HomePage.tsx` |
| **Testimonials** | Customer Testimonials carousel | `HomePage.tsx` — auto-rotates 4s |
| **Testimonial dots** | Testimonial dot navigation | `HomePage.tsx` |
| **Newsletter / Email signup** | "Join the Crease Club" | `HomePage.tsx` |
| **Subscribe button** | Newsletter CTA | `HomePage.tsx` |

---

## SHOP PAGE

```
┌───────────────────────────────────────────────────────────────┐
│  🛒 Shop                                                      │
│  All Cricket Equipment                                        │
│  Browse our complete collection...                            │
│                                                               │
│  ┌───────────────────┐  ┌──────────────────────────────────┐  │
│  │ SIDEBAR (Desktop) │  │  Sorting: [Sort by: Featured ▼]  │  │
│  │ 📂 Categories     │  │                                  │  │
│  │  ✓ All Products   │  │  [Product] [Product] [Product]   │  │
│  │    Cricket Bats   │  │  [Product] [Product] [Product]   │  │
│  │    Cricket Balls  │  │  [Product] [Product] [Product]   │  │
│  │    ...            │  │  ...                             │  │
│  │                   │  │                                  │  │
│  │ 💰 Price Range    │  │                                  │  │
│  │  [===●======]     │  │                                  │  │
│  │  $0 — $12,000     │  │                                  │  │
│  │                   │  │                                  │  │
│  │ ⭐ Rating         │  │                                  │  │
│  │   ☐ 4★ & above   │  │                                  │  │
│  │   ☐ 3★ & above   │  │                                  │  │
│  │                   │  │                                  │  │
│  │ [CLEAR ALL FILTERS]│  │                                  │  │
│  └───────────────────┘  └──────────────────────────────────┘  │
│                                                               │
│  Mobile: [☰ Filters ▼]  [Sort by: Featured ▼]                │
│          (dropdown panel appears below)                       │
└───────────────────────────────────────────────────────────────┘
```

| Your name | What I call it | File/Line |
|---|---|---|
| **Shop page title** | "All Cricket Equipment" heading | `ShopPage.tsx` |
| **Sidebar / Filters** | Sidebar filter panel | `ShopPage.tsx` — desktop only |
| **Categories filter** | Category filter list | `ShopPage.tsx` |
| **Price slider** | Price range slider | `ShopPage.tsx` |
| **Rating checkboxes** | Rating filter checkboxes | `ShopPage.tsx` |
| **Clear filters button** | "CLEAR ALL FILTERS" | `ShopPage.tsx` |
| **Sort dropdown** | Sort by dropdown | `ShopPage.tsx` |
| **Product count** | "Showing X products" text | `ShopPage.tsx` |
| **Mobile filter button** | "☰ Filters" button | `ShopPage.tsx` — mobile only |
| **Filter dropdown panel** | Mobile filter panel | `ShopPage.tsx` — slides down on mobile |
| **Product grid** | Product cards grid | `ShopPage.tsx` |
| **No results message** | Empty state | `ShopPage.tsx` — "No Products Found" |
| **Product card** | Individual product card | `ProductCard.tsx` |
| **Add to Cart button** | Card add-to-cart button | `ProductCard.tsx` |
| **Wishlist heart** | Wishlist toggle button | `ProductCard.tsx` |

---

## CART PAGE

```
┌──────────────────────────────────────────────────────┐
│  🛒 Cart                                             │
│  Your Shopping Cart                                  │
│                                                      │
│  ┌───────────────────────┐  ┌────────────────────┐  │
│  │ [img] Product Name    │  │ ORDER SUMMARY      │  │
│  │       Category        │  │ Subtotal (3) $150  │  │
│  │       $300            │  │ Shipping FREE      │  │
│  │       [−] [2] [+] [✕]│  │ Discount (5%) -$7  │  │
│  └───────────────────────┘  │                    │  │
│  ┌───────────────────────┐  │ [Promo code____]   │  │
│  │ [img] Product Name    │  │ [APPLY]            │  │
│  │       ...             │  │                    │  │
│  └───────────────────────┘  │ Total $143         │  │
│                             │                    │  │
│                             │ [CHECKOUT →]       │  │
│                             │ ← Continue Shopping│  │
│                             └────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

| Your name | What I call it | File/Line |
|---|---|---|
| **Cart items list** | Cart items section | `CartPage.tsx` |
| **Cart item row** | Cart item | `CartPage.tsx` |
| **Quantity controls** | Qty buttons (−/+) | `CartPage.tsx` |
| **Remove button** | Remove item (✕) | `CartPage.tsx` |
| **Order Summary box** | Order summary sidebar | `CartPage.tsx` |
| **Subtotal** | Subtotal row | `CartPage.tsx` |
| **Shipping** | Shipping row | `CartPage.tsx` |
| **Discount** | Discount row (5%) | `CartPage.tsx` |
| **Promo code input** | Promo code field | `CartPage.tsx` |
| **Apply button** | Apply promo button | `CartPage.tsx` |
| **Total** | Total row | `CartPage.tsx` |
| **Checkout button** | CHECKOUT button | `CartPage.tsx` |
| **Continue Shopping** | Continue Shopping link | `CartPage.tsx` |
| **Empty cart** | Empty cart message | `CartPage.tsx` — shown when cart is empty |

---

## LOGIN / REGISTER PAGES

| Your name | What I call it | File/Line |
|---|---|---|
| **Login form** | Email + password form | `LoginPage.tsx` |
| **Register form** | Name + email + password + confirm | `RegisterPage.tsx` |
| **Email input** | Email field | Both |
| **Password input** | Password field | Both |
| **Name input** | Full Name field | `RegisterPage.tsx` only |
| **Confirm password** | Confirm password field | `RegisterPage.tsx` only |
| **Sign In / Create Account button** | Submit button | Both |
| **Error message** | Error banner (red) | Both |
| **"Register here" link** | Switch to register | `LoginPage.tsx` |
| **"Sign in" link** | Switch to login | `RegisterPage.tsx` |

---

## ADMIN DASHBOARD

| Your name | What I call it | File/Line |
|---|---|---|
| **Dashboard tab** | 📊 Dashboard | `AdminPage.tsx` |
| **Products tab** | 📦 Products | `AdminPage.tsx` |
| **Orders tab** | 🛒 Orders | `AdminPage.tsx` |
| **Users tab** | 👥 Users | `AdminPage.tsx` |
| **Stats cards** | StatCard (Products/Users/Orders/Rating) | `AdminPage.tsx` |
| **Product table** | Products table | `AdminPage.tsx` |
| **Add Product button** | "+ Add Product" | `AdminPage.tsx` — opens modal |
| **Add/Edit modal** | Product form modal | `AdminPage.tsx` |
| **Edit button** | Edit row button | `AdminPage.tsx` |
| **Delete button** | Delete row button | `AdminPage.tsx` |
| **Order table** | Orders table | `AdminPage.tsx` |
| **Status dropdown** | Order status selector | `AdminPage.tsx` |
| **Users table** | Users table | `AdminPage.tsx` |

---

## FOOTER (appears on every page)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] [Sports Folio Store]                                     │
│  Premium cricket equipment for champions                         │
│                                                                  │
│  Quick Links     Categories          Support                     │
│  · Home          · Cricket Bats      · Contact Us                │
│  · Shop          · Cricket Balls     · Returns                   │
│  · Cart          · Protective Gear   · FAQ                       │
│                                     · Size Guide                 │
│  © 2025 Sports Folio Store                                       │
└─────────────────────────────────────────────────────────────────┘
```

| Your name | What I call it | File/Line |
|---|---|---|
| **Footer logo** | Footer logo | `Footer.tsx` |
| **Footer description** | Footer tagline | `Footer.tsx` |
| **Quick Links** | Quick Links column | `Footer.tsx` |
| **Categories** | Categories column | `Footer.tsx` |
| **Support** | Support column | `Footer.tsx` |
| **Copyright** | Copyright notice | `Footer.tsx` |

---

## OTHER (shared elements)

| Your name | What I call it | File/Line |
|---|---|---|
| **Toast notification** | Toast popup (bottom-right) | `Toast.tsx` — auto-hides 3s |
| **Preloader / loading screen** | Preloader animation | `Preloader.tsx` — shows on page load |
| **Back to Top button** | Back to Top button | `BackToTop.tsx` — bottom-left |
| **Skeleton / loading card** | Skeleton card | `SkeletonCard.tsx` — gray shimmer |
| **Checkout guard** | Login redirect on checkout | `CartPage.tsx` |
| **Sign In guard** | Login redirect on add-to-cart | `ProductCard.tsx` |
