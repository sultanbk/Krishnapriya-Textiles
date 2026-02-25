# API Reference — Krishnapriya Textiles

Complete reference for all REST API endpoints and Server Actions.

---

## Table of Contents

- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
  - [Contact](#contact)
  - [Reviews](#reviews)
  - [Coupons](#coupons)
  - [Orders](#orders)
  - [Addresses](#addresses)
  - [Cart](#cart)
  - [Razorpay Webhook](#razorpay-webhook)
- [Admin Endpoints](#admin-endpoints)
  - [Products](#admin--products)
  - [Bulk Import](#admin--bulk-import)
  - [Orders (Admin)](#admin--orders)
  - [Banners](#admin--banners)
  - [Coupons (Admin)](#admin--coupons)
  - [Testimonials](#admin--testimonials)
  - [Instagram](#admin--instagram)
  - [Messages](#admin--messages)
  - [Site Images](#admin--site-images)
  - [Upload](#admin--upload)
- [Server Actions](#server-actions)
  - [Auth Actions](#auth-actions)
  - [Cart Actions](#cart-actions)
  - [Checkout Actions](#checkout-actions)
  - [Product Actions](#product-actions)
  - [Notification Actions](#notification-actions)

---

## Authentication

All endpoints use JWT-based session authentication via httpOnly cookies.

- **Cookie Name:** `kpt-session`
- **Token Format:** JWT signed with HS256
- **Token Payload:** `{ userId: string, phone: string, role: "USER" | "ADMIN" }`
- **Expiry:** 30 days

### How Authentication Works

1. User logs in via Server Action (phone OTP)
2. JWT token is set as an httpOnly cookie
3. API routes extract the session via `getSession()` from `src/lib/auth.ts`
4. Admin routes additionally check `session.role === "ADMIN"`
5. Middleware protects routes at the edge layer before they reach the API

### Auth-Required Endpoints

Endpoints marked with 🔒 require a valid session cookie.  
Endpoints marked with 🔐 require ADMIN role.

---

## Public Endpoints

### Contact

#### `POST /api/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",    // optional
  "subject": "Product Inquiry",
  "message": "I'd like to know about your Mysore Silk collection."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

### Reviews

#### `GET /api/reviews?productId={id}`

Get all visible reviews for a product with average rating stats.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | string | Yes | Product UUID |

**Response:** `200 OK`
```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Beautiful saree, exactly as shown!",
      "createdAt": "2026-01-15T10:30:00Z",
      "user": {
        "name": "Priya S.",
        "phone": "98****3210"
      }
    }
  ],
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 12,
    "distribution": { "5": 6, "4": 3, "3": 2, "2": 1, "1": 0 }
  }
}
```

#### `POST /api/reviews` 🔒

Submit a product review (one per user per product).

**Request Body:**
```json
{
  "productId": "uuid",
  "rating": 5,
  "comment": "Loved the quality!"  // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "review": { "id": "uuid", "rating": 5, "comment": "..." }
}
```

**Errors:**
- `401` — Not authenticated
- `409` — Already reviewed this product

---

### Coupons

#### `POST /api/coupons/check`

Validate a coupon code and calculate the discount.

**Request Body:**
```json
{
  "code": "WELCOME10",
  "cartTotal": 2500
}
```

**Response:** `200 OK`
```json
{
  "valid": true,
  "coupon": {
    "code": "WELCOME10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "maxDiscount": 200
  },
  "discount": 200,
  "message": "Coupon applied! You save ₹200"
}
```

**Errors:**
- `400` — Invalid/expired coupon, minimum order not met, usage limit reached

---

### Orders

#### `POST /api/orders` 🔒

Create a new order.

**Request Body:**
```json
{
  "addressId": "uuid",
  "paymentMethod": "PREPAID",   // "PREPAID" or "COD"
  "couponCode": "WELCOME10",   // optional
  "customerNote": "Please gift wrap"  // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "orderNumber": "KPT-20260225-A1B2C",
    "totalAmount": 2300,
    "paymentMethod": "PREPAID",
    "razorpayOrderId": "order_xxxxx"  // only for PREPAID
  }
}
```

**Process:**
1. Validates stock availability for all items
2. Decrements stock from products
3. Creates inventory logs
4. Increments coupon usage count (if used)
5. Creates Razorpay order (if PREPAID)
6. Clears the user's cart

#### `POST /api/orders/verify-payment` 🔒

Verify Razorpay payment signature after client-side checkout.

**Request Body:**
```json
{
  "orderId": "uuid",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx",
  "razorpaySignature": "signature_string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "order": { "id": "uuid", "paymentStatus": "PAID" }
}
```

#### `GET /api/orders/{id}/invoice` 🔒

Get invoice data for PDF generation (order owner or admin).

**Response:** `200 OK`
```json
{
  "order": {
    "orderNumber": "KPT-20260225-A1B2C",
    "items": [...],
    "subtotal": 2500,
    "shipping": 0,
    "discount": 200,
    "totalAmount": 2300,
    "shippingAddress": {...},
    "paymentMethod": "PREPAID",
    "createdAt": "2026-02-25T..."
  }
}
```

---

### Addresses

#### `GET /api/addresses` 🔒

List all addresses for the authenticated user.

**Response:** `200 OK`
```json
{
  "addresses": [
    {
      "id": "uuid",
      "label": "Home",
      "fullName": "Priya Sharma",
      "phone": "9876543210",
      "line1": "123, MG Road",
      "line2": "Near Central Mall",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "isDefault": true
    }
  ]
}
```

#### `POST /api/addresses` 🔒

Create a new address.

**Request Body:**
```json
{
  "label": "Home",
  "fullName": "Priya Sharma",
  "phone": "9876543210",
  "line1": "123, MG Road",
  "line2": "Near Central Mall",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "isDefault": false
}
```

**Response:** `201 Created`

#### `GET /api/addresses/{id}` 🔒

Get a specific address.

#### `PUT /api/addresses/{id}` 🔒

Update an address. Same body as POST.

#### `DELETE /api/addresses/{id}` 🔒

Delete an address.

---

### Cart

#### `POST /api/cart/sync` 🔒

Sync client-side cart items to the database before checkout.

**Request Body:**
```json
{
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "cart": {
    "id": "uuid",
    "items": [...]
  }
}
```

---

### Razorpay Webhook

#### `POST /api/razorpay/webhook`

Handles Razorpay server-to-server webhook events.

**Verification:** HMAC-SHA256 signature verification using `RAZORPAY_WEBHOOK_SECRET`.

**Handled Events:**
| Event | Action |
|-------|--------|
| `payment.captured` | Updates order paymentStatus to `PAID`, sets `paidAt` |
| `payment.failed` | Updates order paymentStatus to `FAILED` |

**Response:** `200 OK` (always, to acknowledge receipt)

---

## Admin Endpoints

All admin endpoints require `ADMIN` role. The middleware checks `session.role === "ADMIN"`.

### Admin — Products

#### `POST /api/admin/products` 🔐

Create a new product.

**Request Body:**
```json
{
  "name": "Royal Blue Kanchipuram Silk Saree",
  "description": "Handwoven pure silk saree...",
  "shortDescription": "Premium Kanchipuram silk",
  "price": 8999,
  "compareAtPrice": 12000,
  "costPrice": 5000,
  "stock": 10,
  "lowStockThreshold": 3,
  "trackInventory": true,
  "fabric": "KANCHIPURAM",
  "occasion": ["WEDDING", "FESTIVE"],
  "categoryId": "uuid",
  "color": "Royal Blue",
  "length": 6.3,
  "width": 1.15,
  "weight": 650,
  "blouseIncluded": true,
  "blouseLength": 0.8,
  "borderType": "Gold Zari Border",
  "palluDetail": "Rich Pallu with Temple Motifs",
  "washCare": "Dry clean only",
  "zariType": "Gold",
  "isActive": true,
  "isFeatured": false,
  "isNewArrival": true,
  "codAvailable": true,
  "metaTitle": "Royal Blue Kanchipuram Silk Saree",
  "metaDescription": "Buy premium Kanchipuram silk...",
  "images": [
    { "url": "https://res.cloudinary.com/...", "publicId": "...", "alt": "Front view" }
  ]
}
```

**Response:** `201 Created`

#### `GET /api/admin/products/{id}` 🔐

Get full product details for editing.

#### `PUT /api/admin/products/{id}` 🔐

Update a product. Same body as POST.

#### `DELETE /api/admin/products/{id}` 🔐

Delete a product.

---

### Admin — Bulk Import

#### `POST /api/admin/products/bulk-import` 🔐

Import multiple products at once.

**Request Body:**
```json
{
  "products": [
    {
      "name": "Product 1",
      "description": "...",
      "price": 2999,
      "stock": 15,
      "fabric": "SILK",
      "occasion": ["WEDDING"],
      "categoryId": "uuid"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "imported": 10,
  "failed": 2,
  "errors": [
    { "row": 3, "error": "Missing required field: description" },
    { "row": 7, "error": "Invalid fabric type: SATIN" }
  ]
}
```

---

### Admin — Orders

#### `GET /api/admin/orders/export` 🔐

Export all orders as an Excel (.xlsx) file.

**Response:** Binary file download (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

**Excel Columns:**
Order Number, Customer Name, Phone, Items, Subtotal, Shipping, Discount, Total, Payment Method, Payment Status, Order Status, Tracking Number, Ordered Date, Shipped Date, Delivered Date, Shipping Address

#### `PATCH /api/admin/orders/{id}/status` 🔐

Update an order's status.

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "AWB123456789",  // optional, for SHIPPED status
  "adminNote": "Shipped via DTDC"     // optional
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "order": { "id": "uuid", "status": "SHIPPED", "trackingNumber": "AWB123456789" }
}
```

**Side Effects:**
- Creates a notification for the customer
- Sets `shippedAt` / `deliveredAt` / `cancelledAt` timestamps as appropriate

---

### Admin — Banners

#### `GET /api/admin/banners` 🔐

List all banners.

#### `POST /api/admin/banners` 🔐

Create a banner.

**Request Body:**
```json
{
  "title": "Grand Diwali Sale",
  "subtitle": "Up to 40% off on all silk sarees",
  "image": "https://res.cloudinary.com/...",
  "mobileImage": "https://res.cloudinary.com/...",
  "link": "/products?occasion=FESTIVE",
  "isActive": true,
  "position": 1,
  "startDate": "2026-10-01T00:00:00Z",
  "endDate": "2026-10-31T23:59:59Z"
}
```

#### `GET /api/admin/banners/{id}` 🔐

Get a single banner.

#### `PUT /api/admin/banners/{id}` 🔐

Update a banner (same body as POST).

#### `DELETE /api/admin/banners/{id}` 🔐

Delete a banner.

---

### Admin — Coupons

#### `GET /api/admin/coupons` 🔐

List all coupons.

#### `POST /api/admin/coupons` 🔐

Create a coupon.

**Request Body:**
```json
{
  "code": "DIWALI25",
  "description": "Diwali Special - 25% off",
  "discountType": "PERCENTAGE",
  "discountValue": 25,
  "minOrderAmount": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "perUserLimit": 1,
  "isActive": true,
  "validFrom": "2026-10-01T00:00:00Z",
  "validUntil": "2026-10-31T23:59:59Z"
}
```

#### `GET /api/admin/coupons/{id}` 🔐

Get a single coupon.

#### `PUT /api/admin/coupons/{id}` 🔐

Update a coupon.

#### `DELETE /api/admin/coupons/{id}` 🔐

Delete a coupon.

---

### Admin — Testimonials

#### `GET /api/admin/testimonials` 🔐

List all testimonials.

#### `POST /api/admin/testimonials` 🔐

Create a testimonial.

**Request Body:**
```json
{
  "customerName": "Meera Patel",
  "location": "Hubli",
  "content": "Beautiful saree! The quality is amazing.",
  "rating": 5,
  "image": "https://res.cloudinary.com/...",
  "isActive": true,
  "position": 1
}
```

#### `PUT /api/admin/testimonials/{id}` 🔐

Update a testimonial.

#### `DELETE /api/admin/testimonials/{id}` 🔐

Delete a testimonial.

---

### Admin — Instagram

#### `GET /api/admin/instagram` 🔐

List all Instagram videos.

#### `POST /api/admin/instagram` 🔐

Add an Instagram video.

**Request Body:**
```json
{
  "url": "https://www.instagram.com/reel/XXXXXX/",
  "title": "Silk Saree Draping Tutorial",
  "isActive": true,
  "position": 1
}
```

#### `PUT /api/admin/instagram/{id}` 🔐

Update video details.

#### `DELETE /api/admin/instagram/{id}` 🔐

Delete a video.

---

### Admin — Messages

#### `PATCH /api/admin/messages/{id}` 🔐

Mark a contact message as read.

**Request Body:**
```json
{ "isRead": true }
```

#### `DELETE /api/admin/messages/{id}` 🔐

Delete a contact message.

---

### Admin — Site Images

#### `GET /api/admin/site-images` 🔐

Get all site image settings.

**Response:**
```json
{
  "images": {
    "hero_image": "https://res.cloudinary.com/...",
    "about_image": "https://res.cloudinary.com/...",
    "og_image": "https://res.cloudinary.com/..."
  }
}
```

#### `POST /api/admin/site-images` 🔐

Update a site image.

**Request Body:**
```json
{
  "key": "hero_image",
  "value": "https://res.cloudinary.com/..."
}
```

---

### Admin — Upload

#### `POST /api/admin/upload` 🔐

Generate a Cloudinary upload signature for secure client-side uploads.

**Response:**
```json
{
  "signature": "xxxxx",
  "timestamp": 1700000000,
  "cloudName": "your-cloud",
  "apiKey": "your-key"
}
```

---

## Server Actions

Server Actions are async functions that run on the server, called directly from components. Located in `src/actions/`.

### Auth Actions

**File:** `src/actions/auth.ts`

#### `requestOtpAction(phone: string)`

Sends a 6-digit OTP to the given phone number.

**Returns:** `ActionResponse`
```ts
{ success: true, message: "OTP sent successfully" }
// or
{ success: false, error: "Too many attempts. Please wait 10 minutes." }
```

**Rate Limit:** Max 3 requests per phone per 10 minutes.

#### `verifyOtpAction(phone: string, otp: string)`

Verifies the OTP and creates a session.

**Returns:** `ActionResponse`
```ts
{ success: true, message: "Logged in successfully" }
// or
{ success: false, error: "Invalid or expired OTP" }
```

**Side Effects:** Sets `kpt-session` httpOnly cookie with JWT.

#### `logoutAction()`

Clears the session cookie.

---

### Cart Actions

**File:** `src/actions/cart.ts`

#### `addToCartAction(productId: string, quantity: number)`

Adds a product to the server-side cart.

#### `removeFromCartAction(cartItemId: string)`

Removes an item from the server-side cart.

#### `updateQuantityAction(cartItemId: string, quantity: number)`

Updates the quantity of a cart item.

#### `getCartAction()`

Returns the full cart with items, prices, and summary.

---

### Checkout Actions

**File:** `src/actions/checkout.ts`

#### `createOrderAction(data: CheckoutData)`

Creates a new order (used as an alternative to the API route).

#### `verifyPaymentAction(data: PaymentVerification)`

Verifies Razorpay payment signature.

#### `updateOrderStatusAction(orderId: string, status: OrderStatus)`

Updates order status (admin only).

---

### Product Actions

**File:** `src/actions/products.ts`

#### `getProducts(filters: ProductFilters)`

Fetch paginated products with optional filters.

**Parameters:**
```ts
{
  page?: number;           // Default: 1
  limit?: number;          // Default: 12
  search?: string;         // Search by name
  category?: string;       // Category slug
  fabric?: string[];       // Fabric types (multi-select)
  occasion?: string[];     // Occasion types (multi-select)
  minPrice?: number;       // Minimum price
  maxPrice?: number;       // Maximum price
  sort?: string;           // "newest" | "price_asc" | "price_desc" | "name_asc"
}
```

**Returns:** `PaginatedResult<ProductWithImages>`

#### `getProductBySlug(slug: string)`

Get full product details by slug.

#### `getFeaturedProducts(limit?: number)`

Get featured products (default: 8).

#### `getNewArrivals(limit?: number)`

Get new arrival products (default: 8).

#### `getBudgetProducts(limit?: number)`

Get budget-friendly products under ₹999 (default: 8).

#### `getCategories()`

Get all active categories sorted by `sortOrder`.

#### `getRelatedProducts(productId: string, categoryId: string, limit?: number)`

Get related products from the same category (default: 4).

---

### Notification Actions

**File:** `src/actions/notifications.ts`

#### `getUserNotifications()`

Get all notifications for the authenticated user.

#### `getUnreadNotificationCount()`

Get the count of unread notifications (used for the bell badge).

#### `markNotificationAsRead(id: string)`

Mark a single notification as read.

#### `markAllNotificationsAsRead()`

Mark all notifications as read.

#### `createOrderNotification(userId: string, orderId: string, type: string, title: string, message: string)`

Create a notification (called internally by order status updates).

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (not logged in) |
| `403` | Forbidden (insufficient role) |
| `404` | Not Found |
| `409` | Conflict (duplicate) |
| `429` | Rate Limited |
| `500` | Internal Server Error |

### Custom Error Classes

Defined in `src/lib/errors.ts`:

| Error Class | HTTP Code | Use Case |
|-------------|-----------|----------|
| `AppError` | varies | Base error class |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 400 | Invalid input data |
| `UnauthorizedError` | 401 | Not authenticated |
| `ForbiddenError` | 403 | Not authorized |
| `ConflictError` | 409 | Duplicate resource |
| `InsufficientStockError` | 400 | Not enough stock |
| `PaymentError` | 400 | Payment verification failed |
| `RateLimitError` | 429 | Too many requests |
