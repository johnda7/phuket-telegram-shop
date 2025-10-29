const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

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
        descriptionHtml
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  `;
  const result = await makeGraphQLRequest(query, { handle });
  return result.data?.productByHandle;
}

const shoppingCenters = [
  { handle: 'central-phuket-floresta', name: 'Central Phuket' },
  { handle: 'jungceylon-shopping-center', name: 'Jungceylon' },
  { handle: 'premium-outlet-phuket', name: 'Premium Outlet' },
  { handle: 'big-c-supercenter-phuket', name: 'Big C' },
  { handle: 'robinson-lifestyle-phuket', name: 'Robinson' },
  { handle: 'tesco-lotus-phuket', name: 'Tesco Lotus' },
  { handle: 'patong-night-market', name: 'Patong Night Market' }
];

async function main() {
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ: ТОРГОВЫЕ ЦЕНТРЫ');
  console.log('='.repeat(60));

  let totalPhotos = 0;
  let centersWithDescription = 0;
  let centersWithPhotos = 0;
  let centersPublished = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${center.name}`);
    
    try {
      const product = await getProductByHandle(center.handle);
      
      if (!product) {
        console.error(`❌ Продукт не найден: ${center.handle}`);
        continue;
      }
      
      const photoCount = product.images.edges.length;
      const hasDescription = product.descriptionHtml && product.descriptionHtml.length > 100;
      const isPublished = product.publishedAt !== null;
      
      totalPhotos += photoCount;
      if (hasDescription) centersWithDescription++;
      if (photoCount >= 3) centersWithPhotos++;
      if (isPublished) centersPublished++;
      
      console.log(`   ✅ Название: ${product.title}`);
      console.log(`   📦 Product Type: ${product.productType}`);
      console.log(`   🏷️ Tags: ${product.tags.length} тегов`);
      console.log(`   📸 Фотографий: ${photoCount}`);
      console.log(`   📝 Описание: ${hasDescription ? '✅ Есть' : '❌ Нет'} (${product.descriptionHtml?.length || 0} символов)`);
      console.log(`   📅 Опубликован: ${isPublished ? '✅ Да' : '❌ Нет'}`);
      console.log(`   🆔 ID: ${product.id}`);
      
      // Проверяем качество описания
      if (hasDescription) {
        const hasHeadings = product.descriptionHtml.includes('<h1>') || product.descriptionHtml.includes('<h2>');
        const hasLinks = product.descriptionHtml.includes('<a href');
        const hasFormatting = product.descriptionHtml.includes('<div') || product.descriptionHtml.includes('<p>');
        
        console.log(`   📋 Качество описания:`);
        console.log(`      ${hasHeadings ? '✅' : '❌'} Заголовки`);
        console.log(`      ${hasLinks ? '✅' : '❌'} Ссылки на сервисы`);
        console.log(`      ${hasFormatting ? '✅' : '❌'} HTML форматирование`);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка при проверке ${center.name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГОВАЯ СТАТИСТИКА:');
  console.log('='.repeat(60));
  console.log(`✅ Всего торговых центров: ${shoppingCenters.length}`);
  console.log(`✅ С описанием: ${centersWithDescription}/${shoppingCenters.length}`);
  console.log(`✅ С фотографиями (≥3): ${centersWithPhotos}/${shoppingCenters.length}`);
  console.log(`✅ Опубликованных: ${centersPublished}/${shoppingCenters.length}`);
  console.log(`📸 Всего фотографий: ${totalPhotos}`);
  console.log(`📸 Среднее на ТЦ: ${(totalPhotos / shoppingCenters.length).toFixed(1)}`);
  
  console.log('\n📋 ЧЕКЛИСТ ГОТОВНОСТИ:');
  console.log(`   ${centersWithDescription === shoppingCenters.length ? '✅' : '❌'} Все описания готовы`);
  console.log(`   ${centersWithPhotos === shoppingCenters.length ? '✅' : '❌'} Все фотографии загружены`);
  console.log(`   ${centersPublished === shoppingCenters.length ? '✅' : '❌'} Все опубликованы`);
  
  if (centersWithDescription === shoppingCenters.length && 
      centersWithPhotos === shoppingCenters.length && 
      centersPublished === shoppingCenters.length) {
    console.log('\n🎉 ВСЕ ГОТОВО! Категория "Торговые центры" полностью заполнена!');
  } else {
    console.log('\n⚠️ ТРЕБУЮТСЯ ДОРАБОТКИ:');
    if (centersWithDescription < shoppingCenters.length) {
      console.log('   - Добавить описания для оставшихся ТЦ');
    }
    if (centersWithPhotos < shoppingCenters.length) {
      console.log('   - Загрузить фотографии для оставшихся ТЦ');
    }
    if (centersPublished < shoppingCenters.length) {
      console.log('   - Опубликовать оставшиеся ТЦ');
    }
  }
  
  console.log('\n🔗 Проверить на сайте: http://localhost:8080/category/shopping');
}

main().catch(console.error);
