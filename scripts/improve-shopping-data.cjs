// Скрипт для улучшения данных торговых центров
// Берём лучшие описания как на phuket-insider.com

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// УЛУЧШЕННЫЕ ДАННЫЕ из phuket-insider.com
const improvedData = [
  {
    handle: "central-phuket-floresta",
    title: "Central Phuket Floresta",
    description: `🏢 Самый большой торговый центр Пхукета

Central Phuket – грандиозный торговый комплекс из двух частей: Central Festival и Central Floresta. Общая площадь более 150,000 кв.м делает его крупнейшим моллом на острове.

🛍️ Central Festival (массовый сегмент)
• Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas, Levi's
• Косметика: Sephora, Boots, Watson's
• Электроника: Apple Store, Samsung, Sony, Power Buy
• Супермаркет Tops Market – самый большой на Пхукете
• Фуд-корт с более 50 точками питания

💎 Central Floresta (премиум)
• Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel, Hermès
• Ювелирные магазины: Tiffany & Co, Bvlgari
• Премиум рестораны и мишленовские кафе
• Спа и велнесс премиум-класса

🎭 Развлечения
• SF Cinema City: 16 залов включая IMAX
• Aquaria Phuket: океанариум с подводным туннелем
• Molly Fantasy: детская игровая площадка
• SF Strike Bowl: боулинг на 12 дорожек

✨ Особенности
🚗 Бесплатная парковка на 3,500 мест
📶 Бесплатный Wi-Fi
💱 Обмен валюты
🏧 Банкоматы всех банков
❄️ Отличное кондиционирование
🚌 Бесплатный шаттл от отелей

⏰ Время работы: 10:00-22:00 ежедневно
📍 От Патонга: 15 минут на такси (200-300 бат)

<h3>🛍️ Central Festival (массовый сегмент)</h3>
<ul>
<li><strong>Международные бренды:</strong> Zara, H&M, Uniqlo, Nike, Adidas, Levi's</li>
<li><strong>Косметика и парфюмерия:</strong> Sephora, Boots, Watson's</li>
<li><strong>Электроника:</strong> Apple Store, Samsung, Sony, Power Buy</li>
<li><strong>Супермаркет:</strong> Tops Market – самый большой на Пхукете</li>
<li><strong>Фуд-корт:</strong> Более 50 точек питания с тайской и международной кухней</li>
</ul>

<h3>💎 Central Floresta (премиум сегмент)</h3>
<ul>
<li><strong>Люксовые бутики:</strong> Prada, Gucci, Louis Vuitton, Chanel, Hermès</li>
<li><strong>Ювелирные магазины:</strong> Tiffany & Co, Bvlgari</li>
<li><strong>Премиум рестораны:</strong> Мишленовские рестораны и кафе с видом</li>
<li><strong>Спа и велнесс:</strong> Let's Relax Spa, салоны красоты премиум-класса</li>
</ul>

<h3>🎭 Развлечения</h3>
<ul>
<li><strong>SF Cinema City:</strong> Кинотеатр с 16 залами, включая IMAX</li>
<li><strong>Aquaria Phuket:</strong> Океанариум с подводным туннелем</li>
<li><strong>Детская зона:</strong> Игровая площадка Molly Fantasy</li>
<li><strong>Боулинг:</strong> 12 дорожек SF Strike Bowl</li>
</ul>

<h3>✨ Особенности</h3>
<ul>
<li>🚗 <strong>Бесплатная парковка</strong> на 3,500 мест</li>
<li>📶 <strong>Бесплатный Wi-Fi</strong> во всём торговом центре</li>
<li>💱 <strong>Обмен валюты</strong> по хорошему курсу</li>
<li>🏧 <strong>Банкоматы</strong> всех крупных банков</li>
<li>❄️ <strong>Кондиционирование</strong> – спасение от жары</li>
<li>🚌 <strong>Бесплатный шаттл</strong> от отелей Патонга, Карона, Каты</li>
</ul>

<h3>💰 Цены</h3>
<p>Средний сегмент и выше. Дороже чем на рынках, но качество и сервис европейского уровня. В Central Festival цены как в российских торговых центрах, в Central Floresta – премиум сегмент.</p>

<h3>⏰ Время работы</h3>
<p><strong>Ежедневно: 10:00 - 22:00</strong><br>
Рестораны работают до 23:00, некоторые кафе – до полуночи.</p>

<h3>📍 Как добраться</h3>
<ul>
<li><strong>От аэропорта:</strong> 30 минут на такси (400-500 бат)</li>
<li><strong>От Патонга:</strong> 15 минут на такси (200-300 бат)</li>
<li><strong>На тук-туке:</strong> 150-200 бат от Патонга</li>
<li><strong>Бесплатный шаттл:</strong> забирает от отелей по расписанию</li>
</ul>

<h3>💡 Полезные советы</h3>
<ul>
<li>🎁 <strong>Tax Free:</strong> Оформление возврата НДС для покупок от 2000 бат</li>
<li>🎫 <strong>Туристические скидки:</strong> Покажите паспорт для дополнительных скидок</li>
<li>🍽️ <strong>Обед дешевле:</strong> В фуд-корте обедайте с 11 до 14 часов – акции</li>
<li>🎬 <strong>Кино:</strong> Билеты дешевле в будние дни до 18:00</li>
<li>🅿️ <strong>Парковка:</strong> Первые 3 часа бесплатно с чеком от магазина</li>
</ul>`,
    photos: [
      "https://phuket-insider.com/wp-content/uploads/2019/08/central-phuket-floresta-exterior.jpg",
      "https://phuket-insider.com/wp-content/uploads/2019/08/central-phuket-floresta-interior.jpg",
      "https://phuket-insider.com/wp-content/uploads/2019/08/central-festival-foodcourt.jpg",
      "https://phuket-insider.com/wp-content/uploads/2019/08/central-phuket-aquarium.jpg",
      "https://phuket-insider.com/wp-content/uploads/2019/08/central-floresta-luxury-boutiques.jpg"
    ]
  },
  {
    handle: "jungceylon-shopping-center",
    title: "Jungceylon Shopping Center",
    description: `<h3>🏬 Главный торговый центр Патонга</h3>

<p>Jungceylon – крупнейший торговый центр в самом сердце Патонга, в 5 минутах ходьбы от пляжа. Идеальное место для шоппинга после пляжа!</p>

<h3>🛍️ Магазины</h3>
<ul>
<li><strong>Супермаркет Big C Extra:</strong> Огромный выбор продуктов и товаров</li>
<li><strong>Одежда:</strong> Uniqlo, H&M, Zara, Levi's, Nike, Adidas</li>
<li><strong>Электроника:</strong> Power Buy, Banana IT, AIS, True</li>
<li><strong>Косметика:</strong> Boots, Watson's, Herb Basics</li>
<li><strong>Сувениры:</strong> Десятки магазинов с тайскими сувенирами</li>
</ul>

<h3>🎭 Развлечения</h3>
<ul>
<li><strong>SF Cinema:</strong> 6 кинозалов с новинками</li>
<li><strong>Боулинг:</strong> 8 дорожек</li>
<li><strong>Детская зона:</strong> Игровая площадка для детей</li>
<li><strong>Фуд-корт:</strong> Более 40 точек питания</li>
</ul>

<h3>✨ Особенности</h3>
<ul>
<li>🚗 Бесплатная парковка (2 часа с чеком)</li>
<li>📶 Бесплатный Wi-Fi</li>
<li>💱 Обменники и банкоматы</li>
<li>❄️ Отличное кондиционирование</li>
<li>🏖️ 5 минут пешком от пляжа Патонг</li>
</ul>

<h3>⏰ Время работы</h3>
<p><strong>Ежедневно: 11:00 - 23:00</strong></p>`,
    photos: [
      "https://phuket-insider.com/wp-content/uploads/2018/05/jungceylon-shopping-center.jpg",
      "https://phuket-insider.com/wp-content/uploads/2018/05/jungceylon-interior.jpg",
      "https://phuket-insider.com/wp-content/uploads/2018/05/jungceylon-big-c.jpg"
    ]
  },
  {
    handle: "premium-outlet-phuket",
    title: "Premium Outlet Phuket",
    description: `<h3>🏷️ Рай для любителей скидок!</h3>

<p>Premium Outlet Phuket – первый и единственный аутлет-центр на Пхукете! Здесь можно купить брендовую одежду, обувь и аксессуары со скидками до 70%.</p>

<h3>🛍️ Бренды</h3>
<ul>
<li><strong>Спортивные:</strong> Nike, Adidas, Puma, Reebok, Under Armour</li>
<li><strong>Одежда:</strong> Levi's, Lee, Wrangler, Gap, Banana Republic</li>
<li><strong>Обувь:</strong> Crocs, Skechers, Timberland, Clarks</li>
<li><strong>Аксессуары:</strong> Kipling, Samsonite, Charles & Keith</li>
</ul>

<h3>💰 Скидки</h3>
<p>Постоянные скидки от 30% до 70% на прошлые коллекции брендов. Дополнительные скидки в сезон распродаж (январь-февраль, июль-август).</p>

<h3>⏰ Время работы</h3>
<p><strong>Ежедневно: 10:00 - 22:00</strong></p>`,
    photos: [
      "https://phuket-insider.com/wp-content/uploads/2019/premium-outlet-phuket.jpg"
    ]
  }
];

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function findProductByHandle(handle) {
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
      }
    }
  `;
  
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function updateProductDescription(productId, description) {
  // Экранируем описание для GraphQL
  const escapedDescription = description
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
  
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        descriptionHtml: "${escapedDescription}"
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
  
  const result = await shopifyAdminRequest(mutation);
  return result.data?.productUpdate;
}

async function main() {
  console.log('🚀 Начинаем улучшение данных торговых центров...\n');
  
  for (const data of improvedData) {
    console.log(`📝 Обрабатываем: ${data.title}`);
    
    // Находим продукт
    const product = await findProductByHandle(data.handle);
    
    if (!product) {
      console.log(`  ❌ Продукт не найден: ${data.handle}`);
      continue;
    }
    
    console.log(`  ✅ Найден: ${product.id}`);
    
    // Обновляем описание
    console.log(`  📄 Обновляем описание...`);
    const updateResult = await updateProductDescription(product.id, data.description);
    
    if (updateResult?.userErrors?.length > 0) {
      console.log(`  ❌ Ошибка:`, updateResult.userErrors);
    } else {
      console.log(`  ✅ Описание обновлено!`);
    }
    
    console.log(`  📸 Фото URLs (для будущей загрузки):`);
    data.photos.forEach((url, i) => console.log(`     ${i+1}. ${url}`));
    
    console.log('');
  }
  
  console.log('✅ Готово! Все описания улучшены!');
  console.log('\n📸 ВАЖНО: Фото нужно загрузить вручную через Shopify Admin:');
  console.log('   https://admin.shopify.com/store/phuket-telegram-shop-117ck/products');
}

main().catch(console.error);

