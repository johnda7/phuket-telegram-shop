#!/usr/bin/env node
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) reject(new Error(JSON.stringify(jsonData.errors)));
          else resolve(jsonData.data);
        } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('📊 ПОЛНЫЙ ОТЧЕТ ПО ТУРАМ В SHOPIFY\n');
  
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions") {
        edges {
          node {
            id
            title
            handle
            status
            tags
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  
  const allTours = [];
  let after = null;
  
  do {
    const data = await makeGraphQLRequest(query, { first: 100, after });
    const { edges, pageInfo } = data.products;
    allTours.push(...edges.map(e => e.node));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  
  console.log(`✅ Всего туров в Shopify: ${allTours.length}\n`);
  console.log('📋 СПИСОК ВСЕХ ТУРОВ:\n');
  
  allTours.forEach((tour, i) => {
    const variants = tour.variants.edges.map(e => e.node);
    const prices = variants.map(v => `${v.title}: ${v.price} ฿`).join(', ');
    console.log(`${i + 1}. ${tour.title}`);
    console.log(`   Handle: ${tour.handle}`);
    console.log(`   Статус: ${tour.status}`);
    console.log(`   Цены: ${prices}`);
    console.log(`   Теги: ${tour.tags.join(', ')}`);
    console.log('');
  });
}

main().catch(console.error);
