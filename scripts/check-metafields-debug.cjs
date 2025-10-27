// Проверяем metafields для Jungceylon

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const GRAPHQL_URL = `https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`;

const QUERY = `
  query {
    productByHandle(handle: "jungceylon-shopping-center") {
      id
      title
      metafields(first: 20) {
        edges {
          node {
            id
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

function shopifyRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/admin/api/2025-07/graphql.json',
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

async function checkMetafields() {
  console.log('🔍 ПРОВЕРЯЕМ METAFIELDS ДЛЯ JUNGCYLON\n');
  
  try {
    const data = await shopifyRequest(QUERY);

    const product = data.data?.productByHandle;
    if (!product) {
      console.error('❌ Продукт не найден');
      console.log('📋 Ответ API:', JSON.stringify(data, null, 2));
      return;
    }
    
    console.log(`🏢 Продукт: ${product.title}`);
    console.log(`🆔 ID: ${product.id}\n`);

    console.log('📋 ВСЕ METAFIELDS:');
    console.log('='.repeat(60));
    
    product.metafields.edges.forEach((edge, index) => {
      const metafield = edge.node;
      console.log(`${index + 1}. Namespace: "${metafield.namespace}" | Key: "${metafield.key}" | Value: "${metafield.value}" | Type: ${metafield.type}`);
    });

    console.log('\n🔍 ИЩЕМ НУЖНЫЕ METAFIELDS:');
    console.log('='.repeat(60));
    
    const ratingMetafield = product.metafields.edges.find(e => e.node.key === 'rating');
    const districtMetafield = product.metafields.edges.find(e => e.node.key === 'district');
    const coordinatesMetafield = product.metafields.edges.find(e => e.node.key === 'coordinates');
    
    console.log(`Rating: ${ratingMetafield ? `"${ratingMetafield.node.value}" (${ratingMetafield.node.namespace})` : 'НЕ НАЙДЕН'}`);
    console.log(`District: ${districtMetafield ? `"${districtMetafield.node.value}" (${districtMetafield.node.namespace})` : 'НЕ НАЙДЕН'}`);
    console.log(`Coordinates: ${coordinatesMetafield ? `"${coordinatesMetafield.node.value}" (${coordinatesMetafield.node.namespace})` : 'НЕ НАЙДЕН'}`);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

checkMetafields();
