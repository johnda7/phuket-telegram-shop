const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Премиум описания для всех торговых центров по шаблону Central Festival
const shoppingCentersData = {
  'central-phuket-floresta': {
    title: 'Central Phuket (Централ Пхукет)',
    descriptionHtml: `<h1>🏢 Central Phuket (Централ Пхукет) — Крупнейший ТРЦ Пхукета</h1>
<p>Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>

<p><strong>🎯 Хотите посетить Central Phuket?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
<h3>👔 Масс-маркет бренды</h3>
<p>Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>

<h3>🍽️ Еда и напитки</h3>
<p>2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>

<h3>🎬 Развлечения</h3>
<p>Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми</p>

<h2>💎 CENTRAL FLORESTA — Люкс</h2>
<h3>👑 Люксовые бутики</h3>
<p>Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</h3>

<h3>👶 Детский мир</h3>
<p>Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>

<h3>🏠 Дом и декор</h3>
<p>Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>

<h2>🎯 Планируете поездку в Central Phuket?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Central Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</em></p>`
  },
  'jungceylon-shopping-center': {
    title: 'Jungceylon Shopping Center (Джангцелон)',
    descriptionHtml: `<h1>🛍️ Jungceylon Shopping Center (Джангцелон) — Сердце Патонга</h1>
<p>Крупнейший торговый центр в самом центре Патонга, всего в 5 минутах от пляжа. Современный дизайн, кондиционеры, множество магазинов и развлечений для всей семьи.</p>

<p><strong>🎯 Хотите посетить Jungceylon?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>🛒 Магазины и бутики</h2>
<h3>👔 Модная одежда</h3>
<p>H&M, Zara, Uniqlo, Adidas, Nike — все популярные бренды в одном месте</p>

<h3>💄 Косметика и парфюмерия</h3>
<p>Sephora, Boots, Watsons — широкий выбор косметики и средств по уходу</p>

<h3>📱 Электроника</h3>
<p>Магазины техники, аксессуары для телефонов, фотоаппараты</p>

<h2>🍽️ Еда и напитки</h2>
<h3>🍜 Фуд-корт</h3>
<p>Тайская, китайская, японская, европейская кухня — на любой вкус</p>

<h3>☕ Кафе и рестораны</h3>
<p>Starbucks, McDonald's, местные кафе — от быстрого перекуса до изысканного ужина</p>

<h2>🎪 Развлечения</h2>
<h3>🎬 Кинотеатр</h3>
<p>Major Cineplex с современными залами и 3D фильмами</p>

<h3>🎳 Боулинг</h3>
<p>Развлекательный центр с боулингом и игровыми автоматами</p>

<h3>👶 Детские зоны</h3>
<p>Игровые площадки и развлечения для детей</p>

<h2>🎯 Планируете поездку в Jungceylon?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.</em></p>`
  },
  'premium-outlet-phuket': {
    title: 'Premium Outlet Phuket (Премиум Аутлет Пхукет)',
    descriptionHtml: `<h1>🏷️ Premium Outlet Phuket (Премиум Аутлет Пхукет) — Скидки до 70%</h1>
<p>Крупнейший аутлет-центр на Пхукете с огромными скидками на брендовую одежду, обувь и аксессуары. Более 200 магазинов известных мировых брендов по ценам со скидкой до 70%.</p>

<p><strong>🎯 Хотите посетить Premium Outlet?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>👔 Модные бренды</h2>
<h3>🏃‍♂️ Спортивная одежда</h3>
<p>Nike, Adidas, Puma, Under Armour — спортивная одежда и обувь со скидками до 50%</p>

<h3>👗 Женская мода</h3>
<p>Zara, H&M, Mango, Forever 21 — модная одежда для женщин</p>

<h3>👔 Мужская мода</h3>
<p>Hugo Boss, Calvin Klein, Tommy Hilfiger — стильная одежда для мужчин</p>

<h2>👟 Обувь и аксессуары</h2>
<h3>👠 Обувь</h3>
<p>Nike, Adidas, Converse, Vans — обувь всех стилей и размеров</p>

<h3>👜 Сумки и аксессуары</h3>
<p>Michael Kors, Coach, Kate Spade — сумки, кошельки и аксессуары</p>

<h2>🍽️ Еда и напитки</h2>
<h3>🍜 Фуд-корт</h3>
<p>Тайская, китайская, японская кухня — перекусите между покупками</p>

<h3>☕ Кафе</h3>
<p>Starbucks, местные кафе — отдохните за чашкой кофе</p>

<h2>🎯 Планируете поездку в Premium Outlet?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Premium Outlet Phuket — это рай для шопоголиков! Здесь можно найти качественную брендовую одежду по невероятно низким ценам. Идеальное место для покупки подарков и обновления гардероба.</em></p>`
  },
  'big-c-supercenter-phuket': {
    title: 'Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)',
    descriptionHtml: `<h1>🛒 Big C Supercenter Phuket (Биг Си Суперцентр Пхукет) — Всё для жизни</h1>
<p>Крупнейший гипермаркет на Пхукете с огромным ассортиментом товаров по доступным ценам. Здесь можно купить всё: от продуктов питания до одежды, электроники и товаров для дома.</p>

<p><strong>🎯 Хотите посетить Big C?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>🍎 Продукты питания</h2>
<h3>🥬 Свежие продукты</h3>
<p>Фрукты, овощи, мясо, рыба — свежие продукты местного производства</p>

<h3>🥫 Консервы и полуфабрикаты</h3>
<p>Тайские и международные консервы, замороженные продукты</p>

<h3>🍪 Сладости и снеки</h3>
<p>Тайские сладости, печенье, чипсы — для перекусов</p>

<h2>👕 Одежда и обувь</h2>
<h3>👔 Повседневная одежда</h3>
<p>Футболки, шорты, платья — недорогая одежда для повседневной носки</p>

<h3>👟 Обувь</h3>
<p>Сандалии, кроссовки, туфли — обувь для всех случаев</p>

<h2>🏠 Товары для дома</h2>
<h3>🧽 Бытовая химия</h3>
<p>Стиральные порошки, моющие средства, туалетная бумага</p>

<h3>🛏️ Постельное бельё</h3>
<p>Простыни, подушки, одеяла — всё для комфортного сна</p>

<h2>🎯 Планируете поездку в Big C?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">💱 Обменять валюту</a>
</div>

<p><em>Big C Supercenter — это место, где можно купить всё необходимое для жизни на Пхукете. От продуктов питания до товаров для дома — здесь есть всё по доступным ценам.</em></p>`
  },
  'tesco-lotus-phuket': {
    title: 'Tesco Lotus Phuket (Теско Лотус Пхукет)',
    descriptionHtml: `<h1>🛒 Tesco Lotus Phuket (Теско Лотус Пхукет) — Качество и доступность</h1>
<p>Популярный гипермаркет с широким ассортиментом товаров по доступным ценам. Качественные продукты, одежда, электроника и товары для дома от известных брендов.</p>

<p><strong>🎯 Хотите посетить Tesco Lotus?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>🍎 Продукты питания</h2>
<h3>🥬 Свежие продукты</h3>
<p>Фрукты, овощи, мясо, рыба — качественные продукты местного производства</p>

<h3>🥫 Импортные товары</h3>
<p>Европейские и американские продукты — для тех, кто скучает по дому</p>

<h3>🍪 Сладости и снеки</h3>
<p>Тайские и международные сладости, печенье, чипсы</p>

<h2>👕 Одежда и обувь</h2>
<h3>👔 Повседневная одежда</h3>
<p>Футболки, шорты, платья — стильная одежда по доступным ценам</p>

<h3>👟 Обувь</h3>
<p>Сандалии, кроссовки, туфли — обувь для всех случаев жизни</p>

<h2>🏠 Товары для дома</h2>
<h3>🧽 Бытовая химия</h3>
<p>Стиральные порошки, моющие средства, туалетная бумага</p>

<h3>🛏️ Постельное бельё</h3>
<p>Простыни, подушки, одеяла — всё для комфортного сна</p>

<h2>🎯 Планируете поездку в Tesco Lotus?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Tesco Lotus — это надёжный выбор для покупок на Пхукете. Здесь можно найти качественные товары по доступным ценам, а также импортные продукты для тех, кто скучает по дому.</em></p>`
  },
  'robinson-lifestyle-phuket': {
    title: 'Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)',
    descriptionHtml: `<h1>🛍️ Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет) — Стиль и комфорт</h1>
<p>Современный торговый центр с модной одеждой, косметикой и ресторанами. Идеальное место для шопинга и отдыха в комфортной атмосфере с кондиционерами.</p>

<p><strong>🎯 Хотите посетить Robinson Lifestyle?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>👗 Модная одежда</h2>
<h3>👔 Женская мода</h3>
<p>Платья, блузки, юбки, брюки — стильная одежда для женщин</p>

<h3>👔 Мужская мода</h3>
<p>Рубашки, футболки, шорты, брюки — модная одежда для мужчин</p>

<h3>👶 Детская одежда</h3>
<p>Одежда для детей всех возрастов — от младенцев до подростков</p>

<h2>💄 Косметика и парфюмерия</h2>
<h3>💄 Декоративная косметика</h3>
<p>Помады, тени, тональные кремы — косметика известных брендов</p>

<h3>🧴 Уход за кожей</h3>
<p>Кремы, лосьоны, маски — средства по уходу за кожей</p>

<h3>🌸 Парфюмерия</h3>
<p>Духи, туалетная вода — ароматы для мужчин и женщин</p>

<h2>🍽️ Еда и напитки</h2>
<h3>🍜 Фуд-корт</h3>
<p>Тайская, китайская, японская кухня — разнообразные блюда</p>

<h3>☕ Кафе</h3>
<p>Кофе, чай, десерты — отдохните за чашкой кофе</p>

<h2>🎯 Планируете поездку в Robinson Lifestyle?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Robinson Lifestyle — это место, где можно найти всё для стильной жизни. От модной одежды до косметики и ресторанов — здесь есть всё для современного человека.</em></p>`
  },
  'patong-night-market': {
    title: 'Patong Night Market (Ночной рынок Патонг)',
    descriptionHtml: `<h1>🌙 Patong Night Market (Ночной рынок Патонг) — Атмосфера настоящего Таиланда</h1>
<p>Один из самых популярных ночных рынков на Пхукете, расположенный в самом сердце Патонга. Здесь можно найти всё: от традиционных тайских сувениров до модной одежды и аксессуаров. Атмосфера настоящего Таиланда!</p>

<p><strong>🎯 Хотите посетить Patong Night Market?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<h2>🛍️ Сувениры и подарки</h2>
<h3>🎁 Тайские сувениры</h3>
<p>Статуэтки слонов, маски, резные изделия из дерева — традиционные тайские сувениры</p>

<h3>🧿 Украшения</h3>
<p>Серебряные украшения, бусы, браслеты — красивые аксессуары ручной работы</p>

<h3>👕 Одежда с принтами</h3>
<p>Футболки с тайскими принтами, шорты, платья — стильная одежда</p>

<h2>🍜 Еда и напитки</h2>
<h3>🍢 Уличная еда</h3>
<p>Шашлыки, жареные насекомые, фрукты — аутентичная тайская уличная еда</p>

<h3>🥤 Напитки</h3>
<p>Свежие соки, кокосы, тайский чай — освежающие напитки</p>

<h3>🍰 Десерты</h3>
<p>Тайские сладости, мороженое, фрукты — сладкие угощения</p>

<h2>🎪 Развлечения</h2>
<h3>💆‍♀️ Массаж</h3>
<p>Тайский массаж, массаж ног — расслабление после шопинга</p>

<h3>🎨 Татуировки</h3>
<p>Временные татуировки хной — красивые рисунки на теле</p>

<h3>📸 Фото</h3>
<p>Фото с экзотическими животными — памятные снимки</p>

<h2>🎯 Планируете поездку в Patong Night Market?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Patong Night Market — это сердце ночной жизни Патонга! Здесь можно почувствовать настоящий дух Таиланда, попробовать местную еду, купить сувениры и просто насладиться атмосферой.</em></p>`
  }
};

// ID торговых центров
const shoppingCenterIds = {
  'central-phuket-floresta': 'gid://shopify/Product/7972352950326',
  'jungceylon-shopping-center': 'gid://shopify/Product/7974403080246',
  'premium-outlet-phuket': 'gid://shopify/Product/7974403145782',
  'big-c-supercenter-phuket': 'gid://shopify/Product/7974403244086',
  'tesco-lotus-phuket': 'gid://shopify/Product/7974403604534',
  'robinson-lifestyle-phuket': 'gid://shopify/Product/7974403702838',
  'patong-night-market': 'gid://shopify/Product/7974403735606'
};

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
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
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function updateShoppingCenter(handle, data) {
  const productId = shoppingCenterIds[handle];
  
  if (!productId) {
    console.log(`❌ ID не найден для ${handle}`);
    return;
  }

  console.log(`\n🔄 Обновляем ${data.title}...`);
  console.log(`   Handle: ${handle}`);
  console.log(`   ID: ${productId}`);

  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: productId,
      title: data.title,
      descriptionHtml: data.descriptionHtml
    }
  };

  try {
    const response = await makeGraphQLRequest(mutation, variables);
    
    if (response.data.productUpdate.userErrors.length > 0) {
      console.error(`   ❌ Ошибки:`, response.data.productUpdate.userErrors);
    } else {
      console.log(`   ✅ Обновлено успешно!`);
    }
  } catch (error) {
    console.error(`   ❌ Ошибка:`, error.message);
  }
}

async function updateAllShoppingCenters() {
  console.log('🚀 ОБНОВЛЕНИЕ ВСЕХ ТОРГОВЫХ ЦЕНТРОВ С ПРЕМИУМ ОПИСАНИЯМИ');
  console.log('='.repeat(60));

  let successCount = 0;
  let errorCount = 0;

  for (const [handle, data] of Object.entries(shoppingCentersData)) {
    try {
      await updateShoppingCenter(handle, data);
      successCount++;
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Ошибка при обновлении ${handle}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно обновлено: ${successCount}/${Object.keys(shoppingCentersData).length}`);
  console.log(`❌ Ошибок: ${errorCount}/${Object.keys(shoppingCentersData).length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ВСЕ ТОРГОВЫЕ ЦЕНТРЫ ОБНОВЛЕНЫ!');
    console.log('🌐 Проверьте: https://johnda7.github.io/phuket-telegram-shop/category/shopping');
  }
}

updateAllShoppingCenters().catch(console.error);
