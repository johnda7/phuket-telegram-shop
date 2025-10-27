// Скрипт для добавления metafields к торговым центрам

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingMetafields = [
  {
    handle: "central-phuket-floresta",
    metafields: [
      { key: "rating", value: "4.6" },
      { key: "price_level", value: "3" },
      { key: "working_hours", value: "10:00-22:00 ежедневно" },
      { key: "district", value: "PhuketTown" },
      { key: "coordinates", value: "7.8904,98.2924" }
    ]
  },
  {
    handle: "jungceylon-shopping-center",
    metafields: [
      { key: "rating", value: "4.4" },
      { key: "price_level", value: "2" },
      { key: "working_hours", value: "11:00-23:00 ежедневно" },
      { key: "district", value: "Patong" },
      { key: "coordinates", value: "7.8965,98.2965" }
    ]
  },
  {
    handle: "premium-outlet-phuket",
    metafields: [
      { key: "rating", value: "4.3" },
      { key: "price_level", value: "2" },
      { key: "working_hours", value: "10:00-22:00 ежедневно" },
      { key: "district", value: "Thalang" },
      { key: "coordinates", value: "8.1234,98.3456" }
    ]
  },
  {
    handle: "big-c-supercenter-phuket",
    metafields: [
      { key: "rating", value: "4.2" },
      { key: "price_level", value: "1" },
      { key: "working_hours", value: "08:00-22:00 ежедневно" },
      { key: "district", value: "PhuketTown" },
      { key: "coordinates", value: "7.8456,98.3456" }
    ]
  },
  {
    handle: "tesco-lotus-phuket",
    metafields: [
      { key: "rating", value: "4.1" },
      { key: "price_level", value: "2" },
      { key: "working_hours", value: "08:00-22:00 ежедневно" },
      { key: "district", value: "PhuketTown" },
      { key: "coordinates", value: "7.8234,98.3456" }
    ]
  },
  {
    handle: "robinson-lifestyle-phuket",
    metafields: [
      { key: "rating", value: "4.3" },
      { key: "price_level", value: "2" },
      { key: "working_hours", value: "10:00-22:00 ежедневно" },
      { key: "district", value: "PhuketTown" },
      { key: "coordinates", value: "7.8456,98.2987" }
    ]
  },
  {
    handle: "patong-night-market",
    metafields: [
      { key: "rating", value: "4.5" },
      { key: "price_level", value: "1" },
      { key: "working_hours", value: "17:00-23:00 ежедневно" },
      { key: "district", value: "Patong" },
      { key: "coordinates", value: "7.8965,98.2965" }
    ]
  }
];

function shopifyAdminRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
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
      res.on('data', (chunk) => { data += chunk; });
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

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function findProductByHandle(handle) {
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
      }
    }
  `;
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function addMetafields(productId, metafields) {
  const metafieldsInput = metafields.map(m => `
    {
      ownerId: "${productId}"
      namespace: "place_info"
      key: "${m.key}"
      value: "${m.value}"
      type: "single_line_text_field"
    }
  `).join(',');

  const mutation = `
    mutation {
      metafieldsSet(metafields: [${metafieldsInput}]) {
        metafields {
          id
          namespace
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

  const result = await shopifyAdminRequest(mutation);
  
  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error('  ❌ Ошибки:', result.data.metafieldsSet.userErrors);
    return false;
  }

  return true;
}

async function main() {
  console.log('🏷️  Добавление metafields для торговых центров...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const item of shoppingMetafields) {
    console.log(`\n📦 ${item.handle}`);
    
    try {
      const product = await findProductByHandle(item.handle);
      
      if (!product) {
        console.log('  ❌ Продукт не найден');
        errorCount++;
        continue;
      }

      console.log(`  ✅ Продукт найден: ${product.title}`);
      console.log(`  ➕ Добавление ${item.metafields.length} metafields...`);

      const success = await addMetafields(product.id, item.metafields);
      
      if (success) {
        console.log('  ✅ Metafields добавлены!');
        successCount++;
      } else {
        errorCount++;
      }

      // Небольшая задержка
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📦 Всего обработано: ${shoppingMetafields.length}`);
  console.log('\n💡 Проверьте: http://localhost:8080/category/shopping');
  console.log('⏱️  Подождите 1-2 минуты для обновления Storefront API кэша\n');
}

main().catch(console.error);


