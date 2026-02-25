# Setup Guide — Krishnapriya Textiles

Complete guide to setting up the project for local development.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [External Services Setup](#external-services-setup)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Verifying the Setup](#verifying-the-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** | 9.x or higher | Package manager (comes with Node.js) |
| **Git** | 2.x | Version control |

No local PostgreSQL installation is needed — we use [Neon](https://neon.tech), a serverless Postgres provider.

---

## External Services Setup

You need accounts on these services (all have free tiers):

### 1. Neon (Database)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (choose a region close to your users, e.g., `ap-south-1` for India)
3. Once created, copy the connection strings:
   - **Pooled connection string** → for `DATABASE_URL`
   - **Direct connection string** → for `DIRECT_DATABASE_URL`
4. Both strings look like: `postgresql://user:password@host/dbname?sslmode=require`

### 2. MSG91 (SMS OTP)

1. Go to [msg91.com](https://msg91.com) and sign up
2. Navigate to **Dashboard → OTP → Settings**
3. Create an OTP template with a 6-digit numeric OTP
4. Note down:
   - **Auth Key** → for `MSG91_AUTH_KEY`
   - **Template ID** → for `MSG91_TEMPLATE_ID`

> **Dev Mode:** In development (`NODE_ENV=development`), OTPs are printed to the console instead of being sent via SMS. You can use any 6-digit code if verification is mocked.

### 3. Razorpay (Payments)

1. Go to [razorpay.com](https://razorpay.com) and create a test account
2. Navigate to **Settings → API Keys → Generate Test Key**
3. Note down:
   - **Key ID** (starts with `rzp_test_`) → for `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → for `RAZORPAY_KEY_SECRET`
4. For webhooks:
   - Go to **Settings → Webhooks → Add New Webhook**
   - URL: `https://your-domain.com/api/razorpay/webhook`
   - Events: Check `payment.captured` and `payment.failed`
   - Create a webhook secret → for `RAZORPAY_WEBHOOK_SECRET`

### 4. Cloudinary (Image CDN)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier: 25GB)
2. From the **Dashboard**, note down:
   - **Cloud Name** → for `CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → for `CLOUDINARY_API_KEY`
   - **API Secret** → for `CLOUDINARY_API_SECRET`
3. (Optional) Create an upload preset named `krishnapriya-textiles` for organized uploads

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd krishnapriya-textiles

# 2. Install dependencies
npm install
```

This installs all packages including Next.js, Prisma, Tailwind CSS, shadcn/ui components, and all other dependencies.

---

## Environment Configuration

### Step 1: Create env file

```bash
cp .env.example .env.local
```

### Step 2: Fill in all variables

Open `.env.local` and provide values for each variable:

```env
# ──────────────────────────────────────
# DATABASE (Neon PostgreSQL)
# ──────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# ──────────────────────────────────────
# AUTH (JWT)
# ──────────────────────────────────────
JWT_SECRET="your-secret-key-at-least-32-characters-long"

# ──────────────────────────────────────
# SMS (MSG91)
# ──────────────────────────────────────
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_TEMPLATE_ID="your-msg91-template-id"

# ──────────────────────────────────────
# PAYMENTS (Razorpay)
# ──────────────────────────────────────
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"

# ──────────────────────────────────────
# IMAGES (Cloudinary)
# ──────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# ──────────────────────────────────────
# APP
# ──────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon pooled connection (used at runtime) |
| `DIRECT_DATABASE_URL` | Yes | Neon direct connection (used for migrations) |
| `JWT_SECRET` | Yes | Min 32 characters for HMAC-SHA256 signing |
| `MSG91_AUTH_KEY` | Yes | MSG91 SMS gateway auth key |
| `MSG91_TEMPLATE_ID` | Yes | MSG91 OTP message template ID |
| `RAZORPAY_KEY_ID` | Yes | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signature verification |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Same as RAZORPAY_KEY_ID (exposed to browser) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Same as CLOUDINARY_CLOUD_NAME (exposed to browser) |
| `NEXT_PUBLIC_APP_URL` | No | Base URL (defaults to `http://localhost:3000`) |
| `NODE_ENV` | No | `development`, `production`, or `test` |
| `SKIP_ENV_VALIDATION` | No | Set to `true` to skip env checks at build time |

---

## Database Setup

### Step 1: Generate Prisma Client

```bash
npm run db:generate
```

This generates the TypeScript Prisma Client from `prisma/schema.prisma`.

### Step 2: Push Schema to Database

```bash
npm run db:push
```

This creates all 18 tables and their relationships in your Neon database. Use this for initial setup and development.

> For production with migration tracking, use `npm run db:migrate` instead.

### Step 3: Seed Sample Data

```bash
npm run db:seed
```

This populates your database with:
- **1 Admin user** — Phone: `9108455006`, Name: "Puneet Shidling", Role: ADMIN
- **8 Categories** — Mysore Silk, Kanchipuram, Banarasi, Cotton, Chiffon, Georgette, Linen, Organza
- **24 Sample products** — 3 sarees per category with images, prices, and full details
- **4 Coupons** — WELCOME10 (10% off), FLAT200 (₹200 off), SILK15 (15% off silk), FESTIVAL20 (20% off)
- **3 Testimonials** — Sample customer reviews
- **2 Banners** — Homepage sliding banners
- **4 Instagram videos** — Sample reel URLs
- **Store settings** — Phone, email, GST number, shipping configuration

### Step 4: (Optional) Explore with Prisma Studio

```bash
npm run db:studio
```

Opens a visual database browser at `http://localhost:5555` where you can view and edit data directly.

---

## Running the Application

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:3000](http://localhost:3000) with:
- **Hot reload** via Turbopack (instant file changes)
- **Console OTP** — OTPs printed to terminal instead of SMS
- **Error overlay** — Detailed error display in browser

### Production Build

```bash
# Build
npm run build

# If you encounter memory issues on Windows:
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Start production server
npm run start
```

---

## Verifying the Setup

After starting the dev server, verify everything works:

### 1. Homepage
- Open [http://localhost:3000](http://localhost:3000)
- You should see the full homepage with hero banner, products, and categories

### 2. Product Catalog
- Click any product or go to `/products`
- Verify images load from Cloudinary
- Test filters and search

### 3. Authentication
- Click "Login" in the header
- Enter phone number `9108455006`
- Check your terminal for the OTP (printed in console during development)
- Enter the OTP to log in

### 4. Admin Panel
- After logging in with `9108455006`, go to `/admin`
- You should see the dashboard with stats
- Try navigating to Products, Orders, etc.

### 5. Cart & Checkout
- Add a product to cart
- Go to checkout
- Test with Razorpay test credentials (use test card `4111 1111 1111 1111`)

---

## Troubleshooting

### Build fails with memory error
```bash
# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Mac/Linux
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Prisma Client not found
```bash
npm run db:generate
```

### Database connection error
- Verify `DATABASE_URL` in `.env.local`
- Ensure Neon project is active and not paused
- Check that `?sslmode=require` is at the end of the URL

### OTP not received
- In development, OTPs are logged to the terminal — check your console
- In production, verify MSG91 credentials and template ID
- Check MSG91 dashboard for delivery logs

### Images not loading
- Verify Cloudinary cloud name in both server and public env variables
- Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches `CLOUDINARY_CLOUD_NAME`
- Check that images are uploaded to the correct cloud

### Payments failing
- In test mode, use Razorpay test keys (starting with `rzp_test_`)
- Test card: `4111 1111 1111 1111`, any future expiry, any CVV
- Test UPI ID: `success@razorpay` for successful payment

### Hydration mismatch errors
```bash
# Clear the Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

### TypeScript errors after pulling changes
```bash
npm run db:generate    # Regenerate Prisma client types
# In VS Code: Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server"
```
