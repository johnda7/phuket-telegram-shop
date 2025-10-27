// Using native fetch (Node.js 18+)

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_API_TOKEN = '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';

async function shopifyAdminRequest(query, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function getProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  const data = await shopifyAdminRequest(query, { handle });
  return data.data.productByHandle;
}

async function updateProductDescription(productId, html) {
  const mutation = `
    mutation updateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: $descriptionHtml
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

  const variables = {
    id: productId,
    descriptionHtml: html
  };

  const data = await shopifyAdminRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }
  return data.data.productUpdate;
}

const PRODUCT_HANDLE = 'central-phuket-floresta';

const RUSSIAN_DESCRIPTION = `
<div class="font-sans text-gray-900 antialiased">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      🏢 Central Festival Phuket (Централ Фестиваль Пхукет) — Крупнейший ТРЦ Пхукета
    </h1>

    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Два крыла — Флореста и Фестиваль — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.
    </p>

    <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg mb-8">
      <p class="text-xl font-bold mb-3">🎯 Хотите посетить Централ Фестиваль?</p>
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
      🛍️ Central Festival — Масс-маркет
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-500">👔</span> Масс-маркет бренды
        </h3>
        <p class="text-gray-700">Зара, Х&М, Уникло, Найк, Эппл Стор, Сефора — все популярные бренды в одном месте</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-orange-500">🍽️</span> Еда и напитки
        </h3>
        <p class="text-gray-700">2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-purple-500">🎬</span> Развлечения
        </h3>
        <p class="text-gray-700">Кинотеатр Мейджор Синплекс, детские зоны — идеально для семей с детьми</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      💎 Central Floresta — Люкс
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-yellow-600">👑</span> Люксовые бутики
        </h3>
        <p class="text-gray-700">Луи Виттон, Прада, Гуччи, Баленсиага, Селин, Булгари, Тиффани энд Ко — эксклюзивные коллекции</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-pink-500">👶</span> Детский мир
        </h3>
        <p class="text-gray-700">Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">🏠</span> Дом и декор
        </h3>
        <p class="text-gray-700">Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-500">🛒</span> Продукты
        </h3>
        <p class="text-gray-700">Супермаркет Топс Маркет — свежие продукты и деликатесы</p>
      </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🎪 Развлечения и достопримечательности
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div class="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm font-semibold mb-3 inline-block">
          Обязательно к посещению!
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-400">🐠</span> Aquaria Phuket (Аквария Пхукет)
        </h3>
        <p class="text-gray-700">
          <strong>Крупнейший океанариум на острове</strong> — более 25,000 морских обитателей, туннель с акулами, интерактивные зоны
        </p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-red-500">🎭</span> Музей 3D-иллюзий
        </h3>
        <p class="text-gray-700">Музей 3D-оптических иллюзий — создайте невероятные фото для Инстаграм</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">🍽️</span> Su Va Na (Су Ва На)
        </h3>
        <p class="text-gray-700">Морской ресторан с видом на море — романтический ужин с панорамным видом</p>
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
        <span class="text-red-500 text-xl">🔌</span>
        <span>Портативные зарядные станции для телефонов</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-green-500 text-xl">💱</span>
        <span>Пункты обмена валют и банкоматы</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-yellow-600 text-xl">👑</span>
        <span>Эксклюзивный лаундж для ВИП-гостей</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-purple-500 text-xl">🚗</span>
        <span>Багги-сервис для перемещения между корпусами</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-orange-500 text-xl">💰</span>
        <span>Возврат НДС (Такс Фри) для туристов</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <span class="text-blue-500 text-xl">🅿️</span>
        <span>Большая бесплатная парковка на 3000+ мест</span>
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
        <p class="text-gray-700">74/5 Вичитсонграм Роуд, Вичит, Муанг Пхукет Дистрикт, Пхукет 83000</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-green-500">🏖️</span> Из Патонга
        </h3>
        <p class="text-gray-700">20 минут на машине или тук-туке (300-400 бат)</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-500">✈️</span> Из аэропорта
        </h3>
        <p class="text-gray-700">40 минут (600-800 бат на такси)</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🕐 Время работы
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <p class="text-gray-700">
          <strong>Ежедневно:</strong> 10:00 — 22:00
        </p>
        <p class="text-gray-700">
          <strong>Рестораны и кафе:</strong> работают до 23:00
        </p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🎯 Планируете поездку в Central Festival?
    </h2>
    <div class="flex flex-wrap gap-4 mb-4">
      <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
        🏝️ Забронировать тур с гидом
      </a>
      <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md">
        🚗 Арендовать авто
      </a>
      <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors shadow-md">
        💱 Обменять валюту
      </a>
    </div>

    <p class="text-gray-600 text-sm mb-6">
      💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей
    </p>

    <p class="text-gray-600 italic">
      Central Festival Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.
    </p>
  </div>
</div>
`;

async function main() {
  try {
    console.log('🔄 Получаем информацию о продукте...');
    const product = await getProductByHandle(PRODUCT_HANDLE);
    
    if (!product) {
      throw new Error(`Продукт с handle "${PRODUCT_HANDLE}" не найден`);
    }

    console.log(`✅ Найден продукт: ${product.title} (ID: ${product.id})`);

    console.log('🔄 Обновляем описание на русском языке...');
    await updateProductDescription(product.id, RUSSIAN_DESCRIPTION);

    console.log('✅ Описание успешно обновлено на русском языке!');
    console.log('🌐 Проверьте результат: http://localhost:8080/place/central-phuket-floresta');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main();
