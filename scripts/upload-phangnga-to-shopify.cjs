const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ACCESS_TOKEN = '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';
const PRODUCT_ID = '7971956850742';

const imagesDir = path.join(__dirname, '..', 'src', 'assets', 'phang-nga-skywalk');

const imageFiles = [
  'baby-elephant.jpg',
  'bamboo-rafting.jpg',
  'elephant-bathing.jpg',
  'sarasin-bridge.jpg',
  'temple-main.jpg',
  'waterfall.jpg',
  'zoo.jpg'
];

function uploadImage(filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);
    const imageBuffer = fs.readFileSync(filepath);
    const base64Image = imageBuffer.toString('base64');
    
    const postData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename
      }
    });
    
    const options = {
      hostname: SHOPIFY_STORE,
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
        if (res.statusCode === 200 || res.statusCode === 201) {
          const response = JSON.parse(data);
          resolve(response.image.id);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAll() {
  console.log('📤 Starting upload to Shopify...');
  console.log(`Product ID: ${PRODUCT_ID}`);
  console.log(`Images to upload: ${imageFiles.length}\n`);
  
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    console.log(`📤 [${i + 1}/${imageFiles.length}] Uploading: ${filename}...`);
    
    try {
      const imageId = await uploadImage(filename);
      console.log(`✅ Uploaded: ${filename} (ID: ${imageId})\n`);
      successful++;
      
      if (i < imageFiles.length - 1) {
        await delay(2000);
      }
    } catch (err) {
      console.error(`❌ Failed: ${filename} - ${err.message}\n`);
      failed++;
    }
  }
  
  console.log('📊 Upload Summary:');
  console.log(`✅ Successful: ${successful}/${imageFiles.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${imageFiles.length}`);
  }
  
  if (successful === imageFiles.length) {
    console.log('\n🎉 All images uploaded successfully!');
  }
}

uploadAll();
