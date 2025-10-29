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

async function getProductId(handle) {
  const query = `query { productByHandle(handle: "${handle}") { id title } }`;
  const result = await makeGraphQLRequest(query);
  return result.data.productByHandle;
}

function generateCompactCardStyle(place) {
  return `<div class="space-y-6">
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">${place.icon} ${place.title.split('(')[0].trim()} (${place.russianTitle})</h1>
    <p class="text-blue-100 text-lg">${place.shortDescription}</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1"><span class="text-yellow-300">⭐</span><span class="font-semibold">${place.rating}</span></div>
      <div class="flex items-center gap-1"><span class="text-green-300">💰</span><span>${'$'.repeat(place.priceLevel)}</span></div>
      <div class="flex items-center gap-1"><span class="text-blue-300">📍</span><span>${place.district}</span></div>
    </div>
  </div>
  
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2"><span class="text-2xl">🕐</span><span class="font-semibold text-gray-900">Часы работы</span></div>
      <p class="text-gray-600 text-sm">${place.workingHours}</p>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2"><span class="text-2xl">🚗</span><span class="font-semibold text-gray-900">Парковка</span></div>
      <p class="text-gray-600 text-sm">Бесплатная</p>
    </div>
  </div>
  
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О торговом центре</h2>
    <p class="text-gray-600 leading-relaxed mb-4">${place.fullDescription}</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    ${place.sections.map(section => `
    <div class="bg-gradient-to-br ${section.gradient} rounded-xl p-5 border ${section.border}">
      <div class="flex items-center gap-3 mb-3"><span class="text-3xl">${section.icon}</span><h3 class="text-lg font-bold text-gray-900">${section.title}</h3></div>
      <p class="text-gray-600 text-sm mb-3">${section.description}</p>
      ${section.items ? `<div class="space-y-2">${section.items.map(item => `<div class="flex items-center gap-2"><span class="text-${item.color}-500">${item.icon}</span><span class="text-sm text-gray-700">${item.text}</span></div>`).join('')}</div>` : ''}
    </div>
    `).join('')}
  </div>
  
  ${place.mustSee ? `
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3"><span class="text-2xl">⭐</span><h3 class="text-lg font-bold">Обязательно к посещению!</h3></div>
    <div class="space-y-2">
      <div class="flex items-center gap-2"><span class="text-2xl">${place.mustSee.icon}</span><div><p class="font-semibold">${place.mustSee.title}</p><p class="text-yellow-100 text-sm">${place.mustSee.description}</p></div></div>
    </div>
  </div>
  ` : ''}
  
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${place.amenities.map(amenity => `<div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50"><span class="text-${amenity.color}-500">${amenity.icon}</span><span class="text-sm text-gray-700">${amenity.text}</span></div>`).join('')}
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
    <p class="text-gray-600 italic">${place.conclusion}</p>
  </div>
</div>`;
}

const shoppingCenters = [
  {
    handle: 'jungceylon-shopping-center',
    title: 'Jungceylon Shopping Center',
    russianTitle: 'Джангцелон',
    icon: '🛍️',
    shortDescription: 'Крупнейший торговый центр в самом центре Патонга',
    fullDescription: 'Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.',
    rating: 4.6,
    priceLevel: 2,
    district: 'Патонг',
    workingHours: '11:00-23:00 ежедневно',
    amenities: [
      { icon: '📶', text: 'Wi-Fi', color: 'green' },
      { icon: '🅿️', text: 'Парковка', color: 'blue' },
      { icon: '🍽️', text: 'Фуд-корт', color: 'orange' },
      { icon: '🎬', text: 'Кино', color: 'purple' },
      { icon: '🎳', text: 'Боулинг', color: 'cyan' },
      { icon: '👶', text: 'Детские зоны', color: 'pink' }
    ],
    sections: [
      {
        icon: '🛒',
        title: 'Магазины и бутики',
        description: 'Широкий выбор международных и местных брендов',
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        items: [
          { icon: '👔', text: 'H&M, Zara, Uniqlo, Adidas, Nike', color: 'blue' },
          { icon: '💄', text: 'Sephora, Boots, Watsons', color: 'pink' },
          { icon: '📱', text: 'Магазины техники, аксессуары', color: 'purple' }
        ]
      },
      {
        icon: '🍽️',
        title: 'Еда и напитки',
        description: 'Разнообразие кухонь мира',
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        items: [
          { icon: '🍜', text: 'Тайская, китайская, японская, европейская кухня', color: 'orange' },
          { icon: '☕', text: 'Starbucks, McDonald\'s, местные кафе', color: 'brown' }
        ]
      }
    ],
    mustSee: {
      icon: '🎬',
      title: 'Major Cineplex',
      description: 'Современные залы с 3D фильмами и комфортными креслами'
    },
    conclusion: 'Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.'
  }
];

async function updateShoppingCenter(place) {
  try {
    console.log(`\n🔄 Обновляем ${place.title}...`);
    
    const product = await getProductId(place.handle);
    if (!product) {
      console.log(`❌ Продукт ${place.handle} не найден`);
      return;
    }

    const descriptionHtml = generateCompactCardStyle(place);
    
    const mutation = `mutation {
      productUpdate(input: {
        id: "${product.id}",
        descriptionHtml: ${JSON.stringify(descriptionHtml)}
      }) {
        product { id title }
        userErrors { field message }
      }
    }`;

    const result = await makeGraphQLRequest(mutation);
    
    if (result.data.productUpdate.userErrors.length > 0) {
      console.log(`❌ Ошибки:`, result.data.productUpdate.userErrors);
    } else {
      console.log(`✅ ${place.title} успешно обновлен!`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
  } catch (error) {
    console.log(`❌ Ошибка:`, error.message);
  }
}

async function main() {
  console.log('🚀 Обновляем Jungceylon с карточным стилем...');
  await updateShoppingCenter(shoppingCenters[0]);
  console.log('\n🎉 Готово! Проверьте: http://localhost:5173/place/jungceylon-shopping-center');
}

main();
