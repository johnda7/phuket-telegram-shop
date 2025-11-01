#!/usr/bin/env node

/**
 * 🔧 МАСТЕР-СКРИПТ: ИСПРАВЛЕНИЕ ОПИСАНИЙ И ЗАГРУЗКА ФОТО ВСЕХ ТУРОВ
 * 
 * Этот скрипт:
 * 1. Парсит реальные данные туров из репозитория island-travel-echo-clone
 * 2. Формирует правильные HTML описания на основе реальных данных
 * 3. Скачивает фотографии из репозитория
 * 4. Загружает фотографии в Shopify через REST API (base64)
 * 5. Обновляет описания в Shopify
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/FIX-ALL-TOURS-DESCRIPTIONS-AND-PHOTOS.cjs --apply
 */

const https = require('https');
const http = require('http');
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

console.log('🔧 ИСПРАВЛЕНИЕ ОПИСАНИЙ И ЗАГРУЗКА ФОТО ВСЕХ ТУРОВ');
console.log('='.repeat(70));
console.log(`📍 Репозиторий: ${REPO_PATH}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

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
// 2. ПАРСИНГ ДАННЫХ ТУРОВ ИЗ РЕПОЗИТОРИЯ
// ============================================================================

function parseTourDataFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Парсим данные тура
    const tourData = {
      id: null,
      title: null,
      subtitle: null,
      description: null,
      priceAdult: null,
      priceChild: null,
      duration: null,
      groupSize: null,
      highlights: [],
      included: [],
      excluded: [],
      itinerary: [],
      importantInfo: [],
      gallery: [],
      tags: []
    };

    // Извлекаем title
    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) tourData.title = titleMatch[1];

    // Извлекаем subtitle
    const subtitleMatch = content.match(/subtitle:\s*['"]([^'"]+)['"]/);
    if (subtitleMatch) tourData.subtitle = subtitleMatch[1];

    // Извлекаем description (многострочный)
    const descMatch = content.match(/description:\s*`([^`]+)`/s) || 
                      content.match(/description:\s*['"]([^'"]+)['"]/);
    if (descMatch) tourData.description = descMatch[1].trim();

    // Извлекаем цены
    const priceAdultMatch = content.match(/priceAdult:\s*(\d+)/);
    if (priceAdultMatch) tourData.priceAdult = parseInt(priceAdultMatch[1]);

    const priceChildMatch = content.match(/priceChild:\s*(\d+)/);
    if (priceChildMatch) tourData.priceChild = parseInt(priceChildMatch[1]);

    // Извлекаем duration
    const durationMatch = content.match(/duration:\s*['"]([^'"]+)['"]/);
    if (durationMatch) tourData.duration = durationMatch[1];

    // Извлекаем groupSize
    const groupSizeMatch = content.match(/groupSize:\s*['"]([^'"]+)['"]/);
    if (groupSizeMatch) tourData.groupSize = groupSizeMatch[1];

    // Извлекаем highlights (массив)
    const highlightsMatch = content.match(/highlights:\s*\[(.*?)\]/s);
    if (highlightsMatch) {
      const highlightsStr = highlightsMatch[1];
      const highlights = highlightsStr.match(/['"]([^'"]+)['"]/g);
      if (highlights) {
        tourData.highlights = highlights.map(h => h.replace(/['"]/g, ''));
      }
    }

    // Извлекаем included (массив)
    const includedMatch = content.match(/included:\s*\[(.*?)\]/s);
    if (includedMatch) {
      const includedStr = includedMatch[1];
      const included = includedStr.match(/['"]([^'"]+)['"]/g);
      if (included) {
        tourData.included = included.map(i => i.replace(/['"]/g, ''));
      }
    }

    // Извлекаем excluded/notIncluded (массив)
    const excludedMatch = content.match(/(?:excluded|notIncluded):\s*\[(.*?)\]/s);
    if (excludedMatch) {
      const excludedStr = excludedMatch[1];
      const excluded = excludedStr.match(/['"]([^'"]+)['"]/g);
      if (excluded) {
        tourData.excluded = excluded.map(e => e.replace(/['"]/g, ''));
      }
    }

    // Извлекаем itinerary/schedule (массив объектов)
    const itineraryMatch = content.match(/(?:itinerary|schedule):\s*\[(.*?)\]/s);
    if (itineraryMatch) {
      const itineraryStr = itineraryMatch[1];
      // Парсим объекты { day: "...", time: "...", activity: "..." }
      const items = itineraryStr.match(/\{[^}]+\}/g);
      if (items) {
        tourData.itinerary = items.map(item => {
          const dayMatch = item.match(/day:\s*['"]([^'"]+)['"]/);
          const timeMatch = item.match(/time:\s*['"]([^'"]+)['"]/);
          const activityMatch = item.match(/(?:activity|title):\s*['"]([^'"]+)['"]/);
          const descMatch = item.match(/description:\s*['"]([^'"]+)['"]/);
          return {
            day: dayMatch ? dayMatch[1] : '',
            time: timeMatch ? timeMatch[1] : '',
            activity: activityMatch ? activityMatch[1] : (descMatch ? descMatch[1] : '')
          };
        });
      }
    }

    // Извлекаем importantInfo (массив)
    const importantInfoMatch = content.match(/importantInfo:\s*\[(.*?)\]/s);
    if (importantInfoMatch) {
      const importantInfoStr = importantInfoMatch[1];
      const importantInfo = importantInfoStr.match(/['"]([^'"]+)['"]/g);
      if (importantInfo) {
        tourData.importantInfo = importantInfo.map(i => i.replace(/['"]/g, ''));
      }
    }

    // Извлекаем gallery (импорты изображений)
    const galleryImports = content.match(/import\s+(\w+)\s+from\s+['"][^'"]+['"]/g);
    if (galleryImports) {
      // Находим gallery массив
      const galleryMatch = content.match(/gallery:\s*\[(.*?)\]/s);
      if (galleryMatch) {
        const galleryStr = galleryMatch[1];
        const galleryItems = galleryStr.match(/\w+/g);
        if (galleryItems) {
          tourData.gallery = galleryItems;
        }
      }
    }

    // Извлекаем пути к изображениям из импортов
    const imageImports = content.match(/import\s+\w+\s+from\s+['"]([^'"]+)['"]/g);
    if (imageImports) {
      tourData.imagePaths = imageImports.map(imp => {
        const pathMatch = imp.match(/from\s+['"]([^'"]+)['"]/);
        return pathMatch ? pathMatch[1] : null;
      }).filter(Boolean);
    }

    return tourData;
  } catch (error) {
    console.error(`❌ Ошибка парсинга ${filePath}:`, error.message);
    return null;
  }
}

// ============================================================================
// 3. ГЕНЕРАЦИЯ HTML ОПИСАНИЯ НА ОСНОВЕ РЕАЛЬНЫХ ДАННЫХ
// ============================================================================

function generateRealDescriptionHTML(tourData) {
  const isTwoDays = tourData.duration && (tourData.duration.includes('2') || tourData.duration.includes('ночь'));
  
  return `
<div class="space-y-6">
  <!-- Hero секция -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
    <h1 class="text-3xl font-black mb-2">${tourData.title || 'Тур'}</h1>
    ${tourData.subtitle ? `<p class="text-lg opacity-90">${tourData.subtitle}</p>` : ''}
    ${tourData.groupSize ? `<p class="text-sm opacity-75 mt-2">Группа: ${tourData.groupSize}</p>` : ''}
  </div>

  <!-- Краткое описание -->
  ${tourData.description ? `
  <div class="bg-gray-50 p-6 rounded-lg">
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      ${tourData.description.replace(/\n/g, '<br>')}
    </p>
    ${tourData.duration ? `
    <p class="text-gray-600">
      <strong>⏱️ Длительность:</strong> ${tourData.duration}
    </p>
    ` : ''}
  </div>
  ` : ''}

  ${tourData.highlights && tourData.highlights.length > 0 ? `
  <!-- Ключевые моменты -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✨ Что вас ждёт</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    ${tourData.highlights.map(highlight => `
    <div class="bg-blue-50 p-4 rounded-lg">
      <div class="flex items-center gap-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">${highlight}</span>
      </div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  ${tourData.included && tourData.included.length > 0 ? `
  <!-- Что входит -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✅ Что входит в тур</h2>
  <div class="bg-gray-50 p-6 rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${tourData.included.map(item => `
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">${item}</span>
      </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${tourData.itinerary && tourData.itinerary.length > 0 ? `
  <!-- Программа тура -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">📅 Программа тура</h2>
  ${isTwoDays ? `
  ${tourData.itinerary.filter(i => i.day.includes('1')).length > 0 ? `
  <div class="bg-blue-50 p-6 rounded-lg mb-4">
    <h3 class="text-xl font-semibold text-blue-800 mb-3">День 1</h3>
    <div class="space-y-2 text-sm">
      ${tourData.itinerary.filter(i => i.day.includes('1')).map(item => `
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">${item.time || ''}</span>
        <span class="text-gray-700 ml-4">${item.activity || item.description || ''}</span>
      </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  ${tourData.itinerary.filter(i => i.day.includes('2')).length > 0 ? `
  <div class="bg-green-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-green-800 mb-3">День 2</h3>
    <div class="space-y-2 text-sm">
      ${tourData.itinerary.filter(i => i.day.includes('2')).map(item => `
      <div class="flex justify-between">
        <span class="font-medium text-green-900">${item.time || ''}</span>
        <span class="text-gray-700 ml-4">${item.activity || item.description || ''}</span>
      </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  ` : `
  <div class="bg-blue-50 p-6 rounded-lg">
    <div class="space-y-2 text-sm">
      ${tourData.itinerary.map(item => `
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">${item.time || ''}</span>
        <span class="text-gray-700 ml-4">${item.activity || item.description || ''}</span>
      </div>
      `).join('')}
    </div>
  </div>
  `}
  ` : ''}

  ${tourData.excluded && tourData.excluded.length > 0 ? `
  <!-- Не включено -->
  <div class="bg-yellow-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-yellow-800 mb-3">⚠️ Не включено</h3>
    <div class="space-y-2 text-sm text-gray-700">
      ${tourData.excluded.map(item => `<div>• ${item}</div>`).join('')}
    </div>
  </div>
  ` : ''}

  ${tourData.importantInfo && tourData.importantInfo.length > 0 ? `
  <!-- Важная информация -->
  <div class="bg-blue-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-blue-800 mb-3">💡 Важно знать</h3>
    <div class="space-y-2 text-sm text-gray-700">
      ${tourData.importantInfo.map(info => `<div>• ${info}</div>`).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Финальный конверсионный блок -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Готовы отправиться в незабываемое путешествие?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🏝️ Забронировать тур</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">💱 Обменять валюту</a>
    </div>
  </div>
</div>
  `.trim();
}

// ============================================================================
// 4. ПОЛУЧЕНИЕ ВСЕХ ТУРОВ ИЗ SHOPIFY
// ============================================================================

async function getAllToursFromShopify() {
  console.log('🔍 Получаем все туры из Shopify...');
  
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions tag:tour") {
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
// 5. ПОИСК ДАННЫХ ТУРА В РЕПОЗИТОРИИ
// ============================================================================

function findTourDataInRepo(repoPath, shopifyHandle) {
  const dataPath = path.join(repoPath, 'src', 'data');
  
  if (!fs.existsSync(dataPath)) {
    return null;
  }
  
  // Список файлов туров для проверки
  const tourFiles = [
    'pearlsTour.ts',
    'phiPhi2DaysTour.ts',
    'jamesBondIslandTour.ts',
    'similanIslandsTour.ts',
    'elevenIslandsMegaTour.ts',
    'rachaCoralIslandsTour.ts',
    'raftingSpaAtvTour.ts',
    'kaoLakSafariTour.ts',
    'avatarPlusHangdongTour.ts',
    'dostoprimechatelnostiPhuketaTour.ts'
  ];
  
  for (const file of tourFiles) {
    const filePath = path.join(dataPath, file);
    if (fs.existsSync(filePath)) {
      const tourData = parseTourDataFromFile(filePath);
      if (tourData && tourData.title) {
        // Проверяем соответствие по handle или title
        const tourHandle = tourData.title.toLowerCase()
          .replace(/[^a-zа-я0-9\s]/g, '')
          .replace(/\s+/g, '-');
        const shopifyHandleLower = shopifyHandle.toLowerCase();
        
        if (tourHandle.includes(shopifyHandleLower.replace(/-tour$/, '')) || 
            shopifyHandleLower.includes(tourHandle.replace(/-/g, ''))) {
          return { ...tourData, filePath };
        }
      }
    }
  }
  
  return null;
}

// ============================================================================
// 6. СКАЧИВАНИЕ И ЗАГРУЗКА ФОТОГРАФИЙ
// ============================================================================

function downloadImageFromRepo(repoPath, imagePath, outputPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(repoPath, 'src', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      reject(new Error(`Файл не найден: ${fullPath}`));
      return;
    }
    
    // Копируем файл
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.copyFileSync(fullPath, outputPath);
    resolve(outputPath);
  });
}

function uploadImageToShopify(productId, imagePath) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString('base64');
    const filename = path.basename(imagePath);
    
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename,
        alt: filename.replace(/\.[^.]*$/, '')
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

// ============================================================================
// 7. ОБНОВЛЕНИЕ ОПИСАНИЯ В SHOPIFY
// ============================================================================

async function updateTourDescription(productId, descriptionHtml) {
  const escapedDescription = descriptionHtml
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
  
  const mutation = `
    mutation UpdateProduct($id: ID!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: "${escapedDescription}"
      }) {
        product { id title }
        userErrors { field message }
      }
    }
  `;
  
  const data = await makeGraphQLRequest(mutation, { id: productId });
  
  if (data.productUpdate.userErrors?.length > 0) {
    throw new Error(JSON.stringify(data.productUpdate.userErrors));
  }
  
  return data.productUpdate.product;
}

// ============================================================================
// 8. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    // 1. Получаем все туры из Shopify
    const shopifyTours = await getAllToursFromShopify();
    
    // 2. Обрабатываем каждый тур
    const tempDir = path.join(__dirname, 'temp-images');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    for (const tour of shopifyTours) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📦 Обработка тура: ${tour.title}`);
      console.log(`🆔 Handle: ${tour.handle}`);
      
      // Извлекаем числовой ID
      const productIdNumber = tour.id.split('/').pop();
      
      // Ищем данные в репозитории
      const repoData = findTourDataInRepo(REPO_PATH, tour.handle);
      
      if (!repoData) {
        console.log(`⚠️  Данные не найдены в репозитории, пропускаем...`);
        continue;
      }
      
      console.log(`✅ Найдены данные в репозитории`);
      
      // 3. Генерируем HTML описание
      const descriptionHtml = generateRealDescriptionHTML(repoData);
      
      if (APPLY) {
        // 4. Обновляем описание
        console.log(`📝 Обновляем описание...`);
        await updateTourDescription(tour.id, descriptionHtml);
        console.log(`✅ Описание обновлено`);
        
        // 5. Загружаем фотографии
        if (repoData.imagePaths && repoData.imagePaths.length > 0) {
          console.log(`📸 Загружаем ${repoData.imagePaths.length} фотографий...`);
          
          for (let i = 0; i < Math.min(repoData.imagePaths.length, 10); i++) {
            const imagePath = repoData.imagePaths[i];
            try {
              const tempImagePath = path.join(tempDir, `tour-${productIdNumber}-${i}.jpg`);
              await downloadImageFromRepo(REPO_PATH, imagePath, tempImagePath);
              
              await uploadImageToShopify(productIdNumber, tempImagePath);
              console.log(`   ✅ Фото ${i + 1}/${repoData.imagePaths.length} загружено`);
              
              // Пауза между загрузками
              await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
              console.log(`   ⚠️  Ошибка загрузки фото ${i + 1}: ${error.message}`);
            }
          }
        }
      } else {
        console.log(`🧪 DRY-RUN: Описание будет обновлено`);
        console.log(`🧪 DRY-RUN: Будет загружено ${repoData.imagePaths?.length || 0} фотографий`);
      }
      
      // Пауза между турами
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Очистка временных файлов
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ ОБРАБОТКА ЗАВЕРШЕНА!`);
    console.log(`📊 Обработано туров: ${shopifyTours.length}`);
    
  } catch (error) {
    console.error(`\n❌ КРИТИЧЕСКАЯ ОШИБКА:`, error.message);
    if (error.stack) {
      console.error(`\nStack trace:`, error.stack);
    }
    process.exit(1);
  }
}

main().catch(console.error);

