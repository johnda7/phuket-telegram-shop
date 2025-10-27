// Обновляем описания всех торговых центров по образцу Central Phuket
// Создаем полные премиум описания с правильным форматированием

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// Торговые центры с полными описаниями
const shoppingCenters = [
  {
    name: 'Central Phuket',
    handle: 'central-phuket-floresta',
    productId: '7972352950326',
    description: `
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
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👔 Масс-маркет бренды</h3>
          <p class="text-gray-600">Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🍽️ Еда и напитки</h3>
          <p class="text-gray-600">2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🎬 Развлечения</h3>
          <p class="text-gray-600">Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💎 CENTRAL FLORESTA — Люкс</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👑 Люксовые бутики</h3>
          <p class="text-gray-600">Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👶 Детский мир</h3>
          <p class="text-gray-600">Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🏠 Дом и декор</h3>
          <p class="text-gray-600">Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>
        </div>
      </div>
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
    name: 'Jungceylon Shopping Center',
    handle: 'jungceylon-shopping-center',
    productId: '7974403080246',
    description: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏬 Jungceylon Shopping Center (Джангцелон) — Сердце Патонга</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Самый популярный торговый центр в Патонге, расположенный в самом сердце туристического района. Современный дизайн и широкий выбор магазинов делают его идеальным местом для шоппинга и развлечений.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Jungceylon?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ Основные магазины</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🏪 Супермаркет</h3>
          <p class="text-gray-600">Big C Supercenter — всё необходимое для дома и отдыха</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👔 Одежда и обувь</h3>
          <p class="text-gray-600">Nike, Adidas, Levi's, Robinson Department Store — модные бренды</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">💄 Косметика</h3>
          <p class="text-gray-600">Boots, Watsons — всё для красоты и здоровья</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🎪 Развлечения</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🎬 Кинотеатр</h3>
          <p class="text-gray-600">SF Cinema — новейшие фильмы на английском и тайском языках</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🎳 Боулинг</h3>
          <p class="text-gray-600">Bowling Center — развлечение для всей семьи</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👶 Детская зона</h3>
          <p class="text-gray-600">Игровая площадка — пока родители занимаются шоппингом</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Jungceylon?</h2>
    
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — вечером (18:00-21:00), когда включается подсветка и атмосфера становится особенно романтичной</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Jungceylon — это сердце Патонга, где шоппинг сочетается с развлечениями, а современность встречается с традициями Таиланда.</p>
</div>
    `
  },
  {
    name: 'Premium Outlet Phuket',
    handle: 'premium-outlet-phuket',
    productId: '7974403145782',
    description: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏪 Premium Outlet Phuket (Премиум Аутлет Пхукет) — Рай для скидок</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Это рай для любителей скидок, предлагающий широкий ассортимент брендовой одежды, обуви и аксессуаров со скидками до 70%. Идеальное место для экономного шоппинга без потери качества.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Premium Outlet?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">👔 Модные бренды</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👗 Женская одежда</h3>
          <p class="text-gray-600">Zara, H&M, Uniqlo, Forever 21 — стильная одежда со скидками</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👔 Мужская одежда</h3>
          <p class="text-gray-600">Nike, Adidas, Levi's, Tommy Hilfiger — качественная одежда</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👟 Обувь</h3>
          <p class="text-gray-600">Nike, Adidas, Converse, Vans — спортивная и повседневная обувь</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💎 Люксовые бренды</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👜 Сумки и аксессуары</h3>
          <p class="text-gray-600">Coach, Michael Kors, Kate Spade — дизайнерские аксессуары</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">⌚ Часы и украшения</h3>
          <p class="text-gray-600">Fossil, Swatch, Pandora — стильные аксессуары</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🏠 Дом и декор</h3>
          <p class="text-gray-600">IKEA, Zara Home — товары для дома</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Premium Outlet?</h2>
    
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00), когда меньше всего людей и больше выбор</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Premium Outlet Phuket — это место, где мечты о качественной брендовой одежде становятся реальностью по доступным ценам.</p>
</div>
    `
  },
  {
    name: 'Big C Supercenter Phuket',
    handle: 'big-c-supercenter-phuket',
    productId: '7974403244086',
    description: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🛒 Big C Supercenter Phuket (Биг Си Суперцентр Пхукет) — Гипермаркет для всех</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Один из крупнейших гипермаркетов на Пхукете, предлагающий широкий ассортимент продуктов, товаров для дома, электроники и одежды. Идеальное место для покупок на неделю вперед.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Big C Supercenter?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🍎 Продукты питания</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🥬 Свежие продукты</h3>
          <p class="text-gray-600">Овощи, фрукты, мясо, рыба — всё самое свежее каждый день</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🥛 Молочные продукты</h3>
          <p class="text-gray-600">Молоко, йогурты, сыры — качественные продукты местного производства</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🍞 Хлеб и выпечка</h3>
          <p class="text-gray-600">Свежий хлеб, пирожные, торты — для сладкоежек</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🏠 Товары для дома</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🧽 Бытовая химия</h3>
          <p class="text-gray-600">Стиральные порошки, моющие средства, туалетная бумага</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🍽️ Посуда и кухня</h3>
          <p class="text-gray-600">Тарелки, кастрюли, сковородки — всё для кухни</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">📱 Электроника</h3>
          <p class="text-gray-600">Телефоны, планшеты, бытовая техника — современные гаджеты</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Big C Supercenter?</h2>
    
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром (9:00-11:00), когда меньше всего людей и больше выбор свежих продуктов</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Big C Supercenter — это место, где можно купить всё необходимое для комфортной жизни на Пхукете по доступным ценам.</p>
</div>
    `
  },
  {
    name: 'Tesco Lotus Phuket',
    handle: 'tesco-lotus-phuket',
    productId: '7974403604534',
    description: `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏪 Tesco Lotus Phuket (Теско Лотус Пхукет) — Доступные покупки</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Популярная сеть супермаркетов с широким ассортиментом товаров по доступным ценам. Идеальное место для ежедневных покупок и знакомства с местными продуктами.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Tesco Lotus?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛒 Основные отделы</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🥬 Продукты питания</h3>
          <p class="text-gray-600">Свежие овощи, фрукты, мясо, рыба — качественные продукты</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🧴 Бытовая химия</h3>
          <p class="text-gray-600">Стиральные порошки, моющие средства, средства личной гигиены</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👕 Одежда</h3>
          <p class="text-gray-600">Повседневная одежда, обувь, аксессуары — стиль и комфорт</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💡 Особенности</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">💰 Доступные цены</h3>
          <p class="text-gray-600">Качественные товары по разумным ценам — экономьте на покупках</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🕐 Удобное время работы</h3>
          <p class="text-gray-600">Работает с раннего утра до позднего вечера — покупайте когда удобно</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🚗 Бесплатная парковка</h3>
          <p class="text-gray-600">Просторная парковка — приезжайте на машине</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Tesco Lotus?</h2>
    
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — вечером (18:00-20:00), когда меньше всего людей и больше выбор свежих продуктов</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Tesco Lotus — это место, где качество встречается с доступностью, а покупки становятся приятным занятием.</p>
</div>
    `
  }
];

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
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

async function updateShoppingCenterDescription(productId, description) {
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

  const variables = {
    id: `gid://shopify/Product/${productId}`,
    descriptionHtml: description
  };

  return await shopifyAdminRequest(mutation, variables);
}

async function updateAllShoppingDescriptions() {
  console.log('📝 ОБНОВЛЯЕМ ОПИСАНИЯ ВСЕХ ТОРГОВЫХ ЦЕНТРОВ\n');
  console.log(`📋 Обновляем ${shoppingCenters.length} торговых центров\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`🏢 [${i + 1}/${shoppingCenters.length}] ${center.name}`);
    console.log(`   ID: ${center.productId}`);
    console.log(`   Handle: ${center.handle}`);

    try {
      console.log('   📝 Обновляем описание...');
      const result = await updateShoppingCenterDescription(center.productId, center.description);
      
      if (result.data.productUpdate.userErrors.length > 0) {
        console.error('   ❌ Ошибки:', result.data.productUpdate.userErrors);
        errorCount++;
      } else {
        console.log('   ✅ Описание обновлено!');
        console.log(`   🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${center.productId}`);
        successCount++;
      }
    } catch (error) {
      console.error('   ❌ Ошибка:', error.message);
      errorCount++;
    }
    
    console.log(''); // Пустая строка для читаемости
    
    // Задержка между обновлениями
    if (i < shoppingCenters.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно обновлено: ${successCount}/${shoppingCenters.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${shoppingCenters.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ВСЕ ОПИСАНИЯ ОБНОВЛЕНЫ!');
    console.log('🌐 Проверь на сайте:');
    shoppingCenters.forEach(center => {
      console.log(`   ${center.name}: http://localhost:8080/place/${center.handle}`);
    });
  }
}

updateAllShoppingDescriptions().catch(console.error);
