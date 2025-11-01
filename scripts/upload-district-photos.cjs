const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

/**
 * 📸 ЗАГРУЗКА ФОТОГРАФИЙ ДЛЯ РАЙОНОВ ПХУКЕТА
 * 
 * Создает placeholder изображения для каждого района
 * Позже можно заменить на реальные фотографии
 */

const districts = [
  { handle: 'patong-district', name: 'Patong', gradient: 'from-red-500 to-orange-600' },
  { handle: 'karon-district', name: 'Karon', gradient: 'from-blue-500 to-cyan-600' },
  { handle: 'kata-district', name: 'Kata', gradient: 'from-cyan-500 to-blue-600' },
  { handle: 'bangtao-district', name: 'Bang Tao', gradient: 'from-purple-500 to-pink-600' },
  { handle: 'rawai-district', name: 'Rawai', gradient: 'from-green-500 to-emerald-600' },
  { handle: 'phuket-town-district', name: 'Phuket Town', gradient: 'from-amber-500 to-orange-600' },
  { handle: 'surin-district', name: 'Surin', gradient: 'from-blue-500 to-indigo-600' },
  { handle: 'kamala-district', name: 'Kamala', gradient: 'from-teal-500 to-cyan-600' },
  { handle: 'chalong-district', name: 'Chalong', gradient: 'from-emerald-500 to-teal-600' },
  { handle: 'panwa-district', name: 'Panwa', gradient: 'from-slate-500 to-gray-600' },
  { handle: 'nai-harn-district', name: 'Nai Harn', gradient: 'from-blue-500 to-cyan-600' },
  { handle: 'kathu-district', name: 'Kathu', gradient: 'from-orange-500 to-red-600' },
  { handle: 'cherngtalay-district', name: 'Cherngtalay', gradient: 'from-purple-500 to-pink-600' },
  { handle: 'naiyang-district', name: 'Naiyang', gradient: 'from-indigo-500 to-purple-600' },
  { handle: 'thalang-district', name: 'Thalang', gradient: 'from-amber-500 to-yellow-600' }
];

/**
 * Создает base64 PNG placeholder изображение
 * Используем простой градиент с названием района
 */
function createPlaceholderImage(district) {
  // Создаем простой SVG, затем конвертируем в data URI
  // Для простоты используем встроенный SVG через data URI
  const gradientColors = {
    'from-red-500 to-orange-600': { start: '#EF4444', end: '#DC2626' },
    'from-blue-500 to-cyan-600': { start: '#3B82F6', end: '#0891B2' },
    'from-cyan-500 to-blue-600': { start: '#06B6D4', end: '#2563EB' },
    'from-purple-500 to-pink-600': { start: '#A855F7', end: '#DB2777' },
    'from-green-500 to-emerald-600': { start: '#22C55E', end: '#059669' },
    'from-amber-500 to-orange-600': { start: '#F59E0B', end: '#EA580C' },
    'from-blue-500 to-indigo-600': { start: '#3B82F6', end: '#4F46E5' },
    'from-teal-500 to-cyan-600': { start: '#14B8A6', end: '#0891B2' },
    'from-emerald-500 to-teal-600': { start: '#10B981', end: '#14B8A6' },
    'from-slate-500 to-gray-600': { start: '#64748B', end: '#4B5563' },
    'from-orange-500 to-red-600': { start: '#F97316', end: '#DC2626' },
    'from-indigo-500 to-purple-600': { start: '#6366F1', end: '#9333EA' },
    'from-amber-500 to-yellow-600': { start: '#F59E0B', end: '#CA8A04' }
  };

  const colors = gradientColors[district.gradient] || { start: '#3B82F6', end: '#2563EB' };
  
  // Создаем SVG как строку, затем конвертируем в base64
  const svgContent = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.start};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.end};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#grad)"/>
    <text x="600" y="380" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" opacity="0.95">${district.name}</text>
    <text x="600" y="460" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.85">Phuket District</text>
  </svg>`;
  
  // Конвертируем SVG в base64
  return Buffer.from(svgContent).toString('base64');
}

/**
 * Получает Product ID по handle
 */
function getProductId(handle) {
  return new Promise((resolve, reject) => {
    const query = `
      query {
        products(first: 1, query: "handle:${handle}") {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;
    
    const data = JSON.stringify({ query });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const product = result.data?.products?.edges?.[0]?.node;
          if (product) {
            resolve(product.id);
          } else {
            reject(new Error(`Product not found: ${handle}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Загружает изображение в Shopify через REST API
 */
function uploadImageToShopify(productId, base64Image, altText) {
  return new Promise((resolve, reject) => {
    // Используем простой PNG placeholder через data URI
    // Создаем минималистичное изображение 1200x800
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: `${altText.toLowerCase().replace(/\s+/g, '-')}-placeholder.png`,
        alt: altText
      }
    });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/products/${productId}/images.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(imageData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          resolve(result.image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

/**
 * Основная функция
 */
async function main() {
  console.log('📸 ЗАГРУЗКА ФОТОГРАФИЙ ДЛЯ РАЙОНОВ\n');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < districts.length; i++) {
    const district = districts[i];
    console.log(`\n📝 [${i + 1}/${districts.length}] ${district.name}`);
    
    try {
      // Получаем Product ID
      const productId = await getProductId(district.handle);
      console.log(`   Product ID: ${productId}`);
      
      // Создаем SVG placeholder
      const svg = createPlaceholderSVG(district);
      
      // Загружаем в Shopify
      const image = await uploadImageToShopify(productId, svg, `${district.name} District, Phuket`);
      console.log(`   ✅ Фото загружено: ${image.src}`);
      
      successCount++;
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${districts.length}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`\n🔗 Проверьте: http://localhost:8080/place/[district-handle]`);
  console.log(`\n💡 Позже можно заменить placeholder на реальные фотографии!`);
}

main().catch(console.error);

