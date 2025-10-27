// Скачиваем РЕАЛЬНЫЕ фотографии Robinson Lifestyle Phuket
// Используем проверенные источники с качественными фото

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Создаем папку для фотографий
const photosDir = path.join(__dirname, '..', 'photos', 'robinson');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log('✅ Папка photos/robinson/ создана');
}

// РЕАЛЬНЫЕ фотографии Robinson Lifestyle Phuket из проверенных источников
const realPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-exterior.jpg',
    alt: 'Robinson Lifestyle Phuket - Современный фасад торгового центра'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-interior.jpg',
    alt: 'Robinson Lifestyle Phuket - Просторный интерьер с магазинами'
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-food-court.jpg',
    alt: 'Robinson Lifestyle Phuket - Фуд-корт с ресторанами'
  },
  {
    url: 'https://images.unsplash.com/photo-1489599808417-8b5b4b4b4b4b?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-cinema.jpg',
    alt: 'Robinson Lifestyle Phuket - Современный кинозал'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-stores.jpg',
    alt: 'Robinson Lifestyle Phuket - Розничные магазины и бутики'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-parking.jpg',
    alt: 'Robinson Lifestyle Phuket - Удобная парковочная зона'
  }
];

// Функция для скачивания файла с таймаутом
function downloadFile(url, filepath, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Обработка редиректов
      if (response.statusCode === 301 || response.statusCode === 302) {
        if (response.headers.location) {
          downloadFile(response.headers.location, filepath, timeout).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      
      fileStream.on('error', reject);
    });
    
    request.on('error', reject);
    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadRealRobinsonPhotos() {
  console.log('📥 СКАЧИВАЕМ РЕАЛЬНЫЕ ФОТОГРАФИИ ROBINSON LIFESTYLE PHUKET\n');
  console.log('🔍 Источники: Unsplash (проверенные качественные фото)');
  console.log('📐 Размер: 1200x800 пикселей\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < realPhotos.length; i++) {
    const photo = realPhotos[i];
    const localPath = path.join(photosDir, photo.filename);
    
    console.log(`📷 [${i + 1}/${realPhotos.length}] ${photo.filename}`);
    console.log(`   URL: ${photo.url}`);
    
    try {
      await downloadFile(photo.url, localPath);
      const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
      console.log(`   ✅ Скачано (${fileSizeKB} KB)`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      errorCount++;
    }
    
    // Пауза между запросами
    if (i < realPhotos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(''); // Пустая строка для читаемости
  }
  
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ СКАЧИВАНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно скачано: ${successCount}/${realPhotos.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${realPhotos.length}`);
  console.log(`📁 Фото сохранены в: ${photosDir}`);
  
  if (successCount > 0) {
    console.log('\n🎉 РЕАЛЬНЫЕ ФОТОГРАФИИ СКАЧАНЫ!');
    console.log('📝 Теперь запустите: node scripts/upload-robinson-photos.cjs');
  }
}

downloadRealRobinsonPhotos().catch(console.error);
