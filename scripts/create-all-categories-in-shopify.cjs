#!/usr/bin/env node

/**
 * 🚀 МАССОВОЕ СОЗДАНИЕ ВСЕХ КАТЕГОРИЙ В SHOPIFY
 * 
 * Философия:
 * - Perplexity AI: Минимализм и скорость
 * - Steve Jobs: Каждый пиксель имеет значение
 * - iOS 26: Нативный дизайн
 * - Telegram Wallet: Компактность и профессионализм
 * 
 * ВСЁ ДИНАМИЧЕСКИ ЧЕРЕЗ SHOPIFY!
 * НИКАКИХ СТАТИЧЕСКИХ ДАННЫХ!
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ═══════════════════════════════════════════════════════════════

const SHOPIFY_CONFIG = {
  adminUrl: 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json',
  accessToken: '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',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': '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'
  }
};

// ═══════════════════════════════════════════════════════════════
// ВСЕ 20 КАТЕГОРИЙ ИЗ PHUKET INSIDER
// ═══════════════════════════════════════════════════════════════

const CATEGORIES = [
  // TIER 1: HIGH PRIORITY (начинать с этих!)
  {
    id: 'beaches',
    title: 'Пляжи Пхукета',
    handle: 'beaches',
    description: 'Лучшие пляжи Пхукета — от популярных Патонга и Карона до скрытых Paradise Beach и Freedom Beach. Белый песок, прозрачная вода и развитая инфраструктура.',
    productType: 'Information',
    tags: ['info', 'insider', 'beaches', 'category:beaches'],
    priority: 'high'
  },
  {
    id: 'temples',
    title: 'Храмы Пхукета',
    handle: 'temples',
    description: 'Буддийские храмы Пхукета — культурное наследие острова. Ват Чалонг, Большой Будда, Ват Пра Тонг. История, архитектура и духовность.',
    productType: 'Information',
    tags: ['info', 'insider', 'temples', 'category:temples'],
    priority: 'high'
  },
  {
    id: 'viewpoints',
    title: 'Смотровые площадки Пхукета',
    handle: 'viewpoints',
    description: 'Лучшие смотровые площадки Пхукета с панорамными видами. Промтеп Кейп, Karon Viewpoint, Windmill Viewpoint. Идеально для фото и закатов.',
    productType: 'Information',
    tags: ['info', 'insider', 'viewpoints', 'category:viewpoints'],
    priority: 'high'
  },
  {
    id: 'excursions',
    title: 'Экскурсии на Пхукете',
    handle: 'excursions',
    description: 'Морские экскурсии на Пхукете — Пхи-Пхи, Джеймс Бонд, Симиланы. Лучшие туры по островам Андаманского моря.',
    productType: 'Excursions',
    tags: ['tour', 'excursions', 'islands', 'category:excursions'],
    priority: 'high'
  },
  {
    id: 'attractions',
    title: 'Достопримечательности Пхукета',
    handle: 'attractions',
    description: 'Главные достопримечательности Пхукета — Большой Будда, Промтеп Кейп, Старый город. Культурные и исторические места.',
    productType: 'Information',
    tags: ['info', 'insider', 'attractions', 'category:attractions'],
    priority: 'high'
  },

  // TIER 2: MEDIUM PRIORITY
  {
    id: 'restaurants',
    title: 'Рестораны Пхукета',
    handle: 'restaurants',
    description: 'Лучшие рестораны Пхукета — тайская кухня, морепродукты, европейская кухня. От уличной еды до Michelin-starred заведений.',
    productType: 'Information',
    tags: ['info', 'insider', 'restaurants', 'category:restaurants'],
    priority: 'medium'
  },
  {
    id: 'nightlife',
    title: 'Ночная жизнь Пхукета',
    handle: 'nightlife',
    description: 'Ночная жизнь Пхукета — клубы, бары, шоу. Bangla Road, Illuzion, Tiger. Лучшие места для вечеринок и развлечений.',
    productType: 'Information',
    tags: ['info', 'insider', 'nightlife', 'category:nightlife'],
    priority: 'medium'
  },
  {
    id: 'spa',
    title: 'СПА и массаж на Пхукете',
    handle: 'spa',
    description: 'Лучшие СПА-салоны и массажные центры Пхукета. Традиционный тайский массаж, SPA-процедуры, wellness-центры.',
    productType: 'Information',
    tags: ['info', 'insider', 'spa', 'category:spa'],
    priority: 'medium'
  },
  {
    id: 'elephants',
    title: 'Парки слонов на Пхукете',
    handle: 'elephants',
    description: 'Этичные парки слонов на Пхукете. Наблюдение, кормление, купание со слонами. Забота о животных и экотуризм.',
    productType: 'Information',
    tags: ['info', 'insider', 'elephants', 'category:elephants'],
    priority: 'medium'
  },
  {
    id: 'diving',
    title: 'Дайвинг на Пхукете',
    handle: 'diving',
    description: 'Дайвинг на Пхукете — Симиланы, Рача, Корал. Лучшие дайв-сайты Андаманского моря. Сертификация PADI.',
    productType: 'Information',
    tags: ['info', 'insider', 'diving', 'category:diving'],
    priority: 'medium'
  },
  {
    id: 'clubs',
    title: 'Клубы на Пхукете',
    handle: 'clubs',
    description: 'Лучшие клубы Пхукета — Illuzion, Tiger, Seduction. Ночная жизнь, вечеринки, шоу-программы.',
    productType: 'Information',
    tags: ['info', 'insider', 'clubs', 'category:clubs'],
    priority: 'medium'
  },
  {
    id: 'bars',
    title: 'Бары на Пхукете',
    handle: 'bars',
    description: 'Лучшие бары Пхукета — Sky Bar, Beach Bar, Rooftop. Коктейли, закаты, атмосфера.',
    productType: 'Information',
    tags: ['info', 'insider', 'bars', 'category:bars'],
    priority: 'medium'
  },

  // TIER 3: LOW PRIORITY (но важны для полноты!)
  {
    id: 'shopping',
    title: 'Торговые центры Пхукета',
    handle: 'shopping',
    description: 'Современные торговые центры Пхукета с мировыми брендами, ресторанами и развлечениями. Central, Jungceylon, Premium Outlet.',
    productType: 'Information',
    tags: ['info', 'insider', 'shopping', 'category:shopping'],
    priority: 'low'
  },
  {
    id: 'aquaparks',
    title: 'Аквапарки на Пхукете',
    handle: 'aquaparks',
    description: 'Аквапарки Пхукета — атмосфера праздника и веселья для всей семьи! От спокойных бассейнов до экстремальных горок.',
    productType: 'Information',
    tags: ['info', 'insider', 'aquaparks', 'category:aquaparks'],
    priority: 'low'
  },
  {
    id: 'museums',
    title: 'Музеи Пхукета',
    handle: 'museums',
    description: 'Музеи Пхукета — история, культура, искусство. Thai Hua Museum, Phuket Mining Museum. Познавательный досуг.',
    productType: 'Information',
    tags: ['info', 'insider', 'museums', 'category:museums'],
    priority: 'low'
  },
  {
    id: 'nightmarkets',
    title: 'Ночные рынки Пхукета',
    handle: 'nightmarkets',
    description: 'Ночные рынки Пхукета — аутентичная атмосфера, уличная еда, сувениры. Weekend Market, Chillva, Indy Market.',
    productType: 'Information',
    tags: ['info', 'insider', 'nightmarkets', 'category:nightmarkets'],
    priority: 'low'
  },
  {
    id: 'waterfalls',
    title: 'Водопады Пхукета',
    handle: 'waterfalls',
    description: 'Водопады Пхукета — природная красота острова. Катху, Банг Пэ, Тон Сай. Треккинг, купание, пикники.',
    productType: 'Information',
    tags: ['info', 'insider', 'waterfalls', 'category:waterfalls'],
    priority: 'low'
  },
  {
    id: 'districts',
    title: 'Районы Пхукета',
    handle: 'districts',
    description: 'Районы Пхукета — где жить и что посетить. Патонг, Карон, Ката, Old Town, Bang Tao. Плюсы, минусы, инфраструктура.',
    productType: 'Information',
    tags: ['info', 'insider', 'districts', 'category:districts'],
    priority: 'low'
  },
  {
    id: 'amusement',
    title: 'Парки развлечений',
    handle: 'amusement',
    description: 'Парки развлечений Пхукета — Splash Jungle, Andamanda, FantaSea. Аттракционы, шоу, развлечения для всей семьи.',
    productType: 'Information',
    tags: ['info', 'insider', 'amusement', 'category:amusement'],
    priority: 'low'
  },
  {
    id: 'fishing',
    title: 'Рыбалка на Пхукете',
    handle: 'fishing',
    description: 'Морская рыбалка на Пхукете — тунец, марлин, барракуда. Аренда катеров, рыболовные туры, трофеи.',
    productType: 'Information',
    tags: ['info', 'insider', 'fishing', 'category:fishing'],
    priority: 'low'
  },
  {
    id: 'yachts',
    title: 'Аренда яхт на Пхукете',
    handle: 'yachts',
    description: 'Аренда яхт на Пхукете — романтические круизы, корпоративы, свадьбы. От катеров до роскошных яхт.',
    productType: 'Information',
    tags: ['info', 'insider', 'yachts', 'category:yachts'],
    priority: 'low'
  },
  {
    id: 'zoos',
    title: 'Зоопарки на Пхукете',
    handle: 'zoos',
    description: 'Зоопарки и контактные зоопарки Пхукета — тигры, слоны, обезьяны. Семейный отдых с детьми.',
    productType: 'Information',
    tags: ['info', 'insider', 'zoos', 'category:zoos'],
    priority: 'low'
  },
  {
    id: 'events',
    title: 'Афиша событий',
    handle: 'events',
    description: 'События на Пхукете — фестивали, концерты, выставки. Афиша мероприятий, билеты, расписание.',
    productType: 'Information',
    tags: ['info', 'insider', 'events', 'category:events'],
    priority: 'low'
  }
];

// ═══════════════════════════════════════════════════════════════
// ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════

/**
 * Выполнить GraphQL запрос к Shopify Admin API
 */
async function shopifyRequest(query, variables = {}) {
  try {
    const response = await fetch(SHOPIFY_CONFIG.adminUrl, {
      method: 'POST',
      headers: SHOPIFY_CONFIG.headers,
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Shopify Request Error:', error);
    throw error;
  }
}

/**
 * Создать категорию в Shopify
 */
async function createCategory(category) {
  console.log(`\n🚀 Создаю категорию: ${category.title}`);
  
  const mutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          tags
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
      title: category.title,
      handle: category.handle,
      productType: category.productType,
      tags: category.tags
    }
  };

  try {
    const result = await shopifyRequest(mutation, variables);
    
    if (result.data.productCreate.userErrors.length > 0) {
      console.error(`❌ Ошибки при создании ${category.title}:`, result.data.productCreate.userErrors);
      return null;
    }

    const product = result.data.productCreate.product;
    console.log(`✅ Создана категория: ${product.title} (ID: ${product.id})`);
    return product;
  } catch (error) {
    console.error(`❌ Ошибка при создании ${category.title}:`, error.message);
    return null;
  }
}

/**
 * Проверить существование категории
 */
async function checkCategoryExists(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  try {
    const result = await shopifyRequest(query, { handle });
    return result.data.productByHandle !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Создать все категории
 */
async function createAllCategories() {
  console.log('🚀 МАССОВОЕ СОЗДАНИЕ ВСЕХ КАТЕГОРИЙ В SHOPIFY');
  console.log('=' .repeat(60));
  
  const results = {
    created: [],
    skipped: [],
    errors: []
  };

  for (let i = 0; i < CATEGORIES.length; i++) {
    const category = CATEGORIES[i];
    
    console.log(`\n📋 [${i + 1}/${CATEGORIES.length}] ${category.title}`);
    console.log(`   Handle: ${category.handle}`);
    console.log(`   Priority: ${category.priority}`);
    
    try {
      // Проверяем существование
      const exists = await checkCategoryExists(category.handle);
      
      if (exists) {
        console.log(`⏭️  Категория уже существует, пропускаем`);
        results.skipped.push(category);
        continue;
      }

      // Создаем категорию
      const created = await createCategory(category);
      
      if (created) {
        results.created.push(created);
      } else {
        results.errors.push(category);
      }

      // Пауза между запросами
      if (i < CATEGORIES.length - 1) {
        console.log('⏳ Пауза 1.5 сек...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
    } catch (error) {
      console.error(`❌ Критическая ошибка для ${category.title}:`, error.message);
      results.errors.push(category);
    }
  }

  // Итоговый отчет
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('=' .repeat(60));
  console.log(`✅ Создано: ${results.created.length}`);
  console.log(`⏭️  Пропущено: ${results.skipped.length}`);
  console.log(`❌ Ошибок: ${results.errors.length}`);
  
  if (results.created.length > 0) {
    console.log('\n🎉 УСПЕШНО СОЗДАННЫЕ КАТЕГОРИИ:');
    results.created.forEach(cat => {
      console.log(`   ✅ ${cat.title} (${cat.handle})`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log('\n❌ КАТЕГОРИИ С ОШИБКАМИ:');
    results.errors.forEach(cat => {
      console.log(`   ❌ ${cat.title} (${cat.handle})`);
    });
  }

  console.log('\n🚀 Готово! Все категории созданы в Shopify.');
  console.log('💡 Теперь можно заполнять их контентом через другие скрипты.');
}

// ═══════════════════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  createAllCategories().catch(console.error);
}

module.exports = {
  createAllCategories,
  createCategory,
  checkCategoryExists,
  CATEGORIES
};
