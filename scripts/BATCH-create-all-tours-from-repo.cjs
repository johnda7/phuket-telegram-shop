#!/usr/bin/env node

/**
 * 🚀 МАССОВАЯ ЗАГРУЗКА ВСЕХ ТУРОВ ИЗ РЕПОЗИТОРИЯ
 * 
 * Этот скрипт:
 * 1. Получает список туров из репозитория (GitHub API или локально)
 * 2. Проверяет какие уже есть в Shopify
 * 3. Загружает недостающие туры ПОЛНОСТЬЮ:
 *    - Создает продукт с премиум описанием
 *    - Публикует продукт
 *    - Готов к загрузке фотографий
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/BATCH-create-all-tours-from-repo.cjs [--apply]
 */

const https = require('https');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

// ============================================================================
// ДАННЫЕ ТУРОВ ИЗ РЕПОЗИТОРИЯ
// ============================================================================

// Приоритетные туры для загрузки (из репозитория island-travel-echo-clone)
const TOURS_TO_LOAD = [
  {
    title: 'James Bond Island Tour',
    handle: 'james-bond-island-tour',
    priceAdult: 1400,
    priceChild: 0,
    duration: '1 день',
    tags: ['tour', 'islands', 'james-bond', 'phang-nga', '1-day', 'popular'],
    description: 'Незабываемое путешествие к острову Джеймса Бонда и заливу Пханг Нга — одному из самых живописных мест Таиланда! Знаменитый остров Кхао Пинг Кан, где снимали фильм "Человек с золотым пистолетом".',
    photoQuery: 'James Bond Island Phang Nga Thailand high quality',
  },
  {
    title: '4 Pearls Andaman Sea',
    handle: '4-pearls-andaman-sea',
    priceAdult: 2000,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'islands', '4-pearls', 'andaman', '1-day', 'snorkeling', 'popular'],
    description: 'Экскурсия на 4 самых красивых острова Андаманского моря: Рача Яй, Рача Ной, Коралловый остров и Бамбуковый остров. Кристально чистая вода, идеальный снорклинг и райские пляжи!',
    photoQuery: '4 pearls Andaman Sea Phuket Thailand snorkeling',
  },
  {
    title: 'Similan Islands Tour',
    handle: 'similan-islands-tour',
    priceAdult: 2500,
    priceChild: 2000,
    duration: '1 день',
    tags: ['tour', 'islands', 'similan', '1-day', 'snorkeling', 'diving', 'popular'],
    description: 'Одно из лучших мест для дайвинга в мире! Симиланские острова — национальный парк с кристально чистой водой, богатым подводным миром и невероятной красоты пляжами.',
    photoQuery: 'Similan Islands Thailand diving snorkeling high quality',
  },
  {
    title: 'Racha Coral Islands Tour',
    handle: 'racha-coral-islands-tour',
    priceAdult: 1800,
    priceChild: 1400,
    duration: '1 день',
    tags: ['tour', 'islands', 'racha', 'coral', '1-day', 'snorkeling'],
    description: 'Близко к Пхукету и очень красиво! Острова Рача (Racha) известны своими коралловыми рифами и идеальными условиями для снорклинга. Идеальный вариант для тех, кто хочет увидеть красоты подводного мира без длительной поездки.',
    photoQuery: 'Racha Coral Islands Phuket Thailand snorkeling',
  },
  {
    title: 'Phi Phi Sunrise Tour',
    handle: 'phi-phi-sunrise-tour',
    priceAdult: 1800,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'islands', 'phi-phi', '1-day', 'sunrise'],
    description: 'Ранний выезд позволяет избежать толп туристов и насладиться островами Пхи-Пхи в их первозданной красоте! Майя Бэй, обзорная площадка и идеальный снорклинг — всё за один день.',
    photoQuery: 'Phi Phi Islands Sunrise Phuket Thailand Maya Bay',
  },
  {
    title: 'Eleven Islands Standard Tour',
    handle: 'eleven-islands-standard-tour',
    priceAdult: 1800,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'islands', '11-islands', 'phang-nga', '1-day'],
    description: 'Максимальный охват за один день! 11 островов залива Пханг Нга, включая остров Джеймса Бонда, пещеры, лагуны и пляжи. Идеально для тех, кто хочет увидеть как можно больше!',
    photoQuery: '11 islands Phang Nga Phuket Thailand tour',
  },
  {
    title: 'Racha Coral Rawai Tour',
    handle: 'racha-coral-rawai-tour',
    priceAdult: 1700,
    priceChild: 1300,
    duration: '1 день',
    tags: ['tour', 'islands', 'racha', 'rawai', '1-day', 'snorkeling'],
    description: 'Выезд из Равая — ближе к островам! Тур на острова Рача с выездом из порта Равай. Идеальный вариант для тех, кто остановился в южной части Пхукета.',
    photoQuery: 'Racha Islands Rawai Phuket Thailand',
  },
  {
    title: 'Racha Coral Sunrise Tour',
    handle: 'racha-coral-sunrise-tour',
    priceAdult: 1900,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'islands', 'racha', 'sunrise', '1-day', 'snorkeling'],
    description: 'Раннее утро = меньше людей! Специальный тур с ранним выездом для тех, кто хочет насладиться островами Рача без толп туристов. Идеальное освещение для фотографий!',
    photoQuery: 'Racha Islands Sunrise Phuket Thailand early morning',
  },
  {
    title: 'Phang Nga Skywalk Tour',
    handle: 'phang-nga-skywalk-tour',
    priceAdult: 1500,
    priceChild: 1200,
    duration: '1 день',
    tags: ['tour', 'phang-nga', 'skywalk', 'viewpoint', '1-day'],
    description: 'Невероятные виды с высоты! Стеклянная смотровая площадка Skywalk над заливом Пханг Нга. Захватывающие дух панорамы и уникальный опыт прогулки над морем.',
    photoQuery: 'Phang Nga Skywalk Thailand glass walkway',
  },
  {
    title: 'Krabi Secrets Tour',
    handle: 'krabi-secrets-tour',
    priceAdult: 2000,
    priceChild: 1700,
    duration: '1 день',
    tags: ['tour', 'islands', 'krabi', '1-day'],
    description: 'Секретные места провинции Краби! Менее известные, но не менее красивые острова и пляжи. Для тех, кто хочет увидеть что-то особенное, вне популярных маршрутов.',
    photoQuery: 'Krabi secret islands Thailand Phuket tour',
  },
  {
    title: 'Five Pearls 2 Days',
    handle: 'five-pearls-2-days',
    priceAdult: 4500,
    priceChild: 3800,
    duration: '2 дня / 1 ночь',
    tags: ['tour', 'islands', '5-pearls', '2-days', 'snorkeling', 'popular'],
    description: 'Двухдневное путешествие по 5 самым красивым островам Андаманского моря! С ночевкой, питанием и полным погружением в райскую атмосферу островов.',
    photoQuery: '5 pearls Andaman Sea 2 days Phuket Thailand',
  },
  {
    title: 'Phang Nga Samet Tour',
    handle: 'phang-nga-samet-tour',
    priceAdult: 1800,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'islands', 'phang-nga', 'samet', '1-day'],
    description: 'Остров Самэт и залив Пханг Нга — сочетание природной красоты и уникальных достопримечательностей. Пещеры, лагуны и изумрудная вода.',
    photoQuery: 'Phang Nga Samet Island Thailand Phuket',
  },
  {
    title: 'Cheo Lan Lake Tour',
    handle: 'cheo-lan-lake-tour',
    priceAdult: 2200,
    priceChild: 1800,
    duration: '1 день',
    tags: ['tour', 'lake', 'nature', 'khao-sok', '1-day'],
    description: 'Озеро Чио Лан в национальном парке Кхао Сок — одно из самых красивых мест Таиланда! Изумрудная вода, известняковые скалы и нетронутая природа.',
    photoQuery: 'Cheo Lan Lake Khao Sok Thailand nature',
  },
  {
    title: 'Fishing Sunrise Tour',
    handle: 'fishing-sunrise-tour',
    priceAdult: 2500,
    priceChild: 2000,
    duration: '1 день',
    tags: ['tour', 'fishing', 'sunrise', '1-day'],
    description: 'Рыбалка на рассвете в Андаманском море! Ранний выезд, профессиональное снаряжение и незабываемые впечатления от рыбалки в открытом море.',
    photoQuery: 'Fishing sunrise Phuket Thailand Andaman Sea',
  },
  {
    title: 'Dostoprimechatelnosti Phuketa Tour',
    handle: 'dostoprimechatelnosti-phuketa-tour',
    priceAdult: 1500,
    priceChild: 1200,
    duration: '1 день',
    tags: ['tour', 'attractions', 'culture', 'temples', '1-day'],
    description: 'Обзорная экскурсия по главным достопримечательностям Пхукета: храмы, смотровые площадки, культурные памятники. Идеально для первого знакомства с островом!',
    photoQuery: 'Phuket attractions temples viewpoints Thailand',
  },
  {
    title: 'Avatar Plus Hangdong Tour',
    handle: 'avatar-plus-hangdong-tour',
    priceAdult: 1800,
    priceChild: 1500,
    duration: '1 день',
    tags: ['tour', 'adventure', 'zipline', 'elephants', 'jungle', '1-day'],
    description: 'Экстремальные приключения в джунглях Пхукета! Зиплайн, парк слонов и другие активности для любителей адреналина.',
    photoQuery: 'Avatar zipline elephants Phuket Thailand adventure',
  },
];

// ============================================================================
// GRAPHQL HELPERS
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

async function getExistingTours() {
  console.log('🔍 Получаем список существующих туров из Shopify...\n');
  
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
// СОЗДАНИЕ ТУРА (используем готовый скрипт)
// ============================================================================

async function createTour(tourData) {
  // Используем встроенные функции из мастер-скрипта
  const fs = require('fs');
  const masterScriptPath = require.resolve('./MASTER-create-tour-complete.cjs');
  
  // Динамически загружаем функции (проще через exec)
  const { execSync } = require('child_process');
  
  // Формируем команду с правильным экранированием
  const args = [
    tourData.title.replace(/"/g, '\\"'),
    tourData.handle,
    tourData.priceAdult,
    tourData.priceChild || 0,
    tourData.tags.join(','),
    tourData.duration.replace(/"/g, '\\"'),
    tourData.description.replace(/"/g, '\\"'),
    tourData.photoQuery.replace(/"/g, '\\"'),
    ...(APPLY ? ['--apply'] : []),
  ];
  
  const command = `node scripts/MASTER-create-tour-complete.cjs "${args[0]}" ${args[1]} ${args[2]} ${args[3]} "${args[4]}" "${args[5]}" "${args[6]}" "${args[7]}"${APPLY ? ' --apply' : ''}`;
  
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    return true;
  } catch (error) {
    // Если тур уже существует - это не ошибка
    if (error.message.includes('already in use')) {
      console.log(`   ⚠️  Тур уже существует, пропускаем...`);
      return true;
    }
    console.error(`❌ Ошибка создания тура ${tourData.title}:`, error.message);
    return false;
  }
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  console.log('🚀 МАССОВАЯ ЗАГРУЗКА ТУРОВ ИЗ РЕПОЗИТОРИЯ');
  console.log('='.repeat(60));
  console.log(`📦 Всего туров для проверки: ${TOURS_TO_LOAD.length}`);
  console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);
  
  // 1. Получаем существующие туры
  const existingHandles = await getExistingTours();
  console.log('');
  
  // 2. Фильтруем - оставляем только новые
  const newTours = TOURS_TO_LOAD.filter(tour => {
    const handle = tour.handle.toLowerCase();
    return !existingHandles.has(handle);
  });
  
  if (newTours.length === 0) {
    console.log('✅ Все туры из списка уже есть в Shopify!');
    return;
  }
  
  console.log(`🎯 Найдено новых туров для загрузки: ${newTours.length}\n`);
  
  // 3. Показываем список
  console.log('📋 СПИСОК НОВЫХ ТУРОВ:');
  newTours.forEach((tour, i) => {
    console.log(`   ${i + 1}. ${tour.title} (${tour.handle}) - ${tour.priceAdult} ฿`);
  });
  console.log('');
  
  if (!APPLY) {
    console.log('💡 Для реальной загрузки добавьте флаг --apply');
    return;
  }
  
  // 4. Загружаем каждый тур
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < newTours.length; i++) {
    const tour = newTours[i];
    
    console.log('\n' + '='.repeat(60));
    console.log(`📦 [${i + 1}/${newTours.length}] Загружаем: ${tour.title}`);
    console.log('='.repeat(60));
    
    try {
      const success = await createTour(tour);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Пауза между турами
      if (i < newTours.length - 1) {
        console.log('\n⏳ Пауза 3 секунды перед следующим туром...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`❌ Критическая ошибка:`, error.message);
      errorCount++;
    }
  }
  
  // 5. Итоги
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ МАССОВОЙ ЗАГРУЗКИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${successCount}/${newTours.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${newTours.length}`);
  
  if (successCount === newTours.length) {
    console.log('\n🎉 ВСЕ ТУРЫ УСПЕШНО ЗАГРУЖЕНЫ!');
    console.log('🌐 Проверьте: http://localhost:8080/phuket');
    console.log('\n📸 СЛЕДУЮЩИЙ ШАГ: Загрузите фотографии для туров!');
  } else {
    console.log('\n⚠️  Некоторые туры не удалось загрузить. Проверьте ошибки выше.');
  }
}

main().catch(console.error);

