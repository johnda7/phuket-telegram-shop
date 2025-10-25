#!/usr/bin/env node
/* Upsert эталона "Central Phuket" (категория shopping) в Shopify */

const STORE = process.env.SHOPIFY_STORE || 'phuket-telegram-shop-117ck.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API = '2025-07';
const ADMIN = `https://${STORE}/admin/api/${API}/graphql.json`;

if (!TOKEN) {
  console.error('❌ SHOPIFY_ACCESS_TOKEN не установлен');
  process.exit(1);
}

async function gql(query, variables = {}) {
  const r = await fetch(ADMIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables })
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error(JSON.stringify(j.errors || j, null, 2));
  return j.data;
}

const byHandle = async (handle) => {
  const q = `query($h:String!){ productByHandle(handle:$h){ id title handle } }`;
  return (await gql(q, { h: handle })).productByHandle || null;
};

const create = async (input) => {
  const q = `mutation($input:ProductInput!){
    productCreate(input:$input){ product{ id title handle } userErrors{ field message } }
  }`;
  const d = await gql(q, { input });
  if (d.productCreate.userErrors?.length) throw new Error(JSON.stringify(d.productCreate.userErrors, null, 2));
  return d.productCreate.product;
};

const update = async (input) => {
  const q = `mutation($input:ProductInput!){
    productUpdate(input:$input){ product{ id title handle } userErrors{ field message } }
  }`;
  const d = await gql(q, { input });
  if (d.productUpdate.userErrors?.length) throw new Error(JSON.stringify(d.productUpdate.userErrors, null, 2));
  return d.productUpdate.product;
};

const metafieldsSet = async (inputs) => {
  if (!inputs.length) return;
  const q = `mutation($m:[MetafieldsSetInput!]!){
    metafieldsSet(metafields:$m){ metafields{ id key } userErrors{ field message } }
  }`;
  const d = await gql(q, { m: inputs });
  if (d.metafieldsSet.userErrors?.length) throw new Error(JSON.stringify(d.metafieldsSet.userErrors, null, 2));
};

(async function main() {
  const handle = 'central-phuket';
  const input = {
    title: 'Central Phuket — Floresta + Festival',
    handle,
    productType: 'Information',
    vendor: 'PhuketDA',
    tags: [
      'info','insider',
      'category:shopping',
      'shopping','mall','aircon','food-court','parking','popular',
      'district:PhuketTown'
    ],
    descriptionHtml: `
<h2>Central Phuket — крупнейший ТРЦ Пхукета</h2>
<p>Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>
<ul>
<li>Магазины: Zara, H&M, Uniqlo, Nike, Apple реселлер</li>
<li>Еда: 2 фуд-корта + рестораны</li>
<li>Развлечения: кинотеатр, аквариум, детские зоны</li>
<li>Удобства: большая парковка, банкоматы, обмен валют</li>
</ul>`.trim(),
    variants: [{ title: 'Default', price: '0.00' }]
  };

  const mf = [
    { namespace: 'custom', key: 'coordinates', value: '7.8905,98.3901', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'rating', value: '4.6', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'district', value: 'PhuketTown', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'duration', value: '2-4 часа', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'best_time', value: 'День/вечер', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'working_hours', value: '10:00-22:00 ежедневно', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'amenities', value: 'Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы,Обмен валюты', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'website', value: 'https://www.centralphuket.com/', type: 'single_line_text_field' }
  ];

  console.log('🛍️ Upsert: Central Phuket (эталон категории shopping)');
  const exists = await byHandle(handle);
  const product = exists
    ? await update({ id: exists.id, ...input, variants: undefined })
    : await create(input);

  await metafieldsSet(mf.map(m => ({ ownerId: product.id, ...m })));
  console.log(`✅ Готово: ${product.title} — ${product.handle}`);
})().catch(e => { console.error('❌', e.message || e); process.exit(1); });
