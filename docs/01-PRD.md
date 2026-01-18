# Product Requirements Document (PRD)
## Silvaniya - Jewellery E-commerce Platform

**Version:** 1.0
**Date:** January 2026
**Brand:** Silvaniya - The Art of Eternal Shine
**Parent Company:** Vernium Gold Private Limited

---

## 1. Executive Summary

Silvaniya is a D2C e-commerce platform for hallmarked 925 sterling silver jewellery targeting Indian customers. The platform consists of three applications:
- **Customer Website** - Product browsing, cart, checkout, order tracking
- **Admin Panel** - Product management, order processing, inventory control
- **Backend API** - RESTful services powering both frontends

---

## 2. Product Categories

| Category | Subcategories |
|----------|---------------|
| Rings | Bands, Statement Rings, Stackable Rings |
| Earrings | Studs, Hoops, Drops, Jhumkas |
| Necklaces | Chains, Pendants, Chokers, Layered |
| Bracelets | Bangles, Cuffs, Chain Bracelets |
| Anklets | Traditional, Modern |
| Pendants | Religious, Fashion, Initials |
| Chains | Rope, Box, Cable, Figaro |
| Silver Coins | 5g, 10g, 20g, 50g, 100g |
| Gift Sets | Curated Combos |
| Men's Collection | Cufflinks, Bracelets, Chains, Rings |

---

## 3. Customer Website

### 3.1 Pages & Features

#### Homepage
- Hero banner carousel (admin-managed)
- Featured collections
- New arrivals grid
- Bestsellers section
- Category showcase
- Trust badges (BIS Hallmark, Free Shipping, Easy Returns)
- Instagram feed integration
- Newsletter subscription

#### Category/Collection Pages
- Grid/List view toggle
- Filters: Price range, Metal purity, Stone type, Size, Weight
- Sort: Price (low-high, high-low), Newest, Bestselling
- Infinite scroll or pagination
- Quick view modal

#### Product Detail Page (PDP)
- Image gallery with zoom
- Variant selector (Size, Weight)
- Price display (MRP, Sale price if applicable)
- Stock status indicator
- Add to Cart / Buy Now
- Wishlist toggle
- Size guide modal
- Product specifications table
- Care instructions accordion
- Customer reviews section
- Related products carousel
- Recently viewed products

#### Search
- Autocomplete suggestions
- Search results page with filters
- No results fallback with recommendations

#### Cart
- Line items with quantity controls
- Remove item
- Apply coupon code
- Order summary
- Proceed to checkout CTA
- Continue shopping link

#### Checkout (Multi-step)
1. **Login/Guest** - Email/Phone, OTP verification, or guest checkout
2. **Shipping Address** - Address form, saved addresses for logged-in users
3. **Payment Selection** - Razorpay (Cards, UPI, Wallets, NetBanking), COD
4. **Order Review** - Final summary before payment
5. **Confirmation** - Order placed success page

#### User Account (Authenticated)
- Profile management
- Address book (multiple addresses)
- Order history with status tracking
- Wishlist
- Logout

#### Order Tracking
- Track by order ID (guest)
- Real-time status updates
- Blue Dart tracking link integration

#### Static Pages
- About Us
- Contact Us (with form)
- FAQ (accordion)
- Shipping Policy
- Return Policy
- Cancellation Policy
- Privacy Policy
- Terms of Service
- Jewellery Care Guide

#### Blog (SEO)
- Blog listing page
- Individual blog posts
- Categories/Tags
- Share buttons

### 3.2 User Flows

#### Guest Purchase Flow
```
Homepage → Category → PDP → Add to Cart → Cart → Checkout (Guest)
→ Enter Email/Phone → Address → Select Payment → Pay → Order Confirmation
```

#### Registered User Flow
```
Login (OTP) → Browse → Add to Cart → Checkout → Select Saved Address
→ Pay → Order Confirmation → Track in Account
```

#### Return Request Flow
```
Account → Order History → Select Order → Request Return
→ Upload Unboxing Video → Submit → Await Approval → Ship Back → Refund
```

---

## 4. Admin Panel

### 4.1 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access, user management, settings, analytics |
| **Admin** | Products, Orders, Customers, Coupons, Content |
| **Manager** | Inventory updates, Order status updates, View reports |
| **Viewer** | Read-only access to orders and products |

### 4.2 Sections

#### Dashboard
- Today's orders count & revenue
- Pending orders count
- Low stock alerts
- Recent orders list
- Sales chart (7 days, 30 days)
- Top selling products

#### Products
- Product list with search, filters
- Create/Edit product
  - Basic info (name, slug, description)
  - Category assignment (multi-select)
  - Media upload (drag & drop, reorder)
  - Variants management
    - Size, Weight combinations
    - Individual SKU per variant
    - Individual price per variant
    - Individual stock per variant
  - SEO fields (meta title, description, OG image)
  - Status (Draft, Active, Archived)
- Bulk actions (activate, archive, delete)
- Import/Export CSV

#### Categories
- Hierarchical category tree
- Create/Edit category
- Drag-drop reordering
- SEO fields per category
- Featured toggle

#### Inventory
- Stock levels per variant
- Low stock threshold settings
- Stock adjustment logs
- Bulk stock update

#### Orders
- Order list with status filters
- Order detail view
  - Customer info
  - Items ordered
  - Payment status & method
  - Shipping address
  - Order timeline
- Update order status
- Generate invoice PDF
- Add internal notes
- Process refund (partial/full)

#### Customers
- Customer list with search
- Customer detail view
  - Profile info
  - Order history
  - Total spent
- Export customer data

#### Coupons
- Coupon list
- Create/Edit coupon
  - Code (auto-generate or manual)
  - Type: Percentage / Fixed Amount
  - Minimum order value
  - Maximum discount cap
  - Usage limit (total / per user)
  - Valid date range
  - Applicable categories/products

#### Content Management
- Homepage banners
- Announcement bar
- Blog posts (WYSIWYG editor)
- Static page content

#### Reports
- Sales report (date range)
- Product performance
- Category performance
- Coupon usage
- Customer acquisition
- Export to CSV

#### Settings
- Store information
- Tax settings (GST)
- Shipping zones & rates
- Payment gateway config
- Email templates
- SMS templates
- Admin user management

---

## 5. Order Lifecycle

### 5.1 Order Statuses

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → COMPLETED
                 ↓                    ↓            ↓
            CANCELLED            RETURNED    RETURN_REQUESTED
                                     ↓
                                 REFUNDED
```

| Status | Description | Triggered By |
|--------|-------------|--------------|
| PENDING | Order placed, awaiting payment confirmation | Customer |
| CONFIRMED | Payment successful | Payment webhook |
| PROCESSING | Being prepared for shipment | Admin |
| SHIPPED | Handed to Blue Dart | Admin (AWB entry) |
| DELIVERED | Customer received | Webhook/Manual |
| COMPLETED | Order fulfilled, no issues | Auto (7 days post-delivery) |
| CANCELLED | Cancelled before dispatch | Customer/Admin |
| RETURN_REQUESTED | Customer requested return | Customer |
| RETURNED | Item received back | Admin |
| REFUNDED | Refund processed | Admin |

### 5.2 Payment States

| State | Description |
|-------|-------------|
| PENDING | Awaiting payment |
| AUTHORIZED | Payment authorized, not captured |
| CAPTURED | Payment successful |
| FAILED | Payment failed |
| REFUNDED | Full refund issued |
| PARTIALLY_REFUNDED | Partial refund issued |
| COD_ADVANCE_PAID | ₹100 COD advance collected |
| COD_PENDING | Awaiting COD collection |
| COD_COLLECTED | COD amount received |

### 5.3 Business Rules

#### COD Rules
- Available for orders ≤ ₹10,000
- ₹100 advance required at checkout (via Razorpay)
- Advance refundable only for genuine defects
- Unboxing video mandatory for COD returns

#### Cancellation Rules
- Allowed within 24 hours if not shipped
- Post-dispatch: No cancellation, can request return after delivery
- Customized items: Non-cancellable

#### Return Rules
- Jewellery: 3-day return window
- Silver Coins: 24-hour window (defects only)
- Condition: Unused, unworn, original packaging
- Mandatory: Unboxing video + Invoice
- Customized: Non-returnable

#### Refund Timeline
- 10-15 working days post-inspection
- Refund to original payment method
- COD refunds via bank transfer

---

## 6. Notifications

### 6.1 Email Notifications

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Order Placed | Customer | Order confirmation |
| Payment Failed | Customer | Payment retry link |
| Order Shipped | Customer | Tracking details |
| Order Delivered | Customer | Delivery confirmation |
| Return Approved | Customer | Return instructions |
| Refund Processed | Customer | Refund confirmation |
| Low Stock | Admin | Inventory alert |
| New Order | Admin | Order notification |

### 6.2 SMS Notifications

| Trigger | Message |
|---------|---------|
| OTP | Your Silvaniya OTP is {OTP}. Valid for 10 minutes. |
| Order Confirmed | Order #{ID} confirmed! Track at {URL} |
| Shipped | Your order is on its way! AWB: {AWB} |
| Delivered | Your Silvaniya order has been delivered! |

---

## 7. SEO Requirements

- Server-side rendering (SSR) for all public pages
- Dynamic meta tags per page
- Structured data (JSON-LD) for:
  - Product (with price, availability, reviews)
  - Organization
  - BreadcrumbList
  - FAQ
- XML Sitemap auto-generation
- Robots.txt configuration
- Canonical URLs
- Open Graph & Twitter Cards
- Image alt tags
- Clean URL slugs

---

## 8. Performance Requirements

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| API Response Time (p95) | < 200ms |
| Lighthouse Score | > 90 |

---

## 9. Security Requirements

- HTTPS everywhere
- Input validation & sanitization
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React auto-escaping + CSP headers)
- CSRF protection
- Rate limiting on auth endpoints
- Razorpay webhook signature verification
- PCI-DSS compliance (via Razorpay hosted checkout)
- GDPR/DPDP compliance for data handling
- Secure session management (HttpOnly cookies)
- Admin IP whitelisting (optional)

---

## 10. Integrations

| Service | Purpose |
|---------|---------|
| Razorpay | Payment processing |
| Blue Dart API | Shipping & tracking (future) |
| Shiprocket | Multi-carrier shipping (future) |
| AWS S3 / Cloudflare R2 | Media storage |
| Redis | Caching & sessions |
| BullMQ | Background job processing |
| SendGrid / AWS SES | Transactional emails |
| MSG91 / Twilio | SMS & OTP |
| Google Analytics 4 | Analytics |
| Meta Pixel | Marketing attribution |

---

## 11. Non-Functional Requirements

- **Availability:** 99.9% uptime
- **Scalability:** Handle 1000 concurrent users
- **Backup:** Daily database backups
- **Monitoring:** Error tracking (Sentry), uptime monitoring
- **Logging:** Structured logs with request tracing
