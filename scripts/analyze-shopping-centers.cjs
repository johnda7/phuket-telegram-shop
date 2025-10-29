#!/usr/bin/env node

/**
 * 🔍 АНАЛИЗ ТОРГОВЫХ ЦЕНТРОВ
 * Сравниваем все ТЦ с эталоном Central Phuket
 */

const ADMIN_API_TOKEN = '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';
const SHOP_DOMAIN = 'phuket-telegram-shop-117ck.myshopify.com';

// Торговые центры для анализа
const SHOPPING_CENTERS = [
  'central-phuket-floresta',
  'jungceylon-shopping-center', 
  'premium-outlet-phuket',
  'big-c-supercenter-phuket',
  'tesco-lotus-phuket',
  'robinson-lifestyle-phuket',
  'patong-night-market'
];

async function analyzeShoppingCenters() {
  console.log('🔍 АНАЛИЗ ТОРГОВЫХ ЦЕНТРОВ');
  console.log('============================\n');

  try {
    // Получаем все торговые центры
    const centers = await fetchShoppingCenters();
    
    console.log(`📦 Найдено торговых центров: ${centers.length}\n`);
    
    // Анализируем каждый центр
    for (const center of centers) {
      await analyzeCenter(center);
    }
    
    console.log('\n✅ Анализ завершен!');
    
  } catch (error) {
    console.error('❌ Ошибка при анализе:', error);
  }
}

async function fetchShoppingCenters() {
  const query = `
    query {
      products(first: 20, query: "tag:shopping") {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            metafields(first: 20) {
              edges {
                node {
                  key
                  value
                  type
                  namespace
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL ошибки: ${JSON.stringify(data.errors)}`);
  }
  
  return data.data.products.edges.map(edge => edge.node);
}

async function analyzeCenter(center) {
  console.log(`🏢 ${center.title}`);
  console.log(`   Handle: ${center.handle}`);
  console.log(`   ID: ${center.id}`);
  
  // Анализ фотографий
  const photoCount = center.images.edges.length;
  console.log(`   📸 Фотографии: ${photoCount} шт`);
  
  // Анализ описания
  const hasDescription = center.description && center.description.length > 100;
  const hasHtmlDescription = center.descriptionHtml && center.descriptionHtml.length > 100;
  console.log(`   📝 Описание: ${hasDescription ? '✅' : '❌'} (${center.description?.length || 0} символов)`);
  console.log(`   📝 HTML описание: ${hasHtmlDescription ? '✅' : '❌'} (${center.descriptionHtml?.length || 0} символов)`);
  
  // Анализ metafields
  const metafields = center.metafields?.edges?.map(edge => edge.node) || [];
  const hasRating = metafields.some(m => m.key === 'rating');
  const hasCoordinates = metafields.some(m => m.key === 'coordinates');
  const hasDistrict = metafields.some(m => m.key === 'district');
  const hasWorkingHours = metafields.some(m => m.key === 'workingHours');
  const hasPriceLevel = metafields.some(m => m.key === 'priceLevel');
  
  console.log(`   📊 Metafields:`);
  console.log(`      Рейтинг: ${hasRating ? '✅' : '❌'}`);
  console.log(`      Координаты: ${hasCoordinates ? '✅' : '❌'}`);
  console.log(`      Район: ${hasDistrict ? '✅' : '❌'}`);
  console.log(`      Часы работы: ${hasWorkingHours ? '✅' : '❌'}`);
  console.log(`      Ценовой уровень: ${hasPriceLevel ? '✅' : '❌'}`);
  
  // Анализ качества описания
  if (center.descriptionHtml) {
    const hasH1 = center.descriptionHtml.includes('<h1>');
    const hasH2 = center.descriptionHtml.includes('<h2>');
    const hasH3 = center.descriptionHtml.includes('<h3>');
    const hasConversionBlock = center.descriptionHtml.includes('🎯 Хотите посетить');
    const hasServicesBlock = center.descriptionHtml.includes('Наши сервисы');
    
    console.log(`   🎨 Качество HTML:`);
    console.log(`      H1 заголовок: ${hasH1 ? '✅' : '❌'}`);
    console.log(`      H2 подзаголовки: ${hasH2 ? '✅' : '❌'}`);
    console.log(`      H3 подподзаголовки: ${hasH3 ? '✅' : '❌'}`);
    console.log(`      Конверсионный блок: ${hasConversionBlock ? '✅' : '❌'}`);
    console.log(`      Блок сервисов: ${hasServicesBlock ? '✅' : '❌'}`);
  }
  
  // Общая оценка
  const score = calculateScore(center, photoCount, hasDescription, hasHtmlDescription, metafields.length);
  console.log(`   🏆 Общая оценка: ${score}/10`);
  
  if (score < 8) {
    console.log(`   ⚠️  ТРЕБУЕТ УЛУЧШЕНИЯ!`);
  } else {
    console.log(`   ✅ Соответствует эталону`);
  }
  
  console.log('');
}

function calculateScore(center, photoCount, hasDescription, hasHtmlDescription, metafieldsCount) {
  let score = 0;
  
  // Фотографии (максимум 2 балла)
  if (photoCount >= 6) score += 2;
  else if (photoCount >= 3) score += 1;
  
  // Описание (максимум 3 балла)
  if (hasHtmlDescription) score += 3;
  else if (hasDescription) score += 1;
  
  // Metafields (максимум 3 балла)
  if (metafieldsCount >= 5) score += 3;
  else if (metafieldsCount >= 3) score += 2;
  else if (metafieldsCount >= 1) score += 1;
  
  // Качество HTML (максимум 2 балла)
  if (center.descriptionHtml) {
    const hasH1 = center.descriptionHtml.includes('<h1>');
    const hasH2 = center.descriptionHtml.includes('<h2>');
    const hasConversionBlock = center.descriptionHtml.includes('🎯 Хотите посетить');
    
    if (hasH1 && hasH2 && hasConversionBlock) score += 2;
    else if (hasH1 || hasH2) score += 1;
  }
  
  return score;
}

// Запуск
analyzeShoppingCenters();
