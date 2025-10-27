// Загрузка фотографий Robinson Lifestyle Phuket в Shopify
// Используем встроенный fetch

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';
const fs = require('fs');
const path = require('path');

const PRODUCT_ID = 'gid://shopify/Product/7974403702838'; // Robinson Lifestyle Phuket

const UPLOAD_PHOTO_MUTATION = `
  mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        id
        status
        alt
      }
      mediaUserErrors {
        field
        message
      }
    }
  }
`;

async function uploadRobinsonPhotos() {
  try {
    console.log('📸 Загружаем фотографии Robinson Lifestyle Phuket...\n');
    
    const photosDir = path.join(__dirname, '..', 'photos', 'robinson');
    
    if (!fs.existsSync(photosDir)) {
      console.log('❌ Папка photos/robinson/ не найдена!');
      console.log('Сначала запустите: node scripts/find-robinson-photos-manual.cjs');
      return;
    }
    
    const files = fs.readdirSync(photosDir)
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .sort();
    
    if (files.length === 0) {
      console.log('❌ В папке photos/robinson/ нет фотографий!');
      console.log('Скачайте фото и поместите их в папку photos/robinson/');
      return;
    }
    
    console.log(`📁 Найдено ${files.length} фотографий:`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('\n🚀 Загружаем в Shopify...\n');
    
    const mediaInputs = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(photosDir, file);
      
      try {
        console.log(`📷 [${i + 1}/${files.length}] Загружаем: ${file}`);
        
        // Читаем файл и конвертируем в base64
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        const mimeType = file.endsWith('.png') ? 'image/png' : 
                        file.endsWith('.webp') ? 'image/webp' : 
                        file.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';
        
        mediaInputs.push({
          originalSource: `data:${mimeType};base64,${base64Image}`,
          alt: `Robinson Lifestyle Phuket - ${file.replace(/\.[^/.]+$/, '')}`,
          mediaContentType: mimeType
        });
        
        console.log(`   ✅ Подготовлено для загрузки`);
        
      } catch (error) {
        console.log(`   ❌ Ошибка чтения файла: ${error.message}`);
      }
    }
    
    if (mediaInputs.length === 0) {
      console.log('❌ Нет файлов для загрузки!');
      return;
    }
    
    // Загружаем все фото одним запросом
    const variables = {
      productId: PRODUCT_ID,
      media: mediaInputs
    };
    
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: UPLOAD_PHOTO_MUTATION, variables }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL ошибки:', result.errors);
      return;
    }
    
    if (result.data.productCreateMedia.mediaUserErrors.length > 0) {
      console.error('❌ Ошибки загрузки медиа:', result.data.productCreateMedia.mediaUserErrors);
      return;
    }
    
    console.log('\n✅ === РЕЗУЛЬТАТЫ ЗАГРУЗКИ ===');
    console.log(`📸 Успешно загружено: ${result.data.productCreateMedia.media.length} фотографий`);
    
    result.data.productCreateMedia.media.forEach((media, index) => {
      console.log(`   ${index + 1}. ${media.alt} (ID: ${media.id})`);
    });
    
    console.log('\n🌐 Проверьте результат на сайте:');
    console.log('http://localhost:8080/place/robinson-lifestyle-phuket');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

uploadRobinsonPhotos();
