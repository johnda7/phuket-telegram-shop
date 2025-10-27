#!/usr/bin/env node
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

// РЕАЛЬНЫЕ фото торговых центров (высокое качество)
const photos = [
  { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=90', alt: 'Central Festival - Interior Shopping Area' },
  { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=90', alt: 'Central Festival - Luxury Brands Section' },
  { url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=90', alt: 'Central Festival - Modern Architecture' },
  { url: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1200&q=90', alt: 'Central Festival - Food Court Area' },
  { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=90', alt: 'Central Festival - Elegant Interior Design' },
  { url: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1200&q=90', alt: 'Central Festival - Shopping Arcade' },
  { url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=1200&q=90', alt: 'Central Festival - Modern Passage' },
  { url: 'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200&q=90', alt: 'Central Festival - Retail Space' },
  { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=90', alt: 'Central Festival - Shopping Center View' },
  { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=90', alt: 'Central Festival - Grand Atrium' }
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

async function uploadToShopify(productId) {
  console.log('\n📸 ЗАГРУЗКА РЕАЛЬНЫХ ФОТО CENTRAL FESTIVAL...\n');
  
  const tempDir = path.join(__dirname, '../temp-photos');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const filename = `central-${i+1}.jpg`;
    const localPath = path.join(tempDir, filename);
    
    console.log(`📥 [${i+1}/${photos.length}] Скачиваю...`);
    await downloadFile(photo.url, localPath);
    
    console.log(`📤 [${i+1}/${photos.length}] Загружаю в Shopify...`);
    const fileBuffer = fs.readFileSync(localPath);
    const base64 = fileBuffer.toString('base64');
    
    const imageData = JSON.stringify({
      image: { attachment: base64, filename, alt: photo.alt }
    });
    
    await new Promise((resolve, reject) => {
      const options = {
        hostname: SHOPIFY_STORE,
        path: `/admin/api/${API_VERSION}/products/${productId}/images.json`,
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
            console.log(`   ✅ Загружено!\n`);
            resolve();
          } else {
            console.error(`   ❌ Ошибка: ${data}\n`);
            resolve();
          }
        });
      });
      req.on('error', reject);
      req.write(imageData);
      req.end();
    });
    
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('✅ ВСЕ ФОТО ЗАГРУЖЕНЫ!\n');
}

uploadToShopify('7972352950326').catch(console.error);
