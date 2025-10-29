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
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  return result.data.productByHandle;
}

function generateCardStyleDescription(place) {
  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">${place.icon} ${place.title.split('(')[0].trim()} (${place.russianTitle})</h1>
    <p class="text-blue-100 text-lg">${place.shortDescription}</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${place.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>${'$'.repeat(place.priceLevel)}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>${place.district}</span>
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
      <p class="text-gray-600 text-sm">${place.workingHours}</p>
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
      ${place.fullDescription}
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    ${place.sections.map((section, index) => `
    <div class="bg-gradient-to-br ${section.gradient} rounded-xl p-5 border ${section.border}">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">${section.icon}</span>
        <h3 class="text-lg font-bold text-gray-900">${section.title}</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">${section.description}</p>
      ${section.items ? `
      <div class="space-y-2">
        ${section.items.map(item => `
        <div class="flex items-center gap-2">
          <span class="text-${item.color}-500">${item.icon}</span>
          <span class="text-sm text-gray-700">${item.text}</span>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
    `).join('')}
  </div>

  ${place.mustSee ? `
  <!-- Must-See Highlight -->
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⭐</span>
      <h3 class="text-lg font-bold">Обязательно к посещению!</h3>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">${place.mustSee.icon}</span>
        <div>
          <p class="font-semibold">${place.mustSee.title}</p>
          <p class="text-yellow-100 text-sm">${place.mustSee.description}</p>
        </div>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Amenities -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${place.amenities.map(amenity => `
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-${amenity.color}-500">${amenity.icon}</span>
        <span class="text-sm text-gray-700">${amenity.text}</span>
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
      ${place.conclusion}
    </p>
  </div>
</div>
  `;
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
      { icon: '👶', text: 'Детские зоны', color: 'pink' },
      { icon: '🏧', text: 'Банкомат', color: 'red' }
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
  },
  {
    handle: 'premium-outlet-phuket',
    title: 'Premium Outlet Phuket',
    russianTitle: 'Премиум Аутлет Пхукет',
    icon: '🏪',
    shortDescription: 'Крупнейший аутлет-центр на Пхукете с огромными скидками',
    fullDescription: 'Premium Outlet Phuket — это рай для шопоголиков! Здесь можно найти качественную брендовую одежду по невероятно низким ценам. Идеальное место для покупки подарков и обновления гардероба.',
    rating: 4.3,
    priceLevel: 2,
    district: 'Чернгталай',
    workingHours: '10:00-21:00 ежедневно',
    amenities: [
      { icon: '📶', text: 'Wi-Fi', color: 'green' },
      { icon: '🅿️', text: 'Парковка', color: 'blue' },
      { icon: '🍽️', text: 'Фуд-корт', color: 'orange' },
      { icon: '🏧', text: 'Банкомат', color: 'red' }
    ],
    sections: [
      {
        icon: '👔',
        title: 'Модные бренды',
        description: 'Скидки до 70% на мировые бренды',
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        items: [
          { icon: '🏃‍♂️', text: 'Nike, Adidas, Puma, Under Armour', color: 'blue' },
          { icon: '👗', text: 'Zara, H&M, Mango, Forever 21', color: 'pink' },
          { icon: '👔', text: 'Hugo Boss, Calvin Klein, Tommy Hilfiger', color: 'gray' }
        ]
      },
      {
        icon: '👟',
        title: 'Обувь и аксессуары',
        description: 'Широкий выбор для любого стиля',
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        items: [
          { icon: '👠', text: 'Nike, Adidas, Converse, Vans', color: 'blue' },
          { icon: '👜', text: 'Michael Kors, Coach, Kate Spade', color: 'purple' }
        ]
      }
    ],
    mustSee: null,
    conclusion: 'Premium Outlet Phuket — это рай для шопоголиков! Здесь можно найти качественную брендовую одежду по невероятно низким ценам. Идеальное место для покупки подарков и обновления гардероба.'
  },
  {
    handle: 'big-c-supercenter-phuket',
    title: 'Big C Supercenter Phuket',
    russianTitle: 'Биг Си Суперцентр Пхукет',
    icon: '🏬',
    shortDescription: 'Один из крупнейших гипермаркетов на Пхукете',
    fullDescription: 'Big C Supercenter — это удобное место для всех видов покупок. Здесь можно найти все необходимое для дома, продукты, одежду и электронику по доступным ценам. Отличное место для местных жителей и туристов.',
    rating: 4.0,
    priceLevel: 1,
    district: 'Пхукет Таун',
    workingHours: '09:00-22:00 ежедневно',
    amenities: [
      { icon: '🅿️', text: 'Парковка', color: 'blue' },
      { icon: '🍽️', text: 'Фуд-корт', color: 'orange' },
      { icon: '🏧', text: 'Банкомат', color: 'red' }
    ],
    sections: [
      {
        icon: '🛒',
        title: 'Продукты питания',
        description: 'Свежие продукты и местные деликатесы',
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        items: [
          { icon: '🥬', text: 'Свежие овощи и фрукты', color: 'green' },
          { icon: '🥩', text: 'Мясо и морепродукты', color: 'red' },
          { icon: '🍞', text: 'Хлеб и выпечка', color: 'yellow' }
        ]
      },
      {
        icon: '👕',
        title: 'Одежда и обувь',
        description: 'Повседневная одежда по доступным ценам',
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        items: [
          { icon: '👔', text: 'Мужская и женская одежда', color: 'blue' },
          { icon: '👶', text: 'Детская одежда', color: 'pink' },
          { icon: '👟', text: 'Обувь для всей семьи', color: 'gray' }
        ]
      }
    ],
    mustSee: null,
    conclusion: 'Big C Supercenter — это удобное место для всех видов покупок. Здесь можно найти все необходимое для дома, продукты, одежду и электронику по доступным ценам. Отличное место для местных жителей и туристов.'
  },
  {
    handle: 'robinson-lifestyle-phuket',
    title: 'Robinson Lifestyle Phuket',
    russianTitle: 'Робинсон Лайфстайл Пхукет',
    icon: '🏢',
    shortDescription: 'Современный торговый центр с фокусом на образ жизни',
    fullDescription: 'Robinson Lifestyle Phuket — это современный торговый центр, который предлагает уникальный опыт шопинга и развлечений. Здесь можно найти все необходимое для современного образа жизни.',
    rating: 4.4,
    priceLevel: 2,
    district: 'Чернгталай',
    workingHours: '10:00-22:00 ежедневно',
    amenities: [
      { icon: '📶', text: 'Wi-Fi', color: 'green' },
      { icon: '🅿️', text: 'Парковка', color: 'blue' },
      { icon: '🍽️', text: 'Фуд-корт', color: 'orange' },
      { icon: '🎬', text: 'Кино', color: 'purple' },
      { icon: '🏧', text: 'Банкомат', color: 'red' }
    ],
    sections: [
      {
        icon: '👔',
        title: 'Модная одежда',
        description: 'Современные бренды и тренды',
        gradient: 'from-pink-50 to-pink-100',
        border: 'border-pink-200',
        items: [
          { icon: '👗', text: 'Женская мода', color: 'pink' },
          { icon: '👔', text: 'Мужская мода', color: 'blue' },
          { icon: '👶', text: 'Детская мода', color: 'yellow' }
        ]
      },
      {
        icon: '🏠',
        title: 'Дом и интерьер',
        description: 'Все для обустройства дома',
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        items: [
          { icon: '🛏️', text: 'Мебель и декор', color: 'brown' },
          { icon: '🍽️', text: 'Посуда и кухонные принадлежности', color: 'orange' },
          { icon: '🧽', text: 'Товары для дома', color: 'green' }
        ]
      }
    ],
    mustSee: {
      icon: '🎬',
      title: 'SF Cinema',
      description: 'Современный кинотеатр с комфортными залами'
    },
    conclusion: 'Robinson Lifestyle Phuket — это современный торговый центр, который предлагает уникальный опыт шопинга и развлечений. Здесь можно найти все необходимое для современного образа жизни.'
  },
  {
    handle: 'tesco-lotus-phuket',
    title: 'Tesco Lotus Phuket',
    russianTitle: 'Теско Лотус Пхукет',
    icon: '🛒',
    shortDescription: 'Популярный супермаркет с широким ассортиментом',
    fullDescription: 'Tesco Lotus Phuket — это популярный супермаркет, где можно найти все необходимое для повседневной жизни. От продуктов питания до бытовых товаров по доступным ценам.',
    rating: 4.1,
    priceLevel: 1,
    district: 'Пхукет Таун',
    workingHours: '08:00-22:00 ежедневно',
    amenities: [
      { icon: '🅿️', text: 'Парковка', color: 'blue' },
      { icon: '🍽️', text: 'Фуд-корт', color: 'orange' },
      { icon: '🏧', text: 'Банкомат', color: 'red' }
    ],
    sections: [
      {
        icon: '🥬',
        title: 'Продукты питания',
        description: 'Свежие продукты и готовые блюда',
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        items: [
          { icon: '🥬', text: 'Свежие овощи и фрукты', color: 'green' },
          { icon: '🥩', text: 'Мясо и рыба', color: 'red' },
          { icon: '🥛', text: 'Молочные продукты', color: 'blue' }
        ]
      },
      {
        icon: '🏠',
        title: 'Бытовые товары',
        description: 'Все для дома и семьи',
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        items: [
          { icon: '🧽', text: 'Товары для уборки', color: 'green' },
          { icon: '🧴', text: 'Косметика и гигиена', color: 'pink' },
          { icon: '👕', text: 'Одежда и обувь', color: 'purple' }
        ]
      }
    ],
    mustSee: null,
    conclusion: 'Tesco Lotus Phuket — это популярный супермаркет, где можно найти все необходимое для повседневной жизни. От продуктов питания до бытовых товаров по доступным ценам.'
  },
  {
    handle: 'patong-night-market',
    title: 'Patong Night Market',
    russianTitle: 'Ночной рынок Патонг',
    icon: '🌃',
    shortDescription: 'Знаменитый ночной рынок в центре Патонга',
    fullDescription: 'Patong Night Market — это знаменитый ночной рынок, где можно найти уникальные сувениры, местные деликатесы и развлечения. Идеальное место для вечерних прогулок и знакомства с местной культурой.',
    rating: 4.2,
    priceLevel: 1,
    district: 'Патонг',
    workingHours: '18:00-02:00 ежедневно',
    amenities: [
      { icon: '🍽️', text: 'Еда и напитки', color: 'orange' },
      { icon: '🎪', text: 'Развлечения', color: 'purple' },
      { icon: '🛍️', text: 'Сувениры', color: 'pink' }
    ],
    sections: [
      {
        icon: '🍜',
        title: 'Уличная еда',
        description: 'Местные деликатесы и уличная кухня',
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        items: [
          { icon: '🍢', text: 'Шашлыки и гриль', color: 'red' },
          { icon: '🍜', text: 'Тайские супы и лапша', color: 'green' },
          { icon: '🥤', text: 'Свежие соки и коктейли', color: 'blue' }
        ]
      },
      {
        icon: '🛍️',
        title: 'Сувениры и подарки',
        description: 'Уникальные сувениры и местные товары',
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        items: [
          { icon: '👕', text: 'Футболки и одежда', color: 'blue' },
          { icon: '🎨', text: 'Ручные поделки', color: 'yellow' },
          { icon: '💎', text: 'Украшения и аксессуары', color: 'pink' }
        ]
      }
    ],
    mustSee: {
      icon: '🎪',
      title: 'Уличные представления',
      description: 'Традиционные тайские танцы и музыкальные выступления'
    },
    conclusion: 'Patong Night Market — это знаменитый ночной рынок, где можно найти уникальные сувениры, местные деликатесы и развлечения. Идеальное место для вечерних прогулок и знакомства с местной культурой.'
  }
];

async function updateShoppingCenterDescription(place) {
  try {
    console.log(`\n🔄 Обновляем ${place.title}...`);
    
    const product = await getProductId(place.handle);
    if (!product) {
      console.log(`❌ Продукт ${place.handle} не найден`);
      return;
    }

    const descriptionHtml = generateCardStyleDescription(place);
    
    const mutation = `
      mutation {
        productUpdate(input: {
          id: "${product.id}",
          descriptionHtml: ${JSON.stringify(descriptionHtml)}
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
    
    if (result.data.productUpdate.userErrors.length > 0) {
      console.log(`❌ Ошибки при обновлении ${place.title}:`, result.data.productUpdate.userErrors);
    } else {
      console.log(`✅ ${place.title} успешно обновлен!`);
    }

    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1500));
    
  } catch (error) {
    console.log(`❌ Ошибка при обновлении ${place.title}:`, error.message);
  }
}

async function updateAllShoppingCenters() {
  console.log('🚀 Начинаем обновление всех торговых центров...');
  console.log(`📊 Всего торговых центров: ${shoppingCenters.length}`);
  
  for (let i = 0; i < shoppingCenters.length; i++) {
    const place = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${place.title}`);
    
    await updateShoppingCenterDescription(place);
  }
  
  console.log('\n🎉 Обновление завершено!');
  console.log('🔗 Проверьте результат: http://localhost:5173/category/shopping');
}

updateAllShoppingCenters();
