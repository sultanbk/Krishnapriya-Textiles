# Deployment Guide — Krishnapriya Textiles

How to deploy the application to production.

---

## Table of Contents

- [Recommended Stack](#recommended-stack)
- [Deploying to Vercel](#deploying-to-vercel)
- [Database (Neon)](#database-neon)
- [Environment Variables](#environment-variables)
- [Domain Setup](#domain-setup)
- [Razorpay Production Setup](#razorpay-production-setup)
- [MSG91 Production Setup](#msg91-production-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Updating the Application](#updating-the-application)
- [Backup Strategy](#backup-strategy)
- [Alternative Deployment (Self-Hosted)](#alternative-deployment-self-hosted)

---

## Recommended Stack

| Service | Provider | Free Tier | Purpose |
|---------|----------|-----------|---------|
| **Hosting** | [Vercel](https://vercel.com) | Yes (hobby plan) | Next.js hosting + Edge Functions |
| **Database** | [Neon](https://neon.tech) | Yes (0.5 GB) | Serverless PostgreSQL |
| **SMS** | [MSG91](https://msg91.com) | Trial credits | OTP delivery |
| **Payments** | [Razorpay](https://razorpay.com) | No monthly fee | Payment processing |
| **Images** | [Cloudinary](https://cloudinary.com) | Yes (25 GB) | Image CDN + optimization |
| **Domain** | [Namecheap](https://namecheap.com) / GoDaddy | Paid (~₹500/yr) | Custom domain |

---

## Deploying to Vercel

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create a GitHub repository and push
git remote add origin https://github.com/yourusername/krishnapriya-textiles.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"New Project"**
3. Select your `krishnapriya-textiles` repository
4. Vercel auto-detects it as a Next.js project

### Step 3: Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework | Next.js (auto-detected) |
| Root Directory | `./` (default) |
| Build Command | `npm run build` |
| Output Directory | `.next` (auto-detected) |

### Step 4: Add Environment Variables

In Vercel's project settings → **Environment Variables**, add ALL variables:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-production-jwt-secret-min-32-chars
MSG91_AUTH_KEY=your-msg91-key
MSG91_TEMPLATE_ID=your-msg91-template
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-live-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
NEXT_PUBLIC_APP_URL=https://krishnapriyatextiles.com
NODE_ENV=production
```

> **Important:** Use **live** Razorpay keys (starting with `rzp_live_`) for production, not test keys.

### Step 5: Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies
2. Generate Prisma client
3. Build the Next.js application
4. Deploy to edge network

### Step 6: Run Database Setup

After the first deploy, you need to set up the database. Use Vercel CLI or a local terminal with production env:

```bash
# Option A: Run locally with production DATABASE_URL
DATABASE_URL="your-production-db-url" npx prisma db push
DATABASE_URL="your-production-db-url" npx tsx prisma/seed.ts

# Option B: Use Vercel CLI
vercel env pull .env.production.local
npx prisma db push
npx tsx prisma/seed.ts
```

---

## Database (Neon)

### Production Recommendations

1. **Region:** Choose `ap-south-1` (Mumbai) for lowest latency in India
2. **Auto-suspend:** Enable to save costs during low traffic hours
3. **Compute:** Free tier starts with 0.25 compute units — sufficient for low-medium traffic
4. **Connection Pooling:** Already configured via `@prisma/adapter-pg` — uses Neon's built-in pooler
5. **Branching:** Use Neon branches for staging/testing without affecting production

### Database Migrations (Production)

For production, use migrations instead of `db push`:

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply to production
npx prisma migrate deploy
```

---

## Environment Variables

### Production vs Development

| Variable | Development | Production |
|----------|------------|------------|
| `RAZORPAY_KEY_ID` | `rzp_test_xxx` | `rzp_live_xxx` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_xxx` | `rzp_live_xxx` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://krishnapriyatextiles.com` |
| `NODE_ENV` | `development` | `production` |
| `JWT_SECRET` | Any string (32+ chars) | **Strong random string** (64+ chars recommended) |

### Generating a Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

---

## Domain Setup

### Connecting a Custom Domain on Vercel

1. Go to your Vercel project → **Settings → Domains**
2. Add your domain: `krishnapriyatextiles.com`
3. Add `www.krishnapriyatextiles.com` as well
4. Vercel will provide DNS records to add:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

5. Add these records in your domain registrar's DNS settings
6. Vercel auto-provisions SSL certificates (HTTPS)

### Update Environment Variable

After domain setup, update `NEXT_PUBLIC_APP_URL`:
```
NEXT_PUBLIC_APP_URL=https://krishnapriyatextiles.com
```

---

## Razorpay Production Setup

### Switching to Live Mode

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Complete **KYC verification** (required for live mode):
   - Business details
   - Bank account
   - PAN card
   - GST number (if applicable)
   - Address proof
3. Once approved, go to **Settings → API Keys → Generate Live Key**
4. Update environment variables with live keys

### Webhook Configuration

1. Go to **Settings → Webhooks → Add New Webhook**
2. Set URL: `https://krishnapriyatextiles.com/api/razorpay/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
4. Set a webhook secret and update `RAZORPAY_WEBHOOK_SECRET`
5. **Important:** Test the webhook using Razorpay's "Send Test Webhook" feature

### Payment Methods

Razorpay automatically enables based on your KYC:
- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Cards
- Net Banking
- Wallets

---

## MSG91 Production Setup

1. Complete MSG91 account verification
2. Get DLT registration for your SMS template (required by TRAI)
3. Add sufficient SMS credits
4. Verify your sender ID
5. Test OTP delivery in production

### Template Format

Your MSG91 OTP template should contain:
```
Your OTP for Krishnapriya Textiles is {otp}. Valid for 5 minutes. Do not share with anyone.
```

---

## Cloudinary Setup

### Production Recommendations

1. **Upload Preset:** Create a preset named `krishnapriya-textiles` with:
   - Auto format (WebP/AVIF)
   - Auto quality
   - Max width: 2000px
2. **Folders:** Organize uploads in folders: `products/`, `banners/`, `testimonials/`
3. **Transformations:** The app uses preset sizes (thumbnail: 400px, card: 600px, detail: 1200px, zoom: 2000px)
4. **Backup:** Enable backup in Cloudinary settings

---

## Post-Deployment Checklist

### Essential Checks

- [ ] Website loads at your domain
- [ ] SSL certificate is active (HTTPS)
- [ ] Homepage shows products and banners
- [ ] Product images load from Cloudinary
- [ ] OTP login works (receive SMS on real phone)
- [ ] Admin panel accessible after login
- [ ] Add a product via admin → appears on storefront
- [ ] Cart and checkout flow works
- [ ] Razorpay payment completes successfully (test with small amount)
- [ ] COD order placement works
- [ ] Order status updates → notification created
- [ ] PDF invoice downloads correctly
- [ ] Contact form submission works
- [ ] WhatsApp buttons open correct chat
- [ ] Google Maps embed shows correct location
- [ ] robots.txt blocks admin/API routes
- [ ] sitemap.xml generates correctly
- [ ] PWA installable on mobile

### SEO Checks

- [ ] Site title and description correct
- [ ] Open Graph image loads on social shares
- [ ] Product pages have proper meta tags
- [ ] JSON-LD structured data present on product pages
- [ ] Submit sitemap to Google Search Console

### Performance Checks

- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Images lazy-loaded properly
- [ ] No console errors in production

---

## Monitoring & Maintenance

### Vercel Analytics (Built-in)

Vercel provides free analytics:
- **Web Analytics:** Page views, unique visitors, top pages
- **Speed Insights:** Core Web Vitals per page
- **Function Logs:** Server-side error logs

Enable in Vercel project → **Analytics** tab.

### Error Monitoring

Consider adding:
- **Vercel Error Tracking** (built-in)
- **Sentry** (optional, for detailed error tracking)

### Database Monitoring

Neon Dashboard provides:
- Connection count
- Query performance
- Storage usage
- Auto-suspend status

### Regular Maintenance

| Task | Frequency |
|------|-----------|
| Check inventory levels | Daily |
| Process new orders | Daily |
| Respond to contact messages | Daily |
| Review sales reports | Weekly |
| Update product catalog | As needed |
| Rotate JWT secret | Every 6 months |
| Update dependencies | Monthly |
| Database backup review | Monthly |

---

## Updating the Application

### Deploying Updates

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically deploys on every push to `main`.

### Database Schema Changes

If you modify `prisma/schema.prisma`:

```bash
# 1. Create migration locally
npx prisma migrate dev --name describe_the_change

# 2. Push to git (migration files are included)
git add .
git commit -m "Add migration: describe_the_change"
git push origin main

# 3. On production, migrations are auto-applied via:
#    postinstall or build script
```

### Rollback

If a deployment has issues:
1. Go to Vercel Dashboard → **Deployments**
2. Find the last working deployment
3. Click **"..." → "Promote to Production"**

---

## Backup Strategy

### Database Backups

**Neon provides:**
- Point-in-time recovery (last 7 days on free tier)
- Branch snapshots

**Manual backup:**
```bash
# Export full database
pg_dump "your-database-url" > backup_$(date +%Y%m%d).sql

# Restore
psql "your-database-url" < backup_20260225.sql
```

### Image Backups

Cloudinary stores all uploaded images. Enable **backup** in Cloudinary settings for additional redundancy.

### Code Backups

Git repository (GitHub) serves as the code backup. Consider enabling GitHub's **branch protection** rules for `main`.

---

## Alternative Deployment (Self-Hosted)

If not using Vercel, the app can run on any Node.js server:

### Using Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Using PM2 (VPS)

```bash
# Install PM2
npm install -g pm2

# Build and start
npm run build
pm2 start npm --name "kpt" -- start

# Auto-restart on crash
pm2 save
pm2 startup
```

### Requirements for Self-Hosting

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| RAM | 512 MB |
| Storage | 1 GB |
| PostgreSQL | 14+ (or Neon remote) |

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name krishnapriyatextiles.com www.krishnapriyatextiles.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use [Certbot](https://certbot.eff.org/) for free SSL via Let's Encrypt.
