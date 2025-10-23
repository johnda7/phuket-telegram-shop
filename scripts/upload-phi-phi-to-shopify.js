#!/usr/bin/env node

/**
 * 🚀 ЗАГРУЗКА ИЗОБРАЖЕНИЙ ПХИ-ПХИ В SHOPIFY
 * Использует простой REST API для загрузки изображений
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shopify credentials
const SHOP_URL = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_API_TOKEN = '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';
const PRODUCT_ID = '7971955343414';

// Папка с изображениями
const IMAGES_DIR = path.join(__dirname, '../src/assets/phi-phi-tour');

// Список изображений
const images = [
  'maya-bay-1.jpg',
  'maya-bay-2.jpg', 
  'maya-bay-3.jpg',
  'maya-bay-4.jpg',
  'mayabay-1.jpg',
  'mayabay-2.jpg',
  'mayabay-3.jpg',
  'mayabay-5.jpg',
  'mayabay-6.jpg',
  'pileh-lagoon.jpg',
  'viking-cave.jpg',
  'bamboo-island.webp',
  'fire-show-1.jpg',
  'fire-show-2.jpg',
  'fire-show-3.jpg',
  'rang-yai-1.jpg',
  'rang-yai-2.jpg'
];

/**
 * Загружает изображение в Shopify через REST API
 */
function uploadImageToProduct(filePath, filename) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename
      }
    });

    const options = {
      hostname: SHOP_URL,
      path: `/admin/api/2025-07/products/${PRODUCT_ID}/images.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Length': Buffer.byteLength(imageData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          resolve(result.image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(imageData);
    req.end();
  });
}

/**
 * Основная функция
 */
async function uploadAllImages() {
  console.log('🚀 ЗАГРУЗКА ИЗОБРАЖЕНИЙ ПХИ-ПХИ В SHOPIFY');
  console.log('📦 Продукт ID:', PRODUCT_ID);
  console.log('📁 Папка:', IMAGES_DIR);
  console.log('🖼️  Всего изображений:', images.length);
  console.log('─'.repeat(60));

  let uploaded = 0;
  let errors = 0;
  let skipped = 0;

  for (const filename of images) {
    try {
      const filePath = path.join(IMAGES_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Пропущено (файл не найден): ${filename}`);
        skipped++;
        continue;
      }

      const fileSizeKB = (fs.statSync(filePath).size / 1024).toFixed(2);
      console.log(`📤 Загружаю: ${filename} (${fileSizeKB} KB)...`);
      
      const result = await uploadImageToProduct(filePath, filename);
      console.log(`   ✅ Загружено! ID: ${result.id}`);
      
      uploaded++;
      
      // Задержка между запросами (2 сек для безопасности)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error.message}`);
      errors++;
    }
  }

  console.log('─'.repeat(60));
  console.log('📊 СТАТИСТИКА:');
  console.log(`   ✅ Загружено: ${uploaded}`);
  console.log(`   ⏭️  Пропущено: ${skipped}`);
  console.log(`   ❌ Ошибок: ${errors}`);
  console.log(`   📁 Всего: ${images.length}`);
  console.log('─'.repeat(60));

  if (uploaded > 0) {
    console.log('🎉 Готово! Изображения добавлены к продукту Пхи-Пхи!');
    console.log('');
    console.log('🔗 Проверь продукт:');
    console.log(`   https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID}`);
  }
}

// Запуск
uploadAllImages().catch(console.error);
