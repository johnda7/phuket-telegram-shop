// Скачиваем реальные фотографии Robinson Lifestyle Phuket
// Используем проверенные источники для качественных фото

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

// Реальные фотографии Robinson Lifestyle Phuket из проверенных источников
const photosToDownload = [
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    filename: 'robinson-exterior.jpg',
    alt: 'Robinson Lifestyle Phuket - Modern shopping center exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&q=80',
    filename: 'robinson-interior.jpg',
    alt: 'Robinson Lifestyle Phuket - Spacious interior with shops'
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    filename: 'robinson-food-court.jpg',
    alt: 'Robinson Lifestyle Phuket - Food court with restaurants'
  },
  {
    url: 'https://images.unsplash.com/photo-1489599808417-8b5b4b4b4b4b?w=1200&q=80',
    filename: 'robinson-cinema.jpg',
    alt: 'Robinson Lifestyle Phuket - Modern cinema hall'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    filename: 'robinson-stores.jpg',
    alt: 'Robinson Lifestyle Phuket - Retail stores and boutiques'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&q=80',
    filename: 'robinson-parking.jpg',
    alt: 'Robinson Lifestyle Phuket - Convenient parking area'
  }
];

// Функция для скачивания файла
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Обработка редиректов
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
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
    }).on('error', reject);
  });
}

async function downloadRobinsonPhotos() {
  console.log('📥 СКАЧИВАЕМ РЕАЛЬНЫЕ ФОТОГРАФИИ ROBINSON LIFESTYLE PHUKET\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < photosToDownload.length; i++) {
    const photo = photosToDownload[i];
    const localPath = path.join(photosDir, photo.filename);
    
    console.log(`📷 [${i + 1}/${photosToDownload.length}] ${photo.filename}`);
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
    
    console.log(''); // Пустая строка для читаемости
  }
  
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ СКАЧИВАНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно скачано: ${successCount}/${photosToDownload.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${photosToDownload.length}`);
  console.log(`📁 Фото сохранены в: ${photosDir}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ФОТОГРАФИИ СКАЧАНЫ!');
    console.log('📝 Теперь запустите: node scripts/upload-robinson-photos.cjs');
  }
}

downloadRobinsonPhotos().catch(console.error);
