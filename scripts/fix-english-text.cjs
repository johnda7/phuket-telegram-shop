#!/usr/bin/env node

/**
 * 🔧 ИСПРАВЛЯЕМ АНГЛИЙСКИЙ ТЕКСТ В ОПИСАНИИ
 * 
 * Заменяем:
 * - "Must-see!" → "Обязательно к посещению!"
 * - "AR TRICK EYE" → "Музей 3D-иллюзий"
 * - "Apple реселлер" → "Apple Store"
 * - Фиолетовые градиенты → Синие (Telegram стиль)
 */

const fs = require('fs');

// Shopify Admin API настройки
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';

async function shopifyAdminRequest(query, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        descriptionHtml
      }
    }
  `;

  const data = await shopifyAdminRequest(query, { handle });
  
  if (data.errors) {
    console.error('❌ GraphQL Errors:', data.errors);
    throw new Error('Failed to fetch product');
  }

  return data.data.productByHandle;
}

async function updateProductDescription(productId, html) {
  const mutation = `
    mutation updateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: $descriptionHtml
      }) {
        product {
          id
          title
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: productId,
    descriptionHtml: html
  };

  const data = await shopifyAdminRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }
  return data.data.productUpdate;
}

async function main() {
  console.log('🔧 Исправляем английский текст в описании...\n');

  try {
    // Получаем продукт
    const product = await getProductByHandle('central-phuket-floresta');
    
    if (!product) {
      console.error('❌ Продукт не найден!');
      return;
    }

    console.log(`✅ Найден: ${product.title}`);
    console.log(`🆔 ID: ${product.id}`);

    // Исправляем HTML описание
    let fixedHtml = product.descriptionHtml || '';

    // Заменяем английский текст
    fixedHtml = fixedHtml.replace(/Must-see!/g, 'Обязательно к посещению!');
    fixedHtml = fixedHtml.replace(/AR TRICK EYE/g, 'Музей 3D-иллюзий');
    fixedHtml = fixedHtml.replace(/Apple реселлер/g, 'Apple Store');
    
    // Заменяем фиолетовые градиенты на синие (Telegram стиль)
    fixedHtml = fixedHtml.replace(/from-blue-600 to-purple-600/g, 'from-blue-500 to-blue-600');
    fixedHtml = fixedHtml.replace(/from-blue-500 to-purple-600/g, 'from-blue-500 to-blue-600');
    fixedHtml = fixedHtml.replace(/from-blue-600 to-purple-700/g, 'from-blue-500 to-blue-700');
    fixedHtml = fixedHtml.replace(/from-blue-500 to-purple-700/g, 'from-blue-500 to-blue-700');
    
    // Заменяем другие фиолетовые градиенты
    fixedHtml = fixedHtml.replace(/to-purple-600/g, 'to-blue-600');
    fixedHtml = fixedHtml.replace(/to-purple-700/g, 'to-blue-700');
    fixedHtml = fixedHtml.replace(/to-purple-800/g, 'to-blue-800');

    console.log('📝 Обновляем исправленное описание...');
    
    // Обновляем продукт
    await updateProductDescription(product.id, fixedHtml);
    
    console.log('✅ УСПЕШНО ИСПРАВЛЕНО!');
    console.log(`📦 Продукт: ${product.title}`);
    console.log(`🆔 ID: ${product.id}`);
    
    console.log('\n🎯 ИСПРАВЛЕНИЯ:');
    console.log('✅ "Must-see!" → "Обязательно к посещению!"');
    console.log('✅ "AR TRICK EYE" → "Музей 3D-иллюзий"');
    console.log('✅ "Apple реселлер" → "Apple Store"');
    console.log('✅ Фиолетовые градиенты → Синие (Telegram стиль)');
    console.log('✅ Все цвета в стиле Telegram + iOS 26');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main();
