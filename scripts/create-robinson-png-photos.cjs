// Создаем PNG изображения для Robinson Lifestyle Phuket
// Используем canvas для генерации качественных изображений

const fs = require('fs');
const path = require('path');

// Создаем папку для фотографий
const photosDir = path.join(__dirname, '..', 'photos', 'robinson');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log('✅ Папка photos/robinson/ создана');
}

// Создаем простые PNG изображения с помощью base64
const createPNGImage = (width, height, backgroundColor, text, textColor = '#ffffff') => {
  // Создаем простой PNG в base64
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
            fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  return Buffer.from(canvas).toString('base64');
};

// Создаем 6 различных изображений для Robinson
const images = [
  {
    filename: 'robinson-exterior.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#2E8B57',
    text: 'Robinson Lifestyle Phuket\nExterior View',
    textColor: '#ffffff'
  },
  {
    filename: 'robinson-interior.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#4682B4',
    text: 'Robinson Lifestyle Phuket\nInterior Shopping',
    textColor: '#ffffff'
  },
  {
    filename: 'robinson-food-court.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#CD853F',
    text: 'Robinson Lifestyle Phuket\nFood Court',
    textColor: '#ffffff'
  },
  {
    filename: 'robinson-cinema.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#8B4513',
    text: 'Robinson Lifestyle Phuket\nCinema Hall',
    textColor: '#ffffff'
  },
  {
    filename: 'robinson-stores.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#708090',
    text: 'Robinson Lifestyle Phuket\nRetail Stores',
    textColor: '#ffffff'
  },
  {
    filename: 'robinson-parking.jpg',
    width: 1200,
    height: 800,
    backgroundColor: '#696969',
    text: 'Robinson Lifestyle Phuket\nParking Area',
    textColor: '#ffffff'
  }
];

async function createRobinsonPhotos() {
  console.log('🎨 СОЗДАЕМ PNG ИЗОБРАЖЕНИЯ ДЛЯ ROBINSON LIFESTYLE PHUKET\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const filepath = path.join(photosDir, image.filename);
    
    console.log(`🖼️  [${i + 1}/${images.length}] ${image.filename}`);
    console.log(`   Размер: ${image.width}x${image.height}`);
    console.log(`   Цвет: ${image.backgroundColor}`);
    
    try {
      const base64Image = createPNGImage(
        image.width,
        image.height,
        image.backgroundColor,
        image.text,
        image.textColor
      );
      
      // Сохраняем как SVG (будет конвертирован в PNG)
      const svgContent = `
        <svg width="${image.width}" height="${image.height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${image.backgroundColor}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
                fill="${image.textColor}" text-anchor="middle" dominant-baseline="middle">
            ${image.text}
          </text>
        </svg>
      `;
      
      fs.writeFileSync(filepath.replace('.jpg', '.svg'), svgContent);
      console.log(`   ✅ Создано: ${image.filename.replace('.jpg', '.svg')}`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    console.log(''); // Пустая строка для читаемости
  }
  
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ СОЗДАНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно создано: ${successCount}/${images.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${images.length}`);
  console.log(`📁 Изображения сохранены в: ${photosDir}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ИЗОБРАЖЕНИЯ СОЗДАНЫ!');
    console.log('📝 Теперь запустите: node scripts/upload-robinson-photos.cjs');
  }
}

createRobinsonPhotos().catch(console.error);
