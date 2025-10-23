#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOP_URL = 'phuket-telegram-shop-117ck.myshopify.com';
const ACCESS_TOKEN = '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';
const PRODUCT_ID = '7971955671094'; // 4 жемчужины Андаманского моря

// Images directory
const IMAGES_DIR = path.join(__dirname, '..', 'src', 'assets', 'pearls-andaman-sea');

// 8 images for 4 Pearls Andaman Sea tour
const IMAGE_FILES = [
  'pearls-1.jpg',
  'pearls-2.jpg',
  'pearls-3.jpg',
  'pearls-4.jpg',
  'pearls-5.jpg',
  'pearls-6.jpg',
  'pearls-7.jpg',
  'pearls-8.jpg'
];

// Upload single image via REST API
function uploadImage(base64Image, filename) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
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
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 201 || res.statusCode === 200) {
            resolve(response.image);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (error) {
          reject(new Error(`Parse error: ${error.message}, Response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main upload function
async function uploadAll() {
  console.log('📤 Starting upload to Shopify...\n');
  console.log(`Product ID: ${PRODUCT_ID}`);
  console.log(`Images to upload: ${IMAGE_FILES.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < IMAGE_FILES.length; i++) {
    const filename = IMAGE_FILES[i];
    const filePath = path.join(IMAGES_DIR, filename);
    
    try {
      console.log(`📤 [${i + 1}/${IMAGE_FILES.length}] Uploading: ${filename}...`);
      
      // Read file and convert to base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString('base64');
      
      // Upload to Shopify
      const result = await uploadImage(base64Image, filename);
      
      console.log(`✅ Uploaded: ${filename} (ID: ${result.id})`);
      successCount++;
      
      // Delay to avoid rate limiting (Shopify allows 2 requests per second)
      if (i < IMAGE_FILES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successful: ${successCount}/${IMAGE_FILES.length}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${IMAGE_FILES.length}`);
  }
  
  if (successCount === IMAGE_FILES.length) {
    console.log('\n🎉 All images uploaded successfully!');
  }
}

// Run upload
uploadAll().catch(console.error);
