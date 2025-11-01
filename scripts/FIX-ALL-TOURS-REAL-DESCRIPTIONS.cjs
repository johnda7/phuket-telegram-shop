#!/usr/bin/env node

/**
 * 🔧 МАСТЕР-СКРИПТ: ИСПРАВЛЕНИЕ ОПИСАНИЙ ВСЕХ ТУРОВ ОРИГИНАЛЬНЫМИ ДАННЫМИ
 * 
 * Парсит реальные данные из репозитория island-travel-echo-clone
 * и создает правильные HTML описания для каждого тура
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/FIX-ALL-TOURS-REAL-DESCRIPTIONS.cjs --apply
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

console.log('🔧 ИСПРАВЛЕНИЕ ОПИСАНИЙ ВСЕХ ТУРОВ ОРИГИНАЛЬНЫМИ ДАННЫМИ');
console.log('='.repeat(70));
console.log(`📍 Репозиторий: ${REPO_PATH}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

// ============================================================================
// МАППИНГ HANDLE → ФАЙЛ В РЕПОЗИТОРИИ
// ============================================================================

const TOUR_MAPPING = {
  'phi-phi-2-days-1-night': 'phiPhi2DaysTour.ts',
  '4-pearls-andaman-sea': 'pearlsTour.ts',
  'james-bond-island-tour': 'jamesBondIslandTour.ts',
  'similan-islands-tour': null, // Нужно найти правильный файл
  'eleven-islands-mega-tour': 'elevenIslandsMegaTour.ts',
  '⭐-11-островов-мега-тур': 'elevenIslandsMegaTour.ts',
  'racha-coral-islands-tour': 'rachaCoralIslandsTour.ts',
  'rafting-spa-atv-tour': 'raftingSpaAtvTour.ts',
  'rafting-elephant-spa-atv': 'raftingSpaAtvTour.ts',
  '🐘-као-лак-safari': 'kaoLakSafariTour.ts',
  'kao-lak-safari-tour': 'kaoLakSafariTour.ts',
  'аватар-плюс': 'avatarPlusHangdongTour.ts',
  'avatar-plus-hangdong-tour': 'avatarPlusHangdongTour.ts',
  'dostoprimechatelnosti-phuketa-tour': 'dostoprimechatelnostiPhuketaTour.ts',
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
// 2. ПАРСИНГ ДАННЫХ ИЗ TS ФАЙЛА
// ============================================================================

function parseTourFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const tourData = {};

    // Title
    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) tourData.title = titleMatch[1];

    // Subtitle
    const subtitleMatch = content.match(/subtitle:\s*['"]([^'"]+)['"]/);
    if (subtitleMatch) tourData.subtitle = subtitleMatch[1];

    // Description (многострочный с backticks)
    const descMatch = content.match(/description:\s*`([^`]+)`/s);
    if (descMatch) {
      tourData.description = descMatch[1].trim().replace(/\n\s*\n/g, '\n');
    }

    // Prices
    const priceAdultMatch = content.match(/priceAdult:\s*(\d+)/);
    if (priceAdultMatch) tourData.priceAdult = parseInt(priceAdultMatch[1]);

    const priceChildMatch = content.match(/priceChild:\s*(\d+)/);
    if (priceChildMatch) tourData.priceChild = parseInt(priceChildMatch[1]);

    // Duration
    const durationMatch = content.match(/duration:\s*['"]([^'"]+)['"]/);
    if (durationMatch) tourData.duration = durationMatch[1];

    // Group size
    const groupSizeMatch = content.match(/groupSize:\s*['"]([^'"]+)['"]/);
    if (groupSizeMatch) tourData.groupSize = groupSizeMatch[1];

    // Highlights
    const highlightsMatch = content.match(/highlights:\s*\[([^\]]+)\]/s);
    if (highlightsMatch) {
      const highlightsStr = highlightsMatch[1];
      tourData.highlights = highlightsStr.match(/['"]([^'"]+)['"]/g)?.map(h => h.replace(/['"]/g, '')) || [];
    }

    // Included
    const includedMatch = content.match(/included:\s*\[([^\]]+)\]/s);
    if (includedMatch) {
      const includedStr = includedMatch[1];
      tourData.included = includedStr.match(/['"]([^'"]+)['"]/g)?.map(i => i.replace(/['"]/g, '')) || [];
    }

    // Excluded / notIncluded
    const excludedMatch = content.match(/(?:excluded|notIncluded):\s*\[([^\]]+)\]/s);
    if (excludedMatch) {
      const excludedStr = excludedMatch[1];
      tourData.excluded = excludedStr.match(/['"]([^'"]+)['"]/g)?.map(e => e.replace(/['"]/g, '')) || [];
    }

    // Schedule / Itinerary (более сложный парсинг)
    // Пробуем найти schedule или itinerary массивы
    const scheduleMatch = content.match(/(?:schedule|itinerary):\s*\[([\s\S]*?)\]/);
    if (scheduleMatch) {
      const scheduleStr = scheduleMatch[1];
      const objects = [];
      
      // Регулярка для объектов с day, time, title/activity, description
      const objectRegex = /\{\s*day:\s*['"]([^'"]+)['"],\s*time:\s*['"]([^'"]+)['"],\s*(?:title:\s*['"]([^'"]+)['"]|activity:\s*['"]([^'"]+)['"]),\s*(?:description:\s*['"]([^'"]*?)['"])?\s*\}/g;
      let match;
      while ((match = objectRegex.exec(scheduleStr)) !== null) {
        objects.push({
          day: match[1],
          time: match[2],
          title: match[3] || match[4] || '',
          description: match[5] || match[3] || match[4] || ''
        });
      }
      
      // Если не нашлось через regex с title/activity, пробуем простой формат только с activity
      if (objects.length === 0) {
        const simpleRegex = /\{\s*day:\s*['"]([^'"]+)['"],\s*time:\s*['"]([^'"]+)['"],\s*activity:\s*['"]([^'"]+)['"]\s*\}/g;
        while ((match = simpleRegex.exec(scheduleStr)) !== null) {
          objects.push({
            day: match[1],
            time: match[2],
            title: match[3],
            description: match[3]
          });
        }
      }
      
      tourData.schedule = objects;
    }

    // Important Info
    const importantInfoMatch = content.match(/importantInfo:\s*\[([^\]]+)\]/s);
    if (importantInfoMatch) {
      const importantInfoStr = importantInfoMatch[1];
      tourData.importantInfo = importantInfoStr.match(/['"]([^'"]+)['"]/g)?.map(i => i.replace(/['"]/g, '')) || [];
    }

    // Requirements (если есть)
    const requirementsMatch = content.match(/requirements:\s*\[([^\]]+)\]/s);
    if (requirementsMatch) {
      const requirementsStr = requirementsMatch[1];
      tourData.requirements = requirementsStr.match(/['"]([^'"]+)['"]/g)?.map(r => r.replace(/['"]/g, '')) || [];
    }

    // Image paths
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
// 3. ГЕНЕРАЦИЯ HTML ОПИСАНИЯ (КАК У ПХИ-ПХИ)
// ============================================================================

function generateDescriptionHTML(tourData) {
  const isTwoDays = tourData.duration && (tourData.duration.includes('2') || tourData.duration.includes('ночь'));
  
  let html = `<h1>${tourData.title || 'Тур'}</h1>\n\n`;
  
  if (tourData.subtitle) {
    html += `<p><strong>${tourData.subtitle}</strong></p>\n\n`;
  }
  
  if (tourData.description) {
    // Форматируем описание: разбиваем на параграфы
    const paragraphs = tourData.description.split(/\n\s*\n/).filter(p => p.trim());
    paragraphs.forEach(paragraph => {
      html += `<p>${paragraph.trim()}</p>\n\n`;
    });
  }
  
  if (tourData.highlights && tourData.highlights.length > 0) {
    html += `<h2>✨ Что вас ждёт</h2>\n<ul>\n`;
    tourData.highlights.forEach(highlight => {
      html += `<li>${highlight}</li>\n`;
    });
    html += `</ul>\n\n`;
  }
  
  if (tourData.schedule && tourData.schedule.length > 0) {
    html += `<h2>📅 Программа тура</h2>\n\n`;
    
    if (isTwoDays) {
      // День 1
      const day1Items = tourData.schedule.filter(item => item.day.includes('1') || item.day.includes('День 1'));
      if (day1Items.length > 0) {
        html += `<h3>День 1: Пхукет → ${tourData.title.includes('Пхи-Пхи') ? 'Пхи-Пхи' : tourData.title.includes('Краби') ? 'Краби' : 'Острова'}</h3>\n`;
        day1Items.forEach(item => {
          html += `<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">\n`;
          html += `  <strong>${item.time}</strong> — ${item.title || item.description}\n`;
          html += `</div>\n`;
          if (item.description && item.description !== item.title) {
            html += `<p>${item.description}</p>\n\n`;
          }
        });
      }
      
      // День 2
      const day2Items = tourData.schedule.filter(item => item.day.includes('2') || item.day.includes('День 2'));
      if (day2Items.length > 0) {
        html += `<h3>День 2: ${tourData.title.includes('Пхи-Пхи') ? 'Пхи-Пхи' : tourData.title.includes('Краби') ? 'Краби' : 'Острова'} → Пхукет</h3>\n`;
        day2Items.forEach(item => {
          html += `<div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg mb-4">\n`;
          html += `  <strong>${item.time}</strong> — ${item.title || item.description}\n`;
          html += `</div>\n`;
          if (item.description && item.description !== item.title) {
            html += `<p>${item.description}</p>\n\n`;
          }
        });
      }
    } else {
      // Однодневный тур
      tourData.schedule.forEach(item => {
        html += `<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">\n`;
        html += `  <strong>${item.time}</strong> — ${item.title || item.description}\n`;
        html += `</div>\n`;
        if (item.description && item.description !== item.title) {
          html += `<p>${item.description}</p>\n\n`;
        }
      });
    }
    html += `\n`;
  }
  
  if (tourData.included && tourData.included.length > 0) {
    html += `<h2>✅ Включено в стоимость</h2>\n\n<h3>Включено</h3>\n<ul>\n`;
    tourData.included.forEach(item => {
      html += `<li>✓ ${item}</li>\n`;
    });
    html += `</ul>\n\n`;
  }
  
  if (tourData.excluded && tourData.excluded.length > 0) {
    html += `<h3>Не включено</h3>\n<ul>\n`;
    tourData.excluded.forEach(item => {
      html += `<li>✗ ${item}</li>\n`;
    });
    html += `</ul>\n\n`;
  }
  
  if (tourData.requirements && tourData.requirements.length > 0) {
    html += `<h2>🎒 Что взять с собой</h2>\n<ul>\n`;
    tourData.requirements.forEach(item => {
      html += `<li>• ${item}</li>\n`;
    });
    html += `</ul>\n\n`;
  }
  
  if (tourData.importantInfo && tourData.importantInfo.length > 0) {
    html += `<h2>⚠️ Важная информация</h2>\n<ul>\n`;
    tourData.importantInfo.forEach(info => {
      html += `<li>⚠ ${info}</li>\n`;
    });
    html += `</ul>\n\n`;
  }
  
  html += `<h2>🎯 Планируете поездку?</h2>\n`;
  html += `<div class="flex flex-wrap gap-4 mb-4">\n`;
  html += `  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>\n`;
  html += `  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>\n`;
  html += `  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>\n`;
  html += `</div>\n\n`;
  
  html += `<p><em>${tourData.title} — это не просто тур, это незабываемое путешествие в райский уголок Андаманского моря. Идеальное сочетание приключений, отдыха и природной красоты для создания воспоминаний на всю жизнь.</em></p>`;
  
  return html;
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
// 5. ОБНОВЛЕНИЕ ОПИСАНИЯ В SHOPIFY
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
// 6. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    const dataPath = path.join(REPO_PATH, 'src', 'data');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Репозиторий не найден: ${dataPath}`);
    }
    
    // Получаем все туры из Shopify
    const shopifyTours = await getAllToursFromShopify();
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const tour of shopifyTours) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📦 Обработка: ${tour.title}`);
      console.log(`🆔 Handle: ${tour.handle}`);
      
      // Улучшенный поиск файла
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
        const cleanTitle = tour.title.replace(/[🎯🏝️⭐🐘🦅🚣]/g, '').replace(/\s+/g, '').toLowerCase();
        
        const possibleFile = files.find(f => {
          if (!f.endsWith('.ts') || f === 'toursRegistry.ts') return false;
          const cleanFileName = f.replace(/Tour\.ts$/, '').replace(/([A-Z])/g, '-$1').toLowerCase();
          return cleanFileName.includes(cleanHandle) || 
                 cleanHandle.includes(cleanFileName.replace(/-/g, '')) ||
                 cleanFileName.includes(cleanTitle.substring(0, 10)) ||
                 cleanTitle.includes(cleanFileName.replace(/-/g, ''));
        });
        
        if (!possibleFile) {
          console.log(`⚠️  Файл не найден для "${tour.handle}", пропускаем...`);
          skipCount++;
          continue;
        }
        
        filePath = path.join(dataPath, possibleFile);
        fileName = possibleFile;
        console.log(`📄 Автоматически найден файл: ${possibleFile}`);
      }
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Файл не найден: ${filePath}`);
        skipCount++;
        continue;
      }
      
      console.log(`📄 Файл: ${fileName}`);
      
      // Парсим данные
      const tourData = parseTourFile(filePath);
      
      if (!tourData || !tourData.title) {
        console.log(`⚠️  Не удалось распарсить данные`);
        skipCount++;
        continue;
      }
      
      console.log(`✅ Данные распарсены:`);
      console.log(`   Title: ${tourData.title}`);
      console.log(`   Duration: ${tourData.duration || 'N/A'}`);
      console.log(`   Highlights: ${tourData.highlights?.length || 0}`);
      console.log(`   Schedule items: ${tourData.schedule?.length || 0}`);
      
      // Генерируем HTML
      const descriptionHtml = generateDescriptionHTML(tourData);
      
      if (APPLY) {
        // Обновляем описание
        console.log(`📝 Обновляем описание в Shopify...`);
        await updateTourDescription(tour.id, descriptionHtml);
        console.log(`✅ Описание успешно обновлено!`);
        successCount++;
      } else {
        console.log(`🧪 DRY-RUN: Описание будет обновлено`);
        console.log(`   Первые 300 символов:\n${descriptionHtml.substring(0, 300)}...`);
      }
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ ОБРАБОТКА ЗАВЕРШЕНА!`);
    console.log(`📊 Успешно обновлено: ${successCount}`);
    console.log(`⚠️  Пропущено: ${skipCount}`);
    console.log(`📊 Всего обработано: ${shopifyTours.length}`);
    
    if (!APPLY) {
      console.log(`\n💡 Для реального обновления добавьте флаг --apply`);
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

