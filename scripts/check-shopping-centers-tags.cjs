const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// Список торговых центров для проверки
const shoppingCenters = [
  'central-phuket-floresta',
  'jungceylon-shopping-center',
  'premium-outlet-phuket',
  'big-c-supercenter-phuket',
  'robinson-lifestyle-phuket',
  'tesco-lotus-phuket',
  'patong-night-market'
];

// Функция для выполнения GraphQL запросов
function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
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

// Функция для получения продукта по handle
async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        productType
        tags
        status
        publishedAt
      }
    }
  `;
  const result = await makeGraphQLRequest(query, { handle });
  return result.data?.productByHandle;
}

// Основная функция
async function main() {
  console.log('🔍 ПРОВЕРКА ТЕГОВ ТОРГОВЫХ ЦЕНТРОВ');
  console.log('='.repeat(50));

  for (let i = 0; i < shoppingCenters.length; i++) {
    const handle = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${handle}`);
    
    try {
      const product = await getProductByHandle(handle);
      
      if (!product) {
        console.error(`❌ Продукт не найден: ${handle}`);
        continue;
      }
      
      console.log(`✅ Найден: ${product.title}`);
      console.log(`🆔 ID: ${product.id}`);
      console.log(`📦 Product Type: ${product.productType}`);
      console.log(`🏷️ Tags: ${product.tags.join(', ')}`);
      console.log(`📊 Status: ${product.status}`);
      console.log(`📅 Published: ${product.publishedAt ? 'Да' : 'Нет'}`);
      
      // Проверяем, есть ли нужные теги
      const hasInfoTag = product.tags.includes('info');
      const hasInsiderTag = product.tags.includes('insider');
      const hasShoppingTag = product.tags.includes('shopping');
      
      console.log(`🔍 Анализ тегов:`);
      console.log(`   info: ${hasInfoTag ? '✅' : '❌'}`);
      console.log(`   insider: ${hasInsiderTag ? '✅' : '❌'}`);
      console.log(`   shopping: ${hasShoppingTag ? '✅' : '❌'}`);
      
      if (!hasInfoTag || !hasInsiderTag) {
        console.log(`⚠️ Нужно добавить теги: info, insider`);
      }
      
      if (product.productType !== 'Information') {
        console.log(`⚠️ Нужно изменить productType на: Information`);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка при проверке ${handle}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 ПРОВЕРКА ЗАВЕРШЕНА');
  console.log('='.repeat(50));
}

main().catch(console.error);
