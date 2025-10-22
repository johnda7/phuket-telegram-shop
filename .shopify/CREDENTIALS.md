# Quick Access Credentials

## 🔑 Shopify Admin Login
- **URL:** https://admin.shopify.com/store/phuket-telegram-shop-117ck
- **Email:** anotherstoriz@gmail.com
- **Password:** Qazwsx1.

## 🎫 API Tokens

### Storefront API (Public, Read-Only)
**Token:** `89e6c827e100c3d0b35e5957424b3cc7`

### Admin API (Full Access)
**Token:** `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`

## Quick Test Command
```bash
# Test Storefront API
curl -X POST 'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Storefront-Access-Token: 89e6c827e100c3d0b35e5957424b3cc7' \
  -d '{"query":"{ products(first: 5) { edges { node { title handle } } } }"}' | jq '.'
```

⚠️ Keep this file private!
