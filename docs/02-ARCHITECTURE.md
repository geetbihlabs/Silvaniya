# System Architecture
## Silvaniya E-commerce Platform

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│   silvaniya-web     │   silvaniya-admin   │      Mobile (Future)            │
│   (Next.js 14)      │   (Next.js 14)      │                                 │
│   Port: 3000        │   Port: 3001        │                                 │
└─────────┬───────────┴─────────┬───────────┴─────────────────────────────────┘
          │                     │
          │    HTTPS / REST     │
          ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         silvaniya-api (NestJS)                               │
│                              Port: 4000                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Auth    │ │ Products │ │  Orders  │ │ Payments │ │  Admin   │          │
│  │ Module   │ │  Module  │ │  Module  │ │  Module  │ │  Module  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Cart    │ │ Coupons  │ │  Media   │ │   CMS    │ │ Reports  │          │
│  │ Module   │ │  Module  │ │  Module  │ │  Module  │ │  Module  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Background Jobs (BullMQ)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │  Email   │ │   SMS    │ │ Webhooks │ │ Reports  │                        │
│  │  Queue   │ │  Queue   │ │ Processor│ │ Generator│                        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                        │
└─────────┬───────────────────────┬───────────────────────┬───────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────────────────┐
│   PostgreSQL    │   │     Redis       │   │    S3 / Cloudflare R2           │
│   Port: 5432    │   │   Port: 6379    │   │    (Media Storage)              │
│                 │   │                 │   │                                 │
│  - Products     │   │  - Sessions     │   │  - Product Images               │
│  - Orders       │   │  - Cart Cache   │   │  - Category Images              │
│  - Users        │   │  - Rate Limits  │   │  - Blog Images                  │
│  - Payments     │   │  - Job Queues   │   │  - Invoices (PDF)               │
└─────────────────┘   └─────────────────┘   └─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        External Services                                     │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│    Razorpay     │   SendGrid/SES  │   MSG91/Twilio  │   Blue Dart API       │
│   (Payments)    │    (Email)      │     (SMS)       │   (Shipping)          │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

---

## 2. Project Structure

### 2.1 silvaniya-api (NestJS Backend)

```
silvaniya-api/
├── src/
│   ├── main.ts                     # Application entry point
│   ├── app.module.ts               # Root module
│   ├── common/                     # Shared utilities
│   │   ├── decorators/             # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/                # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                 # Auth guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/           # Request interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/                  # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   ├── dto/                    # Common DTOs
│   │   │   └── pagination.dto.ts
│   │   └── utils/                  # Helper functions
│   │       ├── slug.util.ts
│   │       └── crypto.util.ts
│   │
│   ├── config/                     # Configuration
│   │   ├── configuration.ts        # Env config loader
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── razorpay.config.ts
│   │
│   ├── modules/
│   │   ├── auth/                   # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-refresh.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── verify-otp.dto.ts
│   │   │
│   │   ├── users/                  # Customer users
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── admin/                  # Admin users & auth
│   │   │   ├── admin.module.ts
│   │   │   ├── admin-auth.controller.ts
│   │   │   ├── admin-users.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── products/               # Product catalog
│   │   │   ├── products.module.ts
│   │   │   ├── products.controller.ts      # Public endpoints
│   │   │   ├── products-admin.controller.ts # Admin endpoints
│   │   │   ├── products.service.ts
│   │   │   ├── variants.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── categories/             # Categories
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories-admin.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── cart/                   # Shopping cart
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── orders/                 # Orders
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders-admin.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── payments/               # Razorpay integration
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── webhooks.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── coupons/                # Discount coupons
│   │   │   ├── coupons.module.ts
│   │   │   ├── coupons.controller.ts
│   │   │   ├── coupons-admin.controller.ts
│   │   │   ├── coupons.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── media/                  # File uploads
│   │   │   ├── media.module.ts
│   │   │   ├── media.controller.ts
│   │   │   ├── media.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── cms/                    # Content management
│   │   │   ├── cms.module.ts
│   │   │   ├── banners.controller.ts
│   │   │   ├── blogs.controller.ts
│   │   │   ├── cms.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── wishlist/               # Wishlist
│   │   │   ├── wishlist.module.ts
│   │   │   ├── wishlist.controller.ts
│   │   │   ├── wishlist.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── reviews/                # Product reviews
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   └── dto/
│   │   │
│   │   └── reports/                # Admin reports
│   │       ├── reports.module.ts
│   │       ├── reports.controller.ts
│   │       └── reports.service.ts
│   │
│   ├── jobs/                       # Background jobs
│   │   ├── jobs.module.ts
│   │   ├── processors/
│   │   │   ├── email.processor.ts
│   │   │   ├── sms.processor.ts
│   │   │   └── webhook.processor.ts
│   │   └── queues/
│   │       ├── email.queue.ts
│   │       └── sms.queue.ts
│   │
│   └── prisma/                     # Database
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       └── schema.prisma
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Migration files
│   └── seed.ts                     # Seed data
│
├── test/                           # E2E tests
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### 2.2 silvaniya-web (Next.js Customer Site)

```
silvaniya-web/
├── src/
│   ├── app/                        # App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage
│   │   ├── (auth)/                 # Auth group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (shop)/                 # Shop group
│   │   │   ├── products/
│   │   │   │   └── [slug]/page.tsx # PDP
│   │   │   ├── category/
│   │   │   │   └── [slug]/page.tsx # Category page
│   │   │   ├── collections/
│   │   │   │   └── [slug]/page.tsx # Collection page
│   │   │   ├── search/page.tsx
│   │   │   └── cart/page.tsx
│   │   ├── checkout/               # Checkout flow
│   │   │   ├── page.tsx
│   │   │   ├── success/page.tsx
│   │   │   └── failed/page.tsx
│   │   ├── account/                # User account
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   └── wishlist/page.tsx
│   │   ├── track/page.tsx          # Order tracking
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── (static)/               # Static pages
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── shipping-policy/page.tsx
│   │   │   ├── return-policy/page.tsx
│   │   │   ├── privacy-policy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── api/                    # API routes (minimal)
│   │   │   └── revalidate/route.ts
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   └── robots.ts               # Robots.txt
│   │
│   ├── components/
│   │   ├── ui/                     # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── ...
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── product/                # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   └── QuickView.tsx
│   │   ├── cart/                   # Cart components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/               # Checkout components
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentMethods.tsx
│   │   │   └── OrderReview.tsx
│   │   └── home/                   # Homepage components
│   │       ├── HeroBanner.tsx
│   │       ├── CategoryShowcase.tsx
│   │       └── FeaturedProducts.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   ├── razorpay.ts             # Razorpay client
│   │   └── utils.ts                # Utilities
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useWishlist.ts
│   │
│   ├── store/                      # Zustand stores
│   │   ├── cart.store.ts
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   │
│   └── styles/
│       └── globals.css             # Tailwind + custom styles
│
├── public/
│   ├── images/
│   └── fonts/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

### 2.3 silvaniya-admin (Next.js Admin Panel)

```
silvaniya-admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Redirect to /dashboard
│   │   ├── login/page.tsx
│   │   ├── (dashboard)/            # Protected routes
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # List
│   │   │   │   ├── new/page.tsx    # Create
│   │   │   │   └── [id]/page.tsx   # Edit
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx
│   │   │   ├── coupons/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── content/
│   │   │   │   ├── banners/page.tsx
│   │   │   │   └── blogs/page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── users/page.tsx
│   │   └── api/
│   │       └── auth/[...nextauth]/route.ts
│   │
│   ├── components/
│   │   ├── ui/                     # Shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── products/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── VariantManager.tsx
│   │   │   └── ImageUploader.tsx
│   │   ├── orders/
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── OrderActions.tsx
│   │   └── dashboard/
│   │       ├── StatsCards.tsx
│   │       └── SalesChart.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   └── usePermissions.ts
│   │
│   └── types/
│       └── index.ts
│
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 3. Authentication Strategy

### 3.1 Customer Authentication (silvaniya-web)

```
┌─────────────────────────────────────────────────────────────────┐
│                   Customer Auth Flow (OTP-based)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Customer enters phone/email                                 │
│   2. Backend sends OTP via SMS/Email                            │
│   3. Customer enters OTP                                         │
│   4. Backend verifies OTP                                        │
│   5. Backend issues JWT access token (15min) + refresh (7days)  │
│   6. Access token stored in memory, refresh in httpOnly cookie   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Token Strategy:**
- Access Token: JWT, 15 minutes expiry, stored in memory
- Refresh Token: JWT, 7 days expiry, httpOnly secure cookie
- Guest sessions: Anonymous cart stored in localStorage, merged on login

### 3.2 Admin Authentication (silvaniya-admin)

```
┌─────────────────────────────────────────────────────────────────┐
│                   Admin Auth Flow (Email/Password)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Admin enters email + password                               │
│   2. Backend verifies credentials (bcrypt)                       │
│   3. Backend issues JWT with role claim                          │
│   4. Token stored in httpOnly cookie                             │
│   5. Role-based access control (RBAC) on each request            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Token Strategy:**
- Access Token: JWT, 1 hour expiry, httpOnly secure cookie
- Refresh Token: JWT, 24 hours expiry, httpOnly secure cookie
- Role included in JWT payload for frontend permission checks

### 3.3 API Route Protection

| Route Pattern | Auth Required | Role Required |
|---------------|---------------|---------------|
| `GET /api/products` | No | - |
| `POST /api/cart` | No (guest) | - |
| `POST /api/checkout` | Yes (customer) | - |
| `GET /api/orders` | Yes (customer) | - |
| `GET /api/admin/*` | Yes (admin) | Varies |
| `POST /api/admin/products` | Yes (admin) | Admin+ |
| `DELETE /api/admin/products/:id` | Yes (admin) | Admin+ |
| `POST /api/admin/users` | Yes (admin) | SuperAdmin |

---

## 4. API Design Conventions

### 4.1 Base URL Structure
```
Customer API: https://api.silvaniya.com/api/v1
Admin API:    https://api.silvaniya.com/api/v1/admin
Webhooks:     https://api.silvaniya.com/webhooks
```

### 4.2 Request/Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 4.3 Naming Conventions
- Endpoints: kebab-case (`/api/v1/order-items`)
- Query params: camelCase (`?sortBy=createdAt&sortOrder=desc`)
- Request/Response body: camelCase
- Database columns: snake_case (Prisma maps automatically)

### 4.4 Pagination
```
GET /api/v1/products?page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

### 4.5 Filtering
```
GET /api/v1/products?categoryId=123&minPrice=1000&maxPrice=5000&inStock=true
```

---

## 5. Background Jobs (BullMQ)

### 5.1 Queue Configuration

| Queue Name | Purpose | Concurrency | Retry |
|------------|---------|-------------|-------|
| `email` | Transactional emails | 5 | 3 |
| `sms` | OTP & notifications | 3 | 2 |
| `webhooks` | Process Razorpay webhooks | 1 | 5 |
| `reports` | Generate CSV/PDF reports | 1 | 1 |
| `cleanup` | Expired cart cleanup | 1 | 1 |

### 5.2 Job Types

**Email Jobs:**
- `order.confirmation`
- `order.shipped`
- `order.delivered`
- `payment.failed`
- `refund.processed`
- `welcome`
- `password.reset`

**SMS Jobs:**
- `otp.send`
- `order.confirmation`
- `order.shipped`

**Webhook Jobs:**
- `razorpay.payment.captured`
- `razorpay.payment.failed`
- `razorpay.refund.processed`

---

## 6. Caching Strategy

### 6.1 Redis Cache Keys

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `cart:{sessionId}` | 7 days | Guest cart |
| `product:{id}` | 1 hour | Product details |
| `category:list` | 1 hour | Category tree |
| `home:featured` | 15 min | Featured products |
| `otp:{phone}` | 10 min | OTP verification |
| `rate:{ip}:{endpoint}` | 1 min | Rate limiting |
| `session:{token}` | 15 min | User session |

### 6.2 Cache Invalidation

- Product update → Invalidate `product:{id}`, `category:list`, `home:featured`
- Category update → Invalidate `category:list`
- Order placed → Invalidate inventory-related caches

---

## 7. Webhook Processing

### 7.1 Razorpay Webhook Flow

```
Razorpay → POST /webhooks/razorpay → Verify Signature → Queue Job → Process

1. Receive webhook at /webhooks/razorpay
2. Verify signature using Razorpay secret
3. Return 200 immediately (within 5 seconds)
4. Queue event for processing
5. Process in background:
   - payment.captured → Update order status, send confirmation
   - payment.failed → Update order status, send retry email
   - refund.created → Update payment status
```

### 7.2 Webhook Security

```typescript
// Signature verification
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(body))
  .digest('hex');

if (receivedSignature !== expectedSignature) {
  throw new UnauthorizedException('Invalid webhook signature');
}
```

---

## 8. Error Handling

### 8.1 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate/conflict |
| `UNPROCESSABLE` | 422 | Business logic error |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### 8.2 Business Error Codes

| Code | Description |
|------|-------------|
| `CART_EMPTY` | Cart is empty |
| `PRODUCT_OUT_OF_STOCK` | Insufficient inventory |
| `COUPON_EXPIRED` | Coupon has expired |
| `COUPON_INVALID` | Coupon code not found |
| `COUPON_MIN_ORDER` | Order below minimum |
| `COD_LIMIT_EXCEEDED` | Order exceeds COD limit |
| `PAYMENT_FAILED` | Payment processing failed |
| `ORDER_NOT_CANCELLABLE` | Order already shipped |

---

## 9. Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Cloudflare                               │
│                    (DNS, CDN, DDoS protection)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐
│  Vercel       │   │  Vercel       │   │  Railway / Render     │
│  silvaniya.com│   │  admin.*      │   │  api.silvaniya.com    │
│  (Next.js)    │   │  (Next.js)    │   │  (NestJS)             │
└───────────────┘   └───────────────┘   └───────────────────────┘
                                                    │
                    ┌───────────────────────────────┤
                    │                               │
                    ▼                               ▼
          ┌───────────────┐               ┌───────────────┐
          │  Neon / Supabase               │    Upstash    │
          │  (PostgreSQL)  │               │    (Redis)    │
          └───────────────┘               └───────────────┘
                    │
                    ▼
          ┌───────────────────────────────────────────────┐
          │              Cloudflare R2                     │
          │              (Media Storage)                   │
          └───────────────────────────────────────────────┘
```

### 9.1 Recommended Services

| Component | Service | Reason |
|-----------|---------|--------|
| Customer Site | Vercel | Best Next.js support, edge caching |
| Admin Panel | Vercel | Same stack, separate deployment |
| API | Railway / Render | Container support, good DX |
| Database | Neon / Supabase | Serverless Postgres, auto-scaling |
| Cache | Upstash | Serverless Redis |
| Media | Cloudflare R2 | S3-compatible, no egress fees |
| Email | SendGrid | Reliable, good deliverability |
| SMS | MSG91 | Best for India |

---

## 10. Security Checklist

- [ ] HTTPS enforced everywhere
- [ ] CORS configured for specific origins
- [ ] Rate limiting on auth endpoints (5 req/min)
- [ ] Rate limiting on API (100 req/min per IP)
- [ ] Input validation using class-validator
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React + CSP)
- [ ] CSRF tokens for state-changing requests
- [ ] Secure cookie flags (httpOnly, secure, sameSite)
- [ ] Password hashing (bcrypt, cost 12)
- [ ] JWT secret rotation capability
- [ ] Webhook signature verification
- [ ] File upload validation (type, size)
- [ ] Admin action audit logging
- [ ] Sensitive data encryption at rest
- [ ] Environment variables for secrets

---

## 11. Tradeoffs & Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monolith vs Microservices | Monolith | Simpler for team of 1-3, easier debugging |
| REST vs GraphQL | REST | Simpler, better caching, sufficient for needs |
| Session vs JWT | JWT | Stateless, scales easily |
| OTP vs Password (Customer) | OTP | Better UX for mobile-first India |
| Server Components | Yes | Better SEO, faster initial load |
| State Management | Zustand | Lightweight, TypeScript-first |
| CSS Framework | Tailwind | Fast development, small bundle |
| Admin UI | Shadcn/ui | Customizable, accessible |
| ORM | Prisma | Type-safe, great DX |
| Queue | BullMQ | Reliable, Redis-based |
