# Admin Guide — Krishnapriya Textiles

Complete guide for managing the store through the admin panel.

---

## Table of Contents

- [Accessing the Admin Panel](#accessing-the-admin-panel)
- [Dashboard Overview](#dashboard-overview)
- [Managing Products](#managing-products)
- [Managing Orders](#managing-orders)
- [Managing Customers](#managing-customers)
- [Managing Coupons](#managing-coupons)
- [Inventory Monitoring](#inventory-monitoring)
- [Sales Reports](#sales-reports)
- [Bulk Product Import](#bulk-product-import)
- [Export Orders to Excel](#export-orders-to-excel)
- [Managing Banners](#managing-banners)
- [Managing Testimonials](#managing-testimonials)
- [Managing Instagram Videos](#managing-instagram-videos)
- [Contact Messages](#contact-messages)
- [Site Images](#site-images)
- [Store Settings](#store-settings)

---

## Accessing the Admin Panel

1. Go to the website and click **"Login"** in the header
2. Enter the admin phone number: **9108455006**
3. Enter the OTP received via SMS
4. Once logged in, click the **user icon** in the header → **"Admin Panel"**
5. Or navigate directly to `/admin`

> **Security:** The admin panel is protected by both middleware (route-level) and layout-level role checks. Only users with `ADMIN` role can access it.

---

## Dashboard Overview

**Route:** `/admin`

The dashboard gives you a quick overview of your store:

### Stats Cards
| Card | What it shows |
|------|--------------|
| **Total Revenue** | Sum of all paid order amounts |
| **Total Orders** | Count of all orders placed |
| **Total Customers** | Count of registered users |
| **Total Products** | Count of active products |

### Quick Actions
Quick-access buttons to common tasks:
- Add New Product
- View Orders
- Check Inventory
- View Reports

### Recent Orders
A table showing the 5 most recent orders with:
- Order number
- Customer name
- Amount
- Status (color-coded badge)
- Date

---

## Managing Products

### Viewing Products

**Route:** `/admin/products`

- **Search:** Type in the search box to filter by product name
- **Pagination:** Navigate through pages of products (20 per page)
- Each row shows: Thumbnail, Name, SKU, Price, Stock, Status

### Creating a Product

**Route:** `/admin/products/new`

**How to create a new saree:**

1. Click **"Add Product"** button on the products list page
2. Fill in the product form:

**Basic Information:**
| Field | Description | Required |
|-------|------------|----------|
| Name | Product name (e.g., "Royal Blue Mysore Silk Saree") | Yes |
| Slug | URL-friendly name (auto-generated from name) | Auto |
| SKU | Stock Keeping Unit (auto-generated) | Auto |
| Short Description | Brief one-line description | No |
| Description | Full detailed description | Yes |

**Category & Classification:**
| Field | Description | Required |
|-------|------------|----------|
| Category | Select from existing categories | Yes |
| Fabric | Silk, Cotton, Banarasi, Chiffon, etc. (12 options) | Yes |
| Occasion | Wedding, Festive, Daily, Party, etc. (multi-select) | Yes |

**Pricing:**
| Field | Description | Required |
|-------|------------|----------|
| Price (₹) | Selling price | Yes |
| Compare at Price (₹) | Original/MRP price (shows "X% off" badge) | No |
| Cost Price (₹) | Your purchase cost (internal, not shown to customers) | No |

**Saree Specifications:**
| Field | Description | Required |
|-------|------------|----------|
| Color | Saree color | No |
| Length (m) | Total saree length in meters | No |
| Width (m) | Saree width in meters | No |
| Weight (g) | Saree weight in grams | No |
| Zari Type | Gold, Silver, Copper, None, etc. | No |
| Border Type | Description of the border design | No |
| Pallu Detail | Description of the pallu design | No |
| Wash Care | Care instructions | No |
| Blouse Included | Toggle: is blouse piece included? | No |
| Blouse Length (m) | If blouse is included, its length | No |

**Inventory:**
| Field | Description | Required |
|-------|------------|----------|
| Stock | Number of units available | Yes |
| Low Stock Threshold | Alert when stock falls below this number | No |
| Track Inventory | Whether to track/decrement stock on orders | No |

**Flags:**
| Flag | Effect |
|------|--------|
| Active | Product visible on storefront |
| Featured | Shows in "Featured Products" on homepage |
| New Arrival | Shows in "New Arrivals" on homepage |
| COD Available | Shows "COD Available" badge on product |

**Images:**
- Click the image upload area to add product images
- Upload multiple images (they go to Cloudinary)
- Drag to reorder — first image becomes the main thumbnail
- Click × to remove an image

**SEO:**
| Field | Description |
|-------|------------|
| Meta Title | Custom page title for search engines |
| Meta Description | Custom description for search results |

3. Click **"Create Product"** to save

### Editing a Product

1. On the products list, click a product row or the edit icon
2. The same form appears pre-filled with current values
3. Make changes and click **"Update Product"**

### Deleting a Product

1. Click the delete icon on a product row
2. A confirmation dialog appears — click **"Delete"** to confirm
3. The product is permanently removed

> **Note:** Deleting a product does not affect existing orders that contain it.

---

## Managing Orders

### Viewing Orders

**Route:** `/admin/orders`

- **Search:** Filter by order number or customer name
- **Status Filter:** Filter by order status (Pending, Confirmed, Shipped, etc.)
- **Pagination:** 20 orders per page

### Understanding Order Statuses

| Status | Meaning | What to do |
|--------|---------|------------|
| **Pending** | Order placed, awaiting confirmation | Review and confirm |
| **Confirmed** | Order accepted | Start processing |
| **Processing** | Order being prepared | Pack the order |
| **Packed** | Order packed and ready | Hand to courier |
| **Shipped** | Handed to courier | Add tracking number |
| **Delivered** | Customer received the order | Complete |
| **Cancelled** | Order cancelled | No action needed |
| **Refunded** | Payment refunded | No action needed |

### Updating Order Status

1. Go to `/admin/orders` and click on an order
2. Or directly update the status dropdown in the order list
3. Select the new status from the dropdown
4. If marking as "Shipped", enter the courier tracking number
5. The customer receives an in-app notification automatically

**Valid Status Transitions:**
```
Pending → Confirmed → Processing → Packed → Shipped → Delivered
     \                                                    /
      → Cancelled ← (from any status before Delivered)
                          → Refunded (from Delivered/Cancelled)
```

### Order Detail Page

**Route:** `/admin/orders/[id]`

Shows complete order information:
- **Items:** Product images, names, quantities, prices
- **Shipping Address:** Full delivery address
- **Payment:** Method (Prepaid/COD), status, Razorpay payment ID
- **Timeline:** History of status changes
- **Notes:** Customer note, admin note
- **Coupon:** Applied coupon code and discount

---

## Managing Customers

**Route:** `/admin/customers`

View all registered customers with:
- **Name & Phone** — Customer details
- **Orders** — Total number of orders
- **Lifetime Value** — Total amount spent
- **Joined** — Registration date
- **Search** — Filter by name or phone

> Customers are automatically created when they log in with their phone number for the first time.

---

## Managing Coupons

### Creating a Coupon

**Route:** `/admin/coupons/new`

1. Click **"Add Coupon"** from the coupons page
2. Fill in:

| Field | Description | Example |
|-------|------------|---------|
| Code | Unique coupon code (uppercase) | `DIWALI25` |
| Description | What this coupon is for | "Diwali Sale - 25% off" |
| Discount Type | `Percentage` or `Flat` | Percentage |
| Discount Value | Amount (% or ₹) | 25 |
| Min Order Amount | Minimum cart value to apply | ₹1,000 |
| Max Discount | Cap on discount for % coupons | ₹500 |
| Usage Limit | Max total uses across all customers | 100 |
| Per User Limit | Max uses per customer | 1 |
| Valid From | Start date | 2026-10-01 |
| Valid Until | End date (optional) | 2026-10-31 |
| Active | Enable/disable | Yes |

3. Click **"Create Coupon"**

### Example Coupon Setups

**10% Welcome Discount:**
- Code: `WELCOME10`, Type: Percentage, Value: 10, Min Order: ₹500, Max Discount: ₹200, Per User: 1

**Flat ₹200 Off:**
- Code: `FLAT200`, Type: Flat, Value: 200, Min Order: ₹1,000

**Limited Time Festival Sale:**
- Code: `FESTIVAL20`, Type: Percentage, Value: 20, Valid From: Oct 1, Valid Until: Oct 31, Usage Limit: 500

---

## Inventory Monitoring

**Route:** `/admin/inventory`

### Out of Stock Products
- Lists all products with **0 stock**
- Click the product name to go to the edit page and restock

### Low Stock Products
- Lists products where **current stock ≤ low stock threshold**
- Shows current stock vs. threshold

### WhatsApp Alert

Click the **"Send WhatsApp Alert"** button to:
1. Generate a message listing all low-stock products with their quantities
2. Open WhatsApp with the message pre-filled
3. Send it to yourself for quick reference

---

## Sales Reports

**Route:** `/admin/reports`

### Revenue Chart
- **Monthly View:** Bar chart showing revenue per month
- **Weekly View:** Bar chart showing revenue per week
- Toggle between views with the period selector

### Top Selling Products
- Table showing products ranked by units sold
- Columns: Product name, Units sold, Revenue generated

---

## Bulk Product Import

**Route:** `/admin/bulk-import`

**How to import products in bulk:**

1. Go to `/admin/bulk-import`
2. Prepare your product data (matching the required format)
3. Paste or upload the data
4. Click **"Import"**
5. The system validates each product and reports:
   - ✅ Successfully imported products
   - ❌ Failed rows with error reasons (e.g., missing required fields, invalid fabric type)

**Required fields per product:** Name, Description, Price, Stock, Fabric, Occasion, Category

---

## Export Orders to Excel

**Available on:** `/admin/orders`

1. Click the **"Export to Excel"** button on the orders page
2. An `.xlsx` file downloads containing all orders with:
   - Order Number
   - Customer Name & Phone
   - Items (product names, quantities)
   - Subtotal, Shipping, Discount, Total
   - Payment Method & Status
   - Order Status
   - Dates (placed, shipped, delivered)
   - Shipping Address

Use this for bookkeeping, GST filing, or courier management.

---

## Managing Banners

**Route:** `/admin/banners`

### Creating a Banner

1. Click **"Add Banner"**
2. Fill in:
   - **Title** — Main text on the banner
   - **Subtitle** — Secondary text (optional)
   - **Image** — Upload banner image (desktop size, recommended 1920×600)
   - **Mobile Image** — Separate image for mobile (optional, recommended 800×800)
   - **Link** — Where clicking the banner goes (e.g., `/products?fabric=SILK`)
   - **Position** — Display order (lower = first)
   - **Start Date** — When to start showing
   - **End Date** — When to stop showing (optional)
   - **Active** — Enable/disable

### Tips
- Keep 2-3 active banners for a dynamic homepage
- Use high-quality images (compress before upload for faster loading)
- Link banners to relevant product/category pages

---

## Managing Testimonials

**Route:** `/admin/testimonials`

### Creating a Testimonial

1. Click **"Add Testimonial"**
2. Fill in:
   - **Customer Name** — Who gave the review
   - **Location** — City/town (optional)
   - **Content** — The review text
   - **Rating** — Click stars to set rating (1-5)
   - **Image** — Customer photo (optional)
   - **Active** — Show on homepage
   - **Position** — Display order

### Tips
- Use real customer feedback (with permission)
- 4-5 active testimonials works well
- Include location for authenticity

---

## Managing Instagram Videos

**Route:** `/admin/instagram`

### Adding a Video

1. Click **"Add Video"**
2. Enter:
   - **URL** — Full Instagram reel/video URL (e.g., `https://www.instagram.com/reel/xxxxx/`)
   - **Title** — Description text
   - **Active** — Show on homepage
   - **Position** — Display order

### Tips
- Instagram reels of saree styling, draping, or new arrivals work best
- Keep 3-6 active videos
- Videos are embedded directly from Instagram

---

## Contact Messages

**Route:** `/admin/messages`

- **Inbox View:** See all messages from the Contact Us form
- **Unread Indicator:** Bold text for unread messages
- **Mark as Read:** Click the message to mark it as read
- **Delete:** Remove messages you've handled
- **Details:** View customer name, phone, email, subject, and full message

### Best Practice
Check messages daily. Respond to customer inquiries via phone or WhatsApp using the contact details they provided.

---

## Site Images

**Route:** `/admin/site-images`

Manage key images used across the website:

| Image Type | Where it appears |
|-----------|-----------------|
| Hero Background | Homepage hero section |
| About Image | About Us page |
| OG Image | Social media sharing preview |

Upload images via the Cloudinary uploader. Changes take effect immediately.

---

## Store Settings

**Route:** `/admin/settings`

View the current store configuration:
- Store Name
- Phone Number
- Email
- WhatsApp Number
- Address
- Shipping Configuration
- Social Media Links

> **Note:** Settings are configured in `src/config/site.ts`. To change them, edit the source file and redeploy.
