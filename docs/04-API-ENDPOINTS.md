# API Endpoints Reference
## Silvaniya E-commerce Platform

**Base URL:** `https://api.silvaniya.com/api/v1`

---

## Authentication Headers

### Customer Endpoints
```
Authorization: Bearer <access_token>
```

### Admin Endpoints
```
Authorization: Bearer <admin_access_token>
```

---

## 1. Authentication (Customer)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/send-otp` | Send OTP to phone/email | No |
| POST | `/auth/verify-otp` | Verify OTP and get tokens | No |
| POST | `/auth/refresh` | Refresh access token | Cookie |
| POST | `/auth/logout` | Invalidate refresh token | Yes |
| GET | `/auth/me` | Get current user profile | Yes |

### Request/Response Examples

**POST /auth/send-otp**
```json
// Request
{
  "target": "+919876543210",  // or "email@example.com"
  "type": "phone"            // or "email"
}

// Response
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 600
  }
}
```

**POST /auth/verify-otp**
```json
// Request
{
  "target": "+919876543210",
  "otp": "123456"
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": "clu...",
      "phone": "+919876543210",
      "email": null,
      "firstName": null,
      "lastName": null
    }
  }
}
```

---

## 2. User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | Yes |
| PATCH | `/users/profile` | Update user profile | Yes |
| GET | `/users/addresses` | List saved addresses | Yes |
| POST | `/users/addresses` | Add new address | Yes |
| PATCH | `/users/addresses/:id` | Update address | Yes |
| DELETE | `/users/addresses/:id` | Delete address | Yes |
| PATCH | `/users/addresses/:id/default` | Set as default | Yes |

### Request/Response Examples

**PATCH /users/profile**
```json
// Request
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@example.com"
}
```

**POST /users/addresses**
```json
// Request
{
  "label": "Home",
  "firstName": "Priya",
  "lastName": "Sharma",
  "phone": "+919876543210",
  "addressLine1": "123, Green Park",
  "addressLine2": "Near Metro Station",
  "city": "New Delhi",
  "state": "Delhi",
  "pincode": "110016",
  "isDefault": true
}
```

---

## 3. Products (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | List products (paginated) | No |
| GET | `/products/:slug` | Get product by slug | No |
| GET | `/products/featured` | Get featured products | No |
| GET | `/products/new-arrivals` | Get new arrivals | No |
| GET | `/products/bestsellers` | Get bestselling products | No |
| GET | `/products/search` | Search products | No |

### Query Parameters for /products

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page | 20 |
| categoryId | string | Filter by category | clu123 |
| categorySlug | string | Filter by category slug | rings |
| collectionSlug | string | Filter by collection | new-arrivals |
| minPrice | number | Minimum price | 1000 |
| maxPrice | number | Maximum price | 5000 |
| inStock | boolean | Only in stock items | true |
| sortBy | string | Sort field | price, createdAt |
| sortOrder | string | Sort direction | asc, desc |

### Response Example

**GET /products?categorySlug=rings&page=1&limit=12**
```json
{
  "success": true,
  "data": [
    {
      "id": "clu123",
      "name": "Amethyst Silver Ring",
      "slug": "amethyst-silver-ring",
      "shortDesc": "Beautiful 925 sterling silver ring with amethyst",
      "basePrice": "2499.00",
      "compareAtPrice": "2999.00",
      "purity": "925",
      "isFeatured": true,
      "isNew": true,
      "primaryImage": {
        "url": "https://cdn.silvaniya.com/...",
        "alt": "Amethyst Silver Ring"
      },
      "variants": [
        {
          "id": "var123",
          "name": "Size 6",
          "sku": "SIL-RING-AME-06",
          "price": "2499.00",
          "stock": 15,
          "isActive": true
        }
      ],
      "categories": [
        { "id": "cat1", "name": "Rings", "slug": "rings" }
      ],
      "avgRating": 4.5,
      "reviewCount": 12
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

**GET /products/:slug**
```json
{
  "success": true,
  "data": {
    "id": "clu123",
    "name": "Amethyst Silver Ring",
    "slug": "amethyst-silver-ring",
    "shortDesc": "Beautiful 925 sterling silver ring",
    "description": "<p>Full HTML description...</p>",
    "basePrice": "2499.00",
    "compareAtPrice": "2999.00",
    "purity": "925",
    "weight": "5.5",
    "isFeatured": true,
    "isNew": true,
    "metaTitle": "Buy Amethyst Silver Ring Online | Silvaniya",
    "metaDesc": "Shop authentic 925 sterling silver...",
    "images": [
      { "id": "img1", "url": "...", "alt": "...", "isPrimary": true },
      { "id": "img2", "url": "...", "alt": "...", "isPrimary": false }
    ],
    "variants": [
      {
        "id": "var1",
        "name": "Size 6 / 5g",
        "sku": "SIL-RING-AME-06-5G",
        "price": "2499.00",
        "comparePrice": "2999.00",
        "weight": "5.0",
        "stock": 15,
        "isActive": true,
        "attributes": [
          { "type": "Size", "value": "6" },
          { "type": "Weight", "value": "5g" }
        ]
      },
      {
        "id": "var2",
        "name": "Size 7 / 5g",
        "sku": "SIL-RING-AME-07-5G",
        "price": "2499.00",
        "stock": 8,
        "isActive": true,
        "attributes": [
          { "type": "Size", "value": "7" },
          { "type": "Weight", "value": "5g" }
        ]
      }
    ],
    "categories": [
      { "id": "cat1", "name": "Rings", "slug": "rings" },
      { "id": "cat2", "name": "Statement Rings", "slug": "statement-rings" }
    ],
    "avgRating": 4.5,
    "reviewCount": 12,
    "reviews": [
      {
        "id": "rev1",
        "rating": 5,
        "title": "Beautiful ring!",
        "comment": "Loved the quality...",
        "userName": "Priya S.",
        "isVerified": true,
        "createdAt": "2026-01-01T10:00:00Z"
      }
    ],
    "relatedProducts": [ /* similar product objects */ ]
  }
}
```

---

## 4. Categories (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | List all categories (tree) | No |
| GET | `/categories/:slug` | Get category by slug | No |
| GET | `/categories/:slug/products` | Get products in category | No |

### Response Example

**GET /categories**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat1",
      "name": "Rings",
      "slug": "rings",
      "image": "https://...",
      "isFeatured": true,
      "children": [
        { "id": "cat1a", "name": "Bands", "slug": "bands" },
        { "id": "cat1b", "name": "Statement Rings", "slug": "statement-rings" }
      ]
    },
    {
      "id": "cat2",
      "name": "Earrings",
      "slug": "earrings",
      "children": []
    }
  ]
}
```

---

## 5. Collections (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/collections` | List all collections | No |
| GET | `/collections/:slug` | Get collection with products | No |

---

## 6. Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get current cart | No* |
| POST | `/cart/items` | Add item to cart | No* |
| PATCH | `/cart/items/:variantId` | Update item quantity | No* |
| DELETE | `/cart/items/:variantId` | Remove item from cart | No* |
| DELETE | `/cart` | Clear cart | No* |
| POST | `/cart/coupon` | Apply coupon code | No* |
| DELETE | `/cart/coupon` | Remove coupon | No* |
| POST | `/cart/merge` | Merge guest cart on login | Yes |

*Guest carts use `X-Session-Id` header

### Request/Response Examples

**POST /cart/items**
```json
// Request
{
  "variantId": "var123",
  "quantity": 1
}

// Response
{
  "success": true,
  "data": {
    "id": "cart123",
    "items": [
      {
        "id": "item1",
        "variantId": "var123",
        "quantity": 1,
        "variant": {
          "id": "var123",
          "name": "Size 6",
          "sku": "SIL-RING-AME-06",
          "price": "2499.00",
          "stock": 15,
          "product": {
            "id": "prod123",
            "name": "Amethyst Silver Ring",
            "slug": "amethyst-silver-ring",
            "primaryImage": "https://..."
          }
        }
      }
    ],
    "subtotal": "2499.00",
    "discount": "0.00",
    "total": "2499.00",
    "coupon": null,
    "itemCount": 1
  }
}
```

**POST /cart/coupon**
```json
// Request
{
  "code": "WELCOME10"
}

// Response
{
  "success": true,
  "data": {
    "id": "cart123",
    "items": [...],
    "subtotal": "2499.00",
    "discount": "249.90",
    "total": "2249.10",
    "coupon": {
      "code": "WELCOME10",
      "type": "PERCENTAGE",
      "value": "10",
      "description": "10% off on your first order"
    },
    "itemCount": 1
  }
}
```

---

## 7. Checkout

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/checkout/validate` | Validate cart before checkout | No* |
| POST | `/checkout/create-order` | Create order and get payment link | Yes/Guest |
| POST | `/checkout/verify-payment` | Verify Razorpay payment | Yes/Guest |
| GET | `/checkout/cod-eligibility` | Check COD eligibility | No* |

### Request/Response Examples

**POST /checkout/create-order**
```json
// Request
{
  "shippingAddress": {
    "firstName": "Priya",
    "lastName": "Sharma",
    "phone": "+919876543210",
    "addressLine1": "123, Green Park",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110016"
  },
  "paymentMethod": "RAZORPAY",  // or "COD"
  "customerNote": "Please gift wrap",
  "guestEmail": "guest@example.com",  // For guest checkout
  "guestPhone": "+919876543210"
}

// Response
{
  "success": true,
  "data": {
    "orderId": "ord123",
    "orderNumber": "SIL-20260107-0001",
    "total": "2249.10",
    "paymentMethod": "RAZORPAY",
    "razorpay": {
      "orderId": "order_xxx",
      "amount": 224910,  // in paise
      "currency": "INR",
      "key": "rzp_live_xxx"
    }
  }
}
```

**POST /checkout/verify-payment**
```json
// Request
{
  "orderId": "ord123",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "xxx"
}

// Response
{
  "success": true,
  "data": {
    "orderId": "ord123",
    "orderNumber": "SIL-20260107-0001",
    "status": "CONFIRMED",
    "message": "Payment successful! Your order has been placed."
  }
}
```

---

## 8. Orders (Customer)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders` | List user's orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| POST | `/orders/:id/cancel` | Cancel order (pre-ship) | Yes |
| POST | `/orders/:id/return` | Request return | Yes |
| GET | `/orders/track/:orderNumber` | Track order (public) | No |

### Request/Response Examples

**GET /orders**
```json
{
  "success": true,
  "data": [
    {
      "id": "ord123",
      "orderNumber": "SIL-20260107-0001",
      "status": "SHIPPED",
      "total": "2249.10",
      "itemCount": 1,
      "createdAt": "2026-01-07T10:00:00Z",
      "items": [
        {
          "productName": "Amethyst Silver Ring",
          "variantName": "Size 6",
          "quantity": 1,
          "productImage": "https://..."
        }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 5 }
}
```

**GET /orders/:id**
```json
{
  "success": true,
  "data": {
    "id": "ord123",
    "orderNumber": "SIL-20260107-0001",
    "status": "SHIPPED",
    "subtotal": "2499.00",
    "discount": "249.90",
    "shippingCost": "0.00",
    "tax": "0.00",
    "total": "2249.10",
    "couponCode": "WELCOME10",
    "shippingAddress": {
      "name": "Priya Sharma",
      "phone": "+919876543210",
      "line1": "123, Green Park",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110016"
    },
    "awbNumber": "1234567890",
    "trackingUrl": "https://bluedart.com/track/...",
    "shippedAt": "2026-01-08T10:00:00Z",
    "items": [
      {
        "id": "item1",
        "productName": "Amethyst Silver Ring",
        "variantName": "Size 6",
        "sku": "SIL-RING-AME-06",
        "quantity": 1,
        "unitPrice": "2499.00",
        "totalPrice": "2499.00",
        "productImage": "https://..."
      }
    ],
    "payment": {
      "method": "RAZORPAY",
      "status": "CAPTURED",
      "razorpayPaymentId": "pay_xxx"
    },
    "timeline": [
      { "status": "PENDING", "message": "Order placed", "createdAt": "..." },
      { "status": "CONFIRMED", "message": "Payment confirmed", "createdAt": "..." },
      { "status": "PROCESSING", "message": "Order is being processed", "createdAt": "..." },
      { "status": "SHIPPED", "message": "Shipped via Blue Dart", "createdAt": "..." }
    ],
    "createdAt": "2026-01-07T10:00:00Z"
  }
}
```

**POST /orders/:id/return**
```json
// Request
{
  "reason": "Size doesn't fit",
  "customerNote": "Need a larger size",
  "unboxingVideoUrl": "https://drive.google.com/..."
}
```

---

## 9. Wishlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wishlist` | Get wishlist items | Yes |
| POST | `/wishlist/:productId` | Add to wishlist | Yes |
| DELETE | `/wishlist/:productId` | Remove from wishlist | Yes |

---

## 10. Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products/:productId/reviews` | Get product reviews | No |
| POST | `/products/:productId/reviews` | Add review | Yes |
| PATCH | `/reviews/:id` | Update review | Yes |
| DELETE | `/reviews/:id` | Delete review | Yes |

---

## 11. CMS (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cms/banners` | Get active banners | No |
| GET | `/cms/banners/:position` | Get banners by position | No |
| GET | `/blog` | List blog posts | No |
| GET | `/blog/:slug` | Get blog post | No |
| GET | `/pages/:slug` | Get static page | No |

---

## 12. Contact & Newsletter

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Submit contact form | No |
| POST | `/newsletter/subscribe` | Subscribe to newsletter | No |
| POST | `/newsletter/unsubscribe` | Unsubscribe | No |

---

## 13. Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/webhooks/razorpay` | Razorpay payment events | Signature |

---

# Admin API Endpoints

**Base URL:** `https://api.silvaniya.com/api/v1/admin`

---

## 14. Admin Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Admin login | No |
| POST | `/auth/refresh` | Refresh token | Cookie |
| POST | `/auth/logout` | Logout | Yes |
| GET | `/auth/me` | Get current admin | Yes |
| POST | `/auth/change-password` | Change password | Yes |

---

## 15. Dashboard

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/dashboard/stats` | Get dashboard stats | All |
| GET | `/dashboard/sales-chart` | Sales data for chart | All |
| GET | `/dashboard/recent-orders` | Recent orders | All |
| GET | `/dashboard/low-stock` | Low stock alerts | All |

---

## 16. Products (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/products` | List all products | All |
| GET | `/products/:id` | Get product details | All |
| POST | `/products` | Create product | Admin+ |
| PATCH | `/products/:id` | Update product | Admin+ |
| DELETE | `/products/:id` | Delete product | Admin+ |
| POST | `/products/:id/duplicate` | Duplicate product | Admin+ |
| PATCH | `/products/:id/status` | Toggle active status | Admin+ |
| POST | `/products/import` | Import from CSV | Admin+ |
| GET | `/products/export` | Export to CSV | Manager+ |

### Request Example

**POST /admin/products**
```json
{
  "name": "Amethyst Silver Ring",
  "slug": "amethyst-silver-ring",
  "shortDesc": "Beautiful 925 sterling silver ring",
  "description": "<p>Full description...</p>",
  "basePrice": 2499.00,
  "compareAtPrice": 2999.00,
  "costPrice": 1500.00,
  "purity": "925",
  "categoryIds": ["cat1", "cat2"],
  "isActive": true,
  "isFeatured": false,
  "metaTitle": "Buy Amethyst Silver Ring | Silvaniya",
  "metaDesc": "Shop authentic...",
  "variants": [
    {
      "name": "Size 6 / 5g",
      "sku": "SIL-RING-AME-06-5G",
      "price": 2499.00,
      "weight": 5.0,
      "stock": 15,
      "attributes": [
        { "typeId": "size", "valueId": "6" },
        { "typeId": "weight", "valueId": "5g" }
      ]
    },
    {
      "name": "Size 7 / 5g",
      "sku": "SIL-RING-AME-07-5G",
      "price": 2499.00,
      "weight": 5.0,
      "stock": 10,
      "attributes": [
        { "typeId": "size", "valueId": "7" },
        { "typeId": "weight", "valueId": "5g" }
      ]
    }
  ]
}
```

---

## 17. Variants (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/products/:productId/variants` | Add variant | Admin+ |
| PATCH | `/variants/:id` | Update variant | Admin+ |
| DELETE | `/variants/:id` | Delete variant | Admin+ |
| PATCH | `/variants/:id/stock` | Update stock | Manager+ |

---

## 18. Categories (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/categories` | List all categories | All |
| POST | `/categories` | Create category | Admin+ |
| PATCH | `/categories/:id` | Update category | Admin+ |
| DELETE | `/categories/:id` | Delete category | Admin+ |
| PATCH | `/categories/reorder` | Reorder categories | Admin+ |

---

## 19. Collections (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/collections` | List collections | All |
| POST | `/collections` | Create collection | Admin+ |
| PATCH | `/collections/:id` | Update collection | Admin+ |
| DELETE | `/collections/:id` | Delete collection | Admin+ |
| POST | `/collections/:id/products` | Add products | Admin+ |
| DELETE | `/collections/:id/products/:productId` | Remove product | Admin+ |

---

## 20. Inventory (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/inventory` | List inventory | All |
| GET | `/inventory/low-stock` | Low stock items | All |
| PATCH | `/inventory/:variantId` | Update stock | Manager+ |
| POST | `/inventory/bulk-update` | Bulk stock update | Manager+ |
| GET | `/inventory/logs` | Stock change logs | All |

---

## 21. Orders (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/orders` | List all orders | All |
| GET | `/orders/:id` | Get order details | All |
| PATCH | `/orders/:id/status` | Update order status | Manager+ |
| PATCH | `/orders/:id/shipping` | Update shipping info | Manager+ |
| POST | `/orders/:id/refund` | Process refund | Admin+ |
| POST | `/orders/:id/note` | Add admin note | Manager+ |
| GET | `/orders/export` | Export orders CSV | Manager+ |

### Request Examples

**PATCH /admin/orders/:id/status**
```json
{
  "status": "SHIPPED",
  "message": "Shipped via Blue Dart"
}
```

**PATCH /admin/orders/:id/shipping**
```json
{
  "awbNumber": "1234567890",
  "trackingUrl": "https://bluedart.com/track/1234567890",
  "shippingMethod": "Blue Dart Express"
}
```

**POST /admin/orders/:id/refund**
```json
{
  "amount": 2249.10,
  "reason": "Customer return approved"
}
```

---

## 22. Returns (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/returns` | List return requests | All |
| GET | `/returns/:id` | Get return details | All |
| PATCH | `/returns/:id/status` | Update return status | Manager+ |
| POST | `/returns/:id/refund` | Process refund | Admin+ |

---

## 23. Customers (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/customers` | List customers | All |
| GET | `/customers/:id` | Get customer details | All |
| GET | `/customers/:id/orders` | Customer's orders | All |
| GET | `/customers/export` | Export customers CSV | Admin+ |

---

## 24. Coupons (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/coupons` | List coupons | All |
| GET | `/coupons/:id` | Get coupon details | All |
| POST | `/coupons` | Create coupon | Admin+ |
| PATCH | `/coupons/:id` | Update coupon | Admin+ |
| DELETE | `/coupons/:id` | Delete coupon | Admin+ |
| GET | `/coupons/:id/usage` | Get usage stats | All |

### Request Example

**POST /admin/coupons**
```json
{
  "code": "WELCOME10",
  "description": "10% off for new customers",
  "type": "PERCENTAGE",
  "value": 10,
  "minOrderValue": 999,
  "maxDiscount": 500,
  "usageLimit": 1000,
  "perUserLimit": 1,
  "validFrom": "2026-01-01T00:00:00Z",
  "validUntil": "2026-12-31T23:59:59Z",
  "isActive": true,
  "applicableCategoryIds": [],
  "applicableProductIds": []
}
```

---

## 25. Media (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/media/upload` | Upload file(s) | Manager+ |
| DELETE | `/media/:id` | Delete file | Manager+ |
| GET | `/media` | List uploaded files | All |

### Request Example

**POST /admin/media/upload**
```
Content-Type: multipart/form-data

files: [binary]
folder: products  // or categories, blog, etc.
```

---

## 26. Content (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/banners` | List banners | All |
| POST | `/banners` | Create banner | Admin+ |
| PATCH | `/banners/:id` | Update banner | Admin+ |
| DELETE | `/banners/:id` | Delete banner | Admin+ |
| GET | `/blog` | List blog posts | All |
| POST | `/blog` | Create blog post | Admin+ |
| PATCH | `/blog/:id` | Update blog post | Admin+ |
| DELETE | `/blog/:id` | Delete blog post | Admin+ |
| GET | `/pages` | List pages | All |
| PATCH | `/pages/:id` | Update page content | Admin+ |

---

## 27. Reports (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/reports/sales` | Sales report | All |
| GET | `/reports/products` | Product performance | All |
| GET | `/reports/categories` | Category performance | All |
| GET | `/reports/customers` | Customer analytics | All |
| GET | `/reports/coupons` | Coupon usage report | All |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | ISO date | Report start date |
| endDate | ISO date | Report end date |
| groupBy | string | day, week, month |

---

## 28. Settings (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/settings` | Get all settings | Admin+ |
| PATCH | `/settings` | Update settings | SuperAdmin |
| GET | `/settings/:key` | Get specific setting | Admin+ |

---

## 29. Admin Users (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/users` | List admin users | SuperAdmin |
| POST | `/users` | Create admin user | SuperAdmin |
| PATCH | `/users/:id` | Update admin user | SuperAdmin |
| DELETE | `/users/:id` | Delete admin user | SuperAdmin |
| PATCH | `/users/:id/role` | Change user role | SuperAdmin |

---

## 30. Audit Logs (Admin)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/audit-logs` | List audit logs | SuperAdmin |
| GET | `/audit-logs/:entityType/:entityId` | Logs for entity | SuperAdmin |

---

## Error Codes Reference

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate resource |
| `CART_EMPTY` | 422 | Cart is empty |
| `PRODUCT_OUT_OF_STOCK` | 422 | Insufficient stock |
| `COUPON_EXPIRED` | 422 | Coupon expired |
| `COUPON_INVALID` | 422 | Invalid coupon code |
| `COUPON_MIN_ORDER` | 422 | Below minimum order |
| `COD_LIMIT_EXCEEDED` | 422 | Order exceeds COD limit |
| `ORDER_NOT_CANCELLABLE` | 422 | Cannot cancel order |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
