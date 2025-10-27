#!/usr/bin/env node

/**
 * 🏆 СОЗДАНИЕ ТОПОВОГО ОПИСАНИЯ С TAILWIND CSS
 * 
 * Создаёт описание уровня Perplexity AI + Steve Jobs
 * - SEO-оптимизированное
 * - Конверсионное
 * - Структурированное
 * - С призывами к действию
 * - ТОЛЬКО Tailwind CSS классы
 */

const fs = require('fs');
const path = require('path');

// ТОПОВОЕ описание Central Festival Phuket с Tailwind CSS
const PREMIUM_DESCRIPTION = `
<div class="premium-description space-y-8">
  <!-- Hero Section -->
  <div class="hero-section text-center py-8">
    <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      🏢 Central Festival Phuket — Крупнейший ТРЦ Пхукета
    </h1>
    <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
      Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.
    </p>
  </div>

  <!-- CTA Banner -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl text-center">
    <p class="text-lg font-semibold">
      <strong>🎯 Хотите посетить Central Festival?</strong> 
      <a href="/phuket" class="text-yellow-300 hover:text-yellow-200 font-bold underline ml-2">Забронируйте тур с гидом</a> 
      или 
      <a href="/services/car-rental" class="text-yellow-300 hover:text-yellow-200 font-bold underline ml-2">арендуйте авто</a> 
      для самостоятельной поездки!
    </p>
  </div>

  <!-- Central Festival Section -->
  <section class="shopping-section">
    <h2 class="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-blue-500">
      🛍️ CENTRAL FESTIVAL — Масс-маркет
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">👔 Масс-маркет бренды</h3>
        <p class="text-gray-700">Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🍽️ Еда и напитки</h3>
        <p class="text-gray-700">2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🎬 Развлечения</h3>
        <p class="text-gray-700">Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми</p>
      </div>
    </div>
  </section>

  <!-- Central Floresta Section -->
  <section class="shopping-section">
    <h2 class="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-yellow-500">
      💎 CENTRAL FLORESTA — Люкс
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">👑 Люксовые бутики</h3>
        <p class="text-gray-700">Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">👶 Детский мир</h3>
        <p class="text-gray-700">Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🏠 Дом и декор</h3>
        <p class="text-gray-700">Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🛒 Продукты</h3>
        <p class="text-gray-700">Супермаркет Tops Market — свежие продукты и деликатесы</p>
      </div>
    </div>
  </section>

  <!-- Attractions Section -->
  <section class="attractions">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">🎪 Развлечения и достопримечательности</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border-2 border-blue-500 relative hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <div class="absolute -top-3 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
          Must-see!
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">🐠 Aquaria Phuket</h3>
        <p class="text-gray-700">
          <strong>Крупнейший океанариум на острове</strong> — более 25,000 морских обитателей, туннель с акулами, интерактивные зоны
        </p>
      </div>
      <div class="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🎭 AR TRICK EYE</h3>
        <p class="text-gray-700">Музей 3D-оптических иллюзий — создайте невероятные фото для Instagram</p>
      </div>
      <div class="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h3 class="text-xl font-bold text-gray-900 mb-3">🍽️ Su Va Na</h3>
        <p class="text-gray-700">Морской ресторан с видом на море — романтический ужин с панорамным видом</p>
      </div>
    </div>
  </section>

  <!-- Amenities Section -->
  <section class="amenities">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">✨ Удобства и сервисы</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">📶</span>
        <span class="text-gray-700">Бесплатный Wi-Fi по всей территории</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🔌</span>
        <span class="text-gray-700">Портативные зарядные станции для телефонов</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">💱</span>
        <span class="text-gray-700">Пункты обмена валют и банкоматы</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">👑</span>
        <span class="text-gray-700">Эксклюзивный лаундж для VIP-гостей</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🚗</span>
        <span class="text-gray-700">Багги-сервис для перемещения между корпусами</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">💰</span>
        <span class="text-gray-700">Возврат НДС (Tax Free) для туристов</span>
      </div>
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span class="text-2xl">🅿️</span>
        <span class="text-gray-700">Большая бесплатная парковка на 3000+ мест</span>
      </div>
    </div>
  </section>

  <!-- Location Section -->
  <section class="location">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">📍 Как добраться</h2>
    <div class="bg-gray-50 p-6 rounded-xl">
      <div class="mb-6">
        <h3 class="text-xl font-bold text-blue-600 mb-2">🏢 Адрес</h3>
        <p class="text-gray-700">74/5 Vichitsongkram Rd, Wichit, Mueang Phuket District, Phuket 83000</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-lg font-bold text-blue-600 mb-2">🏖️ Из Патонга</h4>
          <p class="text-gray-700">20 минут на машине или тук-туке (300-400 бат)</p>
        </div>
        <div>
          <h4 class="text-lg font-bold text-blue-600 mb-2">✈️ Из аэропорта</h4>
          <p class="text-gray-700">40 минут (600-800 бат на такси)</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Hours Section -->
  <section class="hours">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">🕐 Время работы</h2>
    <div class="bg-gray-50 p-6 rounded-xl">
      <p class="text-lg text-gray-700 mb-2"><strong>Ежедневно:</strong> 10:00 — 22:00</p>
      <p class="text-lg text-gray-700"><strong>Рестораны и кафе:</strong> работают до 23:00</p>
    </div>
  </section>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Central Festival?</h2>
    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <a href="/phuket" class="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200 hover:-translate-y-1">
        🏝️ Забронировать тур с гидом
      </a>
      <a href="/services/car-rental" class="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-bold border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-colors duration-200 hover:-translate-y-1">
        🚗 Арендовать авто
      </a>
      <a href="/services/currency-exchange" class="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-bold border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-colors duration-200 hover:-translate-y-1">
        💱 Обменять валюту
      </a>
    </div>
    <p class="text-lg opacity-90">
      💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей
    </p>
  </div>

  <!-- SEO Footer -->
  <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-green-500">
    <p class="text-lg text-gray-600 italic">
      <em>Central Festival Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</em>
    </p>
  </div>
</div>
`;

async function updateCentralFestivalDescription() {
  console.log('🏆 Создаём ТОПОВОЕ описание с Tailwind CSS...\n');
  
  const ADMIN_TOKEN = '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';
  const STORE_DOMAIN = 'phuket-telegram-shop-117ck.myshopify.com';
  
  async function shopifyAdminRequest(query, variables = {}) {
    const response = await fetch(`https://${STORE_DOMAIN}/admin/api/2025-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN
      },
      body: JSON.stringify({ query, variables })
    });
    
    const data = await response.json();
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }
    return data;
  }
  
  async function getProductByHandle(handle) {
    const query = `
      query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
        }
      }
    `;
    
    const data = await shopifyAdminRequest(query, { handle });
    return data.data.productByHandle;
  }
  
  async function updateProductDescription(productId, html) {
    const mutation = `
      mutation updateProduct($id: ID!, $descriptionHtml: String!) {
        productUpdate(input: {
          id: $id,
          descriptionHtml: $descriptionHtml
        }) {
          product {
            id
            title
            descriptionHtml
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const variables = {
      id: productId,
      descriptionHtml: html
    };
    
    const data = await shopifyAdminRequest(mutation, variables);
    
    if (data.data.productUpdate.userErrors.length > 0) {
      console.error('❌ User Errors:', data.data.productUpdate.userErrors);
      throw new Error('Failed to update product');
    }
    
    return data.data.productUpdate;
  }
  
  try {
    // 1. Найти продукт
    console.log('🔍 Ищем продукт: central-phuket-floresta');
    const product = await getProductByHandle('central-phuket-floresta');
    
    if (!product) {
      console.error('❌ Продукт не найден!');
      return;
    }
    
    console.log(`✅ Найден: ${product.title}`);
    console.log(`🆔 ID: ${product.id}\n`);
    
    // 2. Обновить описание
    console.log('📝 Обновляем ТОПОВОЕ описание с Tailwind CSS...');
    const result = await updateProductDescription(product.id, PREMIUM_DESCRIPTION);
    
    console.log('✅ УСПЕШНО ОБНОВЛЕНО!');
    console.log(`📦 Продукт: ${result.product.title}`);
    console.log(`🆔 ID: ${result.product.id}`);
    
    console.log('\n🎯 ОПИСАНИЕ ВКЛЮЧАЕТ:');
    console.log('✅ SEO-оптимизированную структуру');
    console.log('✅ Конверсионные призывы к действию');
    console.log('✅ Tailwind CSS стили (работают!)');
    console.log('✅ Мобильную адаптивность');
    console.log('✅ Ссылки на наши сервисы');
    console.log('✅ Профессиональный дизайн');
    console.log('✅ Hover эффекты и анимации');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запуск
updateCentralFestivalDescription();
