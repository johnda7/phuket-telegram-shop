#!/usr/bin/env node

/**
 * 🚀 ЗАГРУЗКА ИЗОБРАЖЕНИЙ JAMES BOND В SHOPIFY
 * Использует простой REST API для загрузки изображений (работает на trial!)
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
const PRODUCT_ID = '7971956359222'; // James Bond Island Product ID

// James Bond Island images directory
const IMAGES_DIR = path.join(__dirname, '../src/assets/james-bond-island');

// Image files to upload (7 images)
const IMAGE_FILES = [
  'james-1.jpg',
  'james-2.jpg',
  'james-3.webp',
  'james-4.webp',
  'james-5.webp',
  'james-6.webp',
  'james-7.webp',
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

// Helper: delay between uploads
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function main() {
  console.log(`\n🚀 Starting upload of ${IMAGE_FILES.length} James Bond images to Shopify...\n`);
  console.log(`📦 Product ID: ${PRODUCT_ID}`);
  console.log(`🏪 Store: ${SHOP_URL}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < IMAGE_FILES.length; i++) {
    const filename = IMAGE_FILES[i];
    const imagePath = path.join(IMAGES_DIR, filename);

    try {
      console.log(`📤 [${i + 1}/${IMAGE_FILES.length}] Uploading: ${filename}...`);
      
      const result = await uploadImageToProduct(imagePath, filename);
      
      console.log(`✅ Uploaded: ${filename} (ID: ${result.id})`);
      
      successCount++;

      // Delay 2 seconds between uploads to avoid rate limiting
      if (i < IMAGE_FILES.length - 1) {
        console.log(`⏳ Waiting 2 seconds before next upload...\n`);
        await delay(2000);
      }
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successful: ${successCount}/${IMAGE_FILES.length}`);
  console.log(`❌ Failed: ${errorCount}/${IMAGE_FILES.length}`);
  
  if (successCount === IMAGE_FILES.length) {
    console.log(`\n🎉 All images uploaded successfully!`);
    console.log(`🔗 Check product: https://${SHOP_URL}/admin/products/${PRODUCT_ID}`);
  } else {
    console.log(`\n⚠️ Some uploads failed. Please check errors above.`);
  }
}

main().catch(console.error);
