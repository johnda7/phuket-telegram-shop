// Исправление metafields для торговых центров (метод Опуса)
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingCenters = [
  {
    handle: "central-phuket-floresta",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.6", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "3", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" }
    ]
  },
  {
    handle: "jungceylon-shopping-center",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.4", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "2", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "11:00-23:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" }
    ]
  },
  {
    handle: "premium-outlet-phuket",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.3", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "2", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "8.1234,98.3456", type: "single_line_text_field" }
    ]
  },
  {
    handle: "big-c-supercenter-phuket",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.2", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "1", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "08:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8456,98.3456", type: "single_line_text_field" }
    ]
  },
  {
    handle: "tesco-lotus-phuket",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.1", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "2", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "08:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8234,98.3456", type: "single_line_text_field" }
    ]
  },
  {
    handle: "robinson-lifestyle-phuket",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.3", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "2", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8456,98.2987", type: "single_line_text_field" }
    ]
  },
  {
    handle: "patong-night-market",
    metafields: [
      { namespace: "place_info", key: "rating", value: "4.5", type: "number_decimal" },
      { namespace: "place_info", key: "price_level", value: "1", type: "number_integer" },
      { namespace: "place_info", key: "working_hours", value: "17:00-23:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" }
    ]
  }
];

function shopifyAdminRequest(query, variables = {}) {
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
  const query = `query { productByHandle(handle: "${handle}") { id title } }`;
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

// Метод Опуса - по одному metafield за раз с metafieldSet
async function addMetafield(productId, metafield) {
  const mutation = `
    mutation createMetafield($input: MetafieldInput!) {
      metafieldSet(metafield: $input) {
        metafield { id key value }
        userErrors { field message }
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

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.data?.metafieldSet?.userErrors?.length > 0) {
    console.error(`  ❌ ${metafield.key}:`, result.data.metafieldSet.userErrors);
    return false;
  }

  console.log(`  ✅ ${metafield.key}: ${metafield.value}`);
  return true;
}

async function main() {
  console.log('🏷️  Исправление metafields (метод Опуса)...\n');

  let totalSuccess = 0;
  let totalErrors = 0;

  for (const center of shoppingCenters) {
    console.log(`\n📦 ${center.handle}`);
    
    try {
      const product = await findProductByHandle(center.handle);
      
      if (!product) {
        console.log('  ❌ Продукт не найден');
        totalErrors++;
        continue;
      }

      console.log(`  ✅ Продукт: ${product.title}`);
      console.log(`  ➕ Добавление ${center.metafields.length} metafields по одному...`);

      for (const metafield of center.metafields) {
        const success = await addMetafield(product.id, metafield);
        if (success) {
          totalSuccess++;
        } else {
          totalErrors++;
        }
        // Задержка между metafields
        await new Promise(resolve => setTimeout(resolve, 300));
      }

    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
      totalErrors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно добавлено metafields: ${totalSuccess}`);
  console.log(`❌ Ошибок: ${totalErrors}`);
  console.log(`📦 Всего центров: ${shoppingCenters.length}`);
  console.log('\n💡 Проверьте: http://localhost:8080/category/shopping');
  console.log('⏱️  Подождите 1-2 минуты для обновления Storefront API кэша\n');
}

main().catch(console.error);


