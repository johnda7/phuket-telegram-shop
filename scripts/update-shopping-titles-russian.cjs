// Обновляем названия торговых центров на русский язык
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const russianTitles = [
  {
    handle: "central-phuket-floresta",
    title: "🏢 Централ Фестивал Флореста"
  },
  {
    handle: "jungceylon-shopping-center", 
    title: "🛍️ Джангцелон Шоппинг Центр"
  },
  {
    handle: "premium-outlet-phuket",
    title: "🏷️ Премиум Аутлет Пхукет"
  },
  {
    handle: "central-festival-phuket",
    title: "🏬 Централ Фестивал Пхукет"
  },
  {
    handle: "big-c-phuket",
    title: "🛒 Биг Си Пхукет"
  },
  {
    handle: "ocean-plaza-phuket",
    title: "🌊 Оушен Плаза Пхукет"
  },
  {
    handle: "royal-garden-plaza",
    title: "👑 Роял Гарден Плаза"
  }
];

async function shopifyAdminRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          console.error('Failed to parse JSON:', responseData);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `{
    productByHandle(handle: "${handle}") {
      id
      title
    }
  }`;
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function updateProductTitle(productId, title) {
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        title: "${title}"
      }) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest(mutation);
  return result.data?.productUpdate;
}

async function main() {
  console.log('🇷🇺 Обновляем названия торговых центров на русский...\n');

  for (const data of russianTitles) {
    console.log(`🏢 ${data.handle}`);
    const product = await getProductByHandle(data.handle);

    if (product) {
      const updateResult = await updateProductTitle(product.id, data.title);
      if (updateResult?.product) {
        console.log(`  ✅ Обновлено: "${updateResult.product.title}"`);
      } else if (updateResult?.userErrors) {
        console.error(`  ❌ Ошибка:`, updateResult.userErrors);
      } else {
        console.error(`  ❌ Неизвестная ошибка`);
      }
    } else {
      console.error(`  ❌ Продукт "${data.handle}" не найден`);
    }
  }
  console.log('\n✅ Готово!');
}

main().catch(console.error);
