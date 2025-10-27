// Скрипт для публикации всех торговых центров в Online Store

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';
const ONLINE_STORE_PUBLICATION_ID = 'gid://shopify/Publication/161102364726';

const shoppingCenters = [
  { handle: "central-phuket-floresta", title: "Central Phuket Floresta" },
  { handle: "jungceylon-shopping-center", title: "Jungceylon Shopping Center" },
  { handle: "premium-outlet-phuket", title: "Premium Outlet Phuket" },
  { handle: "big-c-supercenter-phuket", title: "Big C Supercenter Phuket" },
  { handle: "tesco-lotus-phuket", title: "Tesco Lotus Phuket" },
  { handle: "robinson-lifestyle-phuket", title: "Robinson Lifestyle Phuket" },
  { handle: "patong-night-market", title: "Patong Night Market" }
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
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
      }
    }
  `;

  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function publishProduct(productId, title) {
  const mutation = `
    mutation {
      publishablePublish(
        id: "${productId}", 
        input: [{
          publicationId: "${ONLINE_STORE_PUBLICATION_ID}"
        }]
      ) {
        publishable {
          ... on Product {
            id
            title
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest(mutation);
  
  if (result.data?.publishablePublish?.userErrors?.length > 0) {
    console.error(`❌ Ошибка публикации ${title}:`, result.data.publishablePublish.userErrors);
    return false;
  }

  console.log(`✅ ${title} опубликован в Online Store`);
  return true;
}

async function main() {
  console.log('🛍️ Публикация всех торговых центров в Online Store...\n');

  let publishedCount = 0;
  let alreadyPublishedCount = 0;
  let notFoundCount = 0;

  for (const center of shoppingCenters) {
    console.log(`\n📦 Обрабатываем: ${center.title}`);
    
    const product = await findProductByHandle(center.handle);
    
    if (!product) {
      console.log(`❌ Не найден в Shopify`);
      notFoundCount++;
      continue;
    }

    // Пропускаем проверку публикации, просто публикуем все

    const success = await publishProduct(product.id, center.title);
    if (success) {
      publishedCount++;
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Опубликовано: ${publishedCount}`);
  console.log(`✅ Уже было опубликовано: ${alreadyPublishedCount}`);
  console.log(`❌ Не найдено: ${notFoundCount}`);
  console.log(`📦 Всего обработано: ${shoppingCenters.length}`);
  console.log('\n💡 Проверьте: http://localhost:8080/category/shopping');
  console.log('⏱️  Подождите 1-2 минуты для обновления кэша Storefront API\n');
}

main().catch(console.error);
