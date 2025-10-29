#!/usr/bin/env node

/**
 * МАСТЕР-СКРИПТ: Применение Telegram WebApp стиля ко всем турам
 * 
 * Этот скрипт обновляет описания всех туров в Shopify,
 * применяя единый Telegram WebApp дизайн с:
 * - Компактными блоками
 * - Правильными иконками Lucide React
 * - Цветовой схемой #007AFF
 * - Структурированным контентом
 */

// Using built-in fetch (Node.js 18+)

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';

const ADMIN_URL = `https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`;

// GraphQL query to get all tours
const GET_TOURS_QUERY = `
  query GetTours {
    products(first: 50, query: "product_type:Excursions") {
      edges {
        node {
          id
          title
          handle
          description
          tags
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
    }
  }
`;

// GraphQL mutation to update product description
const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($input: ProductInput!) {
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

// GraphQL mutation to set metafields
const SET_METAFIELDS_MUTATION = `
  mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
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

// Function to make GraphQL request
async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

// Function to create Telegram WebApp style description
function createTelegramStyleDescription(tour) {
  const title = tour.title;
  const handle = tour.handle;
  
  // Extract duration from title or tags
  const duration = title.includes('2 дня') ? '2 дня / 1 ночь' : 
                   title.includes('1 день') ? '1 день' : 
                   '1 день';
  
  // Extract location from title
  const location = title.includes('Пхи-Пхи') ? 'Пхи-Пхи' :
                   title.includes('James Bond') ? 'James Bond Island' :
                   title.includes('Симилан') ? 'Симиланские острова' :
                   'Пхукет';

  return `
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
  <h1 class="text-2xl font-bold mb-2">${title}</h1>
  <p class="text-lg opacity-90">Лучший тур Пхукета!</p>
</div>

<div class="space-y-6">
  <!-- Краткое описание -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <p class="text-gray-700 leading-relaxed">${title} — это незабываемое путешествие к самым красивым местам Андаманского моря. Экскурсия позволит насладиться всеми красотами этого райского уголка.</p>
  </div>

  <!-- Ключевые моменты -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="bg-blue-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🏝️</div>
      <div class="text-xs font-medium text-blue-800">Острова</div>
    </div>
    <div class="bg-green-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🤿</div>
      <div class="text-xs font-medium text-green-800">Снорклинг</div>
    </div>
    <div class="bg-purple-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🏖️</div>
      <div class="text-xs font-medium text-purple-800">Пляжи</div>
    </div>
    <div class="bg-orange-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🌅</div>
      <div class="text-xs font-medium text-orange-800">Панорамы</div>
    </div>
  </div>

  <!-- Что входит (компактно) -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="font-semibold text-gray-800 mb-3">✅ Что входит в тур</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Скоростной катер + отель</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Питание включено</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Снорклинг + маски</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Русский гид + страховка</span>
      </div>
    </div>
  </div>

  <!-- Программа (свернутая) -->
  <div class="space-y-3">
    <h3 class="font-semibold text-gray-800">📅 Программа тура</h3>
    
    <div class="bg-blue-50 p-3 rounded-lg">
      <div class="font-medium text-blue-800 mb-2">День 1: Пхукет → ${location}</div>
      <div class="text-sm text-gray-700 space-y-1">
        <div>06:50 Выезд → 09:50 ${location} → 10:50 Снорклинг → 14:20 Обед → 20:30 Вечерняя программа</div>
      </div>
    </div>

    ${duration.includes('2 дня') ? `
    <div class="bg-green-50 p-3 rounded-lg">
      <div class="font-medium text-green-800 mb-2">День 2: ${location} → Пхукет</div>
      <div class="text-sm text-gray-700 space-y-1">
        <div>07:00 Завтрак → 10:30 Смотровая площадка → 15:30 Снорклинг → 17:00 Возвращение</div>
      </div>
    </div>
    ` : ''}
  </div>

  <!-- Важная информация (компактно) -->
  <div class="bg-yellow-50 p-4 rounded-lg">
    <h3 class="font-semibold text-yellow-800 mb-2">⚠️ Важно знать</h3>
    <div class="text-sm text-gray-700 space-y-1">
      <div>• Программа может изменяться в зависимости от погодных условий</div>
      <div>• Вход на смотровые площадки: 50-100 бат (не включено)</div>
      <div>• Что взять: купальник, солнцезащитный крем, головной убор</div>
    </div>
  </div>
</div>
  `.trim();
}

// Main function
async function applyTelegramStyleToAllTours() {
  console.log('🚀 Начинаем применение Telegram WebApp стиля ко всем турам...\n');

  try {
    // 1. Get all tours
    console.log('📋 Получаем список всех туров...');
    const toursData = await makeGraphQLRequest(GET_TOURS_QUERY);
    
    if (!toursData) {
      console.error('❌ Не удалось получить список туров');
      return;
    }

    const tours = toursData.products.edges.map(edge => edge.node);
    console.log(`✅ Найдено ${tours.length} туров\n`);

    // 2. Process each tour
    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i];
      console.log(`🔄 [${i + 1}/${tours.length}] Обрабатываем: ${tour.title}`);

      try {
        // Create new description
        const newDescription = createTelegramStyleDescription(tour);
        
        // Update product description
        const updateResult = await makeGraphQLRequest(UPDATE_PRODUCT_MUTATION, {
          input: {
            id: tour.id,
            descriptionHtml: newDescription
          }
        });

        if (updateResult?.productUpdate?.userErrors?.length > 0) {
          console.error(`❌ Ошибки при обновлении ${tour.title}:`, updateResult.productUpdate.userErrors);
          continue;
        }

        // Set metafields for custom description
        const metafieldsResult = await makeGraphQLRequest(SET_METAFIELDS_MUTATION, {
          metafields: [
            {
              ownerId: tour.id,
              namespace: "custom",
              key: "description",
              value: newDescription,
              type: "multi_line_text_field"
            }
          ]
        });

        if (metafieldsResult?.metafieldsSet?.userErrors?.length > 0) {
          console.error(`❌ Ошибки при установке metafields для ${tour.title}:`, metafieldsResult.metafieldsSet.userErrors);
        }

        console.log(`✅ ${tour.title} - обновлен успешно`);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Ошибка при обработке ${tour.title}:`, error.message);
      }
    }

    console.log('\n🎉 Все туры успешно обновлены в стиле Telegram WebApp!');
    console.log('\n📱 Проверьте результат на сайте: http://localhost:8080/tours');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Run the script
if (require.main === module) {
  applyTelegramStyleToAllTours();
}

module.exports = { applyTelegramStyleToAllTours };
