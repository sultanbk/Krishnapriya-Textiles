# 🛍️ Krishnapriya Textiles

A production-ready, full-stack ecommerce web application for **Krishnapriya Textiles** — a premium saree store in Shirahatti, Karnataka, India. Built with **Next.js 16**, TypeScript, Tailwind CSS v4, and PostgreSQL.

> **Owner:** Puneet Shidling | **Location:** Shidling Complex, Opposite Bus Stand, Hubli Road, Shirahatti 582120

---

## ✨ Highlights

- 🔐 **Passwordless Auth** — Phone OTP login via MSG91
- 💳 **Razorpay Payments** — UPI, Cards, Net Banking + Cash on Delivery
- 📱 **PWA** — Installable on mobile, works offline
- 🛒 **Smart Cart** — Persistent across sessions, free shipping progress bar
- 📊 **Admin Dashboard** — Revenue analytics, inventory alerts, sales reports
- 🔍 **Advanced Filters** — Fabric, occasion, price range, multi-select
- 📄 **PDF Invoices** — Client-side invoice generation
- 📦 **Excel Export** — Bulk order export for bookkeeping
- 💬 **WhatsApp Integration** — Product inquiries, low stock alerts
- 🎯 **SEO Optimized** — JSON-LD, dynamic sitemap, meta tags

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Installation, environment setup, database configuration |
| [FEATURES.md](docs/FEATURES.md) | Complete feature list with detailed descriptions |
| [USER-GUIDE.md](docs/USER-GUIDE.md) | How customers use the storefront |
| [ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md) | How to manage the store via admin panel |
| [API-REFERENCE.md](docs/API-REFERENCE.md) | All API endpoints with request/response formats |
| [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) | Codebase architecture and file organization |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide (Vercel, Neon, etc.) |

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd krishnapriya-textiles
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials (see docs/SETUP.md)

# 3. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Admin login: phone **9108455006**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 + ShadCN UI (New York) |
| **Database** | PostgreSQL (Neon) + Prisma 7.4.1 ORM |
| **Auth** | Phone OTP (MSG91) + JWT (jose) |
| **Payments** | Razorpay SDK + Webhook verification |
| **Images** | Cloudinary CDN (next-cloudinary) |
| **State** | Zustand (cart, wishlist, recently viewed) |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts (admin reports) |
| **PDF** | @react-pdf/renderer (invoices) |
| **Excel** | ExcelJS (order export) |
| **Icons** | Lucide React |
| **Fonts** | Inter, Cormorant Garamond, Playfair Display |

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

---

## 📁 Project Overview

```
krishnapriya-textiles/
├── prisma/              # Database schema & seed data
├── public/              # Static assets, PWA manifest, service worker
├── src/
│   ├── actions/         # Server actions (auth, cart, checkout, products)
│   ├── app/             # Next.js App Router pages
│   │   ├── (auth)/      # Login & OTP verification
│   │   ├── (storefront)/ # Public storefront (20+ pages)
│   │   ├── admin/       # Admin panel (14 sections)
│   │   └── api/         # REST API routes (30+ endpoints)
│   ├── components/      # React components (40+ custom + 26 shadcn/ui)
│   ├── config/          # Site config, navigation, env validation
│   ├── lib/             # Auth, DB, utilities, Razorpay, Cloudinary
│   ├── services/        # Business logic (auth, cart, order, payment, inventory)
│   ├── stores/          # Zustand stores (cart, wishlist, recently viewed)
│   ├── types/           # TypeScript type definitions
│   └── validators/      # Zod validation schemas
└── docs/                # Project documentation
```

See [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for the complete file-by-file breakdown.

---

## 📜 License

Private — All rights reserved. © Krishnapriya Textiles
