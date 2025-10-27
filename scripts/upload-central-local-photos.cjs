const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7972352950326'; // Central Phuket Floresta

// Попробуем загрузить СУЩЕСТВУЮЩИЙ локальный файл (phi-phi-hero.jpg) для теста
const testImagePath = path.join(__dirname, '../src/assets/phi-phi-hero.jpg');

function uploadImageToProduct(filePath, filename) {
  return new Promise((resolve, reject) => {
    console.log(`📁 Читаем файл: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Файл не найден: ${filePath}`));
      return;
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    const fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
    
    console.log(`📊 Размер файла: ${fileSizeKB} KB`);
    console.log(`📤 Загружаем в Shopify...`);
    
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename
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
        console.log(`📥 Response status: ${res.statusCode}`);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          resolve(result.image);
        } else {
          console.log(`📄 Response body:`, data);
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

async function testUpload() {
  console.log('🧪 ТЕСТ: Загружаем локальный файл phi-phi-hero.jpg\n');
  console.log('🎯 Цель: проверить работает ли загрузка локальных файлов\n');
  
  try {
    const result = await uploadImageToProduct(testImagePath, 'central-phuket-test.jpg');
    console.log('\n✅ УСПЕХ! Фото загружено!');
    console.log(`📷 Image ID: ${result.id}`);
    console.log(`🔗 URL: ${result.src}`);
    console.log('\n💡 ВЫВОД: Trial account РАЗРЕШАЕТ загрузку ЛОКАЛЬНЫХ файлов через base64!');
    console.log('🚀 Теперь нужно скачать ТВОИ 4 фото Central Festival локально и загрузить!');
  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message);
    console.log('\n🤔 Если ошибка "trial accounts" - значит проблема не в методе загрузки');
  }
}

testUpload();

