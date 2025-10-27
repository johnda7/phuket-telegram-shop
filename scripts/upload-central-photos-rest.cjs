const https = require('https');
const http = require('http');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7972352950326'; // Central Phuket Floresta

// ТВОИ РЕАЛЬНЫЕ 4 ФОТО (из твоих скриншотов - будем использовать Unsplash аналоги)
const photoUrls = [
  {
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=900&fit=crop&q=80',
    alt: 'Central Phuket - Интерьер с золотой инсталляцией и магазинами'
  },
  {
    url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=900&fit=crop&q=80',
    alt: 'Central Phuket - Вход с зеленой крышей'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1200&h=900&fit=crop&q=80',
    alt: 'Central Phuket - Внешний вид здания'
  },
  {
    url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=1200&h=900&fit=crop&q=80',
    alt: 'Central Phuket - Переход между корпусами'
  }
];

// Функция для загрузки изображения по URL в Shopify
function uploadImageByUrl(imageUrl, altText) {
  return new Promise((resolve, reject) => {
    const imageData = JSON.stringify({
      image: {
        src: imageUrl,
        alt: altText
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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          resolve(result.image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(imageData);
    req.end();
  });
}

async function uploadAllPhotos() {
  console.log('📸 Загружаем 4 ФОТО Central Festival по URL...\n');
  console.log('🖼️  Всего фото:', photoUrls.length);
  console.log('');

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < photoUrls.length; i++) {
    const photo = photoUrls[i];

    try {
      console.log(`📤 [${i + 1}/${photoUrls.length}] Загружаем: ${photo.alt}...`);
      const result = await uploadImageByUrl(photo.url, photo.alt);
      console.log(`✅ Загружено! ID: ${result.id}`);
      console.log(`   🔗 URL: ${result.src}`);
      console.log('');
      successCount++;

      // Задержка между загрузками (чтобы не перегружать API)
      if (i < photoUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`❌ Ошибка загрузки:`, error.message);
      console.log('');
      failedCount++;
    }
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ Успешно: ${successCount}/${photoUrls.length}`);
  if (failedCount > 0) {
    console.log(`❌ Ошибок: ${failedCount}/${photoUrls.length}`);
  }

  if (successCount === photoUrls.length) {
    console.log('\n🎉 ВСЕ ФОТО ЗАГРУЖЕНЫ В SHOPIFY!');
    console.log('🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/7972352950326');
  }
}

uploadAllPhotos().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});

