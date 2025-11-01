#!/usr/bin/env node

/**
 * 🌐 ПОЛУЧЕНИЕ ТУРОВ ИЗ GITHUB РЕПОЗИТОРИЯ ЧЕРЕЗ API
 * 
 * Этот скрипт получает данные туров напрямую из GitHub репозитория
 * без необходимости клонировать его локально
 */

const https = require('https');

const GITHUB_REPO = 'johnda7/island-travel-echo-clone';
const GITHUB_API_BASE = 'api.github.com';

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

console.log('🌐 ПОЛУЧЕНИЕ ТУРОВ ИЗ GITHUB');
console.log(`📦 Репозиторий: ${GITHUB_REPO}`);
console.log(`⚙️  Режим: ${APPLY ? 'APPLY' : 'DRY-RUN'}\n`);

// ============================================================================
// GITHUB API HELPERS
// ============================================================================

function githubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GITHUB_API_BASE,
      path: `/repos/${GITHUB_REPO}${path}`,
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
      },
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        }
      });
    }).on('error', reject);
  });
}

async function getFileContent(path) {
  try {
    const data = await githubRequest(`/contents/${path}`);
    // Если это файл, декодируем base64
    if (data.type === 'file' && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return null;
  } catch (error) {
    console.error(`   ❌ Ошибка получения файла ${path}:`, error.message);
    return null;
  }
}

async function listDirectory(path) {
  try {
    const data = await githubRequest(`/contents/${path}`);
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    return [];
  }
}

// ============================================================================
// ПАРСИНГ ТУРОВ
// ============================================================================

function extractTourFromFile(content, fileName) {
  const tour = {
    title: '',
    description: '',
    priceAdult: 0,
    priceChild: 0,
    duration: '',
    tags: ['tour'],
    images: [],
  };
  
  // Определяем ID тура из имени файла
  const tourId = fileName.replace(/\.(tsx?|jsx?)$/, '').toLowerCase();
  
  // Парсим title из разных форматов - улучшенные паттерны
  const titlePatterns = [
    // Из константы: const tourData = { title: "..." }
    /(?:const|export\s+const)\s+\w+TourData?\s*[=:]\s*\{[^}]*title:\s*['"]([^'"]+)['"]/i,
    // Из JSX: <h1>...</h1>
    /<h1[^>]*>([^<]+)<\/h1>/i,
    // Из title в объекте
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
  
  // Если не нашли, пробуем из имени файла (конвертируем CamelCase в нормальный текст)
  if (!tour.title || tour.title.length < 3) {
    const fileNameClean = fileName
      .replace(/\.tsx?$/, '')
      .replace(/New$/, '')
      .replace(/Tour$/, '');
    
    // Конвертируем CamelCase в читаемый текст
    const readable = fileNameClean
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    if (readable.length > 5) {
      tour.title = readable;
    }
  }
  
  // Парсим цены - улучшенные паттерны
  const pricePatterns = [
    // Из объекта: priceAdult: 4800
    /priceAdult:\s*(\d+)/i,
    // Из объекта: adultPrice: 4800
    /adultPrice:\s*(\d+)/i,
    // Из объекта: price_adult: 4800
    /price_adult:\s*(\d+)/i,
    // Из строки: "Взрослый: 4800"
    /взрослый[:\s]+(\d+)/i,
    // Из JSX: <span>4800</span> рядом с "взрослый"
    /взрослый[^<]*<[^>]*>(\d+)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern);
    if (match && parseInt(match[1]) > 500) { // Минимум 500 бат
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
    /<p[^>]*>([^<]+)<\/p>/i,
  ];
  
  for (const pattern of descPatterns) {
    const match = content.match(pattern);
    if (match && match[1].length > 20) {
      tour.description = match[1].trim();
      break;
    }
  }
  
  // Определяем теги по имени файла и содержимому - расширенный список
  if (tourId.includes('phiphi') || tourId.includes('phi-phi')) {
    if (tourId.includes('2') || tourId.includes('night')) {
      tour.tags.push('islands', 'phi-phi', '2-days', 'popular');
      if (!tour.duration) tour.duration = '2 дня / 1 ночь';
      if (!tour.priceAdult) tour.priceAdult = 4500;
    } else {
      tour.tags.push('islands', 'phi-phi', '1-day');
      if (!tour.duration) tour.duration = '1 день';
      if (!tour.priceAdult) tour.priceAdult = 1800;
    }
  } else if (tourId.includes('james') && tourId.includes('bond')) {
    tour.tags.push('islands', 'james-bond', 'phang-nga', '1-day', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1400;
  } else if (tourId.includes('similan')) {
    tour.tags.push('islands', 'similan', '1-day', 'snorkeling', 'diving', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2500;
  } else if (tourId.includes('racha') && tourId.includes('coral')) {
    tour.tags.push('islands', 'racha', 'coral', '1-day', 'snorkeling');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1800;
  } else if (tourId.includes('pearl') && tourId.includes('andaman')) {
    tour.tags.push('islands', '4-pearls', 'andaman', '1-day', 'snorkeling', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
  } else if (tourId.includes('eleven') || tourId.includes('11')) {
    tour.tags.push('islands', '11-islands', 'phang-nga', '1-day', 'popular');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 4200;
  } else if (tourId.includes('rafting') && tourId.includes('atv')) {
    tour.tags.push('adventures', 'rafting', 'atv', 'spa', 'elephants', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1700;
  } else if (tourId.includes('kaolak') || tourId.includes('kao-lak')) {
    tour.tags.push('elephants', 'safari', 'jungle', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1300;
  } else if (tourId.includes('avatar')) {
    tour.tags.push('adventure', 'zipline', 'elephants', 'jungle', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1800;
  } else if (tourId.includes('cheolan') || tourId.includes('cheo-lan')) {
    tour.tags.push('lake', 'nature', 'khao-sok', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2200;
  } else if (tourId.includes('phangnga') || tourId.includes('phang-nga')) {
    if (tourId.includes('skywalk')) {
      tour.tags.push('phang-nga', 'skywalk', 'viewpoint', '1-day');
      if (!tour.priceAdult) tour.priceAdult = 1500;
    } else {
      tour.tags.push('islands', 'phang-nga', '1-day');
      if (!tour.priceAdult) tour.priceAdult = 1800;
    }
    if (!tour.duration) tour.duration = '1 день';
  } else if (tourId.includes('krabi')) {
    tour.tags.push('islands', 'krabi', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
  } else if (tourId.includes('fishing')) {
    tour.tags.push('fishing', 'sunrise', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2500;
  } else if (tourId.includes('dostoprimechatelnosti')) {
    tour.tags.push('attractions', 'culture', 'temples', '1-day');
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 1500;
  } else {
    // Дефолтные значения для неизвестных туров
    if (!tour.duration) tour.duration = '1 день';
    if (!tour.priceAdult) tour.priceAdult = 2000;
  }
  
  // Определяем длительность по тегам
  if (!tour.duration) {
    if (tour.tags.includes('2-days')) {
      tour.duration = '2 дня / 1 ночь';
    } else {
      tour.duration = '1 день';
    }
  }
  
  // Если не нашли title, используем имя файла
  if (!tour.title) {
    tour.title = tourId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Если не нашли цену, ставим дефолтную
  if (!tour.priceAdult) {
    tour.priceAdult = 2000; // Дефолтная цена
  }
  
  return tour;
}

// ============================================================================
// ПОЛУЧЕНИЕ ТУРОВ ИЗ SHOPIFY
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
  console.log('🔍 Получаем туры из Shopify...');
  
  const query = `
    query GetTours($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "product_type:Excursions") {
        edges {
          node {
            handle
            title
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
  
  console.log(`✅ Найдено туров в Shopify: ${allTours.length}`);
  return new Set(allTours.map(t => t.handle.toLowerCase()));
}

// ============================================================================
// СОЗДАНИЕ ТУРА В SHOPIFY
// ============================================================================

function generateHandle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generatePremiumDescription(tour) {
  return `
<h1>${tour.title}</h1>

<p><strong>🎯 О туре:</strong><br>
${tour.description || 'Незабываемое путешествие по лучшим местам Пхукета!'}</p>

${tour.duration ? `<p><strong>⏱️ Длительность:</strong> ${tour.duration}</p>` : ''}

<h2>✨ Что входит</h2>
<ul>
<li>✓ Профессиональный русскоязычный гид</li>
<li>✓ Трансфер из отеля и обратно</li>
<li>✓ Все необходимое оборудование</li>
<li>✓ Страховка</li>
</ul>

<h2>🎯 Забронировать тур</h2>
<p>Напишите нам в <a href="https://t.me/PHUKETDABOT">Telegram</a> для бронирования!</p>
  `.trim();
}

async function createTourInShopify(tour) {
  const handle = generateHandle(tour.title);
  
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
    title: tour.title,
    handle: handle,
    productType: 'Excursions',
    tags: tour.tags,
    descriptionHtml: descriptionHtml.replace(/"/g, '\\"').replace(/\n/g, ' '),
    variants: [
      {
        title: 'Взрослый',
        price: String(tour.priceAdult),
      },
      ...(tour.priceChild > 0 ? [{
        title: 'Детский (4-11 лет)',
        price: String(tour.priceChild),
      }] : []),
    ],
  };
  
  if (!APPLY) {
    console.log(`🧪 DRY-RUN: ${tour.title}`);
    console.log(`   Handle: ${handle}`);
    console.log(`   Цена: ${tour.priceAdult} ฿`);
    console.log(`   Теги: ${tour.tags.join(', ')}\n`);
    return null;
  }
  
  try {
    const data = await makeGraphQLRequest(mutation, { input });
    
    if (data.productCreate.userErrors?.length > 0) {
      console.error(`   ❌ Ошибки:`, data.productCreate.userErrors);
      return null;
    }
    
    const product = data.productCreate.product;
    console.log(`   ✅ Создан: ${product.title}`);
    
    // Публикуем
    await publishProduct(product.id);
    
    return product;
  } catch (error) {
    console.error(`   ❌ Ошибка создания:`, error.message);
    return null;
  }
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
  
  await makeGraphQLRequest(mutation, { id: productId });
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    // 1. Получаем существующие туры из Shopify
    const existingHandles = await getExistingTours();
    console.log('');
    
    // 2. Получаем список файлов из репозитория
    console.log('📂 Ищем туры в репозитории...');
    
    // Проверяем src/data/tours.ts
    let toursDataContent = await getFileContent('src/data/tours.ts');
    if (toursDataContent) {
      console.log('   ✅ Найден файл src/data/tours.ts');
    }
    
    // Проверяем src/pages/ для TSX компонентов
    const pagesFiles = await listDirectory('src/pages');
    
    // Фильтруем только реальные туры (исключаем служебные страницы)
    const excludedPages = [
      'Index', 'NotFound', 'Cart', 'Admin', 'Booking', 'Contact', 
      'FAQ', 'Info', 'Payment', 'Reviews', 'Template', 'Tours'
    ];
    
    const tourPages = pagesFiles.filter(f => 
      f.type === 'file' && 
      f.name.endsWith('.tsx') && 
      !excludedPages.some(ex => f.name.includes(ex)) &&
      (f.name.includes('Tour') || f.name.includes('Island') || 
       f.name.includes('Phi') || f.name.includes('Similan') || 
       f.name.includes('Racha') || f.name.includes('Pearl') ||
       f.name.includes('Eleven') || f.name.includes('James') ||
       f.name.includes('Rafting') || f.name.includes('KaoLak') ||
       f.name.includes('Avatar') || f.name.includes('CheoLan') ||
       f.name.includes('PhangNga') || f.name.includes('Fishing') ||
       f.name.includes('Krabi') || f.name.includes('Dostoprimechatelnosti'))
    );
    
    console.log(`   ✅ Найдено TSX файлов: ${tourPages.length}\n`);
    
    // 3. Парсим каждый тур
    const foundTours = [];
    
    // Парсим из tours.ts если есть
    if (toursDataContent) {
      // Простой парсинг экспортов
      const exportMatches = toursDataContent.match(/export\s+(?:const|interface)\s+(\w+)/g);
      if (exportMatches) {
        console.log(`   📝 Найдено экспортов: ${exportMatches.length}`);
      }
    }
    
    // Парсим из TSX страниц
    for (const page of tourPages) {
      const content = await getFileContent(page.path);
      if (content) {
        const tour = extractTourFromFile(content, page.name);
        if (tour && tour.title) {
          foundTours.push(tour);
          console.log(`   📝 Парсинг: ${page.name} → ${tour.title}`);
        }
      }
      // Пауза между запросами к GitHub API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (foundTours.length === 0) {
      console.log('❌ Не найдено туров в репозитории');
      return;
    }
    
    console.log(`\n🎯 Найдено туров в репозитории: ${foundTours.length}\n`);
    
    // 4. Фильтруем - оставляем только новые
    const newTours = foundTours.filter(tour => {
      const handle = generateHandle(tour.title);
      return !existingHandles.has(handle.toLowerCase());
    });
    
    if (newTours.length === 0) {
      console.log('✅ Все туры из репозитория уже есть в Shopify!');
      return;
    }
    
    console.log(`📦 Новых туров для загрузки: ${newTours.length}\n`);
    
    // 5. Загружаем новые туры
    for (let i = 0; i < newTours.length; i++) {
      const tour = newTours[i];
      console.log(`\n[${i + 1}/${newTours.length}] ${tour.title}`);
      await createTourInShopify(tour);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log('\n✅ Готово!');
    if (APPLY) {
      console.log('🌐 Проверьте: http://localhost:8080/phuket');
    } else {
      console.log('💡 Для реальной загрузки добавьте флаг --apply');
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    if (error.message.includes('rate limit')) {
      console.error('\n💡 GitHub API rate limit. Попробуйте позже или используйте локальный клон репозитория.');
    }
  }
}

main().catch(console.error);

