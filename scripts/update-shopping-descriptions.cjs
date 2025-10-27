// Простой скрипт для обновления описаний торговых центров
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const descriptions = {
  'central-phuket-floresta': `Самый большой торговый центр Пхукета площадью более 150,000 кв.м. Состоит из двух частей: Central Festival (массовый сегмент) и Central Floresta (премиум бутики).

Central Festival: Zara, H&M, Uniqlo, Nike, Adidas, Sephora, Boots, Apple Store, Samsung, Tops Market.

Central Floresta: Prada, Gucci, Louis Vuitton, Chanel, Hermès, Tiffany & Co, премиум рестораны.

Развлечения: SF Cinema (16 залов IMAX), Aquaria Phuket (океанариум), боулинг, детская зона.

Время работы: 10:00-22:00 ежедневно
Особенности: бесплатная парковка на 3500 мест, Wi-Fi, шаттл от отелей
От Патонга: 15 минут на такси (200-300 бат)`,

  'jungceylon-shopping-center': `Крупнейший торговый центр в сердце Патонга, в 5 минутах от пляжа. Идеально для шоппинга после пляжа!

Магазины: Big C Extra (супермаркет), Uniqlo, H&M, Zara, Nike, Adidas, Power Buy, Boots, Watson's.

Развлечения: SF Cinema (6 залов), боулинг (8 дорожек), детская зона, фуд-корт (40+ точек).

Время работы: 11:00-23:00 ежедневно
Особенности: бесплатная парковка 2 часа, Wi-Fi, обменники
Локация: 5 минут пешком от пляжа Патонг`,

  'premium-outlet-phuket': `Первый и единственный аутлет-центр на Пхукете! Брендовая одежда и обувь со скидками 30-70%.

Бренды: Nike, Adidas, Puma, Reebok, Levi's, Lee, Gap, Crocs, Skechers, Timberland, Samsonite.

Скидки: постоянные 30-70% на прошлые коллекции. Дополнительные скидки в январе-феврале и июле-августе.

Время работы: 10:00-22:00 ежедневно
Локация: район Thalang, 20 минут от аэропорта`
};

function shopifyRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('📝 Обновляем описания торговых центров...\n');
  
  for (const [handle, description] of Object.entries(descriptions)) {
    console.log(`🏢 ${handle}`);
    
    // Находим продукт
    const findQuery = `{ productByHandle(handle: "${handle}") { id title } }`;
    const findResult = await shopifyRequest(findQuery);
    const product = findResult.data?.productByHandle;
    
    if (!product) {
      console.log('  ❌ Не найден\n');
      continue;
    }
    
    // Обновляем (используем переменные GraphQL для безопасности)
    const updateQuery = `
      mutation updateProduct($id: ID!, $description: String!) {
        productUpdate(input: {id: $id, description: $description}) {
          product { id title }
          userErrors { message }
        }
      }
    `;
    
    const variables = {
      id: product.id,
      description: description
    };
    
    const updateResult = await shopifyRequest(updateQuery, variables);
    
    if (updateResult.data?.productUpdate?.userErrors?.length > 0) {
      console.log('  ❌ Ошибка:', updateResult.data.productUpdate.userErrors);
    } else {
      console.log('  ✅ Обновлено!');
    }
    console.log('');
  }
  
  console.log('✅ Готово!');
}

main().catch(console.error);

