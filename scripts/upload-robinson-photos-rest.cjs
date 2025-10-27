// Загрузка фотографий Robinson Lifestyle Phuket через REST API
// Используем REST API вместо GraphQL (работает с Trial аккаунтом)

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7974403702838'; // Robinson Lifestyle Phuket ID

// Создаем placeholder изображения в base64
const createPlaceholderImage = (title, color = '#8B5CF6') => {
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
  
  return Buffer.from(svg).toString('base64');
};

// Placeholder изображения для Robinson Lifestyle Phuket
const placeholderImages = [
  {
    filename: 'robinson-exterior.jpg',
    alt: 'Robinson Lifestyle Phuket - Exterior view',
    color: '#8B5CF6'
  },
  {
    filename: 'robinson-interior.jpg', 
    alt: 'Robinson Lifestyle Phuket - Interior shopping area',
    color: '#EC4899'
  },
  {
    filename: 'robinson-food-court.jpg',
    alt: 'Robinson Lifestyle Phuket - Food court',
    color: '#06B6D4'
  },
  {
    filename: 'robinson-cinema.jpg',
    alt: 'Robinson Lifestyle Phuket - SF Cinema',
    color: '#F59E0B'
  },
  {
    filename: 'robinson-stores.jpg',
    alt: 'Robinson Lifestyle Phuket - Retail stores',
    color: '#10B981'
  },
  {
    filename: 'robinson-parking.jpg',
    alt: 'Robinson Lifestyle Phuket - Parking entrance',
    color: '#EF4444'
  }
];

// Функция загрузки изображения в Shopify через REST API
function uploadImageToShopify(filename, alt, base64Image) {
  return new Promise((resolve, reject) => {
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename,
        alt: alt
      }
    });

    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/2025-07/products/${PRODUCT_ID}/images.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(imageData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          resolve(result.image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

async function uploadRobinsonPhotos() {
  console.log('📸 ЗАГРУЗКА ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');
  console.log('📋 Используем REST API (работает с Trial аккаунтом)');
  console.log(`🆔 Product ID: ${PRODUCT_ID}\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < placeholderImages.length; i++) {
    const image = placeholderImages[i];
    console.log(`📷 [${i + 1}/${placeholderImages.length}] ${image.filename}`);
    
    try {
      // Создаем placeholder изображение
      const base64Image = createPlaceholderImage(image.alt, image.color);
      
      console.log(`   🎨 Создаем placeholder изображение...`);
      
      // Загружаем в Shopify
      console.log(`   ⬆️  Загружаем в Shopify...`);
      const result = await uploadImageToShopify(image.filename, image.alt, base64Image);
      
      console.log(`   ✅ Загружено! ID: ${result.id}`);
      console.log(`   🔗 URL: ${result.src}`);
      
      successCount++;
      
      // Задержка между загрузками
      if (i < placeholderImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    console.log(''); // Пустая строка для читаемости
  }
  
  // Итоги
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ЗАГРУЗКИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${successCount}/${placeholderImages.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${placeholderImages.length}`);
  
  if (successCount > 0) {
    console.log(`\n🔗 Проверь в Shopify: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID}`);
    console.log(`🌐 Проверь на сайте: http://localhost:8080/place/robinson-lifestyle-phuket`);
  }
  
  if (successCount === placeholderImages.length) {
    console.log('\n🎉 ВСЕ PLACEHOLDER ИЗОБРАЖЕНИЯ ЗАГРУЖЕНЫ!');
    console.log('💡 Теперь замените их на реальные фотографии через админку Shopify');
  }
}

uploadRobinsonPhotos().catch(console.error);
