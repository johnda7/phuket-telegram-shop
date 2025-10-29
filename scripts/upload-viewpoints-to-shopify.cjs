#!/usr/bin/env node

/**
 * 🔥 СКРИПТ ЗАГРУЗКИ СМОТРОВЫХ ПЛОЩАДОК В SHOPIFY 🔥
 * 
 * Загружает все viewpoints из src/data/viewpoints.ts в Shopify как Products
 * с типом "place" и всеми metafields
 */

require('dotenv').config();

// Импорт данных
const viewpointsData = [
  {
    title: "Мыс Промтеп (Promthep Cape)",
    handle: "promthep-cape",
    description: `**🌅 Мыс Промтеп** — самая южная точка Пхукета и **лучшее место для наблюдения за закатом**!

**Почему стоит посетить:**
- 🌅 Легендарные закаты над Андаманским морем
- 🗼 Красивый белый маяк
- 📸 Смотровая площадка 360° с панорамным видом
- 🐘 Статуя слона Ганеши
- 🎭 Сувенирные лавки и фото-зоны

**Лучшее время:**
Приезжайте за 30-40 минут до заката (примерно 18:00-18:30). Место популярное, будет много туристов!

**Как добраться:**
- 🚗 15 минут от пляжа Найхарн
- 🛵 На байке по живописной дороге
- 🚕 Такси из Равая (~10 минут)

**Советы:**
- Берите воду - может быть жарко
- Одевайте удобную обувь
- Приходите пораньше для лучших мест
- Вход бесплатный!`,
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: [
      "place",
      "info",
      "insider",
      "category:viewpoints",
      "district:Rawai",
      "viewpoint",
      "sunset",
      "popular",
      "free",
      "photo-spot",
      "lighthouse",
      "instagram"
    ],
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.7625,98.3056", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.8", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Rawai", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "1-2 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "Закат (18:00-19:00)", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "24/7", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Туалеты,Сувениры,Маяк,Фото-зоны", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "0", type: "single_line_text_field" },
      { namespace: "custom", key: "entrance_fee", value: "Бесплатно", type: "single_line_text_field" },
      { namespace: "custom", key: "map_url", value: "https://maps.app.goo.gl/promthep", type: "single_line_text_field" }
    ]
  },
  // ... остальные viewpoints будут добавлены ниже
];

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_PERMANENT_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = '2024-01';

if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('SHOPIFY_STORE_PERMANENT_DOMAIN:', SHOPIFY_STORE ? '✅' : '❌');
  console.error('SHOPIFY_ADMIN_ACCESS_TOKEN:', SHOPIFY_ACCESS_TOKEN ? '✅' : '❌');
  process.exit(1);
}

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

// GraphQL mutation для создания продукта
const CREATE_PRODUCT_MUTATION = `
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function shopifyRequest(query, variables) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

async function uploadViewpoint(viewpoint) {
  console.log(`\n📍 Загружаю: ${viewpoint.title}`);

  const input = {
    title: viewpoint.title,
    handle: viewpoint.handle,
    productType: viewpoint.productType,
    vendor: viewpoint.vendor,
    description: viewpoint.description,
    tags: viewpoint.tags,
    
    // Price = 0 для мест (не продаются)
    variants: [{
      price: "0.00",
      inventoryPolicy: "CONTINUE"
    }],
    
    // Metafields
    metafields: viewpoint.metafields.map(field => ({
      namespace: field.namespace,
      key: field.key,
      value: field.value,
      type: field.type
    }))
  };

  try {
    const result = await shopifyRequest(CREATE_PRODUCT_MUTATION, { input });
    
    if (result.data.productCreate.userErrors.length > 0) {
      console.error(`❌ Ошибка создания:`, result.data.productCreate.userErrors);
      return false;
    }
    
    console.log(`✅ Создано: ${result.data.productCreate.product.handle}`);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Начинаем загрузку смотровых площадок в Shopify...\n');
  console.log(`📊 Всего мест: ${viewpointsData.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const viewpoint of viewpointsData) {
    const success = await uploadViewpoint(viewpoint);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Успешно загружено: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
