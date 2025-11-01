#!/usr/bin/env node

/**
 * 🎯 МАСТЕР-СКРИПТ: ИДЕАЛЬНЫЙ ШАБЛОН ТУРА
 * 
 * Создает единый шаблон описания для всех туров на основе:
 * - Структуры из репозитория island-travel-echo-clone
 * - Лучших практик из DynamicTourPage
 * - Шаблона Пхи-Пхи как эталона
 * 
 * КОНЦЕПЦИЯ:
 * - Один шаблон → применяется ко всем турам
 * - Каждый тур получает свои уникальные данные из репозитория
 * - Повторяющиеся блоки (что взять, включено) - стандартные
 * - Уникальные блоки (описание, программа, маршрут) - из репозитория
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/MASTER-PERFECT-TOUR-TEMPLATE.cjs --tour=phi-phi-2-days-1-night [--apply]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const REPO_PATH = process.argv.find(a => a.startsWith('--repo-path='))?.split('=')[1]
  || path.join(__dirname, '..', '..', 'island-travel-echo-clone', 'island-travel-echo-clone');
const APPLY = process.argv.includes('--apply');
const TOUR_HANDLE = process.argv.find(a => a.startsWith('--tour='))?.split('=')[1];

console.log('🎯 МАСТЕР-СКРИПТ: ИДЕАЛЬНЫЙ ШАБЛОН ТУРА');
console.log('='.repeat(70));
console.log(`📍 Репозиторий: ${REPO_PATH}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}`);
console.log(`🎯 Тур: ${TOUR_HANDLE || 'ВСЕ ТУРЫ'}\n`);

// ============================================================================
// МАППИНГ HANDLE → ФАЙЛ В РЕПОЗИТОРИИ
// ============================================================================

const TOUR_MAPPING = {
  'phi-phi-2-days-1-night': 'phiPhi2DaysTour.ts',
  '4-pearls-andaman-sea': 'pearlsTour.ts',
  'five-pearls-2-days': 'pearlsTour.ts',
  'james-bond-island-tour': 'jamesBondIslandTour.ts',
  'similan-islands-tour': null,
  'eleven-islands-mega-tour': 'elevenIslandsMegaTour.ts',
  'eleven-islands': 'elevenIslandsMegaTour.ts',
  '11': 'elevenIslandsMegaTour.ts', // Handle после автоматического исправления
  '⭐-11-островов-мега-тур': 'elevenIslandsMegaTour.ts', // Старый handle с эмодзи
  'racha-coral-islands-tour': 'rachaCoralIslandsTour.ts',
  'racha-coral-rawai-tour': 'rachaCoralIslandsTour.ts',
  'racha-coral-sunrise-tour': 'rachaCoralIslandsTour.ts',
  'rafting-elephant-spa-atv': 'raftingSpaAtvTour.ts',
  'rafting-spa-atv-tour': 'raftingSpaAtvTour.ts',
  '🐘-као-лак-safari': 'kaoLakSafariTour.ts',
  'kao-lak-safari-tour': 'kaoLakSafariTour.ts',
  'avatar-plus-hangdong-tour': 'avatarPlusHangdongTour.ts',
  'аватар-плюс': 'avatarPlusHangdongTour.ts',
  'dostoprimechatelnosti-phuketa-tour': 'dostoprimechatelnostiPhuketaTour.ts',
  'phi-phi-sunrise-tour': 'phiPhiTour.ts',
  'eleven-islands-standard-tour': 'elevenIslandsStandardTour.ts',
  'phang-nga-skywalk-tour': 'rassvetnoePrikljuchenieTour.ts',
  'krabi-secrets-tour': null,
  'phang-nga-samet-tour': null,
  'cheo-lan-lake-tour': null,
  'fishing-sunrise-tour': null,
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
// 2. ПАРСИНГ ДАННЫХ ТУРА ИЗ РЕПОЗИТОРИЯ
// ============================================================================

function parseTourFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const tourData = {
      title: null,
      subtitle: null,
      description: null,
      duration: null,
      groupSize: null,
      highlights: [],
      schedule: [],
      itinerary: [],
      included: [],
      excluded: [],
      notIncluded: [],
      requirements: [],
      importantInfo: [],
    };

    // Title
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    if (titleMatch) tourData.title = titleMatch[1];

    // Subtitle
    const subtitleMatch = content.match(/subtitle:\s*["']([^"']+)["']/);
    if (subtitleMatch) tourData.subtitle = subtitleMatch[1];

    // Description (многострочный)
    const descMatch = content.match(/description:\s*`([\s\S]*?)`/);
    if (descMatch) {
      tourData.description = descMatch[1].trim();
    }

    // Duration
    const durationMatch = content.match(/duration:\s*["']([^"']+)["']/);
    if (durationMatch) tourData.duration = durationMatch[1];

    // GroupSize
    const groupSizeMatch = content.match(/groupSize:\s*["']([^"']+)["']/);
    if (groupSizeMatch) tourData.groupSize = groupSizeMatch[1];

    // Highlights
    const highlightsMatch = content.match(/highlights:\s*\[([\s\S]*?)\]/);
    if (highlightsMatch) {
      const highlightsStr = highlightsMatch[1];
      const highlights = highlightsStr.match(/["']([^"']+)["']/g);
      if (highlights) {
        tourData.highlights = highlights.map(h => h.replace(/["']/g, ''));
      }
    }

    // Schedule / Itinerary
    const scheduleMatch = content.match(/(?:schedule|itinerary):\s*\[([\s\S]*?)\]/);
    if (scheduleMatch) {
      const scheduleStr = scheduleMatch[1];
      
      // Регулярка для объектов с day, time, title/activity, description
      const objectRegex = /\{\s*day:\s*["']([^"']+)[""],\s*time:\s*["']([^"']+)[""],\s*(?:title:\s*["']([^"']*)[""]|activity:\s*["']([^"']*)[""]),\s*(?:description:\s*["']([^"']*?)[""])?\s*\}/g;
      let match;
      while ((match = objectRegex.exec(scheduleStr)) !== null) {
        tourData.schedule.push({
          day: match[1],
          time: match[2],
          title: match[3] || match[4] || '',
          description: match[5] || match[3] || match[4] || ''
        });
      }
      
      // Если не нашлось через regex с title/activity, пробуем простой формат
      if (tourData.schedule.length === 0) {
        const simpleRegex = /\{\s*day:\s*["']([^"']+)[""],\s*time:\s*["']([^"']+)[""],\s*activity:\s*["']([^"']+)[""]\s*\}/g;
        while ((match = simpleRegex.exec(scheduleStr)) !== null) {
          tourData.schedule.push({
            day: match[1],
            time: match[2],
            title: match[3],
            description: match[3]
          });
        }
      }
    }

    // Included
    const includedMatch = content.match(/included:\s*\[([\s\S]*?)\]/);
    if (includedMatch) {
      const includedStr = includedMatch[1];
      const items = includedStr.match(/["']([^"']+)["']/g);
      if (items) {
        tourData.included = items.map(i => i.replace(/["']/g, ''));
      }
    }

    // Excluded / NotIncluded
    const excludedMatch = content.match(/(?:excluded|notIncluded):\s*\[([\s\S]*?)\]/);
    if (excludedMatch) {
      const excludedStr = excludedMatch[1];
      const items = excludedStr.match(/["']([^"']+)["']/g);
      if (items) {
        tourData.excluded = items.map(i => i.replace(/["']/g, ''));
      }
    }

    // Requirements
    const requirementsMatch = content.match(/requirements:\s*\[([\s\S]*?)\]/);
    if (requirementsMatch) {
      const requirementsStr = requirementsMatch[1];
      const items = requirementsStr.match(/["']([^"']+)["']/g);
      if (items) {
        tourData.requirements = items.map(i => i.replace(/["']/g, ''));
      }
    }

    // ImportantInfo
    const importantInfoMatch = content.match(/importantInfo:\s*\[([\s\S]*?)\]/);
    if (importantInfoMatch) {
      const importantInfoStr = importantInfoMatch[1];
      const items = importantInfoStr.match(/["']([^"']+)["']/g);
      if (items) {
        tourData.importantInfo = items.map(i => i.replace(/["']/g, ''));
      }
    }

    return tourData;
  } catch (error) {
    console.error(`❌ Ошибка парсинга ${filePath}:`, error.message);
    return null;
  }
}

// ============================================================================
// 3. ГЕНЕРАЦИЯ ИДЕАЛЬНОГО HTML ОПИСАНИЯ (ШАБЛОН)
// ============================================================================

function generatePerfectDescriptionHTML(tourData, tourHandle) {
  const isTwoDays = tourData.duration && (tourData.duration.includes('2') || tourData.duration.includes('ночь'));
  
  // Определяем маршрут для подзаголовка
  let routeSubtitle = 'Весь путь тура';
  if (tourData.title) {
    if (tourData.title.includes('Пхи-Пхи')) {
      routeSubtitle = 'Весь путь от Пхукета до Островов Пхи-Пхи';
    } else if (tourData.title.includes('Краби') || tourData.title.includes('Krabi')) {
      routeSubtitle = 'Весь путь от Пхукета до Краби';
    } else if (tourData.title.includes('Джеймс Бонд') || tourData.title.includes('James Bond')) {
      routeSubtitle = 'Маршрут до острова Джеймса Бонда';
    } else if (tourData.title.includes('Симилан')) {
      routeSubtitle = 'Маршрут до Симиланских островов';
    } else {
      routeSubtitle = 'Маршрут тура';
    }
  }

  // Определяем заголовки дней
  let day1Title = 'День 1';
  let day2Title = 'День 2';
  if (tourData.title) {
    if (tourData.title.includes('Пхи-Пхи')) {
      day1Title = 'День 1: Пхукет → Пхи-Пхи';
      day2Title = 'День 2: Пхи-Пхи → Пхукет';
    } else if (tourData.title.includes('Краби')) {
      day1Title = 'День 1: Пхукет → Краби';
      day2Title = 'День 2: Краби → Пхукет';
    } else if (isTwoDays) {
      day1Title = 'День 1';
      day2Title = 'День 2';
    }
  }

  let html = '';

  // ============================================================================
  // СЕКЦИЯ 0: ЗАГОЛОВОК (Exchange24 Style - МАКСИМАЛЬНО КОМПАКТНЫЙ)
  // ============================================================================
  // Exchange24 Guidelines: text-sm для заголовков (13px), text-xs для всего (12px)
  // Padding УЛЬТРА-КОМПАКТНЫЙ: p-2 (8px) для карточек
  // Spacing МИНИМАЛЬНЫЙ: mb-2 (8px) между секциями
  // НЕТ повторений! Один заголовок, одна длительность
  
  html += `<h1 class="text-sm font-semibold text-gray-900 mb-1.5">${tourData.title || 'Тур'}</h1>\n`;
  // НЕ показываем subtitle если он повторяет title
  if (tourData.subtitle && tourData.subtitle !== tourData.title && !tourData.subtitle.toLowerCase().includes(tourData.title.toLowerCase().split(' ')[0])) {
    html += `<p class="text-xs text-gray-600 mb-1">${tourData.subtitle}</p>\n`;
  }
  // Длительность показываем ОДИН РАЗ в мета-информации, НЕ отдельно!
  html += `\n`;

  // ============================================================================
  // СЕКЦИЯ 1: ОПИСАНИЕ (Exchange24 Style - МАКСИМАЛЬНО КОМПАКТНАЯ)
  // ============================================================================
  
  if (tourData.description) {
    html += `<div class="bg-white rounded-xl p-2 mb-2 border border-gray-200">\n`;
    // Форматируем описание: разбиваем на параграфы
    const paragraphs = tourData.description.split(/\n\s*\n/).filter(p => p.trim());
    paragraphs.forEach((paragraph, index) => {
      // Поддержка markdown-style жирного текста
      paragraph = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Последний параграф БЕЗ отступа снизу
      const marginClass = index === paragraphs.length - 1 ? '' : 'mb-1';
      html += `  <p class="text-xs text-gray-700 leading-snug ${marginClass}">${paragraph.trim()}</p>\n`;
    });
    html += `</div>\n\n`;
  }

  // ============================================================================
  // СЕКЦИЯ 2: ЧТО ВХОДИТ В ТУР (Exchange24 Style - МАКСИМАЛЬНО КОМПАКТНЫЙ)
  // ============================================================================
  
  if (tourData.highlights && tourData.highlights.length > 0) {
    html += `<h2 class="text-xs font-semibold text-gray-900 mb-1">✨ Что входит в тур</h2>\n`;
    html += `<div class="bg-white rounded-xl p-2 mb-2 border border-gray-200">\n`;
    html += `  <div class="space-y-1">\n`;
    tourData.highlights.forEach(highlight => {
      html += `    <div class="flex items-start gap-1.5">\n`;
      html += `      <span class="text-green-500 text-xs flex-shrink-0 mt-0.5">✓</span>\n`;
      html += `      <span class="text-gray-700 text-xs leading-tight">${highlight}</span>\n`;
      html += `    </div>\n`;
    });
    html += `  </div>\n`;
    html += `</div>\n\n`;
  }

  // ============================================================================
  // СЕКЦИЯ 3: ПРОГРАММА ТУРА (как на phukeo.com - чистая структура с премиум дизайном)
  // ============================================================================
  
  if (tourData.schedule && tourData.schedule.length > 0) {
    // ПРОГРАММА ТУРА - ACCORDION (сворачиваемая)
    html += `<div data-accordion-section="schedule">\n`;
    html += `  <h2 class="accordion-trigger cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1">\n`;
    html += `    <span>Программа тура</span>\n`;
    html += `    <span class="accordion-icon text-gray-400 ml-auto">▼</span>\n`;
    html += `  </h2>\n`;
    html += `  <div class="accordion-content hidden">\n`;
    
    if (isTwoDays && tourData.schedule.some(s => s.day.includes('2') || s.day.includes('День 2'))) {
      // День 1
      const day1Items = tourData.schedule.filter(item => 
        item.day.includes('1') || item.day.includes('День 1')
      );
      
      if (day1Items.length > 0) {
        html += `<div class="space-y-2 mb-2">\n`;
        day1Items.forEach(item => {
          const time = item.time || '';
          const day = item.day.includes('1') || item.day.includes('День 1') ? 'День 1' : '';
          const title = item.title || item.description || '';
          const description = item.description && item.description !== item.title ? item.description : '';
          
          html += `  <div class="bg-white rounded-xl p-2 border border-gray-200 mb-1.5">\n`;
          html += `    <div class="flex items-center gap-1.5 mb-1">\n`;
          html += `      <div class="flex-shrink-0 w-10 text-xs font-semibold text-[#007AFF]">${time}</div>\n`;
          html += `      <div class="text-[10px] font-medium text-gray-500 uppercase">${day}</div>\n`;
          html += `    </div>\n`;
          html += `    <h3 class="text-xs font-semibold text-gray-900 mb-0.5">${title}</h3>\n`;
          if (description && description.trim()) {
            html += `    <p class="text-gray-600 text-[11px] leading-tight">${description}</p>\n`;
          }
          html += `  </div>\n`;
        });
        html += `</div>\n\n`;
      }
      
      // День 2
      const day2Items = tourData.schedule.filter(item => 
        item.day.includes('2') || item.day.includes('День 2')
      );
      
      if (day2Items.length > 0) {
        html += `<div class="space-y-2 mb-2">\n`;
        day2Items.forEach(item => {
          const time = item.time || '';
          const day = item.day.includes('2') || item.day.includes('День 2') ? 'День 2' : '';
          const title = item.title || item.description || '';
          const description = item.description && item.description !== item.title ? item.description : '';
          
          html += `  <div class="bg-white rounded-xl p-3 border border-gray-200 mb-2">\n`;
          html += `    <div class="flex items-center gap-2 mb-1.5">\n`;
          html += `      <div class="flex-shrink-0 w-12 text-xs font-semibold text-green-600">${time}</div>\n`;
          html += `      <div class="text-xs font-medium text-gray-500 uppercase">${day}</div>\n`;
          html += `    </div>\n`;
          html += `    <h3 class="text-sm font-semibold text-gray-900 mb-1">${title}</h3>\n`;
          if (description && description.trim()) {
            html += `    <p class="text-gray-600 text-xs leading-relaxed">${description}</p>\n`;
          }
          html += `  </div>\n`;
        });
        html += `</div>\n`;
      }
    } else {
      // Однодневный тур
      html += `<div class="space-y-2 mb-2">\n`;
      tourData.schedule.forEach(item => {
        const time = item.time || '';
        const title = item.title || item.description || '';
        const description = item.description && item.description !== item.title ? item.description : '';
        
        html += `  <div class="bg-white rounded-xl p-2 border border-gray-200 mb-1.5">\n`;
        html += `    <div class="flex items-center gap-1.5 mb-1">\n`;
        html += `      <div class="flex-shrink-0 w-10 text-xs font-semibold text-[#007AFF]">${time}</div>\n`;
        html += `    </div>\n`;
        html += `    <h3 class="text-xs font-semibold text-gray-900 mb-0.5">${title}</h3>\n`;
        if (description && description.trim()) {
          html += `    <p class="text-gray-600 text-[11px] leading-tight">${description}</p>\n`;
        }
        html += `  </div>\n`;
      });
      html += `</div>\n`;
    }
    
    html += `  </div>\n`; // закрываем accordion-content
    html += `</div>\n\n`; // закрываем accordion-section
  }

  // ============================================================================
  // СЕКЦИЯ 4: ВКЛЮЧЕНО В СТОИМОСТЬ (Telegram Wallet Style - компактный список)
  // ============================================================================
  
  if (tourData.included && tourData.included.length > 0) {
    // ВКЛЮЧЕНО В СТОИМОСТЬ - ACCORDION (сворачиваемая)
    html += `<div data-accordion-section="included">\n`;
    html += `  <h2 class="accordion-trigger cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1">\n`;
    html += `    <span>Включено в стоимость</span>\n`;
    html += `    <span class="accordion-icon text-gray-400 ml-auto">▼</span>\n`;
    html += `  </h2>\n`;
    html += `  <div class="accordion-content hidden">\n`;
    html += `    <div class="bg-white rounded-xl p-2 mb-2 border border-gray-200">\n`;
    html += `      <ul class="space-y-0.5">\n`;
    tourData.included.forEach(item => {
      html += `        <li class="flex items-center gap-1">\n`;
      html += `          <span class="text-green-500 text-[10px] flex-shrink-0">✓</span>\n`;
      html += `          <span class="text-gray-700 text-xs leading-tight">${item}</span>\n`;
      html += `        </li>\n`;
    });
    html += `      </ul>\n`;
    html += `    </div>\n`;
    
    // Не включено - тоже в accordion
    if (tourData.excluded && tourData.excluded.length > 0) {
      html += `    <div class="bg-white rounded-xl p-2 mb-2 border border-gray-200">\n`;
      html += `      <h3 class="text-[11px] font-semibold text-gray-800 mb-1">Не включено</h3>\n`;
      html += `      <ul class="space-y-0.5">\n`;
      tourData.excluded.forEach(item => {
        html += `        <li class="flex items-center gap-1">\n`;
        html += `          <span class="text-red-500 text-[10px] flex-shrink-0">✗</span>\n`;
        html += `          <span class="text-gray-700 text-xs leading-tight">${item}</span>\n`;
        html += `        </li>\n`;
      });
      html += `      </ul>\n`;
      html += `    </div>\n`;
    }
    
    html += `  </div>\n`; // закрываем accordion-content
    html += `</div>\n\n`; // закрываем accordion-section
  }

  // ============================================================================
  // СЕКЦИЯ 6: ЧТО ВЗЯТЬ С СОБОЙ (Requirements) - Accordion
  // ============================================================================
  
  if (tourData.requirements && tourData.requirements.length > 0) {
    html += `<div data-accordion-section="requirements">\n`;
    html += `  <h2 class="accordion-trigger cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1">\n`;
    html += `    <span>Что взять с собой</span>\n`;
    html += `    <span class="accordion-icon text-gray-400 ml-auto">▼</span>\n`;
    html += `  </h2>\n`;
    html += `  <div class="accordion-content hidden">\n`;
      html += `    <ul class="space-y-1.5 mb-4">\n`;
      tourData.requirements.forEach(item => {
        html += `      <li class="flex items-center gap-2 text-gray-700 text-sm">\n`;
        html += `        <span class="text-gray-400">•</span>\n`;
        html += `        <span>${item}</span>\n`;
        html += `      </li>\n`;
      });
    html += `    </ul>\n`;
    html += `  </div>\n`;
    html += `</div>\n\n`;
  }

  // ============================================================================
  // СЕКЦИЯ 7: ВАЖНАЯ ИНФОРМАЦИЯ - Accordion
  // ============================================================================
  
  if (tourData.importantInfo && tourData.importantInfo.length > 0) {
    html += `<div data-accordion-section="important-info">\n`;
    html += `  <h2 class="accordion-trigger cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-1">\n`;
    html += `    <span>Важная информация</span>\n`;
    html += `    <span class="accordion-icon text-gray-400 ml-auto">▼</span>\n`;
    html += `  </h2>\n`;
    html += `  <div class="accordion-content hidden">\n`;
      html += `    <ul class="space-y-2 mb-4">\n`;
      tourData.importantInfo.forEach(info => {
        html += `      <li class="flex items-start gap-2 bg-white border border-yellow-200 p-3 rounded-lg">\n`;
        html += `        <span class="text-yellow-600 text-sm flex-shrink-0 mt-0.5">⚠</span>\n`;
        html += `        <span class="text-gray-700 text-sm">${info}</span>\n`;
        html += `      </li>\n`;
      });
    html += `    </ul>\n`;
    html += `  </div>\n`;
    html += `</div>\n\n`;
  }

  // ============================================================================
  // СЕКЦИЯ 8: КОНВЕРСИОННЫЙ БЛОК (Telegram Wallet Style - компактные кнопки)
  // ============================================================================
  
  // КОНВЕРСИОННЫЙ БЛОК - 4 СЕРВИСА: Туры → Авто → Недвижимость → Валюты
  // Порядок: 1. Туры, 2. Авто, 3. Недвижимость, 4. Валюты
  html += `<h2 class="text-xs font-semibold text-gray-900 mb-1">Планируете поездку?</h2>\n`;
  html += `<div class="space-y-1.5 mb-2">\n`;
  
  // 1. Забронировать тур - Calendar icon (главная кнопка) - эмодзи 🏝️
  html += `  <a href="/phuket" class="flex items-center justify-between bg-[#007AFF] text-white rounded-xl px-2 py-2 hover:bg-[#0051D5] active:bg-[#003D99] transition-colors min-h-[44px]">\n`;
  html += `    <div class="flex items-center gap-1.5">\n`;
  html += `      <span class="text-base">🏝️</span>\n`;
  html += `      <span class="font-semibold text-xs">Забронировать тур</span>\n`;
  html += `    </div>\n`;
  html += `    <svg class="w-3 h-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>\n`;
  html += `  </a>\n`;
  
  // 2. Аренда авто - Красивый эмодзи 🚙 (легковая машина)
  html += `  <a href="/services/car-rental" class="flex items-center justify-between bg-white text-gray-900 rounded-xl px-2 py-2 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px]">\n`;
  html += `    <div class="flex items-center gap-1.5">\n`;
  html += `      <span class="text-base">🚙</span>\n`;
  html += `      <span class="font-medium text-xs">Аренда авто</span>\n`;
  html += `    </div>\n`;
  html += `    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>\n`;
  html += `  </a>\n`;
  
  // 3. Недвижимость - Красивый эмодзи 🏠
  html += `  <a href="/services/real-estate" class="flex items-center justify-between bg-white text-gray-900 rounded-xl px-2 py-2 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px]">\n`;
  html += `    <div class="flex items-center gap-1.5">\n`;
  html += `      <span class="text-base">🏠</span>\n`;
  html += `      <span class="font-medium text-xs">Недвижимость</span>\n`;
  html += `    </div>\n`;
  html += `    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>\n`;
  html += `  </a>\n`;
  
  // 4. Обмен валюты - Красивый эмодзи 💵
  html += `  <a href="/services/currency-exchange" class="flex items-center justify-between bg-white text-gray-900 rounded-xl px-2 py-2 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px]">\n`;
  html += `    <div class="flex items-center gap-1.5">\n`;
  html += `      <span class="text-base">💵</span>\n`;
  html += `      <span class="font-medium text-xs">Обмен валюты</span>\n`;
  html += `    </div>\n`;
  html += `    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>\n`;
  html += `  </a>\n`;
  html += `</div>\n\n`;

  // ============================================================================
  // СЕКЦИЯ 9: ЭМОЦИОНАЛЬНОЕ ЗАКЛЮЧЕНИЕ
  // ============================================================================
  
  html += `<p><em>${tourData.title || 'Этот тур'} — это не просто экскурсия, это незабываемое путешествие в райский уголок Андаманского моря. Идеальное сочетание приключений, отдыха и природной красоты для создания воспоминаний на всю жизнь.</em></p>`;

  return html;
}

// ============================================================================
// 4. ПОЛУЧЕНИЕ ВСЕХ ТУРОВ ИЗ SHOPIFY
// ============================================================================

async function getAllToursFromShopify() {
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions") {
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

  return allTours;
}

// ============================================================================
// 5. ОБНОВЛЕНИЕ ОПИСАНИЯ ТУРА В SHOPIFY
// ============================================================================

async function updateTourDescription(productId, descriptionHtml) {
  // Используем переменные GraphQL для правильной передачи HTML
  const mutation = `
    mutation UpdateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: $descriptionHtml
      }) {
        product { 
          id 
          title 
          descriptionHtml
        }
        userErrors { 
          field 
          message 
        }
      }
    }
  `;

  if (!APPLY) {
    console.log(`🧪 DRY-RUN: Обновление описания для ${productId}`);
    console.log(`   Длина HTML: ${descriptionHtml.length} символов`);
    console.log(`   Есть grid: ${descriptionHtml.includes('grid grid-cols')}`);
    console.log(`   Есть accordion: ${descriptionHtml.includes('accordion')}`);
    return true;
  }

  const data = await makeGraphQLRequest(mutation, { 
    id: productId,
    descriptionHtml: descriptionHtml
  });

  if (data.productUpdate.userErrors?.length > 0) {
    throw new Error(JSON.stringify(data.productUpdate.userErrors));
  }

  // Проверяем что обновилось
  if (data.productUpdate.product) {
    const updatedHtml = data.productUpdate.product.descriptionHtml || '';
    console.log(`   ✅ Проверка: длина описания ${updatedHtml.length}, есть grid: ${updatedHtml.includes('grid')}`);
  }

  return true;
}

// ============================================================================
// 6. НАХОЖДЕНИЕ ФАЙЛА ТУРА В РЕПОЗИТОРИИ
// ============================================================================

function findTourDataFile(repoPath, handle) {
  const dataPath = path.join(repoPath, 'src', 'data');
  
  if (!fs.existsSync(dataPath)) {
    return null;
  }

  const files = fs.readdirSync(dataPath);
  
  // Пробуем найти по маппингу
  let fileName = TOUR_MAPPING[handle];
  if (fileName) {
    const filePath = path.join(dataPath, fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // Автоматический поиск
  const cleanHandle = handle.replace(/[🎯🏝️⭐🐘🦅🚣]/g, '').replace(/-/g, '').toLowerCase();
  
  const possibleFile = files.find(f => {
    if (!f.endsWith('.ts') || f === 'toursRegistry.ts') return false;
    const cleanFile = f.replace(/Tour\.ts$/, '').replace(/tour\.ts$/, '').toLowerCase();
    return cleanFile.includes(cleanHandle) || cleanHandle.includes(cleanFile);
  });

  if (possibleFile) {
    return path.join(dataPath, possibleFile);
  }

  return null;
}

// ============================================================================
// 7. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    const dataPath = path.join(REPO_PATH, 'src', 'data');

    if (!fs.existsSync(dataPath)) {
      throw new Error(`Репозиторий не найден: ${dataPath}`);
    }

    // Получаем туры из Shopify
    let shopifyTours;
    if (TOUR_HANDLE) {
      const query = `
        query GetProduct($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
            handle
          }
        }
      `;
      const data = await makeGraphQLRequest(query, { handle: TOUR_HANDLE });
      if (!data.productByHandle) {
        throw new Error(`Тур не найден: ${TOUR_HANDLE}`);
      }
      shopifyTours = [{ node: data.productByHandle }].map(e => e.node);
    } else {
      shopifyTours = await getAllToursFromShopify();
    }

    console.log(`✅ Найдено туров: ${shopifyTours.length}\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const tour of shopifyTours) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📦 Обработка: ${tour.title}`);
      console.log(`🆔 Handle: ${tour.handle}`);

      // Ищем файл в репозитории
      const tourDataFilePath = findTourDataFile(REPO_PATH, tour.handle);

      if (!tourDataFilePath || !fs.existsSync(tourDataFilePath)) {
        console.log(`⚠️  Файл данных тура не найден, пропускаем...`);
        skipCount++;
        continue;
      }

      console.log(`📄 Файл: ${path.basename(tourDataFilePath)}`);

      // Парсим данные тура
      const repoData = parseTourFile(tourDataFilePath);

      if (!repoData || !repoData.title) {
        console.log(`⚠️  Не удалось распарсить данные, пропускаем...`);
        skipCount++;
        continue;
      }

      console.log(`✅ Данные распарсены:`);
      console.log(`   Title: ${repoData.title}`);
      console.log(`   Duration: ${repoData.duration}`);
      console.log(`   Highlights: ${repoData.highlights.length}`);
      console.log(`   Schedule items: ${repoData.schedule.length}`);
      console.log(`   Included: ${repoData.included.length}`);
      console.log(`   Excluded: ${repoData.excluded.length}`);

      // Генерируем идеальное описание
      const descriptionHtml = generatePerfectDescriptionHTML(repoData, tour.handle);

      if (APPLY) {
        console.log(`📝 Обновляем описание в Shopify...`);
        await updateTourDescription(tour.id, descriptionHtml);
        console.log(`✅ Описание успешно обновлено!`);
        successCount++;
      } else {
        console.log(`🧪 DRY-RUN: Описание будет обновлено`);
        console.log(`   Первые 500 символов:\n${descriptionHtml.substring(0, 500)}...`);
        console.log(`\n   📄 Полное описание будет сохранено в: scripts/output/${tour.handle}-description.html`);
        
        // Сохраняем в файл для просмотра
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(outputDir, `${tour.handle}-description.html`),
          descriptionHtml
        );
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ ОБРАБОТКА ЗАВЕРШЕНА!`);
    console.log(`📊 Успешно обновлено: ${successCount}`);
    console.log(`⚠️  Пропущено: ${skipCount}`);
    console.log(`📊 Всего обработано: ${shopifyTours.length}`);

    if (!APPLY) {
      console.log(`\n💡 Для реального обновления добавьте флаг --apply`);
      console.log(`📄 Просмотрите сгенерированные описания в: scripts/output/`);
    } else {
      console.log(`\n🎉 ВСЕ ОПИСАНИЯ ОБНОВЛЕНЫ ПО ИДЕАЛЬНОМУ ШАБЛОНУ!`);
      console.log(`🌐 Проверьте результаты: http://localhost:8080/tours`);
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

