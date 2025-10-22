# Shopify Configuration & API Access

## 🏪 Store Information

**Store Name:** Phuket Telegram Shop  
**Store URL:** `phuket-telegram-shop-117ck.myshopify.com`  
**Admin URL:** https://admin.shopify.com/store/phuket-telegram-shop-117ck

---

## 🔑 Admin Credentials

**Email:** `anotherstoriz@gmail.com`  
**Password:** `Qazwsx1.`

> ⚠️ **Security Note:** These credentials provide full access to Shopify Admin panel. Keep them secure!

---

## 🔧 API Access Tokens

### Storefront API (Read-Only, Public)
- **Use:** Frontend website, displaying products
- **Token:** `89e6c827e100c3d0b35e5957424b3cc7`
- **Endpoint:** `https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json`
- **Header:** `X-Shopify-Storefront-Access-Token`
- **Permissions:** Read products, collections, checkout (no write access)

### Admin API (Full Access, Private)
- **Use:** Backend operations, managing products, orders
- **Token:** `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`
- **Endpoint:** `https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json`
- **Header:** `X-Shopify-Access-Token`
- **Permissions:** Full access (135 scopes enabled)

> ⚠️ **Critical:** Admin API token has FULL control over the store. Never commit to public repos!

---

## 📋 How to Use APIs (For AI Agents)

### Example 1: Get All Products (Storefront API)

```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Storefront-Access-Token: 89e6c827e100c3d0b35e5957424b3cc7' \
  -d '{"query":"{ products(first: 20) { edges { node { id title handle tags priceRange { minVariantPrice { amount currencyCode } } } } } }"}'
```

### Example 2: Update Product Handle (Admin API)

```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Access-Token: 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' \
  -d '{"query":"mutation { productUpdate(input: { id: \"gid://shopify/Product/XXX\", handle: \"new-handle\" }) { product { id handle } userErrors { field message } } }"}'
```

### Example 3: Create New Product (Admin API)

```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Access-Token: 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' \
  -d '{
    "query": "mutation { productCreate(input: { title: \"New Tour\", productType: \"Excursions\", tags: [\"tour\", \"islands\"], variants: [{ price: \"120\", title: \"Adult\" }] }) { product { id title handle } userErrors { field message } } }"
  }'
```

### Example 4: Delete Product (Admin API)

```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Access-Token: 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' \
  -d '{"query":"mutation { productDelete(input: { id: \"gid://shopify/Product/XXX\" }) { deletedProductId userErrors { field message } } }"}'
```

---

## 🏗️ Product Structure

### Tours (Excursions)
```json
{
  "title": "🏝️ Название тура",
  "handle": "tour-name-in-english",
  "productType": "Excursions",
  "tags": ["tour", "islands", "category-name"],
  "variants": [
    {
      "title": "Взрослый",
      "price": "120.00"
    },
    {
      "title": "Детский (4-11 лет)",
      "price": "90.00"
    }
  ]
}
```

### Phuket Insider (Info Pages)
```json
{
  "title": "📍 Название места/статьи",
  "handle": "place-name-in-english",
  "productType": "Information",
  "tags": ["info", "insider", "category"],
  "variants": [
    {
      "title": "Default",
      "price": "0.00"
    }
  ]
}
```

---

## 📊 Common Operations for AI Agents

### 1. List All Products
```graphql
query {
  products(first: 50) {
    edges {
      node {
        id
        title
        handle
        productType
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
            }
          }
        }
      }
    }
  }
}
```

### 2. Get Product by Handle
```graphql
query {
  product(handle: "phi-phi-2-days-1-night") {
    id
    title
    description
    tags
    variants(first: 10) {
      edges {
        node {
          id
          title
          price
          availableForSale
        }
      }
    }
  }
}
```

### 3. Update Product
```graphql
mutation {
  productUpdate(input: {
    id: "gid://shopify/Product/XXX",
    title: "New Title",
    handle: "new-handle",
    tags: ["tour", "islands"]
  }) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}
```

### 4. Create Product with Variants
```graphql
mutation {
  productCreate(input: {
    title: "New Tour Name",
    productType: "Excursions",
    handle: "new-tour-handle",
    tags: ["tour", "category"],
    variants: [
      { title: "Взрослый", price: "120" },
      { title: "Детский (4-11 лет)", price: "90" }
    ]
  }) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}
```

---

## 🚨 Important Notes for AI Agents

1. **Always use Admin API for modifications** (creating, updating, deleting products)
2. **Use Storefront API for reading data** (what the website sees)
3. **Product IDs format:** `gid://shopify/Product/XXXXXXXXX`
4. **Variant IDs format:** `gid://shopify/ProductVariant/XXXXXXXXX`
5. **Handles must be unique** and URL-friendly (no emojis, spaces, special chars)
6. **Tags are crucial for filtering:**
   - `tour` - for Tours page
   - `info` - for Phuket Insider page
   - Add descriptive tags: `islands`, `temples`, `beaches`, etc.

---

## 📚 Shopify GraphQL Documentation

- **Admin API:** https://shopify.dev/docs/api/admin-graphql
- **Storefront API:** https://shopify.dev/docs/api/storefront
- **GraphQL Explorer:** https://shopify.dev/docs/apps/tools/graphiql-admin-api

---

## 🔄 API Rate Limits

- **Storefront API:** 1000 points per minute (cost per query varies)
- **Admin API:** 2000 points available, restores at 100 points/second
- **Check throttle status** in `extensions.cost.throttleStatus` in response

---

## ✅ Quick Checklist for AI Agents

Before making changes:
- [ ] Use Admin API token (not Storefront)
- [ ] Get product ID first (via query)
- [ ] Format handle correctly (lowercase, hyphens, no special chars)
- [ ] Add proper tags (`tour` or `info`)
- [ ] Set productType (`Excursions` or `Information`)
- [ ] Create variants with titles and prices
- [ ] Check for userErrors in response
- [ ] Verify changes via Storefront API (what users see)

---

**Last Updated:** October 22, 2025  
**Maintained by:** AI Agent (GitHub Copilot)
