// Проверяем metafields через Storefront API

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';

const QUERY = `
  query {
    productByHandle(handle: "jungceylon-shopping-center") {
      id
      title
      metafields(identifiers: [
        {namespace: "place_info", key: "rating"},
        {namespace: "place_info", key: "district"},
        {namespace: "place_info", key: "coordinates"},
        {namespace: "custom", key: "rating"},
        {namespace: "custom", key: "district"},
        {namespace: "custom", key: "coordinates"}
      ]) {
        key
        namespace
        value
      }
    }
  }
`;

function storefrontRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
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

async function checkStorefrontMetafields() {
  console.log('🔍 ПРОВЕРЯЕМ METAFIELDS ЧЕРЕЗ STOREFRONT API\n');
  
  try {
    const data = await storefrontRequest(QUERY);

    const product = data.data?.productByHandle;
    if (!product) {
      console.error('❌ Продукт не найден');
      console.log('📋 Ответ API:', JSON.stringify(data, null, 2));
      return;
    }
    
    console.log(`🏢 Продукт: ${product.title}`);
    console.log(`🆔 ID: ${product.id}\n`);

    console.log('📋 METAFIELDS ЧЕРЕЗ STOREFRONT API:');
    console.log('='.repeat(60));
    
    if (product.metafields && product.metafields.length > 0) {
      product.metafields.forEach((metafield, index) => {
        if (metafield) {
          console.log(`${index + 1}. Namespace: "${metafield.namespace}" | Key: "${metafield.key}" | Value: "${metafield.value}"`);
        } else {
          console.log(`${index + 1}. NULL metafield`);
        }
      });
    } else {
      console.log('❌ НЕТ METAFIELDS!');
      console.log('📋 Структура metafields:', JSON.stringify(product.metafields, null, 2));
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

checkStorefrontMetafields();
