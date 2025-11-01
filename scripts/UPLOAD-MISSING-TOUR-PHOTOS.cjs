#!/usr/bin/env node

/**
 * 📸 ПРОСТАЯ ЗАГРУЗКА ФОТО ДЛЯ ТУРОВ БЕЗ ФОТОГРАФИЙ
 * 
 * Просто проходит по каждому туру и загружает фото напрямую
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';
const REPO_PATH = path.join(__dirname, '..', '..', 'island-travel-echo-clone', 'island-travel-echo-clone');

const APPLY = process.argv.includes('--apply');

// Маппинг: handle → массив путей к фото в репозитории
const TOUR_PHOTOS = {
  'similan-islands-tour': [
    'src/assets/pearls-andaman-sea/gallery-01-railay-main.jpg',
    'src/assets/pearls-andaman-sea/gallery-02-railay-beach.jpg',
    'src/assets/pearls-andaman-sea/gallery-05-railay-cliffs.jpg',
    'src/assets/pearls-andaman-sea/gallery-06-hong-island.jpg',
  ],
  'krabi-secrets-tour': [
    'src/assets/pearls-andaman-sea/gallery-01-railay-main.jpg',
    'src/assets/pearls-andaman-sea/gallery-02-railay-beach.jpg',
    'src/assets/pearls-andaman-sea/gallery-05-railay-cliffs.jpg',
  ],
  'phang-nga-samet-tour': [
    'src/assets/rassvetnoe-prikljuchenie/airplane-beach.jpg',
    'src/assets/rassvetnoe-prikljuchenie/beyond-skywalk.jpg',
    'src/assets/rassvetnoe-prikljuchenie/elephant-show.jpg',
  ],
  'cheo-lan-lake-tour': [
    'src/assets/rafting-spa-atv/lake1-scaled.jpg',
    'src/assets/rafting-spa-atv/park-scaled.jpg',
    'src/assets/rafting-spa-atv/cave-scaled.jpg',
  ],
  'fishing-sunrise-tour': [
    'src/assets/maya-bay-sunrise-B-WNbBQ_.jpg',
    'src/assets/rassvetnoe-prikljuchenie/beyond-skywalk.jpg',
    'src/assets/rassvetnoe-prikljuchenie/airplane-beach.jpg',
  ],
};

// ============================================================================
// HELPER FUNCTIONS
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
    query GetProduct($handle: String!) {
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

async function uploadImageToShopify(productId, imagePath, altText) {
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
          alt: altText,
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
// MAIN FUNCTION
// ============================================================================

async function main() {
  console.log('📸 ПРОСТАЯ ЗАГРУЗКА ФОТО ДЛЯ ТУРОВ БЕЗ ФОТОГРАФИЙ');
  console.log('='.repeat(70));
  console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const [handle, photoPaths] of Object.entries(TOUR_PHOTOS)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📦 Обработка: ${handle}`);

    try {
      // 1. Получаем продукт
      const product = await getProductByHandle(handle);
      if (!product) {
        console.log(`⚠️  Тур не найден в Shopify, пропускаем...`);
        skipCount++;
        continue;
      }

      console.log(`✅ Найден: ${product.title}`);
      const productIdNumber = product.id.split('/').pop();

      // 2. Находим существующие фото
      const existingImagesQuery = `
        query GetProductImages($id: ID!) {
          product(id: $id) {
            images(first: 10) {
              edges {
                node {
                  id
                  url
                }
              }
            }
          }
        }
      `;
      const imagesData = await makeGraphQLRequest(existingImagesQuery, { id: product.id });
      const existingImages = imagesData.product.images.edges;

      if (existingImages.length > 0) {
        console.log(`✅ У тура уже есть ${existingImages.length} фото, пропускаем...`);
        skipCount++;
        continue;
      }

      // 3. Находим фото которые существуют
      const foundPhotos = [];
      for (const photoPath of photoPaths) {
        const fullPath = path.join(REPO_PATH, photoPath);
        if (fs.existsSync(fullPath)) {
          foundPhotos.push(fullPath);
        }
      }

      if (foundPhotos.length === 0) {
        console.log(`⚠️  Фото не найдены в репозитории, пропускаем...`);
        skipCount++;
        continue;
      }

      console.log(`📸 Найдено фото для загрузки: ${foundPhotos.length}`);

      if (APPLY) {
        // 4. Загружаем фото
        for (let i = 0; i < foundPhotos.length; i++) {
          const photoPath = foundPhotos[i];
          const altText = `${product.title} - ${path.basename(photoPath, path.extname(photoPath)).replace(/-/g, ' ')}`;
          
          try {
            console.log(`📤 [${i + 1}/${foundPhotos.length}] Загружаем: ${path.basename(photoPath)}`);
            const result = await uploadImageToShopify(productIdNumber, photoPath, altText);
            console.log(`   ✅ Загружено! ID: ${result.id} (${result.fileSizeKB} KB)`);
            
            if (i < foundPhotos.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } catch (error) {
            console.log(`   ❌ Ошибка: ${error.message}`);
          }
        }
        successCount++;
      } else {
        console.log(`🧪 DRY-RUN: Будет загружено ${foundPhotos.length} фото:`);
        foundPhotos.forEach(p => {
          const stats = fs.statSync(p);
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log(`   - ${path.basename(p)} (${sizeKB} KB)`);
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
      skipCount++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('📊 ИТОГОВЫЙ ОТЧЁТ');
  console.log('='.repeat(70));
  console.log(`✅ Успешно обработано: ${successCount}`);
  console.log(`⚠️  Пропущено: ${skipCount}`);
  console.log(`📊 Всего туров: ${Object.keys(TOUR_PHOTOS).length}`);

  if (!APPLY) {
    console.log(`\n💡 Для реальной загрузки добавьте флаг --apply`);
  } else {
    console.log(`\n🎉 ЗАГРУЗКА ЗАВЕРШЕНА!`);
  }
}

main().catch(console.error);

