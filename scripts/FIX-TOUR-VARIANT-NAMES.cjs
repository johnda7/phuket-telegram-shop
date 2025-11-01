#!/usr/bin/env node

/**
 * 🔧 ИСПРАВЛЕНИЕ НАЗВАНИЙ ВАРИАНТОВ ТУРОВ
 * 
 * Заменяет "Default Title" и английские названия на правильные русские
 */

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

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

async function getAllTours() {
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions tag:tour") {
        edges {
          node {
            id
            title
            handle
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  
  const allTours = [];
  let after = null;
  
  do {
    const data = await makeGraphQLRequest(query, { first: 100, after });
    const { edges, pageInfo } = data.products;
    allTours.push(...edges.map(e => e.node));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  
  return allTours;
}

async function updateVariantTitle(variantId, title) {
  const variantIdNum = variantId.replace('gid://shopify/ProductVariant/', '');
  const path = `/variants/${variantIdNum}.json`;
  const variantData = {
    variant: {
      id: variantIdNum,
      title: title
    }
  };
  
  if (!APPLY) {
    console.log(`   🧪 DRY-RUN: Обновление варианта ${variantIdNum} → "${title}"`);
    return true;
  }
  
  const response = await makeRESTRequest('PUT', path, variantData);
  return response.status === 200;
}

async function main() {
  console.log('🔧 ИСПРАВЛЕНИЕ НАЗВАНИЙ ВАРИАНТОВ ТУРОВ');
  console.log('='.repeat(70));
  console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);
  
  const tours = await getAllTours();
  console.log(`✅ Найдено туров: ${tours.length}\n`);
  
  let updatedCount = 0;
  
  for (const tour of tours) {
    const variants = tour.variants.edges.map(e => e.node);
    let needsUpdate = false;
    
    for (const variant of variants) {
      const title = variant.title;
      
      // Проверяем нужно ли исправлять
      if (title === 'Default Title' || 
          title === 'Title' || 
          title.toLowerCase() === 'adult' ||
          title.toLowerCase() === 'child' ||
          title === 'Взрослый (Adult)' ||
          title === 'Детский (Child)') {
        needsUpdate = true;
        
        // Определяем правильное название
        let newTitle;
        if (variants.length === 1) {
          newTitle = 'Взрослый';
        } else {
          // Первый вариант = взрослый, остальные = детский
          const isFirst = variants[0].id === variant.id;
          newTitle = isFirst ? 'Взрослый' : 'Детский (4-11 лет)';
        }
        
        console.log(`📦 ${tour.title}`);
        console.log(`   Вариант: "${title}" → "${newTitle}"`);
        
        if (APPLY) {
          await updateVariantTitle(variant.id, newTitle);
          console.log(`   ✅ Обновлено`);
        }
        
        updatedCount++;
      }
    }
    
    if (needsUpdate) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ ОБРАБОТКА ЗАВЕРШЕНА!`);
  console.log(`📊 Обновлено вариантов: ${updatedCount}`);
  
  if (!APPLY) {
    console.log(`\n💡 Для реального обновления добавьте флаг --apply`);
  }
}

main().catch(console.error);

