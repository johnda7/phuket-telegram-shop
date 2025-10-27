// Исправляем namespace metafields с custom на place_info

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingCenters = [
  { handle: 'central-phuket-floresta', id: 'gid://shopify/Product/7972352950326' },
  { handle: 'jungceylon-shopping-center', id: 'gid://shopify/Product/7974403080246' },
  { handle: 'premium-outlet-phuket', id: 'gid://shopify/Product/7974403145782' },
  { handle: 'big-c-supercenter-phuket', id: 'gid://shopify/Product/7974403244086' },
  { handle: 'tesco-lotus-phuket', id: 'gid://shopify/Product/7974403604534' },
  { handle: 'robinson-lifestyle-phuket', id: 'gid://shopify/Product/7974403702838' },
];

const metafieldsToUpdate = [
  { key: 'coordinates', value: '7.8904,98.2924' },
  { key: 'rating', value: '4.6' },
  { key: 'district', value: 'Cherngtalay' },
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

async function updateMetafields(productId, metafields) {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: productId,
      metafields: metafields.map(metafield => ({
        namespace: "place_info",
        key: metafield.key,
        value: metafield.value,
        type: "single_line_text_field"
      }))
    }
  };

  return await shopifyAdminRequest(mutation, variables);
}

async function main() {
  console.log('🔧 ИСПРАВЛЯЕМ NAMESPACE METAFIELDS\n');
  console.log('📋 Меняем с "custom" на "place_info"\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`🏢 [${i + 1}/${shoppingCenters.length}] ${center.handle}`);
    console.log(`   ID: ${center.id.split('/').pop()}`);

    try {
      // Обновляем metafields с правильным namespace
      const result = await updateMetafields(center.id, metafieldsToUpdate);
      
      if (result.data.productUpdate.userErrors.length > 0) {
        console.error(`   ❌ Ошибки:`, result.data.productUpdate.userErrors);
        errorCount++;
      } else {
        console.log(`   ✅ Metafields обновлены!`);
        successCount++;
      }
      
      // Задержка между запросами
      if (i < shoppingCenters.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${shoppingCenters.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${shoppingCenters.length}`);

  if (successCount === shoppingCenters.length) {
    console.log('\n🎉 ВСЕ METAFIELDS ОБНОВЛЕНЫ!');
    console.log('🔗 Теперь проверь в браузере: http://localhost:8080/place/jungceylon-shopping-center');
  }
}

main().catch(console.error);

