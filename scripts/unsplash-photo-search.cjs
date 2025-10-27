// Поиск качественных фотографий через Unsplash API
// Бесплатный и качественный источник фотографий

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Нужен API ключ от Unsplash
const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

// Поисковые запросы для Robinson Lifestyle Phuket
const searchQueries = [
  'shopping mall Thailand',
  'modern shopping center exterior',
  'mall interior Thailand',
  'food court shopping center',
  'cinema theater Thailand',
  'retail stores shopping mall'
];

async function searchUnsplashPhotos() {
  try {
    console.log('🔍 ПОИСК ФОТОГРАФИЙ ЧЕРЕЗ UNSPLASH API\n');
    console.log('📋 Unsplash - это качественный источник фотографий');
    console.log('✅ Все фото высокого качества');
    console.log('✅ Бесплатные для коммерческого использования');
    console.log('✅ Профессиональные фотографии\n');
    
    const allPhotos = [];
    
    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`📷 [${i + 1}/${searchQueries.length}] Поиск: "${query}"`);
      
      const searchUrl = `${UNSPLASH_URL}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&order_by=relevant`;
      
      try {
        const response = await fetch(searchUrl, {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        });
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          console.log(`   ✅ Найдено ${data.results.length} фото`);
          
          data.results.forEach((photo, index) => {
            const photoData = {
              id: photo.id,
              title: photo.alt_description || photo.description || 'Shopping Mall Photo',
              url: photo.urls.regular,
              fullUrl: photo.urls.full,
              thumbnail: photo.urls.thumb,
              width: photo.width,
              height: photo.height,
              size: photo.width * photo.height,
              source: 'Unsplash',
              photographer: photo.user.name,
              photographerUrl: photo.user.links.html,
              query: query,
              aspectRatio: photo.width / photo.height
            };
            
            // Критерии качества для Unsplash
            const isHighQuality = photoData.width >= 800 && photoData.height >= 600;
            const isGoodAspectRatio = photoData.aspectRatio >= 1.2 && photoData.aspectRatio <= 2.5;
            
            if (isHighQuality && isGoodAspectRatio) {
              allPhotos.push(photoData);
              console.log(`     ✅ ${index + 1}. ${photoData.title} (${photoData.width}x${photoData.height})`);
              console.log(`        Фотограф: ${photoData.photographer}`);
            } else {
              console.log(`     ❌ ${index + 1}. ${photoData.title} - не подходит по размеру`);
            }
          });
        } else {
          console.log(`   ❌ Фото не найдены для: ${query}`);
        }
      } catch (error) {
        console.log(`   ❌ Ошибка поиска: ${error.message}`);
      }
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 === РЕЗУЛЬТАТЫ ПОИСКА ===`);
    console.log(`✅ Всего найдено качественных фото: ${allPhotos.length}`);
    
    // Показываем топ-6 лучших фото
    const topPhotos = allPhotos
      .sort((a, b) => b.size - a.size)
      .slice(0, 6);
    
    console.log(`\n🏆 ТОП-6 ЛУЧШИХ ФОТО:`);
    topPhotos.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.title}`);
      console.log(`   URL: ${photo.url}`);
      console.log(`   Размер: ${photo.width}x${photo.height}`);
      console.log(`   Фотограф: ${photo.photographer}`);
      console.log(`   Источник: ${photo.source}`);
      console.log('');
    });
    
    return topPhotos;
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return [];
  }
}

// Запускаем поиск
searchUnsplashPhotos();
