const https = require('https');

const STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const TOKEN = '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';
const PRODUCT_ID = '7972352950326';

// Используем REST API для изменения статуса
const options = {
  hostname: STORE,
  path: `/admin/api/2025-07/products/${PRODUCT_ID}.json`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': TOKEN
  }
};

const data = JSON.stringify({
  product: {
    id: PRODUCT_ID,
    published: true,
    published_scope: 'web'
  }
});

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Response:', body);
    if (res.statusCode === 200) {
      console.log('\n✅ Продукт опубликован!');
      console.log('💡 Перезагрузите страницу: http://localhost:8080/category/shopping');
    }
  });
});

req.on('error', console.error);
req.write(data);
req.end();
