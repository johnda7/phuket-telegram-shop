const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Telegram WebApp Style Description
const telegramStyleDescription = `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🏢 Central Phuket (Централ Пхукет)</h1>
    <p class="text-blue-100 text-lg">Крупнейший торговый центр на острове</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">4.6</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>$$$</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>Чернгталай</span>
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
      <p class="text-gray-600 text-sm">10:00-22:00 ежедневно</p>
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
      Два крыла — Floresta и Festival — соединены крытым переходом. 
      300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. 
      Комфортно в жару благодаря кондиционерам.
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Central Festival -->
    <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">🛍️</span>
        <h3 class="text-lg font-bold text-gray-900">Central Festival</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">Масс-маркет бренды</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-blue-500">👔</span>
          <span class="text-sm text-gray-700">Zara, H&M, Uniqlo, Nike</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">🍽️</span>
          <span class="text-sm text-gray-700">2 фуд-корта + рестораны</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-purple-500">🎬</span>
          <span class="text-sm text-gray-700">Кинотеатр Major Cineplex</span>
        </div>
      </div>
    </div>

    <!-- Central Floresta -->
    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">💎</span>
        <h3 class="text-lg font-bold text-gray-900">Central Floresta</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">Люксовые бутики</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-yellow-500">👑</span>
          <span class="text-sm text-gray-700">Louis Vuitton, Prada, Gucci</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-pink-500">👶</span>
          <span class="text-sm text-gray-700">Детский мир</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-blue-500">🐠</span>
          <span class="text-sm text-gray-700">Аквариум Aquaria</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Must-See Highlight -->
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⭐</span>
      <h3 class="text-lg font-bold">Обязательно к посещению!</h3>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🐠</span>
        <div>
          <p class="font-semibold">Aquaria Phuket</p>
          <p class="text-yellow-100 text-sm">Крупнейший океанариум на острове — более 25,000 морских обитателей</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Amenities -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-green-500">📶</span>
        <span class="text-sm text-gray-700">Wi-Fi</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-blue-500">🅿️</span>
        <span class="text-sm text-gray-700">Парковка</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-orange-500">🍽️</span>
        <span class="text-sm text-gray-700">Фуд-корт</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-purple-500">🎬</span>
        <span class="text-sm text-gray-700">Кино</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-cyan-500">🐠</span>
        <span class="text-sm text-gray-700">Аквариум</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-red-500">🏧</span>
        <span class="text-sm text-gray-700">Банкомат</span>
      </div>
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
      Central Phuket — это не просто торговый центр, это целый мир развлечений, 
      шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, 
      романтических прогулок и покупок на любой бюджет.
    </p>
  </div>
</div>
`;

async function updateCentralPhuketDescription() {
  try {
    console.log('🚀 Обновляем описание Central Phuket в стиле Telegram WebApp...');
    
    // 1. Получить ID продукта
    const productId = await getProductId('central-phuket-floresta');
    if (!productId) {
      throw new Error('❌ Продукт не найден');
    }
    
    console.log('✅ ID продукта:', productId);
    
    // 2. Обновить описание
    const mutation = `
      mutation {
        productUpdate(input: {
          id: "${productId}",
          descriptionHtml: "${telegramStyleDescription.replace(/"/g, '\\"')}"
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
      console.error('❌ Ошибки GraphQL:', result.data.productUpdate.userErrors);
      return;
    }
    
    console.log('✅ Описание обновлено успешно!');
    console.log('📝 Новое описание загружено в Shopify');
    
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
updateCentralPhuketDescription();
