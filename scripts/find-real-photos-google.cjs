/**
 * 📸 АВТОМАТИЧЕСКИЙ ПОИСК РЕАЛЬНЫХ ФОТОГРАФИЙ
 * 
 * Ищет настоящие фото места через:
 * 1. Google Images API (SerpAPI)
 * 2. Yandex Images API (если Google недоступен)
 * 3. Unsplash API (высококачественный fallback)
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/find-real-photos-google.cjs "Central Festival Phuket" 10
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================

const SERPAPI_KEY = process.env.SERPAPI_API_KEY || ''; // Получить на https://serpapi.com
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''; // Получить на https://unsplash.com/developers

// ============================================================
// СТРАТЕГИЯ 1: Google Images через SerpAPI
// ============================================================

async function searchGoogleImages(query, numPhotos = 10) {
  if (!SERPAPI_KEY) {
    console.log('⚠️  SerpAPI ключ не найден. Используем fallback...');
    return null;
  }

  return new Promise((resolve, reject) => {
    const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&num=${numPhotos}&api_key=${SERPAPI_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.images_results) {
            const photos = json.images_results.slice(0, numPhotos).map((img, i) => ({
              url: img.original,
              thumbnail: img.thumbnail,
              title: img.title || `${query} - фото ${i + 1}`,
              source: img.source,
              alt: `${query} - ${img.title || `фото ${i + 1}`}`
            }));
            resolve(photos);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ============================================================
// СТРАТЕГИЯ 2: Yandex Images API
// ============================================================

async function searchYandexImages(query, numPhotos = 10) {
  // TODO: Реализовать Yandex Images API
  // https://yandex.ru/dev/direct/doc/dg/objects/image.html
  console.log('⚠️  Yandex Images API пока не реализован');
  return null;
}

// ============================================================
// СТРАТЕГИЯ 3: Unsplash (высококачественный fallback)
// ============================================================

async function searchUnsplash(query, numPhotos = 10) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️  Unsplash ключ не найден. Используем статичный fallback...');
    return getFallbackPhotos(query, numPhotos);
  }

  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${numPhotos}&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results) {
            const photos = json.results.map((img, i) => ({
              url: img.urls.regular,
              thumbnail: img.urls.thumb,
              title: img.description || img.alt_description || `${query} ${i + 1}`,
              source: 'Unsplash',
              alt: img.alt_description || `${query} - фото ${i + 1}`,
              photographer: img.user.name,
              photographerUrl: img.user.links.html
            }));
            resolve(photos);
          } else {
            resolve(getFallbackPhotos(query, numPhotos));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ============================================================
// FALLBACK: Предопределенные высококачественные URL
// ============================================================

function getFallbackPhotos(query, numPhotos = 10) {
  console.log('ℹ️  Используем предопределенные URL (fallback)');
  
  // Высококачественные фото торговых центров/мест из Unsplash
  const fallbackUrls = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200',
    'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1200',
    'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200'
  ];

  return fallbackUrls.slice(0, numPhotos).map((url, i) => ({
    url,
    thumbnail: url.replace('w=1200', 'w=400'),
    title: `${query} - фото ${i + 1}`,
    source: 'Unsplash (fallback)',
    alt: `${query} - фото ${i + 1}`
  }));
}

// ============================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================

async function findRealPhotos(placeName, numPhotos = 10) {
  console.log('\n🔍 ПОИСК РЕАЛЬНЫХ ФОТОГРАФИЙ');
  console.log('============================================================');
  console.log(`📍 Место: ${placeName}`);
  console.log(`📸 Количество: ${numPhotos}`);
  console.log('============================================================\n');

  let photos = null;

  // Стратегия 1: Google Images
  console.log('🔎 Попытка 1: Google Images (SerpAPI)...');
  try {
    photos = await searchGoogleImages(placeName, numPhotos);
    if (photos && photos.length > 0) {
      console.log(`✅ Найдено ${photos.length} фото через Google Images`);
      return photos;
    }
  } catch (error) {
    console.log(`❌ Ошибка Google Images: ${error.message}`);
  }

  // Стратегия 2: Yandex Images
  console.log('\n🔎 Попытка 2: Yandex Images...');
  try {
    photos = await searchYandexImages(placeName, numPhotos);
    if (photos && photos.length > 0) {
      console.log(`✅ Найдено ${photos.length} фото через Yandex Images`);
      return photos;
    }
  } catch (error) {
    console.log(`❌ Ошибка Yandex Images: ${error.message}`);
  }

  // Стратегия 3: Unsplash (fallback)
  console.log('\n🔎 Попытка 3: Unsplash (fallback)...');
  try {
    photos = await searchUnsplash(placeName, numPhotos);
    if (photos && photos.length > 0) {
      console.log(`✅ Найдено ${photos.length} фото через Unsplash`);
      return photos;
    }
  } catch (error) {
    console.log(`❌ Ошибка Unsplash: ${error.message}`);
  }

  // Финальный fallback
  console.log('\n⚠️  Все API недоступны. Используем статичные URL...');
  return getFallbackPhotos(placeName, numPhotos);
}

// ============================================================
// CLI INTERFACE
// ============================================================

if (require.main === module) {
  const placeName = process.argv[2];
  const numPhotos = parseInt(process.argv[3]) || 10;

  if (!placeName) {
    console.error('\n❌ Ошибка: Укажите название места!');
    console.log('\nИспользование:');
    console.log('  node scripts/find-real-photos-google.cjs "Central Festival Phuket" 10');
    console.log('\nПеременные окружения (опционально):');
    console.log('  SERPAPI_API_KEY - для Google Images');
    console.log('  UNSPLASH_ACCESS_KEY - для Unsplash\n');
    process.exit(1);
  }

  findRealPhotos(placeName, numPhotos).then((photos) => {
    console.log('\n✅ РЕЗУЛЬТАТ:');
    console.log('============================================================');
    photos.forEach((photo, i) => {
      console.log(`\n[${i + 1}/${photos.length}] ${photo.title}`);
      console.log(`    URL: ${photo.url}`);
      console.log(`    Source: ${photo.source}`);
      if (photo.photographer) {
        console.log(`    Photographer: ${photo.photographer}`);
      }
    });
    console.log('\n============================================================');
  }).catch(console.error);
}

module.exports = { findRealPhotos };
