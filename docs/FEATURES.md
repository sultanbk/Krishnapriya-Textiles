# Features — Krishnapriya Textiles

A comprehensive list of every feature in the application, organized by area.

---

## Table of Contents

- [Authentication](#authentication)
- [Homepage](#homepage)
- [Product Catalog](#product-catalog)
- [Shopping Cart](#shopping-cart)
- [Checkout & Payments](#checkout--payments)
- [Order Management (Customer)](#order-management-customer)
- [User Account](#user-account)
- [Wishlist](#wishlist)
- [Notifications](#notifications)
- [Reviews & Ratings](#reviews--ratings)
- [Search](#search)
- [SEO & Performance](#seo--performance)
- [PWA (Progressive Web App)](#pwa-progressive-web-app)
- [WhatsApp Integration](#whatsapp-integration)
- [Admin Dashboard](#admin-dashboard)
- [Admin — Product Management](#admin--product-management)
- [Admin — Order Management](#admin--order-management)
- [Admin — Customer Management](#admin--customer-management)
- [Admin — Coupon Management](#admin--coupon-management)
- [Admin — Inventory Management](#admin--inventory-management)
- [Admin — Sales Reports](#admin--sales-reports)
- [Admin — Banner Management](#admin--banner-management)
- [Admin — Testimonial Management](#admin--testimonial-management)
- [Admin — Instagram Management](#admin--instagram-management)
- [Admin — Contact Messages](#admin--contact-messages)
- [Admin — Site Images](#admin--site-images)
- [Admin — Bulk Import](#admin--bulk-import)
- [Admin — Export Orders](#admin--export-orders)
- [PDF Invoice Generation](#pdf-invoice-generation)
- [Saree Guide](#saree-guide)
- [Static Pages](#static-pages)

---

## Authentication

**Passwordless phone OTP login** — No passwords to remember.

| Feature | Details |
|---------|---------|
| Phone input | Indian mobile number (10 digits) |
| OTP delivery | 6-digit code via MSG91 SMS |
| OTP security | Bcrypt-hashed, 5-minute expiry, max 3 attempts |
| Rate limiting | Max 3 OTP requests per phone per 10 minutes |
| Session | JWT token (HS256), 30-day expiry, httpOnly cookie |
| Auto-redirect | Logged-in users skip login page |
| Role-based access | `USER` and `ADMIN` roles |
| Route protection | Middleware guards auth-required pages + admin panel |

**How it works:**
1. User enters phone number on `/login`
2. System sends 6-digit OTP via SMS
3. User enters OTP on `/verify-otp`
4. On success, JWT session cookie is set
5. New users are automatically registered

---

## Homepage

A visually rich landing page with multiple sections:

| Section | Description |
|---------|-------------|
| **Hero Banner** | Full-width image carousel with configurable banners (title, subtitle, link) |
| **Featured Products** | Curated saree selection marked as "featured" in admin |
| **New Arrivals** | Latest products marked as "new arrival" |
| **Budget Picks** | Affordable sarees (price ≤ ₹999) |
| **Category Grid** | Visual category cards linking to filtered product pages |
| **Testimonials** | Customer reviews carousel managed from admin |
| **Instagram Reels** | Embedded Instagram reels/videos managed from admin |
| **WhatsApp CTA** | Floating WhatsApp button for instant inquiries |

---

## Product Catalog

### Product Listing (`/products`)

| Feature | Details |
|---------|---------|
| **Filters** | Fabric (12 types), Occasion (6 types), Price range slider, Category |
| **Multi-select** | Select multiple fabrics/occasions simultaneously |
| **Sorting** | Newest, Price (Low→High, High→Low), Name (A→Z) |
| **Search** | Real-time product search by name |
| **Load More** | Infinite pagination (12 products per page) |
| **Quick View** | Modal preview without leaving the listing page |
| **Stock Badges** | "Out of Stock", "Low Stock" indicators on cards |
| **Wishlist** | Heart icon on every product card |
| **Discount Badge** | Shows percentage off when compare-at-price exists |

### Product Detail Page (`/products/[slug]`)

| Feature | Details |
|---------|---------|
| **Image Gallery** | Multi-image viewer with zoom capability |
| **Saree Specs** | Fabric, color, length, width, weight, occasion, zari type, border, pallu, wash care |
| **Blouse Info** | Whether blouse is included + blouse length |
| **COD Badge** | Shows if Cash on Delivery is available |
| **Add to Cart** | Quantity selector + add to cart button |
| **Wishlist** | Toggle wishlist from detail page |
| **Share** | Web Share API + WhatsApp share button |
| **WhatsApp Inquiry** | Direct message to store with product link |
| **Reviews** | Star ratings, customer reviews, average score |
| **Write Review** | Authenticated users can submit a review |
| **Related Products** | Similar products from the same category |
| **Recently Viewed** | Products the user has viewed recently |
| **JSON-LD** | Structured data for Google rich results |
| **Breadcrumbs** | Navigation breadcrumbs (JSON-LD + visual) |

### Category Pages (`/categories`, `/categories/[slug]`)

| Feature | Details |
|---------|---------|
| **Category Grid** | Visual grid of all active categories with images |
| **Category Detail** | Products filtered by selected category with all standard filters |

---

## Shopping Cart

**Dual-mode cart:** Client-side (Zustand + localStorage) for guests, synced to DB for logged-in users.

| Feature | Details |
|---------|---------|
| **Cart Drawer** | Slide-out sheet accessible from any page via header icon |
| **Cart Page** | Full `/cart` page with detailed view |
| **Quantity Controls** | Increment/decrement buttons per item |
| **Remove Item** | Delete individual items |
| **Price Summary** | Subtotal, shipping, discount, total |
| **Free Shipping Bar** | Visual progress bar showing how close to free shipping (₹1,500) |
| **Empty State** | Friendly message with "Continue Shopping" CTA |
| **Persistent** | Survives page refreshes (localStorage for guests, DB for logged-in) |
| **Cart Sync** | Client cart synced to database before checkout |

---

## Checkout & Payments

**Route:** `/checkout` (requires login)

| Feature | Details |
|---------|---------|
| **Progress Stepper** | 3-step visual progress (Cart → Address & Payment → Confirmation) |
| **Address Selection** | Choose from saved addresses or add new one inline |
| **New Address Form** | Full Indian address form (name, phone, line1, line2, city, state, pincode) |
| **Payment Methods** | **Prepaid** (Razorpay — UPI, Cards, Net Banking, Wallets) or **COD** (Cash on Delivery) |
| **Coupon System** | Apply coupon code with real-time discount calculation |
| **Coupon Validation** | Server-side validation (min order, expiry, usage limits, per-user limits) |
| **Order Summary** | Line items, subtotal, shipping (₹99 or free above ₹1,500), discount, total |
| **Razorpay Checkout** | In-page Razorpay modal for card/UPI/netbanking payment |
| **Payment Verification** | Client + server-side signature verification |
| **Webhook Handling** | Razorpay webhook for `payment.captured` and `payment.failed` events |
| **Stock Validation** | Checks stock availability at order placement |
| **Order Confirmation** | Redirects to `/orders/[id]/confirmation` with order details and WhatsApp link |

---

## Order Management (Customer)

### Order History (`/orders`)

| Feature | Details |
|---------|---------|
| **Order List** | All past orders with status badges |
| **Order Number** | Unique order number (e.g., `KPT-20260225-XXXXX`) |
| **Status Colors** | Color-coded badges (green=Delivered, blue=Shipped, yellow=Pending, etc.) |

### Order Detail (`/orders/[id]`)

| Feature | Details |
|---------|---------|
| **Order Timeline** | Visual status history (Pending → Confirmed → Processing → Packed → Shipped → Delivered) |
| **Tracking Number** | Displayed when shipped (if provided by admin) |
| **Item List** | Product images, names, quantities, prices |
| **Shipping Address** | Delivery address details |
| **Payment Info** | Method, status, Razorpay payment ID |
| **PDF Invoice** | Download invoice as PDF |
| **WhatsApp Support** | Direct message to store about the order |
| **Cancel Info** | Shows cancellation reason if cancelled |

---

## User Account

### Profile (`/account`)

| Feature | Details |
|---------|---------|
| **View Profile** | Name, phone, email (read-only) |
| **Navigation** | Links to Orders, Addresses, Wishlist, Notifications |

### Addresses (`/addresses`)

| Feature | Details |
|---------|---------|
| **Address List** | View all saved addresses |
| **Add Address** | Full form with label (Home/Work/Other), Indian states dropdown |
| **Edit Address** | Update any saved address |
| **Delete Address** | Remove addresses |
| **Default Address** | Mark one as default for quick checkout |

---

## Wishlist

**Client-side wishlist** persisted to localStorage via Zustand.

| Feature | Details |
|---------|---------|
| **Toggle** | Heart icon on product cards and detail pages |
| **Wishlist Page** | Grid view of all wishlisted products at `/wishlist` |
| **Mobile Friendly** | Wishlist button always visible on touch devices |
| **Persistent** | Survives page refreshes and browser restarts |
| **Badge Count** | Wishlist count shown in mobile nav drawer |

---

## Notifications

**In-app notification system** for order status updates.

| Feature | Details |
|---------|---------|
| **Bell Icon** | Header notification bell with unread count badge |
| **Notification List** | All notifications at `/notifications` |
| **Mark as Read** | Individual or "Mark All as Read" |
| **Auto-generation** | Created automatically on order status changes |
| **Types** | Order confirmed, shipped, delivered, cancelled |
| **Deep Links** | Click notification to go to relevant order |

---

## Reviews & Ratings

| Feature | Details |
|---------|---------|
| **Star Rating** | 1–5 star rating system |
| **Written Review** | Optional text comment |
| **One Per Product** | Each user can review a product once |
| **Average Score** | Calculated average displayed on product page |
| **Review Count** | Total review count shown |
| **Visibility** | Admin can toggle review visibility |
| **Auth Required** | Must be logged in to write a review |

---

## Search

| Feature | Details |
|---------|---------|
| **Search Dialog** | Full-screen search overlay from header |
| **Product Search** | Search by product name |
| **Filter Search** | Combined with fabric, occasion, category, price filters |
| **URL Params** | Search state preserved in URL for sharing/bookmarking |

---

## SEO & Performance

| Feature | Details |
|---------|---------|
| **Dynamic Sitemap** | Auto-generated `sitemap.xml` with all products, categories, static pages |
| **Robots.txt** | Configured to block admin, API, and auth routes |
| **JSON-LD** | Product, Organization, and BreadcrumbList structured data |
| **Meta Tags** | Dynamic title, description, Open Graph, Twitter cards per page |
| **Image Optimization** | Cloudinary CDN with responsive sizes and lazy loading |
| **Server Components** | Data fetching on server, minimal client JS |
| **Turbopack** | Fast development builds |

---

## PWA (Progressive Web App)

| Feature | Details |
|---------|---------|
| **Installable** | "Add to Home Screen" on mobile browsers |
| **Manifest** | App name, icons (8 sizes), theme color (#6b1420), standalone mode |
| **Service Worker** | Registered for offline caching |
| **App Icons** | 72px to 512px icon set |
| **Portrait Mode** | Locked to portrait orientation |

---

## WhatsApp Integration

| Feature | Details |
|---------|---------|
| **Floating Button** | On every page — instant message to store |
| **Product Inquiry** | "Ask on WhatsApp" with product name & link pre-filled |
| **Product Share** | Share product via WhatsApp with friends |
| **Order Support** | Message store about an order (order number pre-filled) |
| **Low Stock Alerts** | Admin can send inventory alerts to themselves via WhatsApp |
| **Store Number** | 9108455006 (configurable in `src/config/site.ts`) |

---

## Admin Dashboard

**Route:** `/admin` (requires ADMIN role)

| Feature | Details |
|---------|---------|
| **Revenue Card** | Total revenue with change indicator |
| **Orders Card** | Total order count with recent count |
| **Customers Card** | Total registered customers |
| **Products Card** | Total active products |
| **Quick Actions** | Direct links to common admin tasks |
| **Recent Orders** | Latest 5 orders table with status badges |
| **Color-coded Stats** | Each stat card has distinct icon background colors |

---

## Admin — Product Management

**Route:** `/admin/products`

| Feature | Details |
|---------|---------|
| **Product List** | Paginated table with search, thumbnails |
| **Create Product** | Full form with 40+ fields |
| **Edit Product** | Update any product detail |
| **Delete Product** | Remove with confirmation dialog |
| **Image Upload** | Multi-image upload to Cloudinary with drag-and-drop reordering |
| **Saree Fields** | Fabric, occasion, color, length, width, weight, zari type, border, pallu, wash care, blouse included/length |
| **Pricing** | Sale price, compare-at price, cost price |
| **Inventory** | Stock quantity, low stock threshold, track inventory toggle |
| **Flags** | Active, Featured, New Arrival, COD Available |
| **SEO** | Meta title, meta description per product |
| **Auto-generate** | SKU and slug auto-generated from product name |

---

## Admin — Order Management

**Route:** `/admin/orders`

| Feature | Details |
|---------|---------|
| **Order List** | Full table with search, status filter, pagination |
| **Status Filters** | Filter by: All, Pending, Confirmed, Processing, Packed, Shipped, Delivered, Cancelled |
| **Status Update** | Change order status via dropdown (with valid transitions) |
| **Tracking Number** | Add courier tracking number when shipping |
| **Order Detail** | View full order: items, address, payment, timeline |
| **Color-coded Badges** | Each status has a distinct color (green=Delivered, blue=Shipped, etc.) |
| **Customer Notifications** | Auto-creates notification on status change |

---

## Admin — Customer Management

**Route:** `/admin/customers`

| Feature | Details |
|---------|---------|
| **Customer List** | All registered users with search |
| **Order Count** | Total orders per customer |
| **Lifetime Value** | Total amount spent by customer |
| **Join Date** | Registration date |
| **Phone Display** | Formatted phone numbers |

---

## Admin — Coupon Management

**Route:** `/admin/coupons`

| Feature | Details |
|---------|---------|
| **Coupon List** | All coupons with status and usage stats |
| **Create Coupon** | Code, discount type (% or flat), value, limits |
| **Edit Coupon** | Update existing coupon |
| **Delete Coupon** | Remove with confirmation |
| **Discount Types** | Percentage or flat (fixed amount) |
| **Controls** | Min order amount, max discount cap, usage limit, per-user limit |
| **Validity** | Start date, end date, active/inactive toggle |
| **Usage Tracking** | Track total times used |

---

## Admin — Inventory Management

**Route:** `/admin/inventory`

| Feature | Details |
|---------|---------|
| **Out of Stock** | List of products with zero stock |
| **Low Stock** | Products below their low stock threshold |
| **Stock Counts** | Current stock vs. threshold display |
| **WhatsApp Alert** | Send low stock product list to owner via WhatsApp |
| **Quick Edit** | Link to product edit page for restocking |

---

## Admin — Sales Reports

**Route:** `/admin/reports`

| Feature | Details |
|---------|---------|
| **Revenue Chart** | Monthly/weekly revenue bar chart (Recharts) |
| **Period Toggle** | Switch between monthly and weekly views |
| **Top Selling** | Table of top-selling products by quantity |
| **Revenue Amount** | Revenue per product |
| **Data Range** | Configurable date range for reports |

---

## Admin — Banner Management

**Route:** `/admin/banners`

| Feature | Details |
|---------|---------|
| **Banner List** | All homepage banners with thumbnails |
| **Create Banner** | Title, subtitle, image, mobile image, link, position |
| **Edit Banner** | Update any banner |
| **Delete Banner** | Remove with confirmation |
| **Scheduling** | Start date and optional end date |
| **Active Toggle** | Enable/disable without deleting |
| **Ordering** | Position field to control display order |

---

## Admin — Testimonial Management

**Route:** `/admin/testimonials`

| Feature | Details |
|---------|---------|
| **Testimonial List** | All customer testimonials |
| **Create** | Customer name, location, content, rating (1-5 star input), image |
| **Edit** | Update existing testimonial |
| **Delete** | Remove with confirmation |
| **Active Toggle** | Show/hide from storefront |
| **Ordering** | Position field for display order |

---

## Admin — Instagram Management

**Route:** `/admin/instagram`

| Feature | Details |
|---------|---------|
| **Video List** | All Instagram reels/videos |
| **Add Video** | Instagram URL + title |
| **Edit** | Update URL and title |
| **Delete** | Remove with confirmation |
| **Active Toggle** | Show/hide from homepage |
| **Ordering** | Position field for display order |

---

## Admin — Contact Messages

**Route:** `/admin/messages`

| Feature | Details |
|---------|---------|
| **Inbox** | All contact form submissions |
| **Read/Unread** | Visual indicator for unread messages |
| **Mark as Read** | Toggle read status |
| **Delete** | Remove messages |
| **Details** | Name, phone, email, subject, message |

---

## Admin — Site Images

**Route:** `/admin/site-images`

| Feature | Details |
|---------|---------|
| **Image Settings** | Upload/manage key site images via Cloudinary |
| **Types** | Hero background, about page, Open Graph image, etc. |
| **Preview** | Visual preview of uploaded images |

---

## Admin — Bulk Import

**Route:** `/admin/bulk-import`

| Feature | Details |
|---------|---------|
| **Data Input** | Paste or upload product data for bulk creation |
| **Validation** | Server-side validation of all fields |
| **Progress** | Import status feedback |
| **Error Reporting** | Shows which rows failed and why |

---

## Admin — Export Orders

**Available on:** `/admin/orders`

| Feature | Details |
|---------|---------|
| **Excel Export** | Download all orders as `.xlsx` file |
| **Format** | ExcelJS with formatted columns |
| **Data** | Order number, customer, items, totals, status, dates |
| **One Click** | Single button to trigger export |

---

## PDF Invoice Generation

**Available on:** Order detail page (`/orders/[id]`)

| Feature | Details |
|---------|---------|
| **Client-side PDF** | Generated in browser using @react-pdf/renderer |
| **Content** | Store header, order details, item table, totals, footer |
| **Store Branding** | Krishnapriya Textiles logo area, address, phone, email |
| **Download** | Click "Download Invoice" button |
| **Print Ready** | Professional A4 layout |

---

## Saree Guide

**Route:** `/saree-guide`

| Feature | Details |
|---------|---------|
| **Fabric Guide** | Information about all 12 fabric types |
| **Occasion Guide** | Which saree suits which occasion |
| **Draping Tips** | Saree draping instructions |
| **Care Guide** | How to maintain and wash sarees |
| **Size Guide** | Length and width guide |

---

## Static Pages

| Page | Route | Content |
|------|-------|---------|
| **About Us** | `/about` | Store story, values, mission |
| **Contact** | `/contact` | Contact form + store details + Google Maps embed |
| **Privacy Policy** | `/privacy-policy` | Data collection, usage, sharing policies |
| **Refund Policy** | `/refund-policy` | Return/refund process and timelines |
| **Shipping Policy** | `/shipping-policy` | Delivery areas, charges, timelines |
| **Terms & Conditions** | `/terms` | Legal terms of service |
