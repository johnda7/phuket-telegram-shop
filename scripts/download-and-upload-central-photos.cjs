const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7972352950326'; // Central Phuket Floresta

// ТВОИ 4 ФОТО - похожие на Central Phuket
const photosToDownload = [
  {
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80',
    filename: 'central-interior-luxury.jpg',
    alt: 'Central Phuket - Интерьер с магазинами'
  },
  {
    url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=80',
    filename: 'central-entrance-green.jpg',
    alt: 'Central Phuket - Вход с зеленой крышей'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1200&q=80',
    filename: 'central-exterior.jpg',
    alt: 'Central Phuket - Внешний вид'
  },
  {
    url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=1200&q=80',
    filename: 'central-passage.jpg',
    alt: 'Central Phuket - Переход между корпусами'
  }
];

const assetsDir = path.join(__dirname, '../src/assets/central-festival');

// Создаем папку если не существует
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Функция для скачивания файла
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Редирект
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Функция для загрузки в Shopify
function uploadImageToShopify(filePath, filename, alt) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
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

async function main() {
  console.log('📸 ЗАГРУЗКА ФОТО CENTRAL FESTIVAL\n');
  console.log('Шаг 1: Скачиваем фото локально');
  console.log('Шаг 2: Загружаем в Shopify через base64\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < photosToDownload.length; i++) {
    const photo = photosToDownload[i];
    const localPath = path.join(assetsDir, photo.filename);
    
    console.log(`\n📷 [${i + 1}/${photosToDownload.length}] ${photo.filename}`);
    
    try {
      // Скачиваем
      console.log(`  ⬇️  Скачиваем с Unsplash...`);
      await downloadFile(photo.url, localPath);
      const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
      console.log(`  ✅ Скачано (${fileSizeKB} KB)`);
      
      // Загружаем в Shopify
      console.log(`  ⬆️  Загружаем в Shopify...`);
      const result = await uploadImageToShopify(localPath, photo.filename, photo.alt);
      console.log(`  ✅ Загружено! ID: ${result.id}`);
      
      successCount++;
      
      // Задержка между загрузками
      if (i < photosToDownload.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${photosToDownload.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${photosToDownload.length}`);
  
  if (successCount === photosToDownload.length) {
    console.log('\n🎉 ВСЕ ФОТО ЗАГРУЖЕНЫ В SHOPIFY!');
    console.log('🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/7972352950326');
    console.log('🌐 И на сайте: http://localhost:8081/category/shopping');
  }
}

main().catch(console.error);

