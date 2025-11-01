const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

/**
 * 📸 ЗАГРУЗКА РЕАЛЬНЫХ ФОТОГРАФИЙ РАЙОНОВ ИЗ ЛОКАЛЬНЫХ ФАЙЛОВ
 * 
 * ⚠️ ВАЖНО: Используйте ТОЛЬКО реальные фотографии районов!
 * ❌ НЕ используйте бесплатные фотостоки (Unsplash, Pexels, Pixabay)
 * ✅ Используйте свои фото или фотографии с разрешением автора
 * 
 * ИНСТРУКЦИЯ:
 * 1. Создайте папку: photos/districts/[district-name]/
 * 2. Поместите фотографии в эту папку (JPG, PNG)
 * 3. Запустите скрипт: node scripts/upload-district-photos-from-local.cjs
 */

// Структура папок с фотографиями
const PHOTOS_DIR = path.join(__dirname, '../photos/districts');

// Маппинг handles районов на названия папок
const districtFolders = {
  'patong-district': 'patong',
  'karon-district': 'karon',
  'kata-district': 'kata',
  'bangtao-district': 'bangtao',
  'rawai-district': 'rawai',
  'phuket-town-district': 'phuket-town',
  'surin-district': 'surin',
  'kamala-district': 'kamala',
  'chalong-district': 'chalong',
  'panwa-district': 'panwa',
  'nai-harn-district': 'nai-harn',
  'kathu-district': 'kathu',
  'cherngtalay-district': 'cherngtalay',
  'naiyang-district': 'naiyang',
  'thalang-district': 'thalang'
};

/**
 * Получает Product ID по handle
 */
function getProductId(handle) {
  return new Promise((resolve, reject) => {
    const query = `
      query {
        products(first: 1, query: "handle:${handle}") {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;
    
    const data = JSON.stringify({ query });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const product = result.data?.products?.edges?.[0]?.node;
          if (product) {
            resolve({ id: product.id, title: product.title });
          } else {
            reject(new Error(`Product not found: ${handle}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Загружает изображение в Shopify через REST API (base64)
 */
function uploadImageToShopify(productId, filePath, filename, altText) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        reject(new Error(`Файл не найден: ${filePath}`));
        return;
      }

      let fileBuffer = fs.readFileSync(filePath);
      const fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
      
      // Проверяем размер файла (не больше 5MB для Shopify)
      if (fileBuffer.length > 5 * 1024 * 1024) {
        reject(new Error(`Файл слишком большой: ${fileSizeKB} KB (максимум 5MB)`));
        return;
      }
      
      // Конвертируем PNG в JPG если нужно (Shopify лучше принимает JPG)
      let finalFilename = filename;
      if (path.extname(filename).toLowerCase() === '.png') {
        try {
          // Используем sips (встроенная утилита macOS) для конвертации
          const { execSync } = require('child_process');
          const jpgPath = filePath.replace(/\.png$/i, '.jpg');
          execSync(`sips -s format jpeg -s formatOptions 85 "${filePath}" --out "${jpgPath}" 2>&1`);
          fileBuffer = fs.readFileSync(jpgPath);
          finalFilename = filename.replace(/\.png$/i, '.jpg');
          // Удаляем временный JPG файл после загрузки (будет удален позже)
        } catch (convError) {
          console.error(`      ⚠️  Не удалось конвертировать PNG в JPG: ${convError.message}`);
          // Продолжаем с PNG
        }
      }
      
      const base64Image = fileBuffer.toString('base64');
      
      const imageData = JSON.stringify({
        image: {
          attachment: base64Image,
          filename: finalFilename,
          alt: altText
        }
      });
      
      // Извлекаем числовой ID из GID (например: gid://shopify/Product/7982938423350 -> 7982938423350)
      const numericProductId = productId.replace(/^gid:\/\/shopify\/Product\//, '');
      
      const options = {
        hostname: SHOPIFY_STORE,
        path: `/admin/api/${API_VERSION}/products/${numericProductId}/images.json`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Length': Buffer.byteLength(imageData)
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            const result = JSON.parse(data).image;
            resolve({ ...result, fileSizeKB });
          } else {
            // Детальная информация об ошибке
            let errorMsg = `HTTP ${res.statusCode}`;
            try {
              const errorData = JSON.parse(data);
              errorMsg += `: ${JSON.stringify(errorData)}`;
            } catch (e) {
              errorMsg += `: ${data.substring(0, 500)}`;
            }
            console.error(`      🔍 Детали ошибки:`, errorMsg);
            reject(new Error(errorMsg));
          }
        });
      });
      
      req.on('error', reject);
      req.write(imageData);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Находит все фотографии в папке района
 */
function findPhotosInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath);
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    })
    .map(file => ({
      filename: file,
      path: path.join(folderPath, file),
      ext: path.extname(file).toLowerCase()
    }))
    .sort((a, b) => a.filename.localeCompare(b.filename)); // Сортируем по имени
}

/**
 * Основная функция
 */
async function main() {
  console.log('📸 ЗАГРУЗКА РЕАЛЬНЫХ ФОТОГРАФИЙ РАЙОНОВ ИЗ ЛОКАЛЬНЫХ ФАЙЛОВ\n');
  console.log('='.repeat(60));
  console.log('📁 Папка с фотографиями:', PHOTOS_DIR);
  console.log('⚠️  Используйте ТОЛЬКО реальные фотографии!');
  console.log('='.repeat(60));
  
  // Проверяем существование основной папки
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.log(`\n⚠️  Папка не найдена: ${PHOTOS_DIR}`);
    console.log(`\n📝 ИНСТРУКЦИЯ:`);
    console.log(`   1. Создайте папку: ${PHOTOS_DIR}`);
    console.log(`   2. Создайте подпапки для каждого района:`);
    console.log(`      ${PHOTOS_DIR}/patong/`);
    console.log(`      ${PHOTOS_DIR}/karon/`);
    console.log(`      ${PHOTOS_DIR}/kata/`);
    console.log(`      ... и т.д.`);
    console.log(`   3. Поместите фотографии (JPG, PNG) в соответствующие папки`);
    console.log(`   4. Запустите скрипт снова\n`);
    return;
  }
  
  let totalSuccess = 0;
  let totalErrors = 0;
  let totalSkipped = 0;
  
  for (const [handle, folderName] of Object.entries(districtFolders)) {
    const districtFolder = path.join(PHOTOS_DIR, folderName);
    const photos = findPhotosInFolder(districtFolder);
    
    console.log(`\n📁 ${handle.toUpperCase()}`);
    console.log(`   Папка: ${districtFolder}`);
    console.log(`   Найдено фото: ${photos.length}`);
    
    if (photos.length === 0) {
      console.log(`   ⏭️  Пропускаем (нет фотографий)`);
      totalSkipped++;
      continue;
    }
    
    try {
      // Получаем Product ID
      const { id: productId, title } = await getProductId(handle);
      console.log(`   ✅ Найден: ${title} (${productId})`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const altText = `${title} - Photo ${i + 1}`;
        
        try {
          console.log(`\n   📷 [${i + 1}/${photos.length}] ${photo.filename}`);
          
          // Загружаем в Shopify
          const image = await uploadImageToShopify(
            productId,
            photo.path,
            photo.filename,
            altText
          );
          
          console.log(`      ✅ Загружено! ID: ${image.id}, Размер: ${image.fileSizeKB} KB`);
          
          successCount++;
          totalSuccess++;
          
          // Пауза между загрузками
          if (i < photos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`      ❌ Ошибка:`, error.message);
          errorCount++;
          totalErrors++;
        }
      }
      
      console.log(`\n   📊 Итог: ${successCount}/${photos.length} успешно, ${errorCount} ошибок`);
      
      // Пауза между районами
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Ошибка получения продукта:`, error.message);
      totalErrors++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ФИНАЛЬНЫЙ ИТОГ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${totalSuccess} фотографий`);
  console.log(`❌ Ошибок: ${totalErrors}`);
  console.log(`⏭️  Пропущено (нет фото): ${totalSkipped} районов`);
  console.log(`\n🔗 Проверьте на сайте: http://localhost:8080/place/[district-handle]`);
  console.log(`\n💡 СОВЕТ: Добавьте больше фотографий в папки для лучшего результата!`);
}

main().catch(console.error);

