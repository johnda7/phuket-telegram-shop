// Обновляем Robinson Lifestyle Phuket с премиум описанием и metafields
// Используем встроенный fetch

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

const PRODUCT_ID = 'gid://shopify/Product/7974403702838'; // Robinson Lifestyle Phuket

const PREMIUM_DESCRIPTION = `
<div class="font-sans text-gray-900 antialiased">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      🏬 Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет) — Современный ТРЦ у пляжа Карон
    </h1>

    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Современный торговый центр с видом на море, расположенный в самом сердце Карона. Идеальное сочетание шоппинга, развлечений и пляжного отдыха в одном месте.
    </p>

    <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg mb-8">
      <p class="text-xl font-bold mb-3">🎯 Хотите посетить Robinson Lifestyle?</p>
      <div class="flex flex-wrap gap-3">
        <a href="/phuket" class="bg-white text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md">
          🏝️ Забронируйте тур с гидом
        </a>
        <a href="/services/car-rental" class="bg-white text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md">
          🚗 Арендуйте авто
        </a>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🛍️ Магазины и бренды
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-500">👔</span> Одежда и аксессуары
        </h3>
        <p class="text-gray-700">Uniqlo, H&M, Zara, Adidas, Nike — популярные бренды для всей семьи</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-pink-500">💄</span> Косметика и парфюмерия
        </h3>
        <p class="text-gray-700">Sephora, Boots, Watsons — всё для красоты и здоровья</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">📱</span> Электроника
        </h3>
        <p class="text-gray-700">Apple, Samsung, Sony — новейшие гаджеты и аксессуары</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-orange-500">🏠</span> Дом и декор
        </h3>
        <p class="text-gray-700">Товары для дома, сувениры, подарки — привезите частичку Таиланда</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🍽️ Еда и напитки
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-red-500">🍜</span> Фуд-корт
        </h3>
        <p class="text-gray-700">Тайская кухня, фастфуд, международные блюда — на любой вкус и бюджет</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-purple-500">☕</span> Кафе и рестораны
        </h3>
        <p class="text-gray-700">Starbucks, McDonald's, местные кафе — от кофе до полноценного ужина</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-yellow-500">🛒</span> Супермаркет
        </h3>
        <p class="text-gray-700">Tops Market — свежие продукты, деликатесы, алкоголь</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🎪 Развлечения
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div class="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm font-semibold mb-3 inline-block">
          Обязательно к посещению!
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-400">🎬</span> Кинотеатр SF Cinema
        </h3>
        <p class="text-gray-700">
          <strong>Современный кинотеатр</strong> с новейшими фильмами на английском и тайском языках
        </p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">👶</span> Детская зона
        </h3>
        <p class="text-gray-700">Игровая площадка для детей — пока родители занимаются шоппингом</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      ✨ Удобства и сервисы
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-blue-500 text-xl">📶</span>
        <span>Бесплатный Вай-Фай по всей территории</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-green-500 text-xl">🅿️</span>
        <span>Бесплатная парковка</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-red-500 text-xl">💱</span>
        <span>Обмен валюты и банкоматы</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-purple-500 text-xl">❄️</span>
        <span>Кондиционеры во всех помещениях</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-yellow-500 text-xl">🏖️</span>
        <span>5 минут до пляжа Карон</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-orange-500 text-xl">🚗</span>
        <span>Тук-тук и такси прямо у входа</span>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      📍 Как добраться
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-500">🏢</span> Адрес
        </h3>
        <p class="text-gray-700">123/3 Patak Road, Karon, Mueang Phuket District, Phuket 83100</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">🏖️</span> Из Патонга
        </h3>
        <p class="text-gray-700">15 минут на машине или тук-туке (200-300 бат)</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-red-500">✈️</span> Из аэропорта
        </h3>
        <p class="text-gray-700">45 минут (800-1000 бат на такси)</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-purple-500">🚶</span> Пешком от пляжа
        </h3>
        <p class="text-gray-700">5 минут от пляжа Карон</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🕐 Время работы
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <p class="text-gray-700 mb-2">
          <strong>Ежедневно:</strong> 10:00 — 22:00
        </p>
        <p class="text-gray-700">
          <strong>Рестораны и кафе:</strong> работают до 23:00
        </p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🎯 Планируете поездку в Robinson Lifestyle?
    </h2>
    <div class="flex flex-wrap gap-4 mb-4">
      <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
        🏝️ Забронировать тур с гидом
      </a>
      <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md">
        🚗 Арендовать авто
      </a>
      <a href="/services/currency-exchange" class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
        💱 Обменять валюту
      </a>
    </div>

    <p class="text-gray-600 text-sm mb-6">
      💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей
    </p>

    <p class="text-gray-600 italic">
      Robinson Lifestyle Phuket — это идеальное место для сочетания шоппинга и пляжного отдыха. Современный дизайн, удобное расположение и широкий выбор магазинов делают его популярным среди туристов и местных жителей.
    </p>
  </div>
</div>
`;

const METAFIELDS = [
  { namespace: "custom", key: "coordinates", value: "7.8423,98.2981", type: "single_line_text_field" },
  { namespace: "custom", key: "rating", value: "4.3", type: "single_line_text_field" },
  { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" },
  { namespace: "custom", key: "district", value: "Karon", type: "single_line_text_field" },
  { namespace: "custom", key: "duration", value: "2-3 часа", type: "single_line_text_field" },
  { namespace: "custom", key: "best_time", value: "Утро/вечер", type: "single_line_text_field" },
  { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
  { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы,Обмен валюты,Пляж рядом", type: "single_line_text_field" },
  { namespace: "custom", key: "website", value: "https://www.robinson.co.th/", type: "single_line_text_field" }
];

const UPDATE_PRODUCT_MUTATION = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        descriptionHtml
        metafields(first: 10) {
          edges {
            node {
              key
              value
              namespace
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function updateRobinsonPremium() {
  try {
    console.log('🚀 Обновляем Robinson Lifestyle Phuket с премиум описанием...\n');
    
    const variables = {
      input: {
        id: PRODUCT_ID,
        descriptionHtml: PREMIUM_DESCRIPTION,
        metafields: METAFIELDS
      }
    };
    
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: UPDATE_PRODUCT_MUTATION, variables }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL ошибки:', result.errors);
      return;
    }
    
    if (result.data.productUpdate.userErrors.length > 0) {
      console.error('❌ Ошибки обновления продукта:', result.data.productUpdate.userErrors);
      return;
    }
    
    console.log('✅ === РЕЗУЛЬТАТЫ ОБНОВЛЕНИЯ ===');
    console.log('📝 Описание обновлено');
    console.log('🏷️ Metafields добавлены:');
    
    result.data.productUpdate.product.metafields.edges.forEach(edge => {
      const meta = edge.node;
      console.log(`   ${meta.namespace}.${meta.key}: ${meta.value}`);
    });
    
    console.log('\n🌐 Проверьте результат на сайте:');
    console.log('http://localhost:8080/place/robinson-lifestyle-phuket');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

updateRobinsonPremium();
