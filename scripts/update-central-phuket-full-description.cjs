const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// ПОЛНОЕ описание из phuket-insider.com
const FULL_DESCRIPTION = `Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете.

Он состоит из двух корпусов: Central Festival и Central Floresta.

CENTRAL FESTIVAL:
Масс-маркет бренды: H&M, Zara, Crocs, AIIZ, UNIQLO, Sephora, SuperSport. Магазины электроники и техники. Множество ресторанов и фуд-кортов. Детская игровая зона. Кинотеатр.

CENTRAL FLORESTA:
Люксовые бутики премиум-класса: Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co. Магазины игрушек и детской одежды. Товары для дома, лавки с сувенирами. Продуктовый супермаркет Tops. Океанариум Aquaria. Музей 3D-оптических иллюзий AR TRICK EYE. Морской ресторан Su Va Na.

УДОБСТВА:
Бесплатный WI-FI. Портативные зарядные станции. Пункты обмена валют. Банкоматы. Эксклюзивный лаундж. Багги-сервис. Возврат НДС (Tax Free).`;

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
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `
    query {
      products(first: 1, query: "handle:${handle}") {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;
  
  const result = await shopifyAdminRequest(query);
  return result.data?.products?.edges?.[0]?.node;
}

async function updateProductDescription(productId, description) {
  // Преобразуем в HTML
  const htmlDescription = description
    .split('\n\n')
    .map(para => `<p>${para}</p>`)
    .join('');
  
  // Эскейпим для JSON
  const escapedHtml = JSON.stringify(htmlDescription);
  
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        descriptionHtml: ${escapedHtml}
      }) {
        product {
          id
          title
          descriptionHtml
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
  console.log('📝 Обновляем ПОЛНОЕ описание Central Phuket из phuket-insider.com...\n');

  const productHandle = "central-phuket-floresta";
  const product = await getProductByHandle(productHandle);

  if (!product) {
    console.error(`🏢 Продукт с handle "${productHandle}" не найден.`);
    return;
  }

  console.log(`🏢 Найден продукт: ${product.title}`);
  console.log(`🆔 ID: ${product.id}\n`);

  console.log('📄 Обновляем описание...');
  const updateResult = await updateProductDescription(product.id, FULL_DESCRIPTION);

  if (updateResult?.product) {
    console.log('  ✅ Описание обновлено!');
    console.log(`  📝 Новое описание (первые 200 символов):`);
    console.log(`  ${updateResult.product.descriptionHtml.substring(0, 200)}...`);
  } else if (updateResult?.userErrors) {
    console.error('  ❌ Ошибка при обновлении:', updateResult.userErrors);
  } else {
    console.error('  ❌ Неизвестная ошибка при обновлении.');
  }

  console.log('\n✅ Готово! Проверь на сайте: http://localhost:8080/place/central-phuket-floresta');
}

main().catch(console.error);

