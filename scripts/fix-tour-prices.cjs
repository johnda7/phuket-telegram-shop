#!/usr/bin/env node

/**
 * 🔧 ИСПРАВЛЕНИЕ ЦЕН ДЛЯ ТУРОВ С ОШИБКАМИ
 * 
 * Исправляет цены для туров которые были загружены с неправильными ценами
 */

const https = require('https');
const http = require('http');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

// Туры которые нужно исправить (те у которых цены 0 или неправильные)
const TOURS_TO_FIX = [
  { handle: 'james-bond-island-tour', priceAdult: 1400, priceChild: 0 },
  { handle: '4-pearls-andaman-sea', priceAdult: 2000, priceChild: 1500 },
  { handle: 'eleven-islands-standard-tour', priceAdult: 1800, priceChild: 1500 },
];

// ============================================================================
// FUNCTIONS
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
          if (jsonData.errors) reject(new Error(JSON.stringify(jsonData.errors)));
          else resolve(jsonData.data);
        } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function makeRESTRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
    };
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function getProductId(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        variants(first: 5) {
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
  `;
  
  const data = await makeGraphQLRequest(query, { handle });
  return data.productByHandle;
}

async function updateVariantPrice(variantId, price) {
  const path = `/variants/${variantId.replace('gid://shopify/ProductVariant/', '')}.json`;
  const variantData = {
    variant: {
      id: variantId.replace('gid://shopify/ProductVariant/', ''),
      price: String(price),
    }
  };
  
  if (!APPLY) {
    console.log(`   🧪 DRY-RUN: Обновление варианта ${variantId} → ${price} ฿`);
    return true;
  }
  
  const response = await makeRESTRequest('PUT', path, variantData);
  return response.status === 200;
}

async function createChildVariant(productId, price) {
  const path = `/products/${productId.replace('gid://shopify/Product/', '')}/variants.json`;
  const variantData = {
    variant: {
      title: 'Детский (4-11 лет)',
      price: String(price),
      option1: 'Детский (4-11 лет)',
    }
  };
  
  if (!APPLY) {
    console.log(`   🧪 DRY-RUN: Создание детского варианта → ${price} ฿`);
    return true;
  }
  
  const response = await makeRESTRequest('POST', path, variantData);
  return response.status === 201;
}

async function fixTour(tourFix) {
  console.log(`\n🔧 Исправляем: ${tourFix.handle}`);
  
  try {
    const product = await getProductId(tourFix.handle);
    if (!product) {
      console.error(`   ❌ Продукт не найден!`);
      return false;
    }
    
    const variants = product.variants.edges.map(e => e.node);
    console.log(`   ✅ Найден продукт: ${product.id}`);
    console.log(`   📊 Вариантов: ${variants.length}`);
    
    // Обновляем первый вариант (взрослый)
    if (variants.length > 0) {
      const firstVariant = variants[0];
      if (parseFloat(firstVariant.price) !== tourFix.priceAdult) {
        console.log(`   💰 Обновляем взрослый: ${firstVariant.price} → ${tourFix.priceAdult} ฿`);
        await updateVariantPrice(firstVariant.id, tourFix.priceAdult);
        
        // Обновляем название варианта
        if (!APPLY) {
          console.log(`   🧪 DRY-RUN: Переименование варианта в "Взрослый"`);
        } else {
          const updateQuery = `
            mutation UpdateVariant($id: ID!, $title: String!) {
              productVariantUpdate(input: { id: $id, title: $title }) {
                productVariant { id title }
                userErrors { field message }
              }
            }
          `;
          try {
            await makeGraphQLRequest(updateQuery, { id: firstVariant.id, title: 'Взрослый' });
          } catch (e) {
            console.log(`   ⚠️  Не удалось переименовать вариант`);
          }
        }
      } else {
        console.log(`   ✅ Взрослый цена уже правильная: ${firstVariant.price} ฿`);
      }
    }
    
    // Создаем детский вариант если нужно
    if (tourFix.priceChild > 0) {
      const hasChild = variants.some(v => v.title.includes('Детск') || v.title.includes('child'));
      if (!hasChild) {
        console.log(`   👶 Создаем детский вариант: ${tourFix.priceChild} ฿`);
        await createChildVariant(product.id, tourFix.priceChild);
      } else {
        const childVariant = variants.find(v => v.title.includes('Детск') || v.title.includes('child'));
        if (childVariant && parseFloat(childVariant.price) !== tourFix.priceChild) {
          console.log(`   💰 Обновляем детский: ${childVariant.price} → ${tourFix.priceChild} ฿`);
          await updateVariantPrice(childVariant.id, tourFix.priceChild);
        } else {
          console.log(`   ✅ Детский цена уже правильная: ${childVariant.price} ฿`);
        }
      }
    }
    
    console.log(`   ✅ Готово!`);
    return true;
  } catch (error) {
    console.error(`   ❌ Ошибка:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 ИСПРАВЛЕНИЕ ЦЕН ДЛЯ ТУРОВ');
  console.log('='.repeat(60));
  console.log(`📦 Туров для исправления: ${TOURS_TO_FIX.length}`);
  console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);
  
  if (!APPLY) {
    console.log('💡 Для реального исправления добавьте флаг --apply\n');
  }
  
  let successCount = 0;
  
  for (let i = 0; i < TOURS_TO_FIX.length; i++) {
    const tour = TOURS_TO_FIX[i];
    const success = await fixTour(tour);
    if (success) successCount++;
    
    if (i < TOURS_TO_FIX.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успешно исправлено: ${successCount}/${TOURS_TO_FIX.length}`);
  console.log('🌐 Проверьте: http://localhost:8080/phuket');
}

main().catch(console.error);

