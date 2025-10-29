const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

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
      }
    }
  `;
  const result = await makeGraphQLRequest(query, { handle });
  return result.data?.productByHandle;
}

// Функция для обновления продукта
async function updateProduct(productId, productType, tags) {
  const mutation = `
    mutation updateProduct($id: ID!, $productType: String!, $tags: [String!]!) {
      productUpdate(input: {
        id: $id,
        productType: $productType,
        tags: $tags
      }) {
        product {
          id
          title
          productType
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: productId,
    productType: productType,
    tags: tags
  };

  const data = await makeGraphQLRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }
  return data.data.productUpdate;
}

// Основная функция
async function main() {
  console.log('🔧 ИСПРАВЛЕНИЕ PATONG NIGHT MARKET');
  console.log('='.repeat(40));

  try {
    // 1. Найти продукт
    console.log('🔍 Ищем продукт: patong-night-market');
    const product = await getProductByHandle('patong-night-market');
    
    if (!product) {
      console.error('❌ Продукт не найден: patong-night-market');
      return;
    }
    
    console.log(`✅ Найден: ${product.title}`);
    console.log(`🆔 ID: ${product.id}`);
    console.log(`📦 Текущий Product Type: ${product.productType}`);
    console.log(`🏷️ Текущие теги: ${product.tags.join(', ')}`);
    
    // 2. Обновить productType и теги
    const newProductType = 'Information';
    const newTags = [
      'bargaining',
      'category:shopping',
      'district:Patong',
      'market',
      'night',
      'place',
      'shopping',
      'souvenirs',
      'info',        // Добавляем
      'insider'      // Добавляем
    ];
    
    console.log('\n🔧 Обновляем productType и теги...');
    const updateResult = await updateProduct(product.id, newProductType, newTags);
    
    console.log('✅ Обновлено!');
    console.log(`📦 Новый Product Type: ${updateResult.product.productType}`);
    console.log(`🏷️ Новые теги: ${updateResult.product.tags.join(', ')}`);
    
    console.log('\n🎉 Patong Night Market исправлен!');
    console.log('🔗 Проверьте: http://localhost:8080/place/patong-night-market');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main().catch(console.error);
