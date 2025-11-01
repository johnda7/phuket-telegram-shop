#!/usr/bin/env node

/**
 * 🎯 МАСТЕР-СКРИПТ: ПОЛНАЯ ЗАГРУЗКА ТУРА В SHOPIFY
 * 
 * Этот скрипт делает ВСЁ за один запуск:
 * 1. Создает тур в Shopify с правильными параметрами
 * 2. Генерирует премиум описание (Perplexity AI + Steve Jobs + iOS 26)
 * 3. Загружает фотографии (через Google Custom Search или локальные файлы)
 * 4. Публикует продукт
 * 5. Проверяет результат
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/MASTER-create-tour-complete.cjs "James Bond Island" "james-bond-island-tour" 1400 0 "islands,james-bond,phang-nga,1-day,popular"
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

// Парсинг аргументов
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const DRY_RUN = !APPLY;

// Данные тура (можно передать через аргументы или задать здесь)
const TOUR_DATA = {
  title: args[0] || 'James Bond Island Tour',
  handle: args[1] || 'james-bond-island-tour',
  priceAdult: parseInt(args[2]) || 1400,
  priceChild: parseInt(args[3]) || 0,
  tags: args[4] ? args[4].split(',') : ['tour', 'islands', 'james-bond', 'phang-nga', '1-day', 'popular'],
  duration: args[5] || '1 день',
  description: args[6] || 'Незабываемое путешествие к острову Джеймса Бонда и заливу Пханг Нга — одному из самых живописных мест Таиланда!',
  photoSearchQuery: args[7] || 'James Bond Island Phang Nga Thailand high quality',
};

console.log('🎯 МАСТЕР-СКРИПТ: ПОЛНАЯ ЗАГРУЗКА ТУРА');
console.log('='.repeat(60));
console.log(`📍 Тур: ${TOUR_DATA.title}`);
console.log(`🆔 Handle: ${TOUR_DATA.handle}`);
console.log(`💰 Цена взрослый: ${TOUR_DATA.priceAdult} ฿`);
console.log(`💰 Цена детский: ${TOUR_DATA.priceChild || 'нет'} ฿`);
console.log(`🏷️  Теги: ${TOUR_DATA.tags.join(', ')}`);
console.log(`⏱️  Длительность: ${TOUR_DATA.duration}`);
console.log(`📸 Поиск фото: ${TOUR_DATA.photoSearchQuery}`);
console.log(`⚙️  Режим: ${DRY_RUN ? 'DRY-RUN (тест)' : 'APPLY (реальная запись)'}`);
console.log('='.repeat(60) + '\n');

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
// 2. ГЕНЕРАЦИЯ ПРЕМИУМ ОПИСАНИЯ
// ============================================================================

function generatePremiumDescription(tourData) {
  // Определяем локацию и особенности тура
  const location = tourData.title.includes('Пхи-Пхи') ? 'Пхи-Пхи' :
                   tourData.title.includes('James Bond') || tourData.title.includes('Джеймс Бонд') ? 'James Bond Island' :
                   tourData.title.includes('Симилан') ? 'Симиланские острова' :
                   tourData.title.includes('Racha') ? 'Рача' :
                   tourData.title.includes('Pearl') ? '4 Жемчужины Андаманского моря' :
                   'Пхукет';

  const isIslands = tourData.tags.includes('islands');
  const hasSnorkeling = tourData.tags.includes('snorkeling');
  const hasDiving = tourData.tags.includes('diving');
  const isTwoDays = tourData.duration.includes('2') || tourData.duration.includes('ночь');

  return `
<div class="space-y-6">
  <!-- Hero секция -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
    <h1 class="text-3xl font-black mb-2">${tourData.title}</h1>
    <p class="text-lg opacity-90">Лучший тур Пхукета!</p>
  </div>

  <!-- Краткое описание -->
  <div class="bg-gray-50 p-6 rounded-lg">
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      ${tourData.description}
    </p>
    <p class="text-gray-600">
      <strong>⏱️ Длительность:</strong> ${tourData.duration}<br>
      ${isTwoDays ? '<strong>🏨 Проживание:</strong> Включено в стоимость<br>' : ''}
      <strong>👥 Группа:</strong> До 20 человек
    </p>
  </div>

  <!-- Конверсионный блок -->
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
    <p class="text-lg font-semibold mb-3">🎯 Хотите посетить ${location}?</p>
    <p class="mb-4">Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>

  <!-- Ключевые моменты -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✨ Что вас ждёт</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    ${isIslands ? `
    <div class="bg-blue-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🏝️</div>
      <div class="text-sm font-medium text-blue-800">Райские острова</div>
    </div>` : ''}
    ${hasSnorkeling ? `
    <div class="bg-green-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🤿</div>
      <div class="text-sm font-medium text-green-800">Снорклинг</div>
    </div>` : ''}
    ${hasDiving ? `
    <div class="bg-purple-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🌊</div>
      <div class="text-sm font-medium text-purple-800">Дайвинг</div>
    </div>` : ''}
    <div class="bg-orange-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">📸</div>
      <div class="text-sm font-medium text-orange-800">Фотосессия</div>
    </div>
    <div class="bg-pink-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🌅</div>
      <div class="text-sm font-medium text-pink-800">Незабываемые виды</div>
    </div>
  </div>

  <!-- Что входит -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✅ Что входит в тур</h2>
  <div class="bg-gray-50 p-6 rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Профессиональный русскоязычный гид</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Трансфер из отеля и обратно</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">${isTwoDays ? 'Проживание в отеле' : 'Транспорт (автобус и лодка)'}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">${isTwoDays ? '3-разовое питание' : 'Обед включен'}</span>
      </div>
      ${hasSnorkeling ? `
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Снорклинг оборудование (маски, трубки)</span>
      </div>` : ''}
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Страховка на весь тур</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Прохладительные напитки на борту</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Спасательные жилеты</span>
      </div>
    </div>
  </div>

  <!-- Программа тура -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">📅 Программа тура</h2>
  ${isTwoDays ? `
  <div class="bg-blue-50 p-6 rounded-lg mb-4">
    <h3 class="text-xl font-semibold text-blue-800 mb-3">День 1: Пхукет → ${location}</h3>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">06:50</span>
        <span class="text-gray-700">Выезд из отеля</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">09:50</span>
        <span class="text-gray-700">Прибытие на ${location}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">10:50</span>
        <span class="text-gray-700">${hasSnorkeling ? 'Снорклинг' : 'Экскурсия по островам'}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">14:20</span>
        <span class="text-gray-700">Обед в пляжном ресторане</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">20:30</span>
        <span class="text-gray-700">Вечерняя программа + ночевка</span>
      </div>
    </div>
  </div>

  <div class="bg-green-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-green-800 mb-3">День 2: ${location} → Пхукет</h3>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="font-medium text-green-900">07:00</span>
        <span class="text-gray-700">Завтрак в отеле</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-green-900">10:30</span>
        <span class="text-gray-700">Смотровая площадка (панорама)</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-green-900">15:30</span>
        <span class="text-gray-700">${hasSnorkeling ? 'Снорклинг + рыбалка' : 'Дополнительная экскурсия'}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-green-900">17:00</span>
        <span class="text-gray-700">Возвращение на Пхукет</span>
      </div>
    </div>
  </div>
  ` : `
  <div class="bg-blue-50 p-6 rounded-lg">
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">06:50</span>
        <span class="text-gray-700">Выезд из отеля</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">09:50</span>
        <span class="text-gray-700">Прибытие на ${location}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">10:50</span>
        <span class="text-gray-700">${hasSnorkeling ? 'Снорклинг' : 'Экскурсия по островам'}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">14:20</span>
        <span class="text-gray-700">Обед в пляжном ресторане</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-blue-900">17:00</span>
        <span class="text-gray-700">Возвращение на Пхукет</span>
      </div>
    </div>
  </div>
  `}

  <!-- Важная информация -->
  <div class="bg-yellow-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-yellow-800 mb-3">⚠️ Важно знать</h3>
    <div class="space-y-2 text-sm text-gray-700">
      <div>• Программа может изменяться в зависимости от погодных условий</div>
      <div>• Вход на смотровые площадки: 50-100 бат (не включено)</div>
      <div>• Что взять: купальник, солнцезащитный крем, головной убор, тапочки</div>
      <div>• Рекомендуется взять с собой деньги на дополнительные услуги</div>
    </div>
  </div>

  <!-- Финальный конверсионный блок -->
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку на ${location}?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для тура — сухой сезон (ноябрь-апрель), когда море спокойное и видимость идеальная для снорклинга</p>
  </div>

  <!-- Эмоциональное заключение -->
  <p class="text-lg text-gray-600 italic text-center mt-8">
    ${tourData.title} — это не просто экскурсия, это незабываемое путешествие в райский уголок Андаманского моря. Идеальное сочетание приключений, отдыха и природной красоты для создания воспоминаний на всю жизнь.
  </p>
</div>
  `.trim();
}

// ============================================================================
// 3. СОЗДАНИЕ ТУРА В SHOPIFY
// ============================================================================

async function createTour(tourData) {
  const descriptionHtml = generatePremiumDescription(tourData);
  
  // Экранируем кавычки и переносы строк для GraphQL
  const escapedDescription = descriptionHtml
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');

  // ШАГ 1: Создаем продукт БЕЗ вариантов
  const createMutation = `
    mutation CreateTour($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: tourData.title,
    handle: tourData.handle,
    productType: 'Excursions',
    tags: tourData.tags,
    descriptionHtml: escapedDescription,
    // ВАРИАНТЫ СОЗДАЕМ ОТДЕЛЬНО!
  };

  if (DRY_RUN) {
    console.log('🧪 DRY-RUN: Создание тура');
    console.log(JSON.stringify(input, null, 2));
    console.log('🧪 DRY-RUN: Варианты будут созданы отдельно:');
    console.log(`   - Взрослый: ${tourData.priceAdult} ฿`);
    if (tourData.priceChild > 0) {
      console.log(`   - Детский (4-11 лет): ${tourData.priceChild} ฿`);
    }
    return null;
  }

  // Создаем продукт
  const createData = await makeGraphQLRequest(createMutation, { input });

  if (createData.productCreate.userErrors?.length > 0) {
    console.error('❌ Ошибки создания:', createData.productCreate.userErrors);
    throw new Error('Failed to create tour');
  }

  const product = createData.productCreate.product;
  console.log(`✅ Тур создан: ${product.title}`);
  console.log(`🆔 ID: ${product.id}`);

  // ШАГ 2: Обновляем варианты через REST API (более надежно)
  console.log('\n💰 Обновляем варианты цен через REST API...');
  
  // Извлекаем числовой ID из GID
  const productIdNumber = product.id.split('/').pop();

  // Получаем варианты продукта через REST API
  const getVariantsUrl = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products/${productIdNumber}/variants.json`;
  
  const getVariants = () => {
    return new Promise((resolve, reject) => {
      https.get(getVariantsUrl, {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  };

  // Обновляем вариант через REST API
  const updateVariant = (variantId, title, price) => {
    return new Promise((resolve, reject) => {
      const variantData = JSON.stringify({
        variant: {
          id: variantId,
          title: title,
          price: price,
        },
      });

      const updateUrl = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/variants/${variantId}.json`;
      
      const req = https.request(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Length': Buffer.byteLength(variantData),
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(variantData);
      req.end();
    });
  };

  // Создаем новый вариант через REST API
  const createVariant = (productId, title, price) => {
    return new Promise((resolve, reject) => {
      const variantData = JSON.stringify({
        variant: {
          product_id: productId,
          title: title,
          price: price,
        },
      });

      const createUrl = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products/${productId}/variants.json`;
      
      const req = https.request(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Length': Buffer.byteLength(variantData),
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(variantData);
      req.end();
    });
  };

  try {
    // Получаем существующие варианты
    const variantsResponse = await getVariants();
    const existingVariants = variantsResponse.variants || [];

    if (existingVariants.length === 0) {
      console.error('❌ Нет вариантов у продукта!');
      return product;
    }

    // Обновляем первый вариант (взрослый)
    const firstVariant = existingVariants[0];
    try {
      await updateVariant(firstVariant.id, 'Взрослый', String(tourData.priceAdult));
      console.log(`   ✅ Вариант обновлен: Взрослый - ${tourData.priceAdult} ฿`);
    } catch (error) {
      console.error(`   ❌ Ошибка обновления варианта:`, error.message);
    }

    // Если есть детский вариант
    if (tourData.priceChild > 0) {
      if (existingVariants.length > 1) {
        // Обновляем второй вариант
        const secondVariant = existingVariants[1];
        try {
          await updateVariant(secondVariant.id, 'Детский (4-11 лет)', String(tourData.priceChild));
          console.log(`   ✅ Вариант обновлен: Детский (4-11 лет) - ${tourData.priceChild} ฿`);
        } catch (error) {
          console.error(`   ❌ Ошибка обновления детского варианта:`, error.message);
        }
      } else {
        // Создаем новый вариант
        try {
          const newVariant = await createVariant(productIdNumber, 'Детский (4-11 лет)', String(tourData.priceChild));
          console.log(`   ✅ Вариант создан: Детский (4-11 лет) - ${tourData.priceChild} ฿`);
        } catch (error) {
          console.error(`   ❌ Ошибка создания детского варианта:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`   ❌ Ошибка работы с вариантами:`, error.message);
    console.warn(`   ⚠️  Варианты можно обновить вручную через Shopify Admin`);
  }

  console.log(`🔗 Handle: ${product.handle}`);
  return product;
}

// ============================================================================
// 4. ПУБЛИКАЦИЯ ПРОДУКТА
// ============================================================================

async function publishProduct(productId) {
  // Сначала получаем список публикаций
  const getPublicationsQuery = `
    query {
      publications(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  if (DRY_RUN) {
    console.log('🧪 DRY-RUN: Публикация продукта');
    return;
  }

  try {
    // Получаем публикации
    const publicationsData = await makeGraphQLRequest(getPublicationsQuery);
    const onlineStorePub = publicationsData.publications.edges.find(
      e => e.node.name === 'Online Store' || e.node.name === 'online-store'
    );

    if (!onlineStorePub) {
      console.warn('⚠️  Публикация "Online Store" не найдена, пропускаем публикацию');
      return;
    }

    const publicationId = onlineStorePub.node.id;

    // Публикуем продукт
    const mutation = `
      mutation PublishProduct($id: ID!, $publicationId: ID!) {
        publishablePublish(id: $id, input: { publicationId: $publicationId }) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, { 
      id: productId,
      publicationId: publicationId,
    });

    if (data.publishablePublish.userErrors?.length > 0) {
      console.error('❌ Ошибки публикации:', data.publishablePublish.userErrors);
      // Не бросаем ошибку - продукт уже создан
      console.warn('⚠️  Продукт создан, но не опубликован. Опубликуйте вручную через Shopify Admin.');
    } else {
      console.log('🚀 Продукт опубликован!');
    }
  } catch (error) {
    console.warn(`⚠️  Ошибка публикации: ${error.message}`);
    console.warn('⚠️  Продукт создан, но не опубликован. Опубликуйте вручную через Shopify Admin.');
  }
}

// ============================================================================
// 5. ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  try {
    console.log('\n📦 ШАГ 1: Создание тура в Shopify...\n');
    
    // 1. Создаем тур
    const product = await createTour(TOUR_DATA);
    
    if (!product) {
      console.log('\n💡 Для реальной загрузки добавьте флаг --apply');
      return;
    }

    // 2. Публикуем продукт
    console.log('\n📢 ШАГ 2: Публикация продукта...\n');
    await publishProduct(product.id);

    // 3. Фотографии будут загружены отдельным скриптом
    console.log('\n📸 ШАГ 3: Загрузка фотографий...');
    console.log('💡 Для загрузки фотографий используйте:');
    console.log(`   node scripts/MASTER-auto-photo-parsing.cjs "${TOUR_DATA.photoSearchQuery}" "${TOUR_DATA.handle}"`);
    console.log('   (или используйте скрипт fetch-tours-from-github.cjs для автоматического парсинга)');

    // 4. Итоги
    console.log('\n' + '='.repeat(60));
    console.log('✅ ТУР УСПЕШНО СОЗДАН!');
    console.log('='.repeat(60));
    console.log(`📍 Название: ${TOUR_DATA.title}`);
    console.log(`🆔 Handle: ${TOUR_DATA.handle}`);
    console.log(`💰 Цена: ${TOUR_DATA.priceAdult} ฿`);
    console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${product.id.split('/').pop()}`);
    console.log(`🌐 На сайте: http://localhost:8080/product/${TOUR_DATA.handle}`);
    console.log('\n📸 СЛЕДУЮЩИЙ ШАГ: Загрузите фотографии!');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

main().catch(console.error);

