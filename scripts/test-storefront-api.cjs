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
  console.log('🔍 ТЕСТ STOREFRONT API');
  console.log('='.repeat(30));

  try {
    // 1. Простой запрос продуктов
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
              metafields(identifiers: [
                {namespace: "custom", key: "coordinates"},
                {namespace: "custom", key: "rating"},
                {namespace: "custom", key: "district"}
              ]) {
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;
    
    console.log('📥 Загружаем продукты через Storefront API...');
    const data = await makeGraphQLRequest(query, { first: 10 });
    const products = data.data.products.edges;
    
    console.log(`📊 Всего продуктов: ${products.length}`);
    
    // 2. Показать детали
    products.forEach((product, index) => {
      console.log(`\n📝 [${index + 1}] ${product.node.title}`);
      console.log(`   Handle: ${product.node.handle}`);
      console.log(`   Product Type: ${product.node.productType}`);
      console.log(`   Tags: ${product.node.tags.join(', ')}`);
      console.log(`   Metafields: ${product.node.metafields ? product.node.metafields.length : 0}`);
      
      if (product.node.metafields && product.node.metafields.length > 0) {
        product.node.metafields.forEach(meta => {
          if (meta) {
            console.log(`     ${meta.namespace}.${meta.key}: ${meta.value}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main().catch(console.error);
