// Исправляем название Central Phuket Floresta на просто Central Phuket

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const PRODUCT_ID = '7972352950326'; // Central Phuket Floresta Product ID

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

async function updateCentralPhuketName() {
  console.log('🏢 ИСПРАВЛЯЕМ НАЗВАНИЕ CENTRAL PHUKET\n');
  
  const mutation = `
    mutation updateProduct($id: ID!, $title: String!) {
      productUpdate(input: {
        id: $id,
        title: $title
      }) {
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
    id: `gid://shopify/Product/${PRODUCT_ID}`,
    title: 'Central Phuket (Централ Пхукет)'
  };

  try {
    console.log('📝 Обновляем название...');
    const result = await shopifyAdminRequest(mutation, variables);
    
    if (result.data.productUpdate.userErrors.length > 0) {
      console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
    } else {
      console.log('✅ Название обновлено!');
      console.log(`🏢 Новое название: ${result.data.productUpdate.product.title}`);
      console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID}`);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

updateCentralPhuketName().catch(console.error);
