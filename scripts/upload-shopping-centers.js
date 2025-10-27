// Скрипт для загрузки всех торговых центров Пхукета в Shopify
// Основано на анализе phuket-insider.com + наша философия iOS 26

const https = require('https');
const shoppingCenters = require('../src/data/shopping-centers.ts');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const SHOPIFY_API_VERSION = '2025-07';

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.errors) {
            reject(new Error(JSON.stringify(result.errors, null, 2)));
          } else {
            resolve(result.data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function createProduct(placeData) {
  const mutation = `
    mutation productCreate($input: ProductInput!) {
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
    productType: placeData.productType,
    vendor: placeData.vendor,
    tags: placeData.tags,
    descriptionHtml: placeData.description.replace(/\n/g, '<br>'),
    variants: [{ title: 'Default', price: '0.00' }]
  };

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.productCreate.userErrors.length > 0) {
    throw new Error(JSON.stringify(result.productCreate.userErrors, null, 2));
  }

  return result.productCreate.product;
}

async function addMetafields(productId, metafields) {
  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
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

  const metafieldsInput = metafields.map(mf => ({
    ownerId: productId,
    namespace: mf.namespace,
    key: mf.key,
    value: mf.value,
    type: mf.type
  }));

  const result = await shopifyAdminRequest(mutation, { metafields: metafieldsInput });
  
  if (result.metafieldsSet.userErrors.length > 0) {
    throw new Error(JSON.stringify(result.metafieldsSet.userErrors, null, 2));
  }

  return result.metafieldsSet.metafields;
}

async function checkProductExists(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  try {
    const result = await shopifyAdminRequest(query, { handle });
    return result.productByHandle;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🛍️ Загружаем торговые центры Пхукета в Shopify...\n');

  for (const center of shoppingCenters.default || shoppingCenters) {
    try {
      console.log(`📦 Обрабатываем: ${center.title}`);
      
      // Проверяем, существует ли продукт
      const existing = await checkProductExists(center.handle);
      
      if (existing) {
        console.log(`⚠️  Продукт уже существует: ${existing.title}`);
        continue;
      }

      // Создаем продукт
      const product = await createProduct(center);
      console.log(`✅ Создан продукт: ${product.title}`);

      // Добавляем метаполя
      if (center.metafields && center.metafields.length > 0) {
        await addMetafields(product.id, center.metafields);
        console.log(`✅ Добавлены метаполя: ${center.metafields.length} полей`);
      }

      console.log(`🎉 Готово: ${center.title}\n`);
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${center.title}:`, error.message);
    }
  }

  console.log('🏁 Загрузка завершена!');
}

// Запускаем скрипт
main().catch(console.error);

