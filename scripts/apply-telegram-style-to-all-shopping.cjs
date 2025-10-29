const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

/**
 * 🎨 ГЕНЕРАТОР TELEGRAM WEBAPP STYLE ОПИСАНИЙ
 * 
 * Этот скрипт создаёт уникальное описание для каждого ТЦ
 * на основе шаблона Central Phuket
 */

// Данные для каждого торгового центра
const shoppingCenters = [
  {
    handle: 'central-phuket-floresta',
    heroGradient: 'from-blue-500 to-purple-600',
    heroIcon: '🏢',
    title: 'Central Phuket (Централ Пхукет)',
    subtitle: 'Крупнейший торговый центр на острове',
    rating: '4.6',
    priceLevel: '$$$',
    district: 'Чернгталай',
    workingHours: '10:00-22:00 ежедневно',
    parking: 'Бесплатная (3000+ мест)',
    description: 'Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.',
    features: [
      {
        gradient: 'from-orange-50 to-orange-100',
        border: 'orange-200',
        icon: '🛍️',
        title: 'Central Festival',
        subtitle: 'Масс-маркет бренды',
        items: [
          { icon: '👔', text: 'Zara, H&M, Uniqlo, Nike' },
          { icon: '🍽️', text: '2 фуд-корта + рестораны' },
          { icon: '🎬', text: 'Кинотеатр Major Cineplex' }
        ]
      },
      {
        gradient: 'from-purple-50 to-purple-100',
        border: 'purple-200',
        icon: '💎',
        title: 'Central Floresta',
        subtitle: 'Люксовые бутики',
        items: [
          { icon: '👑', text: 'Louis Vuitton, Prada, Gucci' },
          { icon: '👶', text: 'Детский мир' },
          { icon: '🐠', text: 'Аквариум Aquaria' }
        ]
      }
    ],
    mustSee: {
      icon: '🐠',
      title: 'Aquaria Phuket',
      description: 'Крупнейший океанариум на острове — более 25,000 морских обитателей'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '🎬 Кино', '🐠 Аквариум', '🏧 Банкомат'],
    finalCta: 'Central Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.'
  },
  {
    handle: 'jungceylon-shopping-center',
    heroGradient: 'from-orange-500 to-red-600',
    heroIcon: '🏖️',
    title: 'Jungceylon (Джангцелон)',
    subtitle: 'ТРЦ в сердце Патонга',
    rating: '4.4',
    priceLevel: '$$',
    district: 'Патонг',
    workingHours: '11:00-23:00 ежедневно',
    parking: 'Бесплатная',
    description: 'Крупнейший торговый центр Патонга с 200+ магазинами, ресторанами, боулингом и кинотеатром. В 5 минутах ходьбы от пляжа.',
    features: [
      {
        gradient: 'from-blue-50 to-blue-100',
        border: 'blue-200',
        icon: '🛍️',
        title: 'Шопинг',
        subtitle: 'Брендовая одежда',
        items: [
          { icon: '👔', text: 'H&M, Levi\'s, Adidas, Nike' },
          { icon: '💻', text: 'Power Buy - электроника' },
          { icon: '🎁', text: 'Сувениры и украшения' }
        ]
      },
      {
        gradient: 'from-pink-50 to-pink-100',
        border: 'pink-200',
        icon: '🎪',
        title: 'Развлечения',
        subtitle: 'Для всей семьи',
        items: [
          { icon: '🎳', text: 'SF Strike Bowl - боулинг' },
          { icon: '🎬', text: 'SF Cinema - кинотеатр' },
          { icon: '🍽️', text: 'Фуд-корт (30+ заведений)' }
        ]
      }
    ],
    mustSee: {
      icon: '🎳',
      title: 'SF Strike Bowl',
      description: 'Современный боулинг с 20+ дорожками — весело для компании и семьи'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '🎬 Кино', '🎳 Боулинг', '🏧 Банкомат'],
    finalCta: 'Jungceylon — идеальное место для шопинга и развлечений в Патонге. Удобное расположение рядом с пляжем и отелями делает его must-visit местом для туристов.'
  },
  {
    handle: 'premium-outlet-phuket',
    heroGradient: 'from-red-500 to-pink-600',
    heroIcon: '💰',
    title: 'Premium Outlet Phuket',
    subtitle: 'Скидки до 70%',
    rating: '4.5',
    priceLevel: '$',
    district: 'Тхаланг',
    workingHours: '10:00-21:00 ежедневно',
    parking: 'Бесплатная',
    description: 'Крупнейший аутлет-центр Пхукета с брендовой одеждой и обувью по сниженным ценам. Nike, Adidas, Levi\'s, Crocs и другие марки со скидками круглый год.',
    features: [
      {
        gradient: 'from-blue-50 to-blue-100',
        border: 'blue-200',
        icon: '👟',
        title: 'Спортивные бренды',
        subtitle: 'Скидки до 50%',
        items: [
          { icon: '✔️', text: 'Nike Factory Store' },
          { icon: '✔️', text: 'Adidas Outlet' },
          { icon: '✔️', text: 'Puma, Reebok' }
        ]
      },
      {
        gradient: 'from-purple-50 to-purple-100',
        border: 'purple-200',
        icon: '👔',
        title: 'Модная одежда',
        subtitle: 'Дисконт цены',
        items: [
          { icon: '✔️', text: 'Levi\'s Store' },
          { icon: '✔️', text: 'Lee, Wrangler' },
          { icon: '✔️', text: 'Crocs Outlet' }
        ]
      }
    ],
    mustSee: {
      icon: '👟',
      title: 'Nike Factory Store',
      description: 'Последние коллекции кроссовок и одежды со скидками до 50% — лучшие цены на острове!'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '❄️ Кондиционеры', '🛒 Тележки', '🏧 Банкомат'],
    finalCta: 'Premium Outlet — лучшее место для шопинга с выгодой! Сэкономьте до 70% на брендовой одежде и обуви. Отличный выбор для тех, кто ценит качество и разумные цены.'
  },
  {
    handle: 'big-c-supercenter-phuket',
    heroGradient: 'from-green-500 to-emerald-600',
    heroIcon: '🛒',
    title: 'Big C Supercenter',
    subtitle: 'Гипермаркет для всей семьи',
    rating: '4.3',
    priceLevel: '$',
    district: 'Чалонг',
    workingHours: '08:00-22:00 ежедневно',
    parking: 'Бесплатная',
    description: 'Крупная сеть гипермаркетов Таиланда. Здесь вы найдете всё: от продуктов питания до электроники и одежды. Низкие цены и большой выбор товаров.',
    features: [
      {
        gradient: 'from-orange-50 to-orange-100',
        border: 'orange-200',
        icon: '🥘',
        title: 'Продукты питания',
        subtitle: 'Свежие и качественные',
        items: [
          { icon: '🍎', text: 'Фрукты, овощи, мясо, рыба' },
          { icon: '🍜', text: 'Тайские деликатесы и специи' },
          { icon: '🍞', text: 'Свежая выпечка' }
        ]
      },
      {
        gradient: 'from-blue-50 to-blue-100',
        border: 'blue-200',
        icon: '🏠',
        title: 'Товары для дома',
        subtitle: 'Всё необходимое',
        items: [
          { icon: '💻', text: 'Электроника и бытовая техника' },
          { icon: '👕', text: 'Одежда для всей семьи' },
          { icon: '🎁', text: 'Товары для дома и декор' }
        ]
      }
    ],
    mustSee: {
      icon: '🍽️',
      title: 'Фуд-корт',
      description: 'Тайская кухня по низким ценам — попробуйте настоящий Pad Thai всего за ฿ 60!'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '🏧 Банкомат', '❄️ Кондиционеры', '🛒 Тележки'],
    finalCta: 'Big C Supercenter — идеальное место для покупки продуктов и товаров повседневного спроса. Низкие цены, большой выбор и удобное расположение делают его популярным среди местных жителей и туристов.'
  },
  {
    handle: 'robinson-lifestyle-phuket',
    heroGradient: 'from-teal-500 to-cyan-600',
    heroIcon: '🌴',
    title: 'Robinson Lifestyle',
    subtitle: 'Современный ТРЦ на Кароне',
    rating: '4.4',
    priceLevel: '$$',
    district: 'Карон',
    workingHours: '10:00-22:00 ежедневно',
    parking: 'Бесплатная',
    description: 'Современный торговый центр на пляже Карон с магазинами, ресторанами, кинотеатром и супермаркетом. Идеальное место для семейного шопинга и отдыха.',
    features: [
      {
        gradient: 'from-blue-50 to-blue-100',
        border: 'blue-200',
        icon: '🛍️',
        title: 'Шопинг и развлечения',
        subtitle: 'Для всей семьи',
        items: [
          { icon: '👔', text: 'Модная одежда и обувь' },
          { icon: '🎬', text: 'Major Cineplex - кинотеатр' },
          { icon: '🍽️', text: 'Рестораны (20+ заведений)' }
        ]
      },
      {
        gradient: 'from-green-50 to-green-100',
        border: 'green-200',
        icon: '🛒',
        title: 'Супермаркет и услуги',
        subtitle: 'Всё под рукой',
        items: [
          { icon: '🏪', text: 'Tops Supermarket' },
          { icon: '💰', text: 'Банковские услуги' },
          { icon: '💊', text: 'Boots, Watsons - аптеки' }
        ]
      }
    ],
    mustSee: {
      icon: '🏪',
      title: 'Tops Supermarket',
      description: 'Премиум супермаркет с широким ассортиментом импортных продуктов и деликатесов'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Рестораны', '🎬 Кино', '🏪 Супермаркет', '🏧 Банкомат'],
    finalCta: 'Robinson Lifestyle — современный торговый центр с отличным расположением на пляже Карон. Удобно для туристов, живущих на юге острова. Всё что нужно в одном месте!'
  },
  {
    handle: 'tesco-lotus-phuket',
    heroGradient: 'from-indigo-500 to-purple-600',
    heroIcon: '🛒',
    title: 'Tesco Lotus',
    subtitle: 'Популярный гипермаркет',
    rating: '4.2',
    priceLevel: '$',
    district: 'Чалонг',
    workingHours: '08:00-23:00 ежедневно',
    parking: 'Бесплатная',
    description: 'Крупная сеть гипермаркетов с широким ассортиментом товаров. Продукты, одежда, электроника, товары для дома — всё по доступным ценам.',
    features: [
      {
        gradient: 'from-orange-50 to-orange-100',
        border: 'orange-200',
        icon: '🥘',
        title: 'Продукты и деликатесы',
        subtitle: 'Качество и выбор',
        items: [
          { icon: '🍎', text: 'Овощи, фрукты, мясо, рыба' },
          { icon: '🌍', text: 'Импортные товары для экспатов' },
          { icon: '🍜', text: 'Готовая еда и фуд-корт' }
        ]
      },
      {
        gradient: 'from-blue-50 to-blue-100',
        border: 'blue-200',
        icon: '🏪',
        title: 'Товары для дома',
        subtitle: 'Всё необходимое',
        items: [
          { icon: '💻', text: 'Гаджеты и бытовая техника' },
          { icon: '👕', text: 'Одежда и обувь' },
          { icon: '🏠', text: 'Мебель, посуда, декор' }
        ]
      }
    ],
    mustSee: {
      icon: '🌍',
      title: 'Секция импортных товаров',
      description: 'Европейские и американские продукты — идеально для экспатов и тех, кто скучает по дому'
    },
    amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '🏧 Банкомат', '❄️ Кондиционеры', '🛒 Тележки'],
    finalCta: 'Tesco Lotus — надежный гипермаркет с качественными товарами и доступными ценами. Популярен среди экспатов благодаря большому выбору импортных продуктов.'
  },
  {
    handle: 'patong-night-market',
    heroGradient: 'from-purple-500 to-pink-600',
    heroIcon: '🌙',
    title: 'Patong Night Market',
    subtitle: 'Ночной рынок Патонга',
    rating: '4.3',
    priceLevel: '$',
    district: 'Патонг',
    workingHours: '18:00-01:00 ежедневно',
    parking: 'Платная (₿ 50/час)',
    description: 'Оживленный ночной рынок в центре Патонга с уличной едой, сувенирами, одеждой и местными товарами. Атмосфера настоящего Таиланда!',
    features: [
      {
        gradient: 'from-orange-50 to-orange-100',
        border: 'orange-200',
        icon: '🍜',
        title: 'Уличная еда',
        subtitle: 'Тайская кухня',
        items: [
          { icon: '🍢', text: 'Пад тай, сом там, морепродукты' },
          { icon: '🍹', text: 'Свежевыжатые соки, тайский чай' },
          { icon: '🍰', text: 'Манговый рис, ротти, мороженое' }
        ]
      },
      {
        gradient: 'from-pink-50 to-pink-100',
        border: 'pink-200',
        icon: '🎁',
        title: 'Шопинг',
        subtitle: 'Сувениры и одежда',
        items: [
          { icon: '👕', text: 'Футболки, платья, пляжная одежда' },
          { icon: '🎨', text: 'Магниты, статуэтки, украшения' },
          { icon: '👜', text: 'Сумки, часы, солнечные очки' }
        ]
      }
    ],
    mustSee: {
      icon: '🍢',
      title: 'Уличная еда',
      description: 'Попробуйте настоящий тайский Pad Thai за ฿ 60 — лучше, чем в ресторанах!'
    },
    amenities: ['🌙 Работает ночью', '🍜 Уличная еда', '🎁 Сувениры', '👕 Одежда', '💰 Торгуйтесь!', '📸 Фото'],
    finalCta: 'Patong Night Market — колоритный ночной рынок с атмосферой настоящего Таиланда. Отличное место для покупки сувениров, уличной еды и вечерних прогулок. Торгуйтесь и получайте удовольствие!'
  }
];

// Функция генерации HTML описания
function generateTelegramStyleHTML(center) {
  const amenitiesHTML = center.amenities.map(amenity => {
    const [icon, text] = amenity.split(' ');
    const colors = ['green-500', 'blue-500', 'orange-500', 'purple-500', 'cyan-500', 'red-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-${color}">${icon}</span>
        <span class="text-sm text-gray-700">${text}</span>
      </div>`;
  }).join('');

  const featuresHTML = center.features.map(feature => `
    <div class="bg-gradient-to-br ${feature.gradient} rounded-xl p-5 border border-${feature.border}">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">${feature.icon}</span>
        <h3 class="text-lg font-bold text-gray-900">${feature.title}</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">${feature.subtitle}</p>
      <div class="space-y-2">
        ${feature.items.map(item => `
        <div class="flex items-center gap-2">
          <span class="text-blue-500">${item.icon}</span>
          <span class="text-sm text-gray-700">${item.text}</span>
        </div>`).join('')}
      </div>
    </div>`).join('');

  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r ${center.heroGradient} rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">${center.heroIcon} ${center.title}</h1>
    <p class="text-blue-100 text-lg">${center.subtitle}</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${center.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>${center.priceLevel}</span>
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
      <p class="text-gray-600 text-sm">${center.parking}</p>
    </div>
  </div>

  <!-- Main Description -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О месте</h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      ${center.description}
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    ${featuresHTML}
  </div>

  <!-- Must-See Highlight -->
  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⭐</span>
      <h3 class="text-lg font-bold">Обязательно посетите!</h3>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">${center.mustSee.icon}</span>
        <div>
          <p class="font-semibold">${center.mustSee.title}</p>
          <p class="text-yellow-100 text-sm">${center.mustSee.description}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Amenities -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${amenitiesHTML}
    </div>
  </div>

  <!-- Action Buttons - Telegram WebApp Style -->
  <!-- ❌ CTA Block УДАЛЁН - теперь используется отдельный React компонент
       ✅ PlaceDetail.tsx рендерит блок "Наши сервисы" с премиум Lucide React иконками
       ✅ Никаких дешёвых эмодзи в HTML! -->

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic">
      ${center.finalCta}
    </p>
  </div>
</div>
`;
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
          resolve(JSON.parse(responseData));
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

async function updateShoppingCenter(center, index, total) {
  try {
    console.log(`\n📝 [${index + 1}/${total}] ${center.title}`);
    
    const productId = await getProductId(center.handle);
    if (!productId) {
      console.error('❌ Продукт не найден');
      return false;
    }
    
    console.log(`✅ ID: ${productId}`);
    
    const html = generateTelegramStyleHTML(center);
    
    const mutation = `
      mutation {
        productUpdate(input: {
          id: "${productId}",
          descriptionHtml: "${html.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        }) {
          product { id title }
          userErrors { field message }
        }
      }
    `;
    
    const result = await makeGraphQLRequest(mutation);
    
    if (result.data?.productUpdate?.userErrors?.length > 0) {
      console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
      return false;
    }
    
    console.log('✅ Описание обновлено!');
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
    
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 ПРИМЕНЕНИЕ TELEGRAM WEBAPP STYLE КО ВСЕМ ТЦ');
  console.log('='.repeat(60));
  
  let successCount = 0;
  
  for (let i = 0; i < shoppingCenters.length; i++) {
    const success = await updateShoppingCenter(shoppingCenters[i], i, shoppingCenters.length);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успешно обновлено: ${successCount}/${shoppingCenters.length}`);
  console.log('🔗 Проверьте: http://localhost:8080/category/shopping');
}

main().catch(console.error);
