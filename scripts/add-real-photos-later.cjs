// Скрипт для добавления реальных фотографий после массовой загрузки
// Используется когда у вас есть качественные фотографии

const fs = require('fs');
const path = require('path');

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

// Конфигурация для каждого места
const photoConfigs = {
  'central-phuket-floresta': {
    photosDir: 'photos/central/',
    description: 'Central Phuket Floresta',
    expectedPhotos: 6
  },
  'robinson-lifestyle-phuket': {
    photosDir: 'photos/robinson/',
    description: 'Robinson Lifestyle Phuket',
    expectedPhotos: 6
  }
  // Добавим остальные места...
};

const GET_PRODUCT_ID_QUERY = `
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
    }
  }
`;

const DELETE_MEDIA_MUTATION = `
  mutation productDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
    productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
      deletedMediaIds
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

async function addRealPhotos(handle) {
  const config = photoConfigs[handle];
  if (!config) {
    console.error(`❌ Конфигурация для ${handle} не найдена`);
    return;
  }
  
  const photosDir = path.join(__dirname, '..', config.photosDir);
  
  if (!fs.existsSync(photosDir)) {
    console.error(`❌ Папка ${config.photosDir} не найдена`);
    console.log(`📁 Создайте папку и добавьте фотографии:`);
    console.log(`   mkdir -p ${config.photosDir}`);
    console.log(`   # Добавьте ${config.expectedPhotos} качественных фото`);
    return;
  }
  
  const files = fs.readdirSync(photosDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort();
  
  if (files.length === 0) {
    console.error(`❌ В папке ${config.photosDir} нет фотографий`);
    return;
  }
  
  console.log(`📸 Добавляем реальные фотографии для ${config.description}`);
  console.log(`📁 Найдено ${files.length} фотографий в ${config.photosDir}`);
  
  try {
    // 1. Получаем ID продукта
    const productResponse = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: GET_PRODUCT_ID_QUERY,
        variables: { handle }
      }),
    });
    
    const productResult = await productResponse.json();
    
    if (productResult.errors || !productResult.data.productByHandle) {
      console.error(`❌ Продукт ${handle} не найден`);
      return;
    }
    
    const productId = productResult.data.productByHandle.id;
    console.log(`✅ Найден продукт: ${productId}`);
    
    // 2. Подготавливаем фотографии
    const mediaInputs = [];
    
    for (let i = 0; i < Math.min(files.length, config.expectedPhotos); i++) {
      const file = files[i];
      const filePath = path.join(photosDir, file);
      
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        const mimeType = file.endsWith('.png') ? 'image/png' : 
                        file.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
        
        mediaInputs.push({
          originalSource: `data:${mimeType};base64,${base64Image}`,
          alt: `${config.description} - ${file.replace(/\.[^/.]+$/, '')}`,
          mediaContentType: "IMAGE"
        });
        
        console.log(`   ✅ Подготовлено: ${file}`);
      } catch (error) {
        console.log(`   ❌ Ошибка чтения ${file}: ${error.message}`);
      }
    }
    
    if (mediaInputs.length === 0) {
      console.error(`❌ Нет подходящих фотографий для загрузки`);
      return;
    }
    
    // 3. Загружаем фотографии
    console.log(`🚀 Загружаем ${mediaInputs.length} фотографий...`);
    
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
          media: mediaInputs
        }
      }),
    });
    
    const mediaResult = await mediaResponse.json();
    
    if (mediaResult.errors) {
      console.error(`❌ Ошибки загрузки:`, mediaResult.errors);
    } else if (mediaResult.data.productCreateMedia.userErrors.length > 0) {
      console.error(`❌ Ошибки создания медиа:`, mediaResult.data.productCreateMedia.userErrors);
    } else {
      console.log(`✅ Успешно загружено ${mediaInputs.length} фотографий!`);
      console.log(`🌐 Проверьте результат: http://localhost:8080/place/${handle}`);
    }
    
  } catch (error) {
    console.error(`❌ Ошибка:`, error.message);
  }
}

// Использование:
// node scripts/add-real-photos-later.cjs central-phuket-floresta
// node scripts/add-real-photos-later.cjs robinson-lifestyle-phuket

const handle = process.argv[2];
if (handle) {
  addRealPhotos(handle);
} else {
  console.log('📋 ИСПОЛЬЗОВАНИЕ:');
  console.log('node scripts/add-real-photos-later.cjs <handle>');
  console.log('');
  console.log('📝 Доступные места:');
  Object.keys(photoConfigs).forEach(handle => {
    console.log(`   ${handle} - ${photoConfigs[handle].description}`);
  });
}
