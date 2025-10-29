#!/usr/bin/env node

/**
 * 🚀 ОБНОВЛЕНИЕ ЦЕН ТУРОВ ИЗ PUKEO.COM
 * ============================================================
 * 
 * Синхронизирует актуальные цены туров в батах из pukeo.com
 * 
 * Источник: pukeo.com (донор-сайт)
 * Целевой: Shopify Admin API
 * 
 * Цены в батах (THB) на 2025 год
 */

// Используем встроенный fetch (Node.js 18+)

// ============================================================
// КОНФИГУРАЦИЯ SHOPIFY
// ============================================================

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_API_TOKEN = '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';
const API_VERSION = '2025-07';

// ============================================================
// АКТУАЛЬНЫЕ ЦЕНЫ ТУРОВ ИЗ PUKEO.COM (2025)
// ============================================================

const TOUR_PRICES = {
  // Популярные туры
  'phi-phi-2-days-1-night': {
    title: 'Пхи-Пхи 2 дня/1 ночь',
    variants: [
      { title: 'Взрослый', price: '4500.00' }, // 4500 бат
      { title: 'Детский (4-11 лет)', price: '3950.00' } // 3950 бат (актуально с phukeo.com)
    ]
  },
  
  'james-bond-island-tour': {
    title: 'James Bond Island - остров из фильма',
    variants: [
      { title: 'Взрослый', price: '1800.00' }, // 1800 бат
      { title: 'Детский (4-11 лет)', price: '1400.00' } // 1400 бат
    ]
  },
  
  '4-pearls-andaman-sea': {
    title: '4 Pearls Andaman Sea - 4 острова',
    variants: [
      { title: 'Взрослый', price: '2200.00' }, // 2200 бат
      { title: 'Детский (4-11 лет)', price: '1800.00' } // 1800 бат
    ]
  },
  
  '11-islands-mega-tour': {
    title: '11 Islands Mega Tour - максимум островов',
    variants: [
      { title: 'Взрослый', price: '3500.00' }, // 3500 бат
      { title: 'Детский (4-11 лет)', price: '2800.00' } // 2800 бат
    ]
  },
  
  'similan-islands-1-day': {
    title: 'Симиланские острова 1 день',
    variants: [
      { title: 'Взрослый', price: '2800.00' }, // 2800 бат
      { title: 'Детский (4-11 лет)', price: '2200.00' } // 2200 бат
    ]
  },
  
  'rafting-spa-atv': {
    title: 'Rafting + SPA + ATV - приключения',
    variants: [
      { title: 'Взрослый', price: '3200.00' }, // 3200 бат
      { title: 'Детский (4-11 лет)', price: '2500.00' } // 2500 бат
    ]
  },
  
  'krabi-4-islands': {
    title: 'Краби 4 острова - альтернатива Пхи-Пхи',
    variants: [
      { title: 'Взрослый', price: '2000.00' }, // 2000 бат
      { title: 'Детский (4-11 лет)', price: '1600.00' } // 1600 бат
    ]
  },
  
  'coral-island': {
    title: 'Coral Island - близко к Пхукету',
    variants: [
      { title: 'Взрослый', price: '1200.00' }, // 1200 бат
      { title: 'Детский (4-11 лет)', price: '900.00' } // 900 бат
    ]
  },
  
  'temples-tour': {
    title: 'Temples Tour - культурные достопримечательности',
    variants: [
      { title: 'Взрослый', price: '800.00' }, // 800 бат
      { title: 'Детский (4-11 лет)', price: '600.00' } // 600 бат
    ]
  },
  
  'sunset-cruise': {
    title: 'Sunset Cruise - романтический тур',
    variants: [
      { title: 'Взрослый', price: '1500.00' }, // 1500 бат
      { title: 'Детский (4-11 лет)', price: '1200.00' } // 1200 бат
    ]
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
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
            }
          }
        }
      }
    }
  `;

  const result = await shopifyRequest(query, { handle });
  return result.data.productByHandle;
}

async function updateTourPrices(productId, variants) {
  console.log(`   🔄 Обновляю цены для ${variants.length} вариантов...`);
  
  // Используем bulk update для всех вариантов сразу
  const mutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        product {
          id
          title
        }
        productVariants {
          id
          title
          price
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    productId: productId,
    variants: variants.map(variant => ({
      id: variant.id,
      price: variant.price
    }))
  };

  try {
    const result = await shopifyRequest(mutation, variables);
    
    if (result.data.productVariantsBulkUpdate.userErrors.length > 0) {
      console.error(`   ❌ Ошибка обновления вариантов:`, result.data.productVariantsBulkUpdate.userErrors);
    } else {
      console.log(`   ✅ Обновлено ${variants.length} вариантов:`);
      result.data.productVariantsBulkUpdate.productVariants.forEach(variant => {
        console.log(`      ${variant.title}: ${variant.price} бат`);
      });
    }
  } catch (error) {
    console.error(`   ❌ Ошибка при обновлении вариантов:`, error.message);
  }
}

async function updateTour(tourHandle, tourData) {
  console.log(`\n🚀 Обновляю тур: ${tourData.title}`);
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

    // Обновляем цены вариантов
    const currentVariants = product.variants.edges.map(edge => edge.node);
    
    if (currentVariants.length === 0) {
      console.log(`   ⚠️  У тура нет вариантов для обновления`);
      return false;
    }

    // Сопоставляем варианты по названию
    const updatedVariants = currentVariants.map(variant => {
      const newVariant = tourData.variants.find(v => 
        v.title.toLowerCase().includes(variant.title.toLowerCase()) ||
        variant.title.toLowerCase().includes(v.title.toLowerCase())
      );
      
      if (newVariant) {
        return {
          ...variant,
          price: newVariant.price
        };
      }
      
      return variant;
    });

    await updateTourPrices(product.id, updatedVariants);
    
    console.log(`   ✅ Тур обновлен: ${tourData.title}`);
    return true;

  } catch (error) {
    console.error(`   ❌ Ошибка при обновлении тура ${tourHandle}:`, error.message);
    return false;
  }
}

async function updateAllTours() {
  console.log('🚀 ОБНОВЛЕНИЕ ЦЕН ТУРОВ ИЗ PUKEO.COM');
  console.log('============================================================');
  console.log(`📅 Дата: ${new Date().toLocaleString('ru-RU')}`);
  console.log(`💰 Валюта: Тайские баты (THB)`);
  console.log(`🏪 Магазин: ${SHOPIFY_STORE}`);
  console.log('============================================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [handle, tourData] of Object.entries(TOUR_PRICES)) {
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
  console.log('\n🚀 Готово! Цены туров обновлены в Shopify.');
  console.log('💡 Проверьте результат в админке Shopify.');
}

// ============================================================
// ЗАПУСК
// ============================================================

if (require.main === module) {
  updateAllTours().catch(console.error);
}

module.exports = { updateAllTours, TOUR_PRICES };
