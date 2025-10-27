#!/usr/bin/env node
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

const handle = process.argv[2] || 'central-phuket-floresta';

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

async function deleteAllPhotos() {
  console.log('🗑️  УДАЛЕНИЕ ВСЕХ ФОТО...\n');
  
  // Get product
  const query = `{ productByHandle(handle: "${handle}") { id images(first: 50) { edges { node { id } } } } }`;
  const result = await shopifyRequest(query);
  const product = result.data?.productByHandle;
  
  if (!product) {
    console.error('❌ Продукт не найден');
    return;
  }
  
  const images = product.images?.edges || [];
  console.log(`📸 Найдено фото: ${images.length}`);
  
  for (let i = 0; i < images.length; i++) {
    const imageId = images[i].node.id;
    console.log(`🗑️  [${i+1}/${images.length}] Удаляю ${imageId}...`);
    
    const deleteMutation = `mutation { productDeleteImages(id: "${product.id}", imageIds: ["${imageId}"]) { deletedImageIds userErrors { message } } }`;
    await shopifyRequest(deleteMutation);
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n✅ ВСЕ ФОТО УДАЛЕНЫ!\n');
}

deleteAllPhotos().catch(console.error);
