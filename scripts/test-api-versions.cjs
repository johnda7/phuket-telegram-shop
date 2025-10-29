const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeRestRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: path,
      method: method,
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
            resolve(result);
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

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testVersions() {
  try {
    console.log('🔄 Тестируем разные версии API...');
    
    // Тестируем 2025-07
    console.log('\n--- Тестируем 2025-07 ---');
    try {
      const result = await makeRestRequest('GET', '/admin/api/2025-07/products.json?limit=1');
      console.log('✅ 2025-07 работает');
    } catch (error) {
      console.log('❌ 2025-07 не работает:', error.message);
    }
    
    // Тестируем 2024-10
    console.log('\n--- Тестируем 2024-10 ---');
    try {
      const result = await makeRestRequest('GET', '/admin/api/2024-10/products.json?limit=1');
      console.log('✅ 2024-10 работает');
    } catch (error) {
      console.log('❌ 2024-10 не работает:', error.message);
    }
    
    // Тестируем 2024-07
    console.log('\n--- Тестируем 2024-07 ---');
    try {
      const result = await makeRestRequest('GET', '/admin/api/2024-07/products.json?limit=1');
      console.log('✅ 2024-07 работает');
    } catch (error) {
      console.log('❌ 2024-07 не работает:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

testVersions();
