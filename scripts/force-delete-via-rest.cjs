const https = require('https');
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';
const PRODUCT_ID = '7972352950326';

async function restRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}${path}`,
      method,
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function forceDelete() {
  console.log('\n🔥 ПРИНУДИТЕЛЬНОЕ УДАЛЕНИЕ ЧЕРЕЗ REST API\n');
  console.log('='.repeat(80));
  
  // Получаем все фото
  const result = await restRequest(`/products/${PRODUCT_ID}/images.json`);
  const images = result.data.images || [];
  
  console.log(`\n📸 Всего фото: ${images.length}`);
  
  // Удаляем первые 22
  const toDelete = images.slice(0, 22);
  console.log(`🗑️  Удаляю первые 22...\n`);
  console.log('='.repeat(80));
  
  for (let i = 0; i < toDelete.length; i++) {
    const imageId = toDelete[i].id;
    console.log(`\n🗑️  [${i+1}/22] Удаляю ID: ${imageId}`);
    
    try {
      const delResult = await restRequest(`/products/${PRODUCT_ID}/images/${imageId}.json`, 'DELETE');
      if (delResult.status === 200) {
        console.log(`   ✅ Удалено`);
      } else {
        console.log(`   ❌ Ошибка: HTTP ${delResult.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Ошибка: ${error.message}`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ ЗАВЕРШЕНО! Проверяем результат...\n');
  
  const checkResult = await restRequest(`/products/${PRODUCT_ID}/images.json`);
  const remainingImages = checkResult.data.images || [];
  console.log(`📊 Осталось фото: ${remainingImages.length}\n`);
}

forceDelete().catch(console.error);
