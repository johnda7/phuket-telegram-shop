/**
 * Скрипт для загрузки Central Phuket в Shopify
 * 
 * Использование:
 * node scripts/upload-central-phuket.js
 */

import { centralPhuket } from '../src/data/central-phuket.ts';
import https from 'https';

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

/**
 * Выполняет GraphQL запрос к Shopify Admin API
 */
async function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });

    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Создаёт продукт в Shopify
 */
async function createProduct(placeData) {
  console.log(`\n📦 Создаём продукт: ${placeData.title}...`);

  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
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

  const input = {
    title: placeData.title,
    handle: placeData.handle,
    descriptionHtml: placeData.description.replace(/\n/g, '<br>'),
    productType: placeData.productType,
    vendor: placeData.vendor,
    tags: placeData.tags,
    status: 'ACTIVE'
  };

  try {
    const result = await shopifyAdminRequest(mutation, { input });
    
    if (result.data?.productCreate?.userErrors?.length > 0) {
      console.error('❌ Ошибки при создании:', result.data.productCreate.userErrors);
      return null;
    }

    const product = result.data.productCreate.product;
    console.log(`✅ Продукт создан: ${product.title} (ID: ${product.id})`);
    
    return product;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return null;
  }
}

/**
 * Добавляет метаполя к продукту
 */
async function addMetafields(productId, metafields) {
  console.log(`\n📝 Добавляем ${metafields.length} метаполей...`);

  for (const metafield of metafields) {
    const mutation = `
      mutation createMetafield($input: MetafieldInput!) {
        metafieldSet(metafield: $input) {
          metafield {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      namespace: metafield.namespace,
      key: metafield.key,
      value: metafield.value,
      type: metafield.type,
      ownerId: productId
    };

    try {
      const result = await shopifyAdminRequest(mutation, { input });
      
      if (result.data?.metafieldSet?.userErrors?.length > 0) {
        console.error(`  ❌ Ошибка для ${metafield.key}:`, result.data.metafieldSet.userErrors);
      } else {
        console.log(`  ✅ Добавлено метаполе: ${metafield.key}`);
      }
      
      // Задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`  ❌ Ошибка для ${metafield.key}:`, error.message);
    }
  }
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Начинаем загрузку Central Phuket в Shopify...\n');
  console.log(`📍 Store: ${SHOPIFY_STORE}`);
  console.log(`🏷️  Категория: ${centralPhuket.tags.join(', ')}\n`);

  // Шаг 1: Создаём продукт
  const product = await createProduct(centralPhuket);
  
  if (!product) {
    console.error('\n❌ Не удалось создать продукт. Прерываем выполнение.');
    process.exit(1);
  }

  // Шаг 2: Добавляем метаполя
  await addMetafields(product.id, centralPhuket.metafields);

  console.log('\n' + '='.repeat(60));
  console.log('✅ УСПЕШНО! Central Phuket загружен в Shopify');
  console.log('='.repeat(60));
  console.log(`\n📝 Детали:`);
  console.log(`   ID: ${product.id}`);
  console.log(`   Handle: ${product.handle}`);
  console.log(`   URL: https://${SHOPIFY_STORE}/products/${product.handle}`);
  console.log(`\n💡 Проверьте страницу: http://localhost:8080/category/shopping\n`);
}

// Запуск
main().catch((error) => {
  console.error('\n❌ Критическая ошибка:', error);
  process.exit(1);
});
