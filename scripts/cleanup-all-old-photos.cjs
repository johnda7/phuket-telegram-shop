const https = require('https');
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

async function shopifyRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
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
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function cleanup() {
  console.log('🗑️  УДАЛЕНИЕ СТАРЫХ ФОТО...\n');
  
  const query = `{ productByHandle(handle: "central-phuket-floresta") { id images(first: 50) { edges { node { id altText } } } } }`;
  const result = await shopifyRequest(query);
  const product = result.data?.productByHandle;
  
  if (!product) {
    console.error('❌ Продукт не найден');
    return;
  }
  
  const allImages = product.images?.edges || [];
  console.log(`📸 Всего фото: ${allImages.length}`);
  
  // Оставляем только последние 6 (свежие quality)
  const toDelete = allImages.slice(0, -6);
  
  console.log(`✅ Оставляем: 6 последних (качественных)`);
  console.log(`🗑️  Удаляем: ${toDelete.length} старых\n`);
  
  for (let i = 0; i < toDelete.length; i++) {
    const imageId = toDelete[i].node.id;
    console.log(`🗑️  [${i+1}/${toDelete.length}] Удаляю старое фото...`);
    
    const deleteMutation = `mutation { productDeleteImages(id: "${product.id}", imageIds: ["${imageId}"]) { deletedImageIds userErrors { message } } }`;
    await shopifyRequest(deleteMutation);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n✅ ОЧИСТКА ЗАВЕРШЕНА! Осталось 6 качественных фото\n');
}

cleanup().catch(console.error);
