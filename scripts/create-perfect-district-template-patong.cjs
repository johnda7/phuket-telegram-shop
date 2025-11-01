const https = require('https');
const fs = require('fs');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

/**
 * 🎯 СОЗДАНИЕ ПРАВИЛЬНОГО ШАБЛОНА ДЛЯ РАЙОНОВ
 * 
 * ❌ НЕ КОПИРУЕМ ШАБЛОН ТЦ!
 * ✅ Создаём УНИКАЛЬНЫЙ шаблон для РАЙОНОВ
 * 
 * Источник структуры: phuket-insider.com/ru/region/patong/
 * 
 * Эталон: Патонг
 */

// Данные Патонга (на основе phuket-insider.com)
const patongDistrict = {
  handle: 'patong-district',
  title: '📍 Патонг — Центр ночной жизни Пхукета',
  subtitle: 'Самый оживленный туристический район',
  rating: '4.5',
  coordinates: '7.8804,98.2923',
  
  // Главное описание
  description: 'Патонг – самый оживленный туристический район Пхукета. Его заслуженно считают центром ночной жизни на острове. Отдых на Патонге точно понравится людям, которые любят ночную жизнь. Здесь находятся знаменитая тусовочная улица Бангла-Роуд и огромное количество кафе и ресторанов, баров и клубов, где нередко выступают артисты мировой величины. В Патонге находятся два крупных торговых центра и несколько ночных рынков, поэтому здесь можно устроить неплохой шопинг.',
  
  // Кому подходит
  bestFor: 'Туристы, любящие ночную жизнь, тусовки, шопинг',
  
  // Плюсы
  pros: [
    { icon: '🌃', text: 'Знаменитая ночная жизнь (Bangla Road)' },
    { icon: '🛍️', text: 'Два крупных торговых центра' },
    { icon: '🏖️', text: 'Длинный пляж (2.85 км) с развитой инфраструктурой' },
    { icon: '🍽️', text: 'Множество ресторанов и кафе на любой вкус' },
    { icon: '🏨', text: 'Разнообразное жилье (от бюджетных апартаментов до роскошных отелей)' }
  ],
  
  // Минусы
  cons: [
    { icon: '🔊', text: 'Шумно до поздней ночи' },
    { icon: '👥', text: 'Много туристов (особенно в высокий сезон)' },
    { icon: '💰', text: 'Выше цены чем в других районах' }
  ],
  
  // Инфраструктура
  infrastructure: [
    { icon: '🏨', text: 'Отели всех категорий' },
    { icon: '🛍️', text: 'Jungceylon, Patong Plaza' },
    { icon: '🏥', text: 'Больницы и клиники' },
    { icon: '🏧', text: 'Банкоматы на каждом шагу' },
    { icon: '🍽️', text: 'Рестораны, кафе, бары' },
    { icon: '🚗', text: 'Такси, тук-туки, аренда авто' }
  ],
  
  // Лучшие места района (ссылки на другие категории)
  bestPlaces: [
    { category: 'beaches', text: 'Пляж Патонг', description: 'Один из самых популярных и оживленных пляжей Пхукета' },
    { category: 'beaches', text: 'Пляж Freedom Beach', description: 'Уединенный пляж с кристально чистой водой' },
    { category: 'beaches', text: 'Пляж Paradise Beach', description: 'Спокойный пляж для расслабления' },
    { category: 'nightlife', text: 'Bangla Road', description: 'Знаменитая тусовочная улица Пхукета' },
    { category: 'shopping', text: 'Jungceylon', description: 'Крупный торговый центр с множеством магазинов' }
  ],
  
  // Близлежащие районы
  nearbyDistricts: [
    { name: 'Камала', distance: '15 мин на авто' },
    { name: 'Сурин', distance: '20 мин на авто' },
    { name: 'Карон', distance: '10 мин на авто' }
  ],
  
  // Жилье
  accommodation: 'Жилье на Патонге есть самое разное: апартаменты, роскошные и бюджетные отели, а также отдельные курорты с виллами, отелями и бич-клабами.',
  
  // Финальный CTA
  finalCta: 'Патонг подойдет тем, кто любит шумные вечеринки и планирует на Пхукете не отдыхать, а тусоваться. Если вам не по душе такой образ жизни, выберите для себя подходящее место в разделе "Районы Пхукета".'
};

function generateDistrictHTML(district) {
  const prosHTML = district.pros.map(p => `
    <div class="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
      <span class="text-xl flex-shrink-0">${p.icon}</span>
      <span class="text-sm text-gray-700">${p.text}</span>
    </div>
  `).join('');

  const consHTML = district.cons.map(c => `
    <div class="flex items-start gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
      <span class="text-xl flex-shrink-0">${c.icon}</span>
      <span class="text-sm text-gray-700">${c.text}</span>
    </div>
  `).join('');

  const infrastructureHTML = district.infrastructure.map(i => `
    <div class="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
      <span class="text-lg">${i.icon}</span>
      <span class="text-xs text-gray-600">${i.text}</span>
    </div>
  `).join('');

  const bestPlacesHTML = district.bestPlaces.map(place => `
    <div class="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
      <div class="flex items-start gap-2">
        <span class="text-lg">📍</span>
        <div>
          <p class="font-semibold text-gray-900 text-sm">${place.text}</p>
          <p class="text-xs text-gray-600 mt-1">${place.description}</p>
        </div>
      </div>
    </div>
  `).join('');

  const nearbyDistrictsHTML = district.nearbyDistricts.map(n => `
    <li class="flex items-center gap-2 text-sm text-gray-700">
      <span class="text-blue-500">•</span>
      <span><strong>${n.name}</strong> — ${n.distance}</span>
    </li>
  `).join('');

  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 text-white">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-4xl">🌃</span>
      <div>
        <h1 class="text-2xl font-bold">${district.title}</h1>
        <p class="text-blue-100 text-lg">${district.subtitle}</p>
      </div>
    </div>
    <div class="flex items-center gap-4 mt-4 text-sm">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${district.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>👥</span>
        <span>${district.bestFor}</span>
      </div>
    </div>
  </div>

  <!-- Main Description -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О районе</h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      ${district.description}
    </p>
    <p class="text-gray-600 leading-relaxed">
      ${district.accommodation}
    </p>
  </div>

  <!-- Pros and Cons -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
        <span>✅</span>
        <span>Плюсы</span>
      </h3>
      <div class="space-y-2">
        ${prosHTML}
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
        <span>⚠️</span>
        <span>Минусы</span>
      </h3>
      <div class="space-y-2">
        ${consHTML}
      </div>
    </div>
  </div>

  <!-- Infrastructure -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Инфраструктура</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${infrastructureHTML}
    </div>
  </div>

  <!-- Best Places in District -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">🔥 Лучшие места района</h3>
    <p class="text-sm text-gray-600 mb-4">Что обязательно посетить в ${district.title.replace('📍 ', '').split(' — ')[0]}:</p>
    <div class="grid grid-cols-1 gap-3">
      ${bestPlacesHTML}
    </div>
    <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-sm text-gray-700">
        <strong>🎯 Хотите посетить все места ${district.title.replace('📍 ', '').split(' — ')[0]}?</strong> 
        <a href="/category/beaches" class="text-blue-600 underline">Смотрите все пляжи</a>, 
        <a href="/category/nightlife" class="text-blue-600 underline">ночную жизнь</a> или 
        <a href="/phuket" class="text-blue-600 underline">забронируйте тур с гидом</a>!
      </p>
    </div>
  </div>

  <!-- Nearby Districts -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">📍 Близлежащие районы</h3>
    <p class="text-sm text-gray-600 mb-3">Если захочется более спокойной обстановки, посетите соседние районы:</p>
    <ul class="space-y-2">
      ${nearbyDistrictsHTML}
    </ul>
  </div>

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
    <p class="text-gray-700 leading-relaxed">
      <strong>💡 Совет:</strong> ${district.finalCta}
    </p>
    <div class="mt-4 flex flex-wrap gap-3">
      <a href="/category/districts" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-semibold">
        📍 Все районы Пхукета
      </a>
      <a href="/map?category=districts" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-semibold">
        🗺️ Показать на карте
      </a>
    </div>
  </div>
</div>
  `.trim();
}

async function updatePatongDistrict() {
  const html = generateDistrictHTML(patongDistrict);
  
  // Сначала найдём ID продукта Патонга через products запрос
  const queryProduct = `
    query {
      products(first: 10, query: "handle:patong-district") {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  try {
    // Найдём продукт
    const productResult = await makeRequest(queryProduct);
    if (productResult.errors || !productResult.data.products.edges.length) {
      console.error('❌ Ошибка поиска продукта:', productResult.errors || 'Продукт не найден');
      return;
    }

    const product = productResult.data.products.edges[0].node;
    const productId = product.id;
    console.log('✅ Найден продукт:', product.title, productId);

    // Обновим описание (формат как в других скриптах)
    const mutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
            handle
            descriptionHtml
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: productId,
        descriptionHtml: html
      }
    };

    console.log(`📝 Длина HTML: ${html.length} символов`);
    const updateResult = await makeRequest(mutation, variables);

    if (updateResult.errors) {
      console.error('❌ GraphQL ошибки:', JSON.stringify(updateResult.errors, null, 2));
      return;
    }

    if (updateResult.data?.productUpdate?.userErrors?.length > 0) {
      console.error('❌ Ошибки обновления:', JSON.stringify(updateResult.data.productUpdate.userErrors, null, 2));
      return;
    }

    console.log('✅ Патонг успешно обновлён!');
    console.log('📄 Проверь: http://localhost:8080/place/patong-district');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.message.includes('Body:')) {
      console.error('Response body:', error.message.split('Body:')[1]);
    }
  }
}

function makeRequest(query, variables = null) {
  return new Promise((resolve, reject) => {
    const payload = variables ? { query, variables } : { query };
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error('Response status:', res.statusCode);
            console.error('Response body:', body.substring(0, 500));
            reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`));
            return;
          }
          const parsed = JSON.parse(body);
          if (parsed.errors) {
            reject(new Error(`GraphQL errors: ${JSON.stringify(parsed.errors)}`));
            return;
          }
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}, Body: ${body.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Запуск
if (require.main === module) {
  console.log('🎯 Создание правильного шаблона для Патонга (эталон)...\n');
  updatePatongDistrict();
}

module.exports = { generateDistrictHTML, patongDistrict };

