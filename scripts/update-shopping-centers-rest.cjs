const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeRestRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': postData.length
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

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function getProductByHandle(handle) {
  try {
    const response = await makeRestRequest('GET', `/admin/api/2025-07/products.json?handle=${handle}`);
    return response.products && response.products.length > 0 ? response.products[0] : null;
  } catch (error) {
    console.error(`Ошибка при получении продукта ${handle}:`, error.message);
    return null;
  }
}

async function updateProductDescription(productId, description) {
  try {
    const updateData = {
      product: {
        id: productId,
        body_html: description
      }
    };
    
    const response = await makeRestRequest('PUT', `/admin/api/2025-07/products/${productId}.json`, updateData);
    return response.product;
  } catch (error) {
    console.error(`Ошибка при обновлении продукта ${productId}:`, error.message);
    return null;
  }
}

// Данные для обновления торговых центров
const shoppingCentersData = {
  'jungceylon-shopping-center': {
    title: 'Jungceylon Shopping Center (Джангцелон)',
    description: `🛍️ Jungceylon Shopping Center (Джангцелон)

Крупнейший торговый центр в самом центре Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.

⭐ Рейтинг: 4.6/5
💰 Ценовой уровень: $$
📍 Район: Патонг
🕐 Часы работы: 11:00-23:00 ежедневно
🚗 Парковка: Бесплатная

🛒 Магазины и бутики:
• H&M, Zara, Uniqlo, Adidas, Nike
• Sephora, Boots, Watsons
• Магазины техники, аксессуары

🍽️ Еда и напитки:
• Тайская, китайская, японская, европейская кухня
• Starbucks, McDonald's, местные кафе

⭐ Обязательно к посещению:
🎬 Major Cineplex - Современные залы с 3D фильмами и комфортными креслами

Удобства:
📶 Wi-Fi | 🅿️ Парковка | 🍽️ Фуд-корт | 🎬 Кино | 🎳 Боулинг | 👶 Детские зоны

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.`
  },
  'premium-outlet-phuket': {
    title: 'Premium Outlet Phuket (Премиум Аутлет Пхукет)',
    description: `🏪 Premium Outlet Phuket (Премиум Аутлет Пхукет)

Крупнейший аутлет-центр на Пхукете с огромными скидками. Здесь можно найти качественную брендовую одежду по невероятно низким ценам.

⭐ Рейтинг: 4.3/5
💰 Ценовой уровень: $$
📍 Район: Чернгталай
🕐 Часы работы: 10:00-21:00 ежедневно
🚗 Парковка: Бесплатная

👔 Модные бренды:
• Nike, Adidas, Puma, Under Armour
• Zara, H&M, Mango, Forever 21
• Hugo Boss, Calvin Klein, Tommy Hilfiger

👟 Обувь и аксессуары:
• Nike, Adidas, Converse, Vans
• Michael Kors, Coach, Kate Spade

Удобства:
📶 Wi-Fi | 🅿️ Парковка | 🍽️ Фуд-корт | 🏧 Банкомат

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Premium Outlet Phuket — это рай для шопоголиков! Здесь можно найти качественную брендовую одежду по невероятно низким ценам.`
  },
  'big-c-supercenter-phuket': {
    title: 'Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)',
    description: `🏬 Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)

Один из крупнейших гипермаркетов на Пхукете. Здесь можно найти все необходимое для дома, продукты, одежду и электронику по доступным ценам.

⭐ Рейтинг: 4.0/5
💰 Ценовой уровень: $
📍 Район: Пхукет Таун
🕐 Часы работы: 09:00-22:00 ежедневно
🚗 Парковка: Бесплатная

🥬 Продукты питания:
• Свежие овощи и фрукты
• Мясо и морепродукты
• Хлеб и выпечка

👕 Одежда и обувь:
• Мужская и женская одежда
• Детская одежда
• Обувь для всей семьи

Удобства:
🅿️ Парковка | 🍽️ Фуд-корт | 🏧 Банкомат

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Big C Supercenter — это удобное место для всех видов покупок. Здесь можно найти все необходимое для дома, продукты, одежду и электронику по доступным ценам.`
  },
  'robinson-lifestyle-phuket': {
    title: 'Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)',
    description: `🏢 Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)

Современный торговый центр с фокусом на образ жизни. Здесь можно найти все необходимое для современного образа жизни.

⭐ Рейтинг: 4.4/5
💰 Ценовой уровень: $$
📍 Район: Чернгталай
🕐 Часы работы: 10:00-22:00 ежедневно
🚗 Парковка: Бесплатная

👔 Модная одежда:
• Женская мода
• Мужская мода
• Детская мода

🏠 Дом и интерьер:
• Мебель и декор
• Посуда и кухонные принадлежности
• Товары для дома

⭐ Обязательно к посещению:
🎬 SF Cinema - Современный кинотеатр с комфортными залами

Удобства:
📶 Wi-Fi | 🅿️ Парковка | 🍽️ Фуд-корт | 🎬 Кино | 🏧 Банкомат

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Robinson Lifestyle Phuket — это современный торговый центр, который предлагает уникальный опыт шопинга и развлечений.`
  },
  'tesco-lotus-phuket': {
    title: 'Tesco Lotus Phuket (Теско Лотус Пхукет)',
    description: `🛒 Tesco Lotus Phuket (Теско Лотус Пхукет)

Популярный супермаркет с широким ассортиментом. Здесь можно найти все необходимое для повседневной жизни по доступным ценам.

⭐ Рейтинг: 4.1/5
💰 Ценовой уровень: $
📍 Район: Пхукет Таун
🕐 Часы работы: 08:00-22:00 ежедневно
🚗 Парковка: Бесплатная

🥬 Продукты питания:
• Свежие овощи и фрукты
• Мясо и рыба
• Молочные продукты

🏠 Бытовые товары:
• Товары для уборки
• Косметика и гигиена
• Одежда и обувь

Удобства:
🅿️ Парковка | 🍽️ Фуд-корт | 🏧 Банкомат

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Tesco Lotus Phuket — это популярный супермаркет, где можно найти все необходимое для повседневной жизни.`
  },
  'patong-night-market': {
    title: 'Patong Night Market (Ночной рынок Патонг)',
    description: `🌃 Patong Night Market (Ночной рынок Патонг)

Знаменитый ночной рынок в центре Патонга. Здесь можно найти уникальные сувениры, местные деликатесы и развлечения.

⭐ Рейтинг: 4.2/5
💰 Ценовой уровень: $
📍 Район: Патонг
🕐 Часы работы: 18:00-02:00 ежедневно
🚗 Парковка: Платная

🍜 Уличная еда:
• Шашлыки и гриль
• Тайские супы и лапша
• Свежие соки и коктейли

🛍️ Сувениры и подарки:
• Футболки и одежда
• Ручные поделки
• Украшения и аксессуары

⭐ Обязательно к посещению:
🎪 Уличные представления - Традиционные тайские танцы и музыкальные выступления

Удобства:
🍽️ Еда и напитки | 🎪 Развлечения | 🛍️ Сувениры

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Patong Night Market — это знаменитый ночной рынок, где можно найти уникальные сувениры, местные деликатесы и развлечения.`
  }
};

async function updateShoppingCenter(handle, data) {
  try {
    console.log(`\n🔄 Обновляем ${data.title}...`);
    
    // Получаем продукт
    const product = await getProductByHandle(handle);
    if (!product) {
      console.log(`❌ Продукт ${handle} не найден`);
      return false;
    }
    
    console.log(`✅ Найден продукт: ${product.title} (ID: ${product.id})`);
    
    // Обновляем описание
    const updatedProduct = await updateProductDescription(product.id, data.description);
    if (updatedProduct) {
      console.log(`✅ Описание обновлено для ${data.title}`);
      return true;
    } else {
      console.log(`❌ Ошибка при обновлении ${data.title}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Ошибка при обновлении ${handle}:`, error.message);
    return false;
  }
}

async function updateAllShoppingCenters() {
  console.log('🚀 ОБНОВЛЕНИЕ ВСЕХ ТОРГОВЫХ ЦЕНТРОВ');
  console.log('=====================================');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [handle, data] of Object.entries(shoppingCentersData)) {
    console.log(`\n📝 [${successCount + errorCount + 1}/${Object.keys(shoppingCentersData).length}] ${data.title}`);
    
    const success = await updateShoppingCenter(handle, data);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ:');
  console.log('='.repeat(50));
  console.log(`✅ Успешно обновлено: ${successCount}/${Object.keys(shoppingCentersData).length}`);
  console.log(`❌ Ошибок: ${errorCount}/${Object.keys(shoppingCentersData).length}`);
  
  if (successCount === Object.keys(shoppingCentersData).length) {
    console.log('\n🎉 ВСЕ ТОРГОВЫЕ ЦЕНТРЫ ОБНОВЛЕНЫ!');
    console.log('🔗 Проверьте результат: http://localhost:5173/category/shopping');
  } else {
    console.log('\n⚠️ Некоторые торговые центры не удалось обновить');
  }
}

updateAllShoppingCenters().catch(console.error);
