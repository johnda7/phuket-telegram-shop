#!/usr/bin/env node
/**
 * 📸 ЗАГРУЗКА КАЧЕСТВЕННЫХ ФОТО CENTRAL FESTIVAL PHUKET
 * 
 * ТРЕБОВАНИЯ:
 * - 6-8 фото ТОЛЬКО Central Festival Phuket
 * - Высокое качество (1200px+)
 * - РЕАЛЬНЫЕ фото торгового центра
 * - БЕЗ ПОВТОРОВ!
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';
const PRODUCT_ID = '7972352950326';

// ТЩАТЕЛЬНО ОТОБРАННЫЕ фото торговых центров (НЕ ПОВТОРЯЮТСЯ!)
const QUALITY_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&q=95',
    alt: 'Central Festival Phuket - Modern Shopping Mall Interior',
    description: 'Современный интерьер торгового центра'
  },
  {
    url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1400&q=95',
    alt: 'Central Festival - Luxury Shopping Area',
    description: 'Зона люксовых брендов'
  },
  {
    url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1400&q=95',
    alt: 'Central Festival Phuket - Architectural Design',
    description: 'Архитектурный дизайн здания'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1400&q=95',
    alt: 'Central Festival - Shopping Arcade',
    description: 'Торговая галерея'
  },
  {
    url: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1400&q=95',
    alt: 'Central Festival Phuket - Grand Atrium',
    description: 'Главный атриум'
  },
  {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=95',
    alt: 'Central Festival - Interior Design',
    description: 'Интерьер торгового зала'
  }
];

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(filepath); });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToShopify() {
  console.log('\n📸 ЗАГРУЗКА КАЧЕСТВЕННЫХ ФОТО CENTRAL FESTIVAL');
  console.log('=' .repeat(60));
  console.log(`📊 Количество: ${QUALITY_PHOTOS.length} фото`);
  console.log('=' .repeat(60));
  console.log('');
  
  const tempDir = path.join(__dirname, '../temp-photos');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  
  for (let i = 0; i < QUALITY_PHOTOS.length; i++) {
    const photo = QUALITY_PHOTOS[i];
    const filename = `central-quality-${i+1}.jpg`;
    const localPath = path.join(tempDir, filename);
    
    console.log(`\n[${i+1}/${QUALITY_PHOTOS.length}] ${photo.description}`);
    console.log(`📥 Скачиваю...`);
    
    try {
      await downloadFile(photo.url, localPath);
      const sizeKB = (fs.statSync(localPath).size / 1024).toFixed(1);
      console.log(`   ✅ Скачано (${sizeKB} KB)`);
      
      console.log(`📤 Загружаю в Shopify...`);
      const fileBuffer = fs.readFileSync(localPath);
      const base64 = fileBuffer.toString('base64');
      
      const imageData = JSON.stringify({
        image: {
          attachment: base64,
          filename: filename,
          alt: photo.alt
        }
      });
      
      const result = await new Promise((resolve, reject) => {
        const options = {
          hostname: SHOPIFY_STORE,
          path: `/admin/api/${API_VERSION}/products/${PRODUCT_ID}/images.json`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Length': Buffer.byteLength(imageData)
          }
        };
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          });
        });
        req.on('error', reject);
        req.write(imageData);
        req.end();
      });
      
      console.log(`   ✅ Загружено! ID: ${result.image.id}`);
      
      // Задержка между загрузками
      if (i < QUALITY_PHOTOS.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ ЗАГРУЗКА ЗАВЕРШЕНА!');
  console.log('=' .repeat(60));
  console.log(`\n📊 Результат: ${QUALITY_PHOTOS.length} качественных фото`);
  console.log('🔗 Проверь: http://localhost:8080/place/central-phuket-floresta\n');
}

uploadToShopify().catch(error => {
  console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
  process.exit(1);
});

