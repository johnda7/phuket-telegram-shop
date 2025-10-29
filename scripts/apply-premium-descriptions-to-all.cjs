const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
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

async function getProductIdByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;
  const result = await makeGraphQLRequest(query, { handle });
  return result.data?.productByHandle;
}

// Функция для генерации премиум описания по шаблону Central Phuket
function generatePremiumDescription(center) {
  const { title, description, sections } = center;
  const cleanTitle = title.split('(')[0].trim();
  
  return `
<div class="premium-description space-y-8">
  <!-- Hero Section -->
  <div class="hero-section text-center py-8">
    <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      ${title}
    </h1>
    <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
      ${description}
    </p>
  </div>

  <!-- CTA Banner -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl text-center">
    <p class="text-lg font-semibold">
      <strong>🎯 Хотите посетить ${cleanTitle}?</strong> 
      <a href="/phuket" class="text-yellow-300 hover:text-yellow-200 font-bold underline ml-2">Забронируйте тур с гидом</a> 
      или 
      <a href="/services/car-rental" class="text-yellow-300 hover:text-yellow-200 font-bold underline ml-2">арендуйте авто</a> 
      для самостоятельной поездки!
    </p>
  </div>

  <!-- Main Sections -->
  ${sections.map((section, idx) => `
  <section class="shopping-section">
    <h2 class="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-${idx % 2 === 0 ? 'blue' : 'yellow'}-500">
      ${section.icon} ${section.title}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${section.items.length > 3 ? '4' : '3'} gap-6">
      ${section.items.map(item => `
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-${idx % 2 === 0 ? 'blue' : 'yellow'}-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">${item.icon} ${item.title}</h3>
        <p class="text-gray-700">${item.description}</p>
      </div>
      `).join('')}
    </div>
  </section>
  `).join('')}

  <!-- Amenities Section -->
  <section class="amenities">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">✨ Удобства и сервисы</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">📶</span>
        <span class="text-gray-700">Бесплатный Wi-Fi по всей территории</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🅿️</span>
        <span class="text-gray-700">Бесплатная парковка для посетителей</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">💱</span>
        <span class="text-gray-700">Пункты обмена валют и банкоматы</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">❄️</span>
        <span class="text-gray-700">Кондиционеры во всех помещениях</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🍽️</span>
        <span class="text-gray-700">Фуд-корты и рестораны</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🚻</span>
        <span class="text-gray-700">Чистые туалеты и пеленальные комнаты</span>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в ${cleanTitle}?</h2>
    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <a href="/phuket" class="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200">
        🏝️ Забронировать тур с гидом
      </a>
      <a href="/services/car-rental" class="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-bold border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-colors duration-200">
        🚗 Арендовать авто
      </a>
      <a href="/services/currency-exchange" class="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-bold border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-colors duration-200">
        💱 Обменять валюту
      </a>
    </div>
    <p class="text-lg opacity-90">
      💡 <strong>Совет:</strong> Лучшее время для посещения — утром или вечером, когда меньше всего людей
    </p>
  </div>

  <!-- SEO Footer -->
  <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-green-500">
    <p class="text-lg text-gray-600 italic">
      <em>${cleanTitle} — это ${center.seoFooter || 'отличное место для шопинга, развлечений и отдыха на Пхукете. Идеальное место для семейного отдыха и покупок на любой бюджет.'}</em>
    </p>
  </div>
</div>
  `.trim();
}

const shoppingCenters = [
  {
    handle: 'central-phuket-floresta',
    title: '🏢 Central Phuket — Крупнейший ТРЦ Пхукета',
    description: 'Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.',
    sections: [
      {
        icon: '🛍️',
        title: 'CENTRAL FESTIVAL — Масс-маркет',
        items: [
          { icon: '👔', title: 'Масс-маркет бренды', description: 'Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте' },
          { icon: '🍽️', title: 'Еда и напитки', description: '2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни' },
          { icon: '🎬', title: 'Развлечения', description: 'Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми' }
        ]
      },
      {
        icon: '💎',
        title: 'CENTRAL FLORESTA — Люкс',
        items: [
          { icon: '👑', title: 'Люксовые бутики', description: 'Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari — эксклюзивные коллекции' },
          { icon: '👶', title: 'Детский мир', description: 'Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс' },
          { icon: '🏠', title: 'Дом и декор', description: 'Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой' },
          { icon: '🛒', title: 'Продукты', description: 'Супермаркет Tops Market — свежие продукты и деликатесы' }
        ]
      }
    ],
    seoFooter: 'не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.'
  },
  {
    handle: 'jungceylon-shopping-center',
    title: '🏖️ Jungceylon — ТРЦ в сердце Патонга',
    description: 'Крупнейший торговый центр Патонга с 200+ магазинами, ресторанами, боулингом и кинотеатром. В 5 минутах ходьбы от пляжа. Работает до 23:00.',
    sections: [
      {
        icon: '🛍️',
        title: 'Шопинг',
        items: [
          { icon: '👔', title: 'Брендовая одежда', description: 'H&M, Levi\'s, Adidas, Nike — популярные бренды по доступным ценам' },
          { icon: '💻', title: 'Электроника', description: 'Power Buy, IT City — гаджеты, фототехника, аксессуары' },
          { icon: '🎁', title: 'Сувениры', description: 'Тайские сувениры, украшения, местные товары' }
        ]
      },
      {
        icon: '🎪',
        title: 'Развлечения',
        items: [
          { icon: '🎳', title: 'SF Strike Bowl', description: 'Современный боулинг с 20+ дорожками — весело для компании' },
          { icon: '🎬', title: 'SF Cinema', description: 'Кинотеатр с новинками кино и комфортными залами' },
          { icon: '🍽️', title: 'Фуд-корт', description: 'Тайская, европейская, японская кухня — более 30 заведений' }
        ]
      }
    ],
    seoFooter: 'идеальное место для шопинга и развлечений в Патонге. Удобное расположение рядом с пляжем и отелями делает его must-visit местом для туристов.'
  },
  {
    handle: 'premium-outlet-phuket',
    title: '💰 Premium Outlet Phuket — Скидки до 70%',
    description: 'Крупнейший аутлет-центр Пхукета с брендовой одеждой и обувью по сниженным ценам. Nike, Adidas, Levi\'s, Crocs и другие марки со скидками круглый год.',
    sections: [
      {
        icon: '👟',
        title: 'Спортивные бренды',
        items: [
          { icon: '✔️', title: 'Nike Factory Store', description: 'Последние коллекции кроссовок и одежды со скидками до 50%' },
          { icon: '✔️', title: 'Adidas Outlet', description: 'Спортивная одежда и обувь для всей семьи' },
          { icon: '✔️', title: 'Puma, Reebok', description: 'Фитнес-одежда и аксессуары по сниженным ценам' }
        ]
      },
      {
        icon: '👔',
        title: 'Модная одежда',
        items: [
          { icon: '✔️', title: 'Levi\'s Store', description: 'Джинсы и casual одежда известного бренда' },
          { icon: '✔️', title: 'Lee, Wrangler', description: 'Американские джинсовые бренды с дисконтом' },
          { icon: '✔️', title: 'Crocs Outlet', description: 'Удобная обувь для всей семьи по низким ценам' }
        ]
      }
    ],
    seoFooter: 'лучшее место для шопинга с выгодой! Сэкономьте до 70% на брендовой одежде и обуви. Отличный выбор для тех, кто ценит качество и разумные цены.'
  },
  {
    handle: 'big-c-supercenter-phuket',
    title: '🛒 Big C — Гипермаркет для всех',
    description: 'Крупная сеть гипермаркетов Таиланда. Здесь вы найдете всё: от продуктов питания до электроники и одежды. Низкие цены и большой выбор товаров.',
    sections: [
      {
        icon: '🥘',
        title: 'Продукты питания',
        items: [
          { icon: '🍎', title: 'Свежие продукты', description: 'Фрукты, овощи, мясо, рыба — всё свежее и по низким ценам' },
          { icon: '🍜', title: 'Тайские деликатесы', description: 'Специи, соусы, готовые блюда — попробуйте настоящий вкус Таиланда' },
          { icon: '🍞', title: 'Выпечка', description: 'Свежий хлеб, торты, десерты — собственная пекарня' }
        ]
      },
      {
        icon: '🏠',
        title: 'Товары для дома',
        items: [
          { icon: '💻', title: 'Электроника', description: 'Телевизоры, холодильники, стиральные машины' },
          { icon: '👕', title: 'Одежда', description: 'Недорогая одежда для всей семьи' },
          { icon: '🎁', title: 'Товары для дома', description: 'Посуда, текстиль, декор по доступным ценам' }
        ]
      }
    ],
    seoFooter: 'идеальное место для покупки продуктов и товаров повседневного спроса. Низкие цены, большой выбор и удобное расположение делают его популярным среди местных жителей и туристов.'
  },
  {
    handle: 'robinson-lifestyle-phuket',
    title: '🌴 Robinson Lifestyle — Современный ТРЦ',
    description: 'Современный торговый центр на пляже Карон с магазинами, ресторанами, кинотеатром и супермаркетом. Идеальное место для семейного шопинга и отдыха.',
    sections: [
      {
        icon: '🛍️',
        title: 'Шопинг и развлечения',
        items: [
          { icon: '👔', title: 'Модная одежда', description: 'Местные и международные бренды одежды и обуви' },
          { icon: '🎬', title: 'Кинотеатр', description: 'Major Cineplex — новинки кино с комфортными залами' },
          { icon: '🍽️', title: 'Рестораны', description: 'Тайская, японская, итальянская кухня — более 20 заведений' }
        ]
      },
      {
        icon: '🛒',
        title: 'Супермаркет и услуги',
        items: [
          { icon: '🏪', title: 'Tops Supermarket', description: 'Полный ассортимент продуктов и товаров для дома' },
          { icon: '💰', title: 'Банковские услуги', description: 'Банкоматы, обмен валют, денежные переводы' },
          { icon: '💊', title: 'Аптеки', description: 'Boots и Watsons — косметика и лекарства' }
        ]
      }
    ],
    seoFooter: 'современный торговый центр с отличным расположением на пляже Карон. Удобно для туристов, живущих на юге острова. Всё что нужно в одном месте!'
  },
  {
    handle: 'tesco-lotus-phuket',
    title: '🛒 Tesco Lotus — Популярный гипермаркет',
    description: 'Крупная сеть гипермаркетов с широким ассортиментом товаров. Продукты, одежда, электроника, товары для дома — всё по доступным ценам.',
    sections: [
      {
        icon: '🥘',
        title: 'Продукты и деликатесы',
        items: [
          { icon: '🍎', title: 'Свежие продукты', description: 'Овощи, фрукты, мясо, рыба — высокое качество' },
          { icon: '🌍', title: 'Импортные товары', description: 'Европейские и американские продукты для экспатов' },
          { icon: '🍜', title: 'Готовая еда', description: 'Фуд-корт с тайской и международной кухней' }
        ]
      },
      {
        icon: '🏪',
        title: 'Товары для дома',
        items: [
          { icon: '💻', title: 'Электроника', description: 'Гаджеты, бытовая техника, компьютеры' },
          { icon: '👕', title: 'Одежда', description: 'Недорогая одежда и обувь для всей семьи' },
          { icon: '🏠', title: 'Домашние товары', description: 'Мебель, посуда, текстиль, декор' }
        ]
      }
    ],
    seoFooter: 'надежный гипермаркет с качественными товарами и доступными ценами. Популярен среди экспатов благодаря большому выбору импортных продуктов.'
  },
  {
    handle: 'patong-night-market',
    title: '🌙 Patong Night Market — Ночной рынок',
    description: 'Оживленный ночной рынок в центре Патонга с уличной едой, сувенирами, одеждой и местными товарами. Работает каждый вечер с 18:00 до 01:00.',
    sections: [
      {
        icon: '🍜',
        title: 'Уличная еда',
        items: [
          { icon: '🍢', title: 'Тайская кухня', description: 'Пад тай, сом там, жареные морепродукты — всё свежее и вкусное' },
          { icon: '🍹', title: 'Напитки', description: 'Свежевыжатые соки, тайский чай, молочные коктейли' },
          { icon: '🍰', title: 'Десерты', description: 'Манговый рис, ротти, мороженое ролл — попробуйте всё!' }
        ]
      },
      {
        icon: '🎁',
        title: 'Шопинг',
        items: [
          { icon: '👕', title: 'Одежда', description: 'Футболки, платья, пляжная одежда — торгуйтесь!' },
          { icon: '🎨', title: 'Сувениры', description: 'Магниты, статуэтки, украшения — на память о Таиланде' },
          { icon: '👜', title: 'Аксессуары', description: 'Сумки, часы, солнечные очки по низким ценам' }
        ]
      }
    ],
    seoFooter: 'колоритный ночной рынок с атмосферой настоящего Таиланда. Отличное место для покупки сувениров, уличной еды и вечерних прогулок. Торгуйтесь и получайте удовольствие!'
  }
];

async function main() {
  console.log('🏆 ПРИМЕНЕНИЕ ПРЕМИУМ ОПИСАНИЙ КО ВСЕМ ТЦ');
  console.log('='.repeat(60));

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${center.title}`);
    
    try {
      const product = await getProductIdByHandle(center.handle);
      if (!product) {
        console.error(`❌ Продукт не найден: ${center.handle}`);
        continue;
      }

      const descriptionHtml = generatePremiumDescription(center);

      const mutation = `
        mutation updateProduct($id: ID!, $descriptionHtml: String!) {
          productUpdate(input: {
            id: $id,
            descriptionHtml: $descriptionHtml
          }) {
            product {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const data = await makeGraphQLRequest(mutation, {
        id: product.id,
        descriptionHtml: descriptionHtml
      });

      if (data.data.productUpdate.userErrors.length > 0) {
        console.error('❌ User Errors:', data.data.productUpdate.userErrors);
      } else {
        console.log('✅ Премиум описание применено!');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 ВСЕ ПРЕМИУМ ОПИСАНИЯ ПРИМЕНЕНЫ!');
  console.log('🔗 Проверьте: http://localhost:8080/category/shopping');
}

main().catch(console.error);
