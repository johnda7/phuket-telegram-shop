#!/usr/bin/env node
// Audit 5 tours: compare Shopify prices/images with expected (from phukeo mapping)
const https = require('https');

const API_VERSION = '2025-07';
const STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';

const EXPECTED = {
  'rafting-elephant-spa-atv': { adult: 1700, child: 0 },
  'phi-phi-2-days-1-night': { adult: 4500, child: 3950 },
  'james-bond-island-tour': { adult: 1400, child: 0 },
  '⭐-11-островов-мега-тур': { adult: 4200, child: 0 },
  '🐘-као-лак-safari': { adult: 1300, child: 0 },
};

function storefrontRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: STORE,
      path: `/api/${API_VERSION}/graphql.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ query, variables }));
    req.end();
  });
}

async function getByHandle(handle) {
  const q = `
    query($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        images(first: 20) { edges { node { url } } }
        variants(first: 10) { edges { node { title price { amount } } } }
      }
    }
  `;
  const data = await storefrontRequest(q, { handle });
  return data.data && data.data.product;
}

(async () => {
  console.log('📊 Аудит 5 туров (Shopify vs ожидаемые)');
  for (const handle of Object.keys(EXPECTED)) {
    const product = await getByHandle(handle).catch(() => null);
    if (!product) {
      console.log(`❌ Нет в Shopify: ${handle}`);
      continue;
    }
    const imgs = product.images.edges.length;
    const prices = product.variants.edges.map(e => ({ title: e.node.title, price: parseFloat(e.node.price.amount) }));
    const adult = prices.find(p => /взрос/i.test(p.title))?.price || prices[0]?.price || 0;
    const child = prices.find(p => /дет/i.test(p.title))?.price || 0;
    const exp = EXPECTED[handle];
    const adultDiff = exp.adult && adult !== exp.adult ? `≠ (ожид. ${exp.adult})` : '';
    const childDiff = exp.child && child !== exp.child ? `≠ (ожид. ${exp.child})` : '';
    console.log(`
🧭 ${product.title} (${handle})
   Фото: ${imgs}
   Цена взрослый: ${adult || '-'} ${adultDiff}
   Цена детский:  ${child || '-'} ${childDiff}
`);
  }
})();


