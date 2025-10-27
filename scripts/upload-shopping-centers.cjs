// Скрипт для загрузки всех торговых центров Пхукета в Shopify
// Основано на анализе phuket-insider.com + наша философия iOS 26

const https = require('https');
// Импортируем данные напрямую
const shoppingCenters = [
  {
    title: "Central Phuket Floresta",
    handle: "central-phuket-floresta",
    description: `Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.

**Central Festival:**
- Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas
- Косметика: Sephora, Boots
- Электроника: Apple, Samsung, Sony
- Супермаркет Tops Market

**Central Floresta:**
- Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel
- Ювелирные магазины
- Премиум рестораны

**Развлечения:**
- Кинотеатр SF Cinema
- Детская игровая зона
- Аквариум
- Фуд-корт с тайской и международной кухней

**Удобства:**
- Бесплатная парковка
- Бесплатный Wi-Fi
- Банкоматы
- Обмен валюты
- Кондиционеры`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider", 
      "category:shopping",
      "district:PhuketTown",
      "shopping",
      "mall",
      "luxury",
      "popular",
      "aircon",
      "food-court",
      "parking",
      "cinema"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.6", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "2-4 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День/вечер", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы,Обмен валюты,Аквариум", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.centralphuket.com/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "3", type: "single_line_text_field" }
    ]
  },

  {
    title: "Jungceylon Shopping Center",
    handle: "jungceylon-shopping-center",
    description: `Jungceylon – крупнейший торговый центр в Патонге, расположенный в самом сердце туристической зоны. Идеальное место для шоппинга после пляжа.

**Магазины:**
- Супермаркет Big C Extra
- Магазины одежды: Uniqlo, H&M, Zara
- Электроника: Power Buy, Banana IT
- Косметика: Boots, Watsons
- Сувениры и подарки

**Развлечения:**
- Кинотеатр SF Cinema
- Боулинг
- Детская игровая зона
- Фуд-корт с разнообразной кухней

**Особенности:**
- Расположен рядом с пляжем Патонг
- Много ресторанов и кафе
- Вечерние шоу и мероприятия
- Близко к ночной жизни Патонга`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping", 
      "district:Patong",
      "shopping",
      "mall",
      "tourist",
      "beach-nearby",
      "food-court",
      "cinema",
      "bowling"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.4", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Patong", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "2-3 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День/вечер", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "11:00-23:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Боулинг,Wi‑Fi,Банкоматы", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.jungceylon.com/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" }
    ]
  }
];

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const SHOPIFY_API_VERSION = '2025-07';

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
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
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.errors) {
            reject(new Error(JSON.stringify(result.errors, null, 2)));
          } else {
            resolve(result.data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function createProduct(placeData) {
  const mutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: placeData.title,
    handle: placeData.handle,
    productType: placeData.productType,
    vendor: placeData.vendor,
    tags: placeData.tags,
    descriptionHtml: placeData.description.replace(/\n/g, '<br>'),
    variants: [{ title: 'Default', price: '0.00' }]
  };

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.productCreate.userErrors.length > 0) {
    throw new Error(JSON.stringify(result.productCreate.userErrors, null, 2));
  }

  return result.productCreate.product;
}

async function addMetafields(productId, metafields) {
  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metafieldsInput = metafields.map(mf => ({
    ownerId: productId,
    namespace: mf.namespace,
    key: mf.key,
    value: mf.value,
    type: mf.type
  }));

  const result = await shopifyAdminRequest(mutation, { metafields: metafieldsInput });
  
  if (result.metafieldsSet.userErrors.length > 0) {
    throw new Error(JSON.stringify(result.metafieldsSet.userErrors, null, 2));
  }

  return result.metafieldsSet.metafields;
}

async function checkProductExists(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  try {
    const result = await shopifyAdminRequest(query, { handle });
    return result.productByHandle;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🛍️ Загружаем торговые центры Пхукета в Shopify...\n');

  for (const center of shoppingCenters) {
    try {
      console.log(`📦 Обрабатываем: ${center.title}`);
      
      // Проверяем, существует ли продукт
      const existing = await checkProductExists(center.handle);
      
      if (existing) {
        console.log(`⚠️  Продукт уже существует: ${existing.title}`);
        continue;
      }

      // Создаем продукт
      const product = await createProduct(center);
      console.log(`✅ Создан продукт: ${product.title}`);

      // Добавляем метаполя
      if (center.metafields && center.metafields.length > 0) {
        await addMetafields(product.id, center.metafields);
        console.log(`✅ Добавлены метаполя: ${center.metafields.length} полей`);
      }

      console.log(`🎉 Готово: ${center.title}\n`);
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${center.title}:`, error.message);
    }
  }

  console.log('🏁 Загрузка завершена!');
}

// Запускаем скрипт
main().catch(console.error);
