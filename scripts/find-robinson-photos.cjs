// Поиск фотографий Robinson Lifestyle Phuket через Google Custom Search API
// Используем встроенный fetch

const GOOGLE_API_KEY = 'AIzaSyBvOkBwJ7H8k9L2mN3pQ4rS5tU6vW7xY8z'; // Замените на ваш API ключ
const GOOGLE_CSE_ID = '012345678901234567890:abcdefghijk'; // Замените на ваш CSE ID
const GOOGLE_URL = 'https://www.googleapis.com/customsearch/v1';

async function findRobinsonPhotos() {
  try {
    console.log('🔍 Ищем фотографии Robinson Lifestyle Phuket...\n');
    
    // Поисковые запросы для разных ракурсов
    const searchQueries = [
      'Robinson Lifestyle Phuket exterior facade',
      'Robinson Lifestyle Phuket interior shopping mall',
      'Robinson Lifestyle Phuket stores shops',
      'Robinson Lifestyle Phuket food court restaurant',
      'Robinson Lifestyle Phuket cinema movie theater',
      'Robinson Lifestyle Phuket parking entrance'
    ];
    
    const allPhotos = [];
    
    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`📷 [${i + 1}/${searchQueries.length}] Поиск: "${query}"`);
      
      const searchUrl = `${GOOGLE_URL}?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=3&imgSize=large&imgType=photo`;
      
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
              query: query
            };
            
            // Фильтруем по качеству
            if (photo.width >= 800 && photo.height >= 600 && photo.size <= 2000000) {
              allPhotos.push(photo);
              console.log(`     ${index + 1}. ${photo.title} (${photo.width}x${photo.height})`);
            } else {
              console.log(`     ${index + 1}. ${photo.title} - слишком маленькое или большое`);
            }
          });
        } else {
          console.log(`   ❌ Фото не найдены`);
        }
      } catch (error) {
        console.log(`   ❌ Ошибка поиска: ${error.message}`);
      }
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      console.log(`${index + 1}. ${photo.title}`);
      console.log(`   URL: ${photo.url}`);
      console.log(`   Размер: ${photo.width}x${photo.height} (${Math.round(photo.size/1024)}KB)`);
      console.log(`   Источник: ${photo.source}`);
      console.log(`   Запрос: ${photo.query}`);
      console.log('');
    });
    
    return topPhotos;
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return [];
  }
}

// Запускаем поиск
findRobinsonPhotos();
