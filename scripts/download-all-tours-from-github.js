#!/usr/bin/env node

/**
 * 🚀 МАСТЕР-СКРИПТ ДЛЯ СКАЧИВАНИЯ ВСЕХ ИЗОБРАЖЕНИЙ ТУРОВ
 * 
 * Скачивает изображения для ВСЕХ 10 туров из GitHub репозитория
 * https://github.com/johnda7/island-travel-echo-clone
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub raw content URL
const GITHUB_RAW = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/';

// Конфигурация туров с их папками и изображениями
const TOURS = {
  'james-bond-island': {
    folder: '',  // Изображения в корне assets
    images: [
      'james-1-CrrUEsJ1.jpg',
      'james-2-Voq4mfXH.jpg',
      'james-3-CZncWmAG.webp',
      'james-4-BKlK7Ymz.webp',
      'james-5-DsMmvbXh.webp',
      'james-6-DKlj8kUA.webp',
      'james-7-B5bdZZ8d.webp'
    ]
  },
  'pearls-andaman-sea': {
    folder: 'pearls-andaman-sea',
    images: [
      'gallery-01-railay-main.jpg',
      'gallery-02-railay-beach.jpg',
      'gallery-03-railay-cave.jpg',
      'gallery-04-pranang-beach.jpg',
      'gallery-05-hong-island.jpg',
      'gallery-06-hong-lagoon.jpg',
      'gallery-07-phi-phi-viewpoint.jpg',
      'gallery-08-maya-bay.jpg'
    ]
  },
  'similan-islands': {
    folder: 'similan-islands',
    images: Array.from({length: 34}, (_, i) => `similan-${i + 1}.jpg`)
  },
  'eleven-islands-mega': {
    folder: 'eleven-islands-mega',
    images: [
      'hero-1.jpg',
      'eleven-1.jpg',
      'maya-bay1.jpg',
      'pileh-lagoon.jpg',
      'viking-cave.jpg',
      'koh-panyi.jpg',
      'canoeing-talu-island.jpg',
      'phi-phi-don.jpg'
    ]
  },
  'rafting-spa-atv': {
    folder: 'rafting-spa-atv',
    images: [
      'rafting21-scaled.jpg',
      'rafting-1.jpg',
      'rafting-2.jpg',
      'atv-1-scaled.jpg',
      'zipline-scaled.jpg',
      'cave-scaled.jpg',
      'park-scaled.jpg',
      'lake1-scaled.jpg',
      'bangkaew-elephant-park11.jpg',
      'waterfall-1.jpg',
      'monkeys-at-suwan-khuha-temple-1.webp',
      'statue-of-the-reclining-buddha.webp',
      'hot-spring-1.jpg'
    ]
  },
  'racha-coral': {
    folder: '',
    images: [
      'racha-1-DwZ8WjdT.jpg',
      'racha-2-BKfxsujF.jpg',
      'racha-3-CZ_Kbhe2.jpg',
      'racha-4-B5VlPWtf.jpg',
      'racha-5-CAlh4KIS.jpg',
      'racha-6-Ds0BZqr0.jpg',
      'racha-7-CUcG9cME.jpg',
      'racha-8-DdvCJ_Cg.jpg',
      'racha-9-BwiEFStW.jpg',
      'racha-10-KRAnqfNA.jpg'
    ]
  },
  'dostoprimechatelnosti-phuketa': {
    folder: 'dostoprimechatelnosti-phuketa',
    images: [
      'big-buddha-viewpoint.jpg',
      'wat-chalong-main.jpg',
      'wat-chalong-1.jpg',
      'wat-chalong-2.jpg',
      'old-town-main.jpg',
      'old-town-1.jpg',
      'promthep-cape-main.jpg',
      'karon-viewpoint-main.jpg',
      'karon-viewpoint-1.jpg',
      'karon-viewpoint-2.jpg',
      'rang-hill-main.jpg',
      'rang-hill-1.jpg',
      'windmill-viewpoint-main.jpg',
      'windmill-viewpoint-1.jpg',
      'windmill-viewpoint-2.jpg',
      'elephant-feeding-main.jpg',
      'elephant-feeding-1.jpg'
    ]
  },
  'kao-lak-safari': {
    folder: 'kao-lak-safari',
    images: [
      '6798780e8ebf0-17645-1200-800.jpg',
      'airplane-beach-main.jpg',
      'the-hotspring-beach-resort-spa-1.jpeg',
      'cape-promthep.jpg',
      'snimok-jekrana-2025-09-06-v-20.53.08.png',
      'snimok-jekrana-2025-09-06-v-20.53.32.png',
      'snimok-jekrana-2025-09-06-v-20.53.44.png',
      'snimok-jekrana-2025-09-06-v-20.53.58.png',
      'snimok-jekrana-2025-09-06-v-20.54.16.png'
    ]
  },
  'avatar-plus-hangdong': {
    folder: 'avatar-plus-hangdong',
    images: [
      '6798780e8ebf0-17645-1200-800.jpg',
      'benyaran-museum-1.jpg',
      'benyaran-museum-2.jpg',
      'benyaran-museum-4.jpg',
      'benyaran-waterfall.jpg',
      'elephant-show-scaled.jpg',
      'elephant-spa-scaled.jpg',
      'jeep.jpg',
      'ma-doo-bua-cafe-1-1.jpg',
      'the-hotspring-beach-resort-spa-1.jpeg',
      'the-hotspring-beach-resort-spa2.jpg',
      'the-hotspring-beach-resort-spa-cold-iced-pool.jpg',
      'wat-tha-sai-temple.jpg',
      'sunset-at-natai-beach.jpg'
    ]
  },
  'cheow-lan-lake': {
    folder: 'cheow-lan-lake',
    images: [
      'cheow-lan-main.jpg',
      'samet-nangshe-main.jpg'
    ]
  }
};

/**
 * Скачивает файл с GitHub
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(outputPath)) {
      console.log(`   ⏭️  Уже существует`);
      resolve();
      return;
    }

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
          console.log(`   ✅ Скачано (${sizeKB} KB)`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          const fileStream = fs.createWriteStream(outputPath);
          redirectResponse.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
            console.log(`   ✅ Скачано (${sizeKB} KB)`);
            resolve();
          });
        }).on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Скачивает все изображения для одного тура
 */
async function downloadTourImages(tourName, tourConfig) {
  console.log(`\n📦 ТУР: ${tourName}`);
  console.log(`   📁 Папка на GitHub: ${tourConfig.folder || 'корень assets'}`);
  console.log(`   🖼️  Изображений: ${tourConfig.images.length}`);
  console.log('   ' + '─'.repeat(50));

  const outputDir = path.join(__dirname, `../src/assets/${tourName}`);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`   ✅ Создана папка: ${outputDir}`);
  }

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const image of tourConfig.images) {
    const githubPath = tourConfig.folder ? `${tourConfig.folder}/${image}` : image;
    const url = GITHUB_RAW + githubPath;
    const outputPath = path.join(outputDir, image);

    try {
      console.log(`   📥 ${image}...`);
      
      if (fs.existsSync(outputPath)) {
        skipped++;
      } else {
        downloaded++;
      }
      
      await downloadImage(url, outputPath);
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error.message}`);
      errors++;
    }
  }

  console.log(`   📊 Итого: ✅ ${downloaded} новых | ⏭️  ${skipped} пропущено | ❌ ${errors} ошибок`);
}

/**
 * Основная функция
 */
async function downloadAllTours() {
  console.log('🚀 СКАЧИВАНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ТУРОВ ИЗ GITHUB');
  console.log('📂 Источник:', GITHUB_RAW);
  console.log('🎯 Туров:', Object.keys(TOURS).length);
  console.log('═'.repeat(60));

  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const [tourName, tourConfig] of Object.entries(TOURS)) {
    await downloadTourImages(tourName, tourConfig);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 ВСЕ ТУРЫ ОБРАБОТАНЫ!');
  console.log('═'.repeat(60));
  console.log('\n📋 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('   1. Проверь папки: ls -lh src/assets/*/');
  console.log('   2. Загрузи изображения в Shopify для каждого тура');
  console.log('   3. Проверь результат на сайте');
}

// Запуск
downloadAllTours().catch(console.error);
