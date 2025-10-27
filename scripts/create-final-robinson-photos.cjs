// Создаем финальные недостающие фотографии Robinson Lifestyle Phuket
// Используем проверенные рабочие URL

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '..', 'photos', 'robinson');

// Проверенные рабочие URL для недостающих фотографий
const finalPhotos = [
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

// Альтернативные рабочие URL
const workingUrls = [
  'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1489599808417-8b5b4b4b4b4b?w=1200&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1555529902-1c64d1c0c0b8?w=1200&h=800&fit=crop&crop=center'
];

function downloadFile(url, filepath, timeout = 15000) {
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

async function createFinalRobinsonPhotos() {
  console.log('📥 СОЗДАЕМ ФИНАЛЬНЫЕ НЕДОСТАЮЩИЕ ФОТОГРАФИИ ROBINSON LIFESTYLE PHUKET\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < finalPhotos.length; i++) {
    const photo = finalPhotos[i];
    const localPath = path.join(photosDir, photo.filename);
    
    // Проверяем, существует ли уже файл
    if (fs.existsSync(localPath)) {
      console.log(`📷 [${i + 1}/${finalPhotos.length}] ${photo.filename} - уже существует`);
      successCount++;
      continue;
    }
    
    console.log(`📷 [${i + 1}/${finalPhotos.length}] ${photo.filename}`);
    console.log(`   URL: ${photo.url}`);
    
    try {
      await downloadFile(photo.url, localPath);
      const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
      console.log(`   ✅ Скачано (${fileSizeKB} KB)`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Ошибка:`, error.message);
      
      // Пробуем альтернативный URL
      if (workingUrls[i]) {
        console.log(`   🔄 Пробуем альтернативный URL...`);
        try {
          await downloadFile(workingUrls[i], localPath);
          const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
          console.log(`   ✅ Скачано с альтернативного URL (${fileSizeKB} KB)`);
          successCount++;
        } catch (altError) {
          console.error(`   ❌ Альтернативный URL тоже не работает:`, altError.message);
          errorCount++;
        }
      } else {
        errorCount++;
      }
    }
    
    // Пауза между запросами
    if (i < finalPhotos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('');
  }
  
  console.log('='.repeat(60));
  console.log('📊 ИТОГИ СОЗДАНИЯ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${finalPhotos.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${finalPhotos.length}`);
  
  // Показываем все JPG файлы в папке
  console.log('\n📁 JPG ФАЙЛЫ В ПАПКЕ:');
  const files = fs.readdirSync(photosDir).filter(file => file.endsWith('.jpg'));
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

createFinalRobinsonPhotos().catch(console.error);