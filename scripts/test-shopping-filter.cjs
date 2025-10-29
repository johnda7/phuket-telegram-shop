const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const SHOPIFY_API_VERSION = '2025-07';

// Функция для выполнения GraphQL запросов
function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
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

// Основная функция
async function main() {
  console.log('🔍 ТЕСТ ФИЛЬТРАЦИИ ПО КАТЕГОРИИ SHOPPING');
  console.log('='.repeat(50));

  try {
    // 1. Получить все продукты
    const query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              productType
              tags
            }
          }
        }
      }
    `;
    
    console.log('📥 Загружаем все продукты...');
    const data = await makeGraphQLRequest(query, { first: 50 });
    const products = data.data.products.edges;
    
    console.log(`📊 Всего продуктов: ${products.length}`);
    
    // 2. Фильтровать по категории shopping
    const categoryTag = 'category:shopping';
    const shoppingProducts = products.filter(product => 
      product.node.tags.includes(categoryTag)
    );
    
    console.log(`🛍️ Продуктов с тегом "${categoryTag}": ${shoppingProducts.length}`);
    
    // 3. Показать детали
    shoppingProducts.forEach((product, index) => {
      console.log(`\n📝 [${index + 1}] ${product.node.title}`);
      console.log(`   Handle: ${product.node.handle}`);
      console.log(`   Product Type: ${product.node.productType}`);
      console.log(`   Tags: ${product.node.tags.join(', ')}`);
    });
    
    // 4. Проверить, что происходит в fetchProductsByCategory
    console.log('\n🔍 Симуляция fetchProductsByCategory:');
    console.log(`   Ищем тег: "${categoryTag}"`);
    console.log(`   Найдено: ${shoppingProducts.length} продуктов`);
    
    if (shoppingProducts.length === 0) {
      console.log('❌ ПРОБЛЕМА: Нет продуктов с тегом category:shopping!');
      console.log('   Возможные причины:');
      console.log('   1. Теги не синхронизированы с Storefront API');
      console.log('   2. Кеширование Storefront API');
      console.log('   3. Проблема с trial аккаунтом');
    } else {
      console.log('✅ Продукты найдены! Проблема в другом месте.');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main().catch(console.error);
