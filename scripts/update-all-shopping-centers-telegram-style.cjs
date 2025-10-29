const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Данные для всех торговых центров
const shoppingCentersData = {
  'jungceylon-shopping-center': {
    title: 'Jungceylon Shopping Center (Джангцелон)',
    shortTitle: 'Jungceylon (Джангцелон)',
    description: 'Крупнейший молл в Патонге с кинотеатром, боулингом и широким выбором магазинов',
    rating: 4.4,
    priceLevel: 2,
    district: 'Patong',
    workingHours: '11:00-23:00 ежедневно',
    features: [
      { icon: '🎬', title: 'Кинотеатр', desc: 'Major Cineplex' },
      { icon: '🎳', title: 'Боулинг', desc: 'Развлечения для всей семьи' },
      { icon: '🏖️', title: 'Рядом с пляжем', desc: '5 минут до Патонга' }
    ],
    amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Кино', 'Боулинг', 'Банкомат']
  },
  'premium-outlet-phuket': {
    title: 'Premium Outlet Phuket (Премиум Аутлет Пхукет)',
    shortTitle: 'Premium Outlet (Премиум Аутлет)',
    description: 'Аутлет-центр со скидками до 70% на брендовую одежду Nike, Adidas, Levi\'s и другие',
    rating: 4.3,
    priceLevel: 2,
    district: 'Thalang',
    workingHours: '10:00-22:00 ежедневно',
    features: [
      { icon: '💰', title: 'Скидки до 70%', desc: 'Круглый год' },
      { icon: '👕', title: 'Бренды', desc: 'Nike, Adidas, Levi\'s' },
      { icon: '✈️', title: 'Рядом с аэропортом', desc: '15 минут' }
    ],
    amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Банкомат', 'Скидки', 'Бренды']
  },
  'big-c-supercenter-phuket': {
    title: 'Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)',
    shortTitle: 'Big C (Биг Си)',
    description: 'Большой супермаркет с продуктами, одеждой, электроникой и фуд-кортом',
    rating: 4.2,
    priceLevel: 1,
    district: 'Chalong',
    workingHours: '08:00-22:00 ежедневно',
    features: [
      { icon: '🛒', title: 'Супермаркет', desc: 'Продукты и товары' },
      { icon: '🍽️', title: 'Фуд-корт', desc: 'Тайская и международная кухня' },
      { icon: '💰', title: 'Бюджетно', desc: 'Доступные цены' }
    ],
    amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Банкомат', 'Продукты', 'Электроника']
  },
  'tesco-lotus-phuket': {
    title: 'Tesco Lotus Phuket (Теско Лотус Пхукет)',
    shortTitle: 'Tesco Lotus (Теско Лотус)',
    description: 'Популярный гипермаркет с широким ассортиментом товаров по доступным ценам',
    rating: 4.1,
    priceLevel: 2,
    district: 'Chalong',
    workingHours: '08:00-22:00 ежедневно',
    features: [
      { icon: '🌍', title: 'Импорты', desc: 'Международные товары' },
      { icon: '⭐', title: 'Качество', desc: 'Проверенные бренды' },
      { icon: '👥', title: 'Для экспатов', desc: 'Знакомые товары' }
    ],
    amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Банкомат', 'Импорты', 'Качество']
  },
  'robinson-lifestyle-phuket': {
    title: 'Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)',
    shortTitle: 'Robinson (Робинсон)',
    description: 'Торговый центр с модной одеждой, косметикой и ресторанами',
    rating: 4.3,
    priceLevel: 2,
    district: 'Karon',
    workingHours: '10:00-22:00 ежедневно',
    features: [
      { icon: '👗', title: 'Мода', desc: 'Одежда и аксессуары' },
      { icon: '💄', title: 'Косметика', desc: 'Sephora и другие' },
      { icon: '🏖️', title: 'Рядом с пляжем', desc: '5 минут до Карона' }
    ],
    amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Кино', 'Мода', 'Косметика']
  },
  'patong-night-market': {
    title: 'Patong Night Market (Ночной рынок Патонг)',
    shortTitle: 'Night Market (Ночной рынок)',
    description: 'Ночной рынок в центре Патонга с сувенирами, одеждой и уличной едой',
    rating: 4.5,
    priceLevel: 1,
    district: 'Patong',
    workingHours: '17:00-23:00 ежедневно',
    features: [
      { icon: '🌙', title: 'Ночной рынок', desc: 'После заката' },
      { icon: '💬', title: 'Торг', desc: 'Можно торговаться' },
      { icon: '🍜', title: 'Уличная еда', desc: 'Тайские деликатесы' }
    ],
    amenities: ['Уличная еда', 'Сувениры', 'Торг', 'Ночной', 'Рынок', 'Развлечения']
  }
};

function generateTelegramStyleDescription(center) {
  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🏢 ${center.title}</h1>
    <p class="text-blue-100 text-lg">${center.description}</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${center.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>${'$'.repeat(center.priceLevel)}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>${center.district}</span>
      </div>
    </div>
  </div>

  <!-- Quick Info Cards -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🕐</span>
        <span class="font-semibold text-gray-900">Часы работы</span>
      </div>
      <p class="text-gray-600 text-sm">${center.workingHours}</p>
    </div>
    
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🚗</span>
        <span class="font-semibold text-gray-900">Парковка</span>
      </div>
      <p class="text-gray-600 text-sm">Бесплатная</p>
    </div>
  </div>

  <!-- Main Description -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О торговом центре</h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      ${center.description}
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    ${center.features.map(feature => `
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">${feature.icon}</span>
          <h3 class="text-lg font-bold text-gray-900">${feature.title}</h3>
        </div>
        <p class="text-gray-600 text-sm">${feature.desc}</p>
      </div>
    `).join('')}
  </div>

  <!-- Must-See Highlight -->
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⭐</span>
      <h3 class="text-lg font-bold">Обязательно к посещению!</h3>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">${center.features[0].icon}</span>
        <div>
          <p class="font-semibold">${center.features[0].title}</p>
          <p class="text-yellow-100 text-sm">${center.features[0].desc}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Amenities -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${center.amenities.map(amenity => `
        <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
          <span class="text-green-500">📶</span>
          <span class="text-sm text-gray-700">${amenity}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Action Buttons - Telegram WebApp Style -->
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-900">Планируете поездку?</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a href="/phuket" class="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">🏝️</span>
          <span class="font-semibold">Туры</span>
        </div>
        <p class="text-blue-100 text-sm">С гидом</p>
      </a>
      
      <a href="/services/car-rental" class="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">🚗</span>
          <span class="font-semibold">Аренда авто</span>
        </div>
        <p class="text-green-100 text-sm">Самостоятельно</p>
      </a>
      
      <a href="/services/currency-exchange" class="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">💱</span>
          <span class="font-semibold">Обмен валюты</span>
        </div>
        <p class="text-purple-100 text-sm">Выгодный курс</p>
      </a>
    </div>
  </div>

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic">
      ${center.shortTitle} — это отличное место для шопинга, развлечений и знакомства с местной культурой. 
      Идеально подходит для туристов и местных жителей.
    </p>
  </div>
</div>
`;
}

async function updateAllShoppingCenters() {
  try {
    console.log('🚀 Обновляем все торговые центры в стиле Telegram WebApp...');
    
    for (const [handle, centerData] of Object.entries(shoppingCentersData)) {
      console.log(`\n📝 Обновляем ${centerData.title}...`);
      
      // 1. Получить ID продукта
      const productId = await getProductId(handle);
      if (!productId) {
        console.log(`❌ Продукт ${handle} не найден, пропускаем`);
        continue;
      }
      
      console.log(`✅ ID продукта: ${productId}`);
      
      // 2. Сгенерировать описание
      const descriptionHtml = generateTelegramStyleDescription(centerData);
      
      // 3. Обновить описание
      const mutation = `
        mutation {
          productUpdate(input: {
            id: "${productId}",
            title: "${centerData.title}",
            descriptionHtml: "${descriptionHtml.replace(/"/g, '\\"')}"
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
      
      const result = await makeGraphQLRequest(mutation);
      
      if (result.data?.productUpdate?.userErrors?.length > 0) {
        console.error(`❌ Ошибки GraphQL для ${handle}:`, result.data.productUpdate.userErrors);
        continue;
      }
      
      console.log(`✅ ${centerData.title} обновлен успешно!`);
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log('\n🎉 Все торговые центры обновлены!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

async function getProductId(handle) {
  const query = `
    query {
      products(first: 10, query: "handle:${handle}") {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  const product = result.data?.products?.edges?.[0]?.node;
  return product?.id;
}

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
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
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Запуск
updateAllShoppingCenters();
