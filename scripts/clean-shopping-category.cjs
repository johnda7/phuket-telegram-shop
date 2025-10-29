#!/usr/bin/env node

/**
 * 🧹 ОЧИСТКА КАТЕГОРИИ "ТОРГОВЫЕ ЦЕНТРЫ"
 * Убираем пляжи и храмы, оставляем только торговые центры
 */

const ADMIN_API_TOKEN = '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';
const SHOP_DOMAIN = 'phuket-telegram-shop-117ck.myshopify.com';

// Торговые центры (оставляем)
const SHOPPING_CENTERS = [
  'central-phuket-floresta',
  'jungceylon-shopping-center', 
  'premium-outlet-phuket',
  'big-c-supercenter-phuket',
  'tesco-lotus-phuket',
  'robinson-lifestyle-phuket',
  'patong-night-market'
];

// Пляжи и храмы (убираем из категории торговых центров)
const NON_SHOPPING = [
  'freedom-beach-phuket',
  'wat-chalong',
  'bang-tao-beach', 
  'big-buddha'
];

async function cleanShoppingCategory() {
  console.log('🧹 ОЧИСТКА КАТЕГОРИИ "ТОРГОВЫЕ ЦЕНТРЫ"');
  console.log('==========================================\n');

  try {
    // Получаем все продукты
    const allProducts = await fetchAllProducts();
    
    console.log(`📦 Найдено продуктов: ${allProducts.length}`);
    
    // Обновляем теги для каждого продукта
    for (const product of allProducts) {
      const handle = product.handle;
      const currentTags = product.tags || [];
      
      let newTags = [...currentTags];
      
      if (SHOPPING_CENTERS.includes(handle)) {
        // Торговые центры - добавляем тег shopping
        if (!newTags.includes('shopping')) {
          newTags.push('shopping');
        }
        console.log(`✅ ${product.title} - добавлен тег 'shopping'`);
      } else if (NON_SHOPPING.includes(handle)) {
        // Пляжи и храмы - убираем тег shopping
        newTags = newTags.filter(tag => tag !== 'shopping');
        console.log(`❌ ${product.title} - убран тег 'shopping'`);
      }
      
      // Обновляем продукт только если теги изменились
      if (JSON.stringify(newTags.sort()) !== JSON.stringify(currentTags.sort())) {
        await updateProductTags(product.id, newTags);
        console.log(`   Обновлены теги: [${newTags.join(', ')}]`);
      }
    }
    
    console.log('\n✅ Очистка категории завершена!');
    
  } catch (error) {
    console.error('❌ Ошибка при очистке категории:', error);
  }
}

async function fetchAllProducts() {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            tags
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL ошибки: ${JSON.stringify(data.errors)}`);
  }
  
  return data.data.products.edges.map(edge => edge.node);
}

async function updateProductTags(productId, tags) {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: productId,
      tags: tags
    }
  };

  const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ 
      query: mutation,
      variables 
    })
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL ошибки: ${JSON.stringify(data.errors)}`);
  }
  
  if (data.data.productUpdate.userErrors.length > 0) {
    throw new Error(`Ошибки обновления: ${JSON.stringify(data.data.productUpdate.userErrors)}`);
  }
  
  return data.data.productUpdate.product;
}

// Запуск
cleanShoppingCategory();
