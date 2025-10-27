// Скрипт для обновления описаний всех торговых центров
// Используем встроенный fetch

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

// Данные торговых центров с правильными описаниями
const shoppingCenters = [
  {
    handle: "central-phuket-floresta",
    title: "Central Phuket Floresta (Централ Пхукет Флореста)",
    description: `Central Phuket Floresta – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.

**Central Festival:**
- Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas
- Косметика: Sephora, Boots
- Электроника: Apple, Samsung, Sony
- Супермаркет Tops Market

**Central Floresta:**
- Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel
- Ювелирные магазины
- Премиум рестораны

**Развлечения:**
- Кинотеатр SF Cinema
- Детская игровая зона
- Аквариум
- Фуд-корт с тайской и международной кухней

**Удобства:**
- Бесплатная парковка
- Бесплатный Wi-Fi
- Банкоматы
- Обмен валюты
- Кондиционеры`
  },
  {
    handle: "jungceylon-shopping-center",
    title: "Jungceylon Shopping Center (Джангцелон)",
    description: `Jungceylon – один из самых популярных торговых центров в Патонге, расположенный в самом сердце туристического района. Современный дизайн и широкий выбор магазинов делают его идеальным местом для шоппинга.

**Основные магазины:**
- Big C Supercenter (супермаркет)
- Robinson Department Store
- Международные бренды: Nike, Adidas, Levi's
- Косметика: Boots, Watsons
- Электроника: Power Buy, IT City

**Развлечения:**
- SF Cinema (кинотеатр)
- Bowling Center
- Детская игровая зона
- Фуд-корт с тайской и международной кухней

**Удобства:**
- Бесплатная парковка
- Бесплатный Wi-Fi
- Банкоматы
- Обмен валюты
- Кондиционеры`
  },
  {
    handle: "central-festival-phuket",
    title: "Central Festival Phuket (Централ Фестиваль Пхукет)",
    description: `Central Festival Phuket – крупнейший торговый центр на острове, состоящий из двух корпусов: Central Festival и Central Floresta. Более 300 магазинов, рестораны, фуд-корты, кинотеатр и аквариум.

**Central Festival (масс-маркет):**
- Zara, H&M, Uniqlo, Nike, Adidas
- Sephora, Boots
- Apple Store, Samsung
- Tops Market

**Central Floresta (люкс):**
- Louis Vuitton, Prada, Gucci, Chanel
- Bulgari, Tiffany & Co
- Премиум рестораны

**Развлечения:**
- Aquaria Phuket (океанариум)
- SF Cinema
- Детские зоны
- Музей 3D-иллюзий

**Удобства:**
- Парковка на 3000+ мест
- Wi-Fi по всей территории
- Банкоматы и обмен валюты
- Кондиционеры`
  },
  {
    handle: "phuket-town-old-town",
    title: "Phuket Town Old Town (Старый город Пхукет)",
    description: `Phuket Town Old Town – исторический центр острова с уникальной архитектурой в стиле "Sino-Portuguese". Узкие улочки, старинные здания и атмосферные кафе создают неповторимую атмосферу.

**Достопримечательности:**
- Thalang Road (главная улица)
- Soi Romanee (романтичная улочка)
- Shrine of the Serene Light
- Phuket Thai Hua Museum

**Магазины и кафе:**
- Сувенирные лавки
- Галереи искусства
- Кафе и рестораны
- Магазины местных ремесленников

**Особенности:**
- Уникальная архитектура
- Фото-споты для Instagram
- Местная атмосфера
- Историческая ценность

**Удобства:**
- Пешеходные зоны
- Парковка ограничена
- Wi-Fi в кафе
- Туалеты в кафе`
  },
  {
    handle: "big-c-phuket",
    title: "Big C Phuket (Биг Си Пхукет)",
    description: `Big C Phuket – крупный супермаркет и торговый центр, идеальный для покупки продуктов, одежды и товаров для дома. Доступные цены и широкий ассортимент делают его популярным среди местных жителей и туристов.

**Основные отделы:**
- Продукты питания (свежие и замороженные)
- Одежда и обувь
- Электроника и бытовая техника
- Косметика и парфюмерия
- Товары для дома

**Популярные бренды:**
- Big C собственные марки
- Международные бренды
- Тайские бренды
- Корейская косметика

**Удобства:**
- Большая парковка
- Кондиционеры
- Банкоматы
- Обмен валюты
- Фуд-корт

**Особенности:**
- Доступные цены
- Широкий выбор
- Удобное расположение
- Скидки и акции`
  },
  {
    handle: "tesco-lotus-phuket",
    title: "Tesco Lotus Phuket (Теско Лотус Пхукет)",
    description: `Tesco Lotus Phuket – популярная сеть супермаркетов с широким ассортиментом товаров по доступным ценам. Идеальное место для покупки продуктов, одежды и товаров первой необходимости.

**Основные отделы:**
- Продукты питания
- Одежда и обувь
- Электроника
- Косметика
- Товары для дома

**Популярные категории:**
- Свежие фрукты и овощи
- Мясо и морепродукты
- Молочные продукты
- Хлеб и выпечка
- Напитки

**Удобства:**
- Бесплатная парковка
- Кондиционеры
- Банкоматы
- Wi-Fi
- Туалеты

**Особенности:**
- Британская сеть
- Качественные товары
- Регулярные скидки
- Удобные часы работы`
  },
  {
    handle: "phuket-weekend-market",
    title: "Phuket Weekend Market (Выходной рынок Пхукет)",
    description: `Phuket Weekend Market (Naka Market) – крупнейший ночной рынок на острове, работающий по выходным. Сотни палаток с едой, одеждой, сувенирами и развлечениями создают неповторимую атмосферу.

**Основные секции:**
- Еда (тайская, китайская, мусульманская)
- Одежда и аксессуары
- Сувениры и поделки
- Электроника
- Развлечения

**Популярная еда:**
- Pad Thai (жареная лапша)
- Som Tam (салат из папайи)
- Mango Sticky Rice (манго с рисом)
- Свежие соки
- Мороженое

**Развлечения:**
- Живая музыка
- Танцы
- Игры
- Массаж

**Удобства:**
- Парковка
- Туалеты
- Wi-Fi ограничен
- Освещение

**Особенности:**
- Работает только по выходным
- Лучшее время: 18:00-22:00
- Торг уместен
- Наличные предпочтительнее`
  }
];

const GET_PRODUCT_ID_QUERY = `
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        handle
        descriptionHtml
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function updateAllShoppingDescriptions() {
  console.log('🚀 Обновляем описания всех торговых центров...\n');
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`📦 [${i + 1}/${shoppingCenters.length}] Обновляем: ${center.title}`);

    // 1. Получаем ID продукта по handle
    let productId = null;
    try {
      const idResponse = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({ query: GET_PRODUCT_ID_QUERY, variables: { handle: center.handle } }),
      });
      const idResult = await idResponse.json();
      if (idResult.data && idResult.data.productByHandle) {
        productId = idResult.data.productByHandle.id;
        console.log(`   ✅ Найден ID: ${productId}`);
      } else {
        console.warn(`   ⚠️ Продукт с handle "${center.handle}" не найден, пропускаем.`);
        errorCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
    } catch (error) {
      console.error(`   ❌ Ошибка при получении ID для ${center.title}:`, error);
      errorCount++;
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }

    // 2. Обновляем продукт
    const variables = {
      input: {
        id: productId,
        title: center.title,
        descriptionHtml: center.description
      }
    };

    try {
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
        console.error(`   ❌ GraphQL ошибки для ${center.title}:`, result.errors);
        errorCount++;
      } else if (result.data.productUpdate.userErrors.length > 0) {
        console.error(`   ❌ Ошибки обновления продукта ${center.title}:`, result.data.productUpdate.userErrors);
        errorCount++;
      } else {
        console.log(`   ✅ Успешно обновлен: ${result.data.productUpdate.product.title}`);
        successCount++;
      }
    } catch (error) {
      console.error(`   ❌ Ошибка при обновлении ${center.title}:`, error);
      errorCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Пауза для Shopify API
  }

  console.log('\n📊 === РЕЗУЛЬТАТЫ ===');
  console.log(`✅ Успешно обновлено: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📦 Всего обработано: ${shoppingCenters.length}`);
  console.log('\n🎉 Описания торговых центров успешно обновлены!');
  console.log('🌐 Проверьте результат на сайте: http://localhost:8080/shopping');
}

updateAllShoppingDescriptions();
