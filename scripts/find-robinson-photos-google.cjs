// Поиск фотографий Robinson Lifestyle Phuket через Google Images
// Генерируем ссылки для ручного поиска и скачивания

const searchQueries = [
  'Robinson Lifestyle Phuket exterior facade building',
  'Robinson Lifestyle Phuket interior shopping mall inside',
  'Robinson Lifestyle Phuket stores shops retail',
  'Robinson Lifestyle Phuket food court restaurant dining',
  'Robinson Lifestyle Phuket cinema movie theater SF',
  'Robinson Lifestyle Phuket parking entrance main door'
];

console.log('🔍 ПОИСК ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');
console.log('📋 Инструкции:');
console.log('1. Откройте каждую ссылку ниже в новой вкладке');
console.log('2. Найдите 1-2 лучших фото для каждого запроса');
console.log('3. Скачайте фото в папку photos/robinson/');
console.log('4. Переименуйте файлы: robinson-1.jpg, robinson-2.jpg и т.д.');
console.log('5. Убедитесь, что фото показывают реальный Robinson Lifestyle Phuket\n');

console.log('🔗 ССЫЛКИ ДЛЯ ПОИСКА:\n');

searchQueries.forEach((query, index) => {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:l,ic:photo`;
  console.log(`${index + 1}. ${query}`);
  console.log(`   ${googleUrl}\n`);
});

console.log('📁 Папка для фото: photos/robinson/');
console.log('🎯 КРИТЕРИИ ОТБОРА ФОТО:');
console.log('✅ Минимум 800x600 пикселей');
console.log('✅ Четкие, не размытые');
console.log('✅ Показывают реальный Robinson Lifestyle Phuket');
console.log('✅ Разные ракурсы (фасад, интерьер, магазины)');
console.log('✅ Хорошее освещение');
console.log('❌ Избегайте фото с людьми (если возможно)');
console.log('❌ Избегайте рекламные баннеры');

console.log('\n📝 После скачивания запустите:');
console.log('node scripts/upload-robinson-photos.cjs');

console.log('\n🎯 АЛЬТЕРНАТИВНЫЕ ИСТОЧНИКИ:');
console.log('• TripAdvisor: https://www.tripadvisor.com/Attraction_Review-g293920-d1234567-Reviews-Robinson_Lifestyle_Phuket-Phuket.html');
console.log('• Instagram: #robinsonlifestylephuket');
console.log('• Facebook: Robinson Lifestyle Phuket');
console.log('• Официальный сайт: https://www.robinson.co.th/');
