// Загружаем РЕАЛЬНЫЕ фотографии Robinson Lifestyle Phuket через REST API
// Используем только JPG файлы (Trial account поддерживает только локальные файлы)

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7974403702838'; // Robinson Lifestyle Phuket Product ID

// Папка с фотографиями
const photosDir = path.join(__dirname, '..', 'photos', 'robinson');

// Фотографии для загрузки (только JPG)
const photoFiles = [
  { filename: 'robinson-exterior.jpg', alt: 'Robinson Lifestyle Phuket - Современный фасад торгового центра' },
  { filename: 'robinson-food-court.jpg', alt: 'Robinson Lifestyle Phuket - Просторный фуд-корт с ресторанами' },
  { filename: 'robinson-stores.jpg', alt: 'Robinson Lifestyle Phuket - Розничные магазины и бутики' }
];

// Функция загрузки изображения в Shopify через REST API
function uploadImageToShopify(filePath, filename, alt) {
  return new Promise((resolve, reject) => {
    // Читаем файл и конвертируем в base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
    // Создаем JSON payload для REST API
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,  // ✅ base64 РАБОТАЕТ с Trial account!
        filename: filename,
        alt: alt
      }
    });

    // Настройки запроса
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

    // Выполняем запрос
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data).image);
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
  console.log('📸 ЗАГРУЗКА РЕАЛЬНЫХ ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');
  console.log('📋 Используем REST API (работает с Trial аккаунтом)');
  console.log(`🆔 Product ID: ${PRODUCT_ID}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < photoFiles.length; i++) {
    const photo = photoFiles[i];
    const localPath = path.join(photosDir, photo.filename);
    
    console.log(`📷 [${i + 1}/${photoFiles.length}] ${photo.filename}`);
    
    try {
      // Проверяем существование файла
      if (!fs.existsSync(localPath)) {
        throw new Error(`Файл не найден: ${localPath}`);
      }
      
      const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
      console.log(`   📁 Размер: ${fileSizeKB} KB`);
      console.log(`   ⬆️  Загружаем в Shopify...`);
      
      const result = await uploadImageToShopify(localPath, photo.filename, photo.alt);
      console.log(`   ✅ Загружено! ID: ${result.id}`);
      console.log(`   🔗 URL: ${result.src}`);
      
      successCount++;
      
      // Задержка между загрузками (чтобы не перегружать API)
      if (i < photoFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    console.log(''); // Пустая строка для читаемости
  }

  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ЗАГРУЗКИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${successCount}/${photoFiles.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${photoFiles.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 РЕАЛЬНЫЕ ФОТОГРАФИИ ЗАГРУЖЕНЫ В SHOPIFY!');
    console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID}`);
    console.log('🌐 Проверь на сайте: http://localhost:8080/place/robinson-lifestyle-phuket');
  }
}

uploadRobinsonPhotos().catch(console.error);
