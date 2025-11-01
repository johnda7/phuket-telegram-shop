#!/usr/bin/env node

/**
 * 📦 ПАРСИНГ ТУРОВ ИЗ РЕПОЗИТОРИЯ island-travel-echo-clone
 * 
 * Этот скрипт:
 * 1. Проверяет какие туры уже есть в Shopify
 * 2. Получает список туров из репозитория (локальный клон)
 * 3. Находит недостающие туры
 * 4. Парсит данные из репозитория
 * 5. Загружает в Shopify по нашему шаблону
 * 
 * ТРЕБОВАНИЯ:
 * - Репозиторий должен быть склонирован в ../island-travel-echo-clone
 * - Или укажите путь через --repo-path=/path/to/repo
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const ADMIN_URL = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`;

// Парсинг аргументов
const args = process.argv.slice(2);
const repoPath = args.find(a => a.startsWith('--repo-path='))?.split('=')[1] 
  || path.join(__dirname, '..', '..', 'island-travel-echo-clone');
const APPLY = args.includes('--apply');

console.log('📦 ПАРСИНГ ТУРОВ ИЗ РЕПОЗИТОРИЯ');
console.log(`📍 Путь к репозиторию: ${repoPath}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);

// ============================================================================
// 1. ПОЛУЧЕНИЕ СУЩЕСТВУЮЩИХ ТУРОВ ИЗ SHOPIFY
// ============================================================================

async function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.errors) {
            reject(new Error(JSON.stringify(data.errors)));
          } else {
            resolve(data.data);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ query, variables }));
    req.end();
  });
}

async function getExistingTours() {
  console.log('🔍 Получаем существующие туры из Shopify...');
  
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions") {
        edges {
          node {
            id
            title
            handle
            tags
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
    console.log(`   Загружено: ${allTours.length}`);
  } while (after);
  
  console.log(`✅ Найдено туров в Shopify: ${allTours.length}\n`);
  return allTours.map(t => t.handle.toLowerCase());
}

// ============================================================================
// 2. ПАРСИНГ ТУРОВ ИЗ РЕПОЗИТОРИЯ
// ============================================================================

function parseTourFromRepo(repoPath, tourId) {
  try {
    // Пытаемся найти тур в разных местах
    const possiblePaths = [
      path.join(repoPath, 'src', 'data', 'tours.ts'),
      path.join(repoPath, 'src', 'data', 'tours', `${tourId}`, 'data.ts'),
      path.join(repoPath, 'src', 'pages', `${tourId}.tsx`),
    ];
    
    // Также пытаемся найти через структуру страниц
    const pagesPath = path.join(repoPath, 'src', 'pages');
    if (fs.existsSync(pagesPath)) {
      const files = fs.readdirSync(pagesPath);
      const matchingFile = files.find(f => 
        f.toLowerCase().includes(tourId.toLowerCase()) || 
        f.toLowerCase().includes(tourId.replace(/-/g, '').toLowerCase())
      );
      if (matchingFile) {
        possiblePaths.push(path.join(pagesPath, matchingFile));
      }
    }
    
    // Читаем первый найденный файл
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return parseTourContent(content, tourId, filePath);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`   ❌ Ошибка парсинга ${tourId}:`, error.message);
    return null;
  }
}

function parseTourContent(content, tourId, filePath) {
  // Базовая структура тура
  const tour = {
    id: tourId,
    title: '',
    description: '',
    priceAdult: 0,
    priceChild: 0,
    duration: '',
    images: [],
    schedule: [],
    included: [],
    notIncluded: [],
    tags: ['tour'],
  };
  
  // Улучшенные паттерны для title
  const titlePatterns = [
    // Из константы: const tourData = { title: "..." }
    /(?:const|export\s+const)\s+\w+TourData?\s*[=:]\s*\{[^}]*title:\s*['"]([^'"]+)['"]/i,
    // Из JSX: <h1>...</h1>
    /<h1[^>]*>([^<]+)<\/h1>/i,
    // Простой title: title: "..."
    /title:\s*['"]([^'"]+)['"]/i,
    // Из useMetaTags
    /useMetaTags\([^)]*title:\s*['"]([^'"]+)['"]/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[1].length > 3 && !match[1].includes('{')) {
      tour.title = match[1].trim();
      break;
    }
  }
  
  // Если не нашли title, создаем из имени файла
  if (!tour.title || tour.title.length < 3) {
    const fileNameBase = path.basename(filePath, path.extname(filePath))
      .replace(/New$/, '')
      .replace(/Tour$/, '');
    
    // Конвертируем CamelCase в читаемый текст
    tour.title = fileNameBase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
  
  // Парсим цены - улучшенные паттерны
  const pricePatterns = [
    /priceAdult:\s*(\d+)/i,
    /adultPrice:\s*(\d+)/i,
    /price_adult:\s*(\d+)/i,
    /взрослый[:\s]+(\d+)/i,
    /взрослый[^<]*<[^>]*>(\d+)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern);
    if (match && parseInt(match[1]) > 500) {
      tour.priceAdult = parseInt(match[1]);
      break;
    }
  }
  
  const childPricePatterns = [
    /priceChild:\s*(\d+)/i,
    /childPrice:\s*(\d+)/i,
    /price_child:\s*(\d+)/i,
    /детский[:\s]+(\d+)/i,
    /ребёнок[:\s]+(\d+)/i,
  ];
  
  for (const pattern of childPricePatterns) {
    const match = content.match(pattern);
    if (match && parseInt(match[1]) > 300) {
      tour.priceChild = parseInt(match[1]);
      break;
    }
  }
  
  // Парсим длительность
  const durationMatch = content.match(/(?:duration|length):\s*['"]([^'"]+)['"]/i);
  if (durationMatch) {
    tour.duration = durationMatch[1];
  }
  
  // Парсим описание
  const descPatterns = [
    /description:\s*['"`]([^'"`]+)['"`]/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/i,
  ];
  
  for (const pattern of descPatterns) {
    const match = content.match(pattern);
    if (match && match[1].length > 20) {
      tour.description = match[1].trim();
      break;
    }
  }
  
  // Определяем теги по tourId - расширенный список
  const tourIdLower = tourId.toLowerCase();
  
  if (tourIdLower.includes('phiphi') || tourIdLower.includes('phi-phi')) {
    if (tourIdLower.includes('2') || tourIdLower.includes('night')) {
      tour.tags.push('islands', 'phi-phi', '2-days', 'popular');
      if (!tour.duration) tour.duration = '2 дня / 1 ночь';
      if (!tour.priceAdult) tour.priceAdult = 4500;
    } else {
      tour.tags.push('islands', 'phi-phi', '1-day');
      if (!tour.duration) tour.duration = '1 день';
      if (!tour.priceAdult) tour.priceAdult = 1800;
    }
  } else if (tourIdLower.includes('james') && tourIdLower.includes('bond')) {
    tour.tags.push('islands', 'james-bond', 'phang-nga', '1-day', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1400;
  } else if (tourIdLower.includes('similan')) {
    tour.tags.push('islands', 'similan', '1-day', 'snorkeling', 'diving', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2500;
  } else if (tourIdLower.includes('racha') && tourIdLower.includes('coral')) {
    tour.tags.push('islands', 'racha', 'coral', '1-day', 'snorkeling');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1800;
  } else if (tourIdLower.includes('pearl') && tourIdLower.includes('andaman')) {
    tour.tags.push('islands', '4-pearls', 'andaman', '1-day', 'snorkeling', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
  } else if (tourIdLower.includes('eleven') || tourIdLower.includes('11')) {
    tour.tags.push('islands', '11-islands', 'phang-nga', '1-day', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 4200;
  } else if (tourIdLower.includes('rafting') && (tourIdLower.includes('atv') || tourIdLower.includes('spa'))) {
    tour.tags.push('adventures', 'rafting', 'atv', 'spa', 'elephants', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1700;
  } else if (tourIdLower.includes('kaolak') || tourIdLower.includes('kao-lak')) {
    tour.tags.push('elephants', 'safari', 'jungle', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1300;
  } else if (tourIdLower.includes('avatar')) {
    tour.tags.push('adventure', 'zipline', 'elephants', 'jungle', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1800;
  } else if (tourIdLower.includes('cheolan') || tourIdLower.includes('cheo-lan')) {
    tour.tags.push('lake', 'nature', 'khao-sok', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2200;
  } else if (tourIdLower.includes('phangnga') || tourIdLower.includes('phang-nga')) {
    if (tourIdLower.includes('skywalk')) {
      tour.tags.push('phang-nga', 'skywalk', 'viewpoint', '1-day');
      if (!tour.priceAdult) tour.priceAdult = 1500;
    } else {
      tour.tags.push('islands', 'phang-nga', '1-day');
      if (!tour.priceAdult) tour.priceAdult = 1800;
    }
    if (!tour.duration) tour.duration = '1 день';
  } else if (tourIdLower.includes('krabi')) {
    tour.tags.push('islands', 'krabi', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
  } else if (tourIdLower.includes('fishing')) {
    tour.tags.push('fishing', 'sunrise', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2500;
  } else if (tourIdLower.includes('dostoprimechatelnosti')) {
    tour.tags.push('attractions', 'culture', 'temples', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1500;
  } else {
    // Дефолтные значения
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
    if (tour.duration.includes('1') && !tour.duration.includes('2')) {
      tour.tags.push('1-day');
    } else if (tour.duration.includes('2')) {
      tour.tags.push('2-days');
    }
  }
  
  return tour;
}

// ============================================================================
// 3. ПОИСК ТУРОВ В РЕПОЗИТОРИИ
// ============================================================================

function findToursInRepo(repoPath) {
  console.log('🔍 Ищем туры в репозитории...');
  
  const tours = [];
  
  // Проверяем структуру репозитория
  const dataPath = path.join(repoPath, 'src', 'data');
  const pagesPath = path.join(repoPath, 'src', 'pages');
  
  // Ищем в src/data/tours.ts или src/data/tours/
  if (fs.existsSync(dataPath)) {
    const toursFile = path.join(dataPath, 'tours.ts');
    if (fs.existsSync(toursFile)) {
      const content = fs.readFileSync(toursFile, 'utf8');
      // Парсим экспорты туров
      const tourExports = content.match(/export\s+(?:const|interface|type)\s+(\w+Tour\w*)/gi) || [];
      console.log(`   Найдено экспортов туров: ${tourExports.length}`);
    }
    
    // Ищем папки с турами
    const toursDir = path.join(dataPath, 'tours');
    if (fs.existsSync(toursDir) && fs.statSync(toursDir).isDirectory()) {
      const tourDirs = fs.readdirSync(toursDir);
      tourDirs.forEach(dir => {
        const tourPath = path.join(toursDir, dir);
        if (fs.statSync(tourPath).isDirectory()) {
          tours.push({
            id: dir,
            path: tourPath,
          });
        }
      });
    }
  }
  
  // Ищем в src/pages/ (TSX компоненты туров)
  if (fs.existsSync(pagesPath)) {
    const pageFiles = fs.readdirSync(pagesPath).filter(f => 
      f.endsWith('.tsx') && 
      !f.includes('Index') && 
      !f.includes('NotFound') &&
      !f.includes('Cart')
    );
    
    pageFiles.forEach(file => {
      const tourId = file.replace('.tsx', '').toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
      tours.push({
        id: tourId,
        path: path.join(pagesPath, file),
        isPage: true,
      });
    });
  }
  
  console.log(`✅ Найдено туров в репозитории: ${tours.length}\n`);
  return tours;
}

// ============================================================================
// 4. СОЗДАНИЕ ТОВАРА В SHOPIFY
// ============================================================================

function generateHandle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Убираем спецсимволы и эмодзи
    .replace(/\s+/g, '-')      // Пробелы в дефисы
    .replace(/-+/g, '-')       // Множественные дефисы в один
    .trim();
}

function generatePremiumDescription(tour) {
  // Используем наш шаблон премиум описания
  return `
<h1>${tour.title}</h1>

<p><strong>🎯 Краткое описание:</strong><br>
${tour.description || 'Незабываемое путешествие по лучшим местам Пхукета!'}</p>

${tour.duration ? `<p><strong>⏱️ Длительность:</strong> ${tour.duration}</p>` : ''}

<h2>✨ Что входит в тур</h2>
<ul>
${tour.included.map(item => `<li>✓ ${item}</li>`).join('\n') || '<li>✓ Полный список включенных услуг</li>'}
</ul>

${tour.notIncluded.length > 0 ? `
<h2>⚠️ Не включено</h2>
<ul>
${tour.notIncluded.map(item => `<li>✗ ${item}</li>`).join('\n')}
</ul>
` : ''}

${tour.schedule.length > 0 ? `
<h2>📅 Программа тура</h2>
${tour.schedule.map((day, idx) => `
<h3>День ${idx + 1}</h3>
<ul>
${day.activities ? day.activities.map(a => `<li>${a}</li>`).join('\n') : ''}
</ul>
`).join('\n')}
` : ''}

<h2>🎯 Забронировать тур</h2>
<p>Напишите нам в <a href="https://t.me/PHUKETDABOT">Telegram</a> для бронирования!</p>
  `.trim();
}

async function createTourInShopify(tour) {
  const handle = generateHandle(tour.title || tour.id);
  
  const mutation = `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const descriptionHtml = generatePremiumDescription(tour);
  
  const input = {
    title: tour.title || tour.id,
    handle: handle,
    productType: 'Excursions',
    tags: tour.tags,
    descriptionHtml: descriptionHtml.replace(/"/g, '\\"'),
    variants: [
      {
        title: 'Взрослый',
        price: String(tour.priceAdult || 1500),
      },
      ...(tour.priceChild > 0 ? [{
        title: 'Детский (4-11 лет)',
        price: String(tour.priceChild),
      }] : []),
    ],
  };
  
  if (!APPLY) {
    console.log(`🧪 DRY-RUN создание тура:`, JSON.stringify(input, null, 2));
    return null;
  }
  
  const data = await makeGraphQLRequest(mutation, { input });
  
  if (data.productCreate.userErrors?.length > 0) {
    console.error(`   ❌ Ошибки создания:`, data.productCreate.userErrors);
    return null;
  }
  
  const product = data.productCreate.product;
  console.log(`   ✅ Создан: ${product.title} (${product.handle})`);
  
  // Публикуем продукт
  await publishProduct(product.id);
  
  return product;
}

async function publishProduct(productId) {
  const mutation = `
    mutation PublishProduct($id: ID!) {
      publishablePublish(id: $id, input: { publicationId: "gid://shopify/Publication/online-store" }) {
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  if (!APPLY) {
    return;
  }
  
  await makeGraphQLRequest(mutation, { id: productId });
  console.log(`   🚀 Опубликован`);
}

// ============================================================================
// 5. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  // Проверяем существование репозитория
  if (!fs.existsSync(repoPath)) {
    console.error(`❌ Репозиторий не найден: ${repoPath}`);
    console.error(`\n💡 Решение:`);
    console.error(`   1. Клонируйте репозиторий: git clone https://github.com/johnda7/island-travel-echo-clone.git`);
    console.error(`   2. Запустите: node scripts/parse-tours-from-island-repo.cjs --repo-path=/path/to/clone`);
    process.exit(1);
  }
  
  // 1. Получаем существующие туры из Shopify
  const existingHandles = await getExistingTours();
  
  // 2. Ищем туры в репозитории
  const repoTours = findToursInRepo(repoPath);
  
  // 3. Фильтруем - оставляем только те, которых нет в Shopify
  const missingTours = [];
  
  for (const repoTour of repoTours) {
    const parsedTour = parseTourFromRepo(repoPath, repoTour.id);
    if (!parsedTour) continue;
    
    const handle = generateHandle(parsedTour.title || repoTour.id);
    if (!existingHandles.includes(handle.toLowerCase())) {
      missingTours.push(parsedTour);
      console.log(`📝 Найден недостающий тур: ${parsedTour.title || repoTour.id}`);
      console.log(`   Handle: ${handle}`);
      console.log(`   Цена взрослый: ${parsedTour.priceAdult || 'не указана'}`);
      console.log(`   Теги: ${parsedTour.tags.join(', ')}\n`);
    }
  }
  
  if (missingTours.length === 0) {
    console.log('✅ Все туры из репозитория уже есть в Shopify!');
    return;
  }
  
  console.log(`\n🎯 Найдено недостающих туров: ${missingTours.length}\n`);
  
  // 4. Загружаем недостающие туры
  for (let i = 0; i < missingTours.length; i++) {
    const tour = missingTours[i];
    console.log(`\n📦 [${i + 1}/${missingTours.length}] Загружаем: ${tour.title || tour.id}`);
    
    try {
      await createTourInShopify(tour);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Пауза между запросами
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
    }
  }
  
  console.log('\n✅ Готово!');
  console.log(`🌐 Проверьте туры: http://localhost:8080/phuket`);
}

main().catch(console.error);

