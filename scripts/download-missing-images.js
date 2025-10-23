/**
 * Скрипт для загрузки недостающих изображений туров
 * Использует Unsplash API для качественных фото
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Недостающие изображения
const missingImages = [
  {
    name: 'similan-islands-main.jpg',
    query: 'similan islands thailand snorkeling',
    // Unsplash photo ID для качественного фото
    unsplashId: 'CIuakYIjadc' // Красивое фото Симиланских островов
  },
  {
    name: 'similan-islands-underwater.jpg',
    query: 'similan islands underwater coral',
    unsplashId: 'Q_Sei-TqSlc' // Подводное фото
  },
  {
    name: 'krabi-4-islands-main.jpg',
    query: 'krabi four islands thailand',
    unsplashId: 'TrhLCn1abMU' // Красивые скалы Краби
  },
  {
    name: 'krabi-railay-beach.jpg',
    query: 'railay beach krabi',
    unsplashId: 'FmB7IdFjRqM' // Railay Beach
  },
  {
    name: 'sunset-cruise-main.jpg',
    query: 'phuket sunset cruise yacht',
    unsplashId: 'RCAhiGJsUUE' // Закат на яхте
  },
  {
    name: 'sunset-cruise-romantic.jpg',
    query: 'romantic sunset cruise phuket',
    unsplashId: 'FIKD9t5_5zQ' // Романтический закат
  }
];

const ASSETS_DIR = path.join(__dirname, '../src/assets');

// Функция для загрузки изображения с Unsplash
function downloadUnsplashImage(photoId, filename) {
  return new Promise((resolve, reject) => {
    // Unsplash API endpoint для загрузки фото в высоком разрешении
    const url = `https://images.unsplash.com/photo-${photoId}?w=1920&q=80&fm=jpg`;
    
    const filePath = path.join(ASSETS_DIR, filename);
    const file = fs.createWriteStream(filePath);
    
    console.log(`📥 Загружаю ${filename}...`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${filename} загружено!`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Основная функция
async function downloadAllImages() {
  console.log('🚀 Начинаю загрузку недостающих изображений...\n');
  
  for (const image of missingImages) {
    try {
      await downloadUnsplashImage(image.unsplashId, image.name);
      // Пауза между запросами чтобы не перегрузить API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Ошибка при загрузке ${image.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Загрузка завершена!');
  console.log(`\n📊 Всего изображений в src/assets: ${fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.jpg')).length}`);
}

// Запуск
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

downloadAllImages().catch(console.error);
