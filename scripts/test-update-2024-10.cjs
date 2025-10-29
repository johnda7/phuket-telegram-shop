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

async function testUpdate() {
  try {
    console.log('🔄 Тестируем обновление через 2024-10...');
    
    // Получаем продукт
    const product = await makeRestRequest('GET', '/admin/api/2024-10/products.json?handle=jungceylon-shopping-center');
    
    if (!product.products || product.products.length === 0) {
      console.log('❌ Продукт не найден');
      return;
    }
    
    const productId = product.products[0].id;
    console.log('Product ID:', productId);
    console.log('Current title:', product.products[0].title);
    
    // Обновляем только title
    const updateData = {
      product: {
        title: 'Jungceylon Shopping Center (Джангцелон) - Updated 2024-10'
      }
    };
    
    console.log('Updating product title...');
    const updateResult = await makeRestRequest('PUT', `/admin/api/2024-10/products/${productId}.json`, updateData);
    
    if (updateResult.product) {
      console.log('✅ Продукт успешно обновлен!');
      console.log('New title:', updateResult.product.title);
    } else {
      console.log('❌ Ошибка при обновлении:', updateResult);
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

testUpdate();
