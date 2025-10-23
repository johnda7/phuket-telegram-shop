/**
 * Скрипт для загрузки ВСЕХ изображений туров с phukeo.com
 * Использует прямые URL изображений с Shopify CDN
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../src/assets');

// Полный список изображений для тура Пхи-Пхи 2 дня/1 ночь с phukeo.com
const phiPhiImages = [
  {
    name: 'phi-phi-main.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/phi-phi-main.jpg'
  },
  {
    name: 'phi-phi-maya-bay.jpg', 
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/maya-bay.jpg'
  },
  {
    name: 'phi-phi-sunset.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/phi-phi-sunset.jpg'
  },
  {
    name: 'phi-phi-hotel.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/phi-phi-hotel.jpg'
  },
  {
    name: 'phi-phi-snorkeling.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/snorkeling.jpg'
  },
  {
    name: 'phi-phi-beach.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/beach-relax.jpg'
  },
  {
    name: 'phi-phi-viewpoint.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/viewpoint.jpg'
  },
  {
    name: 'phi-phi-kayaking.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/kayaking.jpg'
  },
  {
    name: 'phi-phi-monkey-beach.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/monkey-beach.jpg'
  },
  {
    name: 'phi-phi-bamboo-island.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0743/9572/5924/files/bamboo-island.jpg'
  }
];

// Функция для загрузки изображения
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(ASSETS_DIR, filename);
    
    // Проверяем, существует ли файл
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  ${filename} уже существует, пропускаю...`);
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    console.log(`📥 Загружаю ${filename}...`);
    
    https.get(url, (response) => {
      // Следуем редиректам
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ ${filename} загружено!`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
        return;
      }
      
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
async function downloadAllPhiPhiImages() {
  console.log('🏝️  Загружаю ВСЕ изображения для тура Пхи-Пхи 2 дня/1 ночь...\n');
  
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  
  for (const image of phiPhiImages) {
    try {
      await downloadImage(image.url, image.name);
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Ошибка при загрузке ${image.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Загрузка завершена!');
  
  const phiPhiFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith('phi-phi') && f.endsWith('.jpg'));
  console.log(`\n📊 Всего изображений Пхи-Пхи: ${phiPhiFiles.length}`);
  console.log('Файлы:', phiPhiFiles.join(', '));
}

// Запуск
downloadAllPhiPhiImages().catch(console.error);
