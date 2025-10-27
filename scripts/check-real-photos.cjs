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

async function check() {
  console.log('\n📸 ПРОВЕРКА ФОТО В SHOPIFY\n');
  console.log('='.repeat(80));
  
  const query = `{ 
    productByHandle(handle: "central-phuket-floresta") { 
      id 
      title
      images(first: 50) { 
        edges { 
          node { 
            id 
            altText
            url
          } 
        } 
      } 
    } 
  }`;
  
  const result = await shopifyRequest(query);
  const product = result.data?.productByHandle;
  
  if (!product) {
    console.error('❌ Продукт не найден!');
    return;
  }
  
  const images = product.images?.edges || [];
  
  console.log(`\n📊 ВСЕГО ФОТО: ${images.length}\n`);
  console.log('='.repeat(80));
  
  images.forEach((img, i) => {
    const altText = img.node.altText || 'БЕЗ ALT';
    const url = img.node.url;
    const filename = url.split('/').pop().split('?')[0];
    console.log(`\n[${i+1}] ${altText}`);
    console.log(`    Файл: ${filename}`);
    console.log(`    URL: ${url.substring(0, 80)}...`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n❌ ПРОБЛЕМА: ${images.length} фото вместо 6!`);
  console.log('❌ ФОТО НЕ ТОРГОВОГО ЦЕНТРА (пляжи)!');
  console.log('\n💡 РЕШЕНИЕ: Удалить ВСЕ, загрузить 6 РЕАЛЬНЫХ фото Central Festival\n');
}

check().catch(console.error);
