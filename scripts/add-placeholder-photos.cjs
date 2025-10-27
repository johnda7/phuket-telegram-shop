// Добавляем placeholder фотографии к существующим продуктам
// Используем когда продукты уже созданы, но нет фотографий

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

// Список продуктов для добавления placeholder фотографий
const products = [
  {
    handle: 'central-phuket-floresta',
    title: 'Central Phuket Floresta',
    colors: ['#3B82F6', '#10B981', '#F59E0B']
  },
  {
    handle: 'robinson-lifestyle-phuket',
    title: 'Robinson Lifestyle Phuket',
    colors: ['#8B5CF6', '#EC4899', '#06B6D4']
  }
  // Добавим остальные торговые центры...
];

const GET_PRODUCT_ID_QUERY = `
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
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

async function addPlaceholderPhotos() {
  console.log('🖼️ ДОБАВЛЯЕМ PLACEHOLDER ФОТОГРАФИИ\n');
  console.log('📋 Стратегия:');
  console.log('✅ Добавляем 2-3 placeholder изображения к каждому продукту');
  console.log('✅ Разные цвета для визуального разнообразия');
  console.log('✅ Позже заменим на реальные фотографии\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`📦 [${i + 1}/${products.length}] Обрабатываем: ${product.title}`);
    
    try {
      // 1. Получаем ID продукта и проверяем существующие фото
      const productResponse = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: GET_PRODUCT_ID_QUERY,
          variables: { handle: product.handle }
        }),
      });
      
      const productResult = await productResponse.json();
      
      if (productResult.errors || !productResult.data.productByHandle) {
        console.error(`   ❌ Продукт ${product.handle} не найден`);
        errorCount++;
        continue;
      }
      
      const productData = productResult.data.productByHandle;
      const productId = productData.id;
      const existingImages = productData.images.edges;
      
      console.log(`   ✅ Найден продукт: ${productId}`);
      console.log(`   📷 Существующих фото: ${existingImages.length}`);
      
      // Если уже есть фото, пропускаем
      if (existingImages.length > 0) {
        console.log(`   ⚠️ У продукта уже есть фотографии, пропускаем`);
        continue;
      }
      
      // 2. Создаем placeholder изображения
      const placeholderImages = product.colors.map((color, index) => 
        createPlaceholderImage(product.title, color)
      );
      
      console.log(`   🎨 Создаем ${placeholderImages.length} placeholder изображений`);
      
      // 3. Загружаем placeholder изображения
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
              alt: `${product.title} - Placeholder ${index + 1}`,
              mediaContentType: "IMAGE"
            }))
          }
        }),
      });
      
      const mediaResult = await mediaResponse.json();
      
      if (mediaResult.errors) {
        console.error(`   ❌ Ошибки загрузки:`, mediaResult.errors);
        errorCount++;
      } else if (mediaResult.data.productCreateMedia.userErrors.length > 0) {
        console.error(`   ❌ Ошибки создания медиа:`, mediaResult.data.productCreateMedia.userErrors);
        errorCount++;
      } else {
        console.log(`   ✅ Успешно добавлено ${placeholderImages.length} placeholder изображений!`);
        successCount++;
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 === РЕЗУЛЬТАТЫ ===');
  console.log(`✅ Успешно обработано: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📦 Всего продуктов: ${products.length}`);
  
  console.log('\n🎯 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('1. Проверьте результат на сайте');
  console.log('2. Добавьте реальные фотографии командой:');
  console.log('   node scripts/add-real-photos-later.cjs <handle>');
  console.log('3. Примените этот подход к другим категориям');
}

addPlaceholderPhotos();
