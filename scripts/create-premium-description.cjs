#!/usr/bin/env node

/**
 * 🏆 СОЗДАНИЕ ТОПОВОГО ОПИСАНИЯ ДЛЯ SHOPIFY
 * 
 * Создаёт описание уровня Perplexity AI + Steve Jobs
 * - SEO-оптимизированное
 * - Конверсионное
 * - Структурированное
 * - С призывами к действию
 */

const fs = require('fs');
const path = require('path');

// ТОПОВОЕ описание Central Festival Phuket
const PREMIUM_DESCRIPTION = `
<div class="premium-description">
  <div class="hero-section">
    <h1>🏢 Central Festival Phuket — Крупнейший ТРЦ Пхукета</h1>
    <p class="lead">Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>
  </div>

  <div class="cta-banner">
    <p><strong>🎯 Хотите посетить Central Festival?</strong> <a href="/phuket" class="cta-link">Забронируйте тур с гидом</a> или <a href="/services/car-rental" class="cta-link">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>

  <section class="shopping-sections">
    <h2>🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h3>👔 Масс-маркет бренды</h3>
        <p>Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>
      </div>
      <div class="feature-card">
        <h3>🍽️ Еда и напитки</h3>
        <p>2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>
      </div>
      <div class="feature-card">
        <h3>🎬 Развлечения</h3>
        <p>Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми</p>
      </div>
    </div>
  </section>

  <section class="shopping-sections">
    <h2>💎 CENTRAL FLORESTA — Люкс</h2>
    <div class="features-grid">
      <div class="feature-card luxury">
        <h3>👑 Люксовые бутики</h3>
        <p>Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>
      </div>
      <div class="feature-card">
        <h3>👶 Детский мир</h3>
        <p>Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>
      </div>
      <div class="feature-card">
        <h3>🏠 Дом и декор</h3>
        <p>Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>
      </div>
      <div class="feature-card">
        <h3>🛒 Продукты</h3>
        <p>Супермаркет Tops Market — свежие продукты и деликатесы</p>
      </div>
    </div>
  </section>

  <section class="attractions">
    <h2>🎪 Развлечения и достопримечательности</h2>
    <div class="attractions-grid">
      <div class="attraction-card highlight">
        <h3>🐠 Aquaria Phuket</h3>
        <p><strong>Крупнейший океанариум на острове</strong> — более 25,000 морских обитателей, туннель с акулами, интерактивные зоны</p>
        <span class="badge">Must-see!</span>
      </div>
      <div class="attraction-card">
        <h3>🎭 AR TRICK EYE</h3>
        <p>Музей 3D-оптических иллюзий — создайте невероятные фото для Instagram</p>
      </div>
      <div class="attraction-card">
        <h3>🍽️ Su Va Na</h3>
        <p>Морской ресторан с видом на море — романтический ужин с панорамным видом</p>
      </div>
    </div>
  </section>

  <section class="amenities">
    <h2>✨ Удобства и сервисы</h2>
    <div class="amenities-grid">
      <div class="amenity-item">
        <span class="icon">📶</span>
        <span>Бесплатный Wi-Fi по всей территории</span>
      </div>
      <div class="amenity-item">
        <span class="icon">🔌</span>
        <span>Портативные зарядные станции для телефонов</span>
      </div>
      <div class="amenity-item">
        <span class="icon">💱</span>
        <span>Пункты обмена валют и банкоматы</span>
      </div>
      <div class="amenity-item">
        <span class="icon">👑</span>
        <span>Эксклюзивный лаундж для VIP-гостей</span>
      </div>
      <div class="amenity-item">
        <span class="icon">🚗</span>
        <span>Багги-сервис для перемещения между корпусами</span>
      </div>
      <div class="amenity-item">
        <span class="icon">💰</span>
        <span>Возврат НДС (Tax Free) для туристов</span>
      </div>
      <div class="amenity-item">
        <span class="icon">🅿️</span>
        <span>Большая бесплатная парковка на 3000+ мест</span>
      </div>
    </div>
  </section>

  <section class="location">
    <h2>📍 Как добраться</h2>
    <div class="location-info">
      <div class="address">
        <h3>🏢 Адрес</h3>
        <p>74/5 Vichitsongkram Rd, Wichit, Mueang Phuket District, Phuket 83000</p>
      </div>
      <div class="transport-options">
        <div class="transport-item">
          <h4>🏖️ Из Патонга</h4>
          <p>20 минут на машине или тук-туке (300-400 бат)</p>
        </div>
        <div class="transport-item">
          <h4>✈️ Из аэропорта</h4>
          <p>40 минут (600-800 бат на такси)</p>
        </div>
      </div>
    </div>
  </section>

  <section class="hours">
    <h2>🕐 Время работы</h2>
    <div class="hours-info">
      <p><strong>Ежедневно:</strong> 10:00 — 22:00</p>
      <p><strong>Рестораны и кафе:</strong> работают до 23:00</p>
    </div>
  </section>

  <div class="cta-section">
    <h2>🎯 Планируете поездку в Central Festival?</h2>
    <div class="cta-buttons">
      <a href="/phuket" class="cta-button primary">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="cta-button secondary">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="cta-button secondary">💱 Обменять валюту</a>
    </div>
    <p class="cta-note">💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей</p>
  </div>

  <div class="seo-footer">
    <p><em>Central Festival Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</em></p>
  </div>
</div>

<style>
.premium-description {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lead {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 500;
}

.cta-banner {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  text-align: center;
}

.cta-link {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
}

.cta-link:hover {
  text-decoration: underline;
}

.shopping-sections {
  margin: 3rem 0;
}

.shopping-sections h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
  border-bottom: 3px solid #007AFF;
  padding-bottom: 0.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #007AFF;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.feature-card.luxury {
  background: linear-gradient(135deg, #f8f9fa, #e8f4fd);
  border-left-color: #FFD700;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.attractions {
  margin: 3rem 0;
}

.attractions h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.attractions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.attraction-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  position: relative;
}

.attraction-card.highlight {
  border-color: #007AFF;
  background: linear-gradient(135deg, #f8f9fa, #e8f4fd);
}

.badge {
  position: absolute;
  top: -8px;
  right: 16px;
  background: #FFD700;
  color: #1a1a1a;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
}

.amenities {
  margin: 3rem 0;
}

.amenities h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.amenity-item .icon {
  font-size: 1.25rem;
}

.location, .hours {
  margin: 3rem 0;
}

.location h2, .hours h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.location-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.address h3, .transport-item h4 {
  color: #007AFF;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.transport-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.cta-section {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  margin: 3rem 0;
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.cta-button.primary {
  background: #FFD700;
  color: #1a1a1a;
}

.cta-button.secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
}

.cta-note {
  font-size: 1.1rem;
  opacity: 0.9;
}

.seo-footer {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #28a745;
}

.seo-footer em {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .features-grid, .attractions-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
`;

async function updateCentralFestivalDescription() {
  console.log('🏆 Создаём ТОПОВОЕ описание для Central Festival...\n');
  
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
    console.log('📝 Обновляем ТОПОВОЕ описание...');
    const result = await updateProductDescription(product.id, PREMIUM_DESCRIPTION);
    
    console.log('✅ УСПЕШНО ОБНОВЛЕНО!');
    console.log(`📦 Продукт: ${result.product.title}`);
    console.log(`🆔 ID: ${result.product.id}`);
    
    console.log('\n🎯 ОПИСАНИЕ ВКЛЮЧАЕТ:');
    console.log('✅ SEO-оптимизированную структуру');
    console.log('✅ Конверсионные призывы к действию');
    console.log('✅ Стилизованные карточки и секции');
    console.log('✅ Мобильную адаптивность');
    console.log('✅ Ссылки на наши сервисы');
    console.log('✅ Профессиональный дизайн');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запуск
updateCentralFestivalDescription();
