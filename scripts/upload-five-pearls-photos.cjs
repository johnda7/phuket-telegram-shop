#!/usr/bin/env node

/**
 * 📸 ЗАГРУЗКА ФОТО ДЛЯ ТУРА "FIVE PEARLS 2 DAYS"
 * 
 * Загружает фотографии из репозитория island-travel-echo-clone
 * напрямую в Shopify для тура "Five Pearls 2 Days"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

// Путь к репозиторию
const REPO_PATH = path.join(__dirname, '..', '..', 'island-travel-echo-clone', 'island-travel-echo-clone');
const TOUR_HANDLE = 'five-pearls-2-days';
const APPLY = process.argv.includes('--apply');

console.log('📸 ЗАГРУЗКА ФОТО ДЛЯ ТУРА "FIVE PEARLS 2 DAYS"');
console.log('='.repeat(70));
console.log(`📍 Репозиторий: ${REPO_PATH}`);
console.log(`🆔 Handle: ${TOUR_HANDLE}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

// ============================================================================
// СПИСОК ФОТОГРАФИЙ ИЗ РЕПОЗИТОРИЯ
// ============================================================================

const PHOTOS = [
  {
    name: 'gallery-01-railay-main.jpg',
    path: 'pearls-andaman-sea/gallery-01-railay-main.jpg',
    alt: 'Railay Beach - один из красивейших пляжей мира'
  },
  {
    name: 'gallery-02-railay-beach.jpg',
    path: 'pearls-andaman-sea/gallery-02-railay-beach.jpg',
    alt: 'Railay Beach - белоснежный песок и кристально чистая вода'
  },
  {
    name: 'gallery-03-railay-vertical.jpg',
    path: 'pearls-andaman-sea/gallery-03-railay-vertical.jpg',
    alt: 'Railay Beach - впечатляющие известняковые скалы'
  },
  {
    name: 'gallery-04-railay-boats.jpg',
    path: 'pearls-andaman-sea/gallery-04-railay-boats.jpg',
    alt: 'Railay Beach - лодки на берегу'
  },
  {
    name: 'gallery-05-railay-cliffs.jpg',
    path: 'pearls-andaman-sea/gallery-05-railay-cliffs.jpg',
    alt: 'Railay Beach - знаменитые скалы и пещеры'
  },
  {
    name: 'gallery-06-hong-island.jpg',
    path: 'pearls-andaman-sea/gallery-06-hong-island.jpg',
    alt: 'Остров Хонг - изумрудная лагуна'
  },
  {
    name: 'gallery-07-bamboo-island.webp',
    path: 'pearls-andaman-sea/gallery-07-bamboo-island.webp',
    alt: 'Bamboo Island - райский остров'
  }
];

// ============================================================================
// GRAPHQL ЗАПРОС ДЛЯ ПОЛУЧЕНИЯ PRODUCT ID
// ============================================================================

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData.data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;
  
  const data = await makeGraphQLRequest(query, { handle });
  return data.productByHandle;
}

// ============================================================================
// ЗАГРУЗКА ИЗОБРАЖЕНИЯ В SHOPIFY (REST API + BASE64)
// ============================================================================

function uploadImageToShopify(productId, imagePath, altText) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(imagePath)) {
        reject(new Error(`Файл не найден: ${imagePath}`));
        return;
      }

      const fileBuffer = fs.readFileSync(imagePath);
      const base64Image = fileBuffer.toString('base64');
      const filename = path.basename(imagePath);
      const fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
      
      const imageData = JSON.stringify({
        image: {
          attachment: base64Image,
          filename: filename,
          alt: altText || filename.replace(/\.[^.]*$/, '')
        }
      });
      
      const options = {
        hostname: SHOPIFY_STORE,
        path: `/admin/api/${API_VERSION}/products/${productId}/images.json`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Length': Buffer.byteLength(imageData),
        },
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            const result = JSON.parse(data).image;
            resolve({ ...result, fileSizeKB });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
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

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    const assetsPath = path.join(REPO_PATH, 'src', 'assets');
    
    if (!fs.existsSync(assetsPath)) {
      throw new Error(`Репозиторий не найден: ${REPO_PATH}`);
    }

    // 1. Получаем Product ID из Shopify
    console.log(`🔍 Ищем тур в Shopify: ${TOUR_HANDLE}...`);
    const product = await getProductByHandle(TOUR_HANDLE);
    
    if (!product) {
      throw new Error(`Тур не найден в Shopify: ${TOUR_HANDLE}`);
    }
    
    const productIdNumber = product.id.split('/').pop();
    console.log(`✅ Найден: ${product.title}`);
    console.log(`🆔 Product ID: ${productIdNumber}\n`);

    // 2. Проверяем наличие фото
    console.log(`📸 Проверяем фотографии в репозитории...\n`);
    
    const photosToUpload = [];
    for (const photo of PHOTOS) {
      const fullPath = path.join(assetsPath, photo.path);
      if (fs.existsSync(fullPath)) {
        photosToUpload.push({ ...photo, fullPath });
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   ✅ ${photo.name} (${sizeKB} KB)`);
      } else {
        console.log(`   ⚠️  ${photo.name} - НЕ НАЙДЕН`);
      }
    }

    if (photosToUpload.length === 0) {
      throw new Error('Не найдено ни одной фотографии!');
    }

    console.log(`\n📊 Найдено фотографий: ${photosToUpload.length}/${PHOTOS.length}\n`);

    // 3. Загружаем фото
    if (APPLY) {
      console.log(`🚀 НАЧИНАЕМ ЗАГРУЗКУ В SHOPIFY...\n`);
      
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < photosToUpload.length; i++) {
        const photo = photosToUpload[i];
        
        console.log(`📷 [${i + 1}/${photosToUpload.length}] ${photo.name}`);
        console.log(`   Путь: ${photo.path}`);
        console.log(`   Alt: ${photo.alt}`);
        
        try {
          const result = await uploadImageToShopify(
            productIdNumber,
            photo.fullPath,
            photo.alt
          );
          
          console.log(`   ✅ Загружено! ID: ${result.id}`);
          console.log(`   📦 Размер: ${result.fileSizeKB} KB`);
          console.log(`   🔗 URL: ${result.src}`);
          
          successCount++;
          
          // Пауза между загрузками (2 секунды)
          if (i < photosToUpload.length - 1) {
            console.log(`   ⏳ Пауза 2 сек...\n`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`   ❌ Ошибка: ${error.message}\n`);
          errorCount++;
        }
      }

      console.log('\n' + '='.repeat(70));
      console.log('📊 ИТОГИ ЗАГРУЗКИ:');
      console.log('='.repeat(70));
      console.log(`✅ Успешно загружено: ${successCount}/${photosToUpload.length}`);
      console.log(`❌ Ошибок: ${errorCount}/${photosToUpload.length}`);
      
      if (successCount > 0) {
        console.log(`\n🎉 ФОТОГРАФИИ ЗАГРУЖЕНЫ В SHOPIFY!`);
        console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${productIdNumber}`);
        console.log(`🌐 Или на сайте: http://localhost:8080/product/${TOUR_HANDLE}`);
      }
    } else {
      console.log(`\n🧪 DRY-RUN: Будет загружено ${photosToUpload.length} фотографий`);
      console.log(`💡 Для реальной загрузки добавьте флаг --apply`);
    }
    
  } catch (error) {
    console.error(`\n❌ КРИТИЧЕСКАЯ ОШИБКА:`, error.message);
    if (error.stack) {
      console.error(`\nStack trace:`, error.stack);
    }
    process.exit(1);
  }
}

main().catch(console.error);

