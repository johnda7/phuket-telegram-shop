const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// Данные для обновления описаний
const shoppingCenters = [
  {
    handle: 'central-phuket-floresta',
    title: 'Central Phuket (Централ Пхукет)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏢 Central Phuket (Централ Пхукет) — Крупнейший ТРЦ Пхукета</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Central Phuket?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">👔 Масс-маркет бренды</h3>
      <p class="text-gray-600">Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💎 CENTRAL FLORESTA — Люкс</h2>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">👑 Люксовые бутики</h3>
      <p class="text-gray-600">Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Central Phuket?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Central Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</p>
</div>
    `
  },
  {
    handle: 'jungceylon-shopping-center',
    title: 'Jungceylon Shopping Center (Джангцелон)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏬 Jungceylon Shopping Center (Джангцелон) — Главный ТЦ Патонга</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Самый популярный торговый центр на Патонге с широким выбором магазинов, ресторанов и развлечений. Расположен в самом сердце ночной жизни острова.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Jungceylon?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ Магазины и бренды</h2>
      <p class="text-gray-600">Масс-маркет бренды, сувениры, одежда, электроника — всё для туристов и местных жителей</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🍽️ Еда и напитки</h2>
      <p class="text-gray-600">Фуд-корт с тайской и международной кухней, рестораны, кафе — попробуйте местные деликатесы</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Jungceylon?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — вечером, когда включается подсветка и атмосфера становится особенно романтичной</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Jungceylon — это сердце Патонга, где шопинг сочетается с развлечениями, а туристы встречаются с местными жителями. Идеальное место для знакомства с жизнью Пхукета.</p>
</div>
    `
  },
  {
    handle: 'premium-outlet-phuket',
    title: 'Premium Outlet Phuket (Премиум Аутлет Пхукет)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏪 Premium Outlet Phuket (Премиум Аутлет Пхукет) — Скидки до 70%</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Крупный аутлет-центр с дисконтными магазинами известных брендов. Скидки до 70% на одежду, обувь, аксессуары и товары для дома.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Premium Outlet?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👔 Модные бренды</h2>
      <p class="text-gray-600">Nike, Adidas, Levi's, Calvin Klein, Tommy Hilfiger — качественная одежда со скидками</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👠 Обувь и аксессуары</h2>
      <p class="text-gray-600">Обувь, сумки, часы, украшения — всё для создания стильного образа</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Premium Outlet?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром в будние дни, когда меньше всего людей и больше выбор</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Premium Outlet Phuket — это рай для любителей шопинга, где можно найти качественные вещи известных брендов по доступным ценам.</p>
</div>
    `
  },
  {
    handle: 'big-c-supercenter-phuket',
    title: 'Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🛒 Big C Supercenter Phuket (Биг Си Суперцентр Пхукет) — Гипермаркет для всех</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Гипермаркет, где можно найти продукты, одежду, электронику и товары для дома по доступным ценам. Идеальное место для покупок на каждый день.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Big C?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🥘 Продукты и еда</h2>
      <p class="text-gray-600">Свежие продукты, готовые блюда, тайские деликатесы — всё для домашней кухни</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏠 Товары для дома</h2>
      <p class="text-gray-600">Бытовая техника, посуда, текстиль, товары для уборки — всё для комфортного дома</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Big C?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром в будние дни, когда меньше всего людей</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Big C Supercenter — это место, где можно купить всё необходимое для комфортной жизни на Пхукете по доступным ценам.</p>
</div>
    `
  },
  {
    handle: 'robinson-lifestyle-phuket',
    title: 'Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏢 Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет) — Современный ТЦ</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Современный торговый центр с магазинами, ресторанами, кинотеатром и зонами отдыха. Идеальное место для семейного отдыха и шопинга.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Robinson Lifestyle?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ Магазины и бренды</h2>
      <p class="text-gray-600">Модная одежда, обувь, аксессуары, косметика — всё для создания стильного образа</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🎬 Развлечения</h2>
      <p class="text-gray-600">Кинотеатр, детские зоны, рестораны — идеально для семейного отдыха</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Robinson Lifestyle?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — вечером, когда включается подсветка и атмосфера становится особенно уютной</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Robinson Lifestyle — это современный торговый центр, где шопинг сочетается с развлечениями, а качество обслуживания соответствует международным стандартам.</p>
</div>
    `
  },
  {
    handle: 'tesco-lotus-phuket',
    title: 'Tesco Lotus Phuket (Теско Лотус Пхукет)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🛒 Tesco Lotus Phuket (Теско Лотус Пхукет) — Гипермаркет для всех</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Еще один крупный гипермаркет, предлагающий широкий ассортимент товаров, от продуктов до бытовой техники. Удобное расположение и доступные цены.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Tesco Lotus?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🥘 Продукты и еда</h2>
      <p class="text-gray-600">Свежие продукты, готовые блюда, тайские деликатесы — всё для домашней кухни</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏠 Товары для дома</h2>
      <p class="text-gray-600">Бытовая техника, посуда, текстиль, товары для уборки — всё для комфортного дома</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Tesco Lotus?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром в будние дни, когда меньше всего людей</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Tesco Lotus — это надежный гипермаркет, где можно купить всё необходимое для комфортной жизни на Пхукете по доступным ценам.</p>
</div>
    `
  },
  {
    handle: 'patong-night-market',
    title: 'Patong Night Market (Ночной рынок Патонг)',
    descriptionHtml: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🌃 Patong Night Market (Ночной рынок Патонг) — Атмосфера ночного Пхукета</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Оживленный ночной рынок с уличной едой, сувенирами, одеждой и местными товарами. Идеальное место для знакомства с местной культурой и кухней.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Patong Night Market?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🍜 Уличная еда</h2>
      <p class="text-gray-600">Тайские деликатесы, морепродукты, фрукты, десерты — попробуйте настоящую местную кухню</p>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🎁 Сувениры и товары</h2>
      <p class="text-gray-600">Одежда, аксессуары, сувениры, местные товары — привезите частичку Пхукета домой</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Patong Night Market?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — вечером (18:00-23:00), когда рынок наиболее оживлен</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Patong Night Market — это сердце ночной жизни Пхукета, где туристы встречаются с местными жителями, а шопинг сочетается с гастрономическими открытиями.</p>
</div>
    `
  }
];

// Функция для выполнения GraphQL запросов
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

// Функция для получения продукта по handle
async function getProductByHandle(handle) {
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

// Функция для обновления описания продукта
async function updateProductDescription(productId, title, descriptionHtml) {
  const mutation = `
    mutation updateProduct($id: ID!, $title: String!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        title: $title,
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
    title: title,
    descriptionHtml: descriptionHtml
  };

  const data = await makeGraphQLRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }
  return data.data.productUpdate;
}

// Основная функция
async function main() {
  console.log('🚀 ОБНОВЛЕНИЕ ОПИСАНИЙ ВСЕХ ТОРГОВЫХ ЦЕНТРОВ');
  console.log('='.repeat(50));

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${center.title}`);
    
    try {
      // 1. Найти продукт
      console.log(`🔍 Ищем продукт: ${center.handle}`);
      const product = await getProductByHandle(center.handle);
      
      if (!product) {
        console.error(`❌ Продукт не найден: ${center.handle}`);
        errorCount++;
        continue;
      }
      
      console.log(`✅ Найден: ${product.title}`);
      console.log(`🆔 ID: ${product.id}`);
      
      // 2. Обновить описание
      console.log('🎨 Обновляем описание...');
      const updateResult = await updateProductDescription(
        product.id, 
        center.title, 
        center.descriptionHtml
      );
      
      console.log('✅ Описание обновлено!');
      successCount++;
      
      // Пауза между запросами
      if (i < shoppingCenters.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
    } catch (error) {
      console.error(`❌ Ошибка при обновлении ${center.title}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ:');
  console.log('='.repeat(50));
  console.log(`✅ Успешно обновлено: ${successCount}/${shoppingCenters.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${shoppingCenters.length}`);

  if (errorCount > 0) {
    console.log('\n⚠️ Некоторые торговые центры не удалось обновить');
  } else {
    console.log('\n🎉 ВСЕ ТОРГОВЫЕ ЦЕНТРЫ УСПЕШНО ОБНОВЛЕНЫ!');
  }
  
  console.log('\n🔗 Проверьте результат: http://localhost:8080/category/shopping');
}

main().catch(console.error);
