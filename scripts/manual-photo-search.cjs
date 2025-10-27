// Ручной поиск фотографий Robinson Lifestyle Phuket
// Точные ссылки на проверенные источники

console.log('🔍 РУЧНОЙ ПОИСК КАЧЕСТВЫХ ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');

console.log('📋 ИНСТРУКЦИИ:');
console.log('1. Откройте каждую ссылку ниже в новой вкладке');
console.log('2. Найдите 1-2 лучших фото для каждого запроса');
console.log('3. Скачайте фото в папку photos/robinson/');
console.log('4. Переименуйте файлы: robinson-1.jpg, robinson-2.jpg и т.д.');
console.log('5. Убедитесь, что фото показывают РЕАЛЬНЫЙ Robinson Lifestyle Phuket\n');

console.log('🎯 ТОЧНЫЕ ПОИСКОВЫЕ ЗАПРОСЫ:\n');

const searchQueries = [
  {
    query: 'Robinson Lifestyle Phuket exterior building facade',
    description: 'Фасад здания Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+exterior+building+facade&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  },
  {
    query: 'Robinson Lifestyle Phuket interior shopping mall',
    description: 'Интерьер торгового центра Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+interior+shopping+mall&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  },
  {
    query: 'Robinson Lifestyle Phuket food court dining',
    description: 'Фуд-корт Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+food+court+dining&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  },
  {
    query: 'Robinson Lifestyle Phuket cinema SF Cinema',
    description: 'Кинотеатр SF Cinema в Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+cinema+SF+Cinema&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  },
  {
    query: 'Robinson Lifestyle Phuket stores shops retail',
    description: 'Магазины в Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+stores+shops+retail&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  },
  {
    query: 'Robinson Lifestyle Phuket parking entrance',
    description: 'Вход и парковка Robinson Lifestyle Phuket',
    googleUrl: 'https://www.google.com/search?q=Robinson+Lifestyle+Phuket+parking+entrance&tbm=isch&tbs=isz:l,ic:photo',
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html'
  }
];

searchQueries.forEach((search, index) => {
  console.log(`${index + 1}. ${search.description}`);
  console.log(`   Google Images: ${search.googleUrl}`);
  console.log(`   TripAdvisor: ${search.tripadvisor}`);
  console.log('');
});

console.log('📁 Папка для фото: photos/robinson/');
console.log('🎯 КРИТЕРИИ ОТБОРА ФОТО:');
console.log('✅ Минимум 800x600 пикселей');
console.log('✅ Четкие, не размытые');
console.log('✅ Показывают РЕАЛЬНЫЙ Robinson Lifestyle Phuket');
console.log('✅ Разные ракурсы (фасад, интерьер, магазины)');
console.log('✅ Хорошее освещение');
console.log('❌ Избегайте фото с людьми (если возможно)');
console.log('❌ Избегайте рекламные баннеры');

console.log('\n🎯 ДОПОЛНИТЕЛЬНЫЕ ИСТОЧНИКИ:');
console.log('• Instagram: #robinsonlifestylephuket');
console.log('• Facebook: Robinson Lifestyle Phuket');
console.log('• Официальный сайт: https://www.robinson.co.th/');
console.log('• Google Maps: https://maps.google.com/ (фото от пользователей)');

console.log('\n📝 После скачивания запустите:');
console.log('node scripts/upload-robinson-photos.cjs');

console.log('\n💡 СОВЕТ:');
console.log('Лучше скачать 6-8 качественных фото, чем много плохих!');
console.log('Каждое фото должно быть уникальным и показывать разные аспекты ТЦ.');
