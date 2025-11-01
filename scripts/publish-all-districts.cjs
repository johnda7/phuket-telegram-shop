const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

/**
 * 📢 ПУБЛИКАЦИЯ ВСЕХ РАЙОНОВ
 * 
 * Публикует все районы в Online Store
 */

const districtHandles = [
  'patong-district',
  'karon-district',
  'kata-district',
  'bangtao-district',
  'rawai-district',
  'phuket-town-district',
  'surin-district',
  'kamala-district',
  'chalong-district',
  'panwa-district',
  'nai-harn-district',
  'kathu-district',
  'cherngtalay-district',
  'naiyang-district',
  'thalang-district'
];

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `
    query {
      products(first: 1, query: "handle:${handle}") {
        edges {
          node {
            id
            title
            handle
            publishedAt
          }
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  return result.data?.products?.edges?.[0]?.node;
}

async function publishProduct(productId, title) {
  // Сначала получаем список публикаций
  const getPublicationsQuery = `
    query {
      publications(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;
  
  const publicationsResult = await makeGraphQLRequest(getPublicationsQuery);
  const onlineStorePub = publicationsResult.data?.publications?.edges?.find(
    e => e.node.name === 'Online Store'
  );
  
  if (!onlineStorePub) {
    console.error('❌ Online Store публикация не найдена');
    return false;
  }
  
  const publicationId = onlineStorePub.node.id;
  
  const mutation = `
    mutation {
      publishablePublish(
        id: "${productId}", 
        input: {
          publicationId: "${publicationId}"
        }
      ) {
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(mutation);
  
  if (result.data?.publishablePublish?.userErrors?.length > 0) {
    console.error(`❌ Ошибки публикации ${title}:`, result.data.publishablePublish.userErrors);
    return false;
  }
  
  console.log(`✅ ${title} опубликован`);
  return true;
}

async function main() {
  console.log('🚀 ПУБЛИКАЦИЯ ВСЕХ РАЙОНОВ');
  console.log('='.repeat(60));
  
  let publishedCount = 0;
  let skippedCount = 0;
  
  for (const handle of districtHandles) {
    console.log(`\n📝 Обрабатываем: ${handle}`);
    
    const product = await getProductByHandle(handle);
    
    if (!product) {
      console.warn(`⚠️  Продукт не найден: ${handle}`);
      continue;
    }
    
    console.log(`   ID: ${product.id}`);
    console.log(`   Название: ${product.title}`);
    console.log(`   Опубликован: ${product.publishedAt ? 'Да' : 'Нет'}`);
    
    if (product.publishedAt) {
      console.log(`   ✅ Уже опубликован, пропускаем`);
      skippedCount++;
      continue;
    }
    
    const success = await publishProduct(product.id, product.title);
    if (success) {
      publishedCount++;
    }
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Опубликовано: ${publishedCount}`);
  console.log(`⏭️  Пропущено (уже опубликованы): ${skippedCount}`);
  console.log(`🔗 Проверьте: http://localhost:8080/category/districts`);
}

main().catch(console.error);

