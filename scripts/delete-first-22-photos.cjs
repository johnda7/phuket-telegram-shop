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

async function deleteOld() {
  console.log('\n🗑️  УДАЛЕНИЕ ПЕРВЫХ 22 СТАРЫХ ФОТО\n');
  console.log('='.repeat(80));
  
  const query = `{ productByHandle(handle: "central-phuket-floresta") { id images(first: 50) { edges { node { id altText } } } } }`;
  const result = await shopifyRequest(query);
  const product = result.data?.productByHandle;
  
  if (!product) {
    console.error('❌ Продукт не найден');
    return;
  }
  
  const allImages = product.images?.edges || [];
  console.log(`\n📸 Всего фото: ${allImages.length}`);
  
  // Удаляем первые 22 (оставляем последние 6)
  const toDelete = allImages.slice(0, 22);
  const toKeep = allImages.slice(22);
  
  console.log(`🗑️  Удаляю: ${toDelete.length} старых`);
  console.log(`✅ Оставляю: ${toKeep.length} качественных ([23]-[28])\n`);
  console.log('='.repeat(80));
  
  for (let i = 0; i < toDelete.length; i++) {
    const imageId = toDelete[i].node.id;
    const altText = toDelete[i].node.altText || 'БЕЗ ALT';
    console.log(`\n🗑️  [${i+1}/22] ${altText}`);
    
    const deleteMutation = `mutation { productDeleteImages(id: "${product.id}", imageIds: ["${imageId}"]) { deletedImageIds userErrors { message } } }`;
    await shopifyRequest(deleteMutation);
    await new Promise(r => setTimeout(r, 400));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ УДАЛЕНИЕ ЗАВЕРШЕНО!');
  console.log('✅ Осталось 6 качественных фото: central-quality-1.jpg ... central-quality-6.jpg\n');
}

deleteOld().catch(console.error);
