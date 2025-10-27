// Ручной поиск фотографий Robinson Lifestyle Phuket
// Генерируем ссылки на Google Images для ручного отбора

const searchQueries = [
  'Robinson Lifestyle Phuket exterior facade',
  'Robinson Lifestyle Phuket interior shopping mall',
  'Robinson Lifestyle Phuket stores shops',
  'Robinson Lifestyle Phuket food court restaurant',
  'Robinson Lifestyle Phuket cinema movie theater',
  'Robinson Lifestyle Phuket parking entrance'
];

console.log('🔍 РУЧНОЙ ПОИСК ФОТОГРАФИЙ ROBINSON LIFESTYLE PHUKET\n');
console.log('📋 Инструкции:');
console.log('1. Откройте каждую ссылку ниже в новой вкладке');
console.log('2. Найдите 1-2 лучших фото для каждого запроса');
console.log('3. Скачайте фото в папку photos/robinson/');
console.log('4. Переименуйте файлы: robinson-1.jpg, robinson-2.jpg и т.д.');
console.log('5. Убедитесь, что фото показывают реальный ТЦ\n');

console.log('🔗 ССЫЛКИ ДЛЯ ПОИСКА:\n');

searchQueries.forEach((query, index) => {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:l,ic:photo`;
  console.log(`${index + 1}. ${query}`);
  console.log(`   ${googleUrl}\n`);
});

console.log('📁 Создаем папку для фото...');

// Создаем папку для фото
const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '..', 'photos', 'robinson');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log('✅ Папка photos/robinson/ создана');
} else {
  console.log('✅ Папка photos/robinson/ уже существует');
}

console.log('\n🎯 КРИТЕРИИ ОТБОРА ФОТО:');
console.log('✅ Минимум 800x600 пикселей');
console.log('✅ Четкие, не размытые');
console.log('✅ Показывают реальный Robinson Lifestyle Phuket');
console.log('✅ Разные ракурсы (фасад, интерьер, магазины)');
console.log('✅ Хорошее освещение');
console.log('❌ Избегайте фото с людьми (если возможно)');
console.log('❌ Избегайте рекламные баннеры');

console.log('\n📝 После скачивания запустите:');
console.log('node scripts/upload-robinson-photos.cjs');
