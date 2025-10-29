#!/usr/bin/env node

/**
 * 🚀 ОБНОВЛЕНИЕ ОПИСАНИЙ ТУРОВ (ПРОДАЮЩИЕ ТЕКСТЫ)
 * ============================================================
 * 
 * Обновляет описания туров в Shopify на продающие тексты
 * в стиле pukeo.com
 */

// Используем встроенный fetch (Node.js 18+)

// ============================================================
// КОНФИГУРАЦИЯ SHOPIFY
// ============================================================

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_API_TOKEN = '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';
const API_VERSION = '2025-07';

// ============================================================
// ПРОДАЮЩИЕ ОПИСАНИЯ ТУРОВ (В СТИЛЕ PUKEO.COM)
// ============================================================

const TOUR_DESCRIPTIONS = {
  'phi-phi-2-days-1-night': {
    title: '🏝️ Пхи-Пхи 2 дня/1 ночь - Лучший тур Пхукета!',
    description: `🔥 САМЫЙ ПОПУЛЯРНЫЙ ТУР НА ПХУКЕТЕ!

Незабываемое путешествие на легендарные острова Пхи-Пхи с ночевкой в отеле! Посетите знаменитую бухту Майя Бэй, где снимался фильм "Пляж" с Леонардо ДиКаприо.

✨ ЧТО ВКЛЮЧЕНО:
• Скоростной катер с кондиционером
• Ночлег в 3-звездочном отеле на Пхи-Пхи
• 3-разовое питание (завтрак, обед, ужин)
• Снорклинг с маской и трубкой
• Посещение 6 островов
• Профессиональный гид-руссоговорящий
• Страховка на весь тур

🎯 МАРШРУТ:
День 1: Пхукет → Пхи-Пхи Дон → Майя Бэй → Викинг Кейв → Отель
День 2: Снорклинг → Пхи-Пхи Лей → Обед → Возвращение на Пхукет

💎 ПОЧЕМУ ВЫБИРАЮТ НАС:
• 15+ лет опыта на Пхукете
• 98% довольных клиентов
• Безопасные катера с GPS
• Лучшие цены на рынке
• Мгновенное подтверждение

🚀 БРОНИРУЙТЕ СЕЙЧАС - МЕСТА ОГРАНИЧЕНЫ!`
  },

  'james-bond-island-tour': {
    title: '🎬 James Bond Island - Остров из фильма "Человек с золотым пистолетом"',
    description: `🎬 ПОСЕТИТЕ ЛЕГЕНДАРНЫЙ ОСТРОВ JAMES BOND!

Отправьтесь в незабываемое путешествие к знаменитому острову Джеймса Бонда, где снимались сцены из фильма "Человек с золотым пистолетом" с Роджером Муром!

✨ ЧТО ВКЛЮЧЕНО:
• Скоростной катер с кондиционером
• Посещение острова Джеймса Бонда (Ко Тапу)
• Снорклинг в кристально чистой воде
• Обед из морепродуктов на борту
• Посещение плавучей деревни
• Профессиональный гид
• Страховка и оборудование

🎯 МАРШРУТ:
Пхукет → Плавучая деревня → Снорклинг → Остров Джеймса Бонда → Обед → Возвращение

💎 ОСОБЕННОСТИ:
• Уникальные фото на фоне скалы-гвоздя
• История съемок фильма от гида
• Лучшие места для снорклинга
• Традиционная тайская кухня

🚀 ЗАБРОНИРУЙТЕ - ЭТОТ ТУР НЕ ЗАБУДЕТСЯ НИКОГДА!`
  }
};

// ============================================================
// УТИЛИТЫ
// ============================================================

async function shopifyRequest(query, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors, null, 2)}`);
  }
  
  return data;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// ОСНОВНЫЕ ФУНКЦИИ
// ============================================================

async function getTourByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  const result = await shopifyRequest(query, { handle });
  return result.data.productByHandle;
}

async function updateTourDescription(productId, title, description) {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
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
    input: {
      id: productId,
      title: title
    }
  };

  try {
    // Сначала обновляем заголовок
    const result = await shopifyRequest(mutation, variables);
    
    if (result.data.productUpdate.userErrors.length > 0) {
      console.error(`   ❌ Ошибка обновления заголовка:`, result.data.productUpdate.userErrors);
      return false;
    }

    // Затем создаем metafield для описания
    const metafieldMutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const metafieldVariables = {
      metafields: [
        {
          ownerId: productId,
          namespace: "custom",
          key: "description",
          value: description,
          type: "multi_line_text_field"
        }
      ]
    };

    const metafieldResult = await shopifyRequest(metafieldMutation, metafieldVariables);
    
    if (metafieldResult.data.metafieldsSet.userErrors.length > 0) {
      console.error(`   ❌ Ошибка создания metafield:`, metafieldResult.data.metafieldsSet.userErrors);
      return false;
    } else {
      console.log(`   ✅ Заголовок и описание обновлены!`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Ошибка при обновлении:`, error.message);
    return false;
  }
}

async function updateTour(tourHandle, tourData) {
  console.log(`\n🚀 Обновляю описание: ${tourData.title}`);
  console.log(`   Handle: ${tourHandle}`);

  try {
    // Получаем текущий тур
    const product = await getTourByHandle(tourHandle);
    
    if (!product) {
      console.log(`   ⚠️  Тур не найден: ${tourHandle}`);
      return false;
    }

    console.log(`   📦 Найден тур: ${product.title}`);
    console.log(`   🔗 ID: ${product.id}`);

    // Обновляем описание
    const success = await updateTourDescription(product.id, tourData.title, tourData.description);
    
    if (success) {
      console.log(`   ✅ Тур обновлен: ${tourData.title}`);
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.error(`   ❌ Ошибка при обновлении тура ${tourHandle}:`, error.message);
    return false;
  }
}

async function updateAllTours() {
  console.log('🚀 ОБНОВЛЕНИЕ ОПИСАНИЙ ТУРОВ (ПРОДАЮЩИЕ ТЕКСТЫ)');
  console.log('============================================================');
  console.log(`📅 Дата: ${new Date().toLocaleString('ru-RU')}`);
  console.log(`📝 Стиль: pukeo.com (продающие тексты)`);
  console.log(`🏪 Магазин: ${SHOPIFY_STORE}`);
  console.log('============================================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [handle, tourData] of Object.entries(TOUR_DESCRIPTIONS)) {
    const success = await updateTour(handle, tourData);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }

    // Пауза между турами
    await sleep(1500);
  }

  console.log('\n============================================================');
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('============================================================');
  console.log(`✅ Обновлено: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📈 Успешность: ${Math.round((successCount / (successCount + errorCount)) * 100)}%`);
  console.log('\n🚀 Готово! Описания туров обновлены в Shopify.');
  console.log('💡 Проверьте результат на сайте.');
}

// ============================================================
// ЗАПУСК
// ============================================================

if (require.main === module) {
  updateAllTours().catch(console.error);
}

module.exports = { updateAllTours, TOUR_DESCRIPTIONS };
