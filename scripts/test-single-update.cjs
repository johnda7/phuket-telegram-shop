const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function testUpdate() {
  try {
    console.log('🔄 Тестируем обновление Jungceylon...');
    
    // Сначала получим ID продукта
    const getProductQuery = `
      query {
        productByHandle(handle: "jungceylon-shopping-center") {
          id
          title
        }
      }
    `;
    
    const productResult = await makeGraphQLRequest(getProductQuery);
    console.log('Product result:', JSON.stringify(productResult, null, 2));
    
    if (!productResult.data.productByHandle) {
      console.log('❌ Продукт не найден');
      return;
    }
    
    const productId = productResult.data.productByHandle.id;
    console.log('Product ID:', productId);
    
    // Простое обновление
    const simpleHtml = '<div class="space-y-6"><h1>Test Update</h1><p>This is a test update.</p></div>';
    
    const updateMutation = `
      mutation {
        productUpdate(input: {
          id: "${productId}",
          descriptionHtml: ${JSON.stringify(simpleHtml)}
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
    
    console.log('Executing mutation...');
    const updateResult = await makeGraphQLRequest(updateMutation);
    console.log('Update result:', JSON.stringify(updateResult, null, 2));
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

testUpdate();
