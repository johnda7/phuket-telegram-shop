#!/usr/bin/env node
/**
 * Сбор всех туров в Shopify + нормализация и публикация
 * - Проставляет productType: "Excursions"
 * - Добавляет тег "tour"
 * - Сохраняет полезные теги: islands, 1-day, 2-days, adventures, popular
 * - Публикует продукт, если ещё не опубликован
 *
 * Безопасно: режим dry-run включён по умолчанию. Для записи добавьте флаг --apply
 */

const https = require('https');

const STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const API_VERSION = '2025-07';
const TOKEN = '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';

const APPLY = process.argv.includes('--apply');

function gql(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN,
      },
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.errors) return reject(new Error(JSON.stringify(json.errors)));
          resolve(json.data);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ query, variables }));
    req.end();
  });
}

async function fetchAllProducts() {
  const query = `
    query All($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges { cursor node { id title handle productType tags status variants(first:1){edges{node{price}}} } }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
  const all = [];
  let after = null;
  do {
    const data = await gql(query, { first: 100, after });
    const { edges, pageInfo } = data.products;
    all.push(...edges.map(e => e.node));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    console.log(`📦 Загружено: ${all.length}`);
  } while (after);
  return all;
}

function looksLikeTour(p) {
  const type = (p.productType || '').toLowerCase();
  const tags = (p.tags || []).map(t => t.toLowerCase());
  const hasPrice = !!Number(p.variants?.edges?.[0]?.node?.price || 0);
  if (!hasPrice) return false;
  // Исключаем явные информационные карточки
  if (type === 'information' || type === 'place' || tags.includes('info') || tags.includes('place')) return false;
  const indicators = ['tour','islands','1-day','2-days','adventures','экскурсии','phi-phi','james-bond','similan','raft','rafting','avatar'];
  // Если есть индикаторы — это тур; иначе считаем туром любой товар с ценой
  return tags.some(t => indicators.includes(t)) || type === 'excursions' || type === 'экскурсии' || true;
}

async function updateProduct(id, next) {
  const mutation = `
    mutation Update($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id title handle productType tags }
        userErrors { field message }
      }
    }
  `;
  const input = { id, ...next };
  if (!APPLY) {
    console.log('🧪 DRY-RUN update', JSON.stringify(input));
    return;
  }
  const data = await gql(mutation, { input });
  const errors = data.productUpdate.userErrors;
  if (errors?.length) {
    console.error('❌ Ошибки обновления:', errors);
  } else {
    console.log('✅ Обновлён:', data.productUpdate.product.title);
  }
}

async function publishProduct(id) {
  const mutation = `
    mutation Pub($id: ID!) {
      publishablePublish(id: $id, input: { publicationId: "gid://shopify/Publication/online-store" }) {
        userErrors { field message }
      }
    }
  `;
  if (!APPLY) {
    console.log('🧪 DRY-RUN publish', id);
    return;
  }
  const data = await gql(mutation, { id });
  if (data.publishablePublish.userErrors?.length) {
    console.error('❌ Ошибки публикации:', data.publishablePublish.userErrors);
  } else {
    console.log('🚀 Опубликован');
  }
}

(async () => {
  console.log('🔎 Поиск туров в Shopify…');
  const products = await fetchAllProducts();
  const tours = products.filter(looksLikeTour);
  console.log(`🎟️ Найдено туров: ${tours.length} из ${products.length}`);

  for (const p of tours) {
    const tagsSet = new Set(p.tags || []);
    tagsSet.add('tour');
    // Сохраняем полезные теги, если уже есть
    const desiredType = 'Excursions';
    const input = {
      productType: desiredType,
      tags: Array.from(tagsSet),
    };
    console.log(`\n📝 ${p.title} (${p.handle})`);
    await updateProduct(p.id, input);
    if (p.status !== 'ACTIVE') {
      await publishProduct(p.id);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n✅ Готово. Перейдите в /phuket и проверьте список туров.');
})();


