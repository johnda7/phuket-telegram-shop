// Тестируем metafields через Admin API

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const query = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      metafields(first: 20, namespace: "custom") {
        edges {
          node {
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

async function testMetafieldsAdmin() {
  console.log('🔍 ТЕСТИРУЕМ METAFIELDS ЧЕРЕЗ ADMIN API\n');
  
  try {
    const result = await shopifyAdminRequest(query, { handle: 'jungceylon-shopping-center' });
    const product = result.data.product;
    
    console.log(`🏢 ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   ID: ${product.id}`);
    
    if (product.metafields.edges.length > 0) {
      console.log('\n📊 Metafields:');
      product.metafields.edges.forEach(edge => {
        const metafield = edge.node;
        console.log(`   ${metafield.namespace}.${metafield.key}: ${metafield.value} (${metafield.type})`);
      });
    } else {
      console.log('\n❌ Нет metafields!');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testMetafieldsAdmin();

