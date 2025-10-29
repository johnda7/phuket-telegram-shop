const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function updateJungceylon() {
  try {
    console.log('🔄 Обновляем Jungceylon...');
    
    // Получаем ID продукта
    const getProductQuery = `query { productByHandle(handle: "jungceylon-shopping-center") { id title } }`;
    const productResult = await makeGraphQLRequest(getProductQuery);
    
    if (!productResult.data.productByHandle) {
      console.log('❌ Продукт не найден');
      return;
    }
    
    const productId = productResult.data.productByHandle.id;
    console.log('Product ID:', productId);
    
    // Простой HTML в стиле карточек
    const simpleCardHtml = `<div class="space-y-6">
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🛍️ Jungceylon Shopping Center (Джангцелон)</h1>
    <p class="text-blue-100 text-lg">Крупнейший торговый центр в самом центре Патонга</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1"><span class="text-yellow-300">⭐</span><span class="font-semibold">4.6</span></div>
      <div class="flex items-center gap-1"><span class="text-green-300">💰</span><span>$$</span></div>
      <div class="flex items-center gap-1"><span class="text-blue-300">📍</span><span>Патонг</span></div>
    </div>
  </div>
  
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2"><span class="text-2xl">🕐</span><span class="font-semibold text-gray-900">Часы работы</span></div>
      <p class="text-gray-600 text-sm">11:00-23:00 ежедневно</p>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2"><span class="text-2xl">🚗</span><span class="font-semibold text-gray-900">Парковка</span></div>
      <p class="text-gray-600 text-sm">Бесплатная</p>
    </div>
  </div>
  
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О торговом центре</h2>
    <p class="text-gray-600 leading-relaxed mb-4">Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
      <div class="flex items-center gap-3 mb-3"><span class="text-3xl">🛒</span><h3 class="text-lg font-bold text-gray-900">Магазины и бутики</h3></div>
      <p class="text-gray-600 text-sm mb-3">Широкий выбор международных и местных брендов</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2"><span class="text-blue-500">👔</span><span class="text-sm text-gray-700">H&M, Zara, Uniqlo, Adidas, Nike</span></div>
        <div class="flex items-center gap-2"><span class="text-pink-500">💄</span><span class="text-sm text-gray-700">Sephora, Boots, Watsons</span></div>
        <div class="flex items-center gap-2"><span class="text-purple-500">📱</span><span class="text-sm text-gray-700">Магазины техники, аксессуары</span></div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
      <div class="flex items-center gap-3 mb-3"><span class="text-3xl">🍽️</span><h3 class="text-lg font-bold text-gray-900">Еда и напитки</h3></div>
      <p class="text-gray-600 text-sm mb-3">Разнообразие кухонь мира</p>
      <div class="space-y-2">
        <div class="flex items-center gap-2"><span class="text-orange-500">🍜</span><span class="text-sm text-gray-700">Тайская, китайская, японская, европейская кухня</span></div>
        <div class="flex items-center gap-2"><span class="text-brown-500">☕</span><span class="text-sm text-gray-700">Starbucks, McDonald's, местные кафе</span></div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3"><span class="text-2xl">⭐</span><h3 class="text-lg font-bold">Обязательно к посещению!</h3></div>
    <div class="space-y-2">
      <div class="flex items-center gap-2"><span class="text-2xl">🎬</span><div><p class="font-semibold">Major Cineplex</p><p class="text-yellow-100 text-sm">Современные залы с 3D фильмами и комфортными креслами</p></div></div>
    </div>
  </div>
  
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-green-500">📶</span><span class="text-sm text-gray-700">Wi-Fi</span></div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-blue-500">🅿️</span><span class="text-sm text-gray-700">Парковка</span></div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-orange-500">🍽️</span><span class="text-sm text-gray-700">Фуд-корт</span></div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-purple-500">🎬</span><span class="text-sm text-gray-700">Кино</span></div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-cyan-500">🎳</span><span class="text-sm text-gray-700">Боулинг</span></div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-pink-500">👶</span><span class="text-sm text-gray-700">Детские зоны</span></div>
    </div>
  </div>
  
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-900">Планируете поездку?</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a href="/phuket" class="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2"><span class="text-xl">🏝️</span><span class="font-semibold">Туры</span></div>
        <p class="text-blue-100 text-sm">С гидом</p>
      </a>
      <a href="/services/car-rental" class="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2"><span class="text-xl">🚗</span><span class="font-semibold">Аренда авто</span></div>
        <p class="text-green-100 text-sm">Самостоятельно</p>
      </a>
      <a href="/services/currency-exchange" class="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2"><span class="text-xl">💱</span><span class="font-semibold">Обмен валюты</span></div>
        <p class="text-purple-100 text-sm">Выгодный курс</p>
      </a>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic">Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.</p>
  </div>
</div>`;
    
    const mutation = `mutation {
      productUpdate(input: {
        id: "${productId}",
        descriptionHtml: ${JSON.stringify(simpleCardHtml)}
      }) {
        product { id title }
        userErrors { field message }
      }
    }`;
    
    console.log('Executing mutation...');
    const updateResult = await makeGraphQLRequest(mutation);
    
    if (updateResult.data.productUpdate.userErrors.length > 0) {
      console.log('❌ Ошибки:', updateResult.data.productUpdate.userErrors);
    } else {
      console.log('✅ Jungceylon успешно обновлен!');
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

updateJungceylon();
