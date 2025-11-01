#!/usr/bin/env node

/**
 * 📸 МАСТЕР-СКРИПТ: ЗАГРУЗКА ФОТОГРАФИЙ ВСЕХ ТУРОВ ИЗ РЕПОЗИТОРИЯ
 * 
 * Автоматически:
 * 1. Получает список всех туров из Shopify
 * 2. Находит соответствующие файлы в репозитории
 * 3. Парсит импорты изображений (поддерживает @/assets/ и ../assets/)
 * 4. Находит реальные файлы изображений
 * 5. Загружает их в Shopify через REST API (base64)
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/MASTER-UPLOAD-ALL-TOUR-PHOTOS.cjs [--apply] [--repo-path=/path/to/repo]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

// Путь к репозиторию
const REPO_PATH = process.argv.find(a => a.startsWith('--repo-path='))?.split('=')[1]
  || path.join(__dirname, '..', '..', 'island-travel-echo-clone', 'island-travel-echo-clone');
const APPLY = process.argv.includes('--apply');

console.log('📸 МАСТЕР-СКРИПТ: ЗАГРУЗКА ФОТОГРАФИЙ ВСЕХ ТУРОВ');
console.log('='.repeat(70));
console.log(`📍 Репозиторий: ${REPO_PATH}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

// ============================================================================
// МАППИНГ HANDLE → ФАЙЛ В РЕПОЗИТОРИИ
// ============================================================================

const TOUR_MAPPING = {
  'phi-phi-2-days-1-night': 'phiPhi2DaysTour.ts',
  '4-pearls-andaman-sea': 'pearlsTour.ts',
  'five-pearls-2-days': 'pearlsTour.ts',
  'james-bond-island-tour': 'jamesBondIslandTour.ts',
  'similan-islands-tour': null, // Файла нет в репозитории
  'eleven-islands-mega-tour': 'elevenIslandsMegaTour.ts',
  '⭐-11-островов-мега-тур': 'elevenIslandsMegaTour.ts', // ✅ Файл есть!
  'racha-coral-islands-tour': 'rachaCoralIslandsTour.ts',
  'racha-coral-rawai-tour': 'rachaCoralIslandsTour.ts', // ✅ Используем тот же файл
  'racha-coral-sunrise-tour': 'rachaCoralIslandsTour.ts', // ✅ Используем тот же файл
  'rafting-elephant-spa-atv': 'raftingSpaAtvTour.ts',
  'rafting-spa-atv-tour': 'raftingSpaAtvTour.ts',
  '🐘-као-лак-safari': 'kaoLakSafariTour.ts',
  'kao-lak-safari-tour': 'kaoLakSafariTour.ts',
  'avatar-plus-hangdong-tour': 'avatarPlusHangdongTour.ts',
  'аватар-плюс': 'avatarPlusHangdongTour.ts',
  'dostoprimechatelnosti-phuketa-tour': 'dostoprimechatelnostiPhuketaTour.ts',
  'phi-phi-sunrise-tour': 'phiPhiTour.ts',
  'eleven-islands-standard-tour': 'elevenIslandsStandardTour.ts',
  'phang-nga-skywalk-tour': 'rassvetnoePrikljuchenieTour.ts', // ✅ Рассветное Приключение
  'krabi-secrets-tour': null, // Файла нет в репозитории
  'phang-nga-samet-tour': null, // Файла нет в репозитории
  'cheo-lan-lake-tour': null, // Файла нет в репозитории
  'fishing-sunrise-tour': null, // Файла нет в репозитории
};

// ============================================================================
// 1. GRAPHQL REQUEST HELPER
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

// ============================================================================
// 2. ПОЛУЧЕНИЕ ВСЕХ ТУРОВ ИЗ SHOPIFY
// ============================================================================

async function getAllToursFromShopify() {
  const query = `
    query getTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions AND tags:tour") {
        edges {
          node {
            id
            title
            handle
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  
  const allTours = [];
  let after = null;
  
  do {
    const data = await makeGraphQLRequest(query, { first: 100, after });
    const { edges, pageInfo } = data.products;
    allTours.push(...edges.map(e => e.node));
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  
  console.log(`✅ Найдено туров в Shopify: ${allTours.length}\n`);
  return allTours;
}

// ============================================================================
// 3. ПАРСИНГ ИМПОРТОВ ИЗОБРАЖЕНИЙ (УЛУЧШЕННАЯ ВЕРСИЯ)
// ============================================================================

function parseImageImportsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const images = [];
    
    // ✅ УНИВЕРСАЛЬНЫЙ РЕГЕКС: Поддержка @/assets/ И ../assets/
    const importRegex = /import\s+(\w+)\s+from\s+["'](@\/assets\/|\.\.\/assets\/)([^"']+)["']/g;
    let match;
    
    const importsMap = {};
    while ((match = importRegex.exec(content)) !== null) {
      const varName = match[1];        // railayMain
      const prefix = match[2];         // @/assets/ или ../assets/
      const assetPath = match[3];      // pearls-andaman-sea/gallery-01-railay-main.jpg
      
      importsMap[varName] = assetPath;
    }
    
    // Находим mainImage и gallery
    const mainImageMatch = content.match(/mainImage:\s*(\w+)/);
    const galleryMatch = content.match(/gallery:\s*\[([^\]]+)\]/);
    
    // Парсим mainImage
    if (mainImageMatch) {
      const varName = mainImageMatch[1];
      if (importsMap[varName]) {
        images.push({ path: importsMap[varName], isMain: true });
      }
    }
    
    // Парсим gallery
    if (galleryMatch) {
      const galleryItems = galleryMatch[1];
      const varRegex = /\b(\w+)\b/g;
      let varMatch;
      while ((varMatch = varRegex.exec(galleryItems)) !== null) {
        const varName = varMatch[1];
        if (importsMap[varName] && varName !== 'mainImage') {
          // Проверяем, что это не mainImage (чтобы не дублировать)
          if (!images.some(img => img.path === importsMap[varName])) {
            images.push({ path: importsMap[varName], isMain: false });
          }
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error(`❌ Ошибка парсинга файла ${filePath}:`, error.message);
    return [];
  }
}

// ============================================================================
// 4. ПОИСК РЕАЛЬНЫХ ФАЙЛОВ ИЗОБРАЖЕНИЙ
// ============================================================================

function findImageFiles(repoPath, imageDataArray) {
  const assetsPath = path.join(repoPath, 'src', 'assets');
  const foundImages = [];
  
  for (const imgData of imageDataArray) {
    const imgPath = typeof imgData === 'string' ? imgData : imgData.path;
    const isMain = typeof imgData === 'object' ? imgData.isMain : false;
    
    // ✅ Пробуем разные варианты путей
    const possiblePaths = [
      path.join(assetsPath, imgPath),                    // Прямой путь
      path.join(assetsPath, ...imgPath.split('/')),      // Разбитый путь
      path.join(assetsPath, imgPath.replace(/^\.\.\//, '')), // Без ../ если есть
    ];
    
    let found = false;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        foundImages.push({
          filePath: possiblePath,
          relativePath: imgPath,
          isMain: isMain
        });
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log(`   ⚠️  Файл не найден: ${imgPath}`);
    }
  }
  
  return foundImages;
}

// ============================================================================
// 5. ЗАГРУЗКА ИЗОБРАЖЕНИЯ В SHOPIFY
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
          alt: altText || filename.replace(/\.[^.]*$/, '').replace(/-/g, ' ')
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
// 6. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    const dataPath = path.join(REPO_PATH, 'src', 'data');
    const assetsPath = path.join(REPO_PATH, 'src', 'assets');
    
    if (!fs.existsSync(dataPath) || !fs.existsSync(assetsPath)) {
      throw new Error(`Репозиторий не найден: ${REPO_PATH}`);
    }
    
    // Получаем все туры из Shopify
    const shopifyTours = await getAllToursFromShopify();
    
    let totalSuccess = 0;
    let totalSkip = 0;
    let totalImagesUploaded = 0;
    const results = [];
    
    for (const tour of shopifyTours) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📦 Обработка: ${tour.title}`);
      console.log(`🆔 Handle: ${tour.handle}`);
      
      // Извлекаем числовой ID
      const productIdNumber = tour.id.split('/').pop();
      
      // Находим файл в репозитории
      let fileName = TOUR_MAPPING[tour.handle];
      let filePath = null;
      
      if (fileName) {
        filePath = path.join(dataPath, fileName);
        if (!fs.existsSync(filePath)) {
          fileName = null;
          filePath = null;
        }
      }
      
      if (!fileName || !filePath) {
        // Пробуем найти автоматически
        const files = fs.readdirSync(dataPath);
        const cleanHandle = tour.handle.replace(/[🎯🏝️⭐🐘🦅🚣]/g, '').replace(/-/g, '').toLowerCase();
        
        const possibleFile = files.find(f => {
          if (!f.endsWith('.ts') || f === 'toursRegistry.ts') return false;
          const cleanFile = f.replace(/Tour\.ts$/, '').replace(/tour\.ts$/, '').toLowerCase();
          return cleanFile.includes(cleanHandle) || cleanHandle.includes(cleanFile);
        });
        
        if (possibleFile) {
          fileName = possibleFile;
          filePath = path.join(dataPath, possibleFile);
          console.log(`📄 Автоматически найден файл: ${possibleFile}`);
        }
      }
      
      if (!fileName || !filePath || !fs.existsSync(filePath)) {
        console.log(`⚠️  Файл не найден для "${tour.handle}", пропускаем...`);
        totalSkip++;
        results.push({ tour: tour.title, status: 'skipped', reason: 'file_not_found' });
        continue;
      }
      
      console.log(`📄 Файл: ${fileName}`);
      
      // Парсим импорты изображений
      const imagePaths = parseImageImportsFromFile(filePath);
      
      if (imagePaths.length === 0) {
        console.log(`⚠️  Изображения не найдены в файле, пропускаем...`);
        totalSkip++;
        results.push({ tour: tour.title, status: 'skipped', reason: 'no_images' });
        continue;
      }
      
      console.log(`📸 Найдено импортов изображений: ${imagePaths.length}`);
      
      // Находим реальные файлы
      const foundImages = findImageFiles(REPO_PATH, imagePaths);
      
      if (foundImages.length === 0) {
        console.log(`⚠️  Файлы изображений не найдены в assets, пропускаем...`);
        totalSkip++;
        results.push({ tour: tour.title, status: 'skipped', reason: 'files_not_found' });
        continue;
      }
      
      console.log(`✅ Найдено файлов изображений: ${foundImages.length}`);
      
      // Загружаем изображения
      if (APPLY) {
        // Сначала загружаем mainImage, потом остальные
        const sortedImages = foundImages.sort((a, b) => {
          if (a.isMain && !b.isMain) return -1;
          if (!a.isMain && b.isMain) return 1;
          return 0;
        });
        
        let uploadSuccess = 0;
        let uploadErrors = 0;
        
        for (let i = 0; i < sortedImages.length; i++) {
          const img = sortedImages[i];
          try {
            console.log(`📤 [${i + 1}/${sortedImages.length}] Загружаем: ${path.basename(img.filePath)}`);
            
            const altText = `${tour.title} - ${path.basename(img.filePath, path.extname(img.filePath)).replace(/-/g, ' ')}`;
            const result = await uploadImageToShopify(productIdNumber, img.filePath, altText);
            
            console.log(`   ✅ Загружено! ID: ${result.id} (${result.fileSizeKB} KB)`);
            uploadSuccess++;
            totalImagesUploaded++;
            
            // Пауза между загрузками (2 секунды)
            if (i < sortedImages.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } catch (error) {
            console.log(`   ❌ Ошибка: ${error.message}`);
            uploadErrors++;
          }
        }
        
        if (uploadSuccess > 0) {
          totalSuccess++;
          results.push({ 
            tour: tour.title, 
            status: 'success', 
            uploaded: uploadSuccess, 
            errors: uploadErrors 
          });
        } else {
          results.push({ tour: tour.title, status: 'error', reason: 'upload_failed' });
        }
      } else {
        console.log(`🧪 DRY-RUN: Будет загружено ${foundImages.length} изображений`);
        for (const img of foundImages) {
          const stats = fs.statSync(img.filePath);
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log(`   - ${path.basename(img.filePath)} (${sizeKB} KB) ${img.isMain ? '(main)' : ''}`);
        }
      }
      
      // Пауза между турами
      if (APPLY && tour !== shopifyTours[shopifyTours.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    // ============================================================================
    // ИТОГОВЫЙ ОТЧЁТ
    // ============================================================================
    
    console.log(`\n${'='.repeat(70)}`);
    console.log('📊 ИТОГОВЫЙ ОТЧЁТ');
    console.log('='.repeat(70));
    console.log(`✅ Успешно обработано туров: ${totalSuccess}`);
    console.log(`📸 Всего загружено изображений: ${totalImagesUploaded}`);
    console.log(`⚠️  Пропущено туров: ${totalSkip}`);
    console.log(`📊 Всего туров в Shopify: ${shopifyTours.length}`);
    
    if (APPLY && results.length > 0) {
      console.log(`\n📋 ДЕТАЛЬНЫЙ ОТЧЁТ:`);
      results.forEach(r => {
        if (r.status === 'success') {
          console.log(`   ✅ ${r.tour}: ${r.uploaded} фото`);
        } else if (r.status === 'skipped') {
          console.log(`   ⚠️  ${r.tour}: пропущен (${r.reason})`);
        } else {
          console.log(`   ❌ ${r.tour}: ошибка (${r.reason})`);
        }
      });
    }
    
    if (!APPLY) {
      console.log(`\n💡 Для реальной загрузки добавьте флаг --apply`);
    } else {
      console.log(`\n🎉 ЗАГРУЗКА ЗАВЕРШЕНА!`);
      console.log(`🌐 Проверь результаты: http://localhost:8080/tours`);
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

