# Project Structure — Krishnapriya Textiles

Detailed file-by-file breakdown of the codebase architecture.

---

## Table of Contents

- [Root Directory](#root-directory)
- [Prisma (Database)](#prisma-database)
- [Public (Static Assets)](#public-static-assets)
- [Source Code (`src/`)](#source-code-src)
  - [App Router (`src/app/`)](#app-router-srcapp)
  - [Server Actions (`src/actions/`)](#server-actions-srcactions)
  - [Components (`src/components/`)](#components-srccomponents)
  - [Configuration (`src/config/`)](#configuration-srcconfig)
  - [Library (`src/lib/`)](#library-srclib)
  - [Services (`src/services/`)](#services-srcservices)
  - [Stores (`src/stores/`)](#stores-srcstores)
  - [Types (`src/types/`)](#types-srctypes)
  - [Validators (`src/validators/`)](#validators-srcvalidators)
- [Database Schema](#database-schema)
- [Architecture Patterns](#architecture-patterns)

---

## Root Directory

```
krishnapriya-textiles/
├── .env                    # Local environment variables (gitignored)
├── .env.example            # Template for environment variables
├── .env.local              # Override env vars (gitignored)
├── .gitignore              # Git ignore rules
├── components.json         # ShadCN UI configuration (style: new-york, RSC: true)
├── eslint.config.mjs       # ESLint config (next/core-web-vitals + typescript)
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.ts          # Next.js config (Cloudinary images, 2MB body limit)
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS config (Tailwind CSS plugin)
├── prisma.config.ts        # Prisma config (dotenv loading, migration paths)
├── README.md               # Project overview and quick start
├── tsconfig.json           # TypeScript configuration
└── docs/                   # Project documentation (you are here!)
    ├── FEATURES.md
    ├── SETUP.md
    ├── USER-GUIDE.md
    ├── ADMIN-GUIDE.md
    ├── API-REFERENCE.md
    ├── PROJECT-STRUCTURE.md
    └── DEPLOYMENT.md
```

---

## Prisma (Database)

```
prisma/
├── schema.prisma           # Complete database schema (18 models, 6 enums)
└── seed.ts                 # Database seeder (admin user, categories, products, coupons, etc.)
```

### `schema.prisma`
Defines all database models, relationships, enums, and indexes. Uses `@prisma/adapter-pg` for Neon PostgreSQL connection pooling.

**Key design decisions:**
- UUIDs for all primary keys (`@default(uuid())`)
- Soft relationships where needed (e.g., `shippingAddress` as JSON on Order)
- Unique constraints on slugs, SKUs, order numbers, phone numbers
- Compound unique on Review (userId + productId = one review per user per product)
- Cascading deletes on child records (CartItem → Cart, OrderItem → Order, etc.)

### `seed.ts`
Populates the database with realistic sample data:
- 1 admin user (Puneet Shidling, phone 9108455006)
- 8 saree categories with descriptions and Cloudinary images
- 24 sample products (3 per category) with full specifications
- 4 sample coupons
- 3 testimonials
- 2 homepage banners
- 4 Instagram video links
- Store settings (phone, email, GST, shipping config)

---

## Public (Static Assets)

```
public/
├── manifest.json           # PWA manifest (app name, icons, theme, display mode)
├── sw.js                   # Service worker for offline caching
├── file.svg                # Default file icon
├── globe.svg               # Globe icon
├── next.svg                # Next.js logo
├── vercel.svg              # Vercel logo
├── window.svg              # Window icon
└── icons/                  # PWA app icons (8 sizes)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

---

## Source Code (`src/`)

### App Router (`src/app/`)

Next.js 16 App Router with route groups, layouts, and co-located server/client components.

```
src/app/
├── globals.css             # Tailwind imports + custom CSS variables (oklch theme)
├── layout.tsx              # Root layout: fonts, metadata, PWA meta tags, providers
├── not-found.tsx           # Custom 404 page
├── robots.ts               # Dynamic robots.txt (blocks /admin, /api, /login)
├── sitemap.ts              # Dynamic sitemap.xml (products, categories, static pages)
│
├── (auth)/                 # Route group: authentication pages
│   ├── layout.tsx          # Centered layout with gradient bg, branding, back link
│   ├── login/
│   │   └── page.tsx        # Phone number input form → request OTP
│   └── verify-otp/
│       └── page.tsx        # 6-digit OTP input form → verify & create session
│
├── (storefront)/           # Route group: public-facing pages
│   ├── layout.tsx          # Header + Footer + CartDrawer + WhatsAppButton wrapper
│   ├── page.tsx            # Homepage (hero, featured, new arrivals, budget, categories, testimonials, Instagram)
│   ├── error.tsx           # Error boundary UI
│   ├── loading.tsx         # Loading skeleton
│   ├── about/page.tsx      # About Us page
│   ├── account/
│   │   ├── layout.tsx      # Account layout with sidebar nav
│   │   └── page.tsx        # Profile overview (name, phone, email)
│   ├── addresses/
│   │   ├── page.tsx        # Address list with add/edit/delete
│   │   ├── new/page.tsx    # Add new address form
│   │   └── [id]/edit/page.tsx  # Edit address form
│   ├── cart/page.tsx       # Full cart page
│   ├── categories/
│   │   ├── page.tsx        # All categories grid
│   │   └── [slug]/page.tsx # Products in a specific category
│   ├── checkout/page.tsx   # Checkout: address, payment, coupon, order placement
│   ├── contact/page.tsx    # Contact form + store info + Google Maps
│   ├── notifications/
│   │   ├── page.tsx        # Notifications list
│   │   └── mark-all-read-button.tsx  # "Mark all read" button
│   ├── orders/
│   │   ├── page.tsx        # Order history list
│   │   └── [id]/
│   │       ├── page.tsx    # Order detail with timeline + tracking
│   │       └── confirmation/page.tsx  # Post-checkout confirmation
│   ├── products/
│   │   ├── page.tsx        # Product listing with filters, sort, search, load more
│   │   └── [slug]/
│   │       ├── page.tsx    # Product detail page (gallery, specs, reviews, related)
│   │       └── loading.tsx # Product detail skeleton
│   ├── wishlist/page.tsx   # Wishlist grid (client-side)
│   ├── saree-guide/page.tsx    # Saree buying/draping guide
│   ├── privacy-policy/page.tsx # Privacy policy
│   ├── refund-policy/page.tsx  # Refund/return policy
│   ├── shipping-policy/page.tsx # Shipping policy
│   └── terms/page.tsx      # Terms & conditions
│
├── admin/                  # Admin panel pages
│   ├── layout.tsx          # Admin layout: sidebar nav, mobile sheet, ADMIN role guard
│   ├── loading.tsx         # Admin loading skeleton
│   ├── page.tsx            # Dashboard: stats cards, quick actions, recent orders
│   ├── banners/
│   │   ├── page.tsx        # Banner list table
│   │   ├── banner-form.tsx # Reusable banner create/edit form
│   │   ├── new/page.tsx    # Create banner page
│   │   └── [id]/page.tsx   # Edit banner page
│   ├── bulk-import/
│   │   ├── page.tsx        # Bulk import page
│   │   └── bulk-import-client.tsx  # Client-side import UI
│   ├── coupons/
│   │   ├── page.tsx        # Coupon list table
│   │   ├── new/page.tsx    # Create coupon
│   │   └── [id]/page.tsx   # Edit coupon
│   ├── customers/page.tsx  # Customer list with search, order counts, lifetime value
│   ├── instagram/page.tsx  # Instagram video management
│   ├── inventory/
│   │   ├── page.tsx        # Low stock and out-of-stock monitoring
│   │   └── whatsapp-alert-button.tsx  # WhatsApp alert sender
│   ├── messages/
│   │   ├── page.tsx        # Contact message inbox
│   │   └── message-actions.tsx  # Mark read / delete action buttons
│   ├── orders/
│   │   ├── page.tsx        # Admin order list with status filter/search/pagination
│   │   ├── export-orders-button.tsx  # Excel export button
│   │   ├── order-status-update.tsx   # Status change dropdown
│   │   └── [id]/page.tsx   # Admin order detail
│   ├── products/
│   │   ├── page.tsx        # Product list with search/pagination
│   │   ├── product-form.tsx # Reusable product create/edit mega-form
│   │   ├── new/page.tsx    # Create product
│   │   └── [id]/page.tsx   # Edit product
│   ├── reports/
│   │   ├── page.tsx        # Sales reports overview
│   │   ├── revenue-chart.tsx  # Recharts bar chart component
│   │   └── top-selling-table.tsx  # Top products table
│   ├── settings/page.tsx   # Store settings display
│   ├── site-images/page.tsx # Site image management
│   └── testimonials/
│       ├── page.tsx        # Testimonial list
│       ├── new/page.tsx    # Create testimonial
│       └── [id]/page.tsx   # Edit testimonial
│
└── api/                    # REST API routes
    ├── addresses/
    │   ├── route.ts        # GET (list), POST (create)
    │   └── [id]/route.ts   # GET, PUT, DELETE
    ├── admin/
    │   ├── banners/
    │   │   ├── route.ts    # GET/POST
    │   │   └── [id]/route.ts  # GET/PUT/DELETE
    │   ├── coupons/
    │   │   ├── route.ts    # GET/POST
    │   │   └── [id]/route.ts  # GET/PUT/DELETE
    │   ├── instagram/
    │   │   ├── route.ts    # GET/POST
    │   │   └── [id]/route.ts  # PUT/DELETE
    │   ├── messages/[id]/route.ts  # PATCH/DELETE
    │   ├── orders/
    │   │   ├── export/route.ts    # GET → Excel download
    │   │   └── [id]/status/route.ts  # PATCH → update status
    │   ├── products/
    │   │   ├── route.ts    # POST (create with images)
    │   │   ├── bulk-import/route.ts  # POST → bulk import
    │   │   └── [id]/route.ts  # GET/PUT/DELETE
    │   ├── site-images/route.ts  # GET/POST
    │   ├── testimonials/
    │   │   ├── route.ts    # GET/POST
    │   │   └── [id]/route.ts  # PUT/DELETE
    │   └── upload/route.ts  # POST → Cloudinary signature
    ├── cart/sync/route.ts   # POST → sync cart to DB
    ├── contact/route.ts     # POST → contact message
    ├── coupons/check/route.ts  # POST → validate coupon
    ├── orders/
    │   ├── route.ts         # POST → create order
    │   ├── verify-payment/route.ts  # POST → verify Razorpay
    │   └── [id]/invoice/route.ts  # GET → invoice data
    ├── razorpay/webhook/route.ts  # POST → webhook handler
    └── reviews/route.ts     # GET/POST → product reviews
```

---

### Server Actions (`src/actions/`)

```
src/actions/
├── auth.ts                 # requestOtpAction, verifyOtpAction, logoutAction
├── cart.ts                 # addToCartAction, removeFromCartAction, updateQuantityAction, getCartAction
├── checkout.ts             # createOrderAction, verifyPaymentAction, updateOrderStatusAction
├── notifications.ts        # getUserNotifications, getUnreadNotificationCount, markRead, markAllRead, createOrderNotification
└── products.ts             # getProducts, getProductBySlug, getFeaturedProducts, getNewArrivals, getBudgetProducts, getCategories, getRelatedProducts
```

Server Actions provide `"use server"` functions that can be called directly from Client Components without writing API routes.

---

### Components (`src/components/`)

```
src/components/
├── banner-carousel.tsx         # Homepage hero banner carousel (auto-rotating)
├── contact-form.tsx            # Contact Us form with validation
├── instagram-embed.tsx         # Instagram reel embed renderer
│
├── admin/                      # Admin-specific components
│   ├── admin-sidebar.tsx       # Navigation sidebar (collapsible, mobile sheet)
│   ├── confirm-dialog.tsx      # Confirmation modal (used for deletes)
│   ├── image-uploader.tsx      # Multi-image Cloudinary uploader with drag reorder
│   ├── single-image-upload.tsx # Single image Cloudinary uploader
│   └── star-rating-input.tsx   # 1–5 star rating input (for testimonials)
│
├── layout/                     # Layout components (used in storefront layout)
│   ├── index.ts                # Barrel exports
│   ├── header.tsx              # Main site header (logo, nav, search, auth, cart, wishlist)
│   ├── footer.tsx              # Site footer (links, contact, social, copyright)
│   ├── cart-drawer.tsx         # Slide-out cart sheet (item list, free shipping bar)
│   ├── search-dialog.tsx       # Full-screen search overlay
│   ├── notification-bell.tsx   # Bell icon with unread count badge
│   └── whatsapp-button.tsx     # Floating WhatsApp button (bottom-right)
│
├── orders/
│   └── download-invoice-button.tsx  # PDF invoice generator using @react-pdf/renderer
│
├── product/                    # Product-related components
│   ├── index.ts                # Barrel exports
│   ├── product-card.tsx        # Product card (thumbnail, price, badge, wishlist, quick view)
│   ├── product-filters.tsx     # Filter sidebar/drawer (fabric, occasion, price, category)
│   ├── product-grid-load-more.tsx  # Load-more pagination button + grid
│   ├── product-reviews.tsx     # Reviews section (list + stats)
│   ├── product-search.tsx      # Search input component
│   ├── product-sort.tsx        # Sort-by dropdown
│   ├── add-to-cart-button.tsx  # Add to cart with quantity selector
│   ├── image-gallery.tsx       # Product image gallery with thumbnails + zoom
│   ├── quick-view-modal.tsx    # Quick view modal overlay
│   ├── recently-viewed.tsx     # "Recently Viewed" products carousel
│   ├── review-form.tsx         # Write/submit review form
│   ├── share-button.tsx        # Web Share API share button
│   ├── track-product-view.tsx  # Tracks views in Zustand (recently viewed)
│   ├── whatsapp-share-button.tsx   # Share product via WhatsApp
│   └── wishlist-button.tsx     # Heart toggle button for wishlist
│
├── providers/
│   └── providers.tsx           # Client providers wrapper (Toaster, TooltipProvider)
│
├── pwa/
│   └── pwa-register.tsx        # Service worker registration on mount
│
├── seo/
│   └── json-ld.tsx             # JSON-LD structured data (Product, Organization, Breadcrumb)
│
└── ui/                         # ShadCN UI components (26 components)
    ├── accordion.tsx           # Collapsible content sections
    ├── alert-dialog.tsx        # Confirmation/alert modal
    ├── avatar.tsx              # User avatar with fallback
    ├── badge.tsx               # Status/label badges
    ├── button.tsx              # Button with variants
    ├── card.tsx                # Card container
    ├── checkbox.tsx            # Checkbox input
    ├── dialog.tsx              # Modal dialog
    ├── dropdown-menu.tsx       # Dropdown menu
    ├── form.tsx                # Form wrapper (react-hook-form integration)
    ├── input.tsx               # Text input
    ├── label.tsx               # Form label
    ├── pagination.tsx          # Pagination controls
    ├── popover.tsx             # Popover dropdown
    ├── radio-group.tsx         # Radio button group
    ├── scroll-area.tsx         # Custom scrollbar
    ├── select.tsx              # Select dropdown
    ├── separator.tsx           # Visual separator line
    ├── sheet.tsx               # Slide-out panel (used for cart drawer, mobile nav)
    ├── skeleton.tsx            # Loading skeleton placeholder
    ├── slider.tsx              # Range slider (used for price filter)
    ├── sonner.tsx              # Toast notification provider
    ├── table.tsx               # Data table
    ├── tabs.tsx                # Tab navigation
    ├── textarea.tsx            # Multi-line text input
    └── tooltip.tsx             # Hover tooltip
```

---

### Configuration (`src/config/`)

```
src/config/
├── env.ts                 # Type-safe environment variable validation (@t3-oss/env-nextjs)
├── navigation.ts          # Navigation definitions (storefront, account, admin menus)
└── site.ts                # Site configuration (name, contact, address, shipping, social, SEO)
```

**`site.ts` — Central configuration:**
- Store name, short name, description
- Phone, WhatsApp, email
- Address (street, city, state, pincode)
- Shipping config (free shipping threshold, default charge, delivery estimate)
- Social links (Instagram, Facebook, YouTube)
- SEO defaults

---

### Library (`src/lib/`)

```
src/lib/
├── auth.ts                # JWT auth: createToken, verifyToken, getSession, setSessionCookie, clearSessionCookie
├── cloudinary.ts          # URL builder: getCloudinaryUrl, getProductImageUrl (thumbnail/card/detail/zoom)
├── constants.ts           # Label maps (FABRIC_LABELS, OCCASION_LABELS, ORDER_STATUS_LABELS), Indian states list, sort options, pagination config
├── db.ts                  # Prisma client singleton (PrismaPg adapter for connection pooling)
├── errors.ts              # Custom error hierarchy (AppError → NotFound, Validation, Unauthorized, etc.)
├── razorpay.ts            # Razorpay SDK instance
├── site-images.ts         # Helpers to fetch site images from Settings table
└── utils.ts               # Utility functions:
                           #   cn()                  — Tailwind class merging
                           #   formatPrice()         — ₹1,234 formatting
                           #   slugify()             — URL-safe slug generation
                           #   generateSku()         — Auto SKU generation
                           #   generateOrderNumber() — KPT-YYYYMMDD-XXXXX format
                           #   getDiscountPercentage() — Calculate % off
                           #   truncate()            — Truncate text with ellipsis
                           #   formatDate()          — "25 Feb 2026" formatting
                           #   formatPhone()         — +91 XXXXX XXXXX formatting
                           #   getWhatsAppLink()     — wa.me URL builder
```

---

### Services (`src/services/`)

```
src/services/
├── auth.service.ts        # requestOtp (rate limit + MSG91 integration), verifyOtp (bcrypt + user upsert + JWT)
├── cart.service.ts         # getOrCreateCart, addToCart, updateCartItemQuantity, removeFromCart, getCartSummary, mergeGuestCart, clearCart
├── inventory.service.ts    # adjustStock, getLowStockProducts, getInventoryLogs
├── order.service.ts        # createOrder (transaction: stock, inventory log, coupon, Razorpay), updateOrderStatus, applyCoupon
└── payment.service.ts      # verifyPaymentSignature (client callback), handleWebhookEvent (Razorpay webhook)
```

The services layer contains all business logic, separated from API routes and server actions for testability and reuse.

---

### Stores (`src/stores/`)

```
src/stores/
├── cart-store.ts           # Zustand store: cart items, add/remove/update, isOpen, itemCount, subtotal
│                           #   LocalStorage key: "kpt-cart"
├── recently-viewed-store.ts # Zustand store: last 12 viewed products
│                           #   LocalStorage key: "kpt-recently-viewed"
└── wishlist-store.ts       # Zustand store: wishlist items, toggle, isInWishlist, clearAll
                            #   LocalStorage key: "kpt-wishlist"
```

All stores use Zustand's `persist` middleware with `localStorage` for persistence across page refreshes.

---

### Types (`src/types/`)

```
src/types/
└── index.ts               # TypeScript type definitions:
                           #   ActionResponse         — Server action return type
                           #   PaginatedResult<T>     — Paginated query result
                           #   SessionUser            — JWT payload (userId, phone, role)
                           #   ProductWithImages      — Product + images relation
                           #   CartSummary            — Cart with items and totals
                           #   OrderWithItems         — Order + items + user
                           #   DashboardStats         — Admin dashboard data
                           #   SiteImageSettings      — Site image key-value pairs
```

---

### Validators (`src/validators/`)

```
src/validators/
├── address.ts             # addressSchema: label, fullName, phone, line1, line2, city, state, pincode
├── auth.ts                # phoneSchema, otpSchema, loginSchema, verifyOtpSchema
├── common.ts              # paginationSchema, idSchema, slugSchema
├── coupon.ts              # couponSchema: code, discountType, value, limits, validity dates
├── order.ts               # checkoutSchema, updateOrderStatusSchema, verifyPaymentSchema
├── product.ts             # createProductSchema (40+ fields), updateProductSchema, productFilterSchema
└── review.ts              # reviewSchema: productId, rating, comment
```

All validators use **Zod v4** schemas for runtime validation. Used in API routes, Server Actions, and form validation via `@hookform/resolvers/zod`.

---

## Database Schema

### Entity Relationship Overview

```
User (1) ──→ (N) Address
User (1) ──→ (N) Order
User (1) ──→ (1) Cart ──→ (N) CartItem ──→ Product
User (1) ──→ (N) Review ──→ Product
User (1) ──→ (N) Notification

Category (1) ──→ (N) Product

Product (1) ──→ (N) ProductImage
Product (1) ──→ (N) OrderItem
Product (1) ──→ (N) CartItem
Product (1) ──→ (N) InventoryLog
Product (1) ──→ (N) Review

Order (1) ──→ (N) OrderItem
Order (N) ──→ (1) Coupon
Order (N) ──→ (1) Address
Order (N) ──→ (1) User

Banner            (standalone)
Testimonial       (standalone)
InstagramVideo    (standalone)
Setting           (key-value store)
ContactMessage    (standalone)
Otp               (standalone, TTL-based)
```

### Enums

| Enum | Values |
|------|--------|
| **Role** | `USER`, `ADMIN` |
| **OrderStatus** | `PENDING`, `CONFIRMED`, `PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED` |
| **PaymentMethod** | `PREPAID`, `COD` |
| **PaymentStatus** | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| **DiscountType** | `PERCENTAGE`, `FLAT` |
| **Fabric** | `SILK`, `COTTON`, `BANARASI`, `CHIFFON`, `GEORGETTE`, `CREPE`, `LINEN`, `ORGANZA`, `TUSSAR`, `MYSORE_SILK`, `KANCHIPURAM`, `OTHER` |
| **Occasion** | `WEDDING`, `FESTIVE`, `DAILY`, `PARTY`, `CASUAL`, `OFFICE` |

---

## Architecture Patterns

### Data Flow

```
Browser → Middleware (auth check) → Page/Route Handler
                                        ↓
                                   Server Action  OR  API Route
                                        ↓
                                   Service Layer (business logic)
                                        ↓
                                   Prisma Client → Database
```

### Key Patterns Used

| Pattern | Example |
|---------|---------|
| **Server Components** | All pages fetch data on the server, stream to client |
| **Client Components** | Interactive elements: cart drawer, filters, forms, buttons |
| **Server Actions** | `"use server"` functions for auth, cart, product fetching |
| **API Routes** | REST endpoints for CRUD operations, webhooks, file generation |
| **Service Layer** | Business logic separated from routes/actions for reuse |
| **Zustand Stores** | Client-side state (cart, wishlist, recently viewed) |
| **Zod Validation** | Runtime type checking at every boundary |
| **JWT Auth** | Stateless auth via httpOnly session cookie |
| **Route Groups** | `(auth)`, `(storefront)` — shared layouts without URL impact |
| **Middleware** | Edge-level route protection before rendering |
