const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Telegram WebApp Style Description для Big C
const telegramStyleDescription = `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🛒 Big C Supercenter Phuket</h1>
    <p class="text-green-100 text-lg">Гипермаркет для всей семьи</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">4.3</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>$</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>Чалонг</span>
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
      <p class="text-gray-600 text-sm">08:00-22:00 ежедневно</p>
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
    <h2 class="text-xl font-bold text-gray-900 mb-4">О гипермаркете</h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      Крупная сеть гипермаркетов Таиланда. Здесь вы найдете всё: от продуктов питания до электроники и одежды. 
      Низкие цены и большой выбор товаров. Идеально для ежедневных покупок и закупки сувениров.
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Продукты питания -->
    <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">🥘</span>
        <h3 class="text-lg font-bold text-gray-900">Продукты питания</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">Свежие и качественные</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-red-500">🍎</span>
          <span class="text-sm text-gray-700">Фрукты, овощи, мясо, рыба</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-orange-500">🍜</span>
          <span class="text-sm text-gray-700">Тайские деликатесы и специи</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-yellow-500">🍞</span>
          <span class="text-sm text-gray-700">Свежая выпечка</span>
        </div>
      </div>
    </div>

    <!-- Товары для дома -->
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">🏠</span>
        <h3 class="text-lg font-bold text-gray-900">Товары для дома</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">Всё необходимое</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-blue-500">💻</span>
          <span class="text-sm text-gray-700">Электроника и бытовая техника</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-purple-500">👕</span>
          <span class="text-sm text-gray-700">Одежда для всей семьи</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-pink-500">🎁</span>
          <span class="text-sm text-gray-700">Товары для дома и декор</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Must-See Highlight -->
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⭐</span>
      <h3 class="text-lg font-bold">Не пропустите!</h3>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🍽️</span>
        <div>
          <p class="font-semibold">Фуд-корт</p>
          <p class="text-yellow-100 text-sm">Тайская кухня по низким ценам — попробуйте настоящий Pad Thai!</p>
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
        <span class="text-red-500">🏧</span>
        <span class="text-sm text-gray-700">Банкомат</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-purple-500">❄️</span>
        <span class="text-sm text-gray-700">Кондиционеры</span>
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-cyan-500">🛒</span>
        <span class="text-sm text-gray-700">Тележки</span>
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
      Big C Supercenter — идеальное место для покупки продуктов и товаров повседневного спроса. 
      Низкие цены, большой выбор и удобное расположение делают его популярным среди местных жителей и туристов.
    </p>
  </div>
</div>
`;

async function updateBigCDescription() {
  try {
    console.log('🚀 Обновляем описание Big C в стиле Telegram WebApp...');
    
    // 1. Получить ID продукта
    const productId = await getProductId('big-c-supercenter-phuket');
    if (!productId) {
      throw new Error('❌ Продукт не найден');
    }
    
    console.log('✅ ID продукта:', productId);
    
    // 2. Обновить описание
    const mutation = `
      mutation {
        productUpdate(input: {
          id: "${productId}",
          descriptionHtml: "${telegramStyleDescription.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
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
    console.log('🔗 Проверьте: http://localhost:8080/place/big-c-supercenter-phuket');
    
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
updateBigCDescription();
