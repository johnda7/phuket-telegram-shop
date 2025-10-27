#!/usr/bin/env node

/**
 * 📸 РЕАЛЬНЫЕ ФОТО С GOOGLE IMAGES
 * 
 * Использует Google Custom Search API для поиска реальных фото конкретного места
 * 
 * SETUP:
 * 1. Получи API Key: https://developers.google.com/custom-search/v1/introduction
 * 2. Создай Custom Search Engine: https://cse.google.com/cse/all
 * 3. Включи "Image Search" в настройках CSE
 * 4. Сохрани в .env:
 *    GOOGLE_CSE_API_KEY=your_api_key
 *    GOOGLE_CSE_ID=your_search_engine_id
 * 
 * USAGE:
 *   node scripts/get-real-photos-google.cjs "Central Festival Phuket"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================

// Google Custom Search API
const GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY || '';
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '';

// Альтернатива: SerpAPI (проще, но платный)
const SERPAPI_KEY = process.env.SERPAPI_API_KEY || '';

// ============================================================
// МЕТОД 1: Google Custom Search API (БЕСПЛАТНЫЙ!)
// ============================================================

async function searchGoogleCSE(query, numPhotos = 10) {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    console.log('⚠️  Google CSE credentials not found');
    return null;
  }

  console.log('🔎 Поиск через Google Custom Search API...');
  
  const results = [];
  
  // Google CSE возвращает макс 10 результатов за раз
  // Для получения > 10 нужно делать несколько запросов с параметром start
  const requests = Math.ceil(numPhotos / 10);
  
  for (let i = 0; i < requests; i++) {
    const start = i * 10 + 1;
    const num = Math.min(10, numPhotos - i * 10);
    
    const url = `https://www.googleapis.com/customsearch/v1?` +
      `key=${GOOGLE_API_KEY}` +
      `&cx=${GOOGLE_CSE_ID}` +
      `&q=${encodeURIComponent(query)}` +
      `&searchType=image` +
      `&num=${num}` +
      `&start=${start}` +
      `&imgSize=large` +
      `&safe=off`;
    
    try {
      const data = await httpGet(url);
      const json = JSON.parse(data);
      
      if (json.items) {
        json.items.forEach((item, idx) => {
          results.push({
            url: item.link,
            thumbnail: item.image.thumbnailLink,
            title: item.title,
            source: item.displayLink,
            alt: `${query} - фото ${start + idx}`,
            width: item.image.width,
            height: item.image.height
          });
        });
      }
    } catch (error) {
      console.error(`   ❌ Ошибка на странице ${i + 1}:`, error.message);
    }
  }
  
  if (results.length > 0) {
    console.log(`   ✅ Найдено ${results.length} фото через Google CSE`);
    return results;
  }
  
  return null;
}

// ============================================================
// МЕТОД 2: SerpAPI (ПРОСТОЙ, НО ПЛАТНЫЙ)
// ============================================================

async function searchSerpAPI(query, numPhotos = 10) {
  if (!SERPAPI_KEY) {
    console.log('⚠️  SerpAPI key not found');
    return null;
  }

  console.log('🔎 Поиск через SerpAPI...');
  
  const url = `https://serpapi.com/search.json?` +
    `engine=google_images` +
    `&q=${encodeURIComponent(query)}` +
    `&num=${numPhotos}` +
    `&api_key=${SERPAPI_KEY}`;
  
  try {
    const data = await httpGet(url);
    const json = JSON.parse(data);
    
    if (json.images_results) {
      const results = json.images_results.slice(0, numPhotos).map((img, i) => ({
        url: img.original,
        thumbnail: img.thumbnail,
        title: img.title || `${query} - фото ${i + 1}`,
        source: img.source,
        alt: `${query} - ${img.title || `фото ${i + 1}`}`
      }));
      
      console.log(`   ✅ Найдено ${results.length} фото через SerpAPI`);
      return results;
    }
  } catch (error) {
    console.error('   ❌ Ошибка SerpAPI:', error.message);
  }
  
  return null;
}

// ============================================================
// МЕТОД 3: СПЕЦИФИЧНЫЙ ПОИСК ДЛЯ CENTRAL FESTIVAL
// ============================================================

function getCentralFestivalPhotos() {
  console.log('📍 Используем специфичные запросы для Central Festival...');
  
  // Специфичные запросы для более точных результатов
  const queries = [
    'Central Festival Phuket entrance exterior',
    'Central Floresta Phuket luxury brands',
    'Central Festival Phuket interior shopping',
    'Central Phuket mall food court',
    'Central Festival Phuket Aquaria',
    'Central Phuket parking building',
    'Central Festival Phuket at night',
    'Central Floresta Louis Vuitton Phuket',
    'Central Phuket Major Cineplex',
    'Central Festival Phuket aerial view'
  ];
  
  return queries;
}

// ============================================================
// FALLBACK: High-quality Unsplash URLs
// ============================================================

function getUnsplashFallback(query) {
  console.log('📷 Используем Unsplash fallback (высокое качество)...');
  
  // Предопределенные качественные URL торговых центров
  const urls = [
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=85', // Golden interior
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=85', // Roof structure
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=85', // Shopping center
    'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1200&q=85', // Mall interior
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85', // Interior design
    'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=1200&q=85', // Modern architecture
    'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1200&q=85', // Shop exterior
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85', // Interior mall
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85', // Shopping area
    'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200&q=85'  // Retail space
  ];
  
  return urls.map((url, i) => ({
    url,
    thumbnail: url.replace('w=1200', 'w=400'),
    title: `${query} - Quality Image ${i + 1}`,
    source: 'Unsplash',
    alt: `${query} - профессиональное фото ${i + 1}`
  }));
}

// ============================================================
// HELPER: HTTP GET
// ============================================================

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ============================================================
// MAIN FUNCTION
// ============================================================

async function main() {
  const placeName = process.argv[2];
  const numPhotos = parseInt(process.argv[3]) || 10;
  
  if (!placeName) {
    console.error('\n❌ Ошибка: Укажите название места!\n');
    console.log('Использование:');
    console.log('  node scripts/get-real-photos-google.cjs "Central Festival Phuket" 10\n');
    console.log('SETUP (для Google CSE - БЕСПЛАТНО 100 запросов/день):');
    console.log('1. API Key: https://developers.google.com/custom-search/v1/introduction');
    console.log('2. Search Engine: https://cse.google.com/cse/all');
    console.log('3. Добавь в .env:');
    console.log('   GOOGLE_CSE_API_KEY=your_key');
    console.log('   GOOGLE_CSE_ID=your_cse_id\n');
    process.exit(1);
  }
  
  console.log('\n📸 ПОИСК РЕАЛЬНЫХ ФОТОГРАФИЙ');
  console.log('='.repeat(60));
  console.log(`📍 Место: ${placeName}`);
  console.log(`🔢 Количество: ${numPhotos}`);
  console.log('='.repeat(60));
  console.log('');
  
  let photos = null;
  
  // Стратегия 1: Google Custom Search API
  photos = await searchGoogleCSE(placeName, numPhotos);
  if (photos && photos.length >= numPhotos) {
    displayResults(photos);
    return;
  }
  
  // Стратегия 2: SerpAPI
  photos = await searchSerpAPI(placeName, numPhotos);
  if (photos && photos.length >= numPhotos) {
    displayResults(photos);
    return;
  }
  
  // Стратегия 3: Unsplash Fallback
  console.log('\n⚠️  Все API недоступны. Используем Unsplash fallback...');
  photos = getUnsplashFallback(placeName).slice(0, numPhotos);
  displayResults(photos);
}

function displayResults(photos) {
  console.log('\n✅ РЕЗУЛЬТАТЫ:');
  console.log('='.repeat(60));
  photos.forEach((photo, i) => {
    console.log(`\n[${i + 1}/${photos.length}] ${photo.title}`);
    console.log(`   URL: ${photo.url}`);
    console.log(`   Source: ${photo.source}`);
  });
  console.log('\n='.repeat(60));
  console.log('\n💡 СЛЕДУЮЩИЙ ШАГ:');
  console.log('   node scripts/download-and-upload.cjs [handle] [photo_urls...]\n');
}

// ============================================================
// RUN
// ============================================================

main().catch(console.error);

