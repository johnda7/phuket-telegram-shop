#!/usr/bin/env node

/**
 * 🚀 СКРИПТ ДЛЯ СКАЧИВАНИЯ ИЗОБРАЖЕНИЙ ПХИ-ПХИ ИЗ GITHUB РЕПОЗИТОРИЯ
 * 
 * Источник: https://github.com/johnda7/island-travel-echo-clone
 * Папка: src/assets/phi-phi-2days/
 * 
 * Всего изображений: 17
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub raw content URL
const GITHUB_RAW = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/phi-phi-2days/';

// Список ВСЕХ 17 изображений из phi-phi-2days
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

// Папка назначения
const OUTPUT_DIR = path.join(__dirname, '../src/assets/phi-phi-tour');

// Создаём папку если не существует
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Создана папка: ${OUTPUT_DIR}`);
}

/**
 * Скачивает файл с GitHub
 */
function downloadImage(filename) {
  return new Promise((resolve, reject) => {
    const url = GITHUB_RAW + filename;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Проверяем существует ли файл
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Пропущено (уже существует): ${filename}`);
      resolve();
      return;
    }

    console.log(`📥 Скачиваю: ${filename}...`);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
          console.log(`✅ Скачано: ${filename} (${sizeKB} KB)`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Редирект - следуем за ним
        https.get(response.headers.location, (redirectResponse) => {
          const fileStream = fs.createWriteStream(outputPath);
          redirectResponse.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
            console.log(`✅ Скачано: ${filename} (${sizeKB} KB)`);
            resolve();
          });
        }).on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode} для ${filename}`));
      }
    }).on('error', reject);
  });
}

/**
 * Основная функция
 */
async function downloadAllImages() {
  console.log('🚀 НАЧИНАЮ СКАЧИВАНИЕ ИЗОБРАЖЕНИЙ ПХИ-ПХИ ИЗ GITHUB');
  console.log('📂 Источник:', GITHUB_RAW);
  console.log('📁 Назначение:', OUTPUT_DIR);
  console.log('🖼️  Всего изображений:', images.length);
  console.log('─'.repeat(60));

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const image of images) {
    try {
      const outputPath = path.join(OUTPUT_DIR, image);
      if (fs.existsSync(outputPath)) {
        skipped++;
      } else {
        downloaded++;
      }
      await downloadImage(image);
      // Задержка между запросами (0.5 сек)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Ошибка при скачивании ${image}:`, error.message);
      errors++;
    }
  }

  console.log('─'.repeat(60));
  console.log('📊 СТАТИСТИКА:');
  console.log(`   ✅ Скачано: ${downloaded}`);
  console.log(`   ⏭️  Пропущено: ${skipped}`);
  console.log(`   ❌ Ошибок: ${errors}`);
  console.log(`   📁 Всего файлов: ${images.length}`);
  console.log('─'.repeat(60));

  if (downloaded > 0) {
    console.log('🎉 Готово! Изображения сохранены в:', OUTPUT_DIR);
    console.log('');
    console.log('📋 СЛЕДУЮЩИЕ ШАГИ:');
    console.log('   1. Проверь изображения: ls -lh src/assets/phi-phi-tour/');
    console.log('   2. Создай файл импортов для Shopify продукта');
    console.log('   3. Добавь тур "Пхи-Пхи 2 дня/1 ночь" через Shopify Admin API');
  }
}

// Запуск
downloadAllImages().catch(console.error);
