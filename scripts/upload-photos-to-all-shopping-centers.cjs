// Загружаем 3 фотографии во все торговые центры
// Используем те же фото, что и для Robinson Lifestyle

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Папка с фотографиями
const photosDir = path.join(__dirname, '..', 'photos', 'robinson');

// Торговые центры для загрузки фото (исключаем те, у которых уже есть фото)
const shoppingCenters = [
  {
    name: 'Jungceylon Shopping Center',
    handle: 'jungceylon-shopping-center',
    productId: '7974403080246'
  },
  {
    name: 'Premium Outlet Phuket',
    handle: 'premium-outlet-phuket',
    productId: '7974403145782'
  },
  {
    name: 'Big C Supercenter Phuket',
    handle: 'big-c-supercenter-phuket',
    productId: '7974403244086'
  },
  {
    name: 'Tesco Lotus Phuket',
    handle: 'tesco-lotus-phuket',
    productId: '7974403604534'
  }
];

// Фотографии для загрузки (те же, что и для Robinson)
const photoFiles = [
  { 
    filename: 'robinson-exterior.jpg', 
    alt: 'Современный фасад торгового центра',
    newName: 'shopping-center-exterior.jpg'
  },
  { 
    filename: 'robinson-food-court.jpg', 
    alt: 'Просторный фуд-корт с ресторанами',
    newName: 'shopping-center-food-court.jpg'
  },
  { 
    filename: 'robinson-stores.jpg', 
    alt: 'Розничные магазины и бутики',
    newName: 'shopping-center-stores.jpg'
  }
];

// Функция загрузки изображения в Shopify через REST API
function uploadImageToShopify(productId, filePath, filename, alt) {
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
      path: `/admin/api/2025-07/products/${productId}/images.json`,
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

async function uploadPhotosToAllCenters() {
  console.log('📸 ЗАГРУЗКА ФОТОГРАФИЙ ВО ВСЕ ТОРГОВЫЕ ЦЕНТРЫ\n');
  console.log(`📋 Загружаем в ${shoppingCenters.length} торговых центров`);
  console.log(`📷 По ${photoFiles.length} фотографий в каждый\n`);

  let totalSuccess = 0;
  let totalErrors = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`🏢 [${i + 1}/${shoppingCenters.length}] ${center.name}`);
    console.log(`   ID: ${center.productId}`);
    console.log(`   Handle: ${center.handle}\n`);

    let centerSuccess = 0;
    let centerErrors = 0;

    for (let j = 0; j < photoFiles.length; j++) {
      const photo = photoFiles[j];
      const localPath = path.join(photosDir, photo.filename);
      
      console.log(`   📷 [${j + 1}/${photoFiles.length}] ${photo.newName}`);
      
      try {
        // Проверяем существование файла
        if (!fs.existsSync(localPath)) {
          throw new Error(`Файл не найден: ${localPath}`);
        }
        
        const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
        console.log(`      📁 Размер: ${fileSizeKB} KB`);
        console.log(`      ⬆️  Загружаем...`);
        
        const result = await uploadImageToShopify(
          center.productId, 
          localPath, 
          photo.newName, 
          `${center.name} - ${photo.alt}`
        );
        console.log(`      ✅ Загружено! ID: ${result.id}`);
        
        centerSuccess++;
        totalSuccess++;
        
        // Задержка между загрузками
        if (j < photoFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error(`      ❌ Ошибка:`, error.message);
        centerErrors++;
        totalErrors++;
      }
      
      console.log(''); // Пустая строка для читаемости
    }

    console.log(`   📊 ${center.name}: ${centerSuccess}/${photoFiles.length} успешно\n`);
    
    // Задержка между торговыми центрами
    if (i < shoppingCenters.length - 1) {
      console.log('   ⏳ Пауза 3 секунды...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ЗАГРУЗКИ:');
  console.log('='.repeat(60));
  console.log(`✅ Всего успешно загружено: ${totalSuccess}/${shoppingCenters.length * photoFiles.length}`);
  console.log(`❌ Всего ошибок: ${totalErrors}/${shoppingCenters.length * photoFiles.length}`);
  
  if (totalSuccess > 0) {
    console.log('\n🎉 ФОТОГРАФИИ ЗАГРУЖЕНЫ ВО ВСЕ ТОРГОВЫЕ ЦЕНТРЫ!');
    console.log('🔗 Проверь в Shopify Admin:');
    shoppingCenters.forEach(center => {
      console.log(`   ${center.name}: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${center.productId}`);
    });
  }
}

uploadPhotosToAllCenters().catch(console.error);
