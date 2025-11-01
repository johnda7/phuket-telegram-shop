#!/usr/bin/env node

/**
 * 🚀 ИСПРАВЛЕНИЕ ВСЕХ HANDLES С ЭМОДЗИ
 * 
 * Убирает эмодзи из handles и titles для SEO
 */

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

console.log('🚀 ИСПРАВЛЕНИЕ HANDLES С ЭМОДЗИ');
console.log('='.repeat(70));
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

// ============================================================================
// GRAPHQL REQUEST HELPER
// ============================================================================

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData.data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ============================================================================
// CREATE CLEAN HANDLE
// ============================================================================

function createCleanHandle(title) {
  // Map Russian words to English equivalents for better SEO
  const translations = {
    'остров': 'island',
    'острова': 'islands',
    'островов': 'islands',
    'мега': 'mega',
    'тур': 'tour',
    'рафтинг': 'rafting',
    'слоновье': 'elephant',
    'спа': 'spa',
    'као': 'kao',
    'лак': 'lak',
    'сафари': 'safari',
    'аватар': 'avatar',
    'плюс': 'plus',
    'одиннадцать': 'eleven',
    '11': 'eleven',
    'дней': 'days',
    'дня': 'days',
    'день': 'day',
    'ночь': 'night',
    'ночи': 'night'
  };

  let handle = title
    .replace(/[⭐🏝️🎬🌊⛵🤿🏖️🌅🐘🚣🦅]/g, '') // Remove all emojis
    .replace(/\s+/g, ' ')
    .trim();

  // Try to translate Russian to English
  const words = handle.toLowerCase().split(/\s+/);
  const translatedWords = words.map(word => {
    // Remove special chars from word
    const cleanWord = word.replace(/[^\wа-яёА-ЯЁ]/g, '');
    return translations[cleanWord] || cleanWord;
  });

  handle = translatedWords
    .join(' ')
    .replace(/[^\w\s-]/g, '') // Remove special chars except dash and space
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove multiple dashes
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

  // Fallback if handle is too short or empty
  if (handle.length < 3) {
    // Use transliteration as fallback
    const translit = title
      .replace(/[⭐🏝️🎬🌊⛵🤿🏖️🌅🐘🚣🦅]/g, '')
      .replace(/[^\w\s-]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    if (translit.length >= 3) {
      return translit;
    }
  }

  return handle;
}

// ============================================================================
// CREATE CLEAN TITLE (keep emoji, but make SEO-friendly)
// ============================================================================

function createCleanTitle(title) {
  // Keep emoji at the end if needed, but clean the main part
  return title
    .replace(/[⭐🏝️🎬🌊⛵🤿🏖️🌅🐘🚣🦅]/g, '') // Remove emojis for SEO
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// GET ALL PRODUCTS
// ============================================================================

async function getAllProducts() {
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            productType
            tags
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const allProducts = [];
  let after = null;

  do {
    const data = await makeGraphQLRequest(query, { first: 250, after });
    const { edges, pageInfo } = data.products;
    allProducts.push(...edges.map(e => e.node));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return allProducts;
}

// ============================================================================
// FIX HANDLE
// ============================================================================

async function fixProductHandle(productId, newHandle, newTitle) {
  const mutation = `
    mutation UpdateProduct($id: ID!, $handle: String!, $title: String!) {
      productUpdate(input: {
        id: $id
        handle: $handle
        title: $title
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
  `;

  return await makeGraphQLRequest(mutation, {
    id: productId,
    handle: newHandle,
    title: newTitle
  });
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function fixAllEmojiHandles() {
  try {
    console.log('📋 Получаем список всех продуктов...');
    const products = await getAllProducts();
    
    // Find products with emojis in handle
    const emojiProducts = products.filter(p => {
      // Check for emojis or Cyrillic in handle
      return /[\u{1F300}-\u{1F9FF}]/u.test(p.handle) || 
             /[А-Яа-яЁё]/.test(p.handle) ||
             /[\u{1F300}-\u{1F9FF}]/u.test(p.title);
    });

    console.log(`✅ Найдено ${emojiProducts.length} продуктов с эмодзи/кириллицей\n`);

    if (emojiProducts.length === 0) {
      console.log('✅ Все handles чистые!');
      return;
    }

    for (let i = 0; i < emojiProducts.length; i++) {
      const product = emojiProducts[i];
      console.log(`\n🔄 [${i + 1}/${emojiProducts.length}] ${product.title}`);
      console.log(`   Текущий handle: ${product.handle}`);

      const cleanHandle = createCleanHandle(product.title);
      const cleanTitle = createCleanTitle(product.title);

      console.log(`   Новый handle: ${cleanHandle}`);
      console.log(`   Новый title: ${cleanTitle}`);

      // Check if handle already exists
      const existing = products.find(p => p.handle === cleanHandle && p.id !== product.id);
      if (existing) {
        console.log(`   ⚠️  Handle "${cleanHandle}" уже существует! Используем вариант с суффиксом`);
        const altHandle = `${cleanHandle}-${Date.now().toString().slice(-6)}`;
        console.log(`   Альтернативный handle: ${altHandle}`);
        
        if (APPLY) {
          const result = await fixProductHandle(product.id, altHandle, cleanTitle);
          if (result.productUpdate.userErrors.length > 0) {
            console.error(`   ❌ Ошибки:`, result.productUpdate.userErrors);
          } else {
            console.log(`   ✅ Обновлено!`);
          }
        }
      } else {
        if (APPLY) {
          const result = await fixProductHandle(product.id, cleanHandle, cleanTitle);
          if (result.productUpdate.userErrors.length > 0) {
            console.error(`   ❌ Ошибки:`, result.productUpdate.userErrors);
          } else {
            console.log(`   ✅ Обновлено!`);
          }
        } else {
          console.log(`   ⏭️  DRY-RUN: пропускаем`);
        }
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log('\n🎉 Обработка завершена!');
    console.log('\n📱 Проверьте результат: http://localhost:8080/tours');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Run
if (require.main === module) {
  fixAllEmojiHandles();
}

module.exports = { fixAllEmojiHandles, createCleanHandle, createCleanTitle };

