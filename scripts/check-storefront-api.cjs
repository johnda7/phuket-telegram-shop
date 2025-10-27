const https = require('https');
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const API_VERSION = '2025-07';

async function storefrontRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
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

async function check() {
  console.log('\n🔍 STOREFRONT API - ЧТО ВИДИТ FRONTEND?\n');
  console.log('='.repeat(80));
  
  const query = `{ 
    productByHandle(handle: "central-phuket-floresta") { 
      title
      images(first: 50) { 
        edges { 
          node { 
            url
            altText
          } 
        } 
      } 
    } 
  }`;
  
  const result = await storefrontRequest(query);
  const product = result.data?.productByHandle;
  
  if (!product) {
    console.error('❌ Продукт не найден');
    return;
  }
  
  const images = product.images?.edges || [];
  
  console.log(`\n📊 Frontend видит: ${images.length} фото\n`);
  console.log('='.repeat(80));
  
  images.forEach((img, i) => {
    const altText = img.node.altText || 'БЕЗ ALT';
    const filename = img.node.url.split('/').pop().split('?')[0];
    console.log(`[${i+1}] ${filename}`);
  });
  
  console.log('\n' + '='.repeat(80));
  
  if (images.length === 6) {
    console.log('\n✅ ОТЛИЧНО! Frontend видит 6 фото');
  } else {
    console.log(`\n❌ ПРОБЛЕМА! Frontend видит ${images.length} вместо 6`);
    console.log('⚠️  Shopify Storefront API кэширует данные!');
    console.log('💡 Подождать 30-60 сек для обновления кэша\n');
  }
}

check().catch(console.error);
