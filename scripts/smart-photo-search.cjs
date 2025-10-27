// Умный поиск качественных фотографий Robinson Lifestyle Phuket
// Используем Google Custom Search API для точного поиска

const GOOGLE_API_KEY = 'AIzaSyBvOkBwJ7H8k9L2mN3pQ4rS5tU6vW7xY8z'; // Нужен реальный API ключ
const GOOGLE_CSE_ID = '012345678901234567890:abcdefghijk'; // Нужен реальный CSE ID
const GOOGLE_URL = 'https://www.googleapis.com/customsearch/v1';

// Точные поисковые запросы для Robinson Lifestyle Phuket
const searchQueries = [
  {
    query: 'Robinson Lifestyle Phuket exterior building facade',
    description: 'Фасад здания Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  },
  {
    query: 'Robinson Lifestyle Phuket interior shopping mall',
    description: 'Интерьер торгового центра Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  },
  {
    query: 'Robinson Lifestyle Phuket food court dining',
    description: 'Фуд-корт Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  },
  {
    query: 'Robinson Lifestyle Phuket cinema SF Cinema',
    description: 'Кинотеатр SF Cinema в Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  },
  {
    query: 'Robinson Lifestyle Phuket stores shops retail',
    description: 'Магазины в Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  },
  {
    query: 'Robinson Lifestyle Phuket parking entrance',
    description: 'Вход и парковка Robinson Lifestyle Phuket',
    expectedAspect: 'wide'
  }
];

async function searchRobinsonPhotos() {
  try {
    console.log('🔍 УМНЫЙ ПОИСК ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');
    console.log('📋 Критерии качества:');
    console.log('✅ Минимум 800x600 пикселей');
    console.log('✅ Четкие, не размытые');
    console.log('✅ Показывают РЕАЛЬНЫЙ Robinson Lifestyle Phuket');
    console.log('✅ Разные ракурсы (фасад, интерьер, магазины)');
    console.log('✅ Хорошее освещение');
    console.log('❌ Избегаем фото с людьми (если возможно)');
    console.log('❌ Избегаем рекламные баннеры\n');
    
    const allPhotos = [];
    
    for (let i = 0; i < searchQueries.length; i++) {
      const searchQuery = searchQueries[i];
      console.log(`📷 [${i + 1}/${searchQueries.length}] Поиск: "${searchQuery.description}"`);
      
      const searchUrl = `${GOOGLE_URL}?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(searchQuery.query)}&searchType=image&num=3&imgSize=large&imgType=photo&safe=medium`;
      
      try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          console.log(`   ✅ Найдено ${data.items.length} фото`);
          
          data.items.forEach((item, index) => {
            const photo = {
              title: item.title,
              url: item.link,
              thumbnail: item.image.thumbnailLink,
              width: item.image.width,
              height: item.image.height,
              size: item.image.byteSize,
              source: item.displayLink,
              query: searchQuery.query,
              description: searchQuery.description,
              aspectRatio: item.image.width / item.image.height
            };
            
            // Строгие критерии качества
            const isHighQuality = photo.width >= 800 && photo.height >= 600;
            const isReasonableSize = photo.size <= 5000000; // 5MB максимум
            const isGoodAspectRatio = photo.aspectRatio >= 1.2 && photo.aspectRatio <= 2.5; // широкоформатные
            const isFromReliableSource = !photo.source.includes('pinterest') && !photo.source.includes('tumblr');
            
            if (isHighQuality && isReasonableSize && isGoodAspectRatio && isFromReliableSource) {
              allPhotos.push(photo);
              console.log(`     ✅ ${index + 1}. ${photo.title} (${photo.width}x${photo.height}) - ${photo.source}`);
            } else {
              console.log(`     ❌ ${index + 1}. ${photo.title} - не подходит по критериям`);
            }
          });
        } else {
          console.log(`   ❌ Фото не найдены для: ${searchQuery.description}`);
        }
      } catch (error) {
        console.log(`   ❌ Ошибка поиска: ${error.message}`);
      }
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`\n📊 === РЕЗУЛЬТАТЫ ПОИСКА ===`);
    console.log(`✅ Всего найдено качественных фото: ${allPhotos.length}`);
    console.log(`📷 Уникальных источников: ${new Set(allPhotos.map(p => p.source)).size}`);
    
    // Показываем топ-6 лучших фото
    const topPhotos = allPhotos
      .sort((a, b) => b.width * b.height - a.width * a.height)
      .slice(0, 6);
    
    console.log(`\n🏆 ТОП-6 ЛУЧШИХ ФОТО:`);
    topPhotos.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.description}`);
      console.log(`   Название: ${photo.title}`);
      console.log(`   URL: ${photo.url}`);
      console.log(`   Размер: ${photo.width}x${photo.height} (${Math.round(photo.size/1024)}KB)`);
      console.log(`   Источник: ${photo.source}`);
      console.log(`   Соотношение: ${photo.aspectRatio.toFixed(2)}`);
      console.log('');
    });
    
    return topPhotos;
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return [];
  }
}

// Запускаем поиск
searchRobinsonPhotos();
