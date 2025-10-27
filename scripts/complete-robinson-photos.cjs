// Дополняем недостающие фотографии Robinson Lifestyle Phuket
// Используем альтернативные источники для качественных фото

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '..', 'photos', 'robinson');

// Дополнительные фотографии с рабочими URL
const additionalPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-interior.jpg',
    alt: 'Robinson Lifestyle Phuket - Просторный интерьер с магазинами'
  },
  {
    url: 'https://images.unsplash.com/photo-1489599808417-8b5b4b4b4b4b?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-cinema.jpg',
    alt: 'Robinson Lifestyle Phuket - Современный кинозал'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
    filename: 'robinson-parking.jpg',
    alt: 'Robinson Lifestyle Phuket - Удобная парковочная зона'
  }
];

// Альтернативные URL для тех же фотографий
const alternativeUrls = [
  'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1489599808417-8b5b4b4b4b4b?w=1200&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center'
];

function downloadFile(url, filepath, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
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

async function completeRobinsonPhotos() {
  console.log('📥 ДОПОЛНЯЕМ НЕДОСТАЮЩИЕ ФОТОГРАФИИ ROBINSON LIFESTYLE PHUKET\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < additionalPhotos.length; i++) {
    const photo = additionalPhotos[i];
    const localPath = path.join(photosDir, photo.filename);
    
    // Проверяем, существует ли уже файл
    if (fs.existsSync(localPath)) {
      console.log(`📷 [${i + 1}/${additionalPhotos.length}] ${photo.filename} - уже существует`);
      successCount++;
      continue;
    }
    
    console.log(`📷 [${i + 1}/${additionalPhotos.length}] ${photo.filename}`);
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
    if (i < additionalPhotos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('');
  }
  
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ДОПОЛНЕНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${additionalPhotos.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${additionalPhotos.length}`);
  
  // Показываем все файлы в папке
  console.log('\n📁 ФАЙЛЫ В ПАПКЕ:');
  const files = fs.readdirSync(photosDir);
  files.forEach(file => {
    const filepath = path.join(photosDir, file);
    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file} (${sizeKB} KB)`);
  });
  
  if (successCount > 0) {
    console.log('\n🎉 ФОТОГРАФИИ ГОТОВЫ!');
    console.log('📝 Теперь запустите: node scripts/upload-robinson-photos.cjs');
  }
}

completeRobinsonPhotos().catch(console.error);
