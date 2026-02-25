# User Guide — Krishnapriya Textiles

A complete guide for customers on how to use the storefront.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Browsing Products](#browsing-products)
- [Product Detail Page](#product-detail-page)
- [Using Filters & Search](#using-filters--search)
- [Wishlist](#wishlist)
- [Shopping Cart](#shopping-cart)
- [Checkout & Payment](#checkout--payment)
- [Tracking Your Orders](#tracking-your-orders)
- [Managing Your Account](#managing-your-account)
- [Managing Addresses](#managing-addresses)
- [Notifications](#notifications)
- [Writing Reviews](#writing-reviews)
- [Downloading Invoices](#downloading-invoices)
- [Contacting the Store](#contacting-the-store)
- [Saree Guide](#saree-guide)
- [Installing as App (PWA)](#installing-as-app-pwa)

---

## Getting Started

### Creating an Account / Logging In

Krishnapriya Textiles uses **phone number login** — no password needed!

1. Click **"Login"** in the top-right corner of the website
2. Enter your **10-digit mobile number** (e.g., 9876543210)
3. Click **"Request OTP"**
4. You'll receive a **6-digit OTP** via SMS
5. Enter the OTP and click **"Verify"**
6. You're logged in! If it's your first time, your account is automatically created

> **Tip:** Your session lasts 30 days. You won't need to log in again unless you clear your browser data.

### Browsing Without Login

You can browse all products, view details, add to cart, and use the wishlist **without logging in**. You only need to log in when:
- Proceeding to checkout
- Viewing your order history
- Writing a review
- Managing addresses

---

## Browsing Products

### Homepage Sections

The homepage showcases products in curated sections:

| Section | What you'll find |
|---------|-----------------|
| **Hero Banner** | Current sales and promotions (swipe/auto-rotate) |
| **Featured Products** | Hand-picked premium sarees |
| **New Arrivals** | Latest additions to the collection |
| **Budget Picks** | Sarees under ₹999 |
| **Shop by Category** | Quick links to Mysore Silk, Kanchipuram, Cotton, etc. |
| **Customer Reviews** | What other customers are saying |
| **Instagram** | Latest styling videos and reels |

### Category Pages

1. Click any category card on the homepage, or
2. Go to **"Categories"** in the navigation menu
3. Browse all categories or click one to see its products

### Product Listing Page

Navigate to **"Shop"** or **"All Products"** to see the full catalog with filtering options.

---

## Product Detail Page

Click any product to view its full details:

### What you'll see:

- **Image Gallery** — Multiple product photos. Click thumbnails to switch. Zoom on hover
- **Price** — Current price, original price (with discount percentage if on sale)
- **Availability** — In Stock / Low Stock / Out of Stock
- **COD Badge** — Whether Cash on Delivery is available for this product
- **Saree Specifications:**
  - Fabric type (Silk, Cotton, Banarasi, etc.)
  - Color, Length, Width, Weight
  - Zari type, Border design, Pallu design
  - Blouse included (yes/no) and blouse length
  - Wash care instructions
  - Occasion suitability (Wedding, Festive, etc.)
- **Add to Cart** — Select quantity and add to cart
- **Wishlist** — Click the heart icon to save for later
- **Share** — Share via WhatsApp or native share
- **Ask on WhatsApp** — Direct message to the store about this product
- **Customer Reviews** — Read ratings and reviews from other buyers
- **Related Products** — Similar sarees you might like
- **Recently Viewed** — Products you've looked at before

---

## Using Filters & Search

### Search

1. Click the **search icon** (🔍) in the header
2. Type your search term (e.g., "red silk saree", "banarasi wedding")
3. Results appear as you type
4. Click a result to go to the product page

### Filters (on Product Listing page)

| Filter | How to use |
|--------|-----------|
| **Fabric** | Select one or more fabrics (Silk, Cotton, Banarasi, etc.) — multi-select |
| **Occasion** | Select occasions (Wedding, Festive, Daily, etc.) — multi-select |
| **Price Range** | Drag the slider to set min and max price |
| **Category** | Select a specific category |

### Sorting

Click the **"Sort by"** dropdown to arrange products by:
- **Newest First** (default)
- **Price: Low to High**
- **Price: High to Low**
- **Name: A to Z**

### Clearing Filters

Click **"Clear All"** to reset all filters and see all products again.

---

## Wishlist

Save sarees you love for later!

### Adding to Wishlist

- **From product card:** Click the **heart icon** (♡) on any product card
- **From product page:** Click the **heart icon** on the product detail page
- A filled red heart (♥) means it's in your wishlist

### Viewing Your Wishlist

1. Click the **heart icon** in the header, or
2. Go to `/wishlist`
3. See all your saved products in a grid
4. Click any product to view details or add to cart
5. Click the heart again to remove from wishlist

> **Note:** The wishlist is saved in your browser. It persists across page refreshes but is specific to each browser/device.

---

## Shopping Cart

### Adding to Cart

1. On any product page, select the **quantity** (default: 1)
2. Click **"Add to Cart"**
3. The **cart drawer** slides open showing your items
4. The cart icon in the header shows the number of items

### Cart Drawer

The cart drawer appears on the right side when you add an item or click the cart icon:
- **Item list** — Product image, name, price, quantity
- **Quantity controls** — Use +/- to adjust
- **Remove** — Click the trash icon to remove an item
- **Free shipping bar** — Shows progress toward free shipping (₹1,500)
- **Subtotal** — Total before shipping and discounts
- **View Cart** — Go to the full cart page
- **Checkout** — Proceed directly to checkout

### Cart Page (`/cart`)

A full-page view of your cart with the same features plus:
- Detailed price breakdown
- Continue Shopping link
- Proceed to Checkout button

### Shipping

| Cart Value | Shipping Charge |
|-----------|----------------|
| Below ₹1,500 | ₹99 |
| ₹1,500 and above | **FREE** 🎉 |

---

## Checkout & Payment

**Route:** `/checkout` (login required)

### Step-by-Step Checkout:

#### Step 1: Select Delivery Address

- Choose from your **saved addresses**, or
- Click **"Add New Address"** and fill in:
  - Full Name
  - Phone Number
  - Address Line 1 (House/Flat/Building)
  - Address Line 2 (Street/Area) — optional
  - City
  - State (dropdown of all Indian states)
  - PIN Code (6 digits)
  - Label (Home / Work / Other)

#### Step 2: Apply Coupon (Optional)

1. Enter your coupon code in the **"Coupon Code"** field
2. Click **"Apply"**
3. If valid, the discount appears in the order summary
4. If invalid, you'll see an error message explaining why

**Sample coupons (from seed data):**
| Code | Discount |
|------|---------|
| `WELCOME10` | 10% off (max ₹200), min order ₹500 |
| `FLAT200` | Flat ₹200 off, min order ₹1,000 |
| `SILK15` | 15% off (max ₹400), min order ₹800 |
| `FESTIVAL20` | 20% off (max ₹600), min order ₹1,000 |

#### Step 3: Choose Payment Method

**Option A — Prepaid (Online Payment):**
1. Select **"Pay Online"**
2. Click **"Place Order"**
3. Razorpay payment modal opens
4. Choose: UPI, Credit/Debit Card, Net Banking, or Wallet
5. Complete the payment
6. You're redirected to the order confirmation page

**Option B — Cash on Delivery (COD):**
1. Select **"Cash on Delivery"**
2. Click **"Place Order"**
3. Your order is placed immediately (payment collected on delivery)
4. You're redirected to the order confirmation page

> **Note:** COD is only available for products marked as COD-eligible.

#### Order Summary

Before placing the order, review:
- Items with quantities and prices
- Subtotal
- Shipping charge (or "Free")
- Coupon discount (if applied)
- **Total Amount**

### Order Confirmation

After successful order placement:
- You see a confirmation page with your **order number** (e.g., `KPT-20260225-A1B2C`)
- WhatsApp button to message the store about your order
- Link to view order details

---

## Tracking Your Orders

### Order History

**Route:** `/orders` (login required)

View all your past and current orders:
- Order number
- Date placed
- Total amount
- Status badge (color-coded)

### Order Detail

**Route:** `/orders/[id]`

Click any order to see full details:

| Section | Details |
|---------|---------|
| **Status** | Current order status with visual timeline |
| **Items** | Product images, names, quantities, prices |
| **Shipping Address** | Delivery address |
| **Payment** | Method, status, transaction ID |
| **Tracking** | Courier tracking number (when shipped) |
| **Invoice** | Download PDF invoice button |
| **Support** | WhatsApp link to ask about this order |

### Understanding Order Statuses

| Status | What it means | What to expect |
|--------|--------------|----------------|
| 🟡 **Pending** | Order received, awaiting confirmation | Store will review soon |
| 🔵 **Confirmed** | Order accepted by the store | Preparation will begin |
| 🟠 **Processing** | Order being prepared/packed | Almost ready to ship |
| 📦 **Packed** | Order packed and ready | Will be shipped soon |
| 🚚 **Shipped** | Handed to delivery partner | Check tracking number |
| ✅ **Delivered** | Successfully delivered to you | Enjoy your saree! |
| ❌ **Cancelled** | Order was cancelled | Refund if prepaid |
| 💰 **Refunded** | Payment has been refunded | Check your account |

---

## Managing Your Account

### Profile Page

**Route:** `/account` (login required)

View your account details:
- Name
- Phone number
- Email (if provided)

Quick links to:
- My Orders
- My Addresses
- Wishlist
- Notifications

### Logging Out

1. Click the **user icon** in the header
2. Click **"Logout"**
3. Your session is cleared

---

## Managing Addresses

**Route:** `/addresses` (login required)

### Adding a New Address

1. Go to **Addresses** → **"Add New Address"**
2. Fill in all fields:
   - Label (Home / Work / Other)
   - Full Name
   - Phone Number
   - Address Line 1
   - Address Line 2 (optional)
   - City
   - State (select from dropdown)
   - PIN Code (6 digits)
3. Toggle **"Set as Default"** if this should be your primary address
4. Click **"Save Address"**

### Editing an Address

1. On the addresses page, click **"Edit"** on any address
2. Update the fields
3. Click **"Save"**

### Deleting an Address

1. Click **"Delete"** on the address
2. Confirm the deletion

### Default Address

- Mark one address as **default** — it will be pre-selected during checkout
- You can change the default at any time

---

## Notifications

**Route:** `/notifications` (login required)

### Notification Bell

- The **bell icon** in the header shows your unread notification count
- Click it to go to the notifications page

### Notification Types

| Type | When you receive it |
|------|-------------------|
| Order Confirmed | When your order is confirmed by the store |
| Order Shipped | When your order is shipped (includes tracking info) |
| Order Delivered | When your order is marked as delivered |
| Order Cancelled | If your order is cancelled |

### Managing Notifications

- Click a notification to view details (links to the relevant order)
- Click **"Mark All as Read"** to clear the unread badge
- Notifications are stored permanently for your reference

---

## Writing Reviews

### How to Write a Review

1. Go to a **product page** you've purchased
2. Scroll down to the **"Reviews"** section
3. Click **"Write a Review"**
4. Select a **star rating** (1-5 stars)
5. Write your **review comment** (optional but appreciated!)
6. Click **"Submit Review"**

### Review Guidelines

- You must be **logged in** to write a review
- You can write **one review per product**
- Reviews are visible to all customers after submission
- Be honest and helpful in your feedback

---

## Downloading Invoices

### How to Download a PDF Invoice

1. Go to **My Orders** → click on an order
2. On the order detail page, click **"Download Invoice"**
3. A PDF file generates in your browser and downloads automatically

### Invoice Contents

- **Store Header:** Krishnapriya Textiles name, address, contact
- **Order Info:** Order number, date, payment method
- **Item Table:** Product names, SKUs, quantities, prices
- **Totals:** Subtotal, shipping, discount, grand total
- **Footer:** Contact info for queries

---

## Contacting the Store

### Contact Page (`/contact`)

1. Go to **"Contact"** in the footer or navigation
2. Fill in the contact form:
   - Name
   - Phone number
   - Email (optional)
   - Subject
   - Message
3. Click **"Send Message"**
4. The store will respond via phone or WhatsApp

### WhatsApp (Fastest)

- Click the **floating green WhatsApp button** (bottom-right corner of any page)
- Or click **"Ask on WhatsApp"** on any product page
- Messages are sent directly to the store WhatsApp number: **9108455006**

### Direct Contact

| Method | Details |
|--------|---------|
| **Phone** | +91 91084 55006 |
| **WhatsApp** | 9108455006 |
| **Email** | info@krishnapriyatextiles.com |
| **Visit** | Shidling Complex, Opposite Bus Stand, Hubli Road, Shirahatti 582120 |

### Google Maps

The contact page includes an **embedded Google Map** showing the store location. Click **"Open in Google Maps"** for navigation directions.

---

## Saree Guide

**Route:** `/saree-guide`

A helpful guide for saree enthusiasts:

| Section | What you'll learn |
|---------|------------------|
| **Fabric Guide** | Characteristics of all 12 fabric types (Silk, Cotton, Banarasi, etc.) |
| **Occasion Guide** | Which saree suits weddings, festivals, daily wear, parties, etc. |
| **Size Guide** | Understanding saree length and width measurements |
| **Draping Tips** | Different styles of draping sarees |
| **Care Instructions** | How to wash, store, and maintain your sarees |

---

## Installing as App (PWA)

Krishnapriya Textiles can be installed as an app on your phone!

### On Android (Chrome)

1. Open the website in **Chrome**
2. Tap the **⋮** menu (three dots)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Install"** on the prompt
5. The app icon appears on your home screen

### On iPhone (Safari)

1. Open the website in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon appears on your home screen

### Benefits of Installing

- **Quick access** — Open directly from home screen
- **Full screen** — No browser toolbar, feels like a native app
- **Offline access** — Browse cached pages even without internet
- **Faster loading** — Cached resources load instantly
