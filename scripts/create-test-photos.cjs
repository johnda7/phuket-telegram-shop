// Создание тестовых фотографий для Robinson Lifestyle Phuket
// Временные placeholder изображения для тестирования системы

const fs = require('fs');
const path = require('path');

// Создаем папку для фотографий
const photosDir = path.join(__dirname, '..', 'photos', 'robinson');

if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log('✅ Папка photos/robinson/ создана');
}

// Создаем 6 тестовых SVG изображений
const testPhotos = [
  {
    filename: 'robinson-1.jpg',
    title: 'Robinson Lifestyle Phuket - Фасад здания',
    description: 'Современный фасад торгового центра Robinson Lifestyle Phuket'
  },
  {
    filename: 'robinson-2.jpg',
    title: 'Robinson Lifestyle Phuket - Интерьер',
    description: 'Просторный интерьер торгового центра с магазинами'
  },
  {
    filename: 'robinson-3.jpg',
    title: 'Robinson Lifestyle Phuket - Фуд-корт',
    description: 'Фуд-корт с разнообразными ресторанами и кафе'
  },
  {
    filename: 'robinson-4.jpg',
    title: 'Robinson Lifestyle Phuket - Кинотеатр',
    description: 'Современный кинотеатр SF Cinema'
  },
  {
    filename: 'robinson-5.jpg',
    title: 'Robinson Lifestyle Phuket - Магазины',
    description: 'Разнообразные магазины и бутики'
  },
  {
    filename: 'robinson-6.jpg',
    title: 'Robinson Lifestyle Phuket - Парковка',
    description: 'Удобная парковка и вход в торговый центр'
  }
];

console.log('🖼️ Создаем тестовые фотографии для Robinson Lifestyle Phuket...\n');

testPhotos.forEach((photo, index) => {
  const filePath = path.join(photosDir, photo.filename);
  
  // Создаем SVG placeholder
  const svgContent = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad1)"/>
  <rect x="50" y="50" width="700" height="500" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="20"/>
  <text x="400" y="280" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
    ${photo.title}
  </text>
  <text x="400" y="320" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="rgba(255,255,255,0.8)">
    ${photo.description}
  </text>
  <text x="400" y="500" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.6)">
    Placeholder Image - Replace with Real Photo
  </text>
</svg>`;
  
  // Сохраняем как SVG (будет работать как изображение)
  fs.writeFileSync(filePath.replace('.jpg', '.svg'), svgContent);
  
  console.log(`✅ Создано: ${photo.filename.replace('.jpg', '.svg')}`);
  console.log(`   ${photo.title}`);
  console.log(`   ${photo.description}\n`);
});

console.log('📁 Тестовые фотографии созданы в папке: photos/robinson/');
console.log('📝 Теперь можно запустить загрузку в Shopify:');
console.log('node scripts/upload-robinson-photos.cjs');
console.log('\n💡 ВАЖНО: Замените эти placeholder изображения на реальные фотографии!');
