// Массовая загрузка всех категорий БЕЗ фотографий
// Создаем placeholder изображения и сосредотачиваемся на контенте

const fs = require('fs');
const path = require('path');

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

// Создаем простые placeholder изображения в base64
const createPlaceholderImage = (title, color = '#3B82F6') => {
  const svg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}CC;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  <rect x="50" y="50" width="700" height="500" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="20"/>
  <text x="400" y="280" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">
    ${title}
  </text>
  <text x="400" y="320" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)">
    Placeholder Image
  </text>
  <text x="400" y="500" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.6)">
    Replace with Real Photo
  </text>
</svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Данные для всех категорий (пример - торговые центры)
const shoppingCenters = [
  {
    title: "Central Phuket Floresta (Централ Пхукет Флореста)",
    handle: "central-phuket-floresta",
    description: "Самый большой торговый центр на Пхукете с двумя корпусами: Festival и Floresta. 300+ магазинов, рестораны, кинотеатр, аквариум.",
    tags: ["info", "insider", "category:shopping", "district:PhuketTown", "shopping", "mall", "luxury", "popular"],
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.6", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы,Обмен валюты,Аквариум", type: "single_line_text_field" }
    ]
  },
  {
    title: "Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)",
    handle: "robinson-lifestyle-phuket",
    description: "Современный торговый центр с фуд-кортом, кинотеатром SF Cinema, магазинами и ресторанами. Удобная парковка и кондиционеры.",
    tags: ["info", "insider", "category:shopping", "district:PhuketTown", "shopping", "mall", "modern", "popular"],
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.4", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Wi‑Fi,Банкоматы", type: "single_line_text_field" }
    ]
  }
  // Добавим остальные торговые центры...
];

const CREATE_PRODUCT_MUTATION = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        descriptionHtml
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_MEDIA_MUTATION = `
  mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        id
        alt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function massUploadWithoutPhotos() {
  console.log('🚀 МАССОВАЯ ЗАГРУЗКА БЕЗ ФОТОГРАФИЙ\n');
  console.log('📋 Стратегия:');
  console.log('✅ Создаем продукты с placeholder изображениями');
  console.log('✅ Сосредотачиваемся на качественном контенте');
  console.log('✅ Фотографии добавим позже вручную\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`📦 [${i + 1}/${shoppingCenters.length}] Создаем: ${center.title}`);
    
    try {
      // 1. Создаем продукт
      const productResponse = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            input: {
              title: center.title,
              handle: center.handle,
              productType: "Information",
              tags: center.tags,
              descriptionHtml: center.description,
              metafields: center.metafields
            }
          }
        }),
      });
      
      const productResult = await productResponse.json();
      
      if (productResult.errors) {
        console.error(`   ❌ GraphQL ошибки:`, productResult.errors);
        errorCount++;
        continue;
      }
      
      if (productResult.data.productCreate.userErrors.length > 0) {
        console.error(`   ❌ Ошибки создания:`, productResult.data.productCreate.userErrors);
        errorCount++;
        continue;
      }
      
      const productId = productResult.data.productCreate.product.id;
      console.log(`   ✅ Продукт создан: ${productId}`);
      
      // 2. Добавляем 2 placeholder изображения
      const placeholderImages = [
        createPlaceholderImage(center.title, '#3B82F6'),
        createPlaceholderImage(center.title, '#10B981')
      ];
      
      const mediaResponse = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: CREATE_MEDIA_MUTATION,
          variables: {
            productId: productId,
            media: placeholderImages.map((img, index) => ({
              originalSource: img,
              alt: `${center.title} - Placeholder ${index + 1}`,
              mediaContentType: "IMAGE"
            }))
          }
        }),
      });
      
      const mediaResult = await mediaResponse.json();
      
      if (mediaResult.errors) {
        console.log(`   ⚠️ Ошибки загрузки фото:`, mediaResult.errors);
      } else {
        console.log(`   ✅ Placeholder изображения добавлены`);
      }
      
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 === РЕЗУЛЬТАТЫ ===');
  console.log(`✅ Успешно создано: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📦 Всего обработано: ${shoppingCenters.length}`);
  
  console.log('\n🎯 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('1. Проверьте результат на сайте');
  console.log('2. Добавьте реальные фотографии вручную');
  console.log('3. Примените этот подход к другим категориям');
}

massUploadWithoutPhotos();
