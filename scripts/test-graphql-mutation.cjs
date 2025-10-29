const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        if (res.statusCode >= 400) {
          console.log('Error Response:', responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        } else {
          try {
            const result = JSON.parse(responseData);
            if (result.errors) {
              console.log('GraphQL Errors:', result.errors);
              reject(new Error(`GraphQL Errors: ${JSON.stringify(result.errors)}`));
            } else {
              resolve(result);
            }
          } catch (error) {
            console.log('Raw response:', responseData);
            reject(error);
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testGraphQLMutation() {
  try {
    console.log('🔄 Тестируем GraphQL mutation...');
    
    // Простая мутация
    const query = `
      mutation {
        productUpdate(input: {
          id: "gid://shopify/Product/7974403080246"
          title: "Jungceylon Shopping Center (Джангцелон) - Updated GraphQL"
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
    
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.productUpdate?.product) {
      console.log('✅ GraphQL mutation работает!');
      console.log('Updated product:', result.data.productUpdate.product.title);
    } else {
      console.log('❌ GraphQL mutation не работает');
      console.log('User errors:', result.data?.productUpdate?.userErrors);
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

testGraphQLMutation();
